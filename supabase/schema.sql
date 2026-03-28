create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'customer' check (role in ('admin', 'customer')),
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  brand text not null default 'KickRush',
  description text,
  image_url text,
  category text not null,
  color text not null,
  material text not null,
  price numeric(10,2) not null check (price >= 0),
  sale_price numeric(10,2) check (sale_price is null or sale_price >= 0),
  sizes text[] not null default '{}',
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, coalesce(new.email, ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.products enable row level security;

drop policy if exists "profiles own row" on public.profiles;
create policy "profiles own row"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "public read products" on public.products;
create policy "public read products"
on public.products
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "admins insert products" on public.products;
create policy "admins insert products"
on public.products
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "admins update products" on public.products;
create policy "admins update products"
on public.products
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admins delete products" on public.products;
create policy "admins delete products"
on public.products
for delete
to authenticated
using (public.is_admin());
-- Produkty — grupa odbiorcy rozmiarówki
alter table products
add column if not exists audience text default 'unisex';

-- Produkty — dozwolone wartości
alter table products
add constraint products_audience_check
check (audience in ('men', 'women', 'unisex'));