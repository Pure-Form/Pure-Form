-- Run this in Supabase SQL Editor to create translations table
create table if not exists public.nutrition_translations (
  id bigserial primary key,
  locale text not null,
  key_type text not null, -- categories | sources | tags
  key text not null,
  translation text not null,
  unique (locale, key_type, key)
);

-- Example entries (add more as needed)
insert into public.nutrition_translations (locale, key_type, key, translation)
values
('tr', 'sources', 'foundation_food', 'Foundation Food'),
('tr', 'sources', 'branded_food', 'Markalı Ürün'),
('tr', 'tags', 'protein', 'Protein'),
('tr', 'tags', 'carb', 'Karbonhidrat')
on conflict do nothing;
