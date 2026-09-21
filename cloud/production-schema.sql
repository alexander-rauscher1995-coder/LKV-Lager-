-- Fitness Coach production persistence schema.
-- Execute this on the chosen private PostgreSQL-compatible database.
-- Never expose this database directly to the browser.

create table if not exists fitness_snapshots (
  user_id text primary key,
  revision bigint not null default 0,
  device_id text not null,
  updated_at timestamptz not null,
  snapshot jsonb not null,
  created_at timestamptz not null default now(),
  updated_server_at timestamptz not null default now()
);

create table if not exists fitness_changes (
  id bigserial primary key,
  user_id text not null,
  revision bigint not null,
  device_id text not null,
  changed_at timestamptz not null,
  changes jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists fitness_changes_user_revision_idx
  on fitness_changes(user_id, revision);

-- Application-level authorization must always scope queries by authenticated user_id.
-- Do not use device_id as the authorization boundary.


-- Recommended integrity checks for production migrations:
-- revision must be non-negative and change revisions must be positive.
alter table fitness_snapshots
  add constraint fitness_snapshots_revision_nonnegative check (revision >= 0);

alter table fitness_changes
  add constraint fitness_changes_revision_positive check (revision > 0);
