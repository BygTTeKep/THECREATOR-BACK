users

Базовый пользователь.
```
users (
  id                uuid pk,
  email             text unique,
  phone             varchar,
  status            text, -- active / banned
  total_months      int,  -- стаж (можно считать, но кеш ускоряет)
  metadata          jsonb
  created_at        timestamptz,
  current_tier_id   smlint fk,
)
```

## Объяснение полей
- email - почта пользователя
- phone - номер телефона пользователя
- status - статус пользователя active / banned
- total_month - стаж пользователя, сколько подписан
- created_at - дата регистрации
- current_tier_id - 