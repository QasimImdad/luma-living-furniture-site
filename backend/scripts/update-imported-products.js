import 'dotenv/config';
import mysql from 'mysql2/promise';

const categories = {
    BEDROOM: {
        skuPrefix: 'BED',
        name: 'bed',
        prices: [799, 899, 749, 1099, 649, 999, 849, 1199],
        ratings: [4.6, 4.4, 4.7, 4.8, 4.3, 4.5, 4.6, 4.8],
        stock: [8, 5, 12, 4, 15, 7, 9, 3],
        descriptions: [
            'Create a restful focal point in your bedroom with this bed, suited to a calm and comfortable sleep space.',
            'Bring a clean, welcoming look to your bedroom with this bed, ready to anchor your nighttime routine.',
            'Make room for a more restful routine with this bed, a simple centerpiece for a thoughtfully arranged bedroom.',
            'Give your bedroom a refreshed feel with this bed, designed to make the sleeping area the room’s natural focus.',
            'Settle into a more considered bedroom layout with this bed, a versatile choice for a comfortable home.',
            'Add a composed centerpiece to your bedroom with this bed, ideal for building a welcoming place to unwind.',
            'Make the most of your bedroom with this bed, a straightforward foundation for a restful personal retreat.',
            'Bring an inviting finishing touch to your bedroom with this bed, designed to suit a range of home styles.',
        ],
    },
    CHAIR: {
        skuPrefix: 'CHR',
        name: 'chair',
        prices: [149, 89, 229, 119, 179, 249, 99, 329, 199],
        ratings: [4.5, 4.3, 4.7, 4.2, 4.6, 4.8, 4.4, 4.9, 4.6],
        stock: [18, 24, 7, 16, 11, 5, 20, 4, 9],
        descriptions: [
            'Add a comfortable seat to a reading corner or living area with this chair, a flexible choice for everyday spaces.',
            'Give a desk or side table a useful companion with this chair, suited to a variety of home layouts.',
            'Make a welcoming spot for conversation with this chair, an easy addition to a shared living space.',
            'Complete a quiet corner with this chair, ready to provide a practical place to sit and relax.',
            'Bring extra seating to a dining or living area with this chair, a versatile option for daily use.',
            'Create a more useful work or study nook with this chair, designed for a range of indoor settings.',
            'Make guests feel at home with this chair, a simple way to add seating to your favorite room.',
            'Add a flexible seating option to your home with this chair, suited to everyday routines and changing spaces.',
            'Finish a comfortable room arrangement with this chair, a practical seat for work, conversation, or rest.',
        ],
    },
    DINING: {
        skuPrefix: 'DIN',
        name: 'dining table',
        prices: [699, 899, 1299, 799, 1499, 999, 1199, 849, 1699, 1099, 1399],
        ratings: [4.5, 4.6, 4.8, 4.3, 4.7, 4.4, 4.8, 4.5, 4.9, 4.6, 4.7],
        stock: [6, 4, 3, 8, 2, 5, 4, 7, 2, 6, 3],
        descriptions: [
            'Bring everyone together around this dining table, a welcoming centerpiece for everyday meals and conversation.',
            'Make mealtimes feel more inviting with this dining table, suited to shared breakfasts, dinners, and gatherings.',
            'Create a dedicated place to dine and connect with this dining table, a practical anchor for your eating area.',
            'Give your dining space a natural focal point with this table, ready for meals both casual and special.',
            'Set the scene for relaxed gatherings with this dining table, designed to bring people together at home.',
            'Make everyday dining more comfortable with this table, a central spot for food, conversation, and company.',
            'Create a warm setting for shared meals with this dining table, an adaptable addition to your home.',
            'Give your dining room a fresh foundation with this table, suited to both daily routines and entertaining.',
            'Gather around this dining table for meals and conversation, with a versatile presence in the home.',
            'Add a practical centerpiece to your eating area with this dining table, ready for everyday use.',
            'Make space for memorable meals with this dining table, a welcoming base for time spent together.',
        ],
    },
    LIVING: {
        skuPrefix: 'LIV',
        name: 'living room furniture piece',
        prices: [499, 899, 1299, 699, 999, 1599, 799, 1199, 1499],
        ratings: [4.4, 4.6, 4.8, 4.3, 4.7, 4.9, 4.5, 4.6, 4.8],
        stock: [9, 5, 3, 8, 6, 2, 7, 4, 3],
        descriptions: [
            'Refresh your living area with this versatile furniture piece, ready to complement a comfortable home setting.',
            'Give your living room a more considered layout with this furniture piece, suited to a range of everyday spaces.',
            'Bring a welcoming touch to your shared space with this living room furniture piece, made for home life.',
            'Create a more inviting living area with this adaptable furniture piece, a useful addition to your home.',
            'Add a finishing touch to your lounge with this furniture piece, suited to a relaxed and welcoming room.',
            'Make your living space feel more complete with this versatile piece, ready to fit into your home routine.',
            'Set a comfortable tone in your living area with this furniture piece, an adaptable choice for home.',
            'Bring a fresh perspective to your lounge with this furniture piece, suited to a variety of interiors.',
            'Build a more welcoming living room around this versatile furniture piece, designed for everyday home life.',
        ],
    },
    OFFICE: {
        skuPrefix: 'OFC',
        name: 'office furniture piece',
        prices: [349, 599, 249, 799, 499, 899, 399, 699],
        ratings: [4.5, 4.7, 4.3, 4.8, 4.6, 4.9, 4.4, 4.7],
        stock: [10, 5, 14, 3, 8, 2, 11, 4],
        descriptions: [
            'Make your work area feel more organized with this office furniture piece, suited to a focused home workspace.',
            'Create a more comfortable place to work with this practical addition to your office or study.',
            'Bring a considered touch to your workspace with this office furniture piece, ready for everyday routines.',
            'Set up a more welcoming work corner with this versatile office furniture addition.',
            'Give your home office a useful finishing touch with this piece, suited to a range of work areas.',
            'Make room for productive routines with this practical furniture piece for your office or study.',
            'Refresh your workspace with this adaptable office furniture piece, designed to fit into daily work life.',
            'Create a more functional-feeling work area with this considered addition to your office space.',
        ],
    },
    SOFA: {
        skuPrefix: 'SOF',
        name: 'sofa',
        prices: [899, 1199, 1599, 999, 1899, 1399, 2299, 1099],
        ratings: [4.6, 4.7, 4.8, 4.4, 4.9, 4.6, 4.8, 4.5],
        stock: [5, 4, 3, 6, 2, 4, 1, 7],
        descriptions: [
            'Settle into a welcoming living space with this sofa, a natural place to relax at the end of the day.',
            'Make room for comfortable moments with this sofa, suited to conversation, quiet evenings, and everyday living.',
            'Give your lounge an inviting centerpiece with this sofa, ready to bring people together at home.',
            'Create a relaxed place to unwind with this sofa, a versatile choice for your living area.',
            'Bring a comfortable finishing touch to your home with this sofa, suited to shared spaces and quiet time.',
            'Make your living room more welcoming with this sofa, designed to anchor a relaxed seating area.',
            'Set the tone for cozy evenings with this sofa, a practical centerpiece for your home lounge.',
            'Add a relaxed focal point to your living space with this sofa, ready for everyday downtime.',
        ],
    },
    TABLE: {
        skuPrefix: 'TBL',
        name: 'table',
        prices: [199, 299, 449, 349],
        ratings: [4.4, 4.6, 4.8, 4.5],
        stock: [12, 8, 4, 6],
        descriptions: [
            'Add a useful surface to your home with this versatile table, suited to everyday tasks and room layouts.',
            'Make a little more room for daily essentials with this table, an adaptable addition to your interior.',
            'Give your space a practical focal point with this table, ready to serve a range of everyday needs.',
            'Bring extra function to your home with this table, a flexible piece for a variety of rooms.',
        ],
    },
};

function getCategoryAndNumber(sku) {
    const match = /^(?:UPL-)?([A-Z]+)-(\d{3})$/.exec(sku);
    const category = match
        ? categories[match[1]]
            ?? Object.values(categories).find((entry) => entry.skuPrefix === match[1])
        : undefined;

    if (!match || !category) {
        throw new Error(`Unexpected imported product SKU: ${sku}`);
    }

    return { category, number: Number(match[2]) };
}

async function main() {
    const connection = await mysql.createConnection({
        host: process.env.DBHOST,
        user: process.env.DBUSER,
        password: process.env.DBPASSWORD,
        database: process.env.DBNAME,
    });

    try {
        await connection.execute(
            'ALTER TABLE products MODIFY rating DECIMAL(2, 1) NOT NULL',
        );
        await connection.beginTransaction();
        const [rows] = await connection.query(
            "SELECT id, sku FROM products WHERE image LIKE 'uploads/products/%' FOR UPDATE",
        );

        if (rows.length === 0) {
            throw new Error('No products with uploaded product images were found.');
        }

        const updates = rows.map((row) => {
            const { category, number } = getCategoryAndNumber(row.sku);
            const index = number - 1;

            if (
                !Number.isInteger(number)
                || index < 0
                || index >= category.prices.length
                || category.descriptions[index] === undefined
                || category.ratings[index] === undefined
                || category.stock[index] === undefined
            ) {
                throw new Error(`No sample data configured for SKU ${row.sku}`);
            }

            return {
                id: row.id,
                sku: `${category.skuPrefix}-${String(number).padStart(3, '0')}`,
                description: category.descriptions[index],
                price: category.prices[index],
                rating: category.ratings[index],
                stock: category.stock[index],
            };
        });

        const newSkus = new Set(updates.map((product) => product.sku));
        if (newSkus.size !== updates.length) {
            throw new Error('Generated product SKUs are not unique.');
        }

        for (const product of updates) {
            const [conflicts] = await connection.execute(
                'SELECT id FROM products WHERE sku = ? AND id <> ? LIMIT 1',
                [product.sku, product.id],
            );
            if (conflicts.length > 0) {
                throw new Error(`SKU ${product.sku} is already used by another product.`);
            }
        }

        for (const product of updates) {
            await connection.execute(
                'UPDATE products SET description = ?, sku = ?, price = ?, rating = ?, stock = ? WHERE id = ?',
                [
                    product.description,
                    product.sku,
                    product.price,
                    product.rating,
                    product.stock,
                    product.id,
                ],
            );
        }

        await connection.commit();
        console.log(`Updated ${updates.length} imported products with sample USD prices, ratings and stock.`);
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        await connection.end();
    }
}

main().catch((error) => {
    console.error('Product data update failed:', error.message);
    process.exitCode = 1;
});
