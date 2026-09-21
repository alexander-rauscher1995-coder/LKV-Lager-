# Production infrastructure

The repository contains the production PostgreSQL schema, persistence adapter, Neon Auth browser bridge and authenticated sync API.

## Architecture

Browser -> Neon Auth -> short-lived RS256 JWT -> Vercel API -> Neon PostgreSQL

The browser only receives public configuration:

- Neon Auth base URL
- API base URL

Database credentials, JWT verification material and other server secrets stay in Vercel environment variables.

## Required production activation

1. Provision/verify the production Neon PostgreSQL database.
2. Execute `cloud/production-schema.sql`.
3. Provision/verify Neon Auth on the production branch.
4. Add the production Vercel origin to Neon Auth trusted origins.
5. Deploy the API under HTTPS.
6. Configure:
   - `FITNESS_DATABASE_URL`
   - `FITNESS_AUTH_ISSUER`
   - `FITNESS_AUTH_JWKS_URL`
   - optional `FITNESS_DATABASE_POOL_MAX`
   - optional `FITNESS_DATABASE_SSL`
7. The API uses the bundled PostgreSQL adapter when `FITNESS_DATABASE_URL` is present.
8. JWT user isolation is based on the authenticated `sub`.
9. Optimistic concurrency uses the snapshot revision and returns HTTP 409 for stale writes.
10. Enable backups, retention, monitoring and rate limiting.
11. Run authentication, isolation, restore, conflict and multi-device tests.

## Production health

`GET /api/health` reports whether database and Neon Auth JWKS configuration are present. A production deployment is ready only when the response reports `ready: true`.

## Security

Never commit database passwords, service-role keys, JWT private keys or long-lived access tokens.

