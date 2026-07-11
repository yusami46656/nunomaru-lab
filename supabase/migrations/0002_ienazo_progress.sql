-- 家謎：プレイ進捗（cloud save）テーブル ＋ RLS
-- 適用方法：Supabase ダッシュボード → SQL Editor にこの内容を貼って実行。
--
-- 設計：1 ユーザー × 1 作品 = 1 行。data はエンジンの保存オブジェクト（不透明 JSON）。
-- 読み書きはプレイエンジンの /api/ienazo/progress 経由（セッショントークン検証→service role）。
-- クライアント直アクセスは想定せず、書き込みポリシーは作らない（service role 専用）。

create table if not exists public.ienazo_progress (
  user_id    uuid not null references auth.users (id) on delete cascade,
  work_slug  text not null,
  data       jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, work_slug)
);

-- 行レベルセキュリティを有効化。
alter table public.ienazo_progress enable row level security;

-- 自分の進捗だけ参照できる（書き込みポリシーは作らない＝service role 専用）。
drop policy if exists "read own progress" on public.ienazo_progress;
create policy "read own progress"
  on public.ienazo_progress
  for select
  using (auth.uid() = user_id);
