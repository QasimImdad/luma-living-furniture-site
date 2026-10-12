import db from "../db/db.js";

export const getallproducts = (req, res) => {
    db.query('SELECT * FROM products WHERE deleated_at IS NULL', (err, result) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Unable to load products.',
            });
        }

        return res.json({
            status: true,
            message: 'All products',
            products: result,
        });
    });
};

export const getProductById = (req, res) => {
    const productId = Number(req.params.id);
    if (!Number.isSafeInteger(productId) || productId < 1) {
        return res.status(400).json({
            status: false,
            message: 'A valid product id is required.',
        });
    }

    db.query(
        'SELECT * FROM products WHERE id = ? AND deleated_at IS NULL LIMIT 1',
        [productId],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: 'Unable to load the product.',
                });
            }

            if (result.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Product not found.',
                });
            }

            return res.json({
                status: true,
                product: result[0],
            });
        },
    );
};
