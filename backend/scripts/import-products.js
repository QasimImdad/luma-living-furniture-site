import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';

const backendDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const productsDirectory = path.join(backendDirectory, 'uploads', 'products');
const categories = {
    bedroom: { name: 'Bedroom Bed', sku: 'BEDROOM' },
    chairs: { name: 'Chair', sku: 'CHAIR' },
    dinning_table: { name: 'Dining Table', sku: 'DINING' },
    living_room: { name: 'Living Room Furniture', sku: 'LIVING' },
    office_furniture: { name: 'Office Furniture', sku: 'OFFICE' },
    sofas: { name: 'Sofa', sku: 'SOFA' },
    tables: { name: 'Table', sku: 'TABLE' },
};

async function getProductsToImport() {
    const products = [];

    for (const [category, details] of Object.entries(categories)) {
        const categoryDirectory = path.join(productsDirectory, category);
        const files = (await fs.readdir(categoryDirectory, { withFileTypes: true }))
            .filter((entry) => entry.isFile() && /\.(jpe?g|png|webp|gif)$/i.test(entry.name))
            .map((entry) => entry.name)
            .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }));

        for (const fileName of files) {
            const imageNumber = fileName.match(/\((\d+)\)/)?.[1]
                ?? String(products.length + 1);

            products.push({
                name: `${details.name} ${imageNumber}`,
                description: `Auto-imported from ${category} images. Update the description, price, rating and stock before selling.`,
                sku: `UPL-${details.sku}-${imageNumber.padStart(3, '0')}`,
                image: `uploads/products/${category}/${fileName}`,
            });
        }
    }

    return products;
}

async function main() {
    const products = await getProductsToImport();
    if (products.length === 0) {
        throw new Error(`No product images found in ${productsDirectory}`);
    }

    const connection = await mysql.createConnection({
        host: process.env.DBHOST,
        user: process.env.DBUSER,
        password: process.env.DBPASSWORD,
        database: process.env.DBNAME,
    });

    let imported = 0;
    let skipped = 0;

    try {
        await connection.beginTransaction();

        for (const product of products) {
            const [result] = await connection.execute(
                `INSERT INTO products (name, description, sku, price, image, rating, stock, created_at)
                 SELECT ?, ?, ?, 0, ?, 0, 0, NOW()
                 WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = ? OR image = ?)`,
                [
                    product.name,
                    product.description,
                    product.sku,
                    product.image,
                    product.sku,
                    product.image,
                ],
            );

            if (result.affectedRows === 1) {
                imported += 1;
            } else {
                skipped += 1;
            }
        }

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        await connection.end();
    }

    console.log(`Imported ${imported} products; skipped ${skipped} already imported.`);
    console.log('New products have price 0, rating 0 and stock 0. Update those values before selling.');
}

main().catch((error) => {
    console.error('Product import failed:', error.message);
    process.exitCode = 1;
});
