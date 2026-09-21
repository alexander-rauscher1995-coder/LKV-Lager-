# Production infrastructure

The web client and cloud contract are complete. Real cloud activation still requires a private database, authentication provider, HTTPS API deployment, and private server credentials.

Activation:
1. Provision a private production database.
2. Provision authentication.
3. Deploy the API under HTTPS.
4. Configure the required environment variables privately.
5. Implement GET /v1/sync, PUT /v1/sync and POST /v1/sync/changes according to API.md.
6. Enable browser cloud configuration only after authorization tests pass.
7. Enable database backups and retention.
8. Test account isolation, token expiry, conflicts and restore.

Never put database passwords, service-role keys or private signing keys in index.html or public GitHub files.
