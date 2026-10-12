import db from '../db/db.js';

const pool = db.promise();

function validPositiveInteger(value) {
    const number = Number(value);
    return Number.isSafeInteger(number) && number > 0 ? number : null;
}

async function findCartId(connection, userId) {
    const [carts] = await connection.execute(
        'SELECT id FROM cart WHERE user_id = ? AND deleated_at IS NULL LIMIT 1',
        [userId],
    );
    return carts[0]?.id ?? null;
}

export const addTocart = async (req, res) => {
    const userId = req.user.id;
    const productId = validPositiveInteger(req.body.product_id);
    const quantity = validPositiveInteger(req.body.quantity);

    if (!productId || !quantity) {
        return res.status(400).json({
            status: false,
            message: 'A valid product_id and positive quantity are required.',
        });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [users] = await connection.execute(
            'SELECT id FROM users WHERE id = ? AND deleated_at IS NULL FOR UPDATE',
            [userId],
        );
        if (users.length === 0) {
            await connection.rollback();
            return res.status(401).json({ status: false, message: 'Authenticated user not found.' });
        }

        const [products] = await connection.execute(
            'SELECT id, stock FROM products WHERE id = ? AND deleated_at IS NULL FOR UPDATE',
            [productId],
        );
        if (products.length === 0) {
            await connection.rollback();
            return res.status(404).json({ status: false, message: 'Product not found.' });
        }

        let cartId = await findCartId(connection, userId);
        if (!cartId) {
            const [cartResult] = await connection.execute(
                'INSERT INTO cart (user_id, created_at) VALUES (?, NOW())',
                [userId],
            );
            cartId = cartResult.insertId;
        }

        const [items] = await connection.execute(
            'SELECT id, quantity FROM cartitems WHERE cart_id = ? AND product_id = ? AND deleated_at IS NULL FOR UPDATE',
            [cartId, productId],
        );
        const newQuantity = quantity + (items[0]?.quantity ?? 0);

        if (newQuantity > products[0].stock) {
            await connection.rollback();
            return res.status(409).json({
                status: false,
                message: `Only ${products[0].stock} units are currently in stock.`,
            });
        }

        if (items.length > 0) {
            await connection.execute(
                'UPDATE cartitems SET quantity = ?, updated_at = NOW() WHERE id = ?',
                [newQuantity, items[0].id],
            );
        } else {
            await connection.execute(
                'INSERT INTO cartitems (quantity, product_id, cart_id, created_at) VALUES (?, ?, ?, NOW())',
                [quantity, productId, cartId],
            );
        }

        await connection.commit();
        return res.status(200).json({ status: true, message: 'Product added to cart.' });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Add-to-cart failed:', error.message);
        return res.status(500).json({ status: false, message: 'Unable to add the product to cart.' });
    } finally {
        connection?.release();
    }
};

export const viewcart = async (req, res) => {
    try {
        const [items] = await pool.execute(
            `SELECT cartitems.id, cartitems.quantity, cartitems.product_id,
                    products.name, products.image, products.price, products.description,
                    products.stock
             FROM cart
             JOIN cartitems ON cart.id = cartitems.cart_id
             JOIN products ON products.id = cartitems.product_id
             WHERE cart.user_id = ? AND cart.deleated_at IS NULL
               AND cartitems.deleated_at IS NULL AND products.deleated_at IS NULL`,
            [req.user.id],
        );
        return res.json({ status: true, message: 'Cart data', cart: items });
    } catch (error) {
        console.error('View-cart failed:', error.message);
        return res.status(500).json({ status: false, message: 'Unable to load the cart.' });
    }
};

export const updateCartItem = async (req, res) => {
    const itemId = validPositiveInteger(req.params.itemId);
    const quantity = validPositiveInteger(req.body.quantity);
    if (!itemId || !quantity) {
        return res.status(400).json({
            status: false,
            message: 'A valid cart item id and positive quantity are required.',
        });
    }

    try {
        const [items] = await pool.execute(
            `SELECT cartitems.id, products.stock
             FROM cartitems
             JOIN cart ON cart.id = cartitems.cart_id
             JOIN products ON products.id = cartitems.product_id
             WHERE cartitems.id = ? AND cart.user_id = ?
               AND cart.deleated_at IS NULL AND cartitems.deleated_at IS NULL
               AND products.deleated_at IS NULL`,
            [itemId, req.user.id],
        );

        if (items.length === 0) {
            return res.status(404).json({ status: false, message: 'Cart item not found.' });
        }
        if (quantity > items[0].stock) {
            return res.status(409).json({
                status: false,
                message: `Only ${items[0].stock} units are currently in stock.`,
            });
        }

        await pool.execute(
            'UPDATE cartitems SET quantity = ?, updated_at = NOW() WHERE id = ?',
            [quantity, itemId],
        );
        return res.json({ status: true, message: 'Cart quantity updated.' });
    } catch (error) {
        console.error('Cart-item update failed:', error.message);
        return res.status(500).json({ status: false, message: 'Unable to update cart quantity.' });
    }
};

export const removeCartItem = async (req, res) => {
    const itemId = validPositiveInteger(req.params.itemId);
    if (!itemId) {
        return res.status(400).json({ status: false, message: 'A valid cart item id is required.' });
    }

    try {
        const [result] = await pool.execute(
            `DELETE cartitems FROM cartitems
             JOIN cart ON cart.id = cartitems.cart_id
             WHERE cartitems.id = ? AND cart.user_id = ?
               AND cart.deleated_at IS NULL AND cartitems.deleated_at IS NULL`,
            [itemId, req.user.id],
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ status: false, message: 'Cart item not found.' });
        }

        return res.json({ status: true, message: 'Cart item removed.' });
    } catch (error) {
        console.error('Cart-item removal failed:', error.message);
        return res.status(500).json({ status: false, message: 'Unable to remove the cart item.' });
    }
};
