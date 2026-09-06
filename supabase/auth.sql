-- Parent authentication migration
-- Safe to run against an existing Mora database created from schema.sql.
-- Does not drop tables or delete rows.
--
-- Important: ADD COLUMN and REFERENCES must be separate statements.
-- PostgreSQL can raise 42703 (column does not exist) if IF NOT EXISTS is
-- combined with a foreign-key REFERENCES clause in one ALTER TABLE.

alter table families
  add column if not exists owner_user_id uuid;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'families_owner_user_id_fkey'
  ) then
    alter table families
      add constraint families_owner_user_id_fkey
      foreign key (owner_user_id)
      references auth.users (id)
      on delete cascade;
  end if;
end $$;

alter table families
  alter column manage_token_hash drop not null;

create unique index if not exists families_owner_user_id_key
  on families (owner_user_id)
  where owner_user_id is not null;

create index if not exists families_owner_user_id_idx
  on families (owner_user_id);

comment on column families.owner_user_id is
  'Supabase Auth user who owns this family page.';

grant usage on schema public to authenticated;
grant select, insert, update on table families to authenticated;
grant select, insert, delete on table recipients to authenticated;
grant select, insert on table updates to authenticated;
grant select on table reactions to authenticated;
grant select on table weight_guesses to authenticated;

alter table families enable row level security;
alter table recipients enable row level security;
alter table updates enable row level security;
alter table reactions enable row level security;
alter table weight_guesses enable row level security;

drop policy if exists families_select_own on families;
create policy families_select_own on families
  for select to authenticated
  using (owner_user_id = auth.uid());

drop policy if exists families_insert_own on families;
create policy families_insert_own on families
  for insert to authenticated
  with check (owner_user_id = auth.uid());

drop policy if exists families_update_own on families;
create policy families_update_own on families
  for update to authenticated
  using (owner_user_id = auth.uid())
  with check (owner_user_id = auth.uid());

drop policy if exists recipients_select_own on recipients;
create policy recipients_select_own on recipients
  for select to authenticated
  using (family_id in (select id from families where owner_user_id = auth.uid()));

drop policy if exists recipients_insert_own on recipients;
create policy recipients_insert_own on recipients
  for insert to authenticated
  with check (family_id in (select id from families where owner_user_id = auth.uid()));

drop policy if exists recipients_delete_own on recipients;
create policy recipients_delete_own on recipients
  for delete to authenticated
  using (family_id in (select id from families where owner_user_id = auth.uid()));

drop policy if exists updates_select_own on updates;
create policy updates_select_own on updates
  for select to authenticated
  using (family_id in (select id from families where owner_user_id = auth.uid()));

drop policy if exists updates_insert_own on updates;
create policy updates_insert_own on updates
  for insert to authenticated
  with check (family_id in (select id from families where owner_user_id = auth.uid()));

drop policy if exists reactions_select_own on reactions;
create policy reactions_select_own on reactions
  for select to authenticated
  using (family_id in (select id from families where owner_user_id = auth.uid()));

drop policy if exists weight_guesses_select_own on weight_guesses;
create policy weight_guesses_select_own on weight_guesses
  for select to authenticated
  using (family_id in (select id from families where owner_user_id = auth.uid()));
