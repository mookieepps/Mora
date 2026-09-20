-- Recipient SMS opt-in tokens and consent audit fields
-- Paste this into the Supabase SQL Editor.
-- Safe to rerun. Does not drop tables.
--
-- This also clears parent-attestation consent. Recipients must opt in
-- themselves at /sms-opt-in/[token] before they can receive SMS.

alter table recipients
  add column if not exists invite_token text;

alter table recipients
  add column if not exists consent_phone text;

alter table recipients
  add column if not exists consent_ip text;

alter table recipients
  add column if not exists consent_user_agent text;

update recipients
set invite_token = encode(gen_random_bytes(32), 'hex')
where invite_token is null or invite_token = '';

create unique index if not exists recipients_invite_token_key
  on recipients (invite_token);

alter table recipients
  alter column invite_token set not null;

update recipients
set
  sms_consent = false,
  sms_consent_at = null,
  consent_method = null,
  consent_phone = null,
  consent_ip = null,
  consent_user_agent = null
where consent_method is distinct from 'recipient_web_form';

comment on column recipients.invite_token is
  'Unguessable public token for the recipient SMS opt-in page.';
comment on column recipients.consent_phone is
  'Phone number the recipient submitted on the opt-in form.';
comment on column recipients.consent_ip is
  'IP captured when the recipient submitted SMS opt-in.';
comment on column recipients.consent_user_agent is
  'User agent captured when the recipient submitted SMS opt-in.';
comment on column recipients.consent_method is
  'How SMS consent was captured. Recipient opt-in uses recipient_web_form.';
