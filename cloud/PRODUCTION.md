# Production infrastructure

The web client and cloud API contract are complete. The repository now includes a production PostgreSQL-compatible schema in `cloud/production-schema.sql` and a PostgreSQL persistence adapter in `api/_lib/persistence.js`.

## Required production activation

1. Provision a private PostgreSQL-compatible database.
2. Execute `cloud/production-schema.sql`.
3. Provision an authentication provider issuing short-lived RS256 JWTs.
4. Deploy the API under HTTPS.
5. Configure these server-only environment variables:
   - `FITNESS_DATABASE_URL`
   - `FITNESS_DATABASE_POOL_MAX` (optional)
   - `FITNESS_DATABASE_SSL` (optional; defaults to TLS)
   - `FITNESS_AUTH_ISSUER`
   - `FITNESS_AUTH_AUDIENCE`
   - `FITNESS_JWT_PUBLIC_KEY`
6. The API automatically uses the PostgreSQL adapter when `FITNESS_DATABASE_URL` is present. A private `globalThis.FITNESS_PERSISTENCE` adapter can still override it for another provider.
7. Enforce user isolation using the authenticated JWT `sub`.
8. Use the revision field for optimistic concurrency. A stale `baseRevision` returns HTTP 409 with conflict metadata.
9. Enable backups, retention, monitoring and rate limiting.
10. Run account-isolation, expired-token, malformed-payload, conflict, restore and multi-device tests.
11. Only after those tests pass, enable the browser cloud configuration.

## Security

Never put database passwords, service-role keys, JWT private keys or long-lived access tokens in `index.html` or public GitHub files.

The GitHub Pages frontend remains safely disabled for cloud access until the private production infrastructure is configured.
