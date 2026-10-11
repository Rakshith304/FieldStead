# Fieldstead | Farm Equipment Exchange

React (Vite) frontend and Spring Boot 3.3 REST API backed by MySQL. Java 17, Maven, and Flyway SQL migrations. Browse equipment, review its uses, request rental dates, and track approvals and returns.

## Local Development

Prerequisites: JDK 17 or later, Node.js 22 or later, Maven 3.9+, and MySQL 8. The local profile defaults to `root` / `root`; override these with `DB_USERNAME` and `DB_PASSWORD` environment variables when needed.

1. Start MySQL and make sure the `farm_db` database can be created by the configured user.
2. From `backend`, run `mvn spring-boot:run`. Flyway creates/upgrades the schema and inserts the equipment catalog. Local demo users are added when the users table is empty.
3. From `frontend`, run `npm ci` once, then `npm run dev`.
4. Open http://localhost:5173. The backend runs at http://localhost:8080.

Local demo accounts:

| Role | Email | Password |
|---|---|---|
| Admin | admin@gmail.com | admin123 |
| Farmer | sita@gmail.com | farmer123 |

These intentionally weak demo credentials and the local JWT signing key are for development only. Do not use them in a deployment.

## Catalog And Rentals

The equipment list is server-paginated at 20 items per page and supports name/category filters. Open a listing for its description, intended uses, rate, unit count, rental-date estimate, and safety guidance. Rental days are inclusive; the agreed rate is frozen when requested. Overlapping pending/approved requests cannot exceed inventory.

Flyway SQL is under `backend/src/main/resources/db/migration`. It creates/upgrades the relational schema, adds equipment detail columns, seeds 24 additional listings, restores four starter listings when absent, and upgrades the tractor photo. Fresh and upgraded databases contain 28 equipment records.

## Deployment With Docker

Docker Engine and the Compose plugin are required.

1. Copy `.env.example` to `.env` and replace every password and the JWT secret. Use a randomly generated `JWT_SECRET` of at least 32 bytes. Keep `.env` out of source control.
2. Set `CORS_ALLOWED_ORIGINS` to the exact public frontend origin and `VITE_API_URL` to the public API base URL ending in `/api`.
3. Run `docker compose up --build -d`. The app is served at http://localhost:8081, the API at http://localhost:8080, and MySQL data persists in the `farm-data` volume.
4. Create an account, then promote the first administrator directly in MySQL: `UPDATE users SET role = 'ADMIN' WHERE email = 'your-admin@example.com';`. Production disables demo account creation. Back up the database volume and terminate TLS at a trusted reverse proxy before public exposure.

The production profile requires database credentials, JWT signing secret, and allowed CORS origins from the environment. JPA validates rather than mutates the production schema; Flyway applies versioned migrations. The frontend container uses unprivileged Nginx with SPA fallback and basic security headers.

## Checkout And Contact Details

Approved rentals can be paid in INR through Razorpay Checkout. Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` on the backend only; never expose the secret to the frontend or commit live keys. Configure Razorpay to capture payments automatically. The API verifies the checkout signature and confirms the captured payment, order, currency, and amount before marking a rental paid. Without gateway keys, checkout reports that online payments are not configured; rental requests and approvals still work. Use Razorpay test keys while validating the integration.

The contact email, phone, and Bengaluru map link in the interface are explicitly marked demo details. Replace them with verified business contact information before launch.

## Security And API

Login returns a signed, one-hour bearer token. Protected APIs derive the caller identity from that token; `X-User-Id` is not trusted. Passwords use BCrypt. Registration requires 12-72 characters. Equipment and rental mutations are validated and role-checked by the API; UI route guards are an additional usability layer, not the authorization boundary.

- `POST /api/users/register`, `POST /api/users/login`
- `GET /api/equipment?page=0&size=20&search=&category=`, `GET /api/equipment/{id}`
- Admin: `POST /api/equipment`, `PUT /api/equipment/{id}`, `DELETE /api/equipment/{id}` (archive)
- Authenticated: `POST /api/rentals`, `GET /api/rentals/my`
- Approved rental payments: `POST /api/payments/rentals/{id}/order`, `POST /api/payments/rentals/{id}/verify`
- Admin: `GET /api/rentals`
- Authenticated status transitions: `PATCH /api/rentals/{id}/cancel|approve|reject|return` (role/state rules enforced)

Use `Authorization: Bearer <token>` for protected endpoints. `VITE_API_URL` selects the frontend API base URL.

## Verification

Backend: `mvn package` from `backend`. Frontend: `npm ci` and `npm run build` from `frontend`. The repository currently has no automated test suite.
