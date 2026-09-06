-- Mora family photos
-- Run this in the Supabase SQL editor. Does not change table columns.
-- Existing fields used:
--   updates.photo_url
--   families.baby_photo_url
--
-- Tradeoff: the bucket is public so the unlisted family page can show
-- images without login. Paths include UUIDs, so they are not easy to guess.
-- Anyone who has the image URL can view it, same as the family page link.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'family-media',
  'family-media',
  true,
  10485760,
  array[
    'image/jpeg',
    'image/jpg',
    'image/pjpeg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif',
    'image/heic-sequence',
    'image/heif-sequence'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists family_media_public_read on storage.objects;
create policy family_media_public_read
  on storage.objects
  for select
  to public
  using (bucket_id = 'family-media');

drop policy if exists family_media_parent_insert on storage.objects;
create policy family_media_parent_insert
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'family-media'
    and split_part(name, '/', 1) = 'families'
    and split_part(name, '/', 2) in (
      select id::text from public.families where owner_user_id = auth.uid()
    )
  );
