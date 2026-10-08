# React + Vite

## API setup

The storefront reads products, carts, authentication, and orders from the Express API. Start the backend and configure the frontend API origin in a local `.env` file:

```dotenv
VITE_API_BASE_URL=http://localhost:3000
```

If omitted, the frontend uses `http://localhost:3000`. Restart Vite after changing the environment variable. Product image paths returned by the API are resolved against this same origin.

Create an account and log in before adding products to the server-side cart. Checkout is available at `/checkout` and collects contact and delivery details, then lets shoppers select bank account, PayPal, or cash on delivery. It submits these details and the selected `payment_method` with the order and creates an order with `pending_payment` status; payment processing is not configured in this storefront.

The home page builds a separate product collection for each category/subcategory returned by the API. For catalog rows without category fields, it uses the product SKU prefixes assigned by the backend importer (for example, `SOF`, `CHR`, `TBL`, and `BED`) to group the API products. Use the collection tiles to open its full product list.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.
You can also try [the experimental native React Compiler support in plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md#rust-react-compiler) by using `compiler: true` in the plugin options instead of using the Babel plugin.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
