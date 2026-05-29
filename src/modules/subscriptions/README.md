# SUBSCRIPTIONS модуль

модуль для управления подписками пользователей

Подписка как биллинг-сущность.
```
subscriptions (
  id                    int pk,
  user_id               uuid fk,
  stripe_id             text,
  status                text, -- active / canceled / past_due
  started_at            timestamptz,
  current_period_end    timestamptz,
  canceled_at           timestamptz,
  subscription_plan_id  integer
  payment_id            varchar
)
```

## Объяснение полей
- user_id - fk на таблицу users
- stripe_id - id в платежной системе stripe(не используется)
- status - статус подписки
- started_at - начало работы подписки
- canceled_at - конец периода подписки
- subscription_plan_id - план подписки
- payment_id - id платежа в латежной системе

# subscription_plans
планы подписок

```
subscription_plans (
  id           int pk, 
  name         test,
  description  text,
  price        decimal
)
```

## Объяснение полей
- name - название плана подписки
- description - описание плана подписки
- price - цена плана подписки