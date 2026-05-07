create extension if not exists pgcrypto;

create table if not exists scan_runs (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  normalized_url text not null,
  normalized_domain text not null,
  scan_type text not null default 'free',
  status text not null default 'queued' check (status in ('queued', 'running', 'completed', 'failed', 'cost_capped', 'blocked')),
  current_stage text check (current_stage is null or current_stage in ('queued', 'validating_url', 'crawling_site', 'checking_operator_surfaces', 'extracting_structured_data', 'mapping_action_paths', 'running_operator_preview', 'calculating_score', 'completed', 'failed')),
  score_min integer,
  score_max integer,
  score_final integer,
  score_band text,
  confidence text,
  cost_estimate_eur numeric(10,4),
  error_message text,
  requested_ip_hash text,
  user_agent text,
  created_at timestamptz default now(),
  started_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz default now()
);

create table if not exists scan_results (
  id uuid primary key default gen_random_uuid(),
  scan_run_id uuid references scan_runs(id) on delete cascade,
  result_json jsonb not null,
  layer_scores_json jsonb,
  top_issues_json jsonb,
  evidence_json jsonb,
  created_at timestamptz default now()
);

create table if not exists scan_events (
  id uuid primary key default gen_random_uuid(),
  scan_run_id uuid references scan_runs(id) on delete cascade,
  event_type text not null,
  stage text,
  message text,
  metadata_json jsonb,
  created_at timestamptz default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  scan_run_id uuid references scan_runs(id) on delete set null,
  email text,
  company text,
  website_url text,
  source text default 'free_scan',
  created_at timestamptz default now()
);

create index if not exists scan_runs_status_created_idx on scan_runs (status, created_at);
create index if not exists scan_runs_domain_created_idx on scan_runs (normalized_domain, created_at desc);
create index if not exists scan_results_scan_run_idx on scan_results (scan_run_id);
create index if not exists scan_events_scan_run_created_idx on scan_events (scan_run_id, created_at);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists scan_runs_set_updated_at on scan_runs;
create trigger scan_runs_set_updated_at
before update on scan_runs
for each row execute function set_updated_at();
