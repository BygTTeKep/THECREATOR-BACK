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

## Флоу статусов заказа
1) как только заказ создался он имеет статус pending
2) После оплаты заказа, он меняет свой статус на paid
3) После оплаты мы собираем заказ, статус picked_up
4) После того как заказ собрали, отправляемЮ, статус in_transit
5) После того как заказ доставле в пункт выдачи(или до двери) статус меняется на delivered
6) После получения заказ меняет статус на received
7) Если на какомто из этапов покупатель отменил заказ, он меняет статус на canceled

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