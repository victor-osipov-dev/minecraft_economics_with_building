# HANDOFF — визуальный аудит библиотеки схем (продолжение работы)

Файл-передача для следующего агента: текущее состояние, что осталось сделать и как это делать.
Создан для задачи: **«проанализировать каждую постройку, её картинку, название, категорию и теги → отчёт»**.

---

## 1. Что уже сделано (проект в целом)

- Библиотека **1180 схем** в `schemes/` (13 категорий, 24 481 797 блоков, sha256 уникальны).
  988 `verified` / 127 `verified-tall` / 65 `review`.
- Игра проверена: прод-сборка `npm.cmd run build && npm.cmd run preview` → `http://127.0.0.1:4173/`,
  0 ошибок консоли, панель «1180 из 1180», 845/845 превью загружено, поиск и клик по карточке работают.
- Закоммичено: `5b284e2` (837 файлов). Удалённый репозиторий:
  `origin = https://github.com/victor-osipov-dev/minecraft_economics_with_building.git`.
- Инструменты аудита написаны и работают:

| Файл | Назначение |
|---|---|
| `tools/metadata-audit.mjs` | правилa по именам/тегам → `reports/metadata_audit.json` (1180 строк) |
| `tools/make-batches.mjs` | разбивает `schemes/index.json` на 30 батчей по 40 → `reports/batches/batch-NN.json` |
| `reports/VISION_TASK.md` | **контракт для воркера-визуалиста** (схема JSONL, критерии, 13 категорий, 32 тега, раздел про сбой доставки картинок) |
| `tools/verify-vision.mjs` | строгий валидатор выходов: покрытие, enum, `suggestCat`, `tagNotes`, дубликаты |
| `tools/build-report.mjs` | склейка metadata + vision → `schemes/BUILD_REPORT.md` + `schemes/build_report.csv` |

---

## 2. Текущее состояние визуального аудита

- **Готово: 440 из 1180** (батчи `batch-01` … `batch-10` и `batch-14`, по 40 строк каждый).
- Валидатор: `node tools/verify-vision.mjs` → `seen=440 problems=0`.
- Промежуточный отчёт уже сгенерирован (частичный!): `schemes/BUILD_REPORT.md` (576 КБ) +
  `schemes/build_report.csv`. Заголовок честно пишет `analysed=440/1180 missing=740`.
- Предварительные метрики по 440 объектам:
  - `nameFit`: good 345 · partial 86 · wrong 3 · unreadable 6
  - `catFit`: ok 393 · misfit 47
  - `tagsFit`: ok 359 · extra 77 · missing 4
  - `verdict`: ok 265 · minor 113 · mismatch 47 · broken 15
  - **scores: name 88% · category 89% · tags 82%**
- Спотовая проверка качества пройдена: 4 случайных оценки сверены мной с реальными PNG — совпали 4/4.

### Осталось (19 батчей = 740 объектов)

- **Уже запущены в фоне** (агенты пишут файлы сами, не дублировать!): `11, 12, 13, 15, 16`.
- **Ещё не запускались**: `17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30`
  (`batch-30` содержит 20 объектов, остальные по 40).

Точный состав незакрытых батчей смотри в выводе `node tools/verify-vision.mjs`.

---

## 3. Как продолжать (пошагово)

1. **Проверь состояние:** `node tools/verify-vision.mjs`
   (покажет, какие `reports/vision/batch-NN.jsonl` есть, сколько в них строк и чего не хватает).
2. **Дозапусти недостающие батчи** — волной по **5–6 сабагентов** (больше → `Rate limit exceeded`).
   Промпт для каждого воркера копируется дословно (подставь номер батча):

   ```
   Прочитай инструкцию C:\Projects\minecraft_economics_with_building\reports\VISION_TASK.md
   и выполни её для батча NN.

   Вход:  C:\Projects\minecraft_economics_with_building\reports\batches\batch-NN.json
   Выход: C:\Projects\minecraft_economics_with_building\reports\vision\batch-NN.jsonl (ровно 40 строк JSONL)

   Следуй инструкции буквально: прочитай вход, посмотри все 40 картинок по путям thumb
   (учти раздел про сбои доставки картинок — там описан рабочий обход через контактные листы),
   запиши выход через write, перечитай и самопроверь
   (40 строк, валидный JSON, file совпадают со входом).

   Ответь коротким итогом: nameFit (good/partial/wrong/unreadable), catFit=misfit сколько,
   вердикты ok/minor/mismatch/broken, и 3 самых проблемных объекта по одному предложению.
   ```

3. **После каждой волны** прогоняй `node tools/verify-vision.mjs` — он обязан вывести
   `seen=1180 problems=0`. Неполные/битые батчи перезапускай тем же промптом (повторная запись файла безопасна).
4. **Финальная сборка отчёта:** `node tools/build-report.mjs`
   → перезаписывает `schemes/BUILD_REPORT.md` и `schemes/build_report.csv` уже без `missing`.
5. **Предъяви пользователю:** сводку (name/category/tags fit %), таблицу по категориям,
   списки проблемных объектов.
6. **Закоммить** (см. §5).

---

## 4. Важные нюансы (читать обязательно)

- **Сбой доставки картинок.** В сессии сабагента `read` по пути `thumb` регулярно возвращает
  чужой/устаревший кадр. Все успешные воркеры обошли это одним из способов:
  контактные листы 2×2 с номерами и именами файлов, вшитая метка прямо в превью,
  попиксельная сверка палитры. Описание обхода — в `reports/VISION_TASK.md`, раздел «Доставка картинок».
  Правило честности: если картинку подтвердить не удалось → `nameFit=unreadable`, `verdict=broken`,
  в `comment` «картинка не досталась», а **не** угадывать.
- **Воркеры без шелла.** Некоторые сабагенты не имеют shell/браузера — инструкция обязывает их
  работать только через `write`/`read`; контактный лист они делают, если умеют (Pillow/шell есть не у всех).
  Если воркер отчитался, что «не смог получить картинки» — проверь его файл: честные `unreadable`
  допустимы, но их должно быть мало (в `batch-06` их 6 — кандидат на перезапуск, если хочешь поднять качество).
- **Проверяй качество выборочно.** Перед финальной сборкой возьми 3–5 случайных записей, посмотри
  PNG сам и сверь с `comment`. Спот-проверка первой партии дала 4/4 совпадений, но после сбоев
  стоит повторить.
- **Лимиты.** Волна из 6 агентов уже роняла один запуск (`Rate limit exceeded`) — держи 5–6 максимум;
  фоновые агенты не отвлекаются на опрос.
- **PowerShell:** `npm.cmd` вместо `npm`; инлайн `node -e` с кавычками/regex ломается → писать
  отдельные `.mjs`; git не в PATH → `C:\Users\student\AppData\Local\Programs\Git\cmd\git.exe`.
- **Серверы Vite:** прод-путь `npm.cmd run build && npm.cmd run preview` → `http://127.0.0.1:4173/`
  (на нём и проверяли игру); dev-сервер на 5174 иногда отдаёт 502 на пачках параллельных запросов —
  перед проверкой гоняй `node tools/warmup.mjs`.
- **Не трогать:** `schemes/index.json`, сами `.nbt/.schem`, правило статусов
  (`review` если unsupported или blocks>0.5 и блоков ≥10, иначе `verified-tall` при H>64, иначе `verified`),
  13 категорий и словарь из 32 тегов.
- В `reports/vision/` лежат рабочие артефакты воркеров (`montage/`, `sheets/`, `info.ps1`,
  `make_sheets.ps1`, `zoom.ps1`) — это документированные обходы сбоя, их можно оставить в коммите.

---

## 5. Коммит и пуш

Git-путь: `C:\Users\student\AppData\Local\Programs\Git\cmd\git.exe`
(remote `origin` = github.com/victor-osipov-dev/minecraft_economics_with_building, автор
`Victor Osipov <victorosipovprogrammer@gmail.com>` уже настроен локально).

```powershell
& "C:\Users\student\AppData\Local\Programs\Git\cmd\git.exe" add -A
& "C:\Users\student\AppData\Local\Programs\Git\cmd\git.exe" commit -m "vision audit: 440/1180 + tools + partial report"
& "C:\Users\student\AppData\Local\Programs\Git\cmd\git.exe" push origin main
```

Важно: **после завершения оставшихся батчей нужно закоммитить снова** (файлы
`reports/vision/batch-NN.jsonl`, обновлённые `BUILD_REPORT.md`/`build_report.csv`).

---

## 6. Артефакты на выходе

- `reports/vision/batch-01..30.jsonl` — построчные оценки всех 1180 объектов
  (`file, nameFit, catFit, suggestCat, tagsFit, tagNotes, flags, verdict, comment`).
- `schemes/BUILD_REPORT.md` — человекочитаемый отчёт: сводка, таблица по категориям, построчно
  по каждой постройке (название ↔ картинка, категория ↔ картинка, теги ↔ картинка, вердикт, комментарий).
- `schemes/build_report.csv` — то же в CSV для фильтрации/сортировки.
