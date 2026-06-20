-- Migration 008: Make document project association optional and add status options

-- 1. Alter project_id to drop NOT NULL constraint
alter table public.documents alter column project_id drop not null;
