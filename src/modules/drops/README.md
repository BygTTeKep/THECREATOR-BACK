# DROPS модуль

# Событие (релиз).
```
drops (
  id            number pk,
  name          text,
  description   text,
  starts_at     timestamptz,
  ends_at       timestamptz,
  is_active     boolean,
  tier          smallint,
  is_visible    boolean
)
```
## Объяснение полей
- name - название дропа
- description - описание дропа
- start_at - дата начала продаж
- ends_at - дата окончания продаж
- is_active - показывает активен ли сейчас дроп, если период продаж дропа закончился по кроне перейдет в false
- is_visible - нужен только при создании дропов чтобы случайно пользователи не увидели дроп который еще не заполнен

# Файлы дропа
```
drops_files (
  id        number,
  drop_id   integer,
  file_url  varchar,
)
```
## Объяснение полей
- drop_id - Это fk на таблицу drops
- file_url - это url где расположен файл локально(покачто)