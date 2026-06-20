-- 家謎：所有権（entitlements）テーブル ＋ RLS
-- 適用方法：Supabase ダッシュボード → SQL Editor にこの内容を貼って実行。
--
-- 設計：1 ユーザー × 1 作品 = 1 行（買い切り）。付与は Stripe Webhook から
-- service role キー（RLS 迂回）でのみ行う。クライアントは自分の行を読むだけ。

create table if not exists public.ienazo_entitlements (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users (id) on delete cascade,
  work_slug         text not null,
  source            text not null default 'stripe',   -- 'stripe' | 'grant' など
  stripe_session_id text,
  created_at        timestamptz not null default now(),
  unique (user_id, work_slug)
);

create index if not exists ienazo_entitlements_user_id_idx
  on public.ienazo_entitlements (user_id);

-- 行レベルセキュリティを有効化。
alter table public.ienazo_entitlements enable row level security;

-- 自分の所有権だけ参照できる（書き込みポリシーは作らない＝service role 専用）。
drop policy if exists "read own entitlements" on public.ienazo_entitlements;
create policy "read own entitlements"
  on public.ienazo_entitlements
  for select
  using (auth.uid() = user_id);
