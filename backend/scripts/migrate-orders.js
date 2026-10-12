import 'dotenv/config';
import mysql from 'mysql2/promise';

async function main() {
    const connection = await mysql.createConnection({
        host: process.env.DBHOST,
        user: process.env.DBUSER,
        password: process.env.DBPASSWORD,
        database: process.env.DBNAME,
    });

    try {
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS orders (
                id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                status VARCHAR(30) NOT NULL,
                total DECIMAL(10, 2) NOT NULL,
                shipping_address TEXT NOT NULL,
                created_at DATETIME NOT NULL,
                updated_at DATETIME NULL,
                INDEX idx_orders_user_created (user_id, created_at)
            ) ENGINE=InnoDB
        `);

        await connection.execute(`
            CREATE TABLE IF NOT EXISTS order_items (
                id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                order_id INT NOT NULL,
                product_id INT NOT NULL,
                product_name VARCHAR(90) NOT NULL,
                sku VARCHAR(40) NOT NULL,
                unit_price DECIMAL(10, 2) NOT NULL,
                quantity INT NOT NULL,
                created_at DATETIME NOT NULL,
                INDEX idx_order_items_order (order_id)
            ) ENGINE=InnoDB
        `);

        console.log('Order tables are ready.');
    } finally {
        await connection.end();
    }
}

main().catch((error) => {
    console.error('Order-table migration failed:', error.message);
    process.exitCode = 1;
});
