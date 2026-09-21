# Cloud Layer

Implemented:
- backend-neutral API contract
- authentication-token boundary
- per-device identifier
- local offline sync queue
- snapshot upload/pull methods
- queue flush
- no secrets embedded in the app

Not activated:
A real cloud account/backend is still required. GitHub Pages alone cannot provide authenticated per-user storage.

Activation requires configuring FITNESS_CLOUD_CONFIG with a real HTTPS API and authentication provider, then connecting the adapter to the existing app state/backup layer.

Never put database admin keys or private credentials into index.html.