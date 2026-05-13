Подписка как биллинг-сущность.
```
subscriptions (
  id                uuid pk,
  user_id           uuid fk,
  stripe_id         text,
  status            text, -- active / canceled / past_due
  started_at        timestamptz,
  current_period_end timestamptz,
  canceled_at       timestamptz
)
```