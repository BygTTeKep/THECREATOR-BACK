Заказы и квоты
orders
```
orders (
  id            uuid pk,
  user_id       uuid fk,
  status        text, -- pending / paid / shipped / canceled
  total_amount  int,
  created_at    timestamptz
)
```
order_items
```
order_items (
  id          uuid pk,
  order_id    uuid fk,
  product_id  uuid fk,
  quantity    int,
  price       int
)
```
user_product_limits (кэш квот)

Чтобы не считать каждый раз:
```
user_product_limits (
  id            uuid pk,
  user_id       uuid fk,
  product_id    uuid fk,
  purchased     int
)
```