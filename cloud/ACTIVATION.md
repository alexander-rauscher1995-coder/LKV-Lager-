# Cloud activation checklist

The frontend cloud layer is complete and intentionally disabled by default.

To make synchronization real, an administrator must provide:

1. A hosted HTTPS backend implementing cloud/API.md.
2. A real authentication provider.
3. A user database/storage layer.
4. Server-side authorization so users can access only their own records.
5. The API base URL in the deployment configuration.
6. A short-lived access-token function in cloud/config.example.js.
7. Server-side backups and monitoring.

After configuration, enable the client only in the deployment configuration.

Do not place database passwords, service-role keys, private API keys, or long-lived tokens in index.html or any public GitHub file.

The current GitHub Pages deployment remains a local/offline application until these external services are connected.
