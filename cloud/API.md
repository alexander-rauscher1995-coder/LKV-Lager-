# Fitness Coach Cloud API

Status: backend-ready contract. Cloud sync stays disabled until a real backend endpoint and authentication provider are configured.

Base URL: FITNESS_CLOUD_API_URL
Authentication: short-lived Bearer token. Never store admin/service-role keys in the web app.

Data model: profile, trainingSessions, customPlans, nutrition, cardio, bodyChecks, coachWay, syncMeta.
Every mutable record should contain id, updatedAt, deviceId and version.

Endpoints:
- GET /v1/sync — current user snapshot and server revision.
- PUT /v1/sync — validated user snapshot.
- POST /v1/sync/changes — incremental changes.

Conflict policy: authenticate user; validate records; compare updatedAt/version; newer valid records win; never silently delete data; return resulting revision and conflicts.

Backend protections required: authentication, per-user isolation, schema validation, rate limiting, HTTPS, request-size limits, audit timestamps, and no frontend secrets.

The GitHub Pages app does not provide these backend guarantees by itself.