# Cloud activation checklist

The frontend cloud layer and server API contract are complete. Cloud remains disabled until a private production persistence adapter and authentication provider are supplied.

## Required production steps

1. Deploy the API over HTTPS.
2. Configure a real authentication provider that issues short-lived RS256 JWTs.
3. Configure:
   - `FITNESS_AUTH_ISSUER`
   - `FITNESS_AUTH_AUDIENCE`
   - `FITNESS_JWT_PUBLIC_KEY`
   - `FITNESS_DATABASE_URL`
4. Implement the private `globalThis.FITNESS_PERSISTENCE` adapter with:
   - `getSnapshot(userId)`
   - `putSnapshot(userId, snapshot)`
   - `appendChanges(userId, changes)`
5. Enforce user isolation using the authenticated JWT `sub`.
6. Apply the documented conflict policy and never silently delete records.
7. Add database backups, retention, monitoring and rate limiting.
8. Run authorization, expiry, conflict, restore and multi-device tests.
9. Only then enable the browser cloud configuration.

## Security

Never put database passwords, service-role keys, private API keys, JWT private keys or long-lived tokens in `index.html` or any public GitHub file.

The current GitHub Pages deployment therefore remains a secure local/offline application until the private production services above are connected.
