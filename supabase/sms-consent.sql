-- SMS consent for recipients
-- Paste this into the Supabase SQL Editor.
-- Safe to rerun. Does not drop tables or delete existing recipients.
-- Existing recipients stay unconsented (sms_consent = false) until added again with the checkbox.

alter table recipients
  add column if not exists sms_consent boolean not null default false;

alter table recipients
  add column if not exists sms_consent_at timestamptz;

alter table recipients
  add column if not exists consent_method text;

comment on column recipients.sms_consent is
  'True only when the parent confirmed the recipient agreed to SMS.';
comment on column recipients.sms_consent_at is
  'When SMS consent was recorded.';
comment on column recipients.consent_method is
  'How consent was captured. New recipients use parent_confirmation.';
