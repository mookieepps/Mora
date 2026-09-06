-- Mora database schema
-- Run this in the Supabase SQL editor for a new project.
-- Then run supabase/auth.sql for parent ownership and RLS policies.

create extension if not exists pgcrypto;

do $$ begin
  create type family_status as enum ('PREGNANCY', 'IN_LABOR', 'BABY_ARRIVED');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type update_type as enum ('NORMAL', 'LABOR', 'BIRTH');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type reaction_type as enum ('HEART', 'PRAYER', 'CELEBRATE');
exception when duplicate_object then null;
end $$;

create table if not exists families (
  id uuid primary key default gen_random_uuid(),
  expecting_parent_name text not null,
  partner_name text,
  due_date date not null,
  status family_status not null default 'PREGNANCY',
  family_slug text not null unique,
  owner_user_id uuid references auth.users (id) on delete cascade,
  manage_token_hash text,
  baby_name text,
  birth_time text,
  birth_weight_pounds numeric,
  birth_weight_ounces numeric,
  birth_length numeric,
  baby_photo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists families_manage_token_hash_idx
  on families (manage_token_hash);

create table if not exists recipients (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families (id) on delete cascade,
  name text not null,
  phone_number text not null,
  created_at timestamptz not null default now()
);

create index if not exists recipients_family_id_idx on recipients (family_id);

create table if not exists updates (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families (id) on delete cascade,
  message text not null,
  photo_url text,
  update_type update_type not null default 'NORMAL',
  created_at timestamptz not null default now()
);

create index if not exists updates_family_id_created_at_idx
  on updates (family_id, created_at desc);

create table if not exists reactions (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families (id) on delete cascade,
  update_id uuid not null references updates (id) on delete cascade,
  visitor_id text not null,
  reaction_type reaction_type not null,
  created_at timestamptz not null default now(),
  constraint reactions_update_visitor_unique unique (update_id, visitor_id)
);

create index if not exists reactions_family_id_idx on reactions (family_id);
create index if not exists reactions_update_id_idx on reactions (update_id);

create table if not exists weight_guesses (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families (id) on delete cascade,
  name text not null,
  pounds integer not null,
  ounces integer not null,
  created_at timestamptz not null default now()
);

create index if not exists weight_guesses_family_id_idx on weight_guesses (family_id);

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists families_set_updated_at on families;
create trigger families_set_updated_at
before update on families
for each row
execute procedure set_updated_at();

alter table families enable row level security;
alter table recipients enable row level security;
alter table updates enable row level security;
alter table reactions enable row level security;
alter table weight_guesses enable row level security;

comment on table families is
  'One pregnancy/family page. Birth details live here because a family has at most one birth announcement.';
comment on column families.family_slug is
  'Public family page path: /family/{family_slug}';
comment on column families.manage_token_hash is
  'Legacy parent cookie hash. New families use owner_user_id instead.';

-- Only comment owner_user_id if the column exists. CREATE TABLE IF NOT EXISTS
-- will not add this column to a families table created from an older schema.
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'families'
      and column_name = 'owner_user_id'
  ) then
    execute $c$comment on column families.owner_user_id is
      'Supabase Auth user who owns this family page.'$c$;
  end if;
end $$;
