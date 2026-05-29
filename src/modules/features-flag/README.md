# FEATURE FLAG модуль
модуль предназначен для управления фича флагами

```
feature_flags (
    id           number,
    name         varchar,
    description  varchar,
    is_active    boolean,
    created_at   timestamp,
    updated_at   timestamp
)
```
## Объяснение полей
- name - название фича флага
- description - описание для чего фича флаг нужен
- is_active - флаг для определения включен ли он
- created_at - дата создания 
- updated_at - дата обновления