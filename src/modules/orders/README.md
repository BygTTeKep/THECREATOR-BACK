# ORDERS модуль
модуль для управления заказами

# orders
```
orders (
  id               uuid pk,
  user_id          uuid fk,
  status           text, -- pending / paid / shipped / canceled
  total_amount     decimal,
  created_at       timestamptz,
  drop_id          integer,
  payment_id       varchar,
  tracking_number  varchar,
  delivery_method  varchar
)
```

## Объяснение полей
- user_id - это fk на таблицу users,
- status - статус заказа 4 видов pending / paid / shipped / canceled
- total_amount - общая стоимость заказа
- created_at - дата создания заказа
- payment_id - id оплаты в платежной системе yomoney()
- tracking_number - трек номер заказа для отслеживания
- delivery_method - выбраный пользователем способ доставки(sdek/dhl)

# order_items
описывает продукты у заказа

```
order_items (
  id          uuid pk,
  order_id    uuid fk,
  product_id  uuid fk,
  quantity    int,
  price       int
)
```
## Объяснение полей
- order_id - Это fk на таблицу orders
- product_id - это fk на таблицу products
- quantity - Это количество продуктов
- price - цена продукта