# Fitness Coach Cloud API

Production backend entry-point scaffold for a Vercel-style deployment.

## Authentication

The sync API now fails closed unless a valid **RS256 JWT** is supplied.

Required private environment variables:
- FITNESS_DATABASE_URL
- FITNESS_AUTH_ISSUER
- FITNESS_AUTH_AUDIENCE
- FITNESS_JWT_PUBLIC_KEY

The JWT must contain:
- `sub` — stable authenticated user identifier
- `iss` — configured issuer
- `aud` — configured audience
- `exp` — future expiry timestamp

The API uses the authenticated `sub` as the future user-isolation boundary. The current persistence adapter is still intentionally disabled until a real database implementation is connected.

Never expose these values to the browser. See cloud/API.md for the sync contract.
