products

Конкретные худи (дизайн/надпись).
```
products (
  id            uuid pk,
  drop_id       uuid fk,
  name          text,
  sku           text,
  base_cost     int,   -- себестоимость
  price         int,
  total_stock   int,
  metadata      jsonb  -- например: надпись, уровень, редкость
  created_at date
)
```