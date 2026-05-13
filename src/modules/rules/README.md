Гейтинг (ключевая часть)
drop_access_rules

Кто вообще может видеть/участвовать в дропе.

```
drop_access_rules (
  id              uuid pk,
  drop_id         uuid fk,
  min_tier_id     uuid fk,
  min_months      int,
  whitelist_only  boolean
)
```
product_access_rules

Гейтинг на уровне конкретного худи.
```
product_access_rules (
  id              uuid pk,
  product_id      uuid fk,
  min_tier_id     uuid fk,
  min_months      int,
  max_per_user    int,  -- квота
  whitelist_only  boolean
)
```
whitelists

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

  // 5. Квота
  if (userPurchased >= rule.max_per_user) return false

  return true
}
```