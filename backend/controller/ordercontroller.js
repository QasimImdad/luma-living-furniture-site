import db from '../db/db.js';

const pool = db.promise();

export const checkout = async (req, res) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [users] = await connection.execute(
            'SELECT id, address FROM users WHERE id = ? AND deleated_at IS NULL FOR UPDATE',
            [req.user.id],
        );
        if (users.length === 0) {
            await connection.rollback();
            return res.status(404).json({ status: false, message: 'User not found.' });
        }
        if (!users[0].address?.trim()) {
            await connection.rollback();
            return res.status(400).json({
                status: false,
                message: 'Add a delivery address to your account before checkout.',
            });
        }

        const [carts] = await connection.execute(
            'SELECT id FROM cart WHERE user_id = ? AND deleated_at IS NULL LIMIT 1 FOR UPDATE',
            [req.user.id],
        );
        if (carts.length === 0) {
            await connection.rollback();
            return res.status(400).json({ status: false, message: 'Your cart is empty.' });
        }

        const [items] = await connection.execute(
            `SELECT cartitems.id, cartitems.product_id, cartitems.quantity,
                    products.name, products.sku, products.price, products.stock
             FROM cartitems
             JOIN products ON products.id = cartitems.product_id
             WHERE cartitems.cart_id = ? AND cartitems.deleated_at IS NULL
               AND products.deleated_at IS NULL
             FOR UPDATE`,
            [carts[0].id],
        );
        if (items.length === 0) {
            await connection.rollback();
            return res.status(400).json({ status: false, message: 'Your cart is empty.' });
        }

        for (const item of items) {
            if (item.quantity > item.stock) {
                await connection.rollback();
                return res.status(409).json({
                    status: false,
                    message: `${item.name} has only ${item.stock} units available.`,
                });
            }
        }

        const total = items.reduce(
            (sum, item) => sum + Number(item.price) * Number(item.quantity),
            0,
        );
        const [orderResult] = await connection.execute(
            `INSERT INTO orders (user_id, status, total, shipping_address, created_at)
             VALUES (?, 'pending_payment', ?, ?, NOW())`,
            [req.user.id, total.toFixed(2), users[0].address],
        );

        for (const item of items) {
            await connection.execute(
                `INSERT INTO order_items
                    (order_id, product_id, product_name, sku, unit_price, quantity, created_at)
                 VALUES (?, ?, ?, ?, ?, ?, NOW())`,
                [
                    orderResult.insertId,
                    item.product_id,
                    item.name,
                    item.sku,
                    item.price,
                    item.quantity,
                ],
            );
            await connection.execute(
                'UPDATE products SET stock = stock - ?, updated_at = NOW() WHERE id = ?',
                [item.quantity, item.product_id],
            );
        }

        await connection.execute('DELETE FROM cartitems WHERE cart_id = ?', [carts[0].id]);
        await connection.execute(
            'UPDATE cart SET updated_at = NOW() WHERE id = ?',
            [carts[0].id],
        );
        await connection.commit();

        return res.status(201).json({
            status: true,
            message: 'Order placed and awaiting payment.',
            order: {
                id: orderResult.insertId,
                status: 'pending_payment',
                total: Number(total.toFixed(2)),
                currency: 'USD',
            },
        });
    } catch (error) {
        await connection.rollback();
        console.error('Checkout failed:', error.message);
        return res.status(500).json({ status: false, message: 'Unable to place your order.' });
    } finally {
        connection.release();
    }
};

export const getOrderById = async (req, res) => {
    const orderId = Number(req.params.id);
    if (!Number.isSafeInteger(orderId) || orderId < 1) {
        return res.status(400).json({ status: false, message: 'A valid order id is required.' });
    }

    try {
        const [orders] = await pool.execute(
            `SELECT id, status, total, shipping_address, created_at
             FROM orders WHERE id = ? AND user_id = ? LIMIT 1`,
            [orderId, req.user.id],
        );
        if (orders.length === 0) {
            return res.status(404).json({ status: false, message: 'Order not found.' });
        }

        const [items] = await pool.execute(
            `SELECT product_id, product_name, sku, unit_price, quantity
             FROM order_items WHERE order_id = ? ORDER BY id`,
            [orderId],
        );
        return res.json({ status: true, order: { ...orders[0], items, currency: 'USD' } });
    } catch (error) {
        console.error('Order lookup failed:', error.message);
        return res.status(500).json({ status: false, message: 'Unable to load the order.' });
    }
};
