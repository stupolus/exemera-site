# Сайт Exemera

Статический сайт экосистемы Exemera: завод, Торговый дом, Dermavial.

- Публикуется автоматически на GitHub Pages при каждом изменении в `main`
  (workflow `.github/workflows/deploy.yml`).
- Домен: exemera.com (кастомный домен GitHub Pages).
- Дизайн-система: брендбук Exemera v2.1 (Gilded Ivory) и брендбук
  Торгового дома v1.0 («Самоцветы») — исходники в основном рабочем
  репозитории, файлы токенов продублированы решениями в CSS страниц.

## Структура

- `index.html` — главная со сплэш-выбором (завод / ТД / Dermavial)
- `production.html`, `products.html`, `research.html`, `mission.html`,
  `contacts.html` — разделы завода
- `trade.html` — Торговый дом · `dermavial.html` — Dermavial
- `assets/` — шрифты (самохостинг), графика · `css/`, `js/` — стили и поведение
