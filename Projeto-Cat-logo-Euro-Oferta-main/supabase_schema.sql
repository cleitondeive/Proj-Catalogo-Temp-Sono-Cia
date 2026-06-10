-- 1. Criar a tabela se não existir
create table if not exists public.app_state (
  id integer primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Ativar RLS para segurança
alter table public.app_state enable row level security;

-- 3. Limpar políticas antigas para evitar o erro "already exists"
drop policy if exists "Leitura Pública do App" on public.app_state;
drop policy if exists "Atualização Pública do App" on public.app_state;
drop policy if exists "Inserção Pública do App" on public.app_state;

-- 4. Criar as novas políticas corretamente
create policy "Leitura Pública do App"
on public.app_state
for select
to anon, authenticated
using (true);

create policy "Atualização Pública do App"
on public.app_state
for update
to anon, authenticated
using (true);

create policy "Inserção Pública do App"
on public.app_state
for insert
to anon, authenticated
with check (true);

-- 5. Inserir o registro inicial (se não existir nenhum)
insert into public.app_state (id, data) values (1, '{}') on conflict (id) do nothing;
