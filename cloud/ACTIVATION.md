# Cloud activation checklist

The frontend cloud layer and server API contract are complete. Cloud remains disabled until a private production database, authentication provider and HTTPS API deployment are connected.

## Required production steps

1. Deploy the API over HTTPS.
2. Configure a real authentication provider that issues short-lived RS256 JWTs.
3. Configure:
   - `FITNESS_AUTH_ISSUER`
   - `FITNESS_AUTH_AUDIENCE`
   - `FITNESS_JWT_PUBLIC_KEY`
   - `FITNESS_DATABASE_URL`
   - optional `FITNESS_DATABASE_POOL_MAX`
   - optional `FITNESS_DATABASE_SSL`
4. Execute `cloud/production-schema.sql` against the private database.
5. The bundled `api/_lib/persistence.js` handles PostgreSQL snapshots, revisions, change history and optimistic conflict detection.
6. Enforce user isolation using the authenticated JWT `sub`.
7. Run authorization, expiry, conflict, restore and multi-device tests.
8. Only then enable the browser cloud configuration.

## Security

Never put database passwords, service-role keys, private API keys, JWT private keys or long-lived tokens in `index.html` or any public GitHub file.

The current GitHub Pages deployment therefore remains a secure local/offline application until the private production services above are connected.
