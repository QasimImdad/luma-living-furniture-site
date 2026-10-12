# Luma Living

Luma Living is a full-stack furniture storefront built with React and Express. It serves a MySQL-backed catalog with local product photography, product search and collections, customer accounts, a protected shopping cart, and order placement.

## Features

- Browse and search furniture collections, filter by stock, and sort products.
- View product details and locally hosted catalog images.
- Register, log in, and update a customer profile.
- Manage an authenticated server-side cart and place orders.
- Review order details and status.
- Use a sanitized MySQL seed containing 56 product records and no customer or transaction data.

Checkout records orders as `pending_payment`. Bank transfer, PayPal, and cash-on-delivery are storefront choices only; no payment gateway or payment processing is implemented.

## Technology

- Frontend: React 19, React Router, Vite 8, and Lucide icons.
- Backend: Node.js ES modules, Express 5, and MySQL 8/MariaDB via `mysql2`.
- Authentication: JSON Web Tokens and bcryptjs password hashes.
- Product image variants: Sharp.
- Local database setup: XAMPP with MySQL/MariaDB and phpMyAdmin.

## Project structure

```text
.
├── backend/
│   ├── controller/          # Authentication, catalog, cart, and order handlers
│   ├── db/                  # MySQL connection pool
│   ├── lib/                 # Shared password helpers
│   ├── middleware/          # JWT and authentication rate limiting
│   ├── routes/              # Express API routes
│   ├── scripts/             # Explicit database import/migration utilities
│   ├── tests/               # Node test-runner tests
│   ├── uploads/products/    # Product image assets served by the API
│   ├── .env.example         # Backend configuration template
│   └── luma-living-database.sql # Sanitized demo schema and product seed
├── src/
│   ├── components/          # Shared storefront components
│   ├── context/             # Authentication, product, and cart state
│   ├── lib/                 # API and product-collection helpers
│   └── pages/               # Storefront routes and views
├── .env.example             # Frontend API origin
├── package.json
└── vite.config.js
```

## Prerequisites

- Node.js 20.19+ (or 22.12+) and npm.
- XAMPP or another local MySQL/MariaDB server.
- MySQL/MariaDB client access to import the demo seed.

## Local setup

Clone the repository and install the frontend dependencies:

```powershell
cd "luma-living-furniture-site"
npm ci
```

The frontend reads `VITE_API_BASE_URL` from a root `.env` file. Copy the checked-in example if you need to change the default API origin:

```powershell
Copy-Item .env.example .env
```

The default is `http://localhost:3000`. Restart Vite after changing this value.

### Set up MySQL/XAMPP

1. Start MySQL in the XAMPP Control Panel.
2. Open `http://localhost/phpmyadmin`.
3. Import `backend/luma-living-database.sql` into a fresh local server. It creates a separate `luma_living` database and does not drop an existing database.
4. Confirm that `users`, `products`, `cart`, `cartitems`, `orders`, and `order_items` exist in `luma_living`.

The demo seed contains 56 product rows and no users, carts, or orders. It preserves product names, descriptions, SKUs, prices, image paths, ratings, stock, and timestamps. It does not represent or overwrite the records in your original database. Do not import it into an existing production or personal database.

### Configure and start the backend

In a second terminal:

```powershell
cd "luma-living-furniture-site\backend"
npm ci
Copy-Item .env.example .env
```

Set the values in `backend/.env` for your local MySQL server. The available settings are:

| Variable | Purpose |
| --- | --- |
| `PORT` | API port; defaults to `3000`. |
| `DBHOST` | MySQL host, typically `localhost`. |
| `DBUSER` | MySQL account; a local XAMPP default may be `root`. Use a least-privilege account outside local development. |
| `DBPASSWORD` | Password for that MySQL account; it may be empty for a default local XAMPP install. |
| `DBNAME` | Database name; the demo seed creates `luma_living`. |
| `JWT_SECRET` | Unique secret of at least 32 bytes. |
| `CORS_ORIGINS` | Comma-separated exact frontend origins; local defaults are `http://localhost:5173,http://127.0.0.1:5173`. |

Generate a local JWT secret without placing it in source control:

```powershell
node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"
```

Put the generated value in `JWT_SECRET` in `backend/.env`. Never publish `.env` files or use a development secret in production. For a different frontend host, set `CORS_ORIGINS` to its exact origin.

Start the API from the `backend` directory:

```powershell
npm start
```

The server checks the database connection before listening. Product API routes are under `/api/v1/products`; product images are served from `/uploads/...`.

### Start the frontend

In another terminal, from the repository root:

```powershell
npm run dev
```

Open the Vite URL printed in the terminal (normally `http://localhost:5173`). To create and inspect a production frontend build, run `npm run build` and `npm run preview` from the repository root.

## Database and product images

Products use the existing `products` columns, including `name`, `description`, `sku`, `price`, `image`, `rating`, and `stock`; the live schema has no category or material columns. Collections are inferred from SKU prefixes and image paths. Image values are relative paths such as `uploads/products/bedroom/bed (1).jpg`. Keep the product image assets in `backend/uploads/products/` and preserve those relative paths when reconnecting a database or deploying the API. The frontend resolves relative paths against `VITE_API_BASE_URL`; image files are not loaded from the frontend's own origin.

The sanitized seed's 56 distinct image references all have matching files in the supplied backend image tree. Image variants are generated from those local originals when requested; they are cached under the operating system's temporary directory and are not database records or repository files.

The API sets `Cross-Origin-Resource-Policy: cross-origin` on `/uploads` image responses so the browser can display them from the separate Vite/API origins. Other API responses keep Helmet's default policy, and API CORS remains restricted to `CORS_ORIGINS`.

The live schema's existing `deleated_at` column spelling is retained for application compatibility. The demo export includes foreign keys for the relationships used by the backend; the original live schema did not have these constraints. See [`backend/README.md`](backend/README.md) for the complete table layout and backend-specific notes.

If reconnecting an existing database that still contains legacy plaintext account passwords, take a verified backup and run `npm run migrate:legacy-passwords` from `backend/` before deploying this version. The migration is explicit, is not run at startup, and changes only `users.password` values to bcrypt hashes. Do not run it against an unintended database. Passwords longer than bcrypt's 72-byte limit need a password reset.

## Tests and checks

Run the backend tests from `backend/`:

```powershell
npm test
```

Run the frontend lint and production build from the repository root:

```powershell
npm run lint
npm run build
```

## Known limitations

- No payment processor is integrated; checkout creates orders awaiting payment.
- The demo seed has no customer, cart, or order records. Create a local account to exercise those flows.
- A product image must be included under `backend/uploads/` and referenced by its relative `image` path in MySQL.
- Production hosting, HTTPS termination, email delivery, and payment processing are not configured by this repository.

## Author

- Project: [Luma Living Furniture Site](https://github.com/QasimImdad/luma-living-furniture-site)
- GitHub: [@QasimImdad](https://github.com/QasimImdad)
- LinkedIn: [Muhammad Qasim](https://www.linkedin.com/in/muhammad-qasim-36a902386/)
