# Local Produce Cooperative UI Prototype

This repository preserves the original React interface prototype for a local food cooperative. It explored member ordering and administration workflows before they were implemented with a backend in the current application. [Terra Sana](https://github.com/safouanfr-arch/terra-sana)

## Run the demo locally

```sh
npm ci
npm run dev
```

Open `http://localhost:5173`. Use `npm run build` to build the static frontend.

## What the prototype covers

| Area | Workflows |
| --- | --- |
| Guest | Membership request, invitation, sign-in and password reset screens |
| Member | Catalogue, product filtering, cart, pickup point and slot selection, order history and cancellation |
| Administration | Membership, products, stock, orders, promotions, pickup slots, preparation lists, CSV exports and email template previews |

The app seeds fictional orders and stores demo state in the browser. React, React Router and Vite provide the interface and build tooling. The earlier French README contains the detailed feature inventory and credentials for the simulated test accounts. [Original documentation](https://github.com/safouanfr-arch/DEMO-E-COMMERCE/blob/6860335c500bf5dbc0bf7e4d3ed4ff0e66e45784/README.md)

The demonstration uses local browser storage. Authentication, email and payments are simulated. Use Terra Sana to review the later Spring Boot API, security controls and automated tests.
