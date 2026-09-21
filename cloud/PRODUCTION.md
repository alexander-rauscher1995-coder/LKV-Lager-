# Production infrastructure

The web client and cloud API contract are complete. The repository now includes a production PostgreSQL-compatible schema in `cloud/production-schema.sql`.

## Required production activation

1. Provision a private PostgreSQL-compatible database.
2. Execute `cloud/production-schema.sql`.
3. Provision an authentication provider issuing short-lived RS256 JWTs.
4. Deploy the API under HTTPS.
5. Configure these server-only environment variables:
   - `FITNESS_DATABASE_URL`
   - `FITNESS_AUTH_ISSUER`
   - `FITNESS_AUTH_AUDIENCE`
   - `FITNESS_JWT_PUBLIC_KEY`
6. Provide the private `FITNESS_PERSISTENCE` adapter implementing:
   - `getSnapshot(userId)`
   - `putSnapshot(userId, snapshot)`
   - `appendChanges(userId, changes)`
7. Enforce user isolation using the authenticated JWT `sub`.
8. Apply the documented revision/conflict policy.
9. Enable backups, retention, monitoring and rate limiting.
10. Run account-isolation, expired-token, malformed-payload, conflict, restore and multi-device tests.
11. Only after those tests pass, enable the browser cloud configuration.

## Security

Never put database passwords, service-role keys, JWT private keys or long-lived access tokens in `index.html` or public GitHub files.

The GitHub Pages frontend remains safely disabled for cloud access until the private production infrastructure is configured.
