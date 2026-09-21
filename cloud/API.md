# Fitness Coach Cloud API

Status: production API contract implemented; final activation depends on Vercel environment configuration and production verification.

## Base configuration

The browser uses the public runtime API base URL. Production authentication is handled by Neon Auth and the API verifies the resulting RS256 JWT through the configured JWKS endpoint.

## Authentication

Requests use a short-lived Bearer token with:

- RS256 signature
- `sub` — stable user identifier
- `iss` — configured issuer
- `aud` — optional configured audience
- `exp` — future expiry

Server configuration:

- `FITNESS_AUTH_ISSUER`
- `FITNESS_AUTH_JWKS_URL`
- optional `FITNESS_AUTH_AUDIENCE`
- optional legacy `FITNESS_JWT_PUBLIC_KEY`

## Endpoints

- GET `/v1/sync` — current authenticated user's snapshot and server revision.
- PUT `/v1/sync` — validated user snapshot.
- POST `/v1/sync/changes` — bounded incremental changes.

## Snapshot contract

A snapshot contains:

- `schemaVersion: 1`
- `deviceId`
- `updatedAt`
- `data`
- optional `baseRevision`

The API rejects malformed snapshots and payloads larger than 1 MB.

## Conflict policy

1. Client sends its last known `baseRevision`.
2. Server locks the authenticated user's revision.
3. Matching revisions create the next revision.
4. A stale revision returns HTTP 409 with conflict metadata.
5. User isolation is based on JWT `sub`, never `deviceId`.

## Offline behavior

The web client stores at most the newest pending snapshot per device. When the network returns, it retries the queued snapshot and updates its local revision from the server response.

## Production protections

Required:

- HTTPS
- authenticated requests
- per-user isolation
- PostgreSQL backups and retention
- rate limiting
- request-size limits
- monitoring
- audit timestamps
- no frontend secrets

