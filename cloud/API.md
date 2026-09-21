# Fitness Coach Cloud API

Status: production-ready API contract; cloud remains disabled in the public frontend until private infrastructure is connected.

## Base configuration

The browser uses a configured HTTPS API base URL. Never put database credentials, JWT private keys or service-role keys into the browser.

## Authentication

Each request uses a short-lived Bearer token with:
- RS256 signature
- `sub` — stable user identifier
- `iss` — configured issuer
- `aud` — configured audience
- `exp` — future expiry

## Endpoints

- GET `/v1/sync` — current authenticated user's snapshot and server revision.
- PUT `/v1/sync` — validated user snapshot.
- POST `/v1/sync/changes` — incremental changes.

## Snapshot contract

A snapshot contains:
- `schemaVersion: 1`
- `deviceId`
- `updatedAt`
- `data`
- optional `baseRevision`

The API rejects malformed snapshots and payloads larger than 1 MB.

## Conflict policy

The server uses optimistic concurrency:
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

The public GitHub Pages app does not activate cloud access until these private backend requirements are configured.
