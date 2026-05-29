# RULES модуль
модуль определяющий можно ли купить пользователю продукт

# drop_access_rules
Кто вообще может видеть/участвовать в дропе.

```
drop_access_rules (
  id              uuid pk,
  drop_id         uuid fk,
  min_tier_id     int fk,
  min_months      int,
  whitelist_only  boolean
)
```
## Объяснение полей
- drop_id - fk на таблицу drops
- min_tier_id - fk на таблицу tiers
- min_month - показатель который опеределяет сколько по времени пользователь должен быть подписан чтобы иметь возвожность купить дроп
- whitelist_only - флаг который определяет для кого дроп

# whitelists __НЕ ИСПОЛЬЗУЕТСЯ__

Точечный доступ (для ultra редких вещей).
```
whitelists (
  id          uuid pk,
  user_id     uuid fk,
  product_id  uuid fk,
  drop_id     uuid fk,
  created_at  timestamptz
)
```

## Объяснение полей
- user_id - fk на таблицу users
- product_id - fk на таблицу products
- drop_id - fk га таблицу drops
- created_at - дата создания листа 
---

Ключевая бизнес-логика (как это работает)
Проверка доступа к продукту

Псевдологика:

```
function canUserBuy(user, product) {
  // 1. Проверка дропа
  checkDropAccess(user, product.drop)

  // 2. Проверка уровня
  if (user.tier < rule.minTier) return false

  // 3. Проверка стажа
  if (user.months < rule.minMonths) return false

  // 4. Whitelist
  if (rule.whitelist_only && !isWhitelisted(user)) return false

  return true
}
```