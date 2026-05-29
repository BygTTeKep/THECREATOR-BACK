products

# Products
Конкретные худи (дизайн/надпись).
```
products (
  id            uuid pk,
  drop_id       uuid fk,
  name          text,
  base_cost     int,   -- себестоимость
  created_at    date
  metadata      jsonb  -- например: надпись, уровень, редкость
)
```

## Объяснение полей
- drop_id - это fk на таблицу drops
- name - название продукта
- base_cost - себестоимость
- created_at - дата создания продукта
- metadata - метаданные товара

# product_variants
варианты продуктов

```
  id          uuid pk,
  product_id  uuid fk,
  size        varchar,
  sku         varchar,
  price       decimal,
  stock       int
```

## Объяснение полей
- product_id - это fk на таблицу products
- size - размер продукта
- sku - ску товара
- price - стоимость по которой он продается
- stock - оставшееся кол-во

# product_files
файлы продкутов

```
product_files (
  id          uuid pk,
  product_id  uuid fk,
  file_url    varchar
)
```

## Объяснение полей
- product_id - это fk на таблицу products
- file_url - ссылка на картинку по которой ее можно отдать