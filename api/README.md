# Fitness Coach Cloud API

Production backend entry point for a Vercel-style deployment.

## Authentication

The sync API fails closed unless a valid **RS256 JWT** is supplied.

Required private environment variables:
- `FITNESS_DATABASE_URL`
- `FITNESS_DATABASE_POOL_MAX` (optional)
- `FITNESS_DATABASE_SSL` (optional; TLS is the default)
- `FITNESS_AUTH_ISSUER`
- `FITNESS_AUTH_AUDIENCE`
- `FITNESS_JWT_PUBLIC_KEY`

The JWT must contain:
- `sub` — stable authenticated user identifier
- `iss` — configured issuer
- `aud` — configured audience
- `exp` — future expiry timestamp

The API uses the authenticated `sub` as the user-isolation boundary.

## Persistence

When `FITNESS_DATABASE_URL` is configured, `api/_lib/persistence.js` uses PostgreSQL directly.

Run `cloud/production-schema.sql` once before first production use.

A private `globalThis.FITNESS_PERSISTENCE` adapter can override the bundled PostgreSQL adapter when another database provider is required.

## Sync

- GET `/v1/sync` — current authenticated user's snapshot and revision.
- PUT `/v1/sync` — validated snapshot; stale `baseRevision` returns HTTP 409.
- POST `/v1/sync/changes` — bounded incremental change batch; stale revisions return HTTP 409.

Never expose database credentials, JWT private keys, service-role keys or long-lived tokens to the browser.

See `cloud/PRODUCTION.md` and `cloud/ACTIVATION.md` for the activation checklist.
