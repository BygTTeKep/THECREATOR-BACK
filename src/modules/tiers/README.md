tiers

Уровни (Initiate / Member / Core / Inner).
```
tiers (
  id          uuid pk,
  code        text unique, -- initiate / member / core / inner
  name        text,
  min_months  int,         -- требуемый стаж
  priority    int          -- для сортировки
)
```