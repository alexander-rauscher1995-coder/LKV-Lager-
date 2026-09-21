# Cloud activation checklist

The frontend cloud layer, Neon Auth integration and server API contract are implemented. Production activation requires the private Vercel/Neon configuration below.

## Production stack

- Neon PostgreSQL for private persistence
- Neon Auth for email/password authentication
- HTTPS Vercel API routes
- Short-lived RS256 JWTs verified through the Neon Auth JWKS endpoint

## Required Vercel environment variables

Set these as server-side Vercel environment variables:

- `FITNESS_DATABASE_URL`
- `FITNESS_AUTH_ISSUER`
- `FITNESS_AUTH_JWKS_URL`

Optional:

- `FITNESS_DATABASE_POOL_MAX`
- `FITNESS_DATABASE_SSL`

Legacy static-key verification is still supported for controlled deployments/tests through `FITNESS_JWT_PUBLIC_KEY` and optional `FITNESS_AUTH_AUDIENCE`.

## Neon setup

1. Execute `cloud/production-schema.sql` against the production database.
2. Configure Neon Auth for the production branch.
3. Add the final Vercel production origin to Neon Auth trusted origins.
4. Keep database credentials and private keys server-side only.

## Verification

1. `GET /api/health` must report `ready: true`.
2. Create a test account through the Fitness Coach login.
3. Sign in and confirm the authenticated user is shown.
4. Create or change fitness data.
5. Confirm the data is synchronized through `/api/v1/sync`.
6. Sign in on another device/browser and verify the same user's snapshot is restored.
7. Verify an account cannot access another account's snapshot.
8. Verify stale revisions return HTTP 409.
9. Check Vercel runtime logs for authentication/database errors.
10. Confirm database backups and retention are enabled.

## Security

Never put database passwords, service-role keys, JWT private keys or long-lived tokens in `index.html` or any public GitHub file.

The GitHub Pages deployment is intentionally not the production cloud backend. Production cloud access should run through the private HTTPS API.
