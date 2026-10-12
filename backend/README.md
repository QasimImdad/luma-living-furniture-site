# Luma Living Backend

## Requirements

- Node.js 20 or newer
- XAMPP with MySQL/MariaDB

## Create the local database

The sanitized seed file is [`luma-living-database.sql`](luma-living-database.sql). It was exported from the live `my_first_database` schema. It creates a separate `luma_living` database, recreates the six backend tables, and includes 56 active product records. It contains no user, cart, or order records and no credentials. Import into a fresh local MySQL server; the SQL intentionally does not drop or overwrite an existing database.

1. Start **MySQL** in the XAMPP Control Panel.
2. Open `http://localhost/phpmyadmin`.
3. Choose **Import**, select `luma-living-database.sql`, and run the import. The script creates and selects the `luma_living` database.
4. Confirm that the `luma_living` database contains `users`, `products`, `cart`, `cartitems`, `orders`, and `order_items`.

The seed preserves live product names, descriptions, SKUs, prices, image paths, ratings, stock, and timestamps. Product categories are represented by the `uploads/products/<category>/...` image paths; the live schema has no category or material columns. Material details are only present where included in product descriptions. Product images are in `uploads/` and must be available at those paths for catalog images to load. The API allows cross-origin embedding for `/uploads` only; without that resource policy override, Helmet's default same-origin policy blocks images loaded by the separate frontend origin.

The export adds foreign keys for the relationships used by backend queries. The live database had no foreign-key constraints, and it contained orphaned user/cart references; user-linked records are omitted from the seed, so the constraints can be enabled without carrying those records forward.

## Configure and run

Copy `.env.example` to `.env` in this backend directory and set your local XAMPP values. The example contains no credentials and `.env` is ignored by Git. A typical default XAMPP installation uses `root` with an empty password:

```dotenv
PORT=3000
DBHOST=localhost
DBUSER=root
DBPASSWORD=
DBNAME=luma_living
JWT_SECRET=
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

Generate a secret locally with `node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"`, then set `JWT_SECRET` to that value. The backend refuses to start with a missing or short secret. Never reuse secrets across environments. If your MySQL host, username, or password differs, set those values to match your local XAMPP configuration. Set `CORS_ORIGINS` to the exact comma-separated frontend origins used by your deployment.

From this directory, install dependencies and start the server:

```sh
npm ci
npm start
```

The API listens on the configured `PORT` (3000 by default).

New account passwords must be at least 12 characters and are stored as bcrypt hashes. Login accepts bcrypt hashes only. If reconnecting a database that contains legacy plaintext passwords, back it up first and run `npm run migrate:legacy-passwords` against that database before deploying this version. The migration updates only `users.password`, processes rows in restartable batches, and leaves already-hashed passwords unchanged. It is not run by the application, and this project has not modified any existing database. Passwords longer than bcrypt's 72-byte limit require a password reset instead of automatic migration. The sanitized seed contains no account or order records.

The profile update route requires a JWT and updates only the authenticated account, regardless of the ID in the URL.

## Security and data handling

- Keep `.env` local; never commit credentials or real database exports.
- Use the sanitized `luma-living-database.sql` for demos. It contains product rows only and creates a separate `luma_living` database without dropping an existing one.
- Before applying any password migration, take a verified backup and confirm `DBNAME` points to the intended database. The migration changes password hashes in that database.
- Use a least-privilege MySQL account and a unique production `JWT_SECRET` of at least 32 bytes.
- Payment options in the storefront do not process payments; orders are recorded as awaiting payment.

Before deployment, use a dedicated least-privilege MySQL account instead of XAMPP's default root account, serve the API over HTTPS, and configure only the production frontend origin in `CORS_ORIGINS`.

## Database schema

All tables use InnoDB and `utf8mb4`. The column names and types below match the live database; the existing `deleated_at` spelling is retained for application compatibility.

| Table | Columns and types | Constraints and relationships |
| --- | --- | --- |
| `users` | `id INT` auto-increment; `name VARCHAR(60)`; `phone VARCHAR(13)`; `email VARCHAR(140)`; `gender VARCHAR(11)`; `address TEXT`; `password VARCHAR(60)`; `created_at DATETIME`; `updated_at DATETIME NULL`; `deleated_at DATETIME NULL` | Primary key `id`; unique key `email`. Seeded empty to avoid personal data and passwords. |
| `products` | `id INT` auto-increment; `name VARCHAR(90)`; `description TEXT`; `sku VARCHAR(40)`; `price DECIMAL(10,0)`; `image TEXT`; `rating DECIMAL(2,1)`; `stock INT`; `created_at DATETIME`; `updated_at DATETIME NULL`; `deleated_at DATETIME NULL` | Primary key `id`. |
| `cart` | `id INT` auto-increment; `user_id INT`; `created_at DATETIME`; `updated_at DATETIME NULL`; `deleated_at DATETIME NULL` | Primary key `id`; export foreign key `user_id` references `users.id`. |
| `cartitems` | `id INT` auto-increment; `product_id INT`; `cart_id INT`; `quantity INT`; `created_at DATETIME`; `updated_at DATETIME NULL`; `deleated_at DATETIME NULL` | Primary key `id`; export foreign keys `cart_id` to `cart.id` and `product_id` to `products.id`. |
| `orders` | `id INT` auto-increment; `user_id INT`; `status VARCHAR(30)`; `total DECIMAL(10,2)`; `shipping_address TEXT`; `created_at DATETIME`; `updated_at DATETIME NULL` | Primary key `id`; index on (`user_id`, `created_at`); export foreign key `user_id` references `users.id`. |
| `order_items` | `id INT` auto-increment; `order_id INT`; `product_id INT`; `product_name VARCHAR(90)`; `sku VARCHAR(40)`; `unit_price DECIMAL(10,2)`; `quantity INT`; `created_at DATETIME` | Primary key `id`; index on `order_id`; export foreign keys `order_id` to `orders.id` and `product_id` to `products.id`. |

All columns except `updated_at` and `deleated_at` are `NOT NULL`; integer primary keys are auto-incrementing. The live schema has the listed primary/unique/index keys but no foreign-key constraints; the export adds the documented foreign keys based on relationships used in backend queries. `users.password` remains a required schema column for registration, but the seed does not insert any user rows.