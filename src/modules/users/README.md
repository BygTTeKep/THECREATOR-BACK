users

Базовый пользователь.
```
users (
  id                uuid pk,
  email             text unique,
  created_at        timestamptz,
  status            text, -- active / banned
  current_tier_id   uuid fk,
  subscription_id   uuid fk,
  total_months      int,  -- стаж (можно считать, но кеш ускоряет)
  metadata          jsonb
)
```