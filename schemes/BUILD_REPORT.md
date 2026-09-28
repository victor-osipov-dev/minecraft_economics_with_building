# Отчёт по качеству каталога построек

Дата: 2026-09-28 · объектов: **1180** · проанализировано картинок: **440** · без картинки: 740

Для каждой постройки проверялось три вещи: **подходит ли название** к тому, что на превью, **подходит ли категория** и **подходят ли теги**.
Источники фактов: картинка (`schemes/thumbs/*.png` — глазами) + метаданные (`tools/metadata-audit.mjs` — правила по словам в названии).

## Сводка

| проверка | результат |
|---|---|
| Название ↔ картинка | **88%** (345 совпадает, 86 частично, 3 не совпадает, 6 не читается) |
| Категория ↔ картинка | **89%** (393 подходит, 47 не подходит) |
| Теги ↔ картинка | **82%** (359 подходят, 4 не хватает, 77 лишние) |

Итоговый вердикт по объекту:

| вердикт | кол-во | доля |
|---|---|---|
| OK | 265 | 22% |
| мелочь | 113 | 10% |
| РАСХОЖДЕНИЕ | 47 | 4% |
| СЛОМАНО | 15 | 1% |
| missing | 740 | 63% |

Флаги (наложение правил по названию и того, что видно на картинке):

| флаг | кол-во |
|---|---|
| meta-word-in-name | 149 |
| non-building-in-name | 83 |
| franchise | 67 |
| duplicate-name | 67 |
| non-real/fantasy | 24 |
| vehicle | 18 |
| empty | 13 |
| almost-empty | 10 |
| broken | 6 |
| fantasy | 4 |
| text | 2 |

## По категориям

| категория | всего | вердикт OK | мелочь | расхождение | сломано | категория≠картинка | название≠картинка |
|---|---|---|---|---|---|---|---|
| roads | 43 | 4 | 1 | 3 | 35 | 3 | 0 |
| intersections | 15 | 2 | 1 | 0 | 12 | 0 | 0 |
| residential | 311 | 128 | 53 | 16 | 114 | 17 | 4 |
| commercial | 121 | 21 | 9 | 5 | 86 | 5 | 4 |
| public | 136 | 20 | 5 | 2 | 109 | 2 | 0 |
| towers | 143 | 26 | 10 | 5 | 102 | 5 | 0 |
| parks | 67 | 8 | 5 | 1 | 53 | 1 | 0 |
| industrial | 69 | 10 | 5 | 1 | 53 | 1 | 0 |
| transport | 93 | 9 | 8 | 3 | 73 | 3 | 1 |
| bridges | 42 | 11 | 3 | 2 | 26 | 1 | 0 |
| decor | 34 | 13 | 8 | 2 | 11 | 2 | 0 |
| vehicles | 65 | 8 | 1 | 0 | 56 | 0 | 0 |
| waterfront | 41 | 5 | 4 | 7 | 25 | 7 | 0 |

Куда по картинке переносили (топ переходов):

- waterfront→vehicles — 7
- residential→towers — 6
- towers→commercial — 4
- residential→industrial — 4
- residential→commercial — 3
- residential→waterfront — 2
- commercial→decor — 2
- commercial→residential — 2
- public→commercial — 1
- industrial→towers — 1
- decor→roads — 1
- transport→waterfront — 1
- parks→decor — 1
- roads→residential — 1
- commercial→towers — 1
- residential→public — 1
- residential→decor — 1
- towers→residential — 1
- roads→towers — 1
- decor→public — 1

## Проблемные объекты

Всего 922 записей (сломано, расхождение, флаг или категория не по картинке). Порядок: сначала худшие.

### Working Waterpark With Slides

- файл: `commercial_working-waterpark-with-slides_buildschematics_x.schem` · категория: **commercial** · теги: medium|park · 36x23x43 · 12512 блоков · источник: buildschematics
- превью: `schemes/thumbs/commercial_working-waterpark-with-slides_buildschematics_x.png`
- вердикт: СЛОМАНО · название: не совпадает · флаги: empty · теги: -park · разошлись правила и картинка (words→parks, image→ok)
- комментарий: голый коричневый куб с сеткой окон: ни горок, ни бассейнов, постройка явно недокачана

### Small Town

- файл: `commercial_small-town_mcbuild_x.schem` · категория: **commercial** · теги: large|shop · 68x28x75 · 21060 блоков · источник: mcbuild
- превью: `schemes/thumbs/commercial_small-town_mcbuild_x.png`
- вердикт: СЛОМАНО · название: не читается · флаги: broken
- комментарий: картинка не досталась

### Apple Store

- файл: `commercial_apple-store_mcbuild_x.schem` · категория: **commercial** · теги: medium|shop · 27x36x41 · 9237 блоков · источник: mcbuild
- превью: `schemes/thumbs/commercial_apple-store_mcbuild_x.png`
- вердикт: СЛОМАНО · название: не читается · флаги: broken
- комментарий: картинка не досталась

### Sazayama Prefecture Decoration Tree Big 7

- файл: `decor_sazayama-prefecture-decoration-tree-big-7_buildschematics_x.schem` · категория: **decor** · теги: tiny|tree · 8x29x6 · 14 блоков · источник: buildschematics
- превью: `schemes/thumbs/decor_sazayama-prefecture-decoration-tree-big-7_buildschematics_x.png`
- вердикт: СЛОМАНО · флаги: almost-empty, empty · теги: -tree
- комментарий: три коротких фрагмента ствола без кроны, постройка фактически пустая

### Sazayama Prefecture Decoration Tree Normal 7

- файл: `decor_sazayama-prefecture-decoration-tree-normal-7_buildschematics_x.schem` · категория: **decor** · теги: tiny|tree · 5x15x3 · 19 блоков · источник: buildschematics
- превью: `schemes/thumbs/decor_sazayama-prefecture-decoration-tree-normal-7_buildschematics_x.png`
- вердикт: СЛОМАНО · флаги: almost-empty, empty · теги: -tree
- комментарий: один тонкий столб с парой сучьев, кроны нет — постройка почти пустая

### Tree in Minecraft

- файл: `decor_tree-in-minecraft_mcbuild_x.schem` · категория: **decor** · теги: small|tall|tree · 10x58x13 · 43 блоков · источник: mcbuild
- превью: `schemes/thumbs/decor_tree-in-minecraft_mcbuild_x.png`
- вердикт: СЛОМАНО · флаги: empty, franchise · теги: -tree
- комментарий: голый ствол высотой 58 блоков без кроны и листьев — выглядит недоделкой

### Beach House

- файл: `residential_beach-house_mcbuild_x.schem` · категория: **residential** · теги: house|medium · 35x32x33 · 5323 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_beach-house_mcbuild_x.png`
- вердикт: СЛОМАНО · название: не читается · флаги: broken, duplicate-name
- комментарий: картинка не досталась

### Most Secured House

- файл: `residential_most-secured-house_mcbuild_x.schem` · категория: **residential** · теги: house|large|tall · 73x53x70 · 26335 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_most-secured-house_mcbuild_x.png`
- вердикт: СЛОМАНО · название: не читается · флаги: broken
- комментарий: картинка не досталась

### Villa

- файл: `residential_villa_mcbuild_x.schem` · категория: **residential** · теги: house|huge|tall · 112x44x158 · 151577 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_villa_mcbuild_x.png`
- вердикт: СЛОМАНО · название: не читается · флаги: broken
- комментарий: картинка не досталась

### Mansion and Place

- файл: `residential_mansion-and-place_mcbuild_x.schem` · категория: **residential** · теги: house|tiny · 1x11x63 · 375 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_mansion-and-place_mcbuild_x.png`
- вердикт: СЛОМАНО · категория «residential» не по картинке → decor · название: не совпадает · флаги: empty · теги: -house
- комментарий: вместо особняка — тонкая насыпь-стена в один блок с шарами по кромке, постройки нет

### Final House

- файл: `residential_final-house_mcbuild_x.schem` · категория: **residential** · теги: house|medium · 53x30x60 · 15387 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_final-house_mcbuild_x.png`
- вердикт: СЛОМАНО · флаги: empty
- комментарий: каркас дома недостроен: стены и кровля частично снесены, вокруг обломки, брёвна и голый участок

### Modern Apartment Building With 6 Units

- файл: `residential_modern-apartment-building-with-6-units_mc-mod_x.schem` · категория: **residential** · теги: apartment|modern|small · 12x24x19 · 718 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_modern-apartment-building-with-6-units_mc-mod_x.png`
- вердикт: СЛОМАНО · флаги: empty · теги: -apartment
- комментарий: плиты и стены висят в воздухе с разрывами, цельный жилой объём не собран

### Brass and Glass Worm Train Vehicle

- файл: `transport_brass-and-glass-worm-train-vehicle_buildschematics_x.nbt` · категория: **transport** · теги: tiny · 7x6x35 · 70 блоков · источник: buildschematics
- превью: `schemes/thumbs/transport_brass-and-glass-worm-train-vehicle_buildschematics_x.png`
- вердикт: СЛОМАНО · флаги: empty, vehicle
- комментарий: Разрозненные стеклянные и белые блоки линией — пустой каркас, силуэт поезда не читается.

### Train Station

- файл: `transport_train-station_mcbuild_x.schem` · категория: **transport** · теги: medium|station|tall · 17x41x37 · 2754 блоков · источник: mcbuild
- превью: `schemes/thumbs/transport_train-station_mcbuild_x.png`
- вердикт: СЛОМАНО · название: не читается · флаги: broken, duplicate-name
- комментарий: картинка не досталась

### Compact Japanese Kei Car

- файл: `vehicles_compact-japanese-kei-car_buildschematics_x.schem` · категория: **vehicles** · теги: car|tiny · 5x3x2 · 12 блоков · источник: buildschematics
- превью: `schemes/thumbs/vehicles_compact-japanese-kei-car_buildschematics_x.png`
- вердикт: СЛОМАНО · флаги: almost-empty, empty, non-building-in-name, vehicle
- комментарий: Два раздельных бруска из 12 блоков — машинка не собрана, силуэт авто не читается.

### Steampunk Bridge

- файл: `bridges_steampunk-bridge_mcbuild_x.schem` · категория: **bridges** · теги: bridge|large|tall · 49x66x93 · 19638 блоков · источник: mcbuild
- превью: `schemes/thumbs/bridges_steampunk-bridge_mcbuild_x.png`
- вердикт: РАСХОЖДЕНИЕ · флаги: fantasy, non-real/fantasy
- комментарий: парящие зелёные острова с деревянным переходом и свисающими столбами воды, стимпанк-механики нет

### Medium Mansion With Bridge

- файл: `bridges_medium-mansion-with-bridge_mc-mod_x.schem` · категория: **bridges** · теги: bridge|house|huge|tall · 105x133x82 · 443361 блоков · источник: mc-mod
- превью: `schemes/thumbs/bridges_medium-mansion-with-bridge_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «bridges» не по картинке → residential
- комментарий: особняк на скале с ручьём: мостик там крошечный, основной объём — жилой дом

### Small fountain

- файл: `commercial_small-fountain_mcbuild_x.schem` · категория: **commercial** · теги: fountain|shop|tiny|water · 11x10x11 · 186 блоков · источник: mcbuild
- превью: `schemes/thumbs/commercial_small-fountain_mcbuild_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «commercial» не по картинке → decor · теги: -shop
- комментарий: ярусный фонтан с водой — это малая декоративная форма, а не коммерческое здание

### Asian 4 Storey Pagoda Nr3

- файл: `commercial_asian-4-storey-pagoda-nr3_mcbuild_x.schem` · категория: **commercial** · теги: medium|shop|tall · 44x54x43 · 2244 блоков · источник: mcbuild
- превью: `schemes/thumbs/commercial_asian-4-storey-pagoda-nr3_mcbuild_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «commercial» не по картинке → towers · теги: -shop
- комментарий: четырёхъярусная пагода с подвесными фонарями: это башня-сооружение, а не магазин

### Small pond 1

- файл: `commercial_small-pond-1_mcbuild_x.schem` · категория: **commercial** · теги: pool|shop|small|water · 16x12x14 · 662 блоков · источник: mcbuild
- превью: `schemes/thumbs/commercial_small-pond-1_mcbuild_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «commercial» не по картинке → decor · теги: -shop
- комментарий: пруд с голубой водой на газоне, торговой или магазинной застройки нет

### Modern Burger Shop

- файл: `commercial_modern-burger-shop_mcbuild_x.schem` · категория: **commercial** · теги: modern|shop|small · 21x27x24 · 6432 блоков · источник: mcbuild
- превью: `schemes/thumbs/commercial_modern-burger-shop_mcbuild_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «commercial» не по картинке → residential · название: не совпадает · теги: -shop
- комментарий: серо-белый многоэтажный блок с балконами и вентиляцией на кровле; магазина и витрин нет

### Charming Cottage with Living Area and Garage

- файл: `commercial_charming-cottage-with-living-area-and-garage_mc-mod_x.schem` · категория: **commercial** · теги: house|medium|parking · 37x12x37 · 4402 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_charming-cottage-with-living-area-and-garage_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «commercial» не по картинке → residential
- комментарий: длинный красный дом с двускатной серой кровлёй на газоне — это коттедж

### Modern Street With Five Houses

- файл: `decor_modern-street-with-five-houses_buildschematics_x.schem` · категория: **decor** · теги: house|huge|modern|road|tree · 139x25x200 · 83871 блоков · источник: buildschematics
- превью: `schemes/thumbs/decor_modern-street-with-five-houses_buildschematics_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «decor» не по картинке → roads
- комментарий: сверху видна улица с дорогой, газонами и несколькими домами, к декору это не относится

### City Hall Building

- файл: `decor_city-hall-building_mc-mod_x.schem` · категория: **decor** · теги: medium · 30x30x21 · 3775 блоков · источник: mc-mod
- превью: `schemes/thumbs/decor_city-hall-building_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «decor» не по картинке → public
- комментарий: ратуша с колоннадой и парадной лестницей на газоне — общественное здание, не декор

### Mega Tower With Working Elevators

- файл: `industrial_mega-tower-with-working-elevators_buildschematics_x.schem` · категория: **industrial** · теги: huge|tall|tower · 51x254x44 · 117512 блоков · источник: buildschematics
- превью: `schemes/thumbs/industrial_mega-tower-with-working-elevators_buildschematics_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «industrial» не по картинке → towers · флаги: non-building-in-name
- комментарий: тонкая высокая башня с лифтовой шахтой и окнами, к промышленным постройкам не относится

### Square Earth Build

- файл: `parks_square-earth-build-2_buildschematics_x.schem` · категория: **parks** · теги: medium|park · 31x31x31 · 16852 блоков · источник: buildschematics
- превью: `schemes/thumbs/parks_square-earth-build-2_buildschematics_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «parks» не по картинке → decor · флаги: meta-word-in-name · теги: -park
- комментарий: серый куб с рельефом поверхности: парка и зелени здесь нет, это декоративный объект

### City Gas Station

- файл: `public_city-gas-station_buildschematics_x.schem` · категория: **public** · теги: medium|station · 48x11x39 · 4306 блоков · источник: buildschematics
- превью: `schemes/thumbs/public_city-gas-station_buildschematics_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «public» не по картинке → commercial · разошлись правила и картинка (words→transport, image→commercial)
- комментарий: Заправка с навесом и колонками на площадке — это коммерция, а не общественное здание.

### Classic School Bus Design

- файл: `public_classic-school-bus-design_mc-mod_x.schem` · категория: **public** · теги: school|tiny · 17x5x5 · 134 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_classic-school-bus-design_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «public» не по картинке → vehicles · флаги: non-building-in-name, vehicle
- комментарий: жёлтый школьный автобус на асфальтовой площадке, здания здесь нет

### Island Lighthouse Structure

- файл: `residential_island-lighthouse-structure_buildschematics_x.schem` · категория: **residential** · теги: house|medium|tall|water · 25x76x27 · 21876 блоков · источник: buildschematics
- превью: `schemes/thumbs/residential_island-lighthouse-structure_buildschematics_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «residential» не по картинке → waterfront · флаги: meta-word-in-name · теги: -house
- комментарий: светлая башня маяка на кубе воды, к жилым зданиям не относится, нужна набережная

### Spruce Village Pack - Church

- файл: `residential_spruce-village-pack---church_mcbuild_x.schem` · категория: **residential** · теги: church|house|small|tree · 16x26x11 · 839 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_spruce-village-pack---church_mcbuild_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «residential» не по картинке → public
- комментарий: маленькая деревянная часовня с высоким шпилем; к жилым зданиям не относится

### Simple resource warehouse

- файл: `residential_simple-resource-warehouse_mcbuild_x.schem` · категория: **residential** · теги: house|small · 17x10x13 · 1032 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_simple-resource-warehouse_mcbuild_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «residential» не по картинке → industrial
- комментарий: деревянный сарай с пологой крышей и сеном у входа — это склад, а не жильё

### Market with the villagers

- файл: `residential_market-with-the-villagers_mcbuild_x.schem` · категория: **residential** · теги: house|shop|small · 28x22x15 · 3915 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_market-with-the-villagers_mcbuild_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «residential» не по картинке → commercial
- комментарий: рыночная площадка под серым навесом с прилавками и сеном — торговля

### Lighthouse 

- файл: `residential_lighthouse_mcbuild_x.schem` · категория: **residential** · теги: house|medium|tall|water · 21x98x32 · 8490 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_lighthouse_mcbuild_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «residential» не по картинке → towers · теги: -water
- комментарий: красно-белый маяк с фонарём и куполом, к жилым домам не относится, воды в кадре нет

### Light House (with working lights)

- файл: `residential_light-house--with-working-lights-_mcbuild_x.schem` · категория: **residential** · теги: house|medium|tall · 31x54x32 · 6248 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_light-house--with-working-lights-_mcbuild_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «residential» не по картинке → waterfront · теги: -house
- комментарий: полосатый маяк на скалистом острове в воде; к жилой застройке не относится

### Basic Lighthouse Structure

- файл: `residential_basic-lighthouse-structure_mc-mod_x.schem` · категория: **residential** · теги: house|medium|tall|water · 30x64x45 · 17845 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_basic-lighthouse-structure_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «residential» не по картинке → towers · флаги: meta-word-in-name · теги: -house
- комментарий: высокий серый маяк на островке посреди воды, к жилым зданиям не относится

### Blue And White Lighthouse Structure

- файл: `residential_blue-and-white-lighthouse-structure_mc-mod_x.schem` · категория: **residential** · теги: house|medium|tall|water · 16x69x16 · 4587 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_blue-and-white-lighthouse-structure_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «residential» не по картинке → towers · флаги: meta-word-in-name · теги: -house
- комментарий: ярусная башня из восьмигранных секций наверху дымовой трубы, похожа на маяк

### Chest-Shaped Storage Warehouse

- файл: `residential_chest-shaped-storage-warehouse_mc-mod_x.schem` · категория: **residential** · теги: house|small · 23x13x19 · 1027 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_chest-shaped-storage-warehouse_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «residential» не по картинке → industrial · теги: -house
- комментарий: гигантский сундук-хранилище на газоне, это склад, а не жилой дом

### Classic Minecraft Lighthouse Decoration

- файл: `residential_classic-minecraft-lighthouse-decoration-2_mc-mod_x.schem` · категория: **residential** · теги: house|medium|tall|water · 20x47x17 · 1587 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_classic-minecraft-lighthouse-decoration-2_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «residential» не по картинке → towers · флаги: franchise · теги: -house
- комментарий: серый маяк с расширенным основанием и деревянной площадкой сверху, дома нет

### Coastal Lighthouse &#8211; Polished Andesite &amp; Stone Bricks

- файл: `residential_coastal-lighthouse-polished-andesite-stone-b_mc-mod_x.schem` · категория: **residential** · теги: house|small|water · 11x29x16 · 1211 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_coastal-lighthouse-polished-andesite-stone-b_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «residential» не по картинке → towers · разошлись правила и картинка (words→waterfront, image→towers)
- комментарий: высокий серый маяк на синей воде с маленьким домиком рядом, категория не жилая

### Coastal Lighthouse Structure

- файл: `residential_coastal-lighthouse-structure_mc-mod_x.schem` · категория: **residential** · теги: house|medium|tall|water · 17x41x29 · 3044 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_coastal-lighthouse-structure_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «residential» не по картинке → towers · флаги: meta-word-in-name · теги: -water · разошлись правила и картинка (words→waterfront, image→towers)
- комментарий: многоярусная башенка с деревянными кровлями на траве, берега и воды не видно

### Massive Storage Warehouse Structure

- файл: `residential_massive-storage-warehouse-structure_mc-mod_x.schem` · категория: **residential** · теги: house|large · 169x22x85 · 24720 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_massive-storage-warehouse-structure_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «residential» не по картинке → industrial · флаги: meta-word-in-name · теги: -house
- комментарий: длинный склад с открытым каркасом кровли, к жилой застройке не относится

### Medium Orange Warehouse

- файл: `residential_medium-orange-warehouse_mc-mod_x.schem` · категория: **residential** · теги: house|large · 74x21x117 · 21686 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_medium-orange-warehouse_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «residential» не по картинке → industrial · теги: -house
- комментарий: серо-белый склад со световыми окнами, оранжевого цвета нет и это не жильё

### Minecraft Casino Mansion Structure

- файл: `residential_minecraft-casino-mansion-structure_mc-mod_x.schem` · категория: **residential** · теги: house|huge|tall · 79x93x92 · 49502 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_minecraft-casino-mansion-structure_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «residential» не по картинке → commercial · флаги: franchise, meta-word-in-name
- комментарий: крупное здание с гигантским колесом на кровле — это казино, а не жилой дом

### Mini Shop Blockhouse

- файл: `residential_mini-shop-blockhouse_mc-mod_x.schem` · категория: **residential** · теги: house|shop|tiny · 3x2x6 · 29 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_mini-shop-blockhouse_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «residential» не по картинке → commercial · теги: -house
- комментарий: крохотная будка с прилавком — это ларёк, а не жилой дом

### Vienna Street House 67

- файл: `roads_vienna-street-house-67_buildschematics_x.schem` · категория: **roads** · теги: house|medium|road|tall|tree · 29x41x20 · 6565 блоков · источник: buildschematics
- превью: `schemes/thumbs/roads_vienna-street-house-67_buildschematics_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «roads» не по картинке → residential · теги: -road -tree
- комментарий: узкий многоэтажный дом с декоративным фасадом стоит на газоне: ни дороги, ни дерева нет

### 432 Park Avenue Skyscraper Replica

- файл: `roads_park-avenue-skyscraper-replica_mc-mod_x.schem` · категория: **roads** · теги: large|park|road|tall|tower · 25x202x25 · 49086 блоков · источник: mc-mod
- превью: `schemes/thumbs/roads_park-avenue-skyscraper-replica_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «roads» не по картинке → towers · теги: -road -park
- комментарий: тонкий белый небоскрёб с сеткой окон: это башня, а не дорога; дороги и парка в кадре нет

### Compact Highway Gas Station

- файл: `roads_compact-highway-gas-station_mc-mod_x.schem` · категория: **roads** · теги: medium|road|station · 41x13x60 · 7769 блоков · источник: mc-mod
- превью: `schemes/thumbs/roads_compact-highway-gas-station_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «roads» не по картинке → commercial
- комментарий: заправка у трассы с навесом и площадкой — это коммерция, а не дорожная постройка

### Modern Hotel Building With Fountain

- файл: `towers_modern-hotel-building-with-fountain_buildschematics_x.schem` · категория: **towers** · теги: fountain|hotel|medium|modern|water · 66x31x48 · 17840 блоков · источник: buildschematics
- превью: `schemes/thumbs/towers_modern-hotel-building-with-fountain_buildschematics_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «towers» не по картинке → commercial · теги: -fountain -water
- комментарий: низкий серо-коричневый корпус на площадке, ни фонтана, ни воды не видно, башня это не

### Futurist Modern house/tower

- файл: `towers_futurist-modern-house-tower_mcbuild_x.schem` · категория: **towers** · теги: house|medium|modern|tower · 39x37x49 · 11171 блоков · источник: mcbuild
- превью: `schemes/thumbs/towers_futurist-modern-house-tower_mcbuild_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «towers» не по картинке → residential · теги: -tower
- комментарий: широкий многоуровневый модерн-дом с террасами и навесами, по массе это не башня

### Building Contractors Office

- файл: `towers_building-contractors-office_mc-mod_x.schem` · категория: **towers** · теги: medium|office · 48x25x80 · 13023 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_building-contractors-office_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «towers» не по картинке → commercial · теги: -office
- комментарий: участок подрядчика: несколько низких построек и опоры, ни башни ни офиса не видно

### City Hotel With Penthouses

- файл: `towers_city-hotel-with-penthouses_mc-mod_x.schem` · категория: **towers** · теги: hotel|house|medium · 44x34x52 · 18781 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_city-hotel-with-penthouses_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «towers» не по картинке → commercial · разошлись правила и картинка (words→residential, image→commercial)
- комментарий: широкий отель на шесть-семь этажей с балконами и навесом, башня это не башня

### Modern 3 Story Office Building

- файл: `towers_modern-3-story-office-building_mc-mod_x.schem` · категория: **towers** · теги: modern|office|small · 33x16x25 · 3126 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_modern-3-story-office-building_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «towers» не по картинке → commercial
- комментарий: низкое трёхэтажное здание с террасой на кровле, к башням не относится

### Sandstone Cliffside Mansion with Boat Dock

- файл: `transport_sandstone-cliffside-mansion-with-boat-dock_buildschematics_x.schem` · категория: **transport** · теги: boat|house|huge|water · 163x36x110 · 216123 блоков · источник: buildschematics
- превью: `schemes/thumbs/transport_sandstone-cliffside-mansion-with-boat-dock_buildschematics_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «transport» не по картинке → waterfront
- комментарий: песчаниковый особняк на склоне у воды с доком; категория transport не соответствует

### Metro City Spawn

- файл: `transport_metro-city-spawn_mc-mod_x.schem` · категория: **transport** · теги: large|tall · 56x73x56 · 23416 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_metro-city-spawn_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «transport» не по картинке → public
- комментарий: городская площадь с фонтаном, деревьями и двумя башнями, транспортной инфраструктуры нет

### Modern Business Building

- файл: `transport_modern-business-building_mc-mod_x.schem` · категория: **transport** · теги: medium|modern · 37x11x45 · 5916 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_modern-business-building_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «transport» не по картинке → commercial · флаги: non-building-in-name · разошлись правила и картинка (words→vehicles, image→commercial)
- комментарий: низкое остеклённое здание офисного вида, к транспорту отношения не имеет

### Luxury Yacht - Small Boat Design

- файл: `waterfront_luxury-yacht-small-boat-design_buildschematics_x.schem` · категория: **waterfront** · теги: boat|shop|small · 46x14x11 · 1696 блоков · источник: buildschematics
- превью: `schemes/thumbs/waterfront_luxury-yacht-small-boat-design_buildschematics_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «waterfront» не по картинке → vehicles · флаги: vehicle · теги: -shop · разошлись правила и картинка (words→commercial, image→vehicles)
- комментарий: белая яхта с красной окантовкой палубы; судно должно быть в vehicles, магазина нет

### Medium Yacht Boat

- файл: `waterfront_medium-yacht-boat_buildschematics_x.schem` · категория: **waterfront** · теги: boat|medium · 20x20x61 · 4725 блоков · источник: buildschematics
- превью: `schemes/thumbs/waterfront_medium-yacht-boat_buildschematics_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «waterfront» не по картинке → vehicles · флаги: vehicle
- комментарий: бледная яхта с надстройкой; судно попало не в ту категорию, нужен vehicles

### Small Motorboat Vehicle

- файл: `waterfront_small-motorboat-vehicle_buildschematics_x.nbt` · категория: **waterfront** · теги: boat|shop|tiny · 8x3x5 · 35 блоков · источник: buildschematics
- превью: `schemes/thumbs/waterfront_small-motorboat-vehicle_buildschematics_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «waterfront» не по картинке → vehicles · флаги: vehicle · теги: -shop · разошлись правила и картинка (words→commercial, image→vehicles)
- комментарий: коричневый катер с бледной палубой — судно, waterfront ему не подходит

### Small Yacht for One or Two

- файл: `waterfront_small-yacht-for-one-or-two_buildschematics_x.schem` · категория: **waterfront** · теги: boat|medium|shop · 58x32x23 · 1097 блоков · источник: buildschematics
- превью: `schemes/thumbs/waterfront_small-yacht-for-one-or-two_buildschematics_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «waterfront» не по картинке → vehicles · флаги: vehicle · теги: -shop · разошлись правила и картинка (words→commercial, image→vehicles)
- комментарий: судно-яхта на воде: это техника, а не набережная, и торговой палубы не видно

### Furnished Yacht 

- файл: `waterfront_furnished-yacht_mcbuild_x.schem` · категория: **waterfront** · теги: boat|large|tall · 39x43x169 · 21400 блоков · источник: mcbuild
- превью: `schemes/thumbs/waterfront_furnished-yacht_mcbuild_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «waterfront» не по картинке → vehicles · флаги: vehicle
- комментарий: многопалубная белая яхта с мостиком и антеннами: судно, а не прибрежная застройка

### Large Yacht

- файл: `waterfront_large-yacht_mcbuild_x.schem` · категория: **waterfront** · теги: boat|medium · 76x19x19 · 7330 блоков · источник: mcbuild
- превью: `schemes/thumbs/waterfront_large-yacht_mcbuild_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «waterfront» не по картинке → vehicles · флаги: vehicle
- комментарий: длинное белое судно с палубами на синей воде, скорее лайнер, чем здание набережной

### Airport Service Truck

- файл: `waterfront_airport-service-truck_mc-mod_x.schem` · категория: **waterfront** · теги: car|tiny · 6x5x17 · 156 блоков · источник: mc-mod
- превью: `schemes/thumbs/waterfront_airport-service-truck_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «waterfront» не по картинке → vehicles · флаги: non-building-in-name, vehicle · разошлись правила и картинка (words→transport, image→vehicles)
- комментарий: маленькая белая служебная машина с синими блоками: это транспорт, а не набережная

### Blacksmith Shop House

- файл: `commercial_blacksmith-shop-house_buildschematics_x.schem` · категория: **commercial** · теги: house|shop|small · 34x15x15 · 2543 блоков · источник: buildschematics
- превью: `schemes/thumbs/commercial_blacksmith-shop-house_buildschematics_x.png`
- флаги: fantasy, non-real/fantasy
- комментарий: Открытая деревянная постройка с тяжёлой двускатной крышей, кузницы или наковальни не видно.

### Shopping Mall Elevator with Floor Selection

- файл: `commercial_shopping-mall-elevator-with-floor-selection_buildschematics_x.schem` · категория: **commercial** · теги: medium|shop · 28x30x23 · 7321 блоков · источник: buildschematics
- превью: `schemes/thumbs/commercial_shopping-mall-elevator-with-floor-selection_buildschematics_x.png`
- флаги: non-building-in-name · теги: -shop
- комментарий: глухая серо-бежевая коробка, лифт и панель выбора этажей не различимы

### Tudor Blacksmith Shop

- файл: `commercial_tudor-blacksmith-shop_buildschematics_x.schem` · категория: **commercial** · теги: shop|small · 22x18x17 · 1028 блоков · источник: buildschematics
- превью: `schemes/thumbs/commercial_tudor-blacksmith-shop_buildschematics_x.png`
- флаги: non-real/fantasy
- комментарий: каменное строение со ступенчатой крышей и столбами, тюдоровский облик не читается

### Little Shop

- файл: `commercial_little-shop_mcbuild_x.schem` · категория: **commercial** · теги: shop|small · 15x27x13 · 1618 блоков · источник: mcbuild
- превью: `schemes/thumbs/commercial_little-shop_mcbuild_x.png`
- флаги: empty
- комментарий: мелкая деревянная конструкция с открытым каркасом, скорее недострой, чем магазин

### Mall Shop

- файл: `commercial_mall-shop_mcbuild_x.schem` · категория: **commercial** · теги: medium|shop|tall · 36x55x59 · 15877 блоков · источник: mcbuild
- превью: `schemes/thumbs/commercial_mall-shop_mcbuild_x.png`
- флаги: text · теги: -tall
- комментарий: широкое здание с витринами и фонарями у входа, на крыше крупная надпись; невысокое

### Cascade City

- файл: `decor_cascade-city_mcbuild_x.schem` · категория: **decor** · теги: huge|tall · 101x109x102 · 84485 блоков · источник: mcbuild
- превью: `schemes/thumbs/decor_cascade-city_mcbuild_x.png`
- флаги: fantasy
- комментарий: не город, а декоративная башня с круглыми каскадными площадками и растительностью

### Fallout 3 Broadcast Tower Structure

- файл: `industrial_fallout-3-broadcast-tower-structure_buildschematics_x.schem` · категория: **industrial** · теги: road|tiny|tower · 7x40x7 · 504 блоков · источник: buildschematics
- превью: `schemes/thumbs/industrial_fallout-3-broadcast-tower-structure_buildschematics_x.png`
- флаги: franchise, meta-word-in-name · разошлись правила и картинка (words→towers, image→ok)
- комментарий: Тёмная решётчатая вышка с красными маяками на основании; отсылки к игре на картинке не видно.

### Industrial Iron Factory Structure

- файл: `industrial_industrial-iron-factory-structure_buildschematics_x.schem` · категория: **industrial** · теги: medium · 40x37x33 · 17177 блоков · источник: buildschematics
- превью: `schemes/thumbs/industrial_industrial-iron-factory-structure_buildschematics_x.png`
- флаги: meta-word-in-name
- комментарий: оборудование цеха с трубами и подсветкой на висящем острове, цельного здания фабрики нет

### Small Grain Elevator Structure

- файл: `industrial_small-grain-elevator-structure_buildschematics_x.schem` · категория: **industrial** · теги: large|shop|tall · 26x67x72 · 10390 блоков · источник: buildschematics
- превью: `schemes/thumbs/industrial_small-grain-elevator-structure_buildschematics_x.png`
- флаги: meta-word-in-name, non-building-in-name · теги: -shop · разошлись правила и картинка (words→commercial, image→ok)
- комментарий: ряд высоких вертикальных силосов, элеватор читается; тег shop лишний

### Four Tier Garden Structure

- файл: `parks_four-tier-garden-structure_buildschematics_x.schem` · категория: **parks** · теги: medium|park|tall · 36x69x37 · 14348 блоков · источник: buildschematics
- превью: `schemes/thumbs/parks_four-tier-garden-structure_buildschematics_x.png`
- флаги: meta-word-in-name
- комментарий: Четыре круглых яруса, сложенные башней-тортом; зелени и клумб на них не видно.

### SuperMario Parkour

- файл: `parks_supermario-parkour_mcbuild_x.schem` · категория: **parks** · теги: park|small · 73x10x4 · 1699 блоков · источник: mcbuild
- превью: `schemes/thumbs/parks_supermario-parkour_mcbuild_x.png`
- флаги: franchise, text · теги: -park
- комментарий: полоса паркура с пиксель-артом фигур из Марио; парковой застройки нет, только аттракционная разметка

### City Hospital with Elevator - 10890 Blocks

- файл: `public_city-hospital-with-elevator-10890-blocks_buildschematics_x.nbt` · категория: **public** · теги: hospital|medium · 45x20x27 · 9709 блоков · источник: buildschematics
- превью: `schemes/thumbs/public_city-hospital-with-elevator-10890-blocks_buildschematics_x.png`
- флаги: non-building-in-name
- комментарий: Просторный серый корпус с рядами окон, медицинской символики и признаков больницы нет.

### Futuristic Stadium Entrance Gate

- файл: `public_futuristic-stadium-entrance-gate_buildschematics_x.schem` · категория: **public** · теги: medium|modern|stadium|tall · 24x43x55 · 9003 блоков · источник: buildschematics
- превью: `schemes/thumbs/public_futuristic-stadium-entrance-gate_buildschematics_x.png`
- флаги: non-building-in-name
- комментарий: Массивные пилоны с красными навершиями и пологими рампами; самого стадиона за кадром нет.

### Shakespearean Theater Structure

- файл: `public_shakespearean-theater-structure_buildschematics_x.schem` · категория: **public** · теги: small · 26x12x33 · 3778 блоков · источник: buildschematics
- превью: `schemes/thumbs/public_shakespearean-theater-structure_buildschematics_x.png`
- флаги: meta-word-in-name
- комментарий: крупное коричневое здание с подсвеченным входом, театральных признаков не видно

### Blue House Minecraft Build

- файл: `residential_blue-house-minecraft-build_buildschematics_262.schem` · категория: **residential** · теги: house|small · 13x14x13 · 796 блоков · источник: buildschematics
- превью: `schemes/thumbs/residential_blue-house-minecraft-build_buildschematics_262.png`
- флаги: franchise, meta-word-in-name
- комментарий: Маленький дом с серой черепичной крышей; синего цвета на превью не различить.

### Kami House Minecraft Build

- файл: `residential_kami-house-minecraft-build_buildschematics_x.schem` · категория: **residential** · теги: house|medium · 37x36x35 · 4692 блоков · источник: buildschematics
- превью: `schemes/thumbs/residential_kami-house-minecraft-build_buildschematics_x.png`
- флаги: franchise, meta-word-in-name
- комментарий: ледяный остров с несколькими постройками, стиль «ками» и японский мотив не читаются

### Red Japanese House 2 Minecraft Build

- файл: `residential_red-japanese-house-2-minecraft-build_buildschematics_262.schem` · категория: **residential** · теги: house|medium · 21x34x45 · 4378 блоков · источник: buildschematics
- превью: `schemes/thumbs/residential_red-japanese-house-2-minecraft-build_buildschematics_262.png`
- флаги: franchise, meta-word-in-name
- комментарий: тёмно-коричневое основание со светлой надстройкой, красного японского дома не видно

### Small Modern House

- файл: `residential_small-modern-house-2_buildschematics_x.schem` · категория: **residential** · теги: house|modern|shop|small · 23x14x25 · 1525 блоков · источник: buildschematics
- превью: `schemes/thumbs/residential_small-modern-house-2_buildschematics_x.png`
- флаги: duplicate-name · теги: -shop · разошлись правила и картинка (words→commercial, image→ok)
- комментарий: коричневый дом с голубыми окнами и светлой террасой; тег shop лишний

### Seaside Nordic Mansion

- файл: `residential_seaside-nordic-mansion_mcbuild_x.schem` · категория: **residential** · теги: house|large|tall · 57x49x57 · 7478 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_seaside-nordic-mansion_mcbuild_x.png`
- флаги: duplicate-name
- комментарий: тёмный деревянный дом с серой крышей на огромном газоне, воды в кадре нет

### Seaside Nordic Mansion

- файл: `residential_seaside-nordic-mansion_mcbuild_x-2.schem` · категория: **residential** · теги: house|large|tall · 57x49x57 · 7478 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_seaside-nordic-mansion_mcbuild_x-2.png`
- флаги: duplicate-name · теги: -tall
- комментарий: белый дом с чёрной кровлей и террасами, стиль читается, но этаж один и моря не видно

### Small Cozy House

- файл: `residential_small-cozy-house_mcbuild_x.schem` · категория: **residential** · теги: house|shop|small · 21x12x13 · 1577 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_small-cozy-house_mcbuild_x.png`
- флаги: duplicate-name · теги: -shop · разошлись правила и картинка (words→commercial, image→ok)
- комментарий: деревянный домик с двускатной кровлей и пристройкой, торговой вывески нет

### Small Cozy House

- файл: `residential_small-cozy-house_mcbuild_x-2.schem` · категория: **residential** · теги: house|shop|small · 21x12x13 · 1577 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_small-cozy-house_mcbuild_x-2.png`
- флаги: duplicate-name · теги: -shop · разошлись правила и картинка (words→commercial, image→ok)
- комментарий: маленький бревенчатый домик с сенными тюками; признаков торговой точки нет

### Iron Man's Mansion

- файл: `residential_iron-man-s-mansion_mcbuild_x-2.schem` · категория: **residential** · теги: house|huge · 142x35x147 · 35276 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_iron-man-s-mansion_mcbuild_x-2.png`
- флаги: duplicate-name, franchise
- комментарий: огромный белый модернистский комплекс на склоне с дорогами и кипарисами; отсылки к персонажу не видно

### Futuristic house

- файл: `residential_futuristic-house_mcbuild_x-2.schem` · категория: **residential** · теги: house|medium|modern · 65x21x53 · 15452 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_futuristic-house_mcbuild_x-2.png`
- флаги: duplicate-name
- комментарий: вилла с большим бассейном и плоскими кровлями; футуристичность на превью не читается

### Small modern house

- файл: `residential_small-modern-house_mcbuild_x.schem` · категория: **residential** · теги: house|medium|modern|shop · 28x24x41 · 9976 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_small-modern-house_mcbuild_x.png`
- флаги: duplicate-name · теги: -shop · разошлись правила и картинка (words→commercial, image→ok)
- комментарий: белый двухэтажный дом с плоской крышей и ограждённым участком, признаков магазина не видно

### Basalt Block House

- файл: `residential_basalt-block-house_mc-mod_x.schem` · категория: **residential** · теги: house|small · 11x14x17 · 675 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_basalt-block-house_mc-mod_x.png`
- флаги: empty · теги: -house
- комментарий: каркас из серых блоков с балками и фонарями на пустом основании, дом не собран

### City 17 Style Apartment Block

- файл: `residential_city-17-style-apartment-block_mc-mod_x.schem` · категория: **residential** · теги: apartment|medium · 23x24x40 · 8645 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_city-17-style-apartment-block_mc-mod_x.png`
- флаги: franchise
- комментарий: строгий бетонный блок с плоской кровлёй, отсылка к вымышленному городу из игры

### Modern Blue Apartment Building Schematic

- файл: `residential_modern-blue-apartment-building-schematic_mc-mod_x.schem` · категория: **residential** · теги: apartment|modern|small · 22x17x21 · 2520 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_modern-blue-apartment-building-schematic_mc-mod_x.png`
- флаги: meta-word-in-name
- комментарий: корпус в коричневой отделке, синими остеклены только балконы

### Tower Gate (ZeroHero1458)

- файл: `towers_tower-gate--zerohero1458-_mcbuild_x.schem` · категория: **towers** · теги: small|tall|tower · 23x49x13 · 2451 блоков · источник: mcbuild
- превью: `schemes/thumbs/towers_tower-gate--zerohero1458-_mcbuild_x.png`
- флаги: non-building-in-name
- комментарий: узкая каменно-деревянная башня на траве, проём ворот внизу не читается

### Stark Tower

- файл: `towers_stark-tower_mcbuild_x.schem` · категория: **towers** · теги: large|tall|tower · 57x133x37 · 24507 блоков · источник: mcbuild
- превью: `schemes/thumbs/towers_stark-tower_mcbuild_x.png`
- флаги: duplicate-name, franchise
- комментарий: высокая башня из синего стекла со шпилем; в имени отсылка к Marvel

### Stark Tower

- файл: `towers_stark-tower_mcbuild_x-2.schem` · категория: **towers** · теги: large|tall|tower · 57x133x37 · 23343 блоков · источник: mcbuild
- превью: `schemes/thumbs/towers_stark-tower_mcbuild_x-2.png`
- флаги: duplicate-name, franchise
- комментарий: та же башня из синего стекла со шпилем — вторая копия в этом батче

### Stark Tower

- файл: `towers_stark-tower_mcbuild_x-3.schem` · категория: **towers** · теги: huge|tall|tower · 101x208x49 · 60638 блоков · источник: mcbuild
- превью: `schemes/thumbs/towers_stark-tower_mcbuild_x-3.png`
- флаги: duplicate-name, franchise
- комментарий: стеклянная башня со скошенным фасадом; кинокомиксная отсылка есть только в имени, на картинке её нет

### Massive Skyscraper Structure

- файл: `towers_massive-skyscraper-structure_mc-mod_x.schem` · категория: **towers** · теги: medium|tall|tower · 20x200x20 · 14072 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_massive-skyscraper-structure_mc-mod_x.png`
- флаги: meta-word-in-name
- комментарий: тонкая глухая башня с длинным шпилем, мощного небоскрёба с окнами не видно

### Factory and Train Station Structure

- файл: `transport_factory-and-train-station-structure_buildschematics_x.nbt` · категория: **transport** · теги: medium|station · 34x20x30 · 2262 блоков · источник: buildschematics
- превью: `schemes/thumbs/transport_factory-and-train-station-structure_buildschematics_x.png`
- флаги: meta-word-in-name
- комментарий: Дугообразный навес с рядами деревьев вокруг: и завод, и станция читаются с натяжкой.

### Single Cart Metro Train

- файл: `transport_single-cart-metro-train_buildschematics_x.nbt` · категория: **transport** · теги: car|tiny · 14x5x5 · 92 блоков · источник: buildschematics
- превью: `schemes/thumbs/transport_single-cart-metro-train_buildschematics_x.png`
- флаги: non-building-in-name
- комментарий: удлинённый вагончик коричнево-жёлтых тонов, метро читается с натяжкой

### Sand Palace Station

- файл: `transport_sand-palace-station_mcbuild_x.schem` · категория: **transport** · теги: large|station|tall · 87x45x115 · 247568 блоков · источник: mcbuild
- превью: `schemes/thumbs/transport_sand-palace-station_mcbuild_x.png`
- флаги: duplicate-name
- комментарий: длинный песочный комплекс у озера с набережной и дорогой; вокзальная функция на превью не читается

### 29-Story Modern Parking Garage Structure

- файл: `transport_story-modern-parking-garage-structure_mc-mod_x.schem` · категория: **transport** · теги: huge|modern|park|parking|tall · 81x177x71 · 426226 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_story-modern-parking-garage-structure_mc-mod_x.png`
- флаги: meta-word-in-name · теги: -park · разошлись правила и картинка (words→parks, image→ok)
- комментарий: серая башня с горизонтальными рядами этажей, паркинг неочевиден; зелёного парка нет

### Minecraft Railway Station

- файл: `transport_minecraft-railway-station_mc-mod_x.schem` · категория: **transport** · теги: station|tiny · 17x5x18 · 575 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_minecraft-railway-station_mc-mod_x.png`
- флаги: franchise
- комментарий: низкое серое здание с красными блоками, рельсов и платформы не видно

### AxiumSA Medium Boat

- файл: `vehicles_axiumsa-medium-boat_buildschematics_x.schem` · категория: **vehicles** · теги: boat|medium|tall · 29x46x65 · 2851 блоков · источник: buildschematics
- превью: `schemes/thumbs/vehicles_axiumsa-medium-boat_buildschematics_x.png`
- флаги: vehicle
- комментарий: Виден лишь каркас деревянного корпуса с веслами, наружная обшивка не закончена.

### Yellow and Red Lighthouse Structure

- файл: `waterfront_yellow-and-red-lighthouse-structure_buildschematics_x.schem` · категория: **waterfront** · теги: house|medium|tall|water · 21x53x21 · 2716 блоков · источник: buildschematics
- превью: `schemes/thumbs/waterfront_yellow-and-red-lighthouse-structure_buildschematics_x.png`
- флаги: meta-word-in-name · теги: -house
- комментарий: высокий цилиндрический маяк с красной вершиной, но жёлтого цвета и дома здесь нет

### Massive Minecraft Bridge

- файл: `bridges_massive-minecraft-bridge_mc-mod_x.schem` · категория: **bridges** · теги: bridge|large|tall · 25x75x115 · 43574 блоков · источник: mc-mod
- превью: `schemes/thumbs/bridges_massive-minecraft-bridge_mc-mod_x.png`
- флаги: franchise
- комментарий: каменный мост на массивных опорах с перилами и дорогой сверху, читается

### Italian Gelato Shop Small Build

- файл: `commercial_italian-gelato-shop-small-build_buildschematics_262.schem` · категория: **commercial** · теги: medium|shop · 36x30x29 · 1475 блоков · источник: buildschematics
- превью: `schemes/thumbs/commercial_italian-gelato-shop-small-build_buildschematics_262.png`
- флаги: meta-word-in-name
- комментарий: небольшой кремовый магазинчик с навесом, витринами и наружной лестницей, размер сходится

### Modern Burger Cafe With Elevator

- файл: `commercial_modern-burger-cafe-with-elevator_buildschematics_x.schem` · категория: **commercial** · теги: modern|small · 21x27x24 · 6552 блоков · источник: buildschematics
- превью: `schemes/thumbs/commercial_modern-burger-cafe-with-elevator_buildschematics_x.png`
- флаги: non-building-in-name
- комментарий: компактное здание с витринами, навесами и входной группой, коммерческий характер виден

### PokeMart Shop

- файл: `commercial_pokemart-shop_buildschematics_x.schem` · категория: **commercial** · теги: shop|tiny · 15x9x10 · 711 блоков · источник: buildschematics
- превью: `schemes/thumbs/commercial_pokemart-shop_buildschematics_x.png`
- флаги: franchise
- комментарий: голубой кубический магазин на газоне, но название связано с франшизой Pokémon

### Minecraft Gas Station Build

- файл: `commercial_minecraft-gas-station-build-2_mc-mod_x.schem` · категория: **commercial** · теги: small|station · 16x6x30 · 632 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_minecraft-gas-station-build-2_mc-mod_x.png`
- флаги: franchise, meta-word-in-name · разошлись правила и картинка (words→industrial, image→ok)
- комментарий: красное здание и отдельный навес на столбах, характерный для заправки

### Magical Tree Structure

- файл: `decor_magical-tree-structure_buildschematics_x.schem` · категория: **decor** · теги: tiny|tree · 7x11x7 · 84 блоков · источник: buildschematics
- превью: `schemes/thumbs/decor_magical-tree-structure_buildschematics_x.png`
- флаги: meta-word-in-name, non-real/fantasy
- комментарий: крошечное деревце с бледной кроной на зелёном плинте, теги tiny и tree сходятся

### Big Tree

- файл: `decor_big-tree_mcbuild_x.schem` · категория: **decor** · теги: large|tall|tree · 56x58x51 · 2833 блоков · источник: mcbuild
- превью: `schemes/thumbs/decor_big-tree_mcbuild_x.png`
- флаги: duplicate-name
- комментарий: высокое дерево с редкой коричневой кроной, зелени почти нет

### Desert City

- файл: `decor_desert-city_mcbuild_x.schem` · категория: **decor** · теги: large · 79x25x84 · 30147 блоков · источник: mcbuild
- превью: `schemes/thumbs/decor_desert-city_mcbuild_x.png`
- флаги: duplicate-name
- комментарий: песчаный укреплённый квартал с дворами, воротами и низкими постройками

### Big tree

- файл: `decor_big-tree_mcbuild_x-2.schem` · категория: **decor** · теги: medium|tall|tree · 45x44x44 · 3020 блоков · источник: mcbuild
- превью: `schemes/thumbs/decor_big-tree_mcbuild_x-2.png`
- флаги: duplicate-name
- комментарий: крупное дерево без листвы с толстым стволом и ветвями, читается

### Desert city

- файл: `decor_desert-city_mcbuild_x-2.schem` · категория: **decor** · теги: large · 79x25x84 · 30147 блоков · источник: mcbuild
- превью: `schemes/thumbs/decor_desert-city_mcbuild_x-2.png`
- флаги: duplicate-name
- комментарий: песочный город-крепость: стены с башнями по углам и плотная застройка внутри

### Central Fountain Maze Schematic

- файл: `parks_central-fountain-maze-schematic_mc-mod_x.schem` · категория: **parks** · теги: fountain|medium|water · 60x7x55 · 3265 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_central-fountain-maze-schematic_mc-mod_x.png`
- флаги: meta-word-in-name · разошлись правила и картинка (words→decor, image→ok)
- комментарий: зелёный лабиринт из невысоких изгородей с круглым фонтаном в центре

### Gothic Cathedral Structure

- файл: `public_gothic-cathedral-structure-2_buildschematics_x.schem` · категория: **public** · теги: church|large|tall · 66x52x107 · 29871 блоков · источник: buildschematics
- превью: `schemes/thumbs/public_gothic-cathedral-structure-2_buildschematics_x.png`
- флаги: meta-word-in-name
- комментарий: Большой готический собор с аркадами, контрфорсами и башней над алтарной частью.

### Gothic Church Structure

- файл: `public_gothic-church-structure_buildschematics_x.schem` · категория: **public** · теги: church|medium · 25x31x22 · 2032 блоков · источник: buildschematics
- превью: `schemes/thumbs/public_gothic-church-structure_buildschematics_x.png`
- флаги: meta-word-in-name
- комментарий: Готическая церковь с острым шпилем, контрфорсами и круглым окном на фасаде.

### Sao Paulo Central Train Station Structure

- файл: `public_sao-paulo-central-train-station-structure_buildschematics_x.schem` · категория: **public** · теги: large|station|tall · 69x77x68 · 40838 блоков · источник: buildschematics
- превью: `schemes/thumbs/public_sao-paulo-central-train-station-structure_buildschematics_x.png`
- флаги: meta-word-in-name · разошлись правила и картинка (words→transport, image→ok)
- комментарий: крупный вокзал со светло-голубым остеклением и высоким объёмом

### Minecraft - Vet Clinic

- файл: `public_minecraft---vet-clinic_mcbuild_x.schem` · категория: **public** · теги: hospital|medium · 38x25x46 · 6804 блоков · источник: mcbuild
- превью: `schemes/thumbs/public_minecraft---vet-clinic_mcbuild_x.png`
- флаги: franchise
- комментарий: серо-белое здание с витринами и синими акцентами вдоль фасада, читается

### Resident Evil 4 Church

- файл: `public_resident-evil-4-church_mcbuild_x.schem` · категория: **public** · теги: church|medium · 37x40x33 · 4890 блоков · источник: mcbuild
- превью: `schemes/thumbs/public_resident-evil-4-church_mcbuild_x.png`
- флаги: franchise
- комментарий: серый храм с шпилем, контрфорсами и пристройкой, у входа цветник

### Ancient Greek Library Structure

- файл: `public_ancient-greek-library-structure_mc-mod_x.schem` · категория: **public** · теги: library|medium · 48x37x44 · 19587 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_ancient-greek-library-structure_mc-mod_x.png`
- флаги: meta-word-in-name
- комментарий: античная колоннада с фризом и ступенчатым цоколем, крыша плоская, читается

### Mediterranean Plaza Build

- файл: `public_mediterranean-plaza-build_mc-mod_x.schem` · категория: **public** · теги: medium|park · 36x14x34 · 1850 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_mediterranean-plaza-build_mc-mod_x.png`
- флаги: meta-word-in-name · разошлись правила и картинка (words→commercial, image→ok)
- комментарий: вымощенная площадь с газонами, деревьями и рядами фонарей-колонн

### Minecraft Hospital Building

- файл: `public_minecraft-hospital-building_mc-mod_x.schem` · категория: **public** · теги: hospital|medium|tall · 21x56x36 · 8043 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_minecraft-hospital-building_mc-mod_x.png`
- флаги: franchise
- комментарий: высотный корпус со стеклом и плоской синей кровлей под вертолётную площадку

### Minecraft Soccer Stadium Schematic

- файл: `public_minecraft-soccer-stadium-schematic_mc-mod_x.schem` · категория: **public** · теги: medium|stadium · 34x13x54 · 5747 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_minecraft-soccer-stadium-schematic_mc-mod_x.png`
- флаги: franchise, meta-word-in-name
- комментарий: стадион с зелёным полем, трибунами и фигурками игроков на площадке

### Minecraftia Elementary School Blue and White Campus

- файл: `public_minecraftia-elementary-school-blue-and-white_mc-mod_x.schem` · категория: **public** · теги: huge|school|tall · 149x49x114 · 126389 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_minecraftia-elementary-school-blue-and-white_mc-mod_x.png`
- флаги: franchise
- комментарий: крупный сине-белый учебный корпус с внутренним двором и двумя крыльями

### Cardiff Townhouse - Multi-Story Shop and Residence

- файл: `residential_cardiff-townhouse-multi-story-shop-and-resid_buildschematics_x.schem` · категория: **residential** · теги: apartment|car|house|medium|shop · 22x30x26 · 5775 блоков · источник: buildschematics
- превью: `schemes/thumbs/residential_cardiff-townhouse-multi-story-shop-and-resid_buildschematics_x.png`
- флаги: non-building-in-name
- комментарий: Многоэтажный таунхаус с витриной и навесом на первом этаже, выше жилые ярусы.

### Large Modern House

- файл: `residential_large-modern-house_buildschematics_x.schem` · категория: **residential** · теги: house|large|modern · 53x32x73 · 41584 блоков · источник: buildschematics
- превью: `schemes/thumbs/residential_large-modern-house_buildschematics_x.png`
- флаги: duplicate-name
- комментарий: современный серый дом с плоской крышей и каменным основанием на газоне, всё сходится

### Medium Townhouse Structure

- файл: `residential_medium-townhouse-structure_buildschematics_x.schem` · категория: **residential** · теги: house|medium · 21x37x39 · 11326 блоков · источник: buildschematics
- превью: `schemes/thumbs/residential_medium-townhouse-structure_buildschematics_x.png`
- флаги: meta-word-in-name
- комментарий: коричневый таунхаус с окнами и балконами, пропорции и размер названию соответствуют

### Mansion

- файл: `residential_mansion_mcbuild_x.schem` · категория: **residential** · теги: house|large · 81x40x76 · 56861 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_mansion_mcbuild_x.png`
- флаги: duplicate-name
- комментарий: крупный особняк с несколькими крыльями, камнем и деревом в отделке

### Modern Apartment Building

- файл: `residential_modern-apartment-building_mcbuild_x.schem` · категория: **residential** · теги: apartment|large|modern|tall · 47x83x46 · 29718 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_modern-apartment-building_mcbuild_x.png`
- флаги: duplicate-name
- комментарий: высокий серый дом с рядами окон и балконами на зелёном участке

### Big minecraft modern house

- файл: `residential_big-minecraft-modern-house_mcbuild_x.schem` · категория: **residential** · теги: house|medium|modern · 68x17x85 · 40078 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_big-minecraft-modern-house_mcbuild_x.png`
- флаги: franchise
- комментарий: широкий низкий дом с плоской крышей, бассейном и большим газоном

### Modern Mansion

- файл: `residential_modern-mansion_mcbuild_x.schem` · категория: **residential** · теги: house|large|modern · 140x27x112 · 125163 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_modern-mansion_mcbuild_x.png`
- флаги: duplicate-name
- комментарий: огромный белый особняк с плоской крышей и большим бассейном

### Iron Man's Mansion

- файл: `residential_iron-man-s-mansion_mcbuild_x.schem` · категория: **residential** · теги: house|huge · 142x35x147 · 35276 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_iron-man-s-mansion_mcbuild_x.png`
- флаги: duplicate-name, franchise
- комментарий: огромный бело-серый особняк с изогнутыми террасами и подъездами по периметру

### Classic Modern House

- файл: `residential_classic-modern-house_mcbuild_x.schem` · категория: **residential** · теги: house|large|modern · 68x36x70 · 87011 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_classic-modern-house_mcbuild_x.png`
- флаги: duplicate-name
- комментарий: современный одноэтажный дом с плоскими кровлями, внутренним двором и бассейном

### Modern Apartment Building

- файл: `residential_modern-apartment-building_mcbuild_x-2.schem` · категория: **residential** · теги: apartment|large|modern|tall · 58x63x57 · 29595 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_modern-apartment-building_mcbuild_x-2.png`
- флаги: duplicate-name
- комментарий: высотный жилой дом с балконами, деревянными панелями и остеклённым цоколем

### Traditional House

- файл: `residential_traditional-house_mcbuild_x.schem` · категория: **residential** · теги: house|large · 76x24x66 · 15201 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_traditional-house_mcbuild_x.png`
- флаги: duplicate-name
- комментарий: крупный деревянный дом с террасами и белыми наличниками вдоль фасада

### Japanese Style House

- файл: `residential_japanese-style-house_mcbuild_x.schem` · категория: **residential** · теги: house|small · 21x17x24 · 2060 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_japanese-style-house_mcbuild_x.png`
- флаги: duplicate-name
- комментарий: деревянная постройка с многоярусной пирамидальной кровлей и наличниками

### Traditional house

- файл: `residential_traditional-house_mcbuild_x-2.schem` · категория: **residential** · теги: house|medium · 56x24x54 · 9186 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_traditional-house_mcbuild_x-2.png`
- флаги: duplicate-name
- комментарий: традиционный дом с высокой двускатной кровлёй и изогнутым подъездом, читается

### Modern House

- файл: `residential_modern-house_mcbuild_x.schem` · категория: **residential** · теги: house|medium|modern · 61x26x52 · 15740 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_modern-house_mcbuild_x.png`
- флаги: duplicate-name
- комментарий: одно-двухэтажный модерн-дом из дерева и стекла на ровном участке, читается

### Modern House

- файл: `residential_modern-house_mcbuild_x-2.schem` · категория: **residential** · теги: house|large|modern · 121x24x124 · 69453 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_modern-house_mcbuild_x-2.png`
- флаги: duplicate-name
- комментарий: модерн-дом с бассейном, мощением и деревьями на широком участке, читается

### Classic Modern House

- файл: `residential_classic-modern-house_mcbuild_x-2.schem` · категория: **residential** · теги: house|large|modern · 68x36x70 · 87011 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_classic-modern-house_mcbuild_x-2.png`
- флаги: duplicate-name
- комментарий: стеклянный модерн-дом с бассейном на холмистом участке, читается

### Traditional Mansion

- файл: `residential_traditional-mansion_mcbuild_x.schem` · категория: **residential** · теги: house|huge · 177x34x141 · 131065 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_traditional-mansion_mcbuild_x.png`
- флаги: duplicate-name
- комментарий: крупное традиционное поместье: деревянные дома, дороги, два пруда и деревья на участке

### Modern house

- файл: `residential_modern-house_mcbuild_x-3.schem` · категория: **residential** · теги: house|medium|modern · 60x18x77 · 23115 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_modern-house_mcbuild_x-3.png`
- флаги: duplicate-name
- комментарий: низкий современный дом с плоскими кровлями, деревянными вставками и газоном вокруг

### Japanese style house

- файл: `residential_japanese-style-house_mcbuild_x-2.schem` · категория: **residential** · теги: house|small · 21x17x24 · 2060 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_japanese-style-house_mcbuild_x-2.png`
- флаги: duplicate-name
- комментарий: деревянный дом с многоярусной тёмной крышей и красными деталями на зелёном участке

### Modern Mansion

- файл: `residential_modern-mansion_mcbuild_x-2.schem` · категория: **residential** · теги: house|large|modern · 89x38x119 · 65897 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_modern-mansion_mcbuild_x-2.png`
- флаги: duplicate-name
- комментарий: крупный белый особняк у дороги и водоёма, вокруг газон, деревья и подъезд

### Mansion

- файл: `residential_mansion_mcbuild_x-2.schem` · категория: **residential** · теги: house|huge|tall · 147x42x185 · 226072 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_mansion_mcbuild_x-2.png`
- флаги: duplicate-name
- комментарий: крупный особняк с серыми скатными крышами, подъездом и прогулочной зоной на участке

### Traditional mansion

- файл: `residential_traditional-mansion_mcbuild_x-2.schem` · категория: **residential** · теги: house|large · 80x28x83 · 36074 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_traditional-mansion_mcbuild_x-2.png`
- флаги: duplicate-name
- комментарий: традиционный особняк с тёмной кровлей и подъездной дорожкой, светлый газон

### Large modern house

- файл: `residential_large-modern-house_mcbuild_x.schem` · категория: **residential** · теги: house|large|modern · 104x34x53 · 55908 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_large-modern-house_mcbuild_x.png`
- флаги: duplicate-name
- комментарий: длинный низкий дом с террасами вдоль дороги, участок озеленён

### Modern house

- файл: `residential_modern-house_mcbuild_x-4.schem` · категория: **residential** · теги: house|medium|modern · 56x22x51 · 26792 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_modern-house_mcbuild_x-4.png`
- флаги: duplicate-name
- комментарий: современный дом с плоской кровлёй, бассейном и газоном, читается

### Modern house

- файл: `residential_modern-house_mcbuild_x-5.schem` · категория: **residential** · теги: house|medium|modern · 61x31x52 · 13879 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_modern-house_mcbuild_x-5.png`
- флаги: duplicate-name
- комментарий: двухэтажный дом в бело-серой гамме с деревом, стеклом и лужайкой

### Futuristic house

- файл: `residential_futuristic-house_mcbuild_x.schem` · категория: **residential** · теги: house|large|modern · 72x24x78 · 35345 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_futuristic-house_mcbuild_x.png`
- флаги: duplicate-name
- комментарий: дом с плавными террасными формами на зелёном склоне, облик футуристичный

### Modern mansion

- файл: `residential_modern-mansion_mcbuild_x-3.schem` · категория: **residential** · теги: house|large|modern · 140x27x112 · 125163 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_modern-mansion_mcbuild_x-3.png`
- флаги: duplicate-name
- комментарий: крупный белый особняк с изогнутыми объёмами, бассейном и газоном

### Modern house

- файл: `residential_modern-house_mcbuild_x-6.schem` · категория: **residential** · теги: house|medium|modern · 38x21x31 · 7334 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_modern-house_mcbuild_x-6.png`
- флаги: duplicate-name
- комментарий: современный дом серо-белой гаммы с деревянными акцентами и плоской кровлей

### Modern house

- файл: `residential_modern-house_mcbuild_x-7.schem` · категория: **residential** · теги: house|medium|modern · 36x25x44 · 9337 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_modern-house_mcbuild_x-7.png`
- флаги: duplicate-name
- комментарий: современный дом со скошенными кровлями, стеклом и газоном вокруг

### Large modern house

- файл: `residential_large-modern-house_mcbuild_x-2.schem` · категория: **residential** · теги: house|medium|modern · 60x22x59 · 18555 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_large-modern-house_mcbuild_x-2.png`
- флаги: duplicate-name
- комментарий: современный белый дом с бассейном, террасой и подъездной площадкой

### Modern house

- файл: `residential_modern-house_mcbuild_x-8.schem` · категория: **residential** · теги: house|medium|modern · 46x23x46 · 10697 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_modern-house_mcbuild_x-8.png`
- флаги: duplicate-name
- комментарий: ступенчатый дом из серо-коричневых объёмов с круглыми световодами на крыше

### Modern house

- файл: `residential_modern-house_mcbuild_x-9.schem` · категория: **residential** · теги: house|medium|modern · 43x28x67 · 14362 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_modern-house_mcbuild_x-9.png`
- флаги: duplicate-name
- комментарий: длинный современный дом с плоскими кровлями, деревянной террасой и газоном

### Large modern house

- файл: `residential_large-modern-house_mcbuild_x-3.schem` · категория: **residential** · теги: house|huge|modern · 141x37x210 · 111147 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_large-modern-house_mcbuild_x-3.png`
- флаги: duplicate-name
- комментарий: длинный белый дом с бассейном на огромном газоне среди деревьев с красной листвой

### Modern House

- файл: `residential_modern-house_mcbuild_x-10.schem` · категория: **residential** · теги: house|modern|small · 22x12x29 · 2768 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_modern-house_mcbuild_x-10.png`
- флаги: duplicate-name
- комментарий: небольшой дом с широкой серой крышей, белыми стенами и площадкой перед входом

### Beach House

- файл: `residential_beach-house_mcbuild_x-2.schem` · категория: **residential** · теги: house|medium · 35x32x33 · 5323 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_beach-house_mcbuild_x-2.png`
- флаги: duplicate-name
- комментарий: деревянный дом с широкой террасой, колоннами и лестницей на приподнятом основании

### Mansion

- файл: `residential_mansion_mcbuild_x-3.schem` · категория: **residential** · теги: house|huge|tall · 103x97x66 · 42595 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_mansion_mcbuild_x-3.png`
- флаги: duplicate-name
- комментарий: крупный особняк с множеством острых крыш и башенками, к нему ведёт красная дорожка

### Blue-Orange Apartment Building Progress

- файл: `residential_blue-orange-apartment-building-progress_mc-mod_x.schem` · категория: **residential** · теги: apartment|huge · 95x40x141 · 68896 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_blue-orange-apartment-building-progress_mc-mod_x.png`
- флаги: empty
- комментарий: крупный строящийся каркас с рядами колонн и внутренним ядром, стадия прогресса

### Blue Orange Apartment Building Under Construction

- файл: `residential_blue-orange-apartment-building-under-constru_mc-mod_x.schem` · категория: **residential** · теги: apartment|large · 95x36x141 · 24065 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_blue-orange-apartment-building-under-constru_mc-mod_x.png`
- флаги: empty
- комментарий: недостроенный каркас многоэтажки на пятне застройки, названию соответствует

### Minecraft Build Book House

- файл: `residential_minecraft-build-book-house_mc-mod_x.schem` · категория: **residential** · теги: house|medium · 58x28x47 · 17404 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_minecraft-build-book-house_mc-mod_x.png`
- флаги: franchise, meta-word-in-name
- комментарий: земельный участок с двухэтажным домом и большим бассейном, жильё видно

### Realistic Highway Tunnel For Minecraft

- файл: `roads_realistic-highway-tunnel-for-minecraft_buildschematics_x.schem` · категория: **roads** · теги: large|road · 51x25x382 · 293201 блоков · источник: buildschematics
- превью: `schemes/thumbs/roads_realistic-highway-tunnel-for-minecraft_buildschematics_x.png`
- флаги: franchise, meta-word-in-name
- комментарий: длинный бетонный тоннель с порталом и подъездами, читается

### Candy Cane Road Light

- файл: `roads_candy-cane-road-light_mc-mod_x.schem` · категория: **roads** · теги: road|tiny · 6x7x3 · 12 блоков · источник: mc-mod
- превью: `schemes/thumbs/roads_candy-cane-road-light_mc-mod_x.png`
- флаги: almost-empty
- комментарий: голубая арка-фонарь в форме леденца, отдельно стоящая компактная деталь

### Modern Apartment Tower &#8211; 10 Floors

- файл: `towers_modern-apartment-tower-10-floors_buildschematics_x.schem` · категория: **towers** · теги: apartment|large|modern|tall|tower · 58x63x57 · 29903 блоков · источник: buildschematics
- превью: `schemes/thumbs/towers_modern-apartment-tower-10-floors_buildschematics_x.png`
- флаги: duplicate-name
- комментарий: бледно-голубая башня с балконами и чёткими этажами, около десяти этажей правдоподобно

### Twin Towers Gate with Auto Night Protection

- файл: `towers_twin-towers-gate-with-auto-night-protection_buildschematics_x.schem` · категория: **towers** · теги: tiny|tower · 20x14x7 · 868 блоков · источник: buildschematics
- превью: `schemes/thumbs/towers_twin-towers-gate-with-auto-night-protection_buildschematics_x.png`
- флаги: fantasy, non-building-in-name
- комментарий: каменные ворота с двумя зубчатыми башнями и факелами: средневековье, не реальная архитектура

### Blue Modern Tower

- файл: `towers_blue-modern-tower_mcbuild_x.schem` · категория: **towers** · теги: medium|modern|tall|tower · 27x102x38 · 12551 блоков · источник: mcbuild
- превью: `schemes/thumbs/towers_blue-modern-tower_mcbuild_x.png`
- флаги: duplicate-name
- комментарий: узкая высокая башня из голубого стекла и светлого бетона, читается

### Blue Modern Tower

- файл: `towers_blue-modern-tower_mcbuild_x-2.schem` · категория: **towers** · теги: medium|modern|tall|tower · 27x102x38 · 12551 блоков · источник: mcbuild
- превью: `schemes/thumbs/towers_blue-modern-tower_mcbuild_x-2.png`
- флаги: duplicate-name
- комментарий: повтор той же голубой стеклянной башни — полный дубль в батче

### Assassins Creed Tower

- файл: `towers_assassins-creed-tower_mcbuild_x.schem` · категория: **towers** · теги: huge|tall|tower · 64x124x64 · 25846 блоков · источник: mcbuild
- превью: `schemes/thumbs/towers_assassins-creed-tower_mcbuild_x.png`
- флаги: franchise
- комментарий: крепостная башня из серых блоков с золотыми зубцами и ярусами

### Twins Towers Gate

- файл: `towers_twins-towers-gate_mcbuild_x.schem` · категория: **towers** · теги: small|tower · 10x20x18 · 1087 блоков · источник: mcbuild
- превью: `schemes/thumbs/towers_twins-towers-gate_mcbuild_x.png`
- флаги: non-building-in-name
- комментарий: две небольшие башни с золотыми шпилями, соединённые воротами с аркой

### Age of Empires Sentry Tower

- файл: `towers_age-of-empires-sentry-tower_mc-mod_x.schem` · категория: **towers** · теги: small|tower · 22x14x17 · 865 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_age-of-empires-sentry-tower_mc-mod_x.png`
- флаги: franchise
- комментарий: низкая каменная башенка с широким плоским деревянным навесом на столбах; отсылка к игре

### Avengers Tower Build

- файл: `towers_avengers-tower-build_mc-mod_x.schem` · категория: **towers** · теги: medium|tall|tower · 14x48x31 · 1825 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_avengers-tower-build_mc-mod_x.png`
- флаги: franchise, meta-word-in-name
- комментарий: высотная башня с расширенной верхушкой и красно-белой отделкой, силуэт Мстителей

### Modern Apartment Tower &#8211; 10 Floors

- файл: `towers_modern-apartment-tower-10-floors_mc-mod_x.schem` · категория: **towers** · теги: apartment|large|modern|tall|tower · 37x168x37 · 40202 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_modern-apartment-tower-10-floors_mc-mod_x.png`
- флаги: duplicate-name
- комментарий: стройная башня примерно на десять этажей с балконами по периметру

### Electric Passenger Train Coach - First Class

- файл: `transport_electric-passenger-train-coach-first-class_buildschematics_x.nbt` · категория: **transport** · теги: tiny · 7x7x32 · 317 блоков · источник: buildschematics
- превью: `schemes/thumbs/transport_electric-passenger-train-coach-first-class_buildschematics_x.png`
- флаги: vehicle
- комментарий: Светлый пассажирский вагон с жёлтой полосой, рядами окон и крышей.

### First Class Passenger Train Car

- файл: `transport_first-class-passenger-train-car_buildschematics_x.nbt` · категория: **transport** · теги: car|tiny · 35x7x7 · 390 блоков · источник: buildschematics
- превью: `schemes/thumbs/transport_first-class-passenger-train-car_buildschematics_x.png`
- флаги: non-building-in-name, vehicle · разошлись правила и картинка (words→vehicles, image→ok)
- комментарий: Длинный вагон с красным блоком на торце и рядом круглых элементов вдоль борта.

### Japanese Electric Train Coach Schematic

- файл: `transport_japanese-electric-train-coach-schematic_buildschematics_x.nbt` · категория: **transport** · теги: tiny · 7x7x26 · 278 блоков · источник: buildschematics
- превью: `schemes/thumbs/transport_japanese-electric-train-coach-schematic_buildschematics_x.png`
- флаги: meta-word-in-name
- комментарий: серый вагон электрички с оконной полосой и буферами, компактный и читаемый

### Passenger Train Carriage

- файл: `transport_passenger-train-carriage_buildschematics_x.nbt` · категория: **transport** · теги: car|tiny · 5x6x21 · 181 блоков · источник: buildschematics
- превью: `schemes/thumbs/transport_passenger-train-carriage_buildschematics_x.png`
- флаги: non-building-in-name · разошлись правила и картинка (words→vehicles, image→ok)
- комментарий: вытянутый пассажирский вагон с тёмными окнами, силуэт читается

### Catering Truck for Airports

- файл: `vehicles_catering-truck-for-airports_buildschematics_x.schem` · категория: **vehicles** · теги: car|tiny · 5x6x12 · 103 блоков · источник: buildschematics
- превью: `schemes/thumbs/vehicles_catering-truck-for-airports_buildschematics_x.png`
- флаги: non-building-in-name, vehicle · разошлись правила и картинка (words→transport, image→ok)
- комментарий: Белый грузовик с высоким изотермическим кузовом и кабиной, размер компактный.

### Champion Race Car

- файл: `vehicles_champion-race-car_buildschematics_x.nbt` · категория: **vehicles** · теги: car|small · 18x12x11 · 240 блоков · источник: buildschematics
- превью: `schemes/thumbs/vehicles_champion-race-car_buildschematics_x.png`
- флаги: non-building-in-name, vehicle
- комментарий: Низкий гоночный автомобиль красно-белого цвета с широким обвесом.

### Double Cab Crane Truck

- файл: `vehicles_double-cab-crane-truck_buildschematics_x.schem` · категория: **vehicles** · теги: car|tiny · 5x4x13 · 61 блоков · источник: buildschematics
- превью: `schemes/thumbs/vehicles_double-cab-crane-truck_buildschematics_x.png`
- флаги: non-building-in-name, vehicle
- комментарий: Грузовик с двухрядной кабиной и выдвижной стрелой крана на шасси.

### Heavy Duty Off-Road Dump Truck

- файл: `vehicles_heavy-duty-off-road-dump-truck_buildschematics_x.schem` · категория: **vehicles** · теги: car|road|tiny · 18x7x7 · 177 блоков · источник: buildschematics
- превью: `schemes/thumbs/vehicles_heavy-duty-off-road-dump-truck_buildschematics_x.png`
- флаги: non-building-in-name, vehicle
- комментарий: Короткий самосвал с крупным кузовом, кабиной и толстыми внедорожными колёсами.

### Heavy-Duty Tractor-Trailer with Self-Loader Truck

- файл: `vehicles_heavy-duty-tractor-trailer-with-self-loader-_buildschematics_x.schem` · категория: **vehicles** · теги: car|tiny · 24x6x5 · 177 блоков · источник: buildschematics
- превью: `schemes/thumbs/vehicles_heavy-duty-tractor-trailer-with-self-loader-_buildschematics_x.png`
- флаги: non-building-in-name, vehicle
- комментарий: Длинный грузовик с красной кабиной, серым прицепом и несколькими осями колёс.

### Covered Minecraft Bridge

- файл: `bridges_covered-minecraft-bridge_mc-mod_x.schem` · категория: **bridges** · теги: bridge|tiny · 4x5x29 · 290 блоков · источник: mc-mod
- превью: `schemes/thumbs/bridges_covered-minecraft-bridge_mc-mod_x.png`
- вердикт: undefined · флаги: franchise

### Elegant Marble Bridge Design

- файл: `bridges_elegant-marble-bridge-design_mc-mod_x.schem` · категория: **bridges** · теги: bridge|small · 20x21x7 · 573 блоков · источник: mc-mod
- превью: `schemes/thumbs/bridges_elegant-marble-bridge-design_mc-mod_x.png`
- вердикт: undefined

### Fallout 3 Inspired Overpass Ramp

- файл: `bridges_fallout-3-inspired-overpass-ramp_mc-mod_x.schem` · категория: **bridges** · теги: medium|tall · 47x45x29 · 4943 блоков · источник: mc-mod
- превью: `schemes/thumbs/bridges_fallout-3-inspired-overpass-ramp_mc-mod_x.png`
- вердикт: undefined · флаги: franchise

### Fallout 3 Style Overpass Structure

- файл: `bridges_fallout-3-style-overpass-structure_mc-mod_x.schem` · категория: **bridges** · теги: medium|tall · 39x42x40 · 4593 блоков · источник: mc-mod
- превью: `schemes/thumbs/bridges_fallout-3-style-overpass-structure_mc-mod_x.png`
- вердикт: undefined · флаги: franchise, meta-word-in-name

### Fallout 3 Style Overpass

- файл: `bridges_fallout-3-style-overpass_mc-mod_x.schem` · категория: **bridges** · теги: medium|tall · 48x42x29 · 4750 блоков · источник: mc-mod
- превью: `schemes/thumbs/bridges_fallout-3-style-overpass_mc-mod_x.png`
- вердикт: undefined · флаги: franchise

### Futuristic Marble Bridge

- файл: `bridges_futuristic-marble-bridge_mc-mod_x.schem` · категория: **bridges** · теги: bridge|modern|small · 45x22x7 · 1342 блоков · источник: mc-mod
- превью: `schemes/thumbs/bridges_futuristic-marble-bridge_mc-mod_x.png`
- вердикт: undefined

### Guadalupe River Bridge

- файл: `bridges_guadalupe-river-bridge_mc-mod_x.schem` · категория: **bridges** · теги: bridge|medium · 24x22x122 · 13584 блоков · источник: mc-mod
- превью: `schemes/thumbs/bridges_guadalupe-river-bridge_mc-mod_x.png`
- вердикт: undefined

### Integral Bridge Structure

- файл: `bridges_integral-bridge-structure_mc-mod_x.schem` · категория: **bridges** · теги: bridge|small · 49x12x7 · 726 блоков · источник: mc-mod
- превью: `schemes/thumbs/bridges_integral-bridge-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Jungle Spawn Bridge

- файл: `bridges_jungle-spawn-bridge_mc-mod_x.schem` · категория: **bridges** · теги: bridge|tiny · 5x5x28 · 243 блоков · источник: mc-mod
- превью: `schemes/thumbs/bridges_jungle-spawn-bridge_mc-mod_x.png`
- вердикт: undefined

### Large Stone Brick Bridge

- файл: `bridges_large-stone-brick-bridge_mc-mod_x.schem` · категория: **bridges** · теги: bridge|small · 7x19x68 · 3728 блоков · источник: mc-mod
- превью: `schemes/thumbs/bridges_large-stone-brick-bridge_mc-mod_x.png`
- вердикт: undefined

### Large Stone Bridge With Buildings

- файл: `bridges_large-stone-bridge-with-buildings_mc-mod_x.schem` · категория: **bridges** · теги: bridge|small · 37x25x8 · 1470 блоков · источник: mc-mod
- превью: `schemes/thumbs/bridges_large-stone-bridge-with-buildings_mc-mod_x.png`
- вердикт: undefined

### Massive Lava Tunnel With Minecart Track

- файл: `bridges_massive-lava-tunnel-with-minecart-track_mc-mod_x.schem` · категория: **bridges** · теги: car|medium · 11x4x1000 · 12710 блоков · источник: mc-mod
- превью: `schemes/thumbs/bridges_massive-lava-tunnel-with-minecart-track_mc-mod_x.png`
- вердикт: undefined

### Nordic Style Small Bridge

- файл: `bridges_nordic-style-small-bridge_mc-mod_x.schem` · категория: **bridges** · теги: bridge|shop|tiny · 18x9x8 · 418 блоков · источник: mc-mod
- превью: `schemes/thumbs/bridges_nordic-style-small-bridge_mc-mod_x.png`
- вердикт: undefined

### River Crossing Bridge

- файл: `bridges_river-crossing-bridge_mc-mod_x.schem` · категория: **bridges** · теги: bridge|small · 61x9x8 · 865 блоков · источник: mc-mod
- превью: `schemes/thumbs/bridges_river-crossing-bridge_mc-mod_x.png`
- вердикт: undefined

### Rustic Stone Bridge

- файл: `bridges_rustic-stone-bridge_mc-mod_x.schem` · категория: **bridges** · теги: bridge|tiny · 8x6x21 · 286 блоков · источник: mc-mod
- превью: `schemes/thumbs/bridges_rustic-stone-bridge_mc-mod_x.png`
- вердикт: undefined

### Scalable Long Bridge

- файл: `bridges_scalable-long-bridge_mc-mod_x.schem` · категория: **bridges** · теги: bridge|large|tall · 102x72x41 · 7697 блоков · источник: mc-mod
- превью: `schemes/thumbs/bridges_scalable-long-bridge_mc-mod_x.png`
- вердикт: undefined

### Simple Stone Bridge

- файл: `bridges_simple-stone-bridge_mc-mod_x.schem` · категория: **bridges** · теги: bridge|tiny · 5x8x41 · 657 блоков · источник: mc-mod
- превью: `schemes/thumbs/bridges_simple-stone-bridge_mc-mod_x.png`
- вердикт: undefined

### Simple Stone River Bridge

- файл: `bridges_simple-stone-river-bridge_mc-mod_x.schem` · категория: **bridges** · теги: bridge|small · 6x11x49 · 758 блоков · источник: mc-mod
- превью: `schemes/thumbs/bridges_simple-stone-river-bridge_mc-mod_x.png`
- вердикт: undefined

### Small Skybridge Design

- файл: `bridges_small-skybridge-design_mc-mod_x.schem` · категория: **bridges** · теги: bridge|shop|tiny · 10x9x17 · 274 блоков · источник: mc-mod
- превью: `schemes/thumbs/bridges_small-skybridge-design_mc-mod_x.png`
- вердикт: undefined

### Stone and Wood Survival Bridge

- файл: `bridges_stone-and-wood-survival-bridge_mc-mod_x.schem` · категория: **bridges** · теги: bridge|tiny · 7x8x29 · 317 блоков · источник: mc-mod
- превью: `schemes/thumbs/bridges_stone-and-wood-survival-bridge_mc-mod_x.png`
- вердикт: undefined

### Subway Tunnel Structure

- файл: `bridges_subway-tunnel-structure_mc-mod_x.schem` · категория: **bridges** · теги: tiny · 7x5x18 · 450 блоков · источник: mc-mod
- превью: `schemes/thumbs/bridges_subway-tunnel-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Suspended Bridge Minecraft Build

- файл: `bridges_suspended-bridge-minecraft-build_mc-mod_x.schem` · категория: **bridges** · теги: bridge|tiny · 10x8x20 · 409 блоков · источник: mc-mod
- превью: `schemes/thumbs/bridges_suspended-bridge-minecraft-build_mc-mod_x.png`
- вердикт: undefined · флаги: franchise, meta-word-in-name

### Suspension Cable Bridge

- файл: `bridges_suspension-cable-bridge_mc-mod_x.schem` · категория: **bridges** · теги: bridge|small · 53x18x13 · 1134 блоков · источник: mc-mod
- превью: `schemes/thumbs/bridges_suspension-cable-bridge_mc-mod_x.png`
- вердикт: undefined

### Wooden Bridge Design

- файл: `bridges_wooden-bridge-design_mc-mod_x.schem` · категория: **bridges** · теги: bridge|small · 9x10x32 · 606 блоков · источник: mc-mod
- превью: `schemes/thumbs/bridges_wooden-bridge-design_mc-mod_x.png`
- вердикт: undefined

### Wooden Bridge with Fences

- файл: `bridges_wooden-bridge-with-fences_mc-mod_x.schem` · категория: **bridges** · теги: bridge|small · 14x9x21 · 512 блоков · источник: mc-mod
- превью: `schemes/thumbs/bridges_wooden-bridge-with-fences_mc-mod_x.png`
- вердикт: undefined

### Industrial Style Bridge

- файл: `bridges_industrial-style-bridge_mc-mod_x.schematic` · категория: **bridges** · теги: bridge|medium · 85x19x13 · 2574 блоков · источник: mc-mod
- превью: `schemes/thumbs/bridges_industrial-style-bridge_mc-mod_x.png`
- вердикт: undefined

### Doughnut Shop Building

- файл: `commercial_doughnut-shop-building_mc-mod_x.schem` · категория: **commercial** · теги: shop|small · 21x16x16 · 583 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_doughnut-shop-building_mc-mod_x.png`
- вердикт: undefined

### Elegant City Hall For Small Towns

- файл: `commercial_elegant-city-hall-for-small-towns_mc-mod_x.schem` · категория: **commercial** · теги: medium|shop · 36x27x29 · 5999 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_elegant-city-hall-for-small-towns_mc-mod_x.png`
- вердикт: undefined

### Elegant Hotel With Bar And Dining

- файл: `commercial_elegant-hotel-with-bar-and-dining_mc-mod_x.schem` · категория: **commercial** · теги: hotel|small · 18x25x23 · 3815 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_elegant-hotel-with-bar-and-dining_mc-mod_x.png`
- вердикт: undefined

### EssentialsX Shop Setup

- файл: `commercial_essentialsx-shop-setup_mc-mod_x.schem` · категория: **commercial** · теги: large|shop|tall · 85x46x84 · 63930 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_essentialsx-shop-setup_mc-mod_x.png`
- вердикт: undefined

### Furnished Bank Building

- файл: `commercial_furnished-bank-building_mc-mod_x.schem` · категория: **commercial** · теги: bank|medium · 25x27x28 · 5720 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_furnished-bank-building_mc-mod_x.png`
- вердикт: undefined

### Furnished Family Home with Garage

- файл: `commercial_furnished-family-home-with-garage_mc-mod_x.schem` · категория: **commercial** · теги: house|large|parking · 61x38x101 · 24524 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_furnished-family-home-with-garage_mc-mod_x.png`
- вердикт: undefined

### Harbour Shops

- файл: `commercial_harbour-shops_mc-mod_x.schem` · категория: **commercial** · теги: medium|shop · 38x29x26 · 12497 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_harbour-shops_mc-mod_x.png`
- вердикт: undefined

### Home and Workshop Building

- файл: `commercial_home-and-workshop-building_mc-mod_x.schem` · категория: **commercial** · теги: house|shop|small · 20x13x14 · 1062 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_home-and-workshop-building_mc-mod_x.png`
- вердикт: undefined

### Large Modern Hotel &#8211; Jungle Planks

- файл: `commercial_large-modern-hotel-jungle-planks_mc-mod_x.schem` · категория: **commercial** · теги: hotel|medium|modern · 44x17x30 · 8029 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_large-modern-hotel-jungle-planks_mc-mod_x.png`
- вердикт: undefined

### Large Smithy Workshop

- файл: `commercial_large-smithy-workshop_mc-mod_x.schem` · категория: **commercial** · теги: shop|small · 19x21x15 · 1744 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_large-smithy-workshop_mc-mod_x.png`
- вердикт: undefined

### Market Stall

- файл: `commercial_market-stall_mc-mod_x.schem` · категория: **commercial** · теги: shop|tiny · 6x5x7 · 98 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_market-stall_mc-mod_x.png`
- вердикт: undefined

### Modern Coffee Shop

- файл: `commercial_modern-coffee-shop_mc-mod_x.schem` · категория: **commercial** · теги: modern|shop|small · 21x20x20 · 1350 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_modern-coffee-shop_mc-mod_x.png`
- вердикт: undefined

### Modern Food Shop

- файл: `commercial_modern-food-shop_mc-mod_x.schem` · категория: **commercial** · теги: modern|shop|small · 11x18x22 · 1517 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_modern-food-shop_mc-mod_x.png`
- вердикт: undefined

### Modern Gas Station And Shop

- файл: `commercial_modern-gas-station-and-shop_mc-mod_x.schem` · категория: **commercial** · теги: medium|modern|shop|station · 69x9x40 · 4147 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_modern-gas-station-and-shop_mc-mod_x.png`
- вердикт: undefined

### Modern Gas Station Exterior

- файл: `commercial_modern-gas-station-exterior_mc-mod_x.schem` · категория: **commercial** · теги: modern|small|station · 17x8x26 · 1638 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_modern-gas-station-exterior_mc-mod_x.png`
- вердикт: undefined

### Modern Gas Station &amp; Truck Stop

- файл: `commercial_modern-gas-station-truck-stop_mc-mod_x.schem` · категория: **commercial** · теги: car|medium|modern|station · 62x11x114 · 8958 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_modern-gas-station-truck-stop_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### Modern Gas Station With Store

- файл: `commercial_modern-gas-station-with-store_mc-mod_x.schem` · категория: **commercial** · теги: large|modern|shop|station · 74x22x128 · 19194 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_modern-gas-station-with-store_mc-mod_x.png`
- вердикт: undefined

### Modern Parallel Heights Hotel Building

- файл: `commercial_modern-parallel-heights-hotel-building_mc-mod_x.schem` · категория: **commercial** · теги: hotel|medium|modern · 30x30x64 · 8905 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_modern-parallel-heights-hotel-building_mc-mod_x.png`
- вердикт: undefined

### Modern Quartz Reserve Bank

- файл: `commercial_modern-quartz-reserve-bank_mc-mod_x.schem` · категория: **commercial** · теги: bank|medium|modern · 25x26x37 · 5996 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_modern-quartz-reserve-bank_mc-mod_x.png`
- вердикт: undefined

### Modern Style Shop

- файл: `commercial_modern-style-shop_mc-mod_x.schem` · категория: **commercial** · теги: modern|shop|small · 28x11x23 · 2932 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_modern-style-shop_mc-mod_x.png`
- вердикт: undefined

### Mr. Burns Small Structure

- файл: `commercial_mr-burns-small-structure_mc-mod_x.schem` · категория: **commercial** · теги: shop|small|tall · 13x42x17 · 1134 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_mr-burns-small-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Multiplayer Survival Base with Shop

- файл: `commercial_multiplayer-survival-base-with-shop_mc-mod_x.schem` · категория: **commercial** · теги: medium|shop · 32x16x40 · 5540 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_multiplayer-survival-base-with-shop_mc-mod_x.png`
- вердикт: undefined · флаги: non-real/fantasy

### Mythological Shopping Mall with Water Features

- файл: `commercial_mythological-shopping-mall-with-water-featur_mc-mod_x.schem` · категория: **commercial** · теги: huge|shop|tall · 91x94x91 · 46745 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_mythological-shopping-mall-with-water-featur_mc-mod_x.png`
- вердикт: undefined

### Pet Shop Building

- файл: `commercial_pet-shop-building_mc-mod_x.schem` · категория: **commercial** · теги: medium|shop · 35x28x29 · 3946 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_pet-shop-building_mc-mod_x.png`
- вердикт: undefined

### Rustic Wooden Shop &#8211; Medium Size

- файл: `commercial_rustic-wooden-shop-medium-size_mc-mod_x.schem` · категория: **commercial** · теги: large|shop · 64x33x64 · 25504 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_rustic-wooden-shop-medium-size_mc-mod_x.png`
- вердикт: undefined

### Shady Oaks Hotel Townhouse

- файл: `commercial_shady-oaks-hotel-townhouse_mc-mod_x.schem` · категория: **commercial** · теги: hotel|house|medium|tree · 38x17x45 · 5605 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_shady-oaks-hotel-townhouse_mc-mod_x.png`
- вердикт: undefined

### Small Carwash Station

- файл: `commercial_small-carwash-station_mc-mod_x.schem` · категория: **commercial** · теги: car|shop|station|tiny · 13x7x9 · 395 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_small-carwash-station_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### Small Chapel Structure

- файл: `commercial_small-chapel-structure_mc-mod_x.schem` · категория: **commercial** · теги: church|shop|small · 19x21x20 · 971 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_small-chapel-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Small Church

- файл: `commercial_small-church_mc-mod_x.schem` · категория: **commercial** · теги: church|medium|shop|tall · 23x115x29 · 29481 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_small-church_mc-mod_x.png`
- вердикт: undefined

### Small Concrete Bus Stop Schematic

- файл: `commercial_small-concrete-bus-stop-schematic_mc-mod_x.schem` · категория: **commercial** · теги: shop|small · 15x6x25 · 235 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_small-concrete-bus-stop-schematic_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name, non-building-in-name

### Small Desert Cactus Fountain

- файл: `commercial_small-desert-cactus-fountain_mc-mod_x.schem` · категория: **commercial** · теги: fountain|shop|small|water · 13x12x13 · 448 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_small-desert-cactus-fountain_mc-mod_x.png`
- вердикт: undefined

### Small Double Modern Church With Interior

- файл: `commercial_small-double-modern-church-with-interior_mc-mod_x.schem` · категория: **commercial** · теги: church|large|modern|shop|tall · 56x46x50 · 3606 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_small-double-modern-church-with-interior_mc-mod_x.png`
- вердикт: undefined

### Small Driving School

- файл: `commercial_small-driving-school_mc-mod_x.schem` · категория: **commercial** · теги: medium|school|shop · 41x6x76 · 5448 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_small-driving-school_mc-mod_x.png`
- вердикт: undefined

### Small Faction Base for Hardcore Players

- файл: `commercial_small-faction-base-for-hardcore-players_mc-mod_x.schem` · категория: **commercial** · теги: shop|small · 16x13x16 · 1358 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_small-faction-base-for-hardcore-players_mc-mod_x.png`
- вердикт: undefined

### Small Factory Shell Template

- файл: `commercial_small-factory-shell-template_mc-mod_x.schem` · категория: **commercial** · теги: shop|tiny · 13x7x9 · 432 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_small-factory-shell-template_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Small Garden Fountain

- файл: `commercial_small-garden-fountain-3_mc-mod_x.schem` · категория: **commercial** · теги: fountain|park|shop|tiny|water · 7x9x7 · 188 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_small-garden-fountain-3_mc-mod_x.png`
- вердикт: undefined

### Small Minecraft Church Building

- файл: `commercial_small-minecraft-church-building_mc-mod_x.schem` · категория: **commercial** · теги: church|medium|shop · 19x34x34 · 2840 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_small-minecraft-church-building_mc-mod_x.png`
- вердикт: undefined · флаги: franchise

### Small Miscellaneous Structure

- файл: `commercial_small-miscellaneous-structure-2_mc-mod_x.schem` · категория: **commercial** · теги: huge|road|shop|tall · 78x185x72 · 338124 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_small-miscellaneous-structure-2_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Small Open Cafe Design

- файл: `commercial_small-open-cafe-design_mc-mod_x.schem` · категория: **commercial** · теги: medium|shop|tall · 10x256x9 · 511 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_small-open-cafe-design_mc-mod_x.png`
- вердикт: undefined

### Small Police Car Schematic

- файл: `commercial_small-police-car-schematic_mc-mod_x.schem` · категория: **commercial** · теги: car|medium|shop · 22x21x56 · 3393 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_small-police-car-schematic_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name, non-building-in-name

### Small Shop Building

- файл: `commercial_small-shop-building_mc-mod_x.schem` · категория: **commercial** · теги: shop|small · 21x25x19 · 1665 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_small-shop-building_mc-mod_x.png`
- вердикт: undefined

### Small Shopping Mall

- файл: `commercial_small-shopping-mall_mc-mod_x.schem` · категория: **commercial** · теги: medium|shop · 43x18x50 · 12966 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_small-shopping-mall_mc-mod_x.png`
- вердикт: undefined

### Small Spade Shop

- файл: `commercial_small-spade-shop_mc-mod_x.schem` · категория: **commercial** · теги: medium|shop|tall · 25x61x20 · 14656 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_small-spade-shop_mc-mod_x.png`
- вердикт: undefined

### Small Terracotta Vase Decoration

- файл: `commercial_small-terracotta-vase-decoration_mc-mod_x.schem` · категория: **commercial** · теги: shop|small · 18x28x18 · 1019 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_small-terracotta-vase-decoration_mc-mod_x.png`
- вердикт: undefined

### Small Underground Faction Shop

- файл: `commercial_small-underground-faction-shop_mc-mod_x.schem` · категория: **commercial** · теги: medium|shop · 40x13x29 · 12323 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_small-underground-faction-shop_mc-mod_x.png`
- вердикт: undefined

### Small Wooden Shop with Multiple Entrances

- файл: `commercial_small-wooden-shop-with-multiple-entrances_mc-mod_x.schem` · категория: **commercial** · теги: medium|shop · 43x14x43 · 3938 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_small-wooden-shop-with-multiple-entrances_mc-mod_x.png`
- вердикт: undefined

### Tails&#8217; Workshop Recreation

- файл: `commercial_tails-workshop-recreation_mc-mod_x.schem` · категория: **commercial** · теги: shop|small · 15x13x18 · 928 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_tails-workshop-recreation_mc-mod_x.png`
- вердикт: undefined

### Traditional Brick Home With Garage

- файл: `commercial_traditional-brick-home-with-garage_mc-mod_x.schem` · категория: **commercial** · теги: house|medium|parking · 61x35x52 · 14732 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_traditional-brick-home-with-garage_mc-mod_x.png`
- вердикт: undefined

### Traditional British Pub Building

- файл: `commercial_traditional-british-pub-building_mc-mod_x.schem` · категория: **commercial** · теги: small · 10x19x18 · 873 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_traditional-british-pub-building_mc-mod_x.png`
- вердикт: undefined

### Tropical Mine and Shop

- файл: `commercial_tropical-mine-and-shop_mc-mod_x.schem` · категория: **commercial** · теги: large|shop · 65x33x103 · 69706 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_tropical-mine-and-shop_mc-mod_x.png`
- вердикт: undefined

### Truck Stop Gas Station

- файл: `commercial_truck-stop-gas-station_mc-mod_x.schem` · категория: **commercial** · теги: car|huge|station · 132x13x314 · 15472 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_truck-stop-gas-station_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### Wii Island Hotel

- файл: `commercial_wii-island-hotel_mc-mod_x.schem` · категория: **commercial** · теги: hotel|medium · 41x24x52 · 5005 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_wii-island-hotel_mc-mod_x.png`
- вердикт: undefined

### Yeti&#8217;s Alpine Shop

- файл: `commercial_yetis-alpine-shop_mc-mod_x.schem` · категория: **commercial** · теги: medium|shop|tall · 29x81x49 · 18437 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_yetis-alpine-shop_mc-mod_x.png`
- вердикт: undefined

### Rustic Farmhouse & Shop

- файл: `commercial_rustic-farmhouse-shop_mc-mod_x.schematic` · категория: **commercial** · теги: house|shop|small · 33x15x28 · 2766 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_rustic-farmhouse-shop_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### Modern McDonald’s Restaurant With Exterior

- файл: `commercial_modern-mcdonalds-restaurant-with-exterior_mc-mod_x.schematic` · категория: **commercial** · теги: medium|modern · 35x21x44 · 2854 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_modern-mcdonalds-restaurant-with-exterior_mc-mod_x.png`
- вердикт: undefined

### Union Bank Building

- файл: `commercial_union-bank-building_mc-mod_x.schematic` · категория: **commercial** · теги: bank|huge|tall · 85x173x45 · 610233 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_union-bank-building_mc-mod_x.png`
- вердикт: undefined

### Classical Greek Market

- файл: `commercial_classical-greek-market_mc-mod_1.21.schem` · категория: **commercial** · теги: large|shop|tall · 75x46x75 · 11314 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_classical-greek-market_mc-mod_1.21.png`
- вердикт: undefined

### Unique Treehouse Restaurant

- файл: `commercial_unique-treehouse-restaurant_mc-mod_x.schematic` · категория: **commercial** · теги: house|small|tree · 15x8x17 · 961 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_unique-treehouse-restaurant_mc-mod_x.png`
- вердикт: undefined

### The X Mall

- файл: `commercial_the-x-mall_mc-mod_1.16.4.schem` · категория: **commercial** · теги: shop|small · 20x20x21 · 2488 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_the-x-mall_mc-mod_1.16.4.png`
- вердикт: undefined

### Witch’s Potion Shop House

- файл: `commercial_witchs-potion-shop-house_mc-mod_x.schematic` · категория: **commercial** · теги: house|shop|small · 17x21x21 · 1985 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_witchs-potion-shop-house_mc-mod_x.png`
- вердикт: undefined · флаги: non-real/fantasy

### Fallout 3 Diner Restaurant Build

- файл: `commercial_fallout-3-diner-restaurant-build_mc-mod_x.schematic` · категория: **commercial** · теги: tiny · 17x6x14 · 499 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_fallout-3-diner-restaurant-build_mc-mod_x.png`
- вердикт: undefined · флаги: franchise, meta-word-in-name

### Gold Bank Vault Tower

- файл: `commercial_gold-bank-vault-tower_mc-mod_x.schematic` · категория: **commercial** · теги: bank|small|tower · 16x15x11 · 1087 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_gold-bank-vault-tower_mc-mod_x.png`
- вердикт: undefined

### Modern Shopping Mall

- файл: `commercial_modern-shopping-mall_mc-mod_1.14.4.schem` · категория: **commercial** · теги: medium|modern|shop|tall · 43x41x33 · 13257 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_modern-shopping-mall_mc-mod_1.14.4.png`
- вердикт: undefined

### Birch Blacksmith Shop

- файл: `commercial_birch-blacksmith-shop_mc-mod_x.schematic` · категория: **commercial** · теги: shop|tiny|tree · 7x6x10 · 276 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_birch-blacksmith-shop_mc-mod_x.png`
- вердикт: undefined · флаги: non-real/fantasy

### Seabubbles Cafe Building

- файл: `commercial_seabubbles-cafe-building_mc-mod_x.schematic` · категория: **commercial** · теги: tiny · 14x10x14 · 417 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_seabubbles-cafe-building_mc-mod_x.png`
- вердикт: undefined

### Blacksmith Shop Structure

- файл: `commercial_blacksmith-shop-structure_mc-mod_x.schematic` · категория: **commercial** · теги: shop|tiny · 7x6x10 · 276 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_blacksmith-shop-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name, non-real/fantasy

### Joe’s Diner Restaurant

- файл: `commercial_joes-diner-restaurant_mc-mod_x.schematic` · категория: **commercial** · теги: tiny · 16x9x13 · 929 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_joes-diner-restaurant_mc-mod_x.png`
- вердикт: undefined

### Brick Blacksmith Shop

- файл: `commercial_brick-blacksmith-shop_mc-mod_x.schematic` · категория: **commercial** · теги: shop|tiny · 7x6x10 · 276 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_brick-blacksmith-shop_mc-mod_x.png`
- вердикт: undefined · флаги: non-real/fantasy

### Modern Fast Food Restaurant

- файл: `commercial_modern-fast-food-restaurant_mc-mod_x.schematic` · категория: **commercial** · теги: modern|small · 18x24x25 · 960 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_modern-fast-food-restaurant_mc-mod_x.png`
- вердикт: undefined

### Blacksmith Shop NPC

- файл: `commercial_blacksmith-shop-npc_mc-mod_x.schematic` · категория: **commercial** · теги: shop|tiny · 7x6x10 · 276 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_blacksmith-shop-npc_mc-mod_x.png`
- вердикт: undefined · флаги: non-real/fantasy

### McDonald’s Restaurant with Play Area

- файл: `commercial_mcdonalds-restaurant-with-play-area_mc-mod_x.schematic` · категория: **commercial** · теги: medium · 55x24x67 · 7239 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_mcdonalds-restaurant-with-play-area_mc-mod_x.png`
- вердикт: undefined

### Blacksmith Shop in Jungle Setting

- файл: `commercial_blacksmith-shop-in-jungle-setting_mc-mod_x.schematic` · категория: **commercial** · теги: shop|tiny · 7x6x10 · 276 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_blacksmith-shop-in-jungle-setting_mc-mod_x.png`
- вердикт: undefined · флаги: non-real/fantasy

### Spanish Italian Fusion Restaurant

- файл: `commercial_spanish-italian-fusion-restaurant_mc-mod_x.schematic` · категория: **commercial** · теги: medium · 35x30x36 · 3381 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_spanish-italian-fusion-restaurant_mc-mod_x.png`
- вердикт: undefined

### Oak Blacksmith Shop

- файл: `commercial_oak-blacksmith-shop_mc-mod_x.schematic` · категория: **commercial** · теги: shop|tiny|tree · 7x6x10 · 276 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_oak-blacksmith-shop_mc-mod_x.png`
- вердикт: undefined · флаги: non-real/fantasy

### McDonald’s Restaurant Building

- файл: `commercial_mcdonalds-restaurant-building_mc-mod_x.schematic` · категория: **commercial** · теги: medium · 29x15x36 · 2794 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_mcdonalds-restaurant-building_mc-mod_x.png`
- вердикт: undefined

### Blacksmith Shop – Sandstone Design

- файл: `commercial_blacksmith-shop-sandstone-design_mc-mod_x.schematic` · категория: **commercial** · теги: shop|tiny · 7x6x10 · 276 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_blacksmith-shop-sandstone-design_mc-mod_x.png`
- вердикт: undefined · флаги: non-real/fantasy

### Restaurant Bar Towers

- файл: `commercial_restaurant-bar-towers_mc-mod_1.14.2.schematic` · категория: **commercial** · теги: medium|tall|tower · 20x92x41 · 13680 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_restaurant-bar-towers_mc-mod_1.14.2.png`
- вердикт: undefined

### Spruce Blacksmith Shop

- файл: `commercial_spruce-blacksmith-shop_mc-mod_x.schematic` · категория: **commercial** · теги: shop|tiny|tree · 7x6x10 · 276 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_spruce-blacksmith-shop_mc-mod_x.png`
- вердикт: undefined · флаги: non-real/fantasy

### McDonalds Restaurant

- файл: `commercial_mcdonalds-restaurant_mc-mod_x.schematic` · категория: **commercial** · теги: small · 18x16x28 · 3441 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_mcdonalds-restaurant_mc-mod_x.png`
- вердикт: undefined

### Blacksmith Shop Exterior

- файл: `commercial_blacksmith-shop-exterior_mc-mod_x.schematic` · категория: **commercial** · теги: shop|tiny · 7x6x10 · 276 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_blacksmith-shop-exterior_mc-mod_x.png`
- вердикт: undefined · флаги: non-real/fantasy

### Small Minecraft Bakery Shop

- файл: `commercial_small-minecraft-bakery-shop_mc-mod_x.schematic` · категория: **commercial** · теги: shop|tiny · 5x4x10 · 76 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_small-minecraft-bakery-shop_mc-mod_x.png`
- вердикт: undefined · флаги: franchise

### Restaurant Building

- файл: `commercial_restaurant-building_mc-mod_x.schematic` · категория: **commercial** · теги: medium · 35x36x27 · 1686 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_restaurant-building_mc-mod_x.png`
- вердикт: undefined

### Gucci Store

- файл: `commercial_gucci-store_mc-mod_x.schematic` · категория: **commercial** · теги: shop|small · 21x17x12 · 727 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_gucci-store_mc-mod_x.png`
- вердикт: undefined

### Magenta Storage Container

- файл: `decor_magenta-storage-container_mc-mod_1.21.8.schem` · категория: **decor** · теги: tiny · 7x6x19 · 398 блоков · источник: mc-mod
- превью: `schemes/thumbs/decor_magenta-storage-container_mc-mod_1.21.8.png`
- вердикт: undefined

### Blue Container Outdoor Decoration

- файл: `decor_blue-container-outdoor-decoration_mc-mod_1.21.8.schem` · категория: **decor** · теги: tiny · 7x6x19 · 406 блоков · источник: mc-mod
- превью: `schemes/thumbs/decor_blue-container-outdoor-decoration_mc-mod_1.21.8.png`
- вердикт: undefined

### Pink Container Decoration

- файл: `decor_pink-container-decoration_mc-mod_1.21.8.schem` · категория: **decor** · теги: tiny · 7x6x19 · 406 блоков · источник: mc-mod
- превью: `schemes/thumbs/decor_pink-container-decoration_mc-mod_1.21.8.png`
- вердикт: undefined

### Fallout 3 Billboard Structure

- файл: `decor_fallout-3-billboard-structure_mc-mod_x.schematic` · категория: **decor** · теги: tiny · 10x6x4 · 80 блоков · источник: mc-mod
- превью: `schemes/thumbs/decor_fallout-3-billboard-structure_mc-mod_x.png`
- вердикт: undefined · флаги: franchise, meta-word-in-name

### Large Advertisement Billboard Structure

- файл: `decor_large-advertisement-billboard-structure_mc-mod_x.schematic` · категория: **decor** · теги: medium|tall · 49x41x13 · 2765 блоков · источник: mc-mod
- превью: `schemes/thumbs/decor_large-advertisement-billboard-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Meme Billboard Advertisement

- файл: `decor_meme-billboard-advertisement_mc-mod_x.schematic` · категория: **decor** · теги: medium|tall · 49x41x13 · 5215 блоков · источник: mc-mod
- превью: `schemes/thumbs/decor_meme-billboard-advertisement_mc-mod_x.png`
- вердикт: undefined

### Fence Totem Structure

- файл: `decor_fence-totem-structure_mc-mod_x.schematic` · категория: **decor** · теги: small · 17x17x16 · 302 блоков · источник: mc-mod
- превью: `schemes/thumbs/decor_fence-totem-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### fallout 3 billboard- zth

- файл: `decor_fallout-3-billboard-zth_mcbuild_x.schem` · категория: **decor** · теги: tiny · 10x6x4 · 80 блоков · источник: mcbuild
- превью: `schemes/thumbs/decor_fallout-3-billboard-zth_mcbuild_x.png`
- вердикт: undefined · флаги: franchise

### Compressed Cobblestone Factory

- файл: `industrial_compressed-cobblestone-factory_mc-mod_x.schem` · категория: **industrial** · теги: tiny · 63x1x1 · 31 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_compressed-cobblestone-factory_mc-mod_x.png`
- вердикт: undefined

### Concrete Factory Structure

- файл: `industrial_concrete-factory-structure_mc-mod_x.schem` · категория: **industrial** · теги: large|tall · 63x47x52 · 31478 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_concrete-factory-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Factory Hall 2.0

- файл: `industrial_factory-hall-2-0_mc-mod_x.schem` · категория: **industrial** · теги: large|tall · 68x48x75 · 28377 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_factory-hall-2-0_mc-mod_x.png`
- вердикт: undefined

### Gingerbread Factory

- файл: `industrial_gingerbread-factory_mc-mod_x.schem` · категория: **industrial** · теги: large|tall · 81x52x65 · 12668 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_gingerbread-factory_mc-mod_x.png`
- вердикт: undefined

### Glass Factory Build

- файл: `industrial_glass-factory-build_mc-mod_x.schem` · категория: **industrial** · теги: medium · 26x38x28 · 26789 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_glass-factory-build_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Gold Smelting Factory

- файл: `industrial_gold-smelting-factory_mc-mod_x.schem` · категория: **industrial** · теги: large|tall · 64x79x27 · 3379 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_gold-smelting-factory_mc-mod_x.png`
- вердикт: undefined

### Old Factory Hall Building

- файл: `industrial_old-factory-hall-building_mc-mod_x.schem` · категория: **industrial** · теги: medium · 28x19x37 · 3737 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_old-factory-hall-building_mc-mod_x.png`
- вердикт: undefined

### Simple Factory Shed

- файл: `industrial_simple-factory-shed_mc-mod_x.schem` · категория: **industrial** · теги: medium · 34x21x53 · 4709 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_simple-factory-shed_mc-mod_x.png`
- вердикт: undefined

### Urban Compressed Air Factory

- файл: `industrial_urban-compressed-air-factory_mc-mod_x.schem` · категория: **industrial** · теги: medium · 38x29x87 · 12697 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_urban-compressed-air-factory_mc-mod_x.png`
- вердикт: undefined

### Industrial Warehouse Fence and Gate

- файл: `industrial_industrial-warehouse-fence-and-gate_mc-mod_x.schematic` · категория: **industrial** · теги: house|tiny · 1x5x49 · 245 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_industrial-warehouse-fence-and-gate_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### Diorite Stone Factory – 2605 Blocks

- файл: `industrial_diorite-stone-factory-2605-blocks_mc-mod_1.21.1.nbt` · категория: **industrial** · теги: small · 41x8x21 · 2036 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_diorite-stone-factory-2605-blocks_mc-mod_1.21.1.png`
- вердикт: undefined

### Industrial Warehouse Building

- файл: `industrial_industrial-warehouse-building_mc-mod_x.schematic` · категория: **industrial** · теги: house|large · 76x20x148 · 27864 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_industrial-warehouse-building_mc-mod_x.png`
- вердикт: undefined

### Fallout 3 Style Grain Silo

- файл: `industrial_fallout-3-style-grain-silo_mc-mod_x.schematic` · категория: **industrial** · теги: small · 13x22x13 · 556 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_fallout-3-style-grain-silo_mc-mod_x.png`
- вердикт: undefined · флаги: franchise

### Small Industrial Factory Structure

- файл: `industrial_small-industrial-factory-structure_mc-mod_x.schematic` · категория: **industrial** · теги: shop|small · 22x32x19 · 1171 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_small-industrial-factory-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Granite Concrete Factory – 8286 Blocks

- файл: `industrial_granite-concrete-factory-8286-blocks_mc-mod_1.21.1.nbt` · категория: **industrial** · теги: medium · 29x14x55 · 7300 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_granite-concrete-factory-8286-blocks_mc-mod_1.21.1.png`
- вердикт: undefined

### Village Warehouse Structure

- файл: `industrial_village-warehouse-structure_mc-mod_x.schematic` · категория: **industrial** · теги: house|small · 31x18x18 · 2737 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_village-warehouse-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Modern Water Mill Structure

- файл: `industrial_modern-water-mill-structure_mc-mod_x.schematic` · категория: **industrial** · теги: modern|small · 17x37x17 · 1414 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_modern-water-mill-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Spacious Industrial Warehouse Building

- файл: `industrial_spacious-industrial-warehouse-building_mc-mod_x.schematic` · категория: **industrial** · теги: house|huge · 98x29x237 · 40448 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_spacious-industrial-warehouse-building_mc-mod_x.png`
- вердикт: undefined

### Stone Brick Factory Building

- файл: `industrial_stone-brick-factory-building_mc-mod_1.20.1.nbt` · категория: **industrial** · теги: small · 16x11x28 · 1794 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_stone-brick-factory-building_mc-mod_1.20.1.png`
- вердикт: undefined

### Industrial Warehouse Storage Facility

- файл: `industrial_industrial-warehouse-storage-facility_mc-mod_x.schematic` · категория: **industrial** · теги: house|large · 100x24x155 · 31351 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_industrial-warehouse-storage-facility_mc-mod_x.png`
- вердикт: undefined

### Minecraft Lumber Mill Structure

- файл: `industrial_minecraft-lumber-mill-structure_mc-mod_x.schematic` · категория: **industrial** · теги: tiny · 9x11x19 · 684 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_minecraft-lumber-mill-structure_mc-mod_x.png`
- вердикт: undefined · флаги: franchise, meta-word-in-name

### Industrial Pipe with Pressure Gauge

- файл: `industrial_industrial-pipe-with-pressure-gauge_mc-mod_x.schematic` · категория: **industrial** · теги: tiny · 13x23x5 · 540 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_industrial-pipe-with-pressure-gauge_mc-mod_x.png`
- вердикт: undefined

### Warehouse 7 Industrial Building

- файл: `industrial_warehouse-7-industrial-building_mc-mod_x.schematic` · категория: **industrial** · теги: house|large · 157x18x105 · 30693 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_warehouse-7-industrial-building_mc-mod_x.png`
- вердикт: undefined

### Industrial Factory Hall

- файл: `industrial_industrial-factory-hall_mc-mod_x.schematic` · категория: **industrial** · теги: medium|tall · 29x58x62 · 7135 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_industrial-factory-hall_mc-mod_x.png`
- вердикт: undefined

### Create Mod Birch Lumber Mill and Factory

- файл: `industrial_create-mod-birch-lumber-mill-and-factory_mc-mod_1.21.1.nbt` · категория: **industrial** · теги: small|tree · 16x22x16 · 1062 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_create-mod-birch-lumber-mill-and-factory_mc-mod_1.21.1.png`
- вердикт: undefined

### Rustic Wood Workshop

- файл: `industrial_rustic-wood-workshop_mc-mod_x.schematic` · категория: **industrial** · теги: large|shop|tall · 69x87x70 · 65191 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_rustic-wood-workshop_mc-mod_x.png`
- вердикт: undefined

### Abandoned Textile Mill Structure

- файл: `industrial_abandoned-textile-mill-structure_mc-mod_x.schematic` · категория: **industrial** · теги: medium · 44x24x57 · 41032 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_abandoned-textile-mill-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Create Mod Basic Workshop

- файл: `industrial_create-mod-basic-workshop_mc-mod_1.21.1.nbt` · категория: **industrial** · теги: shop|small · 16x12x16 · 555 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_create-mod-basic-workshop_mc-mod_1.21.1.png`
- вердикт: undefined

### Create Mod Andesite Factory

- файл: `industrial_create-mod-andesite-factory_mc-mod_1.21.1.nbt` · категория: **industrial** · теги: small · 15x33x15 · 2034 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_create-mod-andesite-factory_mc-mod_1.21.1.png`
- вердикт: undefined

### Mega Clothing Store With Workshop

- файл: `industrial_mega-clothing-store-with-workshop_mc-mod_1.14.4.schem` · категория: **industrial** · теги: medium|shop|tall · 33x41x21 · 8348 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_mega-clothing-store-with-workshop_mc-mod_1.14.4.png`
- вердикт: undefined

### Create 16×16 Andesite Alloy Factory

- файл: `industrial_create-16x16-andesite-alloy-factory_mc-mod_1.21.1.nbt` · категория: **industrial** · теги: small · 16x29x16 · 2243 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_create-16x16-andesite-alloy-factory_mc-mod_1.21.1.png`
- вердикт: undefined

### AIK Foundry Structure

- файл: `industrial_aik-foundry-structure_mc-mod_1.14.4.schem` · категория: **industrial** · теги: medium|tall · 29x60x36 · 61258 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_aik-foundry-structure_mc-mod_1.14.4.png`
- вердикт: undefined · флаги: meta-word-in-name

### Factory Build V3

- файл: `industrial_factory-build-v3_mc-mod_1.20.1.nbt` · категория: **industrial** · теги: large|tall · 84x57x81 · 24644 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_factory-build-v3_mc-mod_1.20.1.png`
- вердикт: undefined · флаги: meta-word-in-name

### Advanced Syngas Industrial Complex

- файл: `industrial_advanced-syngas-industrial-complex_mc-mod_x.schematic` · категория: **industrial** · теги: car|medium · 89x18x47 · 18268 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_advanced-syngas-industrial-complex_mc-mod_x.png`
- вердикт: undefined

### Create Mod Gravel Factory 16×16

- файл: `industrial_create-mod-gravel-factory-16x16_mc-mod_1.21.1.nbt` · категория: **industrial** · теги: small · 16x15x16 · 894 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_create-mod-gravel-factory-16x16_mc-mod_1.21.1.png`
- вердикт: undefined

### Create Mod Andesite Factory 16×16 Taiga

- файл: `industrial_create-mod-andesite-factory-16x16-taiga_mc-mod_1.21.1.nbt` · категория: **industrial** · теги: small · 16x33x16 · 2895 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_create-mod-andesite-factory-16x16-taiga_mc-mod_1.21.1.png`
- вердикт: undefined

### Industrial Style Modern House

- файл: `industrial_industrial-style-modern-house_mc-mod_1.14.4.schem` · категория: **industrial** · теги: house|medium|modern|tall · 30x42x31 · 9071 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_industrial-style-modern-house_mc-mod_1.14.4.png`
- вердикт: undefined

### Create Mod Andesite Factory In 16×16 Chunk

- файл: `industrial_create-mod-andesite-factory-in-16x16-chunk_mc-mod_1.21.1.nbt` · категория: **industrial** · теги: small · 15x34x15 · 2126 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_create-mod-andesite-factory-in-16x16-chunk_mc-mod_1.21.1.png`
- вердикт: undefined

### Industrial Style House

- файл: `industrial_industrial-style-house_mc-mod_1.14.4.schem` · категория: **industrial** · теги: house|medium|tall · 30x60x31 · 12542 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_industrial-style-house_mc-mod_1.14.4.png`
- вердикт: undefined

### Stone Brick Industrial Factory

- файл: `industrial_industrial-factory-building-4_mc-mod_1.14.4.schem` · категория: **industrial** · теги: medium · 20x27x34 · 4762 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_industrial-factory-building-4_mc-mod_1.14.4.png`
- вердикт: undefined

### 128KSU Power Plant Structure

- файл: `industrial_128ksu-power-plant-structure_buildschematics_x.nbt` · категория: **industrial** · теги: small · 17x10x15 · 327 блоков · источник: buildschematics
- превью: `schemes/thumbs/industrial_128ksu-power-plant-structure_buildschematics_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Massive Steam Power Plant

- файл: `industrial_massive-steam-power-plant_buildschematics_x.nbt` · категория: **industrial** · теги: medium · 45x36x42 · 20332 блоков · источник: buildschematics
- превью: `schemes/thumbs/industrial_massive-steam-power-plant_buildschematics_x.png`
- вердикт: undefined

### Pixelmon Maze Power Plant

- файл: `industrial_pixelmon-maze-power-plant_buildschematics_x.schematic` · категория: **industrial** · теги: medium|tall · 38x45x66 · 25170 блоков · источник: buildschematics
- превью: `schemes/thumbs/industrial_pixelmon-maze-power-plant_buildschematics_x.png`
- вердикт: undefined

### 256-Block Power Plant Structure

- файл: `industrial_256-block-power-plant-structure_buildschematics_x.nbt` · категория: **industrial** · теги: small · 17x11x28 · 1202 блоков · источник: buildschematics
- превью: `schemes/thumbs/industrial_256-block-power-plant-structure_buildschematics_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Power Plant

- файл: `industrial_power-plant_mcbuild_x.schem` · категория: **industrial** · теги: large|tall · 81x58x81 · 45850 блоков · источник: mcbuild
- превью: `schemes/thumbs/industrial_power-plant_mcbuild_x.png`
- вердикт: undefined

### Pixelmon Power Plant

- файл: `industrial_pixelmon-power-plant_mcbuild_x.schem` · категория: **industrial** · теги: medium|tall · 38x45x66 · 24432 блоков · источник: mcbuild
- превью: `schemes/thumbs/industrial_pixelmon-power-plant_mcbuild_x.png`
- вердикт: undefined

### fallout 3 substation v1- zth

- файл: `industrial_fallout-3-substation-v1-zth_mcbuild_x.schem` · категория: **industrial** · теги: small|station · 26x9x19 · 1393 блоков · источник: mcbuild
- превью: `schemes/thumbs/industrial_fallout-3-substation-v1-zth_mcbuild_x.png`
- вердикт: undefined · флаги: franchise, meta-word-in-name

### fallout 3 substation v2- zth

- файл: `industrial_fallout-3-substation-v2-zth_mcbuild_x.schem` · категория: **industrial** · теги: small|station · 25x10x20 · 1523 блоков · источник: mcbuild
- превью: `schemes/thumbs/industrial_fallout-3-substation-v2-zth_mcbuild_x.png`
- вердикт: undefined · флаги: franchise, meta-word-in-name

### Storage Warehouse

- файл: `industrial_storage-warehouse_buildschematics_x.nbt` · категория: **industrial** · теги: house|medium · 35x19x40 · 3405 блоков · источник: buildschematics
- превью: `schemes/thumbs/industrial_storage-warehouse_buildschematics_x.png`
- вердикт: undefined

### Storage Warehouse V1

- файл: `industrial_storage-warehouse-v1_buildschematics_x.nbt` · категория: **industrial** · теги: house|medium · 69x17x68 · 6860 блоков · источник: buildschematics
- превью: `schemes/thumbs/industrial_storage-warehouse-v1_buildschematics_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Large Warehouse

- файл: `industrial_large-warehouse_mcbuild_x.schem` · категория: **industrial** · теги: house|huge · 98x29x237 · 53370 блоков · источник: mcbuild
- превью: `schemes/thumbs/industrial_large-warehouse_mcbuild_x.png`
- вердикт: undefined

### Warehouse

- файл: `industrial_warehouse_mcbuild_x.schem` · категория: **industrial** · теги: house|medium · 33x18x61 · 8329 блоков · источник: mcbuild
- превью: `schemes/thumbs/industrial_warehouse_mcbuild_x.png`
- вердикт: undefined

### Warehouse 11

- файл: `industrial_warehouse-11_mcbuild_x.schem` · категория: **industrial** · теги: house|huge · 129x35x177 · 48318 блоков · источник: mcbuild
- превью: `schemes/thumbs/industrial_warehouse-11_mcbuild_x.png`
- вердикт: undefined

### Modern City Intersection Road

- файл: `intersections_modern-city-intersection-road_mc-mod_x.schem` · категория: **intersections** · теги: medium|modern|road · 171x1x171 · 29241 блоков · источник: mc-mod
- превью: `schemes/thumbs/intersections_modern-city-intersection-road_mc-mod_x.png`
- вердикт: undefined

### Modern City Stoplight

- файл: `intersections_modern-city-stoplight_mc-mod_x.schematic` · категория: **intersections** · теги: modern|tiny · 3x9x3 · 65 блоков · источник: mc-mod
- превью: `schemes/thumbs/intersections_modern-city-stoplight_mc-mod_x.png`
- вердикт: undefined

### Intersection Road

- файл: `intersections_intersection-road_mcbuild_x.schem` · категория: **intersections** · теги: medium|road · 171x1x171 · 29241 блоков · источник: mcbuild
- превью: `schemes/thumbs/intersections_intersection-road_mcbuild_x.png`
- вердикт: undefined

### Sewer Template Intersection Shape

- файл: `intersections_sewer-template-intersection-shape_mcbuild_x.schem` · категория: **intersections** · теги: small · 47x6x47 · 1923 блоков · источник: mcbuild
- превью: `schemes/thumbs/intersections_sewer-template-intersection-shape_mcbuild_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Drive on the Right Dual Simplex Minecart Track Intersection

- файл: `intersections_drive-on-the-right-dual-simplex-minecart-track-intersectio_mcbuild_x.schem` · категория: **intersections** · теги: car|medium · 33x34x67 · 26897 блоков · источник: mcbuild
- превью: `schemes/thumbs/intersections_drive-on-the-right-dual-simplex-minecart-track-intersectio_mcbuild_x.png`
- вердикт: undefined

### Intersection

- файл: `intersections_intersection_mcbuild_x.schem` · категория: **intersections** · теги: medium · 65x10x65 · 4372 блоков · источник: mcbuild
- превью: `schemes/thumbs/intersections_intersection_mcbuild_x.png`
- вердикт: undefined

### Stoplight

- файл: `intersections_stoplight_mcbuild_x.schem` · категория: **intersections** · теги: tiny · 3x9x3 · 65 блоков · источник: mcbuild
- превью: `schemes/thumbs/intersections_stoplight_mcbuild_x.png`
- вердикт: undefined

### Wild West Crossroad

- файл: `intersections_wild-west-crossroad_mcbuild_x.schem` · категория: **intersections** · теги: large|road · 68x30x69 · 12735 блоков · источник: mcbuild
- превью: `schemes/thumbs/intersections_wild-west-crossroad_mcbuild_x.png`
- вердикт: undefined

### Drive on the Left Dual Simplex Minecart Track Intersection

- файл: `intersections_drive-on-the-left-dual-simplex-minecart-track-intersection_mcbuild_x.schem` · категория: **intersections** · теги: car|medium · 33x34x67 · 26943 блоков · источник: mcbuild
- превью: `schemes/thumbs/intersections_drive-on-the-left-dual-simplex-minecart-track-intersection_mcbuild_x.png`
- вердикт: undefined

### 4 Way Intersection (Redstone)

- файл: `intersections_4-way-intersection-redstone_mcbuild_x.schem` · категория: **intersections** · теги: tiny · 11x14x11 · 905 блоков · источник: mcbuild
- превью: `schemes/thumbs/intersections_4-way-intersection-redstone_mcbuild_x.png`
- вердикт: undefined · флаги: non-building-in-name

### Ancient Skyway Modified(T-Junction)

- файл: `intersections_ancient-skyway-modified-t-junction_mcbuild_x.schem` · категория: **intersections** · теги: small · 35x6x19 · 1006 блоков · источник: mcbuild
- превью: `schemes/thumbs/intersections_ancient-skyway-modified-t-junction_mcbuild_x.png`
- вердикт: undefined

### Railway Junction Train Station Base

- файл: `intersections_railway-junction-train-station-base_buildschematics_x.nbt` · категория: **intersections** · теги: medium|station · 58x27x53 · 7301 блоков · источник: buildschematics
- превью: `schemes/thumbs/intersections_railway-junction-train-station-base_buildschematics_x.png`
- вердикт: undefined

### Dreamy Fountain Build

- файл: `parks_dreamy-fountain-build_mc-mod_x.schem` · категория: **parks** · теги: fountain|small|water · 13x28x15 · 996 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_dreamy-fountain-build_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Elegant Quartz Fountain

- файл: `parks_elegant-quartz-fountain_mc-mod_x.schem` · категория: **parks** · теги: fountain|small|water · 15x10x15 · 328 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_elegant-quartz-fountain_mc-mod_x.png`
- вердикт: undefined

### Elegant Quartz Water Fountain

- файл: `parks_elegant-quartz-water-fountain_mc-mod_x.schem` · категория: **parks** · теги: fountain|small|water · 29x13x29 · 1568 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_elegant-quartz-water-fountain_mc-mod_x.png`
- вердикт: undefined

### Garden Fountain Design

- файл: `parks_garden-fountain-design_mc-mod_x.schem` · категория: **parks** · теги: fountain|park|small|water · 22x12x22 · 1164 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_garden-fountain-design_mc-mod_x.png`
- вердикт: undefined

### Garden Fountain Structure

- файл: `parks_garden-fountain-structure_mc-mod_x.schem` · категория: **parks** · теги: fountain|park|small|water · 27x9x19 · 718 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_garden-fountain-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Hanging Gardens of Brisbane

- файл: `parks_hanging-gardens-of-brisbane_mc-mod_x.schem` · категория: **parks** · теги: medium|park|tall · 48x51x47 · 7798 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_hanging-gardens-of-brisbane_mc-mod_x.png`
- вердикт: undefined

### Large Car Park

- файл: `parks_large-car-park_mc-mod_x.schem` · категория: **parks** · теги: car|medium|park · 191x2x175 · 33721 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_large-car-park_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### Majestic Fountain Structure

- файл: `parks_majestic-fountain-structure_mc-mod_x.schem` · категория: **parks** · теги: fountain|medium|water · 31x36x39 · 3692 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_majestic-fountain-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Modern Concrete Park

- файл: `parks_modern-concrete-park_mc-mod_x.schem` · категория: **parks** · теги: modern|park|tiny · 19x4x19 · 48 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_modern-concrete-park_mc-mod_x.png`
- вердикт: undefined

### Modern Fountain Design

- файл: `parks_modern-fountain-design_mc-mod_x.schem` · категория: **parks** · теги: fountain|modern|tiny|water · 13x11x13 · 275 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_modern-fountain-design_mc-mod_x.png`
- вердикт: undefined

### Modern Grand Fountain &#8211; Medium Garden

- файл: `parks_modern-grand-fountain-medium-garden_mc-mod_x.schem` · категория: **parks** · теги: fountain|medium|modern|park|tall|water · 33x48x33 · 6156 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_modern-grand-fountain-medium-garden_mc-mod_x.png`
- вердикт: undefined

### Modern Park with Fountain and Benches

- файл: `parks_modern-park-with-fountain-and-benches_mc-mod_x.schem` · категория: **parks** · теги: fountain|modern|park|small|water · 20x12x11 · 425 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_modern-park-with-fountain-and-benches_mc-mod_x.png`
- вердикт: undefined

### Ornamental Garden Fountain

- файл: `parks_ornamental-garden-fountain_mc-mod_x.schem` · категория: **parks** · теги: fountain|medium|park|tall|water · 37x61x45 · 5549 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_ornamental-garden-fountain_mc-mod_x.png`
- вердикт: undefined

### Peaceful Fountain

- файл: `parks_peaceful-fountain_mc-mod_x.schem` · категория: **parks** · теги: fountain|large|water · 80x34x76 · 5374 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_peaceful-fountain_mc-mod_x.png`
- вердикт: undefined

### Peaceful Minecraft Garden Oasis Build

- файл: `parks_peaceful-minecraft-garden-oasis-build_mc-mod_x.schem` · категория: **parks** · теги: medium|park · 66x27x30 · 14270 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_peaceful-minecraft-garden-oasis-build_mc-mod_x.png`
- вердикт: undefined · флаги: franchise, meta-word-in-name

### Quartz Pool Garden Feature

- файл: `parks_quartz-pool-garden-feature_mc-mod_x.schem` · категория: **parks** · теги: park|pool|small|water · 13x9x20 · 580 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_quartz-pool-garden-feature_mc-mod_x.png`
- вердикт: undefined

### Spawn Fountain Garden

- файл: `parks_spawn-fountain-garden_mc-mod_x.schem` · категория: **parks** · теги: fountain|park|tiny|water · 21x1x21 · 433 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_spawn-fountain-garden_mc-mod_x.png`
- вердикт: undefined

### Technoblade Tribute Parkour Build

- файл: `parks_technoblade-tribute-parkour-build_mc-mod_x.schem` · категория: **parks** · теги: huge|park|tall · 94x83x66 · 9367 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_technoblade-tribute-parkour-build_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Yin Yang Garden Fountain

- файл: `parks_yin-yang-garden-fountain_mc-mod_x.schem` · категория: **parks** · теги: fountain|medium|park|water · 40x19x26 · 5719 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_yin-yang-garden-fountain_mc-mod_x.png`
- вердикт: undefined

### Modern Square Residence

- файл: `parks_modern-square-residence_mc-mod_x.schematic` · категория: **parks** · теги: apartment|modern|park|tiny · 11x9x13 · 228 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_modern-square-residence_mc-mod_x.png`
- вердикт: undefined

### Piston Fountain – Small Garden Feature

- файл: `parks_piston-fountain-small-garden-feature_mc-mod_x.schematic` · категория: **parks** · теги: fountain|park|shop|tiny|water · 7x11x7 · 230 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_piston-fountain-small-garden-feature_mc-mod_x.png`
- вердикт: undefined

### Mini Hedge Maze With Cave Entrance

- файл: `parks_mini-hedge-maze-with-cave-entrance_mc-mod_x.schematic` · категория: **parks** · теги: small · 20x15x18 · 1625 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_mini-hedge-maze-with-cave-entrance_mc-mod_x.png`
- вердикт: undefined

### Small Town Square

- файл: `parks_small-town-square_mc-mod_x.schematic` · категория: **parks** · теги: huge|park|shop|tall · 73x256x64 · 21597 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_small-town-square_mc-mod_x.png`
- вердикт: undefined

### Rustic Farmhouse with Garden and Pond

- файл: `parks_rustic-farmhouse-with-garden-and-pond_mc-mod_x.schematic` · категория: **parks** · теги: house|medium|park|pool|water · 37x29x52 · 11943 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_rustic-farmhouse-with-garden-and-pond_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### Sea Creature Park Megalodon Whale

- файл: `parks_sea-creature-park-megalodon-whale_mc-mod_x.schematic` · категория: **parks** · теги: medium|park · 52x26x62 · 71810 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_sea-creature-park-megalodon-whale_mc-mod_x.png`
- вердикт: undefined

### Small Garden Oasis

- файл: `parks_small-garden-oasis_mc-mod_x.schematic` · категория: **parks** · теги: medium|park|shop|tall · 35x46x24 · 2364 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_small-garden-oasis_mc-mod_x.png`
- вердикт: undefined

### Village Fountain

- файл: `parks_village-fountain_mc-mod_x.schematic` · категория: **parks** · теги: fountain|house|small|water · 13x13x17 · 831 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_village-fountain_mc-mod_x.png`
- вердикт: undefined

### Soviet Style City Square

- файл: `parks_soviet-style-city-square_mc-mod_x.schematic` · категория: **parks** · теги: park|small · 32x13x23 · 1296 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_soviet-style-city-square_mc-mod_x.png`
- вердикт: undefined

### Two Cubes Modern House With Garden Pool

- файл: `parks_two-cubes-modern-house-with-garden-pool_mc-mod_x.schematic` · категория: **parks** · теги: house|modern|park|pool|small|water · 20x17x18 · 1803 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_two-cubes-modern-house-with-garden-pool_mc-mod_x.png`
- вердикт: undefined

### Park Ball Structure

- файл: `parks_park-ball-structure_mc-mod_x.schematic` · категория: **parks** · теги: medium|park · 41x14x39 · 4096 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_park-ball-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Creeper Head Fountain

- файл: `parks_creeper-head-fountain_mc-mod_x.schematic` · категория: **parks** · теги: fountain|small|water · 14x15x14 · 813 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_creeper-head-fountain_mc-mod_x.png`
- вердикт: undefined

### Simple Minecraft Tree

- файл: `parks_simple-minecraft-tree_mc-mod_x.schematic` · категория: **parks** · теги: tiny|tree · 8x12x6 · 153 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_simple-minecraft-tree_mc-mod_x.png`
- вердикт: undefined · флаги: franchise

### Gothic Square Structure

- файл: `parks_gothic-square-structure_mc-mod_1.20.1.schem` · категория: **parks** · теги: large|park · 91x29x91 · 14299 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_gothic-square-structure_mc-mod_1.20.1.png`
- вердикт: undefined · флаги: meta-word-in-name

### Olive Garden Restaurant Salt Lake City

- файл: `parks_olive-garden-restaurant-salt-lake-city_mc-mod_1.16.5.schem` · категория: **parks** · теги: park|small · 26x10x41 · 2843 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_olive-garden-restaurant-salt-lake-city_mc-mod_1.16.5.png`
- вердикт: undefined

### Playground Park for Minecrafty Town

- файл: `parks_playground-park-for-minecrafty-town_mc-mod_1.19.4.schem` · категория: **parks** · теги: park|small · 18x9x16 · 122 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_playground-park-for-minecrafty-town_mc-mod_1.19.4.png`
- вердикт: undefined · флаги: franchise

### Survival Sphere House and Garden

- файл: `parks_survival-sphere-house-and-garden_mc-mod_x.schematic` · категория: **parks** · теги: house|large|park|tall · 70x50x69 · 27477 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_survival-sphere-house-and-garden_mc-mod_x.png`
- вердикт: undefined

### Spanish Moss Oak Tree

- файл: `parks_spanish-moss-oak-tree_mc-mod_x.schematic` · категория: **parks** · теги: small|tree · 20x19x21 · 236 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_spanish-moss-oak-tree_mc-mod_x.png`
- вердикт: undefined

### Cozy Brick Home with Garden and Storage

- файл: `parks_cozy-brick-home-with-garden-and-storage_mc-mod_x.schematic` · категория: **parks** · теги: house|medium|park · 44x18x31 · 3871 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_cozy-brick-home-with-garden-and-storage_mc-mod_x.png`
- вердикт: undefined

### Medium Palm Tree With Cocoa Pods

- файл: `parks_medium-palm-tree-with-cocoa-pods_mc-mod_x.schematic` · категория: **parks** · теги: tiny|tree · 10x14x10 · 36 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_medium-palm-tree-with-cocoa-pods_mc-mod_x.png`
- вердикт: undefined

### Beautiful Garden

- файл: `parks_beautiful-garden_mc-mod_x.schematic` · категория: **parks** · теги: medium|park · 45x14x45 · 130 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_beautiful-garden_mc-mod_x.png`
- вердикт: undefined

### Tropical Palm Tree

- файл: `parks_tropical-palm-tree_mc-mod_x.schematic` · категория: **parks** · теги: tiny|tree · 7x9x4 · 38 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_tropical-palm-tree_mc-mod_x.png`
- вердикт: undefined

### Rustic Garden Shed

- файл: `parks_rustic-garden-shed_mc-mod_x.schematic` · категория: **parks** · теги: park|tiny · 12x8x7 · 124 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_rustic-garden-shed_mc-mod_x.png`
- вердикт: undefined

### Small Oak Decorative Tree

- файл: `parks_small-oak-decorative-tree_mc-mod_x.schematic` · категория: **parks** · теги: shop|tiny|tree · 10x13x11 · 101 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_small-oak-decorative-tree_mc-mod_x.png`
- вердикт: undefined

### Small Tree Decoration

- файл: `parks_small-tree-decoration_mc-mod_x.schematic` · категория: **parks** · теги: shop|tiny|tree · 5x10x7 · 11 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_small-tree-decoration_mc-mod_x.png`
- вердикт: undefined · флаги: almost-empty

### 3Tri’s Modern Garden Structure

- файл: `parks_3tris-modern-garden-structure_mc-mod_x.schematic` · категория: **parks** · теги: medium|modern|park · 47x37x50 · 5002 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_3tris-modern-garden-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Decorative Lantern Tree

- файл: `parks_decorative-lantern-tree_mc-mod_x.schematic` · категория: **parks** · теги: tiny|tree · 10x11x11 · 65 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_decorative-lantern-tree_mc-mod_x.png`
- вердикт: undefined

### Cozy House with Garden and Garage

- файл: `parks_cozy-house-with-garden-and-garage_mc-mod_x.schematic` · категория: **parks** · теги: house|park|parking|tiny · 13x12x10 · 977 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_cozy-house-with-garden-and-garage_mc-mod_x.png`
- вердикт: undefined

### Japanese Garden House – Spruce & Dark Oak

- файл: `parks_japanese-garden-house-spruce-dark-oak_mc-mod_x.schematic` · категория: **parks** · теги: house|medium|park|tree · 54x23x56 · 8179 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_japanese-garden-house-spruce-dark-oak_mc-mod_x.png`
- вердикт: undefined

### Massive Tree Structure

- файл: `parks_massive-tree-structure_mc-mod_x.schematic` · категория: **parks** · теги: medium|tree · 39x11x48 · 4306 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_massive-tree-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Large Romantic Tree

- файл: `parks_large-romantic-tree_mc-mod_x.schematic` · категория: **parks** · теги: medium|tall|tree · 42x44x44 · 14885 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_large-romantic-tree_mc-mod_x.png`
- вердикт: undefined

### Custom Birch Tree Decoration

- файл: `parks_custom-birch-tree-decoration_mc-mod_x.schematic` · категория: **parks** · теги: tiny|tree · 8x25x8 · 39 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_custom-birch-tree-decoration_mc-mod_x.png`
- вердикт: undefined

### Chafariz/Fonte - Fountain 02

- файл: `parks_chafariz-fonte-fountain-02_mcbuild_x.schem` · категория: **parks** · теги: fountain|small|water · 17x7x17 · 692 блоков · источник: mcbuild
- превью: `schemes/thumbs/parks_chafariz-fonte-fountain-02_mcbuild_x.png`
- вердикт: undefined

### 4 Sword Fountain

- файл: `parks_4-sword-fountain_mcbuild_x.schem` · категория: **parks** · теги: fountain|small|water · 19x27x19 · 1178 блоков · источник: mcbuild
- превью: `schemes/thumbs/parks_4-sword-fountain_mcbuild_x.png`
- вердикт: undefined

### Compact Hospital Structure

- файл: `public_compact-hospital-structure_mc-mod_x.schem` · категория: **public** · теги: hospital|medium · 28x31x36 · 2368 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_compact-hospital-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Country Library Building

- файл: `public_country-library-building_mc-mod_x.schem` · категория: **public** · теги: library|small · 23x15x27 · 5757 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_country-library-building_mc-mod_x.png`
- вердикт: undefined

### Dirt Church Structure

- файл: `public_dirt-church-structure_mc-mod_x.schem` · категория: **public** · теги: church|medium · 33x30x43 · 9934 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_dirt-church-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Early American Library Building

- файл: `public_early-american-library-building_mc-mod_x.schem` · категория: **public** · теги: library|small · 14x32x14 · 1811 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_early-american-library-building_mc-mod_x.png`
- вердикт: undefined

### Eldwyn Library Structure

- файл: `public_eldwyn-library-structure_mc-mod_x.schem` · категория: **public** · теги: large|library|tall · 73x60x101 · 23651 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_eldwyn-library-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Elementary School Building

- файл: `public_elementary-school-building_mc-mod_x.schem` · категория: **public** · теги: large|school · 58x27x93 · 29155 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_elementary-school-building_mc-mod_x.png`
- вердикт: undefined

### Fallout 3 Springvale School Building

- файл: `public_fallout-3-springvale-school-building_mc-mod_x.schem` · категория: **public** · теги: large|school|tall · 80x41x100 · 85884 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_fallout-3-springvale-school-building_mc-mod_x.png`
- вердикт: undefined · флаги: franchise

### Fire Truck Vehicle

- файл: `public_fire-truck-vehicle_mc-mod_x.schem` · категория: **public** · теги: car|tiny · 13x5x5 · 75 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_fire-truck-vehicle_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### Futuristic Stadium Angle Section

- файл: `public_futuristic-stadium-angle-section_mc-mod_x.schem` · категория: **public** · теги: large|modern|stadium|tall · 54x45x54 · 28205 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_futuristic-stadium-angle-section_mc-mod_x.png`
- вердикт: undefined

### Futuristic Stadium Panel

- файл: `public_futuristic-stadium-panel_mc-mod_x.schem` · категория: **public** · теги: modern|stadium|tiny · 57x9x3 · 867 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_futuristic-stadium-panel_mc-mod_x.png`
- вердикт: undefined

### Futuristic Stadium Wall Section

- файл: `public_futuristic-stadium-wall-section_mc-mod_x.schem` · категория: **public** · теги: medium|modern|stadium|tall · 24x44x55 · 8895 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_futuristic-stadium-wall-section_mc-mod_x.png`
- вердикт: undefined

### Geologic Museum Minecraft Build

- файл: `public_geologic-museum-minecraft-build_mc-mod_x.schem` · категория: **public** · теги: museum|small · 23x11x21 · 1217 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_geologic-museum-minecraft-build_mc-mod_x.png`
- вердикт: undefined · флаги: franchise, meta-word-in-name

### Gothic Church Minecraft Structure

- файл: `public_gothic-church-minecraft-structure_mc-mod_x.schem` · категория: **public** · теги: church|huge|tall · 125x113x75 · 62900 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_gothic-church-minecraft-structure_mc-mod_x.png`
- вердикт: undefined · флаги: franchise, meta-word-in-name

### Grand Central Park &#8211; Large Town Square

- файл: `public_grand-central-park-large-town-square_mc-mod_x.schem` · категория: **public** · теги: huge|park|tall · 142x49x126 · 65580 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_grand-central-park-large-town-square_mc-mod_x.png`
- вердикт: undefined

### Hamburg Michel Church Structure

- файл: `public_hamburg-michel-church-structure_mc-mod_x.schem` · категория: **public** · теги: church|medium|tall · 27x55x38 · 4396 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_hamburg-michel-church-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Modern Library Design

- файл: `public_modern-library-design_mc-mod_x.schem` · категория: **public** · теги: library|modern|small · 31x12x7 · 1264 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_modern-library-design_mc-mod_x.png`
- вердикт: undefined

### Modern Police Station Building

- файл: `public_modern-police-station-building_mc-mod_x.schem` · категория: **public** · теги: medium|modern|station · 26x38x41 · 6901 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_modern-police-station-building_mc-mod_x.png`
- вердикт: undefined

### Modern Police Station Design

- файл: `public_modern-police-station-design_mc-mod_x.schem` · категория: **public** · теги: medium|modern|station · 47x26x71 · 20242 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_modern-police-station-design_mc-mod_x.png`
- вердикт: undefined

### Modern School Building

- файл: `public_modern-school-building_mc-mod_x.schem` · категория: **public** · теги: medium|modern|school · 28x23x60 · 6319 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_modern-school-building_mc-mod_x.png`
- вердикт: undefined

### Mystcraft-Inspired Library Structure

- файл: `public_mystcraft-inspired-library-structure_mc-mod_x.schem` · категория: **public** · теги: library|small · 17x10x17 · 655 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_mystcraft-inspired-library-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Mystical Church Structure

- файл: `public_mystical-church-structure_mc-mod_x.schem` · категория: **public** · теги: church|large|tall · 40x115x82 · 32604 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_mystical-church-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Nierta Central Park Town Square

- файл: `public_nierta-central-park-town-square_mc-mod_x.schem` · категория: **public** · теги: park|small · 39x3x38 · 3048 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_nierta-central-park-town-square_mc-mod_x.png`
- вердикт: undefined

### Old Church Structure

- файл: `public_old-church-structure_mc-mod_x.schem` · категория: **public** · теги: church|medium · 49x20x64 · 4252 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_old-church-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Police Car Vehicle

- файл: `public_police-car-vehicle_mc-mod_x.schem` · категория: **public** · теги: car|medium · 36x32x88 · 9052 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_police-car-vehicle_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### Police Vehicle

- файл: `public_police-vehicle_mc-mod_x.schem` · категория: **public** · теги: tiny · 6x6x10 · 74 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_police-vehicle_mc-mod_x.png`
- вердикт: undefined

### Quaint Library Structure

- файл: `public_quaint-library-structure_mc-mod_x.schem` · категория: **public** · теги: library|medium|tall · 9x256x14 · 749 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_quaint-library-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Renaissance Church Structure

- файл: `public_renaissance-church-structure_mc-mod_x.schem` · категория: **public** · теги: church|medium|tall · 61x42x27 · 11064 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_renaissance-church-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Rivertown Library Structure

- файл: `public_rivertown-library-structure_mc-mod_x.schem` · категория: **public** · теги: library|medium|tall · 39x41x53 · 12202 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_rivertown-library-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Simple Minecraft Church Building

- файл: `public_simple-minecraft-church-building_mc-mod_x.schem` · категория: **public** · теги: church|medium · 39x38x59 · 8431 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_simple-minecraft-church-building_mc-mod_x.png`
- вердикт: undefined · флаги: franchise

### St. Pancras Old Church Exterior Replica

- файл: `public_st-pancras-old-church-exterior-replica_mc-mod_x.schem` · категория: **public** · теги: church|medium · 80x34x27 · 2802 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_st-pancras-old-church-exterior-replica_mc-mod_x.png`
- вердикт: undefined

### Stone Church Building

- файл: `public_stone-church-building_mc-mod_x.schem` · категория: **public** · теги: church|large|tall · 65x80x64 · 17302 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_stone-church-building_mc-mod_x.png`
- вердикт: undefined

### The Hidden Library From The Book

- файл: `public_the-hidden-library-from-the-book_mc-mod_x.schem` · категория: **public** · теги: library|tiny · 11x7x10 · 439 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_the-hidden-library-from-the-book_mc-mod_x.png`
- вердикт: undefined

### TNT Museum

- файл: `public_tnt-museum_mc-mod_x.schem` · категория: **public** · теги: medium|museum · 30x33x31 · 14260 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_tnt-museum_mc-mod_x.png`
- вердикт: undefined

### World Relics Museum Build

- файл: `public_world-relics-museum-build_mc-mod_x.schem` · категория: **public** · теги: huge|museum|tall · 114x58x77 · 96360 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_world-relics-museum-build_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Yandere High School Electric Chair Room

- файл: `public_yandere-high-school-electric-chair-room_mc-mod_x.schem` · категория: **public** · теги: school|tiny · 8x5x9 · 289 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_yandere-high-school-electric-chair-room_mc-mod_x.png`
- вердикт: undefined

### High Security Jail (default map)

- файл: `high-security-jail.schem` · категория: **public** · теги: huge|tall · 131x54x119 · 88508 блоков · источник: pre-existing
- превью: `schemes/thumbs/high-security-jail.png`
- вердикт: undefined · флаги: meta-word-in-name

### Radeon prison

- файл: `radeon-prison.schem` · категория: **public** · теги: large|tall · 69x61x85 · 102272 блоков · источник: pre-existing
- превью: `schemes/thumbs/radeon-prison.png`
- вердикт: undefined

### Bedwars Bed Defence Structure

- файл: `public_bedwars-bed-defence-structure_mc-mod_x.schematic` · категория: **public** · теги: small · 13x13x19 · 405 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_bedwars-bed-defence-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Automatic Trashcan Build

- файл: `public_automatic-trashcan-build_mc-mod_x.schematic` · категория: **public** · теги: tiny · 8x5x6 · 156 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_automatic-trashcan-build_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Airfield and Barracks Structure

- файл: `public_airfield-and-barracks-structure_mc-mod_x.schematic` · категория: **public** · теги: medium · 47x16x134 · 11553 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_airfield-and-barracks-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Minecraft Vet Clinic Building

- файл: `public_minecraft-vet-clinic-building_mc-mod_x.schematic` · категория: **public** · теги: hospital|medium · 38x25x46 · 5541 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_minecraft-vet-clinic-building_mc-mod_x.png`
- вердикт: undefined · флаги: franchise

### Small Town Hall

- файл: `public_small-town-hall_mc-mod_x.schematic` · категория: **public** · теги: medium|shop · 56x40x24 · 22284 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_small-town-hall_mc-mod_x.png`
- вердикт: undefined

### Stone Library Outpost

- файл: `public_stone-library-outpost_mc-mod_x.schematic` · категория: **public** · теги: library|small · 13x14x13 · 500 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_stone-library-outpost_mc-mod_x.png`
- вердикт: undefined

### Yandere High School: Insane Rooms

- файл: `public_yandere-high-school-insane-rooms_mc-mod_x.schematic` · категория: **public** · теги: school|tiny · 5x5x11 · 212 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_yandere-high-school-insane-rooms_mc-mod_x.png`
- вердикт: undefined

### Fallout Drive-In Movie Theater

- файл: `public_fallout-drive-in-movie-theater_mc-mod_x.schematic` · категория: **public** · теги: tiny · 3x10x16 · 172 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_fallout-drive-in-movie-theater_mc-mod_x.png`
- вердикт: undefined · флаги: franchise

### Small Prison Structure

- файл: `public_small-prison-structure_mc-mod_x.schematic` · категория: **public** · теги: medium|shop · 89x11x30 · 12939 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_small-prison-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Old Town Hall

- файл: `public_old-town-hall_mc-mod_x.schematic` · категория: **public** · теги: large|tall · 104x63x60 · 19059 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_old-town-hall_mc-mod_x.png`
- вердикт: undefined

### Enchanted Library Building

- файл: `public_enchanted-library-building_mc-mod_1.14.4.schematic` · категория: **public** · теги: library|medium · 39x36x39 · 12468 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_enchanted-library-building_mc-mod_1.14.4.png`
- вердикт: undefined

### Minecraft Theatre Stage Design

- файл: `public_minecraft-theatre-stage-design_mc-mod_x.schematic` · категория: **public** · теги: medium · 41x19x78 · 27769 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_minecraft-theatre-stage-design_mc-mod_x.png`
- вердикт: undefined · флаги: franchise

### Prison Mining Outpost

- файл: `public_prison-mining-outpost_mc-mod_x.schematic` · категория: **public** · теги: large|tall · 76x79x83 · 69011 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_prison-mining-outpost_mc-mod_x.png`
- вердикт: undefined

### Courthouse Design

- файл: `public_courthouse-design_mc-mod_x.schematic` · категория: **public** · теги: house|medium · 49x28x42 · 9618 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_courthouse-design_mc-mod_x.png`
- вердикт: undefined

### Cozy Village Library

- файл: `public_cozy-village-library_mc-mod_1.16.5.schem` · категория: **public** · теги: house|library|small · 20x12x17 · 1412 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_cozy-village-library_mc-mod_1.16.5.png`
- вердикт: undefined

### Ancient Greek Theatre

- файл: `public_ancient-greek-theatre_mc-mod_x.schematic` · категория: **public** · теги: large|tall · 94x45x59 · 8761 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_ancient-greek-theatre_mc-mod_x.png`
- вердикт: undefined

### Mastermind Prison Mine

- файл: `public_mastermind-prison-mine_mc-mod_x.schematic` · категория: **public** · теги: huge|tall · 78x67x119 · 36117 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_mastermind-prison-mine_mc-mod_x.png`
- вердикт: undefined

### Server Town Hall Building

- файл: `public_server-town-hall-building_mc-mod_x.schematic` · категория: **public** · теги: medium · 32x32x32 · 7621 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_server-town-hall-building_mc-mod_x.png`
- вердикт: undefined

### Repaired Stronghold With Libraries

- файл: `public_repaired-stronghold-with-libraries_mc-mod_1.20.1.schem` · категория: **public** · теги: large · 118x26x139 · 29715 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_repaired-stronghold-with-libraries_mc-mod_1.20.1.png`
- вердикт: undefined

### Wooden Amphitheatre Structure

- файл: `public_wooden-amphitheatre-structure_mc-mod_1.16.3.schem` · категория: **public** · теги: medium · 63x25x70 · 8274 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_wooden-amphitheatre-structure_mc-mod_1.16.3.png`
- вердикт: undefined · флаги: meta-word-in-name

### Britain’s Got Talent Theatre with Interior

- файл: `public_britain-s-got-talent-theatre-with-interior_mc-mod_1.16.5.schem` · категория: **public** · теги: large|tall · 82x50x76 · 91212 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_britain-s-got-talent-theatre-with-interior_mc-mod_1.16.5.png`
- вердикт: undefined

### Simple Jail Structure

- файл: `public_simple-jail-structure_mc-mod_x.schematic` · категория: **public** · теги: tiny · 6x6x6 · 83 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_simple-jail-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Quartz Town Hall – Versatile Design

- файл: `public_quartz-town-hall-versatile-design_mc-mod_x.schematic` · категория: **public** · теги: medium · 46x17x30 · 4384 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_quartz-town-hall-versatile-design_mc-mod_x.png`
- вердикт: undefined

### Ancient Mayan Amphitheater Structure

- файл: `public_ancient-mayan-amphitheater-structure_mc-mod_1.20.1.schem` · категория: **public** · теги: medium · 33x22x25 · 3063 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_ancient-mayan-amphitheater-structure_mc-mod_1.20.1.png`
- вердикт: undefined · флаги: meta-word-in-name, non-real/fantasy

### Bedrock Prison Structure

- файл: `public_bedrock-prison-structure_mc-mod_1.16.4.schem` · категория: **public** · теги: tiny · 7x4x8 · 162 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_bedrock-prison-structure_mc-mod_1.16.4.png`
- вердикт: undefined · флаги: meta-word-in-name

### Simple Town Hall Design

- файл: `public_simple-town-hall-design_mc-mod_x.schematic` · категория: **public** · теги: medium · 23x27x29 · 2787 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_simple-town-hall-design_mc-mod_x.png`
- вердикт: undefined

### Covid 19 Testing Town Hall Center

- файл: `public_covid-19-testing-town-hall-center_mc-mod_x.schematic` · категория: **public** · теги: small · 14x15x16 · 679 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_covid-19-testing-town-hall-center_mc-mod_x.png`
- вердикт: undefined

### Corner Cinema and Houses

- файл: `public_corner-cinema-and-houses_mc-mod_1.14.4.schem` · категория: **public** · теги: house|medium · 38x32x51 · 17310 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_corner-cinema-and-houses_mc-mod_1.14.4.png`
- вердикт: undefined

### Basic City Hall for Small Towns

- файл: `public_basic-city-hall-for-small-towns_mc-mod_1.15.2.schem` · категория: **public** · теги: medium|shop · 32x28x30 · 6848 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_basic-city-hall-for-small-towns_mc-mod_1.15.2.png`
- вердикт: undefined

### Grand Performance Theatre

- файл: `public_grand-performance-theatre_mc-mod_1.14.4.schem` · категория: **public** · теги: large|tall · 80x66x67 · 40683 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_grand-performance-theatre_mc-mod_1.14.4.png`
- вердикт: undefined

### Hermitcraft Season 7 Town Hall Replica

- файл: `public_hermitcraft-season-7-town-hall-replica_mc-mod_1.16.5.schem` · категория: **public** · теги: medium|tall · 50x45x41 · 13652 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_hermitcraft-season-7-town-hall-replica_mc-mod_1.16.5.png`
- вердикт: undefined

### French Town Hall Building

- файл: `public_french-town-hall-building_mc-mod_1.16.5.schem` · категория: **public** · теги: medium · 77x16x53 · 10101 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_french-town-hall-building_mc-mod_1.16.5.png`
- вердикт: undefined

### Simple Courthouse Design V2

- файл: `public_simple-courthouse-design-v2_mc-mod_1.16.5.schem` · категория: **public** · теги: house|medium · 36x12x38 · 1566 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_simple-courthouse-design-v2_mc-mod_1.16.5.png`
- вердикт: undefined · флаги: meta-word-in-name

### Grand Town Hall

- файл: `public_town-hall-building-2_mc-mod_1.17.1.schem` · категория: **public** · теги: large|tall · 76x51x38 · 16521 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_town-hall-building-2_mc-mod_1.17.1.png`
- вердикт: undefined

### Village Town Hall Building

- файл: `public_village-town-hall-building_mc-mod_x.schematic` · категория: **public** · теги: house|small · 18x10x16 · 949 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_village-town-hall-building_mc-mod_x.png`
- вердикт: undefined

### Cobblestone and Glass Portal Towers

- файл: `public_cobblestone-and-glass-portal-towers_mc-mod_x.schematic` · категория: **public** · теги: large|tall|tower · 74x71x92 · 28350 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_cobblestone-and-glass-portal-towers_mc-mod_x.png`
- вердикт: undefined

### Rustic Village with Longhouse and Towers

- файл: `public_rustic-village-with-longhouse-and-towers_mc-mod_x.schematic` · категория: **public** · теги: house|large|tower · 68x28x75 · 21060 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_rustic-village-with-longhouse-and-towers_mc-mod_x.png`
- вердикт: undefined

### Desert Water Temple With Symmetrical Towers

- файл: `public_desert-water-temple-with-symmetrical-towers_mc-mod_x.schematic` · категория: **public** · теги: medium|tower · 59x19x59 · 19943 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_desert-water-temple-with-symmetrical-towers_mc-mod_x.png`
- вердикт: undefined

### New York Style Townhouses With Pool

- файл: `public_new-york-style-townhouses-with-pool_mc-mod_1.19.4.schem` · категория: **public** · теги: house|medium|pool|water · 48x25x47 · 11281 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_new-york-style-townhouses-with-pool_mc-mod_1.19.4.png`
- вердикт: undefined

### Modern Hospital Building

- файл: `public_modern-hospital-building_buildschematics_x.schematic` · категория: **public** · теги: hospital|modern|small · 20x16x32 · 3452 блоков · источник: buildschematics
- превью: `schemes/thumbs/public_modern-hospital-building_buildschematics_x.png`
- вердикт: undefined

### Two-Story Hospital Building

- файл: `public_two-story-hospital-building_buildschematics_x.schematic` · категория: **public** · теги: hospital|medium · 63x17x35 · 11923 блоков · источник: buildschematics
- превью: `schemes/thumbs/public_two-story-hospital-building_buildschematics_x.png`
- вердикт: undefined

### Huge Modern Hospital!

- файл: `public_huge-modern-hospital_mcbuild_x.schem` · категория: **public** · теги: hospital|huge|modern|tall · 65x103x78 · 58176 блоков · источник: mcbuild
- превью: `schemes/thumbs/public_huge-modern-hospital_mcbuild_x.png`
- вердикт: undefined

### Hospital

- файл: `public_hospital_mcbuild_x.schem` · категория: **public** · теги: hospital|medium · 34x20x31 · 6163 блоков · источник: mcbuild
- превью: `schemes/thumbs/public_hospital_mcbuild_x.png`
- вердикт: undefined

### equipped-firestation

- файл: `public_equipped-firestation_mcbuild_x.schem` · категория: **public** · теги: large|station · 99x31x121 · 44475 блоков · источник: mcbuild
- превью: `schemes/thumbs/public_equipped-firestation_mcbuild_x.png`
- вердикт: undefined

### Sims 3 Style City Hall

- файл: `public_sims-3-style-city-hall_buildschematics_x.schematic` · категория: **public** · теги: large|tall · 67x52x40 · 14228 блоков · источник: buildschematics
- превью: `schemes/thumbs/public_sims-3-style-city-hall_buildschematics_x.png`
- вердикт: undefined

### City Hall

- файл: `public_city-hall_mcbuild_x.schem` · категория: **public** · теги: medium · 36x27x29 · 5783 блоков · источник: mcbuild
- превью: `schemes/thumbs/public_city-hall_mcbuild_x.png`
- вердикт: undefined

### Town hall

- файл: `public_town-hall_mcbuild_x.schem` · категория: **public** · теги: medium · 32x32x32 · 7621 блоков · источник: mcbuild
- превью: `schemes/thumbs/public_town-hall_mcbuild_x.png`
- вердикт: undefined

### theater

- файл: `public_theater_mcbuild_x.schem` · категория: **public** · теги: medium · 48x32x50 · 11175 блоков · источник: mcbuild
- превью: `schemes/thumbs/public_theater_mcbuild_x.png`
- вердикт: undefined · флаги: duplicate-name

### Greek Theater

- файл: `public_greek-theater_mcbuild_x.schem` · категория: **public** · теги: medium · 31x25x62 · 7525 блоков · источник: mcbuild
- превью: `schemes/thumbs/public_greek-theater_mcbuild_x.png`
- вердикт: undefined

### Theater

- файл: `public_theater_mcbuild_x-2.schem` · категория: **public** · теги: large · 60x37x96 · 104571 блоков · источник: mcbuild
- превью: `schemes/thumbs/public_theater_mcbuild_x-2.png`
- вердикт: undefined · флаги: duplicate-name

### Shakespears theater

- файл: `public_shakespears-theater_mcbuild_x.schem` · категория: **public** · теги: small · 26x12x33 · 3778 блоков · источник: mcbuild
- превью: `schemes/thumbs/public_shakespears-theater_mcbuild_x.png`
- вердикт: undefined

### Modern Twin Cinema Building

- файл: `public_modern-twin-cinema-building_buildschematics_x.schematic` · категория: **public** · теги: medium|modern · 42x12x32 · 2596 блоков · источник: buildschematics
- превью: `schemes/thumbs/public_modern-twin-cinema-building_buildschematics_x.png`
- вердикт: undefined

### Multi-Room Cinema with Concessions

- файл: `public_multi-room-cinema-with-concessions_buildschematics_x.schematic` · категория: **public** · теги: medium · 36x13x107 · 26813 блоков · источник: buildschematics
- превью: `schemes/thumbs/public_multi-room-cinema-with-concessions_buildschematics_x.png`
- вердикт: undefined

### 6 Room Cinema

- файл: `public_6-room-cinema_mcbuild_x.schem` · категория: **public** · теги: medium · 36x13x107 · 24390 блоков · источник: mcbuild
- превью: `schemes/thumbs/public_6-room-cinema_mcbuild_x.png`
- вердикт: undefined

### Twin Cinema Complex

- файл: `public_twin-cinema-complex_mcbuild_x.schem` · категория: **public** · теги: medium · 42x12x32 · 2687 блоков · источник: mcbuild
- превью: `schemes/thumbs/public_twin-cinema-complex_mcbuild_x.png`
- вердикт: undefined

### Cinema

- файл: `public_cinema_mcbuild_x.schem` · категория: **public** · теги: medium · 31x15x38 · 6498 блоков · источник: mcbuild
- превью: `schemes/thumbs/public_cinema_mcbuild_x.png`
- вердикт: undefined

### Double-Sided Sony Logo Billboard

- файл: `public_double-sided-sony-logo-billboard_buildschematics_x.schematic` · категория: **public** · теги: small · 64x19x11 · 3029 блоков · источник: buildschematics
- превью: `schemes/thumbs/public_double-sided-sony-logo-billboard_buildschematics_x.png`
- вердикт: undefined · флаги: non-building-in-name

### "Do you even shift bro" billboard

- файл: `public_quot-do-you-even-shift-bro-quot-billboard_mcbuild_x.schem` · категория: **public** · теги: medium|tall · 49x41x13 · 5167 блоков · источник: mcbuild
- превью: `schemes/thumbs/public_quot-do-you-even-shift-bro-quot-billboard_mcbuild_x.png`
- вердикт: undefined

### Large Billboard

- файл: `public_large-billboard_mcbuild_x.schem` · категория: **public** · теги: medium|tall · 49x41x13 · 2717 блоков · источник: mcbuild
- превью: `schemes/thumbs/public_large-billboard_mcbuild_x.png`
- вердикт: undefined

### WorkBench

- файл: `public_workbench_mcbuild_x.schem` · категория: **public** · теги: small · 16x17x16 · 2042 блоков · источник: mcbuild
- превью: `schemes/thumbs/public_workbench_mcbuild_x.png`
- вердикт: undefined

### Toyland-FisherPrice Workbench

- файл: `public_toyland-fisherprice-workbench_mcbuild_x.schem` · категория: **public** · теги: medium · 31x31x23 · 2887 блоков · источник: mcbuild
- превью: `schemes/thumbs/public_toyland-fisherprice-workbench_mcbuild_x.png`
- вердикт: undefined

### Art School Building

- файл: `public_art-school-building_buildschematics_x.schematic` · категория: **public** · теги: medium|school · 38x38x40 · 13429 блоков · источник: buildschematics
- превью: `schemes/thumbs/public_art-school-building_buildschematics_x.png`
- вердикт: undefined

### German School Building

- файл: `public_german-school-building_buildschematics_x.schematic` · категория: **public** · теги: medium|school · 50x34x70 · 29526 блоков · источник: buildschematics
- превью: `schemes/thumbs/public_german-school-building_buildschematics_x.png`
- вердикт: undefined

### Pixelmon School Building

- файл: `public_pixelmon-school-building_buildschematics_x.schematic` · категория: **public** · теги: huge|school|tall · 118x62x105 · 50968 блоков · источник: buildschematics
- превью: `schemes/thumbs/public_pixelmon-school-building_buildschematics_x.png`
- вердикт: undefined

### School

- файл: `public_school_mcbuild_x.schem` · категория: **public** · теги: medium|school · 74x23x70 · 19049 блоков · источник: mcbuild
- превью: `schemes/thumbs/public_school_mcbuild_x.png`
- вердикт: undefined

### Secondary School  - LE

- файл: `public_secondary-school-le_mcbuild_x.schem` · категория: **public** · теги: medium|school · 26x33x29 · 3757 блоков · источник: mcbuild
- превью: `schemes/thumbs/public_secondary-school-le_mcbuild_x.png`
- вердикт: undefined

### Small Soccer Stadium Build

- файл: `public_small-soccer-stadium-build_buildschematics_x.schem` · категория: **public** · теги: large|shop|stadium · 97x27x65 · 10258 блоков · источник: buildschematics
- превью: `schemes/thumbs/public_small-soccer-stadium-build_buildschematics_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Apocalyptic Prison Mine

- файл: `public_apocalyptic-prison-mine_buildschematics_x.schematic` · категория: **public** · теги: huge|tall · 138x66x104 · 75301 блоков · источник: buildschematics
- превью: `schemes/thumbs/public_apocalyptic-prison-mine_buildschematics_x.png`
- вердикт: undefined

### Small Prison Building

- файл: `public_small-prison-building_buildschematics_x.schematic` · категория: **public** · теги: medium|shop · 63x9x43 · 9440 блоков · источник: buildschematics
- превью: `schemes/thumbs/public_small-prison-building_buildschematics_x.png`
- вердикт: undefined

### Desert Prison Structure

- файл: `public_desert-prison-structure_buildschematics_x.schematic` · категория: **public** · теги: large|tall · 42x74x42 · 93856 блоков · источник: buildschematics
- превью: `schemes/thumbs/public_desert-prison-structure_buildschematics_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Sand Prison

- файл: `public_sand-prison_mcbuild_x.schem` · категория: **public** · теги: large|tall · 42x74x42 · 93843 блоков · источник: mcbuild
- превью: `schemes/thumbs/public_sand-prison_mcbuild_x.png`
- вердикт: undefined

### Jail/Prison

- файл: `public_jail-prison_mcbuild_x.schem` · категория: **public** · теги: small|tall · 8x256x6 · 318 блоков · источник: mcbuild
- превью: `schemes/thumbs/public_jail-prison_mcbuild_x.png`
- вердикт: undefined

### Compact Quartz Modern House

- файл: `residential_compact-quartz-modern-house_mc-mod_x.schem` · категория: **residential** · теги: house|modern|small · 16x11x17 · 897 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_compact-quartz-modern-house_mc-mod_x.png`
- вердикт: undefined

### Concrete Warehouse Structure

- файл: `residential_concrete-warehouse-structure_mc-mod_x.schem` · категория: **residential** · теги: house|small · 25x20x25 · 1781 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_concrete-warehouse-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Cozy Medium House With Garden

- файл: `residential_cozy-medium-house-with-garden_mc-mod_x.schem` · категория: **residential** · теги: house|medium|park · 39x19x25 · 3790 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_cozy-medium-house-with-garden_mc-mod_x.png`
- вердикт: undefined

### Cozy Small House with Attic and Basement

- файл: `residential_cozy-small-house-with-attic-and-basement_mc-mod_x.schem` · категория: **residential** · теги: house|medium|shop · 29x21x40 · 9458 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_cozy-small-house-with-attic-and-basement_mc-mod_x.png`
- вердикт: undefined

### Early 20th Century Schoolhouse

- файл: `residential_early-20th-century-schoolhouse_mc-mod_x.schem` · категория: **residential** · теги: house|school|small · 40x17x18 · 4884 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_early-20th-century-schoolhouse_mc-mod_x.png`
- вердикт: undefined

### Eldorado House Lakeside Residence

- файл: `residential_eldorado-house-lakeside-residence_mc-mod_x.schem` · категория: **residential** · теги: apartment|house|medium · 46x25x57 · 13230 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_eldorado-house-lakeside-residence_mc-mod_x.png`
- вердикт: undefined

### Fallout 3 Player Shack House

- файл: `residential_fallout-3-player-shack-house_mc-mod_x.schem` · категория: **residential** · теги: house|small · 20x12x25 · 2615 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_fallout-3-player-shack-house_mc-mod_x.png`
- вердикт: undefined · флаги: franchise

### Fallout 3 Rubble House

- файл: `residential_fallout-3-rubble-house_mc-mod_x.schem` · категория: **residential** · теги: house|small · 23x12x19 · 546 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_fallout-3-rubble-house_mc-mod_x.png`
- вердикт: undefined · флаги: franchise

### Functional Lighthouse

- файл: `residential_functional-lighthouse_mc-mod_x.schem` · категория: **residential** · теги: house|medium|tall|water · 20x51x20 · 5391 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_functional-lighthouse_mc-mod_x.png`
- вердикт: undefined

### Hidden Wooden House

- файл: `residential_hidden-wooden-house_mc-mod_x.schem` · категория: **residential** · теги: house|medium · 38x33x37 · 8719 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_hidden-wooden-house_mc-mod_x.png`
- вердикт: undefined

### Improved Warehouse Storage Structure

- файл: `residential_improved-warehouse-storage-structure_mc-mod_x.schem` · категория: **residential** · теги: house|huge · 121x20x217 · 42262 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_improved-warehouse-storage-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Island House Lakefront

- файл: `residential_island-house-lakefront_mc-mod_x.schem` · категория: **residential** · теги: house|large · 63x24x86 · 52320 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_island-house-lakefront_mc-mod_x.png`
- вердикт: undefined

### Item Storage Warehouse

- файл: `residential_item-storage-warehouse_mc-mod_x.schem` · категория: **residential** · теги: house|medium · 84x16x19 · 8496 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_item-storage-warehouse_mc-mod_x.png`
- вердикт: undefined

### Keralis Style Giant Mansion

- файл: `residential_keralis-style-giant-mansion_mc-mod_x.schem` · категория: **residential** · теги: house|huge · 201x30x149 · 50850 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_keralis-style-giant-mansion_mc-mod_x.png`
- вердикт: undefined

### Kingdom Banker Shop House

- файл: `residential_kingdom-banker-shop-house_mc-mod_x.schem` · категория: **residential** · теги: bank|house|shop|tiny · 11x11x13 · 587 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_kingdom-banker-shop-house_mc-mod_x.png`
- вердикт: undefined · флаги: non-real/fantasy

### Lapis and Pickaxe Shop &#8211; Medium House

- файл: `residential_lapis-and-pickaxe-shop-medium-house_mc-mod_x.schem` · категория: **residential** · теги: house|medium|shop · 24x37x23 · 7934 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_lapis-and-pickaxe-shop-medium-house_mc-mod_x.png`
- вердикт: undefined

### Large House and Shop Building

- файл: `residential_large-house-and-shop-building_mc-mod_x.schem` · категория: **residential** · теги: house|large|shop|tall · 54x45x58 · 9061 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_large-house-and-shop-building_mc-mod_x.png`
- вердикт: undefined

### Large Ranch Style Minimalist House

- файл: `residential_large-ranch-style-minimalist-house_mc-mod_x.schem` · категория: **residential** · теги: house|medium · 64x20x47 · 19976 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_large-ranch-style-minimalist-house_mc-mod_x.png`
- вердикт: undefined

### Large Server Warehouse

- файл: `residential_large-server-warehouse_mc-mod_x.schem` · категория: **residential** · теги: house|large|tall · 55x105x54 · 23556 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_large-server-warehouse_mc-mod_x.png`
- вердикт: undefined

### Large Survival Mansion House

- файл: `residential_large-survival-mansion-house_mc-mod_x.schem` · категория: **residential** · теги: house|medium · 50x25x55 · 8972 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_large-survival-mansion-house_mc-mod_x.png`
- вердикт: undefined

### Luxury Mansion With Party Room

- файл: `residential_luxury-mansion-with-party-room_mc-mod_x.schem` · категория: **residential** · теги: house|large · 84x20x77 · 25846 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_luxury-mansion-with-party-room_mc-mod_x.png`
- вердикт: undefined

### Luxury Studio Apartment

- файл: `residential_luxury-studio-apartment_mc-mod_x.schem` · категория: **residential** · теги: apartment|tiny · 4x8x6 · 155 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_luxury-studio-apartment_mc-mod_x.png`
- вердикт: undefined

### Luxury Villa with Courtyard and Pool

- файл: `residential_luxury-villa-with-courtyard-and-pool_mc-mod_x.schem` · категория: **residential** · теги: house|medium|pool|water · 46x23x47 · 12194 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_luxury-villa-with-courtyard-and-pool_mc-mod_x.png`
- вердикт: undefined

### Modern Cyan Terracotta House

- файл: `residential_modern-cyan-terracotta-house_mc-mod_x.schem` · категория: **residential** · теги: house|medium|modern · 67x22x53 · 26211 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_modern-cyan-terracotta-house_mc-mod_x.png`
- вердикт: undefined

### Modern House Design With Library

- файл: `residential_modern-house-design-with-library_mc-mod_x.schem` · категория: **residential** · теги: house|large|library|modern · 50x27x89 · 21630 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_modern-house-design-with-library_mc-mod_x.png`
- вердикт: undefined

### Modern Lakehouse Mansion

- файл: `residential_modern-lakehouse-mansion_mc-mod_x.schem` · категория: **residential** · теги: house|large|modern · 67x35x96 · 23476 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_modern-lakehouse-mansion_mc-mod_x.png`
- вердикт: undefined

### Modern Library House

- файл: `residential_modern-library-house_mc-mod_x.schem` · категория: **residential** · теги: house|library|modern|small · 15x17x15 · 611 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_modern-library-house_mc-mod_x.png`
- вердикт: undefined

### Modern Luxury Residence

- файл: `residential_modern-luxury-residence_mc-mod_x.schem` · категория: **residential** · теги: apartment|medium|modern · 39x12x35 · 3728 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_modern-luxury-residence_mc-mod_x.png`
- вердикт: undefined

### Modern Quartz House With Birch Accents

- файл: `residential_modern-quartz-house-with-birch-accents_mc-mod_x.schem` · категория: **residential** · теги: house|modern|small|tree · 24x13x24 · 2956 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_modern-quartz-house-with-birch-accents_mc-mod_x.png`
- вердикт: undefined

### Modern Small to Medium Futuristic House

- файл: `residential_modern-small-to-medium-futuristic-house_mc-mod_x.schem` · категория: **residential** · теги: house|modern|shop|small · 24x20x22 · 1958 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_modern-small-to-medium-futuristic-house_mc-mod_x.png`
- вердикт: undefined

### Modern Villa With Survival Features

- файл: `residential_modern-villa-with-survival-features_mc-mod_x.schem` · категория: **residential** · теги: house|huge|modern|tall · 112x44x158 · 152339 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_modern-villa-with-survival-features_mc-mod_x.png`
- вердикт: undefined

### Modern Warehouse with Iron Gate Details

- файл: `residential_modern-warehouse-with-iron-gate-details_mc-mod_x.schem` · категория: **residential** · теги: house|large|modern · 135x18x83 · 29565 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_modern-warehouse-with-iron-gate-details_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### Modern White City Apartment Building

- файл: `residential_modern-white-city-apartment-building_mc-mod_x.schem` · категория: **residential** · теги: apartment|modern|small · 17x21x21 · 2668 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_modern-white-city-apartment-building_mc-mod_x.png`
- вердикт: undefined

### Nine-Story Apartment Building Series

- файл: `residential_nine-story-apartment-building-series_mc-mod_x.schem` · категория: **residential** · теги: apartment|medium|tall · 25x53x47 · 22525 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_nine-story-apartment-building-series_mc-mod_x.png`
- вердикт: undefined

### Portuguese Style House

- файл: `residential_portuguese-style-house_mc-mod_x.schem` · категория: **residential** · теги: house|medium · 19x27x38 · 5951 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_portuguese-style-house_mc-mod_x.png`
- вердикт: undefined

### Quad Steam Turbine Warehouse

- файл: `residential_quad-steam-turbine-warehouse_mc-mod_x.schem` · категория: **residential** · теги: house|medium · 30x7x147 · 11770 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_quad-steam-turbine-warehouse_mc-mod_x.png`
- вердикт: undefined

### Quartz Spruce Small House

- файл: `residential_quartz-spruce-small-house_mc-mod_x.schem` · категория: **residential** · теги: house|shop|small|tree · 23x18x13 · 1694 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_quartz-spruce-small-house_mc-mod_x.png`
- вердикт: undefined

### Rainbow Lighthouse

- файл: `residential_rainbow-lighthouse_mc-mod_x.schem` · категория: **residential** · теги: house|tiny|water · 2x23x2 · 25 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_rainbow-lighthouse_mc-mod_x.png`
- вердикт: undefined

### Rustic Cottage House

- файл: `residential_rustic-cottage-house-3_mc-mod_x.schem` · категория: **residential** · теги: house|small · 23x12x30 · 1792 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_rustic-cottage-house-3_mc-mod_x.png`
- вердикт: undefined

### Rustic Furnished Wooden House

- файл: `residential_rustic-furnished-wooden-house_mc-mod_x.schem` · категория: **residential** · теги: house|medium · 29x15x35 · 3258 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_rustic-furnished-wooden-house_mc-mod_x.png`
- вердикт: undefined

### Rustic Modern House with Pool and Barn

- файл: `residential_rustic-modern-house-with-pool-and-barn_mc-mod_x.schem` · категория: **residential** · теги: house|medium|modern|pool|water · 33x31x34 · 7198 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_rustic-modern-house-with-pool-and-barn_mc-mod_x.png`
- вердикт: undefined

### Sam and Taurtis&#8217; Roleplay House

- файл: `residential_sam-and-taurtis-roleplay-house_mc-mod_x.schem` · категория: **residential** · теги: house|small · 10x23x9 · 800 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_sam-and-taurtis-roleplay-house_mc-mod_x.png`
- вердикт: undefined

### Seaside Multi-Story House

- файл: `residential_seaside-multi-story-house_mc-mod_x.schem` · категория: **residential** · теги: house|medium · 49x35x31 · 10289 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_seaside-multi-story-house_mc-mod_x.png`
- вердикт: undefined

### Secluded Cove House With Shops

- файл: `residential_secluded-cove-house-with-shops_mc-mod_x.schem` · категория: **residential** · теги: house|huge|shop|tall · 129x45x128 · 505687 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_secluded-cove-house-with-shops_mc-mod_x.png`
- вердикт: undefined

### Shop House Building

- файл: `residential_shop-house-building_mc-mod_x.schem` · категория: **residential** · теги: house|shop|small · 27x20x25 · 2350 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_shop-house-building_mc-mod_x.png`
- вердикт: undefined

### Shop House for Sale

- файл: `residential_shop-house-for-sale_mc-mod_x.schem` · категория: **residential** · теги: house|shop|small · 14x16x29 · 2735 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_shop-house-for-sale_mc-mod_x.png`
- вердикт: undefined

### Shop or House Design

- файл: `residential_shop-or-house-design_mc-mod_x.schem` · категория: **residential** · теги: house|medium|shop · 31x23x32 · 3503 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_shop-or-house-design_mc-mod_x.png`
- вердикт: undefined

### Simple Small House

- файл: `residential_simple-small-house_mc-mod_x.schem` · категория: **residential** · теги: house|medium|shop|tall · 11x256x11 · 629 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_simple-small-house_mc-mod_x.png`
- вердикт: undefined

### Simple Yellow House

- файл: `residential_simple-yellow-house_mc-mod_x.schem` · категория: **residential** · теги: house|tiny · 11x11x16 · 751 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_simple-yellow-house_mc-mod_x.png`
- вердикт: undefined

### Small Apartment Building

- файл: `residential_small-apartment-building_mc-mod_x.schem` · категория: **residential** · теги: apartment|shop|small · 23x18x23 · 3735 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_small-apartment-building_mc-mod_x.png`
- вердикт: undefined

### Small Asian Style House

- файл: `residential_small-asian-style-house_mc-mod_x.schem` · категория: **residential** · теги: house|shop|small · 26x12x19 · 636 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_small-asian-style-house_mc-mod_x.png`
- вердикт: undefined

### Small Fancy Wooden House

- файл: `residential_small-fancy-wooden-house_mc-mod_x.schem` · категория: **residential** · теги: house|shop|small · 14x11x13 · 613 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_small-fancy-wooden-house_mc-mod_x.png`
- вердикт: undefined

### Small House with Garden Path

- файл: `residential_small-house-with-garden-path_mc-mod_x.schem` · категория: **residential** · теги: house|large|park|shop|tall · 50x56x49 · 62455 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_small-house-with-garden-path_mc-mod_x.png`
- вердикт: undefined

### Small Schoolhouse With Blackboard

- файл: `residential_small-schoolhouse-with-blackboard_mc-mod_x.schem` · категория: **residential** · теги: house|school|shop|tiny · 12x5x8 · 293 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_small-schoolhouse-with-blackboard_mc-mod_x.png`
- вердикт: undefined

### Small Waterfront House

- файл: `residential_small-waterfront-house_mc-mod_x.schem` · категория: **residential** · теги: house|shop|small · 33x12x23 · 2372 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_small-waterfront-house_mc-mod_x.png`
- вердикт: undefined

### Soviet Style Apartment Building

- файл: `residential_soviet-style-apartment-building_mc-mod_x.schem` · категория: **residential** · теги: apartment|small · 30x14x19 · 3376 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_soviet-style-apartment-building_mc-mod_x.png`
- вердикт: undefined

### Spacious Mansion With Park

- файл: `residential_spacious-mansion-with-park_mc-mod_x.schem` · категория: **residential** · теги: house|large|park|tall · 125x43x77 · 41957 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_spacious-mansion-with-park_mc-mod_x.png`
- вердикт: undefined

### Storage Warehouse Building

- файл: `residential_storage-warehouse-building_mc-mod_x.schem` · категория: **residential** · теги: house|huge · 110x25x307 · 68573 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_storage-warehouse-building_mc-mod_x.png`
- вердикт: undefined

### Storage Warehouse Structure

- файл: `residential_storage-warehouse-structure_mc-mod_x.schem` · категория: **residential** · теги: house|medium · 81x22x66 · 15379 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_storage-warehouse-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Survival Mansion 2-Story Build

- файл: `residential_survival-mansion-2-story-build_mc-mod_x.schem` · категория: **residential** · теги: house|small · 22x10x25 · 2534 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_survival-mansion-2-story-build_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Tall Orange Quartz Apartment Building

- файл: `residential_tall-orange-quartz-apartment-building_mc-mod_x.schem` · категория: **residential** · теги: apartment|medium|tall · 51x61x38 · 40424 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_tall-orange-quartz-apartment-building_mc-mod_x.png`
- вердикт: undefined

### Ten Story Apartment Building

- файл: `residential_ten-story-apartment-building_mc-mod_x.schem` · категория: **residential** · теги: apartment|large|tall · 59x56x47 · 75671 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_ten-story-apartment-building_mc-mod_x.png`
- вердикт: undefined

### Two Story House With Attic And Balcony

- файл: `residential_two-story-house-with-attic-and-balcony_mc-mod_x.schem` · категория: **residential** · теги: house|small · 13x20x17 · 995 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_two-story-house-with-attic-and-balcony_mc-mod_x.png`
- вердикт: undefined

### Large Urban Warehouse Storage Building

- файл: `residential_urban-warehouse-storage-building-2_mc-mod_x.schem` · категория: **residential** · теги: house|large · 145x24x69 · 25530 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_urban-warehouse-storage-building-2_mc-mod_x.png`
- вердикт: undefined

### Vehicle Warehouse Storage

- файл: `residential_vehicle-warehouse-storage_mc-mod_x.schem` · категория: **residential** · теги: house|large · 135x19x83 · 34041 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_vehicle-warehouse-storage_mc-mod_x.png`
- вердикт: undefined

### Vibrant Yellow Modern Apartment Building

- файл: `residential_vibrant-yellow-modern-apartment-building_mc-mod_x.schem` · категория: **residential** · теги: apartment|modern|small · 22x21x17 · 2314 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_vibrant-yellow-modern-apartment-building_mc-mod_x.png`
- вердикт: undefined

### Warehouse 13 Storage Building

- файл: `residential_warehouse-13-storage-building_mc-mod_x.schem` · категория: **residential** · теги: house|huge · 181x19x181 · 78026 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_warehouse-13-storage-building_mc-mod_x.png`
- вердикт: undefined

### Warehouse With Movie Sets

- файл: `residential_warehouse-with-movie-sets_mc-mod_x.schem` · категория: **residential** · теги: house|huge · 147x40x139 · 69931 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_warehouse-with-movie-sets_mc-mod_x.png`
- вердикт: undefined

### Modern house N2

- файл: `modern_house_n_2.schem` · категория: **residential** · теги: house|medium|modern · 30x23x31 · 2352 блоков · источник: pre-existing
- превью: `schemes/thumbs/modern_house_n_2.png`
- вердикт: undefined

### Toll Booth Structure

- файл: `residential_toll-booth-structure_mc-mod_x.schematic` · категория: **residential** · теги: huge · 440x17x115 · 57768 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_toll-booth-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Town Layout with Plots for Houses and Markets

- файл: `residential_town-layout-with-plots-for-houses-and-markets_mc-mod_x.schematic` · категория: **residential** · теги: house|large|shop · 130x11x144 · 4237 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_town-layout-with-plots-for-houses-and-markets_mc-mod_x.png`
- вердикт: undefined

### Small Storage House

- файл: `residential_small-storage-house-2_mc-mod_x.schematic` · категория: **residential** · теги: house|shop|small|tall · 7x256x7 · 320 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_small-storage-house-2_mc-mod_x.png`
- вердикт: undefined

### Spacious Modern Mansion Estate

- файл: `residential_spacious-modern-mansion-estate_mc-mod_x.schematic` · категория: **residential** · теги: house|medium|modern · 73x15x62 · 19612 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_spacious-modern-mansion-estate_mc-mod_x.png`
- вердикт: undefined

### Modern Quartz and Dirt Residence

- файл: `residential_modern-quartz-and-dirt-residence_mc-mod_x.schematic` · категория: **residential** · теги: apartment|modern|small · 39x11x31 · 5750 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_modern-quartz-and-dirt-residence_mc-mod_x.png`
- вердикт: undefined

### Medium Town House with Three Floors

- файл: `residential_medium-town-house-with-three-floors_mc-mod_x.schematic` · категория: **residential** · теги: house|medium · 29x22x58 · 4023 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_medium-town-house-with-three-floors_mc-mod_x.png`
- вердикт: undefined

### Medium Brick Cottage House

- файл: `residential_medium-brick-cottage-house_mc-mod_x.schematic` · категория: **residential** · теги: house|medium · 41x23x47 · 6180 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_medium-brick-cottage-house_mc-mod_x.png`
- вердикт: undefined

### Modern House Design with Soartex Textures

- файл: `residential_modern-house-design-with-soartex-textures_mc-mod_x.schematic` · категория: **residential** · теги: house|medium|modern|tall · 31x58x29 · 5279 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_modern-house-design-with-soartex-textures_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### Small Decorative Town House

- файл: `residential_small-decorative-town-house_mc-mod_x.schematic` · категория: **residential** · теги: house|shop|small · 16x8x24 · 667 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_small-decorative-town-house_mc-mod_x.png`
- вердикт: undefined

### Starter Cottage – Oak & Quartz

- файл: `residential_starter-cottage-oak-quartz_mc-mod_x.schematic` · категория: **residential** · теги: house|small|tree · 19x11x28 · 1889 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_starter-cottage-oak-quartz_mc-mod_x.png`
- вердикт: undefined

### Basic House Structure

- файл: `residential_basic-house-structure_mc-mod_x.schematic` · категория: **residential** · теги: house|tiny · 13x7x11 · 490 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_basic-house-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Large Estate House

- файл: `residential_large-estate-house_mc-mod_x.schematic` · категория: **residential** · теги: house|small · 35x22x17 · 3562 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_large-estate-house_mc-mod_x.png`
- вердикт: undefined

### Furnished Brick Townhouse

- файл: `residential_furnished-brick-townhouse_mc-mod_x.schematic` · категория: **residential** · теги: house|medium · 31x16x40 · 5821 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_furnished-brick-townhouse_mc-mod_x.png`
- вердикт: undefined

### Cozy Small Wooden Cottage

- файл: `residential_cozy-small-wooden-cottage_mc-mod_x.schematic` · категория: **residential** · теги: house|medium|shop · 30x31x26 · 8643 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_cozy-small-wooden-cottage_mc-mod_x.png`
- вердикт: undefined

### Snowy Small House

- файл: `residential_snowy-small-house_mc-mod_x.schematic` · категория: **residential** · теги: house|shop|tiny · 15x5x14 · 461 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_snowy-small-house_mc-mod_x.png`
- вердикт: undefined

### Spacious Modern Mansion with Furnished Interior

- файл: `residential_spacious-modern-mansion-with-furnished-interior_mc-mod_x.schematic` · категория: **residential** · теги: house|large|modern|tall · 63x43x50 · 17048 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_spacious-modern-mansion-with-furnished-interior_mc-mod_x.png`
- вердикт: undefined

### Contemporary Residence Schematic

- файл: `residential_contemporary-residence-schematic_mc-mod_x.schematic` · категория: **residential** · теги: apartment|modern|small · 21x14x21 · 1243 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_contemporary-residence-schematic_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Condensed Townhouse Compound Structure

- файл: `residential_condensed-townhouse-compound-structure_mc-mod_x.schematic` · категория: **residential** · теги: house|huge · 251x20x203 · 208838 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_condensed-townhouse-compound-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Rustic Log Cabin House

- файл: `residential_rustic-log-cabin-house_mc-mod_x.schematic` · категория: **residential** · теги: house|medium · 14x35x41 · 5570 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_rustic-log-cabin-house_mc-mod_x.png`
- вердикт: undefined

### Small House With Kitchen and Shower

- файл: `residential_small-house-with-kitchen-and-shower_mc-mod_x.schematic` · категория: **residential** · теги: house|large|shop|tall · 41x76x52 · 14033 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_small-house-with-kitchen-and-shower_mc-mod_x.png`
- вердикт: undefined

### Large Three-Story Mansion

- файл: `residential_large-three-story-mansion_mc-mod_x.schematic` · категория: **residential** · теги: house|large|tall · 62x69x62 · 34343 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_large-three-story-mansion_mc-mod_x.png`
- вердикт: undefined

### Large Modern Villa Residence

- файл: `residential_large-modern-villa-residence_mc-mod_x.schematic` · категория: **residential** · теги: apartment|house|medium|modern · 45x12x31 · 2764 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_large-modern-villa-residence_mc-mod_x.png`
- вердикт: undefined

### Cozy Town House with Hay Roof

- файл: `residential_cozy-town-house-with-hay-roof_mc-mod_x.schematic` · категория: **residential** · теги: house|small · 19x12x13 · 1248 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_cozy-town-house-with-hay-roof_mc-mod_x.png`
- вердикт: undefined

### Birch Cottage House with Furnishings

- файл: `residential_birch-cottage-house-with-furnishings_mc-mod_x.schematic` · категория: **residential** · теги: house|small|tree · 30x19x19 · 2455 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_birch-cottage-house-with-furnishings_mc-mod_x.png`
- вердикт: undefined

### Cozy Hillside House

- файл: `residential_cozy-hillside-house_mc-mod_x.schematic` · категория: **residential** · теги: house|medium|tall · 33x48x33 · 4652 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_cozy-hillside-house_mc-mod_x.png`
- вердикт: undefined

### Small Villa House with Storage

- файл: `residential_small-villa-house-with-storage_mc-mod_x.schematic` · категория: **residential** · теги: house|medium|shop · 63x33x57 · 33062 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_small-villa-house-with-storage_mc-mod_x.png`
- вердикт: undefined

### Modern Villa Residence – Dirt & White Concrete

- файл: `residential_modern-villa-residence-dirt-white-concrete_mc-mod_x.schematic` · категория: **residential** · теги: apartment|house|medium|modern · 55x25x33 · 24777 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_modern-villa-residence-dirt-white-concrete_mc-mod_x.png`
- вердикт: undefined

### Rustic Country Cottage

- файл: `residential_rustic-country-cottage_mc-mod_x.schematic` · категория: **residential** · теги: house|small · 25x16x23 · 1565 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_rustic-country-cottage_mc-mod_x.png`
- вердикт: undefined

### Rustic 3-Story Mansion

- файл: `residential_rustic-3-story-mansion_mc-mod_x.schematic` · категория: **residential** · теги: house|large|tall · 39x57x55 · 18229 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_rustic-3-story-mansion_mc-mod_x.png`
- вердикт: undefined

### Small Brick Townhouse With Jack-o-Lanterns

- файл: `residential_small-brick-townhouse-with-jack-o-lanterns_mc-mod_1.19.2.schem` · категория: **residential** · теги: house|shop|small · 13x24x22 · 2796 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_small-brick-townhouse-with-jack-o-lanterns_mc-mod_1.19.2.png`
- вердикт: undefined

### Spruce Log Cabin House

- файл: `residential_spruce-log-cabin-house_mc-mod_x.schematic` · категория: **residential** · теги: house|medium|tree · 42x37x35 · 9829 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_spruce-log-cabin-house_mc-mod_x.png`
- вердикт: undefined

### Asian Style House with Furnished Interior

- файл: `residential_asian-style-house-with-furnished-interior_mc-mod_x.schematic` · категория: **residential** · теги: house|medium · 30x29x25 · 4487 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_asian-style-house-with-furnished-interior_mc-mod_x.png`
- вердикт: undefined

### Modern Blue Villa

- файл: `residential_modern-blue-villa_mc-mod_x.schematic` · категория: **residential** · теги: house|medium|modern · 58x30x56 · 12587 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_modern-blue-villa_mc-mod_x.png`
- вердикт: undefined

### Cozy Woodcutter’s Cottage

- файл: `residential_cozy-woodcutter-s-cottage_mc-mod_x.schematic` · категория: **residential** · теги: house|small · 21x13x16 · 747 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_cozy-woodcutter-s-cottage_mc-mod_x.png`
- вердикт: undefined

### Modern Two-Story House Over Pond

- файл: `residential_modern-two-story-house-over-pond_mc-mod_x.schematic` · категория: **residential** · теги: house|medium|modern|pool|water · 62x23x63 · 45103 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_modern-two-story-house-over-pond_mc-mod_x.png`
- вердикт: undefined

### Modern Mansion with Fire Safety Upgrades

- файл: `residential_modern-mansion-with-fire-safety-upgrades_mc-mod_x.schematic` · категория: **residential** · теги: house|medium|modern · 63x32x48 · 17046 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_modern-mansion-with-fire-safety-upgrades_mc-mod_x.png`
- вердикт: undefined

### Simple Birch Cottage

- файл: `residential_simple-birch-cottage_mc-mod_1.16.1.schem` · категория: **residential** · теги: house|tiny|tree · 14x6x14 · 676 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_simple-birch-cottage_mc-mod_1.16.1.png`
- вердикт: undefined

### Modern Lakeside Townhouse

- файл: `residential_modern-lakeside-townhouse_buildschematics_x.schematic` · категория: **residential** · теги: house|medium|modern · 42x21x45 · 9066 блоков · источник: buildschematics
- превью: `schemes/thumbs/residential_modern-lakeside-townhouse_buildschematics_x.png`
- вердикт: undefined

### Townhouse 7

- файл: `residential_townhouse-7_mcbuild_x.schem` · категория: **residential** · теги: house|small · 14x19x17 · 1600 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_townhouse-7_mcbuild_x.png`
- вердикт: undefined

### Highway Exit Structure

- файл: `roads_highway-exit-structure_mc-mod_x.schem` · категория: **roads** · теги: medium|road · 50x10x33 · 3225 блоков · источник: mc-mod
- превью: `schemes/thumbs/roads_highway-exit-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Highway Section with Lighting and Signs

- файл: `roads_highway-section-with-lighting-and-signs_mc-mod_x.schem` · категория: **roads** · теги: road|small · 43x10x21 · 1197 блоков · источник: mc-mod
- превью: `schemes/thumbs/roads_highway-section-with-lighting-and-signs_mc-mod_x.png`
- вердикт: undefined

### Highway Toll Booth Structure

- файл: `roads_highway-toll-booth-structure_mc-mod_x.schem` · категория: **roads** · теги: medium|road · 48x9x59 · 4076 блоков · источник: mc-mod
- превью: `schemes/thumbs/roads_highway-toll-booth-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Immersive Railroading Bridge

- файл: `roads_immersive-railroading-bridge_mc-mod_x.schem` · категория: **roads** · теги: bridge|road|small · 11x8x40 · 611 блоков · источник: mc-mod
- превью: `schemes/thumbs/roads_immersive-railroading-bridge_mc-mod_x.png`
- вердикт: undefined

### Immersive Railroading Roundhouse Structure

- файл: `roads_immersive-railroading-roundhouse-structure_mc-mod_x.schem` · категория: **roads** · теги: house|large|road · 110x15x111 · 12086 блоков · источник: mc-mod
- превью: `schemes/thumbs/roads_immersive-railroading-roundhouse-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Immersive Railroading Steamworks Station

- файл: `roads_immersive-railroading-steamworks-station_mc-mod_x.schem` · категория: **roads** · теги: medium|road|station · 66x18x41 · 5136 блоков · источник: mc-mod
- превью: `schemes/thumbs/roads_immersive-railroading-steamworks-station_mc-mod_x.png`
- вердикт: undefined

### Modern Four Story Shopping Mall With Roads

- файл: `roads_modern-four-story-shopping-mall-with-roads_mc-mod_x.schem` · категория: **roads** · теги: medium|modern|road|shop · 28x28x36 · 2661 блоков · источник: mc-mod
- превью: `schemes/thumbs/roads_modern-four-story-shopping-mall-with-roads_mc-mod_x.png`
- вердикт: undefined

### Six Lane Highway

- файл: `roads_six-lane-highway_mc-mod_x.schem` · категория: **roads** · теги: road|small · 27x3x30 · 1680 блоков · источник: mc-mod
- превью: `schemes/thumbs/roads_six-lane-highway_mc-mod_x.png`
- вердикт: undefined

### Standard Railroad Station

- файл: `roads_standard-railroad-station_mc-mod_x.schem` · категория: **roads** · теги: road|station|tiny · 11x8x11 · 401 блоков · источник: mc-mod
- превью: `schemes/thumbs/roads_standard-railroad-station_mc-mod_x.png`
- вердикт: undefined

### Towny Road System &#8211; Cobblestone Construction

- файл: `roads_towny-road-system-cobblestone-construction_mc-mod_x.schem` · категория: **roads** · теги: medium|road · 80x12x80 · 7006 блоков · источник: mc-mod
- превью: `schemes/thumbs/roads_towny-road-system-cobblestone-construction_mc-mod_x.png`
- вердикт: undefined

### Vienna Street House 65 Build

- файл: `roads_vienna-street-house-65-build_mc-mod_x.schem` · категория: **roads** · теги: house|medium|road|tall|tree · 22x42x22 · 4908 блоков · источник: mc-mod
- превью: `schemes/thumbs/roads_vienna-street-house-65-build_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Vienna Street House 66

- файл: `roads_vienna-street-house-66_mc-mod_x.schem` · категория: **roads** · теги: house|medium|road|tall|tree · 27x41x20 · 5867 блоков · источник: mc-mod
- превью: `schemes/thumbs/roads_vienna-street-house-66_mc-mod_x.png`
- вердикт: undefined

### Vienna Street House 68

- файл: `roads_vienna-street-house-68_mc-mod_x.schem` · категория: **roads** · теги: house|medium|road|tall|tree · 24x41x17 · 5140 блоков · источник: mc-mod
- превью: `schemes/thumbs/roads_vienna-street-house-68_mc-mod_x.png`
- вердикт: undefined

### Vienna Street House 70 Build

- файл: `roads_vienna-street-house-70-build_mc-mod_x.schem` · категория: **roads** · теги: house|medium|road|tall|tree · 27x42x19 · 6991 блоков · источник: mc-mod
- превью: `schemes/thumbs/roads_vienna-street-house-70-build_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Vienna Street House 71

- файл: `roads_vienna-street-house-71_mc-mod_x.schem` · категория: **roads** · теги: house|medium|road|tall|tree · 14x49x54 · 8406 блоков · источник: mc-mod
- превью: `schemes/thumbs/roads_vienna-street-house-71_mc-mod_x.png`
- вердикт: undefined

### Vienna Street House 73

- файл: `roads_vienna-street-house-73_mc-mod_x.schem` · категория: **roads** · теги: house|medium|road|tall|tree · 34x41x18 · 8301 блоков · источник: mc-mod
- превью: `schemes/thumbs/roads_vienna-street-house-73_mc-mod_x.png`
- вердикт: undefined

### Vienna Street House 74

- файл: `roads_vienna-street-house-74_mc-mod_x.schem` · категория: **roads** · теги: house|medium|road|tall|tree · 36x42x20 · 8908 блоков · источник: mc-mod
- превью: `schemes/thumbs/roads_vienna-street-house-74_mc-mod_x.png`
- вердикт: undefined

### Vienna Street House With Jungle Planks

- файл: `roads_vienna-street-houses-2_mc-mod_x.schem` · категория: **roads** · теги: house|medium|road|tree · 29x40x19 · 6086 блоков · источник: mc-mod
- превью: `schemes/thumbs/roads_vienna-street-houses-2_mc-mod_x.png`
- вердикт: undefined

### Off-Road 6×6 Tanker Truck

- файл: `roads_off-road-6x6-tanker-truck_mc-mod_x.schematic` · категория: **roads** · теги: car|road|tiny · 12x6x5 · 78 блоков · источник: mc-mod
- превью: `schemes/thumbs/roads_off-road-6x6-tanker-truck_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### Street Cleaning Tanker Truck

- файл: `roads_street-cleaning-tanker-truck_mc-mod_x.schematic` · категория: **roads** · теги: car|road|tiny|tree · 14x6x5 · 91 блоков · источник: mc-mod
- превью: `schemes/thumbs/roads_street-cleaning-tanker-truck_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### Street Lantern

- файл: `roads_street-lantern_mc-mod_x.schematic` · категория: **roads** · теги: road|tiny|tree · 1x3x1 · 3 блоков · источник: mc-mod
- превью: `schemes/thumbs/roads_street-lantern_mc-mod_x.png`
- вердикт: undefined · флаги: almost-empty

### Ride Road Build

- файл: `roads_ride-road-build_buildschematics_x.schematic` · категория: **roads** · теги: large|road|tall · 186x82x10 · 13336 блоков · источник: buildschematics
- превью: `schemes/thumbs/roads_ride-road-build_buildschematics_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### High-Speed Quartz Road

- файл: `roads_high-speed-quartz-road_buildschematics_x.schematic` · категория: **roads** · теги: road|tiny · 6x2x2 · 1 блоков · источник: buildschematics
- превью: `schemes/thumbs/roads_high-speed-quartz-road_buildschematics_x.png`
- вердикт: undefined · флаги: almost-empty

### Fast Road Car Structure

- файл: `roads_fast-road-car-structure_buildschematics_x.nbt` · категория: **roads** · теги: car|road|tiny · 8x3x5 · 6 блоков · источник: buildschematics
- превью: `schemes/thumbs/roads_fast-road-car-structure_buildschematics_x.png`
- вердикт: undefined · флаги: almost-empty, meta-word-in-name, non-building-in-name

### Road B (Normal two-way street)

- файл: `roads_road-b-normal-two-way-street_mcbuild_x.schem` · категория: **roads** · теги: road|tiny|tree · 10x8x15 · 210 блоков · источник: mcbuild
- превью: `schemes/thumbs/roads_road-b-normal-two-way-street_mcbuild_x.png`
- вердикт: undefined

### Cobble Towny Road System

- файл: `roads_cobble-towny-road-system_mcbuild_x.schem` · категория: **roads** · теги: medium|road · 80x12x80 · 7006 блоков · источник: mcbuild
- превью: `schemes/thumbs/roads_cobble-towny-road-system_mcbuild_x.png`
- вердикт: undefined

### Decorative Street Lamp.

- файл: `roads_decorative-street-lamp_mcbuild_x.schem` · категория: **roads** · теги: road|small|tree · 17x7x34 · 266 блоков · источник: mcbuild
- превью: `schemes/thumbs/roads_decorative-street-lamp_mcbuild_x.png`
- вердикт: undefined

### Terraced Shop with Sidewalk

- файл: `roads_terraced-shop-with-sidewalk_buildschematics_x.schematic` · категория: **roads** · теги: car|medium|shop · 29x23x33 · 4054 блоков · источник: buildschematics
- превью: `schemes/thumbs/roads_terraced-shop-with-sidewalk_buildschematics_x.png`
- вердикт: undefined

### Compact 3x3 Tunnel Drill

- файл: `roads_compact-3x3-tunnel-drill_buildschematics_x.nbt` · категория: **roads** · теги: tiny · 4x4x8 · 8 блоков · источник: buildschematics
- превью: `schemes/thumbs/roads_compact-3x3-tunnel-drill_buildschematics_x.png`
- вердикт: undefined · флаги: almost-empty

### Railway Tunnel

- файл: `roads_railway-tunnel_mcbuild_x.schem` · категория: **roads** · теги: tiny · 15x7x11 · 651 блоков · источник: mcbuild
- превью: `schemes/thumbs/roads_railway-tunnel_mcbuild_x.png`
- вердикт: undefined

### Tunnel lighting

- файл: `roads_tunnel-lighting_mcbuild_x.schem` · категория: **roads** · теги: small · 15x7x36 · 761 блоков · источник: mcbuild
- превью: `schemes/thumbs/roads_tunnel-lighting_mcbuild_x.png`
- вердикт: undefined

### Highway Part 1

- файл: `roads_highway-part-1_mcbuild_x.schem` · категория: **roads** · теги: road|small · 43x10x21 · 1191 блоков · источник: mcbuild
- превью: `schemes/thumbs/roads_highway-part-1_mcbuild_x.png`
- вердикт: undefined

### Highway Part 2

- файл: `roads_highway-part-2_mcbuild_x.schem` · категория: **roads** · теги: medium|road · 50x10x33 · 3214 блоков · источник: mcbuild
- превью: `schemes/thumbs/roads_highway-part-2_mcbuild_x.png`
- вердикт: undefined

### Highway Part 3

- файл: `roads_highway-part-3_mcbuild_x.schem` · категория: **roads** · теги: medium|road · 48x9x59 · 4036 блоков · источник: mcbuild
- превью: `schemes/thumbs/roads_highway-part-3_mcbuild_x.png`
- вердикт: undefined

### highway

- файл: `roads_highway_mcbuild_x.schem` · категория: **roads** · теги: road|small · 27x3x30 · 1680 блоков · источник: mcbuild
- превью: `schemes/thumbs/roads_highway_mcbuild_x.png`
- вердикт: undefined

### Compact Two-Story Office Building

- файл: `towers_compact-two-story-office-building_mc-mod_x.schem` · категория: **towers** · теги: medium|office · 57x27x63 · 27435 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_compact-two-story-office-building_mc-mod_x.png`
- вердикт: undefined

### Large Corporate Office Building

- файл: `towers_corporate-office-building-2_mc-mod_x.schem` · категория: **towers** · теги: large|office|tall · 86x61x85 · 175017 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_corporate-office-building-2_mc-mod_x.png`
- вердикт: undefined

### Corporate Office Building

- файл: `towers_corporate-office-building_mc-mod_x.schem` · категория: **towers** · теги: large|office|tall · 51x67x40 · 34060 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_corporate-office-building_mc-mod_x.png`
- вердикт: undefined

### Cozy Small Hotel Building

- файл: `towers_cozy-small-hotel-building_mc-mod_x.schem` · категория: **towers** · теги: hotel|medium|shop|tall · 25x61x27 · 17669 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_cozy-small-hotel-building_mc-mod_x.png`
- вердикт: undefined

### Cyan Tower Build

- файл: `towers_cyan-tower-build_mc-mod_x.schem` · категория: **towers** · теги: small|tall|tower · 13x60x13 · 2068 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_cyan-tower-build_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Dark Luminous Night Tower

- файл: `towers_dark-luminous-night-tower_mc-mod_x.schem` · категория: **towers** · теги: huge|tall|tower · 108x165x46 · 43637 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_dark-luminous-night-tower_mc-mod_x.png`
- вердикт: undefined

### Desert Sand Tower

- файл: `towers_desert-sand-tower_mc-mod_x.schem` · категория: **towers** · теги: tiny|tower · 9x23x9 · 415 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_desert-sand-tower_mc-mod_x.png`
- вердикт: undefined

### Eight Story Hotel

- файл: `towers_eight-story-hotel_mc-mod_x.schem` · категория: **towers** · теги: hotel|medium|tall · 21x49x22 · 9201 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_eight-story-hotel_mc-mod_x.png`
- вердикт: undefined

### Elegant Grand Hotel

- файл: `towers_elegant-grand-hotel_mc-mod_x.schem` · категория: **towers** · теги: hotel|huge|tall · 106x67x134 · 52862 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_elegant-grand-hotel_mc-mod_x.png`
- вердикт: undefined

### Elegant Modern Office Tower

- файл: `towers_elegant-modern-office-tower_mc-mod_x.schem` · категория: **towers** · теги: huge|modern|office|tall|tower · 55x123x83 · 22282 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_elegant-modern-office-tower_mc-mod_x.png`
- вердикт: undefined

### Emerald Skyscraper Tower

- файл: `towers_emerald-skyscraper-tower_mc-mod_x.schem` · категория: **towers** · теги: small|tower · 11x29x7 · 272 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_emerald-skyscraper-tower_mc-mod_x.png`
- вердикт: undefined

### Fallout 3 Power Transmission Tower

- файл: `towers_fallout-3-power-transmission-tower_mc-mod_x.schem` · категория: **towers** · теги: small|tall|tower · 7x44x21 · 862 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_fallout-3-power-transmission-tower_mc-mod_x.png`
- вердикт: undefined · флаги: franchise

### Fallout 3 Water Tower Structure

- файл: `towers_fallout-3-water-tower-structure_mc-mod_x.schem` · категория: **towers** · теги: small|tower · 12x27x12 · 400 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_fallout-3-water-tower-structure_mc-mod_x.png`
- вердикт: undefined · флаги: franchise, meta-word-in-name

### Grand Hotel Seventh Heaven

- файл: `towers_grand-hotel-seventh-heaven_mc-mod_x.schem` · категория: **towers** · теги: hotel|medium|tall · 48x61x35 · 97943 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_grand-hotel-seventh-heaven_mc-mod_x.png`
- вердикт: undefined

### Grandpa&#8217;s Flower Power Tower with Garden

- файл: `towers_grandpas-flower-power-tower-with-garden_mc-mod_x.schem` · категория: **towers** · теги: medium|park|tower · 32x27x23 · 3702 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_grandpas-flower-power-tower-with-garden_mc-mod_x.png`
- вердикт: undefined

### Gray Tower Structure

- файл: `towers_gray-tower-structure_mc-mod_x.schem` · категория: **towers** · теги: small|tower · 9x28x9 · 464 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_gray-tower-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Small Hilton Hotel Build

- файл: `towers_hotel-hilton_mc-mod_x.schem` · категория: **towers** · теги: hotel|medium|shop · 17x31x31 · 6431 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_hotel-hilton_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Hotel Honk House

- файл: `towers_hotel-honk-house_mc-mod_x.schem` · категория: **towers** · теги: hotel|house|medium · 41x37x38 · 23840 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_hotel-honk-house_mc-mod_x.png`
- вердикт: undefined

### Hotel Opal Seaside Resort

- файл: `towers_hotel-opal-seaside-resort_mc-mod_x.schem` · категория: **towers** · теги: hotel|large|tall · 66x66x84 · 53407 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_hotel-opal-seaside-resort_mc-mod_x.png`
- вердикт: undefined

### Hotel Weiss V2

- файл: `towers_hotel-weiss-v2_mc-mod_x.schem` · категория: **towers** · теги: hotel|large|tall · 50x52x50 · 30321 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_hotel-weiss-v2_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Indian Style Jade Mansion Tower

- файл: `towers_indian-style-jade-mansion-tower_mc-mod_x.schem` · категория: **towers** · теги: house|large|tall|tower · 61x65x62 · 23887 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_indian-style-jade-mansion-tower_mc-mod_x.png`
- вердикт: undefined

### Japanese Tower Style Asian Structure

- файл: `towers_japanese-tower-style-asian-structure_mc-mod_x.schem` · категория: **towers** · теги: small|tower · 13x30x13 · 991 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_japanese-tower-style-asian-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Jive 49 Modern Condominium Tower

- файл: `towers_jive-49-modern-condominium-tower_mc-mod_x.schem` · категория: **towers** · теги: apartment|large|modern|tall|tower · 37x100x81 · 46141 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_jive-49-modern-condominium-tower_mc-mod_x.png`
- вердикт: undefined

### Kokotoni&#8217;s Furnished Tower

- файл: `towers_kokotonis-furnished-tower_mc-mod_x.schem` · категория: **towers** · теги: medium|tall|tower · 31x82x31 · 14037 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_kokotonis-furnished-tower_mc-mod_x.png`
- вердикт: undefined

### Large Stone Tower

- файл: `towers_large-stone-tower_mc-mod_x.schem` · категория: **towers** · теги: small|tall|tower · 12x52x11 · 1507 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_large-stone-tower_mc-mod_x.png`
- вердикт: undefined

### Lava Hotel Resort

- файл: `towers_lava-hotel-resort_mc-mod_x.schem` · категория: **towers** · теги: hotel|medium · 27x37x33 · 10512 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_lava-hotel-resort_mc-mod_x.png`
- вердикт: undefined

### Leniland Office Building

- файл: `towers_leniland-office-building_mc-mod_x.schem` · категория: **towers** · теги: medium|office|tall · 32x41x17 · 8081 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_leniland-office-building_mc-mod_x.png`
- вердикт: undefined

### Lucava&#8217;s Tower

- файл: `towers_lucavas-tower_mc-mod_x.schem` · категория: **towers** · теги: large|tall|tower · 43x118x42 · 3842 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_lucavas-tower_mc-mod_x.png`
- вердикт: undefined

### Luxury Palace Tower With Elevator

- файл: `towers_luxury-palace-tower-with-elevator_mc-mod_x.schem` · категория: **towers** · теги: large|tall|tower · 40x110x40 · 52275 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_luxury-palace-tower-with-elevator_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### Modern City Hotel Building

- файл: `towers_modern-city-hotel-building_mc-mod_x.schem` · категория: **towers** · теги: hotel|large|modern|tall · 49x112x41 · 50688 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_modern-city-hotel-building_mc-mod_x.png`
- вердикт: undefined

### Modern City Skyscraper

- файл: `towers_modern-city-skyscraper_mc-mod_x.schem` · категория: **towers** · теги: large|modern|tall|tower · 73x49x42 · 11204 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_modern-city-skyscraper_mc-mod_x.png`
- вердикт: undefined

### Modern Decorated Tower

- файл: `towers_modern-decorated-tower_mc-mod_x.schem` · категория: **towers** · теги: modern|small|tall|tower · 15x46x11 · 2239 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_modern-decorated-tower_mc-mod_x.png`
- вердикт: undefined

### Modern Diamond Skyscraper

- файл: `towers_modern-diamond-skyscraper_mc-mod_x.schem` · категория: **towers** · теги: large|modern|tall|tower · 51x145x49 · 75860 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_modern-diamond-skyscraper_mc-mod_x.png`
- вердикт: undefined

### Modern Eco Skyscraper

- файл: `towers_modern-eco-skyscraper_mc-mod_x.schem` · категория: **towers** · теги: huge|modern|tall|tower · 59x174x59 · 105395 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_modern-eco-skyscraper_mc-mod_x.png`
- вердикт: undefined

### Modern Four-Story Hotel

- файл: `towers_modern-four-story-hotel_mc-mod_x.schem` · категория: **towers** · теги: hotel|large|modern|tall · 80x46x106 · 100386 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_modern-four-story-hotel_mc-mod_x.png`
- вердикт: undefined

### Modern Glass Office Tower Building

- файл: `towers_modern-glass-office-tower-building_mc-mod_x.schem` · категория: **towers** · теги: large|modern|office|tall|tower · 44x121x44 · 35389 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_modern-glass-office-tower-building_mc-mod_x.png`
- вердикт: undefined

### Modern Hotel Building

- файл: `towers_modern-hotel-building_mc-mod_x.schem` · категория: **towers** · теги: hotel|medium|modern|tall · 49x49x49 · 26530 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_modern-hotel-building_mc-mod_x.png`
- вердикт: undefined

### Modern Office Building Sketch

- файл: `towers_modern-office-building-sketch_mc-mod_x.schem` · категория: **towers** · теги: medium|modern|office · 31x34x36 · 6368 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_modern-office-building-sketch_mc-mod_x.png`
- вердикт: undefined

### Modern Office Tower Building

- файл: `towers_modern-office-tower-building_mc-mod_x.schem` · категория: **towers** · теги: medium|modern|office|tall|tower · 18x91x20 · 13404 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_modern-office-tower-building_mc-mod_x.png`
- вердикт: undefined

### Modern Office Tower with Elevator

- файл: `towers_modern-office-tower-with-elevator_mc-mod_x.schem` · категория: **towers** · теги: modern|office|small|tall|tower · 18x41x17 · 6014 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_modern-office-tower-with-elevator_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### Modern Office Tower

- файл: `towers_modern-office-tower_mc-mod_x.schem` · категория: **towers** · теги: medium|modern|office|tall|tower · 36x54x23 · 16314 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_modern-office-tower_mc-mod_x.png`
- вердикт: undefined

### Modern Quartz City Tower

- файл: `towers_modern-quartz-city-tower_mc-mod_x.schem` · категория: **towers** · теги: medium|modern|tall|tower · 34x47x33 · 9780 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_modern-quartz-city-tower_mc-mod_x.png`
- вердикт: undefined

### Modern Quartz Skyscraper Tower

- файл: `towers_modern-quartz-skyscraper-tower_mc-mod_x.schem` · категория: **towers** · теги: medium|modern|tall|tower · 29x65x29 · 13475 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_modern-quartz-skyscraper-tower_mc-mod_x.png`
- вердикт: undefined

### Modern Skyscraper Build

- файл: `towers_modern-skyscraper-build_mc-mod_x.schem` · категория: **towers** · теги: medium|modern|tall|tower · 27x105x40 · 39496 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_modern-skyscraper-build_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Modern Skyscraper Design

- файл: `towers_modern-skyscraper-design_mc-mod_x.schem` · категория: **towers** · теги: large|modern|tall|tower · 60x66x39 · 22754 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_modern-skyscraper-design_mc-mod_x.png`
- вердикт: undefined

### Modern Skyscraper Tower

- файл: `towers_modern-skyscraper-tower-11_mc-mod_x.schem` · категория: **towers** · теги: medium|modern|tall|tower · 20x199x20 · 14039 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_modern-skyscraper-tower-11_mc-mod_x.png`
- вердикт: undefined · флаги: duplicate-name

### Modern Skyscraper Tower

- файл: `towers_modern-skyscraper-tower_mc-mod_x.schem` · категория: **towers** · теги: large|modern|tall|tower · 62x172x44 · 82874 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_modern-skyscraper-tower_mc-mod_x.png`
- вердикт: undefined · флаги: duplicate-name

### Modern Skyscraper

- файл: `towers_modern-skyscraper_mc-mod_x.schem` · категория: **towers** · теги: large|modern|tall|tower · 40x152x70 · 61845 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_modern-skyscraper_mc-mod_x.png`
- вердикт: undefined

### Modern Spiral Skyscraper

- файл: `towers_modern-spiral-skyscraper_mc-mod_x.schem` · категория: **towers** · теги: huge|modern|tall|tower · 54x185x54 · 141511 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_modern-spiral-skyscraper_mc-mod_x.png`
- вердикт: undefined

### Modern Style Tower Structure

- файл: `towers_modern-style-tower-structure_mc-mod_x.schem` · категория: **towers** · теги: medium|modern|tall|tower · 38x84x22 · 16924 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_modern-style-tower-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Modern Torch Towers

- файл: `towers_modern-torch-towers_mc-mod_x.schem` · категория: **towers** · теги: modern|small|tower · 15x20x16 · 646 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_modern-torch-towers_mc-mod_x.png`
- вердикт: undefined

### Mud Tower Build

- файл: `towers_mud-tower-build_mc-mod_x.schem` · категория: **towers** · теги: small|tower · 10x28x10 · 556 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_mud-tower-build_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Murchinson Modern Office Building With Helipad

- файл: `towers_murchinson-modern-office-building-with-helip_mc-mod_x.schem` · категория: **towers** · теги: large|modern|office|tall · 45x160x67 · 199550 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_murchinson-modern-office-building-with-helip_mc-mod_x.png`
- вердикт: undefined

### Octagonal Hotel Interior Design

- файл: `towers_octagonal-hotel-interior-design_mc-mod_x.schem` · категория: **towers** · теги: hotel|medium|tall · 47x55x46 · 7833 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_octagonal-hotel-interior-design_mc-mod_x.png`
- вердикт: undefined

### OlimpusHD Tower &#8211; Large Build

- файл: `towers_olimpushd-tower-large-build_mc-mod_x.schem` · категория: **towers** · теги: large|tall|tower · 68x60x57 · 27056 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_olimpushd-tower-large-build_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Olympus Tower &#8211; Large Build

- файл: `towers_olympus-tower-large-build_mc-mod_x.schem` · категория: **towers** · теги: large|tall|tower · 43x75x45 · 8374 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_olympus-tower-large-build_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### One World Trade Centre Skyscraper

- файл: `towers_one-world-trade-centre-skyscraper_mc-mod_x.schem` · категория: **towers** · теги: medium|tall|tower · 30x115x33 · 20615 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_one-world-trade-centre-skyscraper_mc-mod_x.png`
- вердикт: undefined

### Orange Tower &#8211; Large Scale Block Structure

- файл: `towers_orange-tower-large-scale-block-structure_mc-mod_x.schem` · категория: **towers** · теги: small|tower · 11x23x11 · 995 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_orange-tower-large-scale-block-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Platinum Residential Tower with Antenna

- файл: `towers_platinum-residential-tower-with-antenna_mc-mod_x.schem` · категория: **towers** · теги: huge|tall|tower · 48x324x47 · 128026 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_platinum-residential-tower-with-antenna_mc-mod_x.png`
- вердикт: undefined

### Prismarine Island Tower

- файл: `towers_prismarine-island-tower_mc-mod_x.schem` · категория: **towers** · теги: small|tower · 17x31x17 · 1966 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_prismarine-island-tower_mc-mod_x.png`
- вердикт: undefined

### QuickDeli Cargo Services Warehouse and Office

- файл: `towers_quickdeli-cargo-services-warehouse-and-offic_mc-mod_x.schem` · категория: **towers** · теги: car|house|huge|office · 161x21x177 · 57634 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_quickdeli-cargo-services-warehouse-and-offic_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### Red Bureaucratic Office Building

- файл: `towers_red-bureaucratic-office-building_mc-mod_x.schem` · категория: **towers** · теги: medium|office|tall · 40x65x25 · 21639 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_red-bureaucratic-office-building_mc-mod_x.png`
- вердикт: undefined

### Rustic Wood Tower Build

- файл: `towers_rustic-wood-tower-build_mc-mod_x.schem` · категория: **towers** · теги: small|tall|tower · 11x50x11 · 1434 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_rustic-wood-tower-build_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Sandstone Hotel

- файл: `towers_sandstone-hotel_mc-mod_x.schem` · категория: **towers** · теги: hotel|large|tall · 50x54x45 · 16158 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_sandstone-hotel_mc-mod_x.png`
- вердикт: undefined

### Sandstone Office Tower &#8211; 126k Blocks

- файл: `towers_sandstone-office-tower-126k-blocks_mc-mod_x.schem` · категория: **towers** · теги: large|office|tall|tower · 56x97x56 · 126155 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_sandstone-office-tower-126k-blocks_mc-mod_x.png`
- вердикт: undefined

### Seaside Lighthouse Tower

- файл: `towers_seaside-lighthouse-tower_mc-mod_x.schem` · категория: **towers** · теги: house|huge|tall|tower|water · 51x176x61 · 76555 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_seaside-lighthouse-tower_mc-mod_x.png`
- вердикт: undefined

### Shard Tower &#8211; Tall Unfurnished Structure

- файл: `towers_shard-tower-tall-unfurnished-structure_mc-mod_x.schem` · категория: **towers** · теги: large|tall|tower · 44x185x44 · 31644 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_shard-tower-tall-unfurnished-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Simple Defense Tower

- файл: `towers_simple-defense-tower_mc-mod_x.schem` · категория: **towers** · теги: tiny|tower · 8x14x9 · 433 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_simple-defense-tower_mc-mod_x.png`
- вердикт: undefined

### Six Story Hotel With Furnished Rooms

- файл: `towers_six-story-hotel-with-furnished-rooms_mc-mod_x.schem` · категория: **towers** · теги: hotel|small · 20x31x17 · 4297 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_six-story-hotel-with-furnished-rooms_mc-mod_x.png`
- вердикт: undefined

### Skyscraper City Building

- файл: `towers_skyscraper-city-building_mc-mod_x.schem` · категория: **towers** · теги: medium|tall|tower · 13x115x13 · 5844 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_skyscraper-city-building_mc-mod_x.png`
- вердикт: undefined

### Iron Quartz Skyscraper Near Build Limit

- файл: `towers_skyscraper_mc-mod_x.schem` · категория: **towers** · теги: medium|tall|tower · 12x240x12 · 19856 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_skyscraper_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Small Office Building

- файл: `towers_small-office-building_mc-mod_x.schem` · категория: **towers** · теги: medium|office|shop|tall · 10x256x17 · 974 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_small-office-building_mc-mod_x.png`
- вердикт: undefined

### Tilted Office Building

- файл: `towers_tilted-office-building_mc-mod_x.schem` · категория: **towers** · теги: huge|office|tall · 180x85x67 · 172199 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_tilted-office-building_mc-mod_x.png`
- вердикт: undefined

### Unfurnished Office Building Structure

- файл: `towers_unfurnished-office-building-structure_mc-mod_x.schem` · категория: **towers** · теги: medium|office|tall · 40x67x43 · 18504 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_unfurnished-office-building-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Water Wall Skyscraper

- файл: `towers_water-wall-skyscraper_mc-mod_x.schem` · категория: **towers** · теги: medium|tall|tower · 36x51x36 · 27001 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_water-wall-skyscraper_mc-mod_x.png`
- вердикт: undefined

### Willis Tower Overhaul Schematic

- файл: `towers_willis-tower-overhaul-schematic_mc-mod_x.schem` · категория: **towers** · теги: large|tall|tower · 51x194x50 · 100695 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_willis-tower-overhaul-schematic_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Willis Tower Skyscraper Build

- файл: `towers_willis-tower-skyscraper-build_mc-mod_x.schem` · категория: **towers** · теги: huge|tall|tower · 62x254x61 · 23439 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_willis-tower-skyscraper-build_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Working Lighthouse Tower

- файл: `towers_working-lighthouse-tower_mc-mod_x.schem` · категория: **towers** · теги: house|medium|tall|tower|water · 22x66x24 · 6520 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_working-lighthouse-tower_mc-mod_x.png`
- вердикт: undefined

### Youcube Office Structure

- файл: `towers_youcube-office-structure_mc-mod_x.schem` · категория: **towers** · теги: medium|office|tall · 21x41x28 · 5748 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_youcube-office-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Zambia&#8217;s Tallest Skyscraper &#8211; Findeco House

- файл: `towers_zambias-tallest-skyscraper-findeco-house_mc-mod_x.schem` · категория: **towers** · теги: house|huge|tall|tower · 80x112x96 · 118581 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_zambias-tallest-skyscraper-findeco-house_mc-mod_x.png`
- вердикт: undefined

### Rustic Water Tower

- файл: `towers_rustic-water-tower_mc-mod_1.16.3.schem` · категория: **towers** · теги: small|tower · 11x22x13 · 669 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_rustic-water-tower_mc-mod_1.16.3.png`
- вердикт: undefined

### Solarpunk Quartz Tower

- файл: `towers_solarpunk-quartz-tower_mc-mod_1.20.1.schem` · категория: **towers** · теги: large|tall|tower · 35x232x35 · 13562 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_solarpunk-quartz-tower_mc-mod_1.20.1.png`
- вердикт: undefined

### Quartz Gold Modern Office Tower

- файл: `towers_quartz-gold-modern-office-tower_mc-mod_x.schematic` · категория: **towers** · теги: medium|modern|office|tall|tower · 17x98x33 · 22594 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_quartz-gold-modern-office-tower_mc-mod_x.png`
- вердикт: undefined

### Abandonedcraft Fortress Tower

- файл: `towers_abandonedcraft-fortress-tower_mc-mod_x.schematic` · категория: **towers** · теги: castle-like|large|tall|tower · 28x125x49 · 30854 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_abandonedcraft-fortress-tower_mc-mod_x.png`
- вердикт: undefined · флаги: non-real/fantasy

### Big Bend Skyscraper 600m Tall

- файл: `towers_big-bend-skyscraper-600m-tall_mc-mod_x.schematic` · категория: **towers** · теги: huge|tall|tower · 170x184x32 · 184334 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_big-bend-skyscraper-600m-tall_mc-mod_x.png`
- вердикт: undefined

### Desert Tower with Enchanting Room

- файл: `towers_desert-tower-with-enchanting-room_mc-mod_x.schematic` · категория: **towers** · теги: medium|tall|tower · 33x56x26 · 4432 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_desert-tower-with-enchanting-room_mc-mod_x.png`
- вердикт: undefined

### Block Showcase Tower with Mini Biomes

- файл: `towers_block-showcase-tower-with-mini-biomes_mc-mod_x.schematic` · категория: **towers** · теги: large|tower · 97x23x98 · 50275 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_block-showcase-tower-with-mini-biomes_mc-mod_x.png`
- вердикт: undefined

### Steampunk Skyscraper Model

- файл: `towers_steampunk-skyscraper-model_mc-mod_1.19.3.schem` · категория: **towers** · теги: huge|tall|tower · 53x251x56 · 28420 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_steampunk-skyscraper-model_mc-mod_1.19.3.png`
- вердикт: undefined · флаги: non-real/fantasy

### Crusader Style Small Tower

- файл: `towers_crusader-style-small-tower_mc-mod_x.schematic` · категория: **towers** · теги: shop|small|tower · 11x22x11 · 853 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_crusader-style-small-tower_mc-mod_x.png`
- вердикт: undefined

### Steampunk Skyscraper Model 4

- файл: `towers_steampunk-skyscraper-model-4_mc-mod_1.19.3.schem` · категория: **towers** · теги: huge|tall|tower · 44x251x50 · 35644 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_steampunk-skyscraper-model-4_mc-mod_1.19.3.png`
- вердикт: undefined · флаги: non-real/fantasy

### Stone Tower with Automatic Lighting

- файл: `towers_stone-tower-with-automatic-lighting_mc-mod_x.schematic` · категория: **towers** · теги: tiny|tower · 7x16x7 · 332 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_stone-tower-with-automatic-lighting_mc-mod_x.png`
- вердикт: undefined

### Steampunk Skyscraper Model 5 Tower

- файл: `towers_steampunk-skyscraper-model-5-tower_mc-mod_1.19.3.schem` · категория: **towers** · теги: huge|tall|tower · 48x273x47 · 51498 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_steampunk-skyscraper-model-5-tower_mc-mod_1.19.3.png`
- вердикт: undefined · флаги: non-real/fantasy

### Eiffel Tower

- файл: `towers_eiffel-tower_mc-mod_x.schematic` · категория: **towers** · теги: huge|tall|tower · 65x193x65 · 23853 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_eiffel-tower_mc-mod_x.png`
- вердикт: undefined

### Tower Trivia Game Show

- файл: `towers_tower-trivia-game-show_mc-mod_x.schematic` · категория: **towers** · теги: medium|tower · 26x30x37 · 4816 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_tower-trivia-game-show_mc-mod_x.png`
- вердикт: undefined

### Enchanted End Stone Brick Tower

- файл: `towers_enchanted-end-stone-brick-tower_mc-mod_x.schematic` · категория: **towers** · теги: medium|tall|tower · 17x67x17 · 632 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_enchanted-end-stone-brick-tower_mc-mod_x.png`
- вердикт: undefined · флаги: non-real/fantasy

### Max’s Tower Outpost

- файл: `towers_maxs-tower-outpost_mc-mod_x.schematic` · категория: **towers** · теги: small|tower · 13x16x13 · 622 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_maxs-tower-outpost_mc-mod_x.png`
- вердикт: undefined

### Big Ben Clock Tower Replica – Oak & Birch Build

- файл: `towers_big-ben-clock-tower-replica-oak-birch-build_mc-mod_x.schematic` · категория: **towers** · теги: medium|tall|tower|tree · 21x100x24 · 4676 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_big-ben-clock-tower-replica-oak-birch-build_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Barn with Water Tower

- файл: `towers_barn-with-water-tower_mcbuild_x.schem` · категория: **towers** · теги: small|tower · 17x16x24 · 1302 блоков · источник: mcbuild
- превью: `schemes/thumbs/towers_barn-with-water-tower_mcbuild_x.png`
- вердикт: undefined

### Modern water tower

- файл: `towers_modern-water-tower_mcbuild_x.schem` · категория: **towers** · теги: medium|modern|tall|tower · 25x52x25 · 3287 блоков · источник: mcbuild
- превью: `schemes/thumbs/towers_modern-water-tower_mcbuild_x.png`
- вердикт: undefined

### Water Tower by iEdgy

- файл: `towers_water-tower-by-iedgy_mcbuild_x.schem` · категория: **towers** · теги: medium|tall|tower · 36x57x36 · 5719 блоков · источник: mcbuild
- превью: `schemes/thumbs/towers_water-tower-by-iedgy_mcbuild_x.png`
- вердикт: undefined

### Office Building

- файл: `towers_office-building_mcbuild_x.schem` · категория: **towers** · теги: large|office|tall · 55x78x46 · 55013 блоков · источник: mcbuild
- превью: `schemes/thumbs/towers_office-building_mcbuild_x.png`
- вердикт: undefined

### ten story office building

- файл: `towers_ten-story-office-building_mcbuild_x.schem` · категория: **towers** · теги: huge|office|tall · 60x117x126 · 92399 блоков · источник: mcbuild
- превью: `schemes/thumbs/towers_ten-story-office-building_mcbuild_x.png`
- вердикт: undefined

### Elevated Metro Station Building

- файл: `transport_elevated-metro-station-building_mc-mod_x.schem` · категория: **transport** · теги: small|station · 21x18x32 · 3993 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_elevated-metro-station-building_mc-mod_x.png`
- вердикт: undefined

### Elevated Metro Station Exterior

- файл: `transport_elevated-metro-station-exterior_mc-mod_x.schem` · категория: **transport** · теги: small|station · 25x17x35 · 4324 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_elevated-metro-station-exterior_mc-mod_x.png`
- вердикт: undefined

### Elevated Metro Station With Side Platform

- файл: `transport_elevated-metro-station-with-side-platform_mc-mod_x.schem` · категория: **transport** · теги: small|station · 25x17x35 · 4810 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_elevated-metro-station-with-side-platform_mc-mod_x.png`
- вердикт: undefined

### Elevated Railway Station

- файл: `transport_elevated-railway-station_mc-mod_x.schem` · категория: **transport** · теги: station|tiny · 9x7x20 · 396 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_elevated-railway-station_mc-mod_x.png`
- вердикт: undefined

### Fallout 3 Inspired Substation

- файл: `transport_fallout-3-inspired-substation_mc-mod_x.schem` · категория: **transport** · теги: small|station · 26x9x19 · 1188 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_fallout-3-inspired-substation_mc-mod_x.png`
- вердикт: undefined · флаги: franchise

### Fallout 3 Style Power Station

- файл: `transport_fallout-3-style-power-station_mc-mod_x.schem` · категория: **transport** · теги: large|station|tall · 79x64x58 · 24145 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_fallout-3-style-power-station_mc-mod_x.png`
- вердикт: undefined · флаги: franchise

### Functional Train Station

- файл: `transport_functional-train-station_mc-mod_x.schem` · категория: **transport** · теги: small|station · 14x11x25 · 2217 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_functional-train-station_mc-mod_x.png`
- вердикт: undefined

### Futuristic City Parking Lot

- файл: `transport_futuristic-city-parking-lot_mc-mod_x.schem` · категория: **transport** · теги: modern|park|parking|tiny · 30x3x15 · 670 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_futuristic-city-parking-lot_mc-mod_x.png`
- вердикт: undefined

### Futuristic Station for Vehicles

- файл: `transport_futuristic-station-for-vehicles_mc-mod_x.schem` · категория: **transport** · теги: medium|modern|station · 24x35x74 · 15264 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_futuristic-station-for-vehicles_mc-mod_x.png`
- вердикт: undefined

### Light Rail Transit Station

- файл: `transport_light-rail-transit-station_mc-mod_x.schem` · категория: **transport** · теги: large|station · 179x35x51 · 42220 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_light-rail-transit-station_mc-mod_x.png`
- вердикт: undefined

### Modern Parking Garage Structure

- файл: `transport_modern-parking-garage-structure_mc-mod_x.schem` · категория: **transport** · теги: modern|park|parking|small · 28x10x33 · 2612 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_modern-parking-garage-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Modern Train Station Design

- файл: `transport_modern-train-station-design_mc-mod_x.schem` · категория: **transport** · теги: medium|modern|station · 32x21x38 · 6136 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_modern-train-station-design_mc-mod_x.png`
- вердикт: undefined

### Multi-Level 6-Story Parking Lot

- файл: `transport_multi-level-6-story-parking-lot_mc-mod_x.schem` · категория: **transport** · теги: large|park|parking|tall · 99x46x91 · 122647 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_multi-level-6-story-parking-lot_mc-mod_x.png`
- вердикт: undefined

### Multi-Level Parking Garage Structure

- файл: `transport_multi-level-parking-garage-structure_mc-mod_x.schem` · категория: **transport** · теги: huge|park|parking|tall · 169x64x93 · 241162 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_multi-level-parking-garage-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Orbital Station

- файл: `transport_orbital-station_mc-mod_x.schem` · категория: **transport** · теги: large|station · 60x31x115 · 11566 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_orbital-station_mc-mod_x.png`
- вердикт: undefined

### Railway Station Building

- файл: `transport_railway-station-building_mc-mod_x.schem` · категория: **transport** · теги: small|station · 25x22x20 · 2087 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_railway-station-building_mc-mod_x.png`
- вердикт: undefined

### Sand Palace Station

- файл: `transport_sand-palace-station_mc-mod_x.schem` · категория: **transport** · теги: large|station|tall · 87x45x115 · 247767 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_sand-palace-station_mc-mod_x.png`
- вердикт: undefined · флаги: duplicate-name

### Simple Train Station

- файл: `transport_simple-train-station_mc-mod_x.schem` · категория: **transport** · теги: station|tiny · 6x11x16 · 432 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_simple-train-station_mc-mod_x.png`
- вердикт: undefined

### Six Story Parking Garage

- файл: `transport_six-story-parking-garage_mc-mod_x.schem` · категория: **transport** · теги: large|park|parking · 59x27x91 · 33082 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_six-story-parking-garage_mc-mod_x.png`
- вердикт: undefined

### Town Parking Lot

- файл: `transport_town-parking-lot_mc-mod_x.schem` · категория: **transport** · теги: park|parking|small · 29x5x29 · 592 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_town-parking-lot_mc-mod_x.png`
- вердикт: undefined

### Trainyard Automatic Refill Station

- файл: `transport_trainyard-automatic-refill-station_mc-mod_x.schem` · категория: **transport** · теги: medium|station · 23x34x40 · 10977 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_trainyard-automatic-refill-station_mc-mod_x.png`
- вердикт: undefined

### Two Story Warehouse With Parking

- файл: `transport_two-story-warehouse-with-parking_mc-mod_x.schem` · категория: **transport** · теги: house|medium|park|parking · 65x18x102 · 25747 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_two-story-warehouse-with-parking_mc-mod_x.png`
- вердикт: undefined

### Underground Metro Station Design

- файл: `transport_underground-metro-station-design_mc-mod_x.schem` · категория: **transport** · теги: small|station · 25x15x32 · 5165 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_underground-metro-station-design_mc-mod_x.png`
- вердикт: undefined

### Underground Metro Station With Blue Train

- файл: `transport_underground-metro-station-with-blue-train_mc-mod_x.schem` · категория: **transport** · теги: medium|station · 31x26x41 · 16483 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_underground-metro-station-with-blue-train_mc-mod_x.png`
- вердикт: undefined

### Vintage Train Station Building

- файл: `transport_vintage-train-station-building_mc-mod_x.schem` · категория: **transport** · теги: small|station · 21x11x18 · 1218 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_vintage-train-station-building_mc-mod_x.png`
- вердикт: undefined

### Western Train Station Structure

- файл: `transport_western-train-station-structure_mc-mod_x.schem` · категория: **transport** · теги: small|station · 26x11x15 · 1086 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_western-train-station-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Acacia & Spruce Small Aircraft Hangar

- файл: `transport_acacia-spruce-small-aircraft-hangar_mc-mod_1.20.1.nbt` · категория: **transport** · теги: medium|shop|tree · 70x11x26 · 2050 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_acacia-spruce-small-aircraft-hangar_mc-mod_1.20.1.png`
- вердикт: undefined

### Small Garden With Wither Platform

- файл: `transport_small-garden-with-wither-platform_mc-mod_x.schematic` · категория: **transport** · теги: medium|park|shop · 30x19x30 · 3131 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_small-garden-with-wither-platform_mc-mod_x.png`
- вердикт: undefined

### Abandoned Town with Subway System

- файл: `transport_abandoned-town-with-subway-system_mc-mod_x.schematic` · категория: **transport** · теги: medium · 64x20x70 · 37138 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_abandoned-town-with-subway-system_mc-mod_x.png`
- вердикт: undefined

### Minecraft Airport Terminal Building

- файл: `transport_minecraft-airport-terminal-building_mc-mod_x.schematic` · категория: **transport** · теги: small|station · 30x14x27 · 2904 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_minecraft-airport-terminal-building_mc-mod_x.png`
- вердикт: undefined · флаги: franchise

### Fallout 3 Red Rocket Gas Station

- файл: `transport_fallout-3-red-rocket-gas-station_mc-mod_x.schematic` · категория: **transport** · теги: small|station · 25x25x17 · 937 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_fallout-3-red-rocket-gas-station_mc-mod_x.png`
- вердикт: undefined · флаги: franchise

### Aircraft Hangar Structure

- файл: `transport_aircraft-hangar-structure_mc-mod_x.schematic` · категория: **transport** · теги: medium · 36x24x40 · 10969 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_aircraft-hangar-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Small Village Train Station

- файл: `transport_small-village-train-station_mc-mod_x.schematic` · категория: **transport** · теги: house|medium|shop|station · 20x27x29 · 8116 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_small-village-train-station_mc-mod_x.png`
- вердикт: undefined

### Subway Station Build

- файл: `transport_subway-station-build_mc-mod_1.19.schem` · категория: **transport** · теги: small|station · 17x11x17 · 969 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_subway-station-build_mc-mod_1.19.png`
- вердикт: undefined · флаги: meta-word-in-name

### Minecraft Airport Terminal Build

- файл: `transport_minecraft-airport-terminal-build_mc-mod_x.schematic` · категория: **transport** · теги: station|tiny · 9x6x22 · 607 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_minecraft-airport-terminal-build_mc-mod_x.png`
- вердикт: undefined · флаги: franchise, meta-word-in-name

### Modern Gas Station With Shop and Tankers

- файл: `transport_modern-gas-station-with-shop-and-tankers_mc-mod_x.schematic` · категория: **transport** · теги: large|modern|shop|station · 76x17x119 · 21284 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_modern-gas-station-with-shop-and-tankers_mc-mod_x.png`
- вердикт: undefined

### Wooden Platform for Ravines and Cliffs

- файл: `transport_wooden-platform-for-ravines-and-cliffs_mc-mod_x.schematic` · категория: **transport** · теги: tiny · 27x10x7 · 241 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_wooden-platform-for-ravines-and-cliffs_mc-mod_x.png`
- вердикт: undefined

### Small Gas Station With Custom Blocks

- файл: `transport_small-gas-station-with-custom-blocks_mc-mod_x.schematic` · категория: **transport** · теги: shop|small|station · 16x6x30 · 612 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_small-gas-station-with-custom-blocks_mc-mod_x.png`
- вердикт: undefined

### Obsidian Runway Build

- файл: `transport_obsidian-runway-build_mc-mod_x.schematic` · категория: **transport** · теги: small · 135x2x13 · 1105 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_obsidian-runway-build_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Long Cargo Platform

- файл: `transport_long-cargo-platform_mc-mod_x.schematic` · категория: **transport** · теги: car|tiny · 3x4x7 · 26 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_long-cargo-platform_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### Modern Fueling Station

- файл: `transport_modern-fueling-station_mc-mod_1.19.2.schem` · категория: **transport** · теги: medium|modern|station · 52x18x38 · 7253 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_modern-fueling-station_mc-mod_1.19.2.png`
- вердикт: undefined

### CastiaMC Lobby Platform Build

- файл: `transport_castiamc-lobby-platform-build_mc-mod_x.schematic` · категория: **transport** · теги: medium|tall · 29x45x32 · 5992 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_castiamc-lobby-platform-build_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name, non-real/fantasy

### 16×16 Plains Train Station

- файл: `transport_16x16-plains-train-station_mc-mod_1.21.1.nbt` · категория: **transport** · теги: small|station · 16x9x16 · 641 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_16x16-plains-train-station_mc-mod_1.21.1.png`
- вердикт: undefined

### Ancient Mayan Depot House

- файл: `transport_ancient-mayan-depot-house_mc-mod_1.20.4.schem` · категория: **transport** · теги: house|small|station · 15x16x16 · 313 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_ancient-mayan-depot-house_mc-mod_1.20.4.png`
- вердикт: undefined · флаги: non-real/fantasy

### Minecart Dropper Station

- файл: `transport_minecart-dropper-station_mc-mod_x.schematic` · категория: **transport** · теги: car|small|station · 26x19x9 · 933 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_minecart-dropper-station_mc-mod_x.png`
- вердикт: undefined

### Modern Wi-Fi Station Tower

- файл: `transport_modern-wi-fi-station-tower_mc-mod_x.schematic` · категория: **transport** · теги: modern|small|station|tower · 17x27x17 · 149 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_modern-wi-fi-station-tower_mc-mod_x.png`
- вердикт: undefined

### Customs Station Building

- файл: `transport_customs-station-building_mc-mod_1.17.1.schem` · категория: **transport** · теги: medium|station · 37x27x21 · 8659 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_customs-station-building_mc-mod_1.17.1.png`
- вердикт: undefined

### Minecraft Fire Station and Football Field

- файл: `transport_minecraft-fire-station-and-football-field_mc-mod_1.19.4.schem` · категория: **transport** · теги: medium|station · 89x20x63 · 1745 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_minecraft-fire-station-and-football-field_mc-mod_1.19.4.png`
- вердикт: undefined · флаги: franchise

### Minecraft Airport Runway

- файл: `transport_minecraft-airport-runway_buildschematics_x.nbt` · категория: **transport** · теги: small · 283x2x13 · 7127 блоков · источник: buildschematics
- превью: `schemes/thumbs/transport_minecraft-airport-runway_buildschematics_x.png`
- вердикт: undefined · флаги: franchise

### Airport

- файл: `transport_airport_mcbuild_x.schem` · категория: **transport** · теги: huge · 81x35x229 · 160078 блоков · источник: mcbuild
- превью: `schemes/thumbs/transport_airport_mcbuild_x.png`
- вердикт: undefined

### Police Station With Jail

- файл: `transport_police-station-with-jail_buildschematics_x.schematic` · категория: **transport** · теги: large|station|tall · 49x69x39 · 49777 блоков · источник: buildschematics
- превью: `schemes/thumbs/transport_police-station-with-jail_buildschematics_x.png`
- вердикт: undefined

### City Police Station Building

- файл: `transport_city-police-station-building_buildschematics_x.schematic` · категория: **transport** · теги: small|station · 25x17x32 · 4132 блоков · источник: buildschematics
- превью: `schemes/thumbs/transport_city-police-station-building_buildschematics_x.png`
- вердикт: undefined

### Police Station | Modern Police Station

- файл: `transport_police-station-modern-police-station_mcbuild_x.schem` · категория: **transport** · теги: medium|modern|station · 26x38x41 · 5680 блоков · источник: mcbuild
- превью: `schemes/thumbs/transport_police-station-modern-police-station_mcbuild_x.png`
- вердикт: undefined

### Police Station - complete version

- файл: `transport_police-station-complete-version_mcbuild_x.schem` · категория: **transport** · теги: medium|station · 42x19x29 · 8207 блоков · источник: mcbuild
- превью: `schemes/thumbs/transport_police-station-complete-version_mcbuild_x.png`
- вердикт: undefined

### Police Station

- файл: `transport_police-station_mcbuild_x.schem` · категория: **transport** · теги: medium|station · 45x14x45 · 6661 блоков · источник: mcbuild
- превью: `schemes/thumbs/transport_police-station_mcbuild_x.png`
- вердикт: undefined

### Fire Station Building

- файл: `transport_fire-station-building_buildschematics_x.schematic` · категория: **transport** · теги: medium|station · 45x40x45 · 5977 блоков · источник: buildschematics
- превью: `schemes/thumbs/transport_fire-station-building_buildschematics_x.png`
- вердикт: undefined

### Fire Station House

- файл: `transport_fire-station-house_buildschematics_x.schematic` · категория: **transport** · теги: house|large|station · 99x31x121 · 46228 блоков · источник: buildschematics
- превью: `schemes/thumbs/transport_fire-station-house_buildschematics_x.png`
- вердикт: undefined

### Fire Station

- файл: `transport_fire-station_mcbuild_x.schem` · категория: **transport** · теги: large|station · 110x29x55 · 31610 блоков · источник: mcbuild
- превью: `schemes/thumbs/transport_fire-station_mcbuild_x.png`
- вердикт: undefined · флаги: duplicate-name

### Fire Station

- файл: `transport_fire-station_mcbuild_x-2.schem` · категория: **transport** · теги: medium|station · 45x40x45 · 5967 блоков · источник: mcbuild
- превью: `schemes/thumbs/transport_fire-station_mcbuild_x-2.png`
- вердикт: undefined · флаги: duplicate-name

### Fire station

- файл: `transport_fire-station_mcbuild_x-3.schem` · категория: **transport** · теги: medium|station|tall · 20x69x27 · 7189 блоков · источник: mcbuild
- превью: `schemes/thumbs/transport_fire-station_mcbuild_x-3.png`
- вердикт: undefined · флаги: duplicate-name

### Small Gas Station and Store

- файл: `transport_small-gas-station-and-store_buildschematics_x.schematic` · категория: **transport** · теги: shop|small|station · 59x7x31 · 3415 блоков · источник: buildschematics
- превью: `schemes/thumbs/transport_small-gas-station-and-store_buildschematics_x.png`
- вердикт: undefined

### Gas station

- файл: `transport_gas-station_mcbuild_x.schem` · категория: **transport** · теги: medium|station · 48x11x39 · 4266 блоков · источник: mcbuild
- превью: `schemes/thumbs/transport_gas-station_mcbuild_x.png`
- вердикт: undefined

### Gas Station 3

- файл: `transport_gas-station-3_mcbuild_x.schem` · категория: **transport** · теги: large|station · 76x17x119 · 21101 блоков · источник: mcbuild
- превью: `schemes/thumbs/transport_gas-station-3_mcbuild_x.png`
- вердикт: undefined

### Petrol/ Gas station

- файл: `transport_petrol-gas-station_mcbuild_x.schem` · категория: **transport** · теги: medium|station · 43x15x66 · 6551 блоков · источник: mcbuild
- превью: `schemes/thumbs/transport_petrol-gas-station_mcbuild_x.png`
- вердикт: undefined

### Sheetz Gas Station

- файл: `transport_sheetz-gas-station_mcbuild_x.schem` · категория: **transport** · теги: large|station · 107x23x136 · 25050 блоков · источник: mcbuild
- превью: `schemes/thumbs/transport_sheetz-gas-station_mcbuild_x.png`
- вердикт: undefined

### 9-story Parking Garage

- файл: `transport_9-story-parking-garage_mcbuild_x.schem` · категория: **transport** · теги: huge|park|parking|tall · 169x64x93 · 215848 блоков · источник: mcbuild
- превью: `schemes/thumbs/transport_9-story-parking-garage_mcbuild_x.png`
- вердикт: undefined

### Six-story parking lot

- файл: `transport_six-story-parking-lot_mcbuild_x.schem` · категория: **transport** · теги: large|park|parking · 59x27x91 · 31629 блоков · источник: mcbuild
- превью: `schemes/thumbs/transport_six-story-parking-lot_mcbuild_x.png`
- вердикт: undefined

### Train station

- файл: `transport_train-station_mcbuild_x-2.schem` · категория: **transport** · теги: large|station|tall · 60x42x151 · 54443 блоков · источник: mcbuild
- превью: `schemes/thumbs/transport_train-station_mcbuild_x-2.png`
- вердикт: undefined · флаги: duplicate-name

### Train Station Like Structure

- файл: `transport_train-station-like-structure_mcbuild_x.schem` · категория: **transport** · теги: medium|station|tall · 17x41x37 · 2754 блоков · источник: mcbuild
- превью: `schemes/thumbs/transport_train-station-like-structure_mcbuild_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Nice village train station

- файл: `transport_nice-village-train-station_mcbuild_x.schem` · категория: **transport** · теги: house|medium|station · 20x27x29 · 8086 блоков · источник: mcbuild
- превью: `schemes/thumbs/transport_nice-village-train-station_mcbuild_x.png`
- вердикт: undefined

### St Thomas Underground Train station

- файл: `transport_st-thomas-underground-train-station_mcbuild_x.schem` · категория: **transport** · теги: large|station|tall · 88x43x43 · 73559 блоков · источник: mcbuild
- превью: `schemes/thumbs/transport_st-thomas-underground-train-station_mcbuild_x.png`
- вердикт: undefined

### Garbage Truck with Front Loader

- файл: `vehicles_garbage-truck-with-front-loader_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 11x4x7 · 41 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_garbage-truck-with-front-loader_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### Japanese Garbage Compactor Structure

- файл: `vehicles_japanese-garbage-compactor-structure_mc-mod_x.schematic` · категория: **vehicles** · теги: tiny · 5x4x8 · 49 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_japanese-garbage-compactor-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Realistic Car Trailer – 468 Blocks

- файл: `vehicles_realistic-car-trailer-468-blocks_mc-mod_1.21.1.nbt` · категория: **vehicles** · теги: car|tiny · 25x9x6 · 3 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_realistic-car-trailer-468-blocks_mc-mod_1.21.1.png`
- вердикт: undefined · флаги: almost-empty, non-building-in-name

### 1994 Nissan Dump Truck Vehicle

- файл: `vehicles_1994-nissan-dump-truck-vehicle_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 9x4x5 · 68 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_1994-nissan-dump-truck-vehicle_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### Super Motorcycle Design

- файл: `vehicles_super-motorcycle-design_mc-mod_x.schematic` · категория: **vehicles** · теги: medium · 256x1x128 · 32727 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_super-motorcycle-design_mc-mod_x.png`
- вердикт: undefined

### Tow Truck Semi-Trailer

- файл: `vehicles_tow-truck-semi-trailer_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 5x4x13 · 88 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_tow-truck-semi-trailer_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### Aluminum Van Truck 6×6

- файл: `vehicles_aluminum-van-truck-6x6_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 11x6x5 · 53 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_aluminum-van-truck-6x6_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### Industrial Iron Car Vehicle

- файл: `vehicles_industrial-iron-car-vehicle_mc-mod_1.21.1.nbt` · категория: **vehicles** · теги: car|tiny · 15x7x11 · 190 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_industrial-iron-car-vehicle_mc-mod_1.21.1.png`
- вердикт: undefined · флаги: non-building-in-name

### 1995 Isuzu Forward Crane Truck

- файл: `vehicles_1995-isuzu-forward-crane-truck_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 11x4x5 · 52 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_1995-isuzu-forward-crane-truck_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### Ten-Wheeler Crane Tow Truck

- файл: `vehicles_ten-wheeler-crane-tow-truck_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 10x4x5 · 42 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_ten-wheeler-crane-tow-truck_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### Fuso Fighter Wing Van Truck

- файл: `vehicles_fuso-fighter-wing-van-truck_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 5x5x13 · 47 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_fuso-fighter-wing-van-truck_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### Car Carrier Truck and Trailer

- файл: `vehicles_car-carrier-truck-and-trailer_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 24x8x5 · 218 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_car-carrier-truck-and-trailer_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### 1998 Isuzu Freezer Truck

- файл: `vehicles_1998-isuzu-freezer-truck_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 5x5x13 · 43 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_1998-isuzu-freezer-truck_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### Heavy Duty Ambulance Vehicle

- файл: `vehicles_heavy-duty-ambulance-vehicle_mc-mod_x.schematic` · категория: **vehicles** · теги: tiny · 5x5x10 · 97 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_heavy-duty-ambulance-vehicle_mc-mod_x.png`
- вердикт: undefined

### Japanese Van with 8 Wheels

- файл: `vehicles_japanese-van-with-8-wheels_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 5x5x15 · 50 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_japanese-van-with-8-wheels_mc-mod_x.png`
- вердикт: undefined

### Fuso Fighter Dump Truck Vehicle

- файл: `vehicles_fuso-fighter-dump-truck-vehicle_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 5x5x8 · 54 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_fuso-fighter-dump-truck-vehicle_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### Fire Truck with Manlift

- файл: `vehicles_fire-truck-with-manlift_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 5x7x13 · 156 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_fire-truck-with-manlift_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### Decorated 10W Truck Van

- файл: `vehicles_decorated-10w-truck-van_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 17x5x5 · 70 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_decorated-10w-truck-van_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### Crane Truck with Car Carrier

- файл: `vehicles_crane-truck-with-car-carrier_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 5x4x14 · 91 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_crane-truck-with-car-carrier_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### Fuso FV411J Dump Truck Model

- файл: `vehicles_fuso-fv411j-dump-truck-model_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 9x5x5 · 61 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_fuso-fv411j-dump-truck-model_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### Decorated 12-Wheel Refrigerated Van

- файл: `vehicles_decorated-12-wheel-refrigerated-van_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 16x6x5 · 127 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_decorated-12-wheel-refrigerated-van_mc-mod_x.png`
- вердикт: undefined

### Frog Driving a Car

- файл: `vehicles_frog-driving-a-car_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 16x15x1 · 152 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_frog-driving-a-car_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### Fuso Fighter Cargo Truck Detailed Build

- файл: `vehicles_fuso-fighter-cargo-truck-detailed-build_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 11x5x5 · 57 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_fuso-fighter-cargo-truck-detailed-build_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name, non-building-in-name

### Decorated Japanese Refrigerated Van

- файл: `vehicles_decorated-japanese-refrigerated-van_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 16x6x5 · 99 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_decorated-japanese-refrigerated-van_mc-mod_x.png`
- вердикт: undefined

### Fallout 3 Inspired Car Schematic

- файл: `vehicles_fallout-3-inspired-car-schematic_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 5x3x13 · 75 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_fallout-3-inspired-car-schematic_mc-mod_x.png`
- вердикт: undefined · флаги: franchise, meta-word-in-name, non-building-in-name

### Tractor With Cometto Trailer

- файл: `vehicles_tractor-with-cometto-trailer_mc-mod_x.schematic` · категория: **vehicles** · теги: tiny · 35x4x5 · 126 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_tractor-with-cometto-trailer_mc-mod_x.png`
- вердикт: undefined

### Decorated Refrigerated Van

- файл: `vehicles_decorated-refrigerated-van_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 13x6x5 · 104 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_decorated-refrigerated-van_mc-mod_x.png`
- вердикт: undefined

### Fallout 3 Style Car (No Engine)

- файл: `vehicles_fallout-3-style-car-no-engine_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 12x3x5 · 68 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_fallout-3-style-car-no-engine_mc-mod_x.png`
- вердикт: undefined · флаги: franchise, non-building-in-name

### Aluminum Wing Van Truck with Solar Radiator

- файл: `vehicles_aluminum-wing-van-truck-with-solar-radiator_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 14x6x5 · 94 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_aluminum-wing-van-truck-with-solar-radiator_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### Fallout 3 Car Replica

- файл: `vehicles_fallout-3-car-replica_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 5x3x13 · 64 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_fallout-3-car-replica_mc-mod_x.png`
- вердикт: undefined · флаги: franchise, non-building-in-name

### Cometto Self-Propelled Trailer

- файл: `vehicles_cometto-self-propelled-trailer_mc-mod_x.schematic` · категория: **vehicles** · теги: tiny · 29x4x17 · 123 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_cometto-self-propelled-trailer_mc-mod_x.png`
- вердикт: undefined

### Secure Transport Van

- файл: `vehicles_secure-transport-van_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 13x4x5 · 58 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_secure-transport-van_mc-mod_x.png`
- вердикт: undefined

### Thomas and Friends Candy Car

- файл: `vehicles_thomas-and-friends-candy-car_mc-mod_x.schematic` · категория: **vehicles** · теги: car|small · 7x14x33 · 815 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_thomas-and-friends-candy-car_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### Heavy Duty 14-Wheeler Dump Truck

- файл: `vehicles_heavy-duty-14-wheeler-dump-truck_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 13x5x5 · 103 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_heavy-duty-14-wheeler-dump-truck_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### Refrigerated Double-Cab Van

- файл: `vehicles_refrigerated-double-cab-van_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 10x5x5 · 43 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_refrigerated-double-cab-van_mc-mod_x.png`
- вердикт: undefined

### Concrete Pump Truck with Derricks

- файл: `vehicles_concrete-pump-truck-with-derricks_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 18x6x5 · 185 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_concrete-pump-truck-with-derricks_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### 10-Wheeler Wing Van Truck and Trailer

- файл: `vehicles_10-wheeler-wing-van-truck-and-trailer_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 24x5x5 · 224 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_10-wheeler-wing-van-truck-and-trailer_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### Sdkfz 222 Armored Car

- файл: `vehicles_sdkfz-222-armored-car_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 8x8x16 · 226 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_sdkfz-222-armored-car_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### Heavy Crane Truck

- файл: `vehicles_heavy-crane-truck_mc-mod_x.schematic` · категория: **vehicles** · теги: car|small · 51x10x9 · 788 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_heavy-crane-truck_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### Fruehauf Empty Can Van Trailer

- файл: `vehicles_fruehauf-empty-can-van-trailer_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 17x6x5 · 236 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_fruehauf-empty-can-van-trailer_mc-mod_x.png`
- вердикт: undefined

### Armored Snow Patrol Truck

- файл: `vehicles_armored-snow-patrol-truck_mc-mod_x.schematic` · категория: **vehicles** · теги: car|huge|tall · 162x63x89 · 65318 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_armored-snow-patrol-truck_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### 9 Block Long Van Box Truck Compartment

- файл: `vehicles_9-block-long-van-box-truck-compartment_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 5x5x10 · 39 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_9-block-long-van-box-truck-compartment_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### Small Car Dealership Building

- файл: `vehicles_small-car-dealership-building_mc-mod_x.schematic` · категория: **vehicles** · теги: boat|car|shop|small · 31x8x31 · 2861 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_small-car-dealership-building_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### Heavy Tractor Head and Van Trailer

- файл: `vehicles_heavy-tractor-head-and-van-trailer_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 5x6x23 · 303 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_heavy-tractor-head-and-van-trailer_mc-mod_x.png`
- вердикт: undefined

### Double Cab Pickup Truck

- файл: `vehicles_double-cab-pickup-truck_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 9x4x5 · 50 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_double-cab-pickup-truck_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### Massive Haul Truck

- файл: `vehicles_massive-haul-truck_mc-mod_x.schematic` · категория: **vehicles** · теги: car|medium · 25x26x45 · 9197 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_massive-haul-truck_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### Futuristic Police Space Vehicle

- файл: `vehicles_futuristic-police-space-vehicle_mc-mod_x.schematic` · категория: **vehicles** · теги: modern|small · 11x9x24 · 589 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_futuristic-police-space-vehicle_mc-mod_x.png`
- вердикт: undefined

### Prison Transport Bus For Police

- файл: `vehicles_prison-transport-bus-for-police_mc-mod_x.schematic` · категория: **vehicles** · теги: tiny · 13x6x5 · 123 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_prison-transport-bus-for-police_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### Prisoner Transport Truck Vehicle

- файл: `vehicles_prisoner-transport-truck-vehicle_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 5x4x9 · 74 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_prisoner-transport-truck-vehicle_mc-mod_x.png`
- вердикт: undefined · флаги: non-building-in-name

### European Style Prison Bus

- файл: `vehicles_european-style-prison-bus_mc-mod_1.18.1.schem` · категория: **vehicles** · теги: large · 84x38x40 · 9177 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_european-style-prison-bus_mc-mod_1.18.1.png`
- вердикт: undefined · флаги: non-building-in-name

### Snowy House and Vehicles

- файл: `vehicles_snowy-house-and-vehicles_mc-mod_1.21.1.nbt` · категория: **vehicles** · теги: house|medium · 74x16x97 · 3328 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_snowy-house-and-vehicles_mc-mod_1.21.1.png`
- вердикт: undefined

### Bus Stop

- файл: `vehicles_bus-stop_mcbuild_x.schem` · категория: **vehicles** · теги: tiny · 5x7x8 · 99 блоков · источник: mcbuild
- превью: `schemes/thumbs/vehicles_bus-stop_mcbuild_x.png`
- вердикт: undefined · флаги: duplicate-name, non-building-in-name

### bus stop

- файл: `vehicles_bus-stop_mcbuild_x-2.schem` · категория: **vehicles** · теги: tiny · 16x7x10 · 305 блоков · источник: mcbuild
- превью: `schemes/thumbs/vehicles_bus-stop_mcbuild_x-2.png`
- вердикт: undefined · флаги: duplicate-name, non-building-in-name

### bus stop

- файл: `vehicles_bus-stop_mcbuild_x-3.schem` · категория: **vehicles** · теги: small · 15x6x25 · 235 блоков · источник: mcbuild
- превью: `schemes/thumbs/vehicles_bus-stop_mcbuild_x-3.png`
- вердикт: undefined · флаги: duplicate-name, non-building-in-name

### Ambulance

- файл: `vehicles_ambulance_mcbuild_x.schem` · категория: **vehicles** · теги: tiny · 5x5x10 · 106 блоков · источник: mcbuild
- превью: `schemes/thumbs/vehicles_ambulance_mcbuild_x.png`
- вердикт: undefined

### Automatic Ice Boat Crossing

- файл: `waterfront_automatic-ice-boat-crossing_mc-mod_x.schematic` · категория: **waterfront** · теги: boat|medium · 37x13x37 · 835 блоков · источник: mc-mod
- превью: `schemes/thumbs/waterfront_automatic-ice-boat-crossing_mc-mod_x.png`
- вердикт: undefined

### Small Fishing Boat with Storage

- файл: `waterfront_small-fishing-boat-with-storage_mc-mod_x.schematic` · категория: **waterfront** · теги: boat|shop|small · 22x16x33 · 3382 блоков · источник: mc-mod
- превью: `schemes/thumbs/waterfront_small-fishing-boat-with-storage_mc-mod_x.png`
- вердикт: undefined

### LostSea Ocean Village with Ships

- файл: `waterfront_lostsea-ocean-village-with-ships_mc-mod_x.schematic` · категория: **waterfront** · теги: boat|house|huge · 124x37x117 · 254470 блоков · источник: mc-mod
- превью: `schemes/thumbs/waterfront_lostsea-ocean-village-with-ships_mc-mod_x.png`
- вердикт: undefined

### Asian Style Dock

- файл: `waterfront_asian-style-dock_mc-mod_x.schematic` · категория: **waterfront** · теги: boat|small|water · 32x14x21 · 1177 блоков · источник: mc-mod
- превью: `schemes/thumbs/waterfront_asian-style-dock_mc-mod_x.png`
- вердикт: undefined

### Trading Ship – Small Creative Build

- файл: `waterfront_trading-ship-small-creative-build_mc-mod_x.schematic` · категория: **waterfront** · теги: boat|large|shop|tall · 114x83x48 · 76528 блоков · источник: mc-mod
- превью: `schemes/thumbs/waterfront_trading-ship-small-creative-build_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### Diagonal Port Structure

- файл: `waterfront_diagonal-port-structure_mc-mod_x.schematic` · категория: **waterfront** · теги: medium|tall · 43x45x48 · 9309 блоков · источник: mc-mod
- превью: `schemes/thumbs/waterfront_diagonal-port-structure_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### AxiumSA Luxury Liner – Modern Yacht

- файл: `waterfront_axiumsa-luxury-liner-modern-yacht_mc-mod_x.schematic` · категория: **waterfront** · теги: boat|medium|modern · 21x23x69 · 9014 блоков · источник: mc-mod
- превью: `schemes/thumbs/waterfront_axiumsa-luxury-liner-modern-yacht_mc-mod_x.png`
- вердикт: undefined

### Corvette Tuna Naval Cannon Ship

- файл: `waterfront_corvette-tuna-naval-cannon-ship_mc-mod_x.schematic` · категория: **waterfront** · теги: boat|small · 28x12x17 · 667 блоков · источник: mc-mod
- превью: `schemes/thumbs/waterfront_corvette-tuna-naval-cannon-ship_mc-mod_x.png`
- вердикт: undefined

### Moderate Size Dock with Chests

- файл: `waterfront_moderate-size-dock-with-chests_mc-mod_x.schematic` · категория: **waterfront** · теги: boat|small|water · 32x12x28 · 908 блоков · источник: mc-mod
- превью: `schemes/thumbs/waterfront_moderate-size-dock-with-chests_mc-mod_x.png`
- вердикт: undefined

### Imposing Flying Ship Design

- файл: `waterfront_imposing-flying-ship-design_mc-mod_x.schematic` · категория: **waterfront** · теги: boat|large|tall · 33x70x89 · 7851 блоков · источник: mc-mod
- превью: `schemes/thumbs/waterfront_imposing-flying-ship-design_mc-mod_x.png`
- вердикт: undefined

### Coastal Port Village

- файл: `waterfront_coastal-port-village_mc-mod_x.schematic` · категория: **waterfront** · теги: house|small · 22x18x17 · 3693 блоков · источник: mc-mod
- превью: `schemes/thumbs/waterfront_coastal-port-village_mc-mod_x.png`
- вердикт: undefined

### Gretjoy Boat Build

- файл: `waterfront_gretjoy-boat-build_mc-mod_x.schematic` · категория: **waterfront** · теги: boat|large|tall · 75x52x51 · 4633 блоков · источник: mc-mod
- превью: `schemes/thumbs/waterfront_gretjoy-boat-build_mc-mod_x.png`
- вердикт: undefined · флаги: meta-word-in-name

### German Train Ferry Preussen 1909 Ship Recreation

- файл: `waterfront_german-train-ferry-preussen-1909-ship-recreation_mc-mod_x.schematic` · категория: **waterfront** · теги: boat|huge|tall · 196x75x35 · 108570 блоков · источник: mc-mod
- превью: `schemes/thumbs/waterfront_german-train-ferry-preussen-1909-ship-recreation_mc-mod_x.png`
- вердикт: undefined

### Modern Port Town

- файл: `waterfront_modern-port-town_mc-mod_1.15.2.schem` · категория: **waterfront** · теги: medium|modern · 54x34x32 · 11587 блоков · источник: mc-mod
- превью: `schemes/thumbs/waterfront_modern-port-town_mc-mod_1.15.2.png`
- вердикт: undefined

### Luxury Yacht – Quartz Block Design

- файл: `waterfront_luxury-yacht-quartz-block-design_mc-mod_x.schematic` · категория: **waterfront** · теги: boat|small · 7x14x22 · 427 блоков · источник: mc-mod
- превью: `schemes/thumbs/waterfront_luxury-yacht-quartz-block-design_mc-mod_x.png`
- вердикт: undefined

### Oak Sailing Ship

- файл: `waterfront_oak-sailing-ship_mc-mod_x.schematic` · категория: **waterfront** · теги: boat|small|tree · 30x23x11 · 898 блоков · источник: mc-mod
- превью: `schemes/thumbs/waterfront_oak-sailing-ship_mc-mod_x.png`
- вердикт: undefined

### Modern VIP Yacht

- файл: `waterfront_modern-vip-yacht_mc-mod_x.schematic` · категория: **waterfront** · теги: boat|medium|modern · 77x23x15 · 12462 блоков · источник: mc-mod
- превью: `schemes/thumbs/waterfront_modern-vip-yacht_mc-mod_x.png`
- вердикт: undefined

### Fisherman’s Hut with Boat

- файл: `waterfront_fishermans-hut-with-boat_mc-mod_x.schematic` · категория: **waterfront** · теги: boat|small · 26x10x14 · 907 блоков · источник: mc-mod
- превью: `schemes/thumbs/waterfront_fishermans-hut-with-boat_mc-mod_x.png`
- вердикт: undefined

### Three-Masted Sailing Ship

- файл: `waterfront_three-masted-sailing-ship_mc-mod_x.schematic` · категория: **waterfront** · теги: boat|medium · 13x26x49 · 2781 блоков · источник: mc-mod
- превью: `schemes/thumbs/waterfront_three-masted-sailing-ship_mc-mod_x.png`
- вердикт: undefined

### Sloop Boat

- файл: `waterfront_sloop-boat_mc-mod_x.schematic` · категория: **waterfront** · теги: boat|medium|tall · 48x54x15 · 3547 блоков · источник: mc-mod
- превью: `schemes/thumbs/waterfront_sloop-boat_mc-mod_x.png`
- вердикт: undefined

### Ancient Roman Galley Ship

- файл: `waterfront_ancient-roman-galley-ship_mc-mod_x.schematic` · категория: **waterfront** · теги: boat|medium · 42x24x31 · 4689 блоков · источник: mc-mod
- превью: `schemes/thumbs/waterfront_ancient-roman-galley-ship_mc-mod_x.png`
- вердикт: undefined

### Small Fishing Trawler Boat

- файл: `waterfront_small-fishing-trawler-boat_mc-mod_x.schematic` · категория: **waterfront** · теги: boat|shop|small · 22x28x12 · 373 блоков · источник: mc-mod
- превью: `schemes/thumbs/waterfront_small-fishing-trawler-boat_mc-mod_x.png`
- вердикт: undefined

### Chinese Junk Ship

- файл: `waterfront_chinese-junk-ship_mc-mod_x.schematic` · категория: **waterfront** · теги: boat|medium · 17x31x49 · 4851 блоков · источник: mc-mod
- превью: `schemes/thumbs/waterfront_chinese-junk-ship_mc-mod_x.png`
- вердикт: undefined

### Alexandria's Lighthouse

- файл: `waterfront_alexandria-s-lighthouse_mcbuild_x.schem` · категория: **waterfront** · теги: house|large|tall|water · 51x151x51 · 34863 блоков · источник: mcbuild
- превью: `schemes/thumbs/waterfront_alexandria-s-lighthouse_mcbuild_x.png`
- вердикт: undefined

### Stone lighthouse - (with working fireplace)

- файл: `waterfront_stone-lighthouse-with-working-fireplace_mcbuild_x.schem` · категория: **waterfront** · теги: house|medium|water · 27x38x19 · 7357 блоков · источник: mcbuild
- превью: `schemes/thumbs/waterfront_stone-lighthouse-with-working-fireplace_mcbuild_x.png`
- вердикт: undefined

## Полный список по постройкам

| # | постройка | категория | название↔картинка | категория↔картинка | теги↔картинка | вердикт | комментарий |
|---|---|---|---|---|---|---|---|
| 1 | Apartment Building 06 | residential | совпадает | подходит | подходят | OK | Высотный жилой дом со стеклянным фасадом, балконами и машинными этажами сверху. |
| 2 | Automated Andesite Alloy Factory | industrial | совпадает | подходит | подходят | OK | Серый промышленный узел с трубами, резервуарами и двумя подъёмными башенками. |
| 3 | Automatic Wooden Streetlight | decor | совпадает | подходит | лишние (-tree) | мелочь | Деревянный столб с фонарём сверху, деревьев рядом нет — тег tree лишний. |
| 4 | AxiumSA Medium Boat | vehicles | частично | подходит | подходят | мелочь | Виден лишь каркас деревянного корпуса с веслами, наружная обшивка не закончена. |
| 5 | Blacksmith Shop House | commercial | частично | подходит | подходят | мелочь | Открытая деревянная постройка с тяжёлой двускатной крышей, кузницы или наковальни не видно. |
| 6 | Blue House Minecraft Build | residential | частично | подходит | подходят | мелочь | Маленький дом с серой черепичной крышей; синего цвета на превью не различить. |
| 7 | Brass and Glass Worm Train Vehicle | transport | частично | подходит | подходят | СЛОМАНО | Разрозненные стеклянные и белые блоки линией — пустой каркас, силуэт поезда не читается. |
| 8 | Brick Factory Building - 5037 Blocks | industrial | совпадает | подходит | подходят | OK | Кирпичное здание фабрики, обвитое лианами, со шатровой крышей и входом сбоку. |
| 9 | Cardiff Townhouse - Multi-Story Shop and Residence | residential | совпадает | подходит | подходят | OK | Многоэтажный таунхаус с витриной и навесом на первом этаже, выше жилые ярусы. |
| 10 | Catering Truck for Airports | vehicles | совпадает | подходит | подходят | OK | Белый грузовик с высоким изотермическим кузовом и кабиной, размер компактный. |
| 11 | Champion Race Car | vehicles | совпадает | подходит | подходят | OK | Низкий гоночный автомобиль красно-белого цвета с широким обвесом. |
| 12 | City Gas Station | public | совпадает | **не подходит**→commercial | подходят | РАСХОЖДЕНИЕ | Заправка с навесом и колонками на площадке — это коммерция, а не общественное здание. |
| 13 | City Hospital with Elevator - 10890 Blocks | public | частично | подходит | подходят | мелочь | Просторный серый корпус с рядами окон, медицинской символики и признаков больницы нет. |
| 14 | Cobbled Deepslate 4-Way Train Intersection | intersections | совпадает | подходит | подходят | OK | Рельсовый перекрёсток в форме X с сигналами и площадками во все четыре направления. |
| 15 | Compact Japanese Kei Car | vehicles | частично | подходит | подходят | СЛОМАНО | Два раздельных бруска из 12 блоков — машинка не собрана, силуэт авто не читается. |
| 16 | Contemporary Residence with Two Unfurnished Floors | residential | частично | подходит | подходят | мелочь | Длинное светлое здание с колоннадой и красными стойками скорее похоже на зал, чем на дом. |
| 17 | Cozy Duplex House for Two Families | residential | совпадает | подходит | подходят | OK | Компактный дом с террасной деревянной крышей и небольшим садиком сбоку. |
| 18 | Cozy Wooden House for Roleplay Servers | residential | совпадает | подходит | подходят | OK | Небольшой деревянный дом с панорамной стеклянной крышей и выходом на террасу. |
| 19 | Deepslate Dual Train Station | public | совпадает | подходит | подходят | OK | Две параллельные платформы с навесами, фонарями и переходом между ними. |
| 20 | Desert Home With Extra Rooms | residential | совпадает | подходит | подходят | OK | Пустынный дом из песчаных блоков с плоскими крышами и пристроенными дополнительными объёмами. |
| 21 | Desert Oasis Treehouse Village | decor | частично | подходит | не хватает (+water) | мелочь | Пустынный оазис с большим водоёмом и высокой башней; домов на деревьях и деревьев не видно. |
| 22 | Detailed Wood Villa with Pool | residential | совпадает | подходит | подходят | OK | Деревянная вилла из брёвен с террасами и небольшим бассейном у подножия. |
| 23 | Double Cab Crane Truck | vehicles | совпадает | подходит | подходят | OK | Грузовик с двухрядной кабиной и выдвижной стрелой крана на шасси. |
| 24 | Electric Passenger Train Coach - First Class | transport | совпадает | подходит | подходят | OK | Светлый пассажирский вагон с жёлтой полосой, рядами окон и крышей. |
| 25 | Elegant Mansion With Garden | residential | частично | подходит | подходят | мелочь | Участок с белыми стенами и кольцевыми дорожками читается скорее как сад-лабиринт, чем особняк. |
| 26 | Elegant Quartz Bridge | bridges | совпадает | подходит | подходят | OK | Белая кварцевая арка моста с перилами и массивными опорами по краям. |
| 27 | Factory and Train Station Structure | transport | частично | подходит | подходят | мелочь | Дугообразный навес с рядами деревьев вокруг: и завод, и станция читаются с натяжкой. |
| 28 | Fallout 3 Broadcast Tower Structure | industrial | совпадает | подходит | подходят | мелочь | Тёмная решётчатая вышка с красными маяками на основании; отсылки к игре на картинке не видно. |
| 29 | First Class Passenger Train Car | transport | совпадает | подходит | подходят | OK | Длинный вагон с красным блоком на торце и рядом круглых элементов вдоль борта. |
| 30 | Four Tier Garden Structure | parks | частично | подходит | подходят | мелочь | Четыре круглых яруса, сложенные башней-тортом; зелени и клумб на них не видно. |
| 31 | Futuristic Arcology Garden | parks | частично | подходит | подходят | мелочь | Большой светло-синий купол на цилиндрическом основании с подсветкой, сада не видно. |
| 32 | Futuristic Industrial Complex | industrial | совпадает | подходит | подходят | OK | Комплекс из стеклянных и белых корпусов с решётчатой башней и транспортными площадками. |
| 33 | Futuristic Stadium Entrance Gate | public | частично | подходит | подходят | мелочь | Массивные пилоны с красными навершиями и пологими рампами; самого стадиона за кадром нет. |
| 34 | Gothic Cathedral Structure | public | совпадает | подходит | подходят | OK | Большой готический собор с аркадами, контрфорсами и башней над алтарной частью. |
| 35 | Gothic Church Structure | public | совпадает | подходит | подходят | OK | Готическая церковь с острым шпилем, контрфорсами и круглым окном на фасаде. |
| 36 | Gravel Crossroads with Lighting | intersections | частично | подходит | подходят | мелочь | Многогранный земляный участок с фонарями по краям; дорожное полотно и перекрёсток не читаются. |
| 37 | Hawkseye Pavilion Event Stage | parks | совпадает | подходит | подходят | OK | Крупный павильон с плоской крышей, колоннами и широким входом на газоне. |
| 38 | Heavy Duty Off-Road Dump Truck | vehicles | совпадает | подходит | подходят | OK | Короткий самосвал с крупным кузовом, кабиной и толстыми внедорожными колёсами. |
| 39 | Heavy-Duty Tractor-Trailer with Self-Loader Truck | vehicles | совпадает | подходит | подходят | OK | Длинный грузовик с красной кабиной, серым прицепом и несколькими осями колёс. |
| 40 | Hollywood Style Mansion | residential | совпадает | подходит | не хватает (+pool) | мелочь | Просторный особняк с бассейном и ландшафтным парком; тег pool в списке отсутствует. |
| 41 | Industrial Factory Building | industrial | совпадает | подходит | подходят | OK | длинный промышленный корпус с серой крышей и кирпичными вставками, ряды окон по фасаду читаются |
| 42 | Industrial Iron Factory Structure | industrial | частично | подходит | подходят | мелочь | оборудование цеха с трубами и подсветкой на висящем острове, цельного здания фабрики нет |
| 43 | Iron Stone Arch Bridge | bridges | совпадает | подходит | подходят | OK | белая арка из железа и камня с башенками на обоих берегах, мост читается однозначно |
| 44 | Ironworks Industrial Smelter | industrial | совпадает | подходит | подходят | OK | промышленный блок с пятью трубами и вентиляцией на крыше, стоит на травяном плинте |
| 45 | Island Bridge | bridges | совпадает | подходит | подходят | OK | очень длинный мост из повторяющихся секций, протяжённость и высота соответствуют названию |
| 46 | Island Lighthouse Structure | residential | совпадает | **не подходит**→waterfront | лишние (-house) | РАСХОЖДЕНИЕ | светлая башня маяка на кубе воды, к жилым зданиям не относится, нужна набережная |
| 47 | Italian Gelato Shop Small Build | commercial | совпадает | подходит | подходят | OK | небольшой кремовый магазинчик с навесом, витринами и наружной лестницей, размер сходится |
| 48 | Japanese Electric Train Coach Schematic | transport | совпадает | подходит | подходят | OK | серый вагон электрички с оконной полосой и буферами, компактный и читаемый |
| 49 | Jungle Wood House with Furniture | residential | совпадает | подходит | подходят | OK | круглый деревянный дом с покатой крышей на площадке с дорожками и купальнями |
| 50 | Kami House Minecraft Build | residential | частично | подходит | подходят | мелочь | ледяный остров с несколькими постройками, стиль «ками» и японский мотив не читаются |
| 51 | Large Modern House | residential | совпадает | подходит | подходят | OK | современный серый дом с плоской крышей и каменным основанием на газоне, всё сходится |
| 52 | Large Woodland Manor House | residential | совпадает | подходит | подходят | OK | большой деревянный особняк с бассейном и колоннадой, деревянная фактура читается |
| 53 | Luxury Yacht - Small Boat Design | waterfront | совпадает | **не подходит**→vehicles | лишние (-shop) | РАСХОЖДЕНИЕ | белая яхта с красной окантовкой палубы; судно должно быть в vehicles, магазина нет |
| 54 | Luxury Yacht | vehicles | совпадает | подходит | подходят | OK | белая яхта с надстройкой и синим пятном на палубе, категория vehicles верна |
| 55 | Magical Tree Structure | decor | совпадает | подходит | подходят | OK | крошечное деревце с бледной кроной на зелёном плинте, теги tiny и tree сходятся |
| 56 | Medium Apartment Building | residential | совпадает | подходит | подходят | OK | типовой серый жилой дом с регулярной сеткой окон, высота и этажность читаются |
| 57 | Medium Lighthouse Tower | waterfront | совпадает | подходит | лишние (-house -water) | мелочь | высокий полосатый маяк на постаменте, воды вокруг не видно, домом он не является |
| 58 | Medium Townhouse Structure | residential | совпадает | подходит | подходят | OK | коричневый таунхаус с окнами и балконами, пропорции и размер названию соответствуют |
| 59 | Medium Yacht Boat | waterfront | совпадает | **не подходит**→vehicles | подходят | РАСХОЖДЕНИЕ | бледная яхта с надстройкой; судно попало не в ту категорию, нужен vehicles |
| 60 | Mega Tower With Working Elevators | industrial | совпадает | **не подходит**→towers | подходят | РАСХОЖДЕНИЕ | тонкая высокая башня с лифтовой шахтой и окнами, к промышленным постройкам не относится |
| 61 | Modern Apartment Building 03 | residential | совпадает | подходит | подходят | OK | многоэтажный жилой блок с балконной сеткой и гладким фасадом, всё сходится |
| 62 | Modern Apartment Shops and Housing | residential | частично | подходит | лишние (-shop) | мелочь | серый жилой комплекс с колоннами балконов, боковая стена глухая, магазины не видны |
| 63 | Modern Apartment Tower &#8211; 10 Floors | towers | совпадает | подходит | подходят | OK | бледно-голубая башня с балконами и чёткими этажами, около десяти этажей правдоподобно |
| 64 | Modern Burger Cafe With Elevator | commercial | совпадает | подходит | подходят | OK | компактное здание с витринами, навесами и входной группой, коммерческий характер виден |
| 65 | Modern City Apartment Tower | residential | совпадает | подходит | подходят | OK | современная городская башня с гладкими фасадами и колоннами, высота читается |
| 66 | Modern Dark Oak Residence | residential | совпадает | подходит | лишние (-apartment) | мелочь | дом с двускатной крышей, светлые стены и деревья вокруг; это дом, а не апартаменты |
| 67 | Modern Duplex House | residential | совпадает | подходит | подходят | OK | белый дуплекс из двух объёмов с красными вставками, форма названию соответствует |
| 68 | Modern Home Exterior | residential | совпадает | подходит | не хватает (+pool) | мелочь | современный белый дом с плоскими крышами и бассейном у террасы, бассейн не отмечен в тегах |
| 69 | Modern Hotel Building With Fountain | towers | совпадает | **не подходит**→commercial | лишние (-fountain -water) | РАСХОЖДЕНИЕ | низкий серо-коричневый корпус на площадке, ни фонтана, ни воды не видно, башня это не |
| 70 | Modern Office Tower Design | towers | совпадает | подходит | подходят | OK | высокая башня с вертикальными оконными лентами и шапкой, офисная башня читается |
| 71 | Modern Retail Store | commercial | совпадает | подходит | подходят | OK | небольшой серо-белый магазин с витринами вдоль фасада, размер и категория сходятся |
| 72 | Modern Server Shop | commercial | совпадает | подходит | подходят | OK | здание с остеклённым фасадом в белой раме, торговый характер и средний размер видны |
| 73 | Modern Shop House | commercial | совпадает | подходит | подходят | OK | двухэтажный магазин-дом с широкой витриной первого этажа, силуэт читается |
| 74 | Modern Sphere House Design | residential | частично | подходит | подходят | мелочь | дом с террасами и синими площадками, сферическая форма из названия не подтверждается |
| 75 | Modern Street With Five Houses | decor | совпадает | **не подходит**→roads | подходят | РАСХОЖДЕНИЕ | сверху видна улица с дорогой, газонами и несколькими домами, к декору это не относится |
| 76 | Modern Three-Story House | residential | совпадает | подходит | подходят | OK | трёхэтажный деревянный дом с тёмной крышей, аккуратный и хорошо читаемый |
| 77 | Modern Townhouse with Furniture | residential | совпадает | подходит | подходят | OK | дом в разрезе с видимой мебелью, перегородками и лестницами, интерьер читается |
| 78 | Modern Two-Story House With Garage | residential | частично | подходит | лишние (-parking) | мелочь | светлый двухэтажный дом на большом газоне, ворота гаража и парковка в кадре не читаются |
| 79 | Modern Two-Story House With Pond | residential | частично | подходит | лишние (-pool -water) | мелочь | белый дом с тёмно-красными полосами по этажам на участке, пруда в кадре не видно |
| 80 | Modern Urban Apartment House | residential | совпадает | подходит | подходят | OK | комплекс из нескольких высотных серых башен на общей плите, городской характер читается |
| 81 | Monorail Maglev Transportation System | transport | совпадает | подходит | подходят | OK | длинный тонкий состав монорайли с голубыми окнами, читается |
| 82 | Narrow Gauge Train With Caboose | transport | совпадает | подходит | подходят | OK | узкоколожный локомотив с вагончиком, красно-жёлтые акценты видны |
| 83 | Passenger Train Carriage | transport | совпадает | подходит | подходят | OK | вытянутый пассажирский вагон с тёмными окнами, силуэт читается |
| 84 | Pennsylvania Railroad Coaling Tower | industrial | совпадает | подходит | лишние (-road) | мелочь | коричневая угольная башня над ж/д площадкой; тег road картинкой не подтверждается |
| 85 | PokeMart Shop | commercial | совпадает | подходит | подходят | OK | голубой кубический магазин на газоне, но название связано с франшизой Pokémon |
| 86 | Portland-Style Townhouse - Two Story Design | residential | частично | подходит | подходят | мелочь | узкий городской дом с колоннами окон, стиль и число этажей не читаются |
| 87 | Quartz Home | residential | совпадает | подходит | подходят | OK | большой белый дом из кварца с тёмной кровлей и зелёным участком |
| 88 | Realistic Highway Tunnel For Minecraft | roads | совпадает | подходит | подходят | OK | длинный бетонный тоннель с порталом и подъездами, читается |
| 89 | Red Japanese House 2 Minecraft Build | residential | частично | подходит | подходят | мелочь | тёмно-коричневое основание со светлой надстройкой, красного японского дома не видно |
| 90 | Ridable German ICE Train | transport | совпадает | подходит | подходят | OK | белый скоростной поезд со светло-голубыми окнами и локомотивом |
| 91 | Ridge Mansion With Pool And Tower | residential | совпадает | подходит | подходят | OK | огромный особняк с башней, газоном и водным участком у террасы |
| 92 | Riverside Log Cabin with Dock | waterfront | совпадает | подходит | подходят | OK | бревенчатая хижина у воды с настилом-доком, всё на месте |
| 93 | Row House Facade Design | residential | совпадает | подходит | подходят | OK | фасад ряда домов с рядами красных окон на зелёном основании |
| 94 | Rustic Log Cabin Shop | commercial | совпадает | подходит | подходят | OK | сруб с треугольным фасадом из брёвен и витриной, читается как магазин |
| 95 | Rustic Overgrown Church | public | совпадает | подходит | подходят | OK | небольшая деревянная церковь, стены и крыша заросшие зеленью |
| 96 | Rustic Wooden Train Station | public | совпадает | подходит | подходят | OK | крупная деревянная постройка с высокой двускатной крышей, вокзал читается |
| 97 | Sakura Tree Decoration | decor | совпадает | подходит | подходят | OK | дерево с ярко-розовой кроной на зелёном основании, сакура читается |
| 98 | Sandstone Cliffside Mansion with Boat Dock | transport | совпадает | **не подходит**→waterfront | подходят | РАСХОЖДЕНИЕ | песчаниковый особняк на склоне у воды с доком; категория transport не соответствует |
| 99 | Sandstone Library Building | public | совпадает | подходит | подходят | OK | песчаниковое здание с вертикальными лопатками и синими окнами |
| 100 | Sao Paulo Central Train Station Structure | public | совпадает | подходит | подходят | OK | крупный вокзал со светло-голубым остеклением и высоким объёмом |
| 101 | Sazayama Prefecture Decoration Tree Big 7 | decor | частично | подходит | лишние (-tree) | СЛОМАНО | три коротких фрагмента ствола без кроны, постройка фактически пустая |
| 102 | Sazayama Prefecture Decoration Tree Big 9 | decor | частично | подходит | подходят | мелочь | ветвящиеся голые стволы без листвы, дерево читается не целиком |
| 103 | Sazayama Prefecture Decoration Tree Cherry 1 | decor | совпадает | подходит | подходят | OK | дерево с плотной серо-зелёной кроной и стволом, форма читается |
| 104 | Sazayama Prefecture Decoration Tree Normal 7 | decor | частично | подходит | лишние (-tree) | СЛОМАНО | один тонкий столб с парой сучьев, кроны нет — постройка почти пустая |
| 105 | Sazayama Prefecture Decoration Tree Palm 2 | decor | совпадает | подходит | подходят | OK | пальма с широкой кроной голубоватого оттенка на прямом стволе |
| 106 | Shakespearean Theater Structure | public | частично | подходит | подходят | мелочь | крупное коричневое здание с подсвеченным входом, театральных признаков не видно |
| 107 | Shopping Mall Elevator with Floor Selection | commercial | частично | подходит | лишние (-shop) | мелочь | глухая серо-бежевая коробка, лифт и панель выбора этажей не различимы |
| 108 | Simple Beginner Treehouse | decor | совпадает | подходит | лишние (-hotel) | мелочь | домик в кроне дерева на зелёном участке; тег hotel картинка не подтверждает |
| 109 | Single Cart Metro Train | transport | частично | подходит | подходят | мелочь | удлинённый вагончик коричнево-жёлтых тонов, метро читается с натяжкой |
| 110 | Small Apartment Building Exterior | residential | совпадает | подходит | лишние (-shop) | мелочь | серо-белый дом с блоками голубых окон на газоне; тег shop лишний |
| 111 | Small Arabian House | residential | совпадает | подходит | лишние (-shop) | мелочь | песочный дом с плоской кровлей и тёплыми тонами, магазина не видно |
| 112 | Small Furnished Apartment Building | residential | совпадает | подходит | лишние (-shop) | мелочь | светло-серый дом с окнами и бежевой боковой стеной; тег shop лишний |
| 113 | Small Grain Elevator Structure | industrial | совпадает | подходит | лишние (-shop) | мелочь | ряд высоких вертикальных силосов, элеватор читается; тег shop лишний |
| 114 | Small Hotel With Garden | commercial | совпадает | подходит | лишние (-shop) | мелочь | здание с зелёным садом и цветными акцентами у входа; тег shop не виден |
| 115 | Small Lighthouse Tower | waterfront | совпадает | подходит | лишние (-shop) | мелочь | серый маяк на синей воде с жёлтыми огнями; тег shop лишний |
| 116 | Small Modern House | residential | совпадает | подходит | лишние (-shop) | мелочь | коричневый дом с голубыми окнами и светлой террасой; тег shop лишний |
| 117 | Small Modern Train Station | public | совпадает | подходит | лишние (-shop) | мелочь | здание с красной кровлёй и голубым остеклением — вокзал; тег shop лишний |
| 118 | Small Motorboat Vehicle | waterfront | совпадает | **не подходит**→vehicles | лишние (-shop) | РАСХОЖДЕНИЕ | коричневый катер с бледной палубой — судно, waterfront ему не подходит |
| 119 | Small Rustic Log Cabin House | residential | совпадает | подходит | лишние (-shop) | мелочь | бревенчатый дом с высокой кровлёй и зелёным участком; тег shop лишний |
| 120 | Small Single-Track Railway Bridge | bridges | совпадает | подходит | лишние (-shop) | мелочь | однопутный мост на опорах из серого камня; тег shop не подтверждается |
| 121 | Small Terraced Houses with Garage | residential | совпадает | подходит | лишние (-car -shop) | мелочь | длинный ряд красных террасных домов с гаражом на торце, ни машин, ни магазина не видно |
| 122 | Small Town Cafe Building | commercial | частично | подходит | подходят | мелочь | маленькое кубическое здание с плоской крышей и фонарём, признаков кафе нет |
| 123 | Small Wooden Boat Dock | transport | совпадает | подходит | лишние (-shop) | мелочь | деревянный причал с постройкой на синей воде, лавки в кадре нет |
| 124 | Small Yacht for One or Two | waterfront | совпадает | **не подходит**→vehicles | лишние (-shop) | РАСХОЖДЕНИЕ | судно-яхта на воде: это техника, а не набережная, и торговой палубы не видно |
| 125 | Spacious Modern Mansion | residential | частично | подходит | подходят | мелочь | крупный дом со ступенчатой серой крышей и большими окнами, стиль модерн читается неясно |
| 126 | Speedboat Vehicle | vehicles | совпадает | подходит | подходят | OK | маленький белый катер на воде, категория и теги совпадают |
| 127 | Square Earth Build | parks | совпадает | **не подходит**→decor | лишние (-park) | РАСХОЖДЕНИЕ | серый куб с рельефом поверхности: парка и зелени здесь нет, это декоративный объект |
| 128 | Starter House and Workshop | residential | совпадает | подходит | подходят | OK | деревянный дом с открытой стропильной рамой и двориком с прудом, читается |
| 129 | Stone Factory Building - 20315 Blocks | industrial | совпадает | подходит | подходят | OK | крупное серое промышленное здание-коробка с плоской крышей и входным навесом |
| 130 | Teenager Club House Design | residential | частично | подходит | подходят | мелочь | большое красное здание с широкой двускатной крышей, признаков клуба не видно |
| 131 | Terraced Wooden House | residential | частично | подходит | лишние (-car) | мелочь | деревянный комплекс с террасной застройкой и фонарями, машины во дворе нет |
| 132 | To The Moon Lighthouse House | waterfront | совпадает | подходит | подходят | OK | остров с домом, круглой башней-маяком и участком воды, всё видно |
| 133 | Town Hall Building With Road | roads | совпадает | подходит | подходят | OK | кирпичное здание ратуши, обнесённое асфальтовой дорогой-кольцом на газоне |
| 134 | Transport Van with Barrel Storage | vehicles | совпадает | подходит | подходят | OK | маленький белый фургон с бочками на кузове, размеры и категория верны |
| 135 | Tudor Blacksmith Shop | commercial | частично | подходит | подходят | мелочь | каменное строение со ступенчатой крышей и столбами, тюдоровский облик не читается |
| 136 | Tudor House with Hayloft and Stables | residential | частично | подходит | подходят | мелочь | два отдельных дома с двускатными крышами, конюшню и сенник отличить невозможно |
| 137 | Twin Towers Gate with Auto Night Protection | towers | совпадает | подходит | подходят | OK | каменные ворота с двумя зубчатыми башнями и факелами: средневековье, не реальная архитектура |
| 138 | United We Craft Server Tower | towers | совпадает | подходит | подходят | OK | высокая башня со стеклянным фасадом на подиуме, всё сходится |
| 139 | Vertical Modular Garage System | transport | частично | подходит | подходят | мелочь | чёрные перекрытия парковки и трубы, но узлы конструкции выглядят разрозненно |
| 140 | Vienna Street House 67 | roads | совпадает | **не подходит**→residential | лишние (-road -tree) | РАСХОЖДЕНИЕ | узкий многоэтажный дом с декоративным фасадом стоит на газоне: ни дороги, ни дерева нет |
| 141 | William Andrews Apartment Building | residential | совпадает | подходит | подходят | OK | светлый жилой блок с плоской крышей, остеклённой секцией и газоном |
| 142 | Wishing Well - Village Centerpiece | decor | частично | подходит | лишние (-house) | мелочь | круглая многоярусная постройка с зелёным верхом и скамьями, колодец не читается |
| 143 | Working Waterpark With Slides | commercial | не совпадает | подходит | лишние (-park) | СЛОМАНО | голый коричневый куб с сеткой окон: ни горок, ни бассейнов, постройка явно недокачана |
| 144 | Yellow and Red Lighthouse Structure | waterfront | частично | подходит | лишние (-house) | мелочь | высокий цилиндрический маяк с красной вершиной, но жёлтого цвета и дома здесь нет |
| 145 | Wooden house | residential | совпадает | подходит | подходят | OK | деревянный дом с двускатной крышей и трубой на земельном участке |
| 146 | diagonal shore port | waterfront | совпадает | подходит | подходят | OK | порт на диагональном берегу: синяя вода, деревянные причалы, краны и суда |
| 147 | Small fountain | commercial | совпадает | **не подходит**→decor | лишние (-shop) | РАСХОЖДЕНИЕ | ярусный фонтан с водой — это малая декоративная форма, а не коммерческое здание |
| 148 | Old Wooden House | residential | совпадает | подходит | подходят | OK | старый деревянный дом с каменной дорожкой и прудом на участке |
| 149 | Stonewood Bridge | bridges | совпадает | подходит | подходят | OK | каменно-деревянный мостик с перилами и опорами, всё читается |
| 150 | Cave House | residential | частично | подходит | лишние (-house) | мелочь | зелёный холм с каменным обрывом и большим деревом, жилой части снаружи не видно |
| 151 | Modern House 10 | residential | совпадает | подходит | подходят | OK | современный дом с плоской крышей и террасой на огороженном участке |
| 152 | Modern House #11 | residential | совпадает | подходит | подходят | OK | крупный бело-красный дом в стиле модерн с бассейном и изгородями |
| 153 | Stone Bridge | bridges | совпадает | подходит | подходят | OK | каменный мост с арочными опорами, название и категория верны |
| 154 | Treehouse | residential | совпадает | подходит | подходят | OK | домики с настилами на мощном дереве, всё видно |
| 155 | Teahouse | residential | частично | подходит | подходят | мелочь | длинная постройка с несколькими двускатными крышами и фонарями, чайный дом неочевиден |
| 156 | Lakehouse | residential | совпадает | подходит | не хватает (+water) | мелочь | деревянный дом стоит прямо у синего водоёма, но тега воды в списке нет |
| 157 | Tree (Lanterns) | decor | частично | подходит | подходят | мелочь | голое дерево с парой коричневых блоков вместо кроны, фонари не разобрать |
| 158 | Traditional Spruce House | residential | совпадает | подходит | лишние (-tree) | мелочь | деревянный дом с двускатной крышей на газоне, деревьев рядом нет |
| 159 | Asian 4 Storey Pagoda Nr3 | commercial | совпадает | **не подходит**→towers | лишние (-shop) | РАСХОЖДЕНИЕ | четырёхъярусная пагода с подвесными фонарями: это башня-сооружение, а не магазин |
| 160 | Rustic-Modern Home | residential | совпадает | подходит | подходят | OK | деревянный дом с патио, мебелью и ограждённым двором, стиль совпадает |
| 161 | Asian Hotel | commercial | совпадает | подходит | подходят | OK | низкий деревянный комплекс с внутренним двором, двускатными крышами и фонарями |
| 162 | Dark Oak House | residential | совпадает | подходит | подходят | OK | тёмный деревянный дом с высокой крышей и белой трубой на зелёном участке |
| 163 | Contemporary Home | residential | совпадает | подходит | подходят | OK | широкий серо-бетонный дом с большими вставками из голубого стекла, низкий |
| 164 | Modern House(Green) [Update from 2016] | residential | совпадает | подходит | подходят | OK | серый современный дом с зелёными акцентами на фасаде и высоким объёмом |
| 165 | Big spruce house | residential | совпадает | подходит | подходят | OK | деревянный дом с высокой двускатной крышей, фонарями и зелёным двором |
| 166 | Tower Gate (ZeroHero1458) | towers | частично | подходит | подходят | мелочь | узкая каменно-деревянная башня на траве, проём ворот внизу не читается |
| 167 | Spruce Village Pack - Church | residential | совпадает | **не подходит**→public | подходят | РАСХОЖДЕНИЕ | маленькая деревянная часовня с высоким шпилем; к жилым зданиям не относится |
| 168 | Big Tree [v.1.0] | decor | совпадает | подходит | подходят | OK | дерево с густой коричневой кроной на толстом стволе, листва сухая |
| 169 | Nice looking House | residential | совпадает | подходит | подходят | OK | небольшой каменный дом с деревянными деталями и окнами, аккуратный |
| 170 | Minecraft - Vet Clinic | public | совпадает | подходит | подходят | OK | серо-белое здание с витринами и синими акцентами вдоль фасада, читается |
| 171 | Big Tree | decor | совпадает | подходит | подходят | OK | высокое дерево с редкой коричневой кроной, зелени почти нет |
| 172 | Factory 2.0 | industrial | совпадает | подходит | подходят | OK | промышленный комплекс из серого камня и красного кирпича с трубами |
| 173 | Ancient oak tree | decor | совпадает | подходит | подходят | OK | облезлое дерево целиком из бруса, листвы и травы нет, ветви читаются |
| 174 | Modern house 1 | residential | совпадает | подходит | подходят | OK | низкий светло-серый дом с плоской крышей на просторном газоне |
| 175 | Modern house 2 | residential | частично | подходит | лишние (-modern) | мелочь | деревяно-серый дом на огромном газоне, признаков современного стиля мало |
| 176 | Mediterranean Style / Traditional House | residential | совпадает | подходит | подходят | OK | крупный дом со светлыми стенами, террасами и газоном вокруг |
| 177 | Modern Apartment Building / 1.6.2 | residential | совпадает | подходит | подходят | OK | высотный дом со светлым фасадом, тёмными окнами и зеленью у основания |
| 178 | Tree in Minecraft | decor | частично | подходит | лишние (-tree) | СЛОМАНО | голый ствол высотой 58 блоков без кроны и листьев — выглядит недоделкой |
| 179 | Wood Shop | commercial | совпадает | подходит | подходят | OK | крупная постройка: тёмно-серая плоская кровля и деревянный каркас сверху |
| 180 | Mansion | residential | совпадает | подходит | подходят | OK | крупный особняк с несколькими крыльями, камнем и деревом в отделке |
| 181 | Tower with clock | towers | частично | подходит | подходят | мелочь | деревянная башня на большом газоне, циферблат разглядеть не удалось |
| 182 | Spawn House | residential | совпадает | подходит | подходят | OK | маленький деревянный домик с фонарями на столбах по краям участка |
| 183 | Wood Modern House | residential | совпадает | подходит | подходят | OK | почти целиком деревянный дом с ломаной кровлей, окон немного |
| 184 | Modern Apartment Building | residential | совпадает | подходит | подходят | OK | высокий серый дом с рядами окон и балконами на зелёном участке |
| 185 | Seaside Nordic Mansion | residential | частично | подходит | подходят | мелочь | тёмный деревянный дом с серой крышей на огромном газоне, воды в кадре нет |
| 186 | Wood house | residential | частично | подходит | подходят | мелочь | каменный дом: серые стены и кровля, дерева заметно меньше, чем в имени |
| 187 | Blue Modern Tower | towers | совпадает | подходит | подходят | OK | узкая высокая башня из голубого стекла и светлого бетона, читается |
| 188 | Stylish House | residential | совпадает | подходит | подходят | OK | деревянный дом с большими окнами и панорамным остеклением фасада |
| 189 | Small pond 1 | commercial | совпадает | **не подходит**→decor | лишние (-shop) | РАСХОЖДЕНИЕ | пруд с голубой водой на газоне, торговой или магазинной застройки нет |
| 190 | Cherry Tree | decor | частично | подходит | подходят | мелочь | дерево с крупной голубовато-белой кроной, розовой вишнёвой листвы не видно |
| 191 | Stark Tower | towers | совпадает | подходит | подходят | мелочь | высокая башня из синего стекла со шпилем; в имени отсылка к Marvel |
| 192 | A Small Modern House | residential | совпадает | подходит | подходят | OK | маленький низкий дом из серого бетона с панорамным остеклением |
| 193 | Real KFC Restaurant | commercial | частично | подходит | подходят | мелочь | низкое серое здание на газоне у большого водоёма, фирменной окраски не видно |
| 194 | Starting House (Mansion) | residential | совпадает | подходит | подходят | OK | деревянный дом с высокой двускатной крышей и трубой, аккуратный |
| 195 | Simple resource warehouse | residential | совпадает | **не подходит**→industrial | подходят | РАСХОЖДЕНИЕ | деревянный сарай с пологой крышей и сеном у входа — это склад, а не жильё |
| 196 | Big minecraft modern house | residential | совпадает | подходит | подходят | OK | широкий низкий дом с плоской крышей, бассейном и большим газоном |
| 197 | Market with the villagers | residential | совпадает | **не подходит**→commercial | подходят | РАСХОЖДЕНИЕ | рыночная площадка под серым навесом с прилавками и сеном — торговля |
| 198 | Stark Tower | towers | совпадает | подходит | подходят | мелочь | та же башня из синего стекла со шпилем — вторая копия в этом батче |
| 199 | Modern Mansion | residential | совпадает | подходит | подходят | OK | огромный белый особняк с плоской крышей и большим бассейном |
| 200 | Blue Modern Tower | towers | совпадает | подходит | подходят | OK | повтор той же голубой стеклянной башни — полный дубль в батче |
| 201 | Lakehouse  | residential | совпадает | подходит | подходят | OK | деревянный дом с плоской травяной крышей у пруда, на крыше стоят деревья |
| 202 | Iron Man's Mansion | residential | совпадает | подходит | подходят | OK | огромный бело-серый особняк с изогнутыми террасами и подъездами по периметру |
| 203 | Classic Modern House | residential | совпадает | подходит | подходят | OK | современный одноэтажный дом с плоскими кровлями, внутренним двором и бассейном |
| 204 | Modern Apartment Building | residential | совпадает | подходит | подходят | OK | высотный жилой дом с балконами, деревянными панелями и остеклённым цоколем |
| 205 | Lighthouse  | residential | совпадает | **не подходит**→towers | лишние (-water) | РАСХОЖДЕНИЕ | красно-белый маяк с фонарём и куполом, к жилым домам не относится, воды в кадре нет |
| 206 |  Clock Tower | towers | совпадает | подходит | подходят | OK | башня с циферблатом, резным навершием и окнами по ярусам |
| 207 | Colonial Mansion | residential | совпадает | подходит | подходят | OK | кирпичный особняк с бассейном, подъездом и живыми изгородями |
| 208 | Small Town | commercial | не читается | подходит | подходят | СЛОМАНО | картинка не досталась |
| 209 | Skate Park | parks | совпадает | подходит | подходят | OK | бетонный скейт-парк с рампами, перилами и столбами по краю площадки |
| 210 | Factory Building | industrial | совпадает | подходит | подходят | OK | серый промышленный корпус с красными трубами и остеклёнными проходами |
| 211 | Traditional House | residential | совпадает | подходит | подходят | OK | крупный деревянный дом с террасами и белыми наличниками вдоль фасада |
| 212 | Beach House | residential | не читается | подходит | подходят | СЛОМАНО | картинка не досталась |
| 213 | Dream Survival House | residential | совпадает | подходит | подходят | OK | небольшой деревянный дом с открытой террасой и входной лестницей |
| 214 | Harbor Village | residential | совпадает | подходит | подходят | OK | деревянная гавань-деревня на воде с кораблём, каналом и сторожевыми башнями |
| 215 | Furnished Yacht  | waterfront | совпадает | **не подходит**→vehicles | подходят | РАСХОЖДЕНИЕ | многопалубная белая яхта с мостиком и антеннами: судно, а не прибрежная застройка |
| 216 | Large Yacht | waterfront | совпадает | **не подходит**→vehicles | подходят | РАСХОЖДЕНИЕ | длинное белое судно с палубами на синей воде, скорее лайнер, чем здание набережной |
| 217 | Giant Church | public | совпадает | подходит | подходят | OK | длинный серый храм с башней-колокольней, трапезной и алтарным крылом |
| 218 | Most Secured House | residential | не читается | подходит | подходят | СЛОМАНО | картинка не досталась |
| 219 | Desert City | decor | совпадает | подходит | подходят | OK | песчаный укреплённый квартал с дворами, воротами и низкими постройками |
| 220 | Skyscraper  | towers | совпадает | подходит | подходят | OK | изогнутая стеклянная башня с белыми панелями на небольшой площадке |
| 221 | Japanese Style House | residential | совпадает | подходит | подходят | OK | деревянная постройка с многоярусной пирамидальной кровлей и наличниками |
| 222 | Seaside Nordic Mansion | residential | частично | подходит | лишние (-tall) | мелочь | белый дом с чёрной кровлей и террасами, стиль читается, но этаж один и моря не видно |
| 223 | Little Shop | commercial | частично | подходит | подходят | мелочь | мелкая деревянная конструкция с открытым каркасом, скорее недострой, чем магазин |
| 224 | Apartment Building | residential | совпадает | подходит | подходят | OK | серо-белый жилой блок в форме подковы с балконами и несколькими этажами |
| 225 | Small Cozy House | residential | совпадает | подходит | лишние (-shop) | мелочь | деревянный домик с двускатной кровлей и пристройкой, торговой вывески нет |
| 226 | Assassins Creed Tower | towers | совпадает | подходит | подходят | OK | крепостная башня из серых блоков с золотыми зубцами и ярусами |
| 227 | Twins Towers Gate | towers | совпадает | подходит | подходят | OK | две небольшие башни с золотыми шпилями, соединённые воротами с аркой |
| 228 | Hollywood Hills Mansion | residential | частично | подходит | подходят | мелочь | крупное многооконное здание с жёлтыми акцентами, скорее отель, чем особняк |
| 229 | Modern Hotel | towers | совпадает | подходит | лишние (-tall) | мелочь | серое здание отеля с вывеской и входной группой, примерно шесть этажей |
| 230 | Beach Hotel | towers | совпадает | подходит | подходят | OK | красно-белая высотная башня с балконами и плоской кровлей |
| 231 | Train Station | transport | не читается | подходит | подходят | СЛОМАНО | картинка не досталась |
| 232 | Modern House on a Hilltop | residential | совпадает | подходит | подходят | OK | современный дом с террасами, выступами и пандусами на склоне холма |
| 233 | Villa | residential | не читается | подходит | подходят | СЛОМАНО | картинка не досталась |
| 234 | Resident Evil 4 Church | public | совпадает | подходит | подходят | OK | серый храм с шпилем, контрфорсами и пристройкой, у входа цветник |
| 235 | The Majestic Hotel | towers | совпадает | подходит | подходят | OK | высотная башня с венцом наверху и жёлто-красными акцентами на фасаде |
| 236 | Mansion and Place | residential | не совпадает | **не подходит**→decor | лишние (-house) | СЛОМАНО | вместо особняка — тонкая насыпь-стена в один блок с шарами по кромке, постройки нет |
| 237 | Saltillo Cathedral Tower | towers | совпадает | подходит | подходят | OK | резная соборная башня с ярусами, шпилем и позолотой наверху |
| 238 | Rustic Mansion | residential | совпадает | подходит | подходят | OK | деревянный усадебный дом с бассейном, верандой и елями вокруг участка |
| 239 | Apple Store | commercial | не читается | подходит | подходят | СЛОМАНО | картинка не досталась |
| 240 | Sydney Museum of Modern Art | public | совпадает | подходит | подходят | OK | широкий серо-жёлтый музейный комплекс с площадкой и остеклённым фасадом |
| 241 | SuperMario Parkour | parks | совпадает | подходит | лишние (-park) | мелочь | полоса паркура с пиксель-артом фигур из Марио; парковой застройки нет, только аттракционная разметка |
| 242 | Sand Palace Station | transport | частично | подходит | подходят | мелочь | длинный песочный комплекс у озера с набережной и дорогой; вокзальная функция на превью не читается |
| 243 | supreme house asian style | residential | совпадает | подходит | подходят | OK | деревянный дом в азиатском стиле с рвом и золотыми фонарями, читается |
| 244 | Modern 2 story house above small pond | residential | совпадает | подходит | лишние (-shop) | мелочь | белый двухэтажный дом у пруда с бассейном и террасой; торговой части на картинке нет |
| 245 | Rustic Small town | commercial | совпадает | подходит | подходят | OK | деревянный посёлок рядной застройки с площадью, торговые ряды вдоль улицы читаются |
| 246 | Georgian House #1 / full furnished / 1.6.4 | residential | совпадает | подходит | подходят | OK | кирпичный классический дом с бассейном, садом и подъездной дорожкой, читается |
| 247 | Modern house II | residential | совпадает | подходит | подходят | OK | современный дом со стеклянной кровлёй, перголой и открытой террасой, читается |
| 248 | Small Cozy House | residential | совпадает | подходит | лишние (-shop) | мелочь | маленький бревенчатый домик с сенными тюками; признаков торговой точки нет |
| 249 | burger shop | commercial | совпадает | подходит | подходят | OK | фастфуд с парковкой, навесом и отдельным столбом вывески, коммерческая функция читается |
| 250 | LARGE 3 story Mansion | residential | совпадает | подходит | подходят | OK | крупный трёхэтажный особняк с террасами, бассейном и подъездами, читается |
| 251 | Stark Tower | towers | частично | подходит | подходят | мелочь | стеклянная башня со скошенным фасадом; кинокомиксная отсылка есть только в имени, на картинке её нет |
| 252 | Suburban House #1 / Full Furnished / 1.7.4 | residential | совпадает | подходит | подходят | OK | пригородный участок с домом, бассейном, дорожками и деревьями, читается |
| 253 | European Mansion #1 / By Goldeneye33 | residential | совпадает | подходит | подходят | OK | большой особняк с регулярным садом, бассейном и аллеями, читается |
| 254 | Modern House [D.I.Y Interior] | residential | совпадает | подходит | подходят | OK | двухэтажный дом в стиле модерн с гаражом и террасами, читается |
| 255 | Traditional house | residential | совпадает | подходит | подходят | OK | традиционный дом с высокой двускатной кровлёй и изогнутым подъездом, читается |
| 256 | Traditional House 2 | residential | совпадает | подходит | подходят | OK | большой традиционный дом с внутренним двором и подъездной площадкой, читается |
| 257 | Traditional House #4 / by Goldeneye33 | residential | совпадает | подходит | подходят | OK | деревянный дом с прудом, террасой и деревьями участка, читается |
| 258 | Jungle Treehouse | residential | частично | подходит | подходят | мелочь | дом на крупном стволе с водопадами читается, но ярусы и листва слились в единый массив |
| 259 | Modern Burger Shop | commercial | не совпадает | **не подходит**→residential | лишние (-shop) | РАСХОЖДЕНИЕ | серо-белый многоэтажный блок с балконами и вентиляцией на кровле; магазина и витрин нет |
| 260 | Hollywood Style Mansion / by Goldeneye33 | residential | совпадает | подходит | подходят | OK | особняк с бассейном, подъездом и ровным газоном, стиль читается |
| 261 | Nordic house #2 | residential | частично | подходит | подходят | мелочь | северный дом с крутыми крышами читается, но нижняя часть выглядит разобранной или недостроенной |
| 262 | Japanese pagoda Plus Tea House | residential | частично | подходит | подходят | мелочь | многоярусная деревянная постройка с выносами ярусов и чайным домиком у основания, пагода с натяжкой |
| 263 | Futurist Modern House #2 | residential | совпадает | подходит | подходят | OK | белый футуристичный дом с бассейном и плоскими кровлями, читается |
| 264 | Plantation Mansion #1 / Architecture | residential | совпадает | подходит | подходят | OK | дом в стиле плантации с колоннадой и аллеей деревьев, читается |
| 265 | Office Building / Architecture | towers | совпадает | подходит | подходят | OK | многоэтажный офис со стеклянным фасадом и сеткой окон, читается |
| 266 | European Mansion 2 | residential | совпадает | подходит | подходят | OK | особняк с подъездом, газонами и ограждением участка, читается |
| 267 | Futurist Modern house/tower | towers | частично | **не подходит**→residential | лишние (-tower) | РАСХОЖДЕНИЕ | широкий многоуровневый модерн-дом с террасами и навесами, по массе это не башня |
| 268 | Modern House | residential | совпадает | подходит | подходят | OK | одно-двухэтажный модерн-дом из дерева и стекла на ровном участке, читается |
| 269 | Grand Central Park | parks | совпадает | подходит | лишние (-tall) | мелочь | большой парк с дорожками, площадкой и деревьями; вертикальных элементов нет, тег tall лишний |
| 270 | Modern Grand Fountain | parks | совпадает | подходит | подходят | OK | высокая колонна фонтана в круглом бассейне под навесом, читается |
| 271 | Modern/Futuristic City Building. | decor | совпадает | подходит | подходят | OK | современное здание с изогнутой кровлёй, навесом и вымощенной площадкой, городской модерн читается |
| 272 | Big tree | decor | совпадает | подходит | подходят | OK | крупное дерево без листвы с толстым стволом и ветвями, читается |
| 273 | Colonial Mansion 1 | residential | совпадает | подходит | подходят | OK | колониальный особняк с бассейном и рядами деревьев, читается |
| 274 | 35x35 Futuristic House Plot | residential | совпадает | подходит | подходят | OK | футуристичный дом на плотном участке со стеклом и террасами, читается |
| 275 | Mansion #3 | residential | совпадает | подходит | подходят | OK | огромный особняк с подъездной площадью, газонами и служебными постройками, читается |
| 276 | Twin Hotel Towers | towers | совпадает | подходит | подходят | OK | две высокие башни, соединённые переходом над водой, читается |
| 277 | Modern House | residential | совпадает | подходит | подходят | OK | модерн-дом с бассейном, мощением и деревьями на широком участке, читается |
| 278 | Luxurious Cove House | residential | совпадает | подходит | подходят | OK | дом на скалистом берегу с бухтой, террасами и деревьями, читается |
| 279 | Classic Modern House | residential | совпадает | подходит | подходят | OK | стеклянный модерн-дом с бассейном на холмистом участке, читается |
| 280 | Final House | residential | частично | подходит | подходят | СЛОМАНО | каркас дома недостроен: стены и кровля частично снесены, вокруг обломки, брёвна и голый участок |
| 281 | Traditional Mansion | residential | совпадает | подходит | подходят | OK | крупное традиционное поместье: деревянные дома, дороги, два пруда и деревья на участке |
| 282 | Modern city building | decor | совпадает | подходит | подходят | OK | высотная башня со стеклянным фасадом, вертикальной шахтой и подиумом у основания |
| 283 | Exampleton Basic Village | residential | совпадает | подходит | подходят | OK | большой участок с множеством мелких деревянных домов и дорожками между ними — посёлок |
| 284 | Modern Townhouse 2 | residential | совпадает | подходит | подходят | OK | компактный двухэтажный дом с плоскими кровлями, деревянными акцентами и остеклением |
| 285 | Modern Box house | residential | совпадает | подходит | подходят | OK | коробочный дом из белых плоских объёмов с панорамным стеклом на мощёной площадке |
| 286 | Contemporary Survival Starter House | residential | совпадает | подходит | подходят | OK | узкий тёмный дом-столб на 10x10 со светлым верхним объёмом, пропорции вытянуты вверх |
| 287 | Modern house | residential | совпадает | подходит | подходят | OK | низкий современный дом с плоскими кровлями, деревянными вставками и газоном вокруг |
| 288 | Japanese style house | residential | совпадает | подходит | подходят | OK | деревянный дом с многоярусной тёмной крышей и красными деталями на зелёном участке |
| 289 | Japanese style house (Standard) | residential | совпадает | подходит | подходят | OK | вариант того же японского дома: террасная крыша, деревянный низ, зелёный газон |
| 290 | 16x16 Modern House 1 | residential | совпадает | подходит | подходят | OK | небольшой квадратный дом с плоской кровлей, деревянными вставками и окнами на газоне |
| 291 | 16x16 Modern House 2 | residential | совпадает | подходит | подходят | OK | белый коробочный дом с большими стеклянными окнами и плоской крышей |
| 292 | 16x16 Modern House 3 | residential | совпадает | подходит | подходят | OK | дом с деревянным фасадом, выносными террасами и стеклянными балюстрадами |
| 293 | Desert city | decor | совпадает | подходит | подходят | OK | песочный город-крепость: стены с башнями по углам и плотная застройка внутри |
| 294 | Modern Mansion | residential | совпадает | подходит | подходят | OK | крупный белый особняк у дороги и водоёма, вокруг газон, деревья и подъезд |
| 295 | traditional mansion 2 | residential | совпадает | подходит | подходят | OK | большой традиционный дом с мансардными окнами, подъездной дорожкой и газоном |
| 296 | Rustic Mansion/Large House | residential | совпадает | подходит | подходят | OK | массивный деревянный дом из брёвен с высокими скатными крышами и трубой |
| 297 | Mansion | residential | совпадает | подходит | подходят | OK | крупный особняк с серыми скатными крышами, подъездом и прогулочной зоной на участке |
| 298 | Traditional mansion | residential | совпадает | подходит | подходят | OK | традиционный особняк с тёмной кровлей и подъездной дорожкой, светлый газон |
| 299 | Large modern house | residential | совпадает | подходит | подходят | OK | длинный низкий дом с террасами вдоль дороги, участок озеленён |
| 300 | Cascade City | decor | частично | подходит | подходят | мелочь | не город, а декоративная башня с круглыми каскадными площадками и растительностью |
| 301 | Modern house | residential | совпадает | подходит | подходят | OK | современный дом с плоской кровлёй, бассейном и газоном, читается |
| 302 | Modern house | residential | совпадает | подходит | подходят | OK | двухэтажный дом в бело-серой гамме с деревом, стеклом и лужайкой |
| 303 | Modern house 3 | residential | совпадает | подходит | подходят | OK | современный дом с плоскими кровлями, деревянными панелями и стеклянным ограждением |
| 304 | Futuristic house | residential | совпадает | подходит | подходят | OK | дом с плавными террасными формами на зелёном склоне, облик футуристичный |
| 305 | Iron Man's Mansion | residential | частично | подходит | подходят | мелочь | огромный белый модернистский комплекс на склоне с дорогами и кипарисами; отсылки к персонажу не видно |
| 306 | Modern mansion | residential | совпадает | подходит | подходят | OK | крупный белый особняк с изогнутыми объёмами, бассейном и газоном |
| 307 | Epich Yacht [Fully Furnished] | waterfront | совпадает | подходит | подходят | OK | большая яхта с надстройкой и мачтой на синей воде, палуба детализирована |
| 308 | Modern house | residential | совпадает | подходит | подходят | OK | современный дом серо-белой гаммы с деревянными акцентами и плоской кровлей |
| 309 | Futuristic house | residential | частично | подходит | подходят | мелочь | вилла с большим бассейном и плоскими кровлями; футуристичность на превью не читается |
| 310 | Modern house | residential | совпадает | подходит | подходят | OK | современный дом со скошенными кровлями, стеклом и газоном вокруг |
| 311 | Oakheart House II | residential | совпадает | подходит | лишние (-tree) | мелочь | деревянный дом с высокой двускатной крышей на сером основании; зелени и деревьев не видно |
| 312 | Panda express restaurant | commercial | совпадает | подходит | подходят | OK | одноэтажное коммерческое здание с вывеской на крыше и асфальтовой площадкой перед ним |
| 313 | Large traditional modern house | residential | совпадает | подходит | подходят | OK | крупный дом из белых современных объёмов с серой черепичной кровлёй и террасами |
| 314 | Town: &quot;Portland&quot; | waterfront | совпадает | подходит | подходят | OK | город на реке с водопадом, деревянной застройкой и причалами вдоль воды |
| 315 | Large modern house | residential | совпадает | подходит | подходят | OK | современный белый дом с бассейном, террасой и подъездной площадкой |
| 316 | Modern house | residential | совпадает | подходит | подходят | OK | ступенчатый дом из серо-коричневых объёмов с круглыми световодами на крыше |
| 317 | Futuristic mansion | residential | частично | подходит | подходят | мелочь | крупный особняк с двумя бассейнами и террасами; футуристичность не видна |
| 318 | Light House (with working lights) | residential | совпадает | **не подходит**→waterfront | лишние (-house) | РАСХОЖДЕНИЕ | полосатый маяк на скалистом острове в воде; к жилой застройке не относится |
| 319 | Alexandar V Luxury Yacht | waterfront | частично | подходит | подходят | мелочь | судно с палубной надстройкой на воде, но детали палубы больше похожи на спецсудно |
| 320 | Modern house | residential | совпадает | подходит | подходят | OK | длинный современный дом с плоскими кровлями, деревянной террасой и газоном |
| 321 | Small modern house | residential | совпадает | подходит | лишние (-shop) | мелочь | белый двухэтажный дом с плоской крышей и ограждённым участком, признаков магазина не видно |
| 322 | Steampunk Bridge | bridges | частично | подходит | подходят | РАСХОЖДЕНИЕ | парящие зелёные острова с деревянным переходом и свисающими столбами воды, стимпанк-механики нет |
| 323 | Large modern house | residential | совпадает | подходит | подходят | OK | длинный белый дом с бассейном на огромном газоне среди деревьев с красной листвой |
| 324 | Modern House | residential | совпадает | подходит | подходят | OK | небольшой дом с широкой серой крышей, белыми стенами и площадкой перед входом |
| 325 | Great garden detailed | parks | совпадает | подходит | подходят | OK | регулярный сад с тремя фонтанами, изгородями, дорожками и лавками, всё читается |
| 326 | Ancient lightower | towers | совпадает | подходит | подходят | OK | округлая каменная башня с голубым фонарём наверху, у основания водный круг |
| 327 | Petronas Twin Towers, Kuala Lumpur, Malaysia | towers | совпадает | подходит | подходят | OK | две симметричные башни, соединённые мостиком, с мозаичной отделкой и шпилями |
| 328 | Mall Shop | commercial | совпадает | подходит | лишние (-tall) | мелочь | широкое здание с витринами и фонарями у входа, на крыше крупная надпись; невысокое |
| 329 | Sugar can factory | industrial | совпадает | подходит | подходят | OK | прямоугольное здание с горизонтальными ярусами, голубыми стенами и жёлтой отмосткой снизу |
| 330 | Beach House | residential | совпадает | подходит | подходят | OK | деревянный дом с широкой террасой, колоннами и лестницей на приподнятом основании |
| 331 | Big treehouse | residential | совпадает | подходит | подходят | OK | большое дерево с деревянными настилами, лестницами и фонариками между ветвями |
| 332 | Mansion | residential | совпадает | подходит | подходят | OK | крупный особняк с множеством острых крыш и башенками, к нему ведёт красная дорожка |
| 333 | Great Oak Tree with Spanish Moss | decor | совпадает | подходит | подходят | OK | дерево с толстым стволом и широкой кроной из бурых блоков, свисающих прядей много |
| 334 | 1950s Moses Lake High School Building | public | совпадает | подходит | подходят | OK | протяжённый школьный корпус с крыльями и внутренним двором, рядом спортивное поле |
| 335 | 29-Story Modern Parking Garage Structure | transport | частично | подходит | лишние (-park) | мелочь | серая башня с горизонтальными рядами этажей, паркинг неочевиден; зелёного парка нет |
| 336 | 432 Park Avenue Skyscraper Replica | roads | совпадает | **не подходит**→towers | лишние (-road -park) | РАСХОЖДЕНИЕ | тонкий белый небоскрёб с сеткой окон: это башня, а не дорога; дороги и парка в кадре нет |
| 337 | A Walkable Bridge | bridges | совпадает | подходит | подходят | OK | пролёт из бруса с перилами и раскосами, по центру вниз спускается опора |
| 338 | Addexio&#8217;s Sausage Kiosk | commercial | совпадает | подходит | подходят | OK | крохотный ларёк с голубым навесом, прилавком и деревянной дверцей, компактный |
| 339 | Age of Empires Sentry Tower | towers | совпадает | подходит | подходят | OK | низкая каменная башенка с широким плоским деревянным навесом на столбах; отсылка к игре |
| 340 | AIK Bank Building | commercial | частично | подходит | лишние (-bank) | мелочь | голый бежевой куб без окон, снизу проступает вскрытый подземный уровень; вид банка нет |
| 341 | Aik House 03 Modern Residence | residential | совпадает | подходит | подходят | OK | двухэтажный дом с балконами, плоскими крышами и открытой лестницей, жилой вид |
| 342 | AIK House 16: Large Quartz City Residence | residential | частично | подходит | подходят | мелочь | трёхэтажный дом с зелёной кровлей-садом и балконами, но фасад бежевый, а не кварцевый |
| 343 | AIK Weaving Factory | industrial | частично | подходит | подходят | мелочь | здание в два яруса с деревянными навесами вместо кровли, производство не читается |
| 344 | Airport Service Truck | waterfront | совпадает | **не подходит**→vehicles | подходят | РАСХОЖДЕНИЕ | маленькая белая служебная машина с синими блоками: это транспорт, а не набережная |
| 345 | Ancient Fountain | parks | совпадает | подходит | подходят | OK | каменный фонтан с чашей и водой на зелёном газоне, ступенчатое основание |
| 346 | Ancient Greek Library Structure | public | совпадает | подходит | подходят | OK | античная колоннада с фризом и ступенчатым цоколем, крыша плоская, читается |
| 347 | Ancient Stone Archway Bridge | bridges | частично | подходит | подходят | мелочь | пролёт на столбах с голубым прозрачным настилом и деревянными элементами; каменной арки нет |
| 348 | Apartment Building Replica | residential | частично | подходит | подходят | мелочь | красный жилой блок с глухими стенами и рядом сухое дерево, ряды окон не читаются |
| 349 | Apartment Building Under Construction | residential | совпадает | подходит | подходят | OK | стройка: сетка колонн и перекрытий на пятне застройки, фасада ещё нет |
| 350 | Apartment Building With Colorful Block Design | residential | совпадает | подходит | подходят | OK | многоэтажный дом с яркой раскладкой красных, белых и синих панелей на фасаде |
| 351 | Apartment Building With Shop | residential | частично | подходит | лишние (-shop) | мелочь | узкий серый дом в четыре этажа с балконами и световым люком, входа магазина нет |
| 352 | Simple Asian Bridge | bridges | совпадает | подходит | подходят | OK | деревянный настил с перилами и частыми поперечными балками на опорах вдоль пролёта |
| 353 | Asian Hotel Building | commercial | совпадает | подходит | подходят | OK | корпус замыкает двор с бассейном, по периметру деревянные балки и колонны |
| 354 | Asian Pagoda Tower | towers | совпадает | подходит | подходят | OK | три яруса с загнутыми крышами, белые стены и золотые коньки, этажность читается |
| 355 | Automatic Nighttime Streetlight | roads | совпадает | подходит | лишние (-tree) | мелочь | серый фонарный столб с горизонтальной лампой; дерево в кадре отсутствует |
| 356 | Automotive Tuning Workshop | commercial | совпадает | подходит | подходят | OK | крупная ровная крыша на рядах столбов, снизу открытый пролёт — похож на автосервис |
| 357 | Avalon Manor House | residential | совпадает | подходит | подходят | OK | вытянутый особняк с многоярусной серой крышей и рядом окон вдоль фасада |
| 358 | Avengers Tower Build | towers | совпадает | подходит | подходят | OK | высотная башня с расширенной верхушкой и красно-белой отделкой, силуэт Мстителей |
| 359 | Average Decor House | residential | совпадает | подходит | подходят | OK | деревянный дом с крутой серой крышей, тёплым светом в окнах и гирляндами на стенах |
| 360 | Bank and Financial Building | commercial | совпадает | подходит | подходят | OK | крупное современное здание со стеклянным фасадом и лёгкой навесной крышей, офисный вид |
| 361 | Baroque Quartz Villa With Garden | residential | совпадает | подходит | подходят | OK | большая вилла с деревянной кровлей, вокруг сад, пруды и фонтанчики — сад читается |
| 362 | Basalt Block House | residential | частично | подходит | лишние (-house) | мелочь | каркас из серых блоков с балками и фонарями на пустом основании, дом не собран |
| 363 | Baseball Stadium | public | совпадает | подходит | подходят | OK | бейсбольное поле с бело-голубым ромбом и бетонными трибунами вокруг, читается |
| 364 | Basic Lighthouse Structure | residential | совпадает | **не подходит**→towers | лишние (-house) | РАСХОЖДЕНИЕ | высокий серый маяк на островке посреди воды, к жилым зданиям не относится |
| 365 | Beautiful Fountain | parks | совпадает | подходит | подходят | OK | высокий фонтан: голубой столб воды на круглой колоннаде с чашей |
| 366 | Big House 11 Modern Complex | residential | совпадает | подходит | подходят | OK | два современных корпуса со стеклом и бассейном на огороженном участке |
| 367 | Blocks Ahoy Hotel &#8211; Towering Presidential Suite | towers | совпадает | подходит | подходят | OK | высотняк с сетчатым стеклянным фасадом и остеклённой скатной кровлёй |
| 368 | Blue And White Lighthouse Structure | residential | совпадает | **не подходит**→towers | лишние (-house) | РАСХОЖДЕНИЕ | ярусная башня из восьмигранных секций наверху дымовой трубы, похожа на маяк |
| 369 | Blue-Orange Apartment Building Progress | residential | совпадает | подходит | подходят | OK | крупный строящийся каркас с рядами колонн и внутренним ядром, стадия прогресса |
| 370 | Blue Orange Apartment Building Under Construction | residential | совпадает | подходит | подходят | OK | недостроенный каркас многоэтажки на пятне застройки, названию соответствует |
| 371 | Blue Palace Furnished Residence | residential | совпадает | подходит | лишние (-tall) | мелочь | протяжённый низкий дворец с прудом и внутренним двором, этажности не видно |
| 372 | Building Contractors Office | towers | частично | **не подходит**→commercial | лишние (-office) | РАСХОЖДЕНИЕ | участок подрядчика: несколько низких построек и опоры, ни башни ни офиса не видно |
| 373 | Candy Cane Road Light | roads | совпадает | подходит | подходят | OK | голубая арка-фонарь в форме леденца, отдельно стоящая компактная деталь |
| 374 | Central Fountain Maze Schematic | parks | совпадает | подходит | подходят | OK | зелёный лабиринт из невысоких изгородей с круглым фонтаном в центре |
| 375 | Ceramic Production Factory | industrial | совпадает | подходит | подходят | OK | кирпичный завод с высокой трубой, утиными трубами и волнистой кровлёй цеха |
| 376 | Charming Cottage with Living Area and Garage | commercial | совпадает | **не подходит**→residential | подходят | РАСХОЖДЕНИЕ | длинный красный дом с двускатной серой кровлёй на газоне — это коттедж |
| 377 | Charming Small House Shop | residential | частично | подходит | подходят | мелочь | длинное низкое строение с полосатой кровлёй, и «маленький», и «магазин» не видны |
| 378 | Chest-Shaped Storage Warehouse | residential | совпадает | **не подходит**→industrial | лишние (-house) | РАСХОЖДЕНИЕ | гигантский сундук-хранилище на газоне, это склад, а не жилой дом |
| 379 | Chest Shop Galleria | commercial | совпадает | подходит | подходят | OK | красный сундук-магазин с рёбрами и замочной скважиной, форма читается |
| 380 | Chiseled Stone Brick Bridge | bridges | совпадает | подходит | подходят | OK | длинный арочный мост из каменной кладки с фонарями по обоим краям |
| 381 | Chrysler Building Skyscraper | towers | совпадает | подходит | подходят | OK | небоскрёб в стиле ар-деко со ступенчатыми верхами и тонким шпилем |
| 382 | City 17 Style Apartment Block | residential | совпадает | подходит | подходят | мелочь | строгий бетонный блок с плоской кровлёй, отсылка к вымышленному городу из игры |
| 383 | City Hall Building | decor | совпадает | **не подходит**→public | подходят | РАСХОЖДЕНИЕ | ратуша с колоннадой и парадной лестницей на газоне — общественное здание, не декор |
| 384 | City Hotel With Penthouses | towers | совпадает | **не подходит**→commercial | подходят | РАСХОЖДЕНИЕ | широкий отель на шесть-семь этажей с балконами и навесом, башня это не башня |
| 385 | City Intersection Crossroads | intersections | совпадает | подходит | подходят | OK | перекрёсток из брусчатки с пешеходными переходами и фонарями на углах |
| 386 | City Library Building | public | совпадает | подходит | подходят | OK | современное низкое здание со светлым фасадом и остеклением на газоне с деревьями |
| 387 | City Park Garden | parks | совпадает | подходит | подходят | OK | огороженный сад с дорожками, стрижеными деревьями, изгородями и прудиком |
| 388 | City Road Construction Project | roads | совпадает | подходит | подходят | OK | дорожная сетка с перекрёстками, газонными разделителями и красно-белыми ограждениями |
| 389 | Classic Lighthouse Tower | towers | совпадает | подходит | лишние (-house) | мелочь | каменный маяк с фонарной камерой сверху, дома у основания не видно |
| 390 | Classic Minecraft Lighthouse Decoration | residential | совпадает | **не подходит**→towers | лишние (-house) | РАСХОЖДЕНИЕ | серый маяк с расширенным основанием и деревянной площадкой сверху, дома нет |
| 391 | Classic Museum Building Berlin | public | совпадает | подходит | лишние (-tall) | мелочь | огромное классическое музейное здание с колоннадой и внутренним двором, оно низкое |
| 392 | Classic School Bus Design | public | совпадает | **не подходит**→vehicles | подходят | РАСХОЖДЕНИЕ | жёлтый школьный автобус на асфальтовой площадке, здания здесь нет |
| 393 | Classic Train Station Design | transport | совпадает | подходит | подходят | OK | зал станции с арочными перекрытиями и красными вертикальными лентами на фасаде |
| 394 | Coastal Lighthouse &#8211; Polished Andesite &amp; Stone Bricks | residential | совпадает | **не подходит**→towers | подходят | РАСХОЖДЕНИЕ | высокий серый маяк на синей воде с маленьким домиком рядом, категория не жилая |
| 395 | Coastal Lighthouse Structure | residential | частично | **не подходит**→towers | лишние (-water) | РАСХОЖДЕНИЕ | многоярусная башенка с деревянными кровлями на траве, берега и воды не видно |
| 396 | Coastal Lighthouse Tower | towers | совпадает | подходит | лишние (-house) | мелочь | белая спиральная башня маяка с фонарём наверху, дома у основания нет |
| 397 | Cobblestone House Design | residential | частично | подходит | подходят | мелочь | широкое шестиугольное строение с коричневой кровлёй, обычный дом не читается |
| 398 | Communist Apartment Block | residential | совпадает | подходит | подходят | OK | длинный краснокирпичный жилой дом со множеством окон, типичный блочный |
| 399 | Compact Football Stadium | public | совпадает | подходит | подходят | OK | стадион с зелёным полем и трибунами по периметру бетонной коробки |
| 400 | Compact Highway Gas Station | roads | совпадает | **не подходит**→commercial | подходят | РАСХОЖДЕНИЕ | заправка у трассы с навесом и площадкой — это коммерция, а не дорожная постройка |
| 401 | Compact Hospital Structure | public | — | — | — | missing |  |
| 402 | Compact Quartz Modern House | residential | — | — | — | missing |  |
| 403 | Compact Two-Story Office Building | towers | — | — | — | missing |  |
| 404 | Compressed Cobblestone Factory | industrial | — | — | — | missing |  |
| 405 | Concrete Factory Structure | industrial | — | — | — | missing |  |
| 406 | Concrete Warehouse Structure | residential | — | — | — | missing |  |
| 407 | Large Corporate Office Building | towers | — | — | — | missing |  |
| 408 | Corporate Office Building | towers | — | — | — | missing |  |
| 409 | Country Library Building | public | — | — | — | missing |  |
| 410 | Covered Minecraft Bridge | bridges | — | — | — | missing |  |
| 411 | Cozy Medium House With Garden | residential | — | — | — | missing |  |
| 412 | Cozy Small Hotel Building | towers | — | — | — | missing |  |
| 413 | Cozy Small House with Attic and Basement | residential | — | — | — | missing |  |
| 414 | Cyan Tower Build | towers | — | — | — | missing |  |
| 415 | Dark Luminous Night Tower | towers | — | — | — | missing |  |
| 416 | Desert Sand Tower | towers | — | — | — | missing |  |
| 417 | Dirt Church Structure | public | — | — | — | missing |  |
| 418 | Doughnut Shop Building | commercial | — | — | — | missing |  |
| 419 | Dreamy Fountain Build | parks | — | — | — | missing |  |
| 420 | Early 20th Century Schoolhouse | residential | — | — | — | missing |  |
| 421 | Early American Library Building | public | — | — | — | missing |  |
| 422 | Eight Story Hotel | towers | — | — | — | missing |  |
| 423 | Eldorado House Lakeside Residence | residential | — | — | — | missing |  |
| 424 | Eldwyn Library Structure | public | — | — | — | missing |  |
| 425 | Elegant City Hall For Small Towns | commercial | — | — | — | missing |  |
| 426 | Elegant Grand Hotel | towers | — | — | — | missing |  |
| 427 | Elegant Hotel With Bar And Dining | commercial | — | — | — | missing |  |
| 428 | Elegant Marble Bridge Design | bridges | — | — | — | missing |  |
| 429 | Elegant Modern Office Tower | towers | — | — | — | missing |  |
| 430 | Elegant Quartz Fountain | parks | — | — | — | missing |  |
| 431 | Elegant Quartz Water Fountain | parks | — | — | — | missing |  |
| 432 | Elementary School Building | public | — | — | — | missing |  |
| 433 | Elevated Metro Station Building | transport | — | — | — | missing |  |
| 434 | Elevated Metro Station Exterior | transport | — | — | — | missing |  |
| 435 | Elevated Metro Station With Side Platform | transport | — | — | — | missing |  |
| 436 | Elevated Railway Station | transport | — | — | — | missing |  |
| 437 | Emerald Skyscraper Tower | towers | — | — | — | missing |  |
| 438 | EssentialsX Shop Setup | commercial | — | — | — | missing |  |
| 439 | Factory Hall 2.0 | industrial | — | — | — | missing |  |
| 440 | Fallout 3 Inspired Overpass Ramp | bridges | — | — | — | missing |  |
| 441 | Fallout 3 Inspired Substation | transport | — | — | — | missing |  |
| 442 | Fallout 3 Player Shack House | residential | — | — | — | missing |  |
| 443 | Fallout 3 Power Transmission Tower | towers | — | — | — | missing |  |
| 444 | Fallout 3 Rubble House | residential | — | — | — | missing |  |
| 445 | Fallout 3 Springvale School Building | public | — | — | — | missing |  |
| 446 | Fallout 3 Style Overpass Structure | bridges | — | — | — | missing |  |
| 447 | Fallout 3 Style Overpass | bridges | — | — | — | missing |  |
| 448 | Fallout 3 Style Power Station | transport | — | — | — | missing |  |
| 449 | Fallout 3 Water Tower Structure | towers | — | — | — | missing |  |
| 450 | Fire Truck Vehicle | public | — | — | — | missing |  |
| 451 | Functional Lighthouse | residential | — | — | — | missing |  |
| 452 | Functional Train Station | transport | — | — | — | missing |  |
| 453 | Furnished Bank Building | commercial | — | — | — | missing |  |
| 454 | Furnished Family Home with Garage | commercial | — | — | — | missing |  |
| 455 | Futuristic City Parking Lot | transport | — | — | — | missing |  |
| 456 | Futuristic Marble Bridge | bridges | — | — | — | missing |  |
| 457 | Futuristic Stadium Angle Section | public | — | — | — | missing |  |
| 458 | Futuristic Stadium Panel | public | — | — | — | missing |  |
| 459 | Futuristic Stadium Wall Section | public | — | — | — | missing |  |
| 460 | Futuristic Station for Vehicles | transport | — | — | — | missing |  |
| 461 | Garden Fountain Design | parks | — | — | — | missing |  |
| 462 | Garden Fountain Structure | parks | — | — | — | missing |  |
| 463 | Geologic Museum Minecraft Build | public | — | — | — | missing |  |
| 464 | Gingerbread Factory | industrial | — | — | — | missing |  |
| 465 | Glass Factory Build | industrial | — | — | — | missing |  |
| 466 | Gold Smelting Factory | industrial | — | — | — | missing |  |
| 467 | Gothic Church Minecraft Structure | public | — | — | — | missing |  |
| 468 | Grand Central Park &#8211; Large Town Square | public | — | — | — | missing |  |
| 469 | Grand Hotel Seventh Heaven | towers | — | — | — | missing |  |
| 470 | Grandpa&#8217;s Flower Power Tower with Garden | towers | — | — | — | missing |  |
| 471 | Gray Tower Structure | towers | — | — | — | missing |  |
| 472 | Guadalupe River Bridge | bridges | — | — | — | missing |  |
| 473 | Hamburg Michel Church Structure | public | — | — | — | missing |  |
| 474 | Hanging Gardens of Brisbane | parks | — | — | — | missing |  |
| 475 | Harbour Shops | commercial | — | — | — | missing |  |
| 476 | Hidden Wooden House | residential | — | — | — | missing |  |
| 477 | Highway Exit Structure | roads | — | — | — | missing |  |
| 478 | Highway Section with Lighting and Signs | roads | — | — | — | missing |  |
| 479 | Highway Toll Booth Structure | roads | — | — | — | missing |  |
| 480 | Home and Workshop Building | commercial | — | — | — | missing |  |
| 481 | Small Hilton Hotel Build | towers | — | — | — | missing |  |
| 482 | Hotel Honk House | towers | — | — | — | missing |  |
| 483 | Hotel Opal Seaside Resort | towers | — | — | — | missing |  |
| 484 | Hotel Weiss V2 | towers | — | — | — | missing |  |
| 485 | Immersive Railroading Bridge | roads | — | — | — | missing |  |
| 486 | Immersive Railroading Roundhouse Structure | roads | — | — | — | missing |  |
| 487 | Immersive Railroading Steamworks Station | roads | — | — | — | missing |  |
| 488 | Improved Warehouse Storage Structure | residential | — | — | — | missing |  |
| 489 | Indian Style Jade Mansion Tower | towers | — | — | — | missing |  |
| 490 | Integral Bridge Structure | bridges | — | — | — | missing |  |
| 491 | Island House Lakefront | residential | — | — | — | missing |  |
| 492 | Item Storage Warehouse | residential | — | — | — | missing |  |
| 493 | Japanese Tower Style Asian Structure | towers | — | — | — | missing |  |
| 494 | Jive 49 Modern Condominium Tower | towers | — | — | — | missing |  |
| 495 | Jungle Spawn Bridge | bridges | — | — | — | missing |  |
| 496 | Keralis Style Giant Mansion | residential | — | — | — | missing |  |
| 497 | Kingdom Banker Shop House | residential | — | — | — | missing |  |
| 498 | Kokotoni&#8217;s Furnished Tower | towers | — | — | — | missing |  |
| 499 | Lapis and Pickaxe Shop &#8211; Medium House | residential | — | — | — | missing |  |
| 500 | Large Car Park | parks | — | — | — | missing |  |
| 501 | Large House and Shop Building | residential | — | — | — | missing |  |
| 502 | Large Modern Hotel &#8211; Jungle Planks | commercial | — | — | — | missing |  |
| 503 | Large Ranch Style Minimalist House | residential | — | — | — | missing |  |
| 504 | Large Server Warehouse | residential | — | — | — | missing |  |
| 505 | Large Smithy Workshop | commercial | — | — | — | missing |  |
| 506 | Large Stone Brick Bridge | bridges | — | — | — | missing |  |
| 507 | Large Stone Bridge With Buildings | bridges | — | — | — | missing |  |
| 508 | Large Stone Tower | towers | — | — | — | missing |  |
| 509 | Large Survival Mansion House | residential | — | — | — | missing |  |
| 510 | Lava Hotel Resort | towers | — | — | — | missing |  |
| 511 | Leniland Office Building | towers | — | — | — | missing |  |
| 512 | Light Rail Transit Station | transport | — | — | — | missing |  |
| 513 | Lucava&#8217;s Tower | towers | — | — | — | missing |  |
| 514 | Luxury Mansion With Party Room | residential | — | — | — | missing |  |
| 515 | Luxury Palace Tower With Elevator | towers | — | — | — | missing |  |
| 516 | Luxury Studio Apartment | residential | — | — | — | missing |  |
| 517 | Luxury Villa with Courtyard and Pool | residential | — | — | — | missing |  |
| 518 | Majestic Fountain Structure | parks | — | — | — | missing |  |
| 519 | Market Stall | commercial | — | — | — | missing |  |
| 520 | Massive Lava Tunnel With Minecart Track | bridges | — | — | — | missing |  |
| 521 | Massive Minecraft Bridge | bridges | совпадает | подходит | подходят | OK | каменный мост на массивных опорах с перилами и дорогой сверху, читается |
| 522 | Massive Skyscraper Structure | towers | частично | подходит | подходят | мелочь | тонкая глухая башня с длинным шпилем, мощного небоскрёба с окнами не видно |
| 523 | Massive Storage Warehouse Structure | residential | совпадает | **не подходит**→industrial | лишние (-house) | РАСХОЖДЕНИЕ | длинный склад с открытым каркасом кровли, к жилой застройке не относится |
| 524 | Maximum Height Tower | towers | совпадает | подходит | подходят | OK | гладкая высокая башня без окон со ступенью на макушке, всё сходится |
| 525 | McCready Grocery Store | commercial | совпадает | подходит | подходят | OK | крупное плоское здание магазина с большой парковкой и машинами у въезда |
| 526 | McFey Astroworld Amusement Park | parks | частично | подходит | лишние (-park) | мелочь | одиночная аттракционная конструкство вертикальной формы, территории парка нет |
| 527 | Mediterranean Plaza Build | public | совпадает | подходит | подходят | OK | вымощенная площадь с газонами, деревьями и рядами фонарей-колонн |
| 528 | Mediterranean Style Apartment House | residential | совпадает | подходит | подходят | OK | многоэтажный дом с балконами и верхними террасами, категория верна |
| 529 | Mediterranean Style Shopping Center | commercial | совпадает | подходит | подходят | OK | комплекс корпусов с навесами-перголами и внутренним двором, читается |
| 530 | Medium Mansion With Bridge | bridges | совпадает | **не подходит**→residential | подходят | РАСХОЖДЕНИЕ | особняк на скале с ручьём: мостик там крошечный, основной объём — жилой дом |
| 531 | Medium Merchant&#8217;s House | residential | совпадает | подходит | подходят | OK | деревянный дом с высокой двускатной крышей и трубой, всё как в имени |
| 532 | Medium Orange Warehouse | residential | частично | **не подходит**→industrial | лишние (-house) | РАСХОЖДЕНИЕ | серо-белый склад со световыми окнами, оранжевого цвета нет и это не жильё |
| 533 | Medium Wooden Bridge Design | bridges | частично | подходит | подходят | мелочь | пролёт между бетонными опорами с синей полосой настила, дерево не читается |
| 534 | Metro City Spawn | transport | совпадает | **не подходит**→public | подходят | РАСХОЖДЕНИЕ | городская площадь с фонтаном, деревьями и двумя башнями, транспортной инфраструктуры нет |
| 535 | Metro Train Pass | transport | частично | подходит | подходят | мелочь | мелкий серый бокс с проёмом и панелью, похож на будку, назначение неясно |
| 536 | Metro Train Station | transport | совпадает | подходит | подходят | OK | длинная платформа с красными составами и фонарями, станция видна |
| 537 | Mid-Century Hotel | towers | совпадает | подходит | подходят | OK | стеклянная башня с просматриваемыми этажами и колоннами, форма подходит |
| 538 | MineBank Building | commercial | совпадает | подходит | подходят | OK | высокий деловой корпус с рядами окон и оборудованием на кровле |
| 539 | Minecraft Build Book House | residential | совпадает | подходит | подходят | OK | земельный участок с двухэтажным домом и большим бассейном, жильё видно |
| 540 | Minecraft Casino Mansion Structure | residential | совпадает | **не подходит**→commercial | подходят | РАСХОЖДЕНИЕ | крупное здание с гигантским колесом на кровле — это казино, а не жилой дом |
| 541 | Minecraft Gas Station Build | commercial | совпадает | подходит | подходят | OK | красное здание и отдельный навес на столбах, характерный для заправки |
| 542 | Minecraft Hospital Building | public | совпадает | подходит | подходят | OK | высотный корпус со стеклом и плоской синей кровлей под вертолётную площадку |
| 543 | Minecraft Railway Station | transport | частично | подходит | подходят | мелочь | низкое серое здание с красными блоками, рельсов и платформы не видно |
| 544 | Minecraft Soccer Stadium Schematic | public | совпадает | подходит | подходят | OK | стадион с зелёным полем, трибунами и фигурками игроков на площадке |
| 545 | Minecraftia Elementary School Blue and White Campus | public | совпадает | подходит | подходят | OK | крупный сине-белый учебный корпус с внутренним двором и двумя крыльями |
| 546 | Mini Shop Blockhouse | residential | совпадает | **не подходит**→commercial | лишние (-house) | РАСХОЖДЕНИЕ | крохотная будка с прилавком — это ларёк, а не жилой дом |
| 547 | Modern 3 Story Office Building | towers | совпадает | **не подходит**→commercial | подходят | РАСХОЖДЕНИЕ | низкое трёхэтажное здание с террасой на кровле, к башням не относится |
| 548 | Modern Apartment Block Townhouse | residential | совпадает | подходит | подходят | OK | два корпуса с балконами и зелёными кровлями-садами, жилой комплекс |
| 549 | Modern Apartment Block &#8211; White Concrete | residential | совпадает | подходит | подходят | OK | серо-белый жилой дом с балконами и глухим торцом, всё сходится |
| 550 | Modern Apartment Tower &#8211; White &amp; Blue Concrete | towers | совпадает | подходит | подходят | OK | семиэтажка с выносными балконами и остеклёнными проходами, читается |
| 551 | Modern Apartment Building With 6 Units | residential | частично | подходит | лишние (-apartment) | СЛОМАНО | плиты и стены висят в воздухе с разрывами, цельный жилой объём не собран |
| 552 | Modern Apartment Complex | residential | совпадает | подходит | подходят | OK | три длинных пятиэтажных дома в ряд на общей площадке, комплекс виден |
| 553 | Modern Apartment Tower &#8211; 10 Floors | towers | совпадает | подходит | подходят | OK | стройная башня примерно на десять этажей с балконами по периметру |
| 554 | Modern Blue Apartment Building Schematic | residential | частично | подходит | подходят | мелочь | корпус в коричневой отделке, синими остеклены только балконы |
| 555 | Modern Blue Glass Tower | towers | частично | подходит | подходят | мелочь | башня с диагональными панелями: синее стекло соседствует с оранжевым |
| 556 | Modern Bridge Design | bridges | совпадает | подходит | подходят | OK | узкий настил между двух опор с рядами столбов-фонарей и синей полосой по центру |
| 557 | Modern Business Building | transport | совпадает | **не подходит**→commercial | подходят | РАСХОЖДЕНИЕ | низкое остеклённое здание офисного вида, к транспорту отношения не имеет |
| 558 | Modern City Apartment Building | residential | частично | подходит | подходят | мелочь | крупный серый блок с рядами окон, щитом на фасаде и округлым объёмом на кровле |
| 559 | Modern City Apartments | residential | совпадает | подходит | подходят | OK | многоэтажка с белыми перекрытиями, глухим ядром и оборудованием на кровле |
| 560 | Modern City Connecting Bridge | bridges | совпадает | подходит | подходят | OK | подвесной мост с двумя пилонами и канатами над синей водой, читается |
| 561 | Modern City Hotel Building | towers | — | — | — | missing |  |
| 562 | Modern City Intersection Road | intersections | — | — | — | missing |  |
| 563 | Modern City Skyscraper | towers | — | — | — | missing |  |
| 564 | Modern Coffee Shop | commercial | — | — | — | missing |  |
| 565 | Modern Concrete Park | parks | — | — | — | missing |  |
| 566 | Modern Cyan Terracotta House | residential | — | — | — | missing |  |
| 567 | Modern Decorated Tower | towers | — | — | — | missing |  |
| 568 | Modern Diamond Skyscraper | towers | — | — | — | missing |  |
| 569 | Modern Eco Skyscraper | towers | — | — | — | missing |  |
| 570 | Modern Food Shop | commercial | — | — | — | missing |  |
| 571 | Modern Fountain Design | parks | — | — | — | missing |  |
| 572 | Modern Four-Story Hotel | towers | — | — | — | missing |  |
| 573 | Modern Four Story Shopping Mall With Roads | roads | — | — | — | missing |  |
| 574 | Modern Gas Station And Shop | commercial | — | — | — | missing |  |
| 575 | Modern Gas Station Exterior | commercial | — | — | — | missing |  |
| 576 | Modern Gas Station &amp; Truck Stop | commercial | — | — | — | missing |  |
| 577 | Modern Gas Station With Store | commercial | — | — | — | missing |  |
| 578 | Modern Glass Office Tower Building | towers | — | — | — | missing |  |
| 579 | Modern Grand Fountain &#8211; Medium Garden | parks | — | — | — | missing |  |
| 580 | Modern Hotel Building | towers | — | — | — | missing |  |
| 581 | Modern House Design With Library | residential | — | — | — | missing |  |
| 582 | Modern Lakehouse Mansion | residential | — | — | — | missing |  |
| 583 | Modern Library Design | public | — | — | — | missing |  |
| 584 | Modern Library House | residential | — | — | — | missing |  |
| 585 | Modern Luxury Residence | residential | — | — | — | missing |  |
| 586 | Modern Office Building Sketch | towers | — | — | — | missing |  |
| 587 | Modern Office Tower Building | towers | — | — | — | missing |  |
| 588 | Modern Office Tower with Elevator | towers | — | — | — | missing |  |
| 589 | Modern Office Tower | towers | — | — | — | missing |  |
| 590 | Modern Parallel Heights Hotel Building | commercial | — | — | — | missing |  |
| 591 | Modern Park with Fountain and Benches | parks | — | — | — | missing |  |
| 592 | Modern Parking Garage Structure | transport | — | — | — | missing |  |
| 593 | Modern Police Station Building | public | — | — | — | missing |  |
| 594 | Modern Police Station Design | public | — | — | — | missing |  |
| 595 | Modern Quartz City Tower | towers | — | — | — | missing |  |
| 596 | Modern Quartz House With Birch Accents | residential | — | — | — | missing |  |
| 597 | Modern Quartz Reserve Bank | commercial | — | — | — | missing |  |
| 598 | Modern Quartz Skyscraper Tower | towers | — | — | — | missing |  |
| 599 | Modern School Building | public | — | — | — | missing |  |
| 600 | Modern Skyscraper Build | towers | — | — | — | missing |  |
| 601 | Modern Skyscraper Design | towers | — | — | — | missing |  |
| 602 | Modern Skyscraper Tower | towers | — | — | — | missing |  |
| 603 | Modern Skyscraper Tower | towers | — | — | — | missing |  |
| 604 | Modern Skyscraper | towers | — | — | — | missing |  |
| 605 | Modern Small to Medium Futuristic House | residential | — | — | — | missing |  |
| 606 | Modern Spiral Skyscraper | towers | — | — | — | missing |  |
| 607 | Modern Style Shop | commercial | — | — | — | missing |  |
| 608 | Modern Style Tower Structure | towers | — | — | — | missing |  |
| 609 | Modern Torch Towers | towers | — | — | — | missing |  |
| 610 | Modern Train Station Design | transport | — | — | — | missing |  |
| 611 | Modern Villa With Survival Features | residential | — | — | — | missing |  |
| 612 | Modern Warehouse with Iron Gate Details | residential | — | — | — | missing |  |
| 613 | Modern White City Apartment Building | residential | — | — | — | missing |  |
| 614 | Mr. Burns Small Structure | commercial | — | — | — | missing |  |
| 615 | Mud Tower Build | towers | — | — | — | missing |  |
| 616 | Multi-Level 6-Story Parking Lot | transport | — | — | — | missing |  |
| 617 | Multi-Level Parking Garage Structure | transport | — | — | — | missing |  |
| 618 | Multiplayer Survival Base with Shop | commercial | — | — | — | missing |  |
| 619 | Murchinson Modern Office Building With Helipad | towers | — | — | — | missing |  |
| 620 | Mystcraft-Inspired Library Structure | public | — | — | — | missing |  |
| 621 | Mystical Church Structure | public | — | — | — | missing |  |
| 622 | Mythological Shopping Mall with Water Features | commercial | — | — | — | missing |  |
| 623 | Nierta Central Park Town Square | public | — | — | — | missing |  |
| 624 | Nine-Story Apartment Building Series | residential | — | — | — | missing |  |
| 625 | Nordic Style Small Bridge | bridges | — | — | — | missing |  |
| 626 | Octagonal Hotel Interior Design | towers | — | — | — | missing |  |
| 627 | Old Church Structure | public | — | — | — | missing |  |
| 628 | Old Factory Hall Building | industrial | — | — | — | missing |  |
| 629 | OlimpusHD Tower &#8211; Large Build | towers | — | — | — | missing |  |
| 630 | Olympus Tower &#8211; Large Build | towers | — | — | — | missing |  |
| 631 | One World Trade Centre Skyscraper | towers | — | — | — | missing |  |
| 632 | Orange Tower &#8211; Large Scale Block Structure | towers | — | — | — | missing |  |
| 633 | Orbital Station | transport | — | — | — | missing |  |
| 634 | Ornamental Garden Fountain | parks | — | — | — | missing |  |
| 635 | Peaceful Fountain | parks | — | — | — | missing |  |
| 636 | Peaceful Minecraft Garden Oasis Build | parks | — | — | — | missing |  |
| 637 | Pet Shop Building | commercial | — | — | — | missing |  |
| 638 | Platinum Residential Tower with Antenna | towers | — | — | — | missing |  |
| 639 | Police Car Vehicle | public | — | — | — | missing |  |
| 640 | Police Vehicle | public | — | — | — | missing |  |
| 641 | Portuguese Style House | residential | — | — | — | missing |  |
| 642 | Prismarine Island Tower | towers | — | — | — | missing |  |
| 643 | Quad Steam Turbine Warehouse | residential | — | — | — | missing |  |
| 644 | Quaint Library Structure | public | — | — | — | missing |  |
| 645 | Quartz Pool Garden Feature | parks | — | — | — | missing |  |
| 646 | Quartz Spruce Small House | residential | — | — | — | missing |  |
| 647 | QuickDeli Cargo Services Warehouse and Office | towers | — | — | — | missing |  |
| 648 | Railway Station Building | transport | — | — | — | missing |  |
| 649 | Rainbow Lighthouse | residential | — | — | — | missing |  |
| 650 | Red Bureaucratic Office Building | towers | — | — | — | missing |  |
| 651 | Renaissance Church Structure | public | — | — | — | missing |  |
| 652 | River Crossing Bridge | bridges | — | — | — | missing |  |
| 653 | Rivertown Library Structure | public | — | — | — | missing |  |
| 654 | Rustic Cottage House | residential | — | — | — | missing |  |
| 655 | Rustic Furnished Wooden House | residential | — | — | — | missing |  |
| 656 | Rustic Modern House with Pool and Barn | residential | — | — | — | missing |  |
| 657 | Rustic Stone Bridge | bridges | — | — | — | missing |  |
| 658 | Rustic Wood Tower Build | towers | — | — | — | missing |  |
| 659 | Rustic Wooden Shop &#8211; Medium Size | commercial | — | — | — | missing |  |
| 660 | Sam and Taurtis&#8217; Roleplay House | residential | — | — | — | missing |  |
| 661 | Sand Palace Station | transport | — | — | — | missing |  |
| 662 | Sandstone Hotel | towers | — | — | — | missing |  |
| 663 | Sandstone Office Tower &#8211; 126k Blocks | towers | — | — | — | missing |  |
| 664 | Scalable Long Bridge | bridges | — | — | — | missing |  |
| 665 | Seaside Lighthouse Tower | towers | — | — | — | missing |  |
| 666 | Seaside Multi-Story House | residential | — | — | — | missing |  |
| 667 | Secluded Cove House With Shops | residential | — | — | — | missing |  |
| 668 | Shady Oaks Hotel Townhouse | commercial | — | — | — | missing |  |
| 669 | Shard Tower &#8211; Tall Unfurnished Structure | towers | — | — | — | missing |  |
| 670 | Shop House Building | residential | — | — | — | missing |  |
| 671 | Shop House for Sale | residential | — | — | — | missing |  |
| 672 | Shop or House Design | residential | — | — | — | missing |  |
| 673 | Simple Defense Tower | towers | — | — | — | missing |  |
| 674 | Simple Factory Shed | industrial | — | — | — | missing |  |
| 675 | Simple Minecraft Church Building | public | — | — | — | missing |  |
| 676 | Simple Small House | residential | — | — | — | missing |  |
| 677 | Simple Stone Bridge | bridges | — | — | — | missing |  |
| 678 | Simple Stone River Bridge | bridges | — | — | — | missing |  |
| 679 | Simple Train Station | transport | — | — | — | missing |  |
| 680 | Simple Yellow House | residential | — | — | — | missing |  |
| 681 | Six Lane Highway | roads | — | — | — | missing |  |
| 682 | Six Story Hotel With Furnished Rooms | towers | — | — | — | missing |  |
| 683 | Six Story Parking Garage | transport | — | — | — | missing |  |
| 684 | Skyscraper City Building | towers | — | — | — | missing |  |
| 685 | Iron Quartz Skyscraper Near Build Limit | towers | — | — | — | missing |  |
| 686 | Small Apartment Building | residential | — | — | — | missing |  |
| 687 | Small Asian Style House | residential | — | — | — | missing |  |
| 688 | Small Carwash Station | commercial | — | — | — | missing |  |
| 689 | Small Chapel Structure | commercial | — | — | — | missing |  |
| 690 | Small Church | commercial | — | — | — | missing |  |
| 691 | Small Concrete Bus Stop Schematic | commercial | — | — | — | missing |  |
| 692 | Small Desert Cactus Fountain | commercial | — | — | — | missing |  |
| 693 | Small Double Modern Church With Interior | commercial | — | — | — | missing |  |
| 694 | Small Driving School | commercial | — | — | — | missing |  |
| 695 | Small Faction Base for Hardcore Players | commercial | — | — | — | missing |  |
| 696 | Small Factory Shell Template | commercial | — | — | — | missing |  |
| 697 | Small Fancy Wooden House | residential | — | — | — | missing |  |
| 698 | Small Garden Fountain | commercial | — | — | — | missing |  |
| 699 | Small House with Garden Path | residential | — | — | — | missing |  |
| 700 | Small Minecraft Church Building | commercial | — | — | — | missing |  |
| 701 | Small Miscellaneous Structure | commercial | — | — | — | missing |  |
| 702 | Small Office Building | towers | — | — | — | missing |  |
| 703 | Small Open Cafe Design | commercial | — | — | — | missing |  |
| 704 | Small Police Car Schematic | commercial | — | — | — | missing |  |
| 705 | Small Schoolhouse With Blackboard | residential | — | — | — | missing |  |
| 706 | Small Shop Building | commercial | — | — | — | missing |  |
| 707 | Small Shopping Mall | commercial | — | — | — | missing |  |
| 708 | Small Skybridge Design | bridges | — | — | — | missing |  |
| 709 | Small Spade Shop | commercial | — | — | — | missing |  |
| 710 | Small Terracotta Vase Decoration | commercial | — | — | — | missing |  |
| 711 | Small Underground Faction Shop | commercial | — | — | — | missing |  |
| 712 | Small Waterfront House | residential | — | — | — | missing |  |
| 713 | Small Wooden Shop with Multiple Entrances | commercial | — | — | — | missing |  |
| 714 | Soviet Style Apartment Building | residential | — | — | — | missing |  |
| 715 | Spacious Mansion With Park | residential | — | — | — | missing |  |
| 716 | Spawn Fountain Garden | parks | — | — | — | missing |  |
| 717 | St. Pancras Old Church Exterior Replica | public | — | — | — | missing |  |
| 718 | Standard Railroad Station | roads | — | — | — | missing |  |
| 719 | Stone and Wood Survival Bridge | bridges | — | — | — | missing |  |
| 720 | Stone Church Building | public | — | — | — | missing |  |
| 721 | Storage Warehouse Building | residential | — | — | — | missing |  |
| 722 | Storage Warehouse Structure | residential | — | — | — | missing |  |
| 723 | Subway Tunnel Structure | bridges | — | — | — | missing |  |
| 724 | Survival Mansion 2-Story Build | residential | — | — | — | missing |  |
| 725 | Suspended Bridge Minecraft Build | bridges | — | — | — | missing |  |
| 726 | Suspension Cable Bridge | bridges | — | — | — | missing |  |
| 727 | Tails&#8217; Workshop Recreation | commercial | — | — | — | missing |  |
| 728 | Tall Orange Quartz Apartment Building | residential | — | — | — | missing |  |
| 729 | Technoblade Tribute Parkour Build | parks | — | — | — | missing |  |
| 730 | Ten Story Apartment Building | residential | — | — | — | missing |  |
| 731 | The Hidden Library From The Book | public | — | — | — | missing |  |
| 732 | Tilted Office Building | towers | — | — | — | missing |  |
| 733 | TNT Museum | public | — | — | — | missing |  |
| 734 | Town Parking Lot | transport | — | — | — | missing |  |
| 735 | Towny Road System &#8211; Cobblestone Construction | roads | — | — | — | missing |  |
| 736 | Traditional Brick Home With Garage | commercial | — | — | — | missing |  |
| 737 | Traditional British Pub Building | commercial | — | — | — | missing |  |
| 738 | Trainyard Automatic Refill Station | transport | — | — | — | missing |  |
| 739 | Tropical Mine and Shop | commercial | — | — | — | missing |  |
| 740 | Truck Stop Gas Station | commercial | — | — | — | missing |  |
| 741 | Two Story House With Attic And Balcony | residential | — | — | — | missing |  |
| 742 | Two Story Warehouse With Parking | transport | — | — | — | missing |  |
| 743 | Underground Metro Station Design | transport | — | — | — | missing |  |
| 744 | Underground Metro Station With Blue Train | transport | — | — | — | missing |  |
| 745 | Unfurnished Office Building Structure | towers | — | — | — | missing |  |
| 746 | Urban Compressed Air Factory | industrial | — | — | — | missing |  |
| 747 | Large Urban Warehouse Storage Building | residential | — | — | — | missing |  |
| 748 | Vehicle Warehouse Storage | residential | — | — | — | missing |  |
| 749 | Vibrant Yellow Modern Apartment Building | residential | — | — | — | missing |  |
| 750 | Vienna Street House 65 Build | roads | — | — | — | missing |  |
| 751 | Vienna Street House 66 | roads | — | — | — | missing |  |
| 752 | Vienna Street House 68 | roads | — | — | — | missing |  |
| 753 | Vienna Street House 70 Build | roads | — | — | — | missing |  |
| 754 | Vienna Street House 71 | roads | — | — | — | missing |  |
| 755 | Vienna Street House 73 | roads | — | — | — | missing |  |
| 756 | Vienna Street House 74 | roads | — | — | — | missing |  |
| 757 | Vienna Street House With Jungle Planks | roads | — | — | — | missing |  |
| 758 | Vintage Train Station Building | transport | — | — | — | missing |  |
| 759 | Warehouse 13 Storage Building | residential | — | — | — | missing |  |
| 760 | Warehouse With Movie Sets | residential | — | — | — | missing |  |
| 761 | Water Wall Skyscraper | towers | — | — | — | missing |  |
| 762 | Western Train Station Structure | transport | — | — | — | missing |  |
| 763 | Wii Island Hotel | commercial | — | — | — | missing |  |
| 764 | Willis Tower Overhaul Schematic | towers | — | — | — | missing |  |
| 765 | Willis Tower Skyscraper Build | towers | — | — | — | missing |  |
| 766 | Wooden Bridge Design | bridges | — | — | — | missing |  |
| 767 | Wooden Bridge with Fences | bridges | — | — | — | missing |  |
| 768 | Working Lighthouse Tower | towers | — | — | — | missing |  |
| 769 | World Relics Museum Build | public | — | — | — | missing |  |
| 770 | Yandere High School Electric Chair Room | public | — | — | — | missing |  |
| 771 | Yeti&#8217;s Alpine Shop | commercial | — | — | — | missing |  |
| 772 | Yin Yang Garden Fountain | parks | — | — | — | missing |  |
| 773 | Youcube Office Structure | towers | — | — | — | missing |  |
| 774 | Zambia&#8217;s Tallest Skyscraper &#8211; Findeco House | towers | — | — | — | missing |  |
| 775 | High Security Jail (default map) | public | — | — | — | missing |  |
| 776 | Modern house N2 | residential | — | — | — | missing |  |
| 777 | Radeon prison | public | — | — | — | missing |  |
| 778 | Magenta Storage Container | decor | — | — | — | missing |  |
| 779 | Blue Container Outdoor Decoration | decor | — | — | — | missing |  |
| 780 | Pink Container Decoration | decor | — | — | — | missing |  |
| 781 | Modern City Stoplight | intersections | — | — | — | missing |  |
| 782 | Automatic Ice Boat Crossing | waterfront | — | — | — | missing |  |
| 783 | Off-Road 6×6 Tanker Truck | roads | — | — | — | missing |  |
| 784 | Toll Booth Structure | residential | — | — | — | missing |  |
| 785 | Street Cleaning Tanker Truck | roads | — | — | — | missing |  |
| 786 | Street Lantern | roads | — | — | — | missing |  |
| 787 | Fallout 3 Billboard Structure | decor | — | — | — | missing |  |
| 788 | Garbage Truck with Front Loader | vehicles | — | — | — | missing |  |
| 789 | Bedwars Bed Defence Structure | public | — | — | — | missing |  |
| 790 | Large Advertisement Billboard Structure | decor | — | — | — | missing |  |
| 791 | Japanese Garbage Compactor Structure | vehicles | — | — | — | missing |  |
| 792 | Industrial Warehouse Fence and Gate | industrial | — | — | — | missing |  |
| 793 | Meme Billboard Advertisement | decor | — | — | — | missing |  |
| 794 | Automatic Trashcan Build | public | — | — | — | missing |  |
| 795 | Fence Totem Structure | decor | — | — | — | missing |  |
| 796 | Realistic Car Trailer – 468 Blocks | vehicles | — | — | — | missing |  |
| 797 | 1994 Nissan Dump Truck Vehicle | vehicles | — | — | — | missing |  |
| 798 | Super Motorcycle Design | vehicles | — | — | — | missing |  |
| 799 | Tow Truck Semi-Trailer | vehicles | — | — | — | missing |  |
| 800 | Aluminum Van Truck 6×6 | vehicles | — | — | — | missing |  |
| 801 | Industrial Iron Car Vehicle | vehicles | — | — | — | missing |  |
| 802 | 1995 Isuzu Forward Crane Truck | vehicles | — | — | — | missing |  |
| 803 | Ten-Wheeler Crane Tow Truck | vehicles | — | — | — | missing |  |
| 804 | Fuso Fighter Wing Van Truck | vehicles | — | — | — | missing |  |
| 805 | Car Carrier Truck and Trailer | vehicles | — | — | — | missing |  |
| 806 | 1998 Isuzu Freezer Truck | vehicles | — | — | — | missing |  |
| 807 | Heavy Duty Ambulance Vehicle | vehicles | — | — | — | missing |  |
| 808 | Japanese Van with 8 Wheels | vehicles | — | — | — | missing |  |
| 809 | Fuso Fighter Dump Truck Vehicle | vehicles | — | — | — | missing |  |
| 810 | Fire Truck with Manlift | vehicles | — | — | — | missing |  |
| 811 | Decorated 10W Truck Van | vehicles | — | — | — | missing |  |
| 812 | Crane Truck with Car Carrier | vehicles | — | — | — | missing |  |
| 813 | Fuso FV411J Dump Truck Model | vehicles | — | — | — | missing |  |
| 814 | Decorated 12-Wheel Refrigerated Van | vehicles | — | — | — | missing |  |
| 815 | Frog Driving a Car | vehicles | — | — | — | missing |  |
| 816 | Fuso Fighter Cargo Truck Detailed Build | vehicles | — | — | — | missing |  |
| 817 | Decorated Japanese Refrigerated Van | vehicles | — | — | — | missing |  |
| 818 | Fallout 3 Inspired Car Schematic | vehicles | — | — | — | missing |  |
| 819 | Tractor With Cometto Trailer | vehicles | — | — | — | missing |  |
| 820 | Decorated Refrigerated Van | vehicles | — | — | — | missing |  |
| 821 | Fallout 3 Style Car (No Engine) | vehicles | — | — | — | missing |  |
| 822 | Aluminum Wing Van Truck with Solar Radiator | vehicles | — | — | — | missing |  |
| 823 | Fallout 3 Car Replica | vehicles | — | — | — | missing |  |
| 824 | Cometto Self-Propelled Trailer | vehicles | — | — | — | missing |  |
| 825 | Secure Transport Van | vehicles | — | — | — | missing |  |
| 826 | Thomas and Friends Candy Car | vehicles | — | — | — | missing |  |
| 827 | Heavy Duty 14-Wheeler Dump Truck | vehicles | — | — | — | missing |  |
| 828 | Refrigerated Double-Cab Van | vehicles | — | — | — | missing |  |
| 829 | Concrete Pump Truck with Derricks | vehicles | — | — | — | missing |  |
| 830 | 10-Wheeler Wing Van Truck and Trailer | vehicles | — | — | — | missing |  |
| 831 | Sdkfz 222 Armored Car | vehicles | — | — | — | missing |  |
| 832 | Heavy Crane Truck | vehicles | — | — | — | missing |  |
| 833 | Fruehauf Empty Can Van Trailer | vehicles | — | — | — | missing |  |
| 834 | Armored Snow Patrol Truck | vehicles | — | — | — | missing |  |
| 835 | 9 Block Long Van Box Truck Compartment | vehicles | — | — | — | missing |  |
| 836 | Small Car Dealership Building | vehicles | — | — | — | missing |  |
| 837 | Heavy Tractor Head and Van Trailer | vehicles | — | — | — | missing |  |
| 838 | Double Cab Pickup Truck | vehicles | — | — | — | missing |  |
| 839 | Massive Haul Truck | vehicles | — | — | — | missing |  |
| 840 | Acacia & Spruce Small Aircraft Hangar | transport | — | — | — | missing |  |
| 841 | Small Garden With Wither Platform | transport | — | — | — | missing |  |
| 842 | Abandoned Town with Subway System | transport | — | — | — | missing |  |
| 843 | Minecraft Airport Terminal Building | transport | — | — | — | missing |  |
| 844 | Fallout 3 Red Rocket Gas Station | transport | — | — | — | missing |  |
| 845 | Aircraft Hangar Structure | transport | — | — | — | missing |  |
| 846 | Small Village Train Station | transport | — | — | — | missing |  |
| 847 | Subway Station Build | transport | — | — | — | missing |  |
| 848 | Minecraft Airport Terminal Build | transport | — | — | — | missing |  |
| 849 | Modern Gas Station With Shop and Tankers | transport | — | — | — | missing |  |
| 850 | Airfield and Barracks Structure | public | — | — | — | missing |  |
| 851 | Wooden Platform for Ravines and Cliffs | transport | — | — | — | missing |  |
| 852 | Small Gas Station With Custom Blocks | transport | — | — | — | missing |  |
| 853 | Obsidian Runway Build | transport | — | — | — | missing |  |
| 854 | Long Cargo Platform | transport | — | — | — | missing |  |
| 855 | Modern Fueling Station | transport | — | — | — | missing |  |
| 856 | CastiaMC Lobby Platform Build | transport | — | — | — | missing |  |
| 857 | 16×16 Plains Train Station | transport | — | — | — | missing |  |
| 858 | Ancient Mayan Depot House | transport | — | — | — | missing |  |
| 859 | Minecart Dropper Station | transport | — | — | — | missing |  |
| 860 | Modern Wi-Fi Station Tower | transport | — | — | — | missing |  |
| 861 | Customs Station Building | transport | — | — | — | missing |  |
| 862 | Minecraft Fire Station and Football Field | transport | — | — | — | missing |  |
| 863 | Small Fishing Boat with Storage | waterfront | — | — | — | missing |  |
| 864 | LostSea Ocean Village with Ships | waterfront | — | — | — | missing |  |
| 865 | Asian Style Dock | waterfront | — | — | — | missing |  |
| 866 | Trading Ship – Small Creative Build | waterfront | — | — | — | missing |  |
| 867 | Diagonal Port Structure | waterfront | — | — | — | missing |  |
| 868 | AxiumSA Luxury Liner – Modern Yacht | waterfront | — | — | — | missing |  |
| 869 | Corvette Tuna Naval Cannon Ship | waterfront | — | — | — | missing |  |
| 870 | Moderate Size Dock with Chests | waterfront | — | — | — | missing |  |
| 871 | Imposing Flying Ship Design | waterfront | — | — | — | missing |  |
| 872 | Coastal Port Village | waterfront | — | — | — | missing |  |
| 873 | Gretjoy Boat Build | waterfront | — | — | — | missing |  |
| 874 | German Train Ferry Preussen 1909 Ship Recreation | waterfront | — | — | — | missing |  |
| 875 | Modern Port Town | waterfront | — | — | — | missing |  |
| 876 | Luxury Yacht – Quartz Block Design | waterfront | — | — | — | missing |  |
| 877 | Oak Sailing Ship | waterfront | — | — | — | missing |  |
| 878 | Modern VIP Yacht | waterfront | — | — | — | missing |  |
| 879 | Fisherman’s Hut with Boat | waterfront | — | — | — | missing |  |
| 880 | Three-Masted Sailing Ship | waterfront | — | — | — | missing |  |
| 881 | Sloop Boat | waterfront | — | — | — | missing |  |
| 882 | Ancient Roman Galley Ship | waterfront | — | — | — | missing |  |
| 883 | Small Fishing Trawler Boat | waterfront | — | — | — | missing |  |
| 884 | Chinese Junk Ship | waterfront | — | — | — | missing |  |
| 885 | Minecraft Vet Clinic Building | public | — | — | — | missing |  |
| 886 | Futuristic Police Space Vehicle | vehicles | — | — | — | missing |  |
| 887 | Small Town Hall | public | — | — | — | missing |  |
| 888 | Stone Library Outpost | public | — | — | — | missing |  |
| 889 | Yandere High School: Insane Rooms | public | — | — | — | missing |  |
| 890 | Fallout Drive-In Movie Theater | public | — | — | — | missing |  |
| 891 | Small Prison Structure | public | — | — | — | missing |  |
| 892 | Prison Transport Bus For Police | vehicles | — | — | — | missing |  |
| 893 | Old Town Hall | public | — | — | — | missing |  |
| 894 | Enchanted Library Building | public | — | — | — | missing |  |
| 895 | Minecraft Theatre Stage Design | public | — | — | — | missing |  |
| 896 | Prison Mining Outpost | public | — | — | — | missing |  |
| 897 | Courthouse Design | public | — | — | — | missing |  |
| 898 | Cozy Village Library | public | — | — | — | missing |  |
| 899 | Ancient Greek Theatre | public | — | — | — | missing |  |
| 900 | Mastermind Prison Mine | public | — | — | — | missing |  |
| 901 | Server Town Hall Building | public | — | — | — | missing |  |
| 902 | Repaired Stronghold With Libraries | public | — | — | — | missing |  |
| 903 | Wooden Amphitheatre Structure | public | — | — | — | missing |  |
| 904 | Prisoner Transport Truck Vehicle | vehicles | — | — | — | missing |  |
| 905 | Britain’s Got Talent Theatre with Interior | public | — | — | — | missing |  |
| 906 | Simple Jail Structure | public | — | — | — | missing |  |
| 907 | Quartz Town Hall – Versatile Design | public | — | — | — | missing |  |
| 908 | Ancient Mayan Amphitheater Structure | public | — | — | — | missing |  |
| 909 | Bedrock Prison Structure | public | — | — | — | missing |  |
| 910 | Simple Town Hall Design | public | — | — | — | missing |  |
| 911 | Covid 19 Testing Town Hall Center | public | — | — | — | missing |  |
| 912 | Corner Cinema and Houses | public | — | — | — | missing |  |
| 913 | Basic City Hall for Small Towns | public | — | — | — | missing |  |
| 914 | Grand Performance Theatre | public | — | — | — | missing |  |
| 915 | European Style Prison Bus | vehicles | — | — | — | missing |  |
| 916 | Hermitcraft Season 7 Town Hall Replica | public | — | — | — | missing |  |
| 917 | French Town Hall Building | public | — | — | — | missing |  |
| 918 | Simple Courthouse Design V2 | public | — | — | — | missing |  |
| 919 | Grand Town Hall | public | — | — | — | missing |  |
| 920 | Village Town Hall Building | public | — | — | — | missing |  |
| 921 | Diorite Stone Factory – 2605 Blocks | industrial | — | — | — | missing |  |
| 922 | Industrial Warehouse Building | industrial | — | — | — | missing |  |
| 923 | Rustic Water Tower | towers | — | — | — | missing |  |
| 924 | Fallout 3 Style Grain Silo | industrial | — | — | — | missing |  |
| 925 | Small Industrial Factory Structure | industrial | — | — | — | missing |  |
| 926 | Granite Concrete Factory – 8286 Blocks | industrial | — | — | — | missing |  |
| 927 | Village Warehouse Structure | industrial | — | — | — | missing |  |
| 928 | Solarpunk Quartz Tower | towers | — | — | — | missing |  |
| 929 | Modern Water Mill Structure | industrial | — | — | — | missing |  |
| 930 | Spacious Industrial Warehouse Building | industrial | — | — | — | missing |  |
| 931 | Stone Brick Factory Building | industrial | — | — | — | missing |  |
| 932 | Industrial Warehouse Storage Facility | industrial | — | — | — | missing |  |
| 933 | Minecraft Lumber Mill Structure | industrial | — | — | — | missing |  |
| 934 | Industrial Pipe with Pressure Gauge | industrial | — | — | — | missing |  |
| 935 | Warehouse 7 Industrial Building | industrial | — | — | — | missing |  |
| 936 | Industrial Style Bridge | bridges | — | — | — | missing |  |
| 937 | Industrial Factory Hall | industrial | — | — | — | missing |  |
| 938 | Create Mod Birch Lumber Mill and Factory | industrial | — | — | — | missing |  |
| 939 | Rustic Wood Workshop | industrial | — | — | — | missing |  |
| 940 | Abandoned Textile Mill Structure | industrial | — | — | — | missing |  |
| 941 | Create Mod Basic Workshop | industrial | — | — | — | missing |  |
| 942 | Create Mod Andesite Factory | industrial | — | — | — | missing |  |
| 943 | Mega Clothing Store With Workshop | industrial | — | — | — | missing |  |
| 944 | Create 16×16 Andesite Alloy Factory | industrial | — | — | — | missing |  |
| 945 | AIK Foundry Structure | industrial | — | — | — | missing |  |
| 946 | Factory Build V3 | industrial | — | — | — | missing |  |
| 947 | Advanced Syngas Industrial Complex | industrial | — | — | — | missing |  |
| 948 | Create Mod Gravel Factory 16×16 | industrial | — | — | — | missing |  |
| 949 | Create Mod Andesite Factory 16×16 Taiga | industrial | — | — | — | missing |  |
| 950 | Industrial Style Modern House | industrial | — | — | — | missing |  |
| 951 | Create Mod Andesite Factory In 16×16 Chunk | industrial | — | — | — | missing |  |
| 952 | Industrial Style House | industrial | — | — | — | missing |  |
| 953 | Stone Brick Industrial Factory | industrial | — | — | — | missing |  |
| 954 | Rustic Farmhouse & Shop | commercial | — | — | — | missing |  |
| 955 | Town Layout with Plots for Houses and Markets | residential | — | — | — | missing |  |
| 956 | Modern McDonald’s Restaurant With Exterior | commercial | — | — | — | missing |  |
| 957 | Union Bank Building | commercial | — | — | — | missing |  |
| 958 | Classical Greek Market | commercial | — | — | — | missing |  |
| 959 | Unique Treehouse Restaurant | commercial | — | — | — | missing |  |
| 960 | The X Mall | commercial | — | — | — | missing |  |
| 961 | Witch’s Potion Shop House | commercial | — | — | — | missing |  |
| 962 | Fallout 3 Diner Restaurant Build | commercial | — | — | — | missing |  |
| 963 | Gold Bank Vault Tower | commercial | — | — | — | missing |  |
| 964 | Modern Shopping Mall | commercial | — | — | — | missing |  |
| 965 | Birch Blacksmith Shop | commercial | — | — | — | missing |  |
| 966 | Seabubbles Cafe Building | commercial | — | — | — | missing |  |
| 967 | Blacksmith Shop Structure | commercial | — | — | — | missing |  |
| 968 | Joe’s Diner Restaurant | commercial | — | — | — | missing |  |
| 969 | Brick Blacksmith Shop | commercial | — | — | — | missing |  |
| 970 | Modern Fast Food Restaurant | commercial | — | — | — | missing |  |
| 971 | Blacksmith Shop NPC | commercial | — | — | — | missing |  |
| 972 | McDonald’s Restaurant with Play Area | commercial | — | — | — | missing |  |
| 973 | Blacksmith Shop in Jungle Setting | commercial | — | — | — | missing |  |
| 974 | Spanish Italian Fusion Restaurant | commercial | — | — | — | missing |  |
| 975 | Oak Blacksmith Shop | commercial | — | — | — | missing |  |
| 976 | McDonald’s Restaurant Building | commercial | — | — | — | missing |  |
| 977 | Blacksmith Shop – Sandstone Design | commercial | — | — | — | missing |  |
| 978 | Restaurant Bar Towers | commercial | — | — | — | missing |  |
| 979 | Spruce Blacksmith Shop | commercial | — | — | — | missing |  |
| 980 | McDonalds Restaurant | commercial | — | — | — | missing |  |
| 981 | Blacksmith Shop Exterior | commercial | — | — | — | missing |  |
| 982 | Small Minecraft Bakery Shop | commercial | — | — | — | missing |  |
| 983 | Restaurant Building | commercial | — | — | — | missing |  |
| 984 | Gucci Store | commercial | — | — | — | missing |  |
| 985 | Quartz Gold Modern Office Tower | towers | — | — | — | missing |  |
| 986 | Cobblestone and Glass Portal Towers | public | — | — | — | missing |  |
| 987 | Abandonedcraft Fortress Tower | towers | — | — | — | missing |  |
| 988 | Big Bend Skyscraper 600m Tall | towers | — | — | — | missing |  |
| 989 | Desert Tower with Enchanting Room | towers | — | — | — | missing |  |
| 990 | Rustic Village with Longhouse and Towers | public | — | — | — | missing |  |
| 991 | Desert Water Temple With Symmetrical Towers | public | — | — | — | missing |  |
| 992 | Block Showcase Tower with Mini Biomes | towers | — | — | — | missing |  |
| 993 | Steampunk Skyscraper Model | towers | — | — | — | missing |  |
| 994 | Crusader Style Small Tower | towers | — | — | — | missing |  |
| 995 | Steampunk Skyscraper Model 4 | towers | — | — | — | missing |  |
| 996 | Stone Tower with Automatic Lighting | towers | — | — | — | missing |  |
| 997 | Steampunk Skyscraper Model 5 Tower | towers | — | — | — | missing |  |
| 998 | Eiffel Tower | towers | — | — | — | missing |  |
| 999 | Tower Trivia Game Show | towers | — | — | — | missing |  |
| 1000 | Enchanted End Stone Brick Tower | towers | — | — | — | missing |  |
| 1001 | Max’s Tower Outpost | towers | — | — | — | missing |  |
| 1002 | Big Ben Clock Tower Replica – Oak & Birch Build | towers | — | — | — | missing |  |
| 1003 | Small Storage House | residential | — | — | — | missing |  |
| 1004 | Spacious Modern Mansion Estate | residential | — | — | — | missing |  |
| 1005 | Modern Quartz and Dirt Residence | residential | — | — | — | missing |  |
| 1006 | Medium Town House with Three Floors | residential | — | — | — | missing |  |
| 1007 | Medium Brick Cottage House | residential | — | — | — | missing |  |
| 1008 | Modern House Design with Soartex Textures | residential | — | — | — | missing |  |
| 1009 | Small Decorative Town House | residential | — | — | — | missing |  |
| 1010 | Starter Cottage – Oak & Quartz | residential | — | — | — | missing |  |
| 1011 | Basic House Structure | residential | — | — | — | missing |  |
| 1012 | Large Estate House | residential | — | — | — | missing |  |
| 1013 | Furnished Brick Townhouse | residential | — | — | — | missing |  |
| 1014 | Cozy Small Wooden Cottage | residential | — | — | — | missing |  |
| 1015 | Snowy Small House | residential | — | — | — | missing |  |
| 1016 | Spacious Modern Mansion with Furnished Interior | residential | — | — | — | missing |  |
| 1017 | Contemporary Residence Schematic | residential | — | — | — | missing |  |
| 1018 | Condensed Townhouse Compound Structure | residential | — | — | — | missing |  |
| 1019 | Rustic Log Cabin House | residential | — | — | — | missing |  |
| 1020 | Small House With Kitchen and Shower | residential | — | — | — | missing |  |
| 1021 | Large Three-Story Mansion | residential | — | — | — | missing |  |
| 1022 | Large Modern Villa Residence | residential | — | — | — | missing |  |
| 1023 | Cozy Town House with Hay Roof | residential | — | — | — | missing |  |
| 1024 | Birch Cottage House with Furnishings | residential | — | — | — | missing |  |
| 1025 | Cozy Hillside House | residential | — | — | — | missing |  |
| 1026 | Small Villa House with Storage | residential | — | — | — | missing |  |
| 1027 | Modern Villa Residence – Dirt & White Concrete | residential | — | — | — | missing |  |
| 1028 | Rustic Country Cottage | residential | — | — | — | missing |  |
| 1029 | Rustic 3-Story Mansion | residential | — | — | — | missing |  |
| 1030 | Small Brick Townhouse With Jack-o-Lanterns | residential | — | — | — | missing |  |
| 1031 | Spruce Log Cabin House | residential | — | — | — | missing |  |
| 1032 | Asian Style House with Furnished Interior | residential | — | — | — | missing |  |
| 1033 | Modern Blue Villa | residential | — | — | — | missing |  |
| 1034 | Modern Square Residence | parks | — | — | — | missing |  |
| 1035 | New York Style Townhouses With Pool | public | — | — | — | missing |  |
| 1036 | Cozy Woodcutter’s Cottage | residential | — | — | — | missing |  |
| 1037 | Modern Two-Story House Over Pond | residential | — | — | — | missing |  |
| 1038 | Modern Mansion with Fire Safety Upgrades | residential | — | — | — | missing |  |
| 1039 | Simple Birch Cottage | residential | — | — | — | missing |  |
| 1040 | Snowy House and Vehicles | vehicles | — | — | — | missing |  |
| 1041 | Piston Fountain – Small Garden Feature | parks | — | — | — | missing |  |
| 1042 | Mini Hedge Maze With Cave Entrance | parks | — | — | — | missing |  |
| 1043 | Small Town Square | parks | — | — | — | missing |  |
| 1044 | Rustic Farmhouse with Garden and Pond | parks | — | — | — | missing |  |
| 1045 | Sea Creature Park Megalodon Whale | parks | — | — | — | missing |  |
| 1046 | Small Garden Oasis | parks | — | — | — | missing |  |
| 1047 | Village Fountain | parks | — | — | — | missing |  |
| 1048 | Soviet Style City Square | parks | — | — | — | missing |  |
| 1049 | Two Cubes Modern House With Garden Pool | parks | — | — | — | missing |  |
| 1050 | Park Ball Structure | parks | — | — | — | missing |  |
| 1051 | Creeper Head Fountain | parks | — | — | — | missing |  |
| 1052 | Simple Minecraft Tree | parks | — | — | — | missing |  |
| 1053 | Gothic Square Structure | parks | — | — | — | missing |  |
| 1054 | Olive Garden Restaurant Salt Lake City | parks | — | — | — | missing |  |
| 1055 | Playground Park for Minecrafty Town | parks | — | — | — | missing |  |
| 1056 | Survival Sphere House and Garden | parks | — | — | — | missing |  |
| 1057 | Spanish Moss Oak Tree | parks | — | — | — | missing |  |
| 1058 | Cozy Brick Home with Garden and Storage | parks | — | — | — | missing |  |
| 1059 | Medium Palm Tree With Cocoa Pods | parks | — | — | — | missing |  |
| 1060 | Beautiful Garden | parks | — | — | — | missing |  |
| 1061 | Tropical Palm Tree | parks | — | — | — | missing |  |
| 1062 | Rustic Garden Shed | parks | — | — | — | missing |  |
| 1063 | Small Oak Decorative Tree | parks | — | — | — | missing |  |
| 1064 | Small Tree Decoration | parks | — | — | — | missing |  |
| 1065 | 3Tri’s Modern Garden Structure | parks | — | — | — | missing |  |
| 1066 | Decorative Lantern Tree | parks | — | — | — | missing |  |
| 1067 | Cozy House with Garden and Garage | parks | — | — | — | missing |  |
| 1068 | Japanese Garden House – Spruce & Dark Oak | parks | — | — | — | missing |  |
| 1069 | Massive Tree Structure | parks | — | — | — | missing |  |
| 1070 | Large Romantic Tree | parks | — | — | — | missing |  |
| 1071 | Custom Birch Tree Decoration | parks | — | — | — | missing |  |
| 1072 | Intersection Road | intersections | — | — | — | missing |  |
| 1073 | Sewer Template Intersection Shape | intersections | — | — | — | missing |  |
| 1074 | Drive on the Right Dual Simplex Minecart Track Intersection | intersections | — | — | — | missing |  |
| 1075 | Intersection | intersections | — | — | — | missing |  |
| 1076 | Stoplight | intersections | — | — | — | missing |  |
| 1077 | Ride Road Build | roads | — | — | — | missing |  |
| 1078 | High-Speed Quartz Road | roads | — | — | — | missing |  |
| 1079 | Fast Road Car Structure | roads | — | — | — | missing |  |
| 1080 | Wild West Crossroad | intersections | — | — | — | missing |  |
| 1081 | Road B (Normal two-way street) | roads | — | — | — | missing |  |
| 1082 | Cobble Towny Road System | roads | — | — | — | missing |  |
| 1083 | Decorative Street Lamp. | roads | — | — | — | missing |  |
| 1084 | Terraced Shop with Sidewalk | roads | — | — | — | missing |  |
| 1085 | Bus Stop | vehicles | — | — | — | missing |  |
| 1086 | bus stop | vehicles | — | — | — | missing |  |
| 1087 | bus stop | vehicles | — | — | — | missing |  |
| 1088 | Minecraft Airport Runway | transport | — | — | — | missing |  |
| 1089 | Airport | transport | — | — | — | missing |  |
| 1090 | Modern Hospital Building | public | — | — | — | missing |  |
| 1091 | Two-Story Hospital Building | public | — | — | — | missing |  |
| 1092 | Huge Modern Hospital! | public | — | — | — | missing |  |
| 1093 | Hospital | public | — | — | — | missing |  |
| 1094 | Police Station With Jail | transport | — | — | — | missing |  |
| 1095 | City Police Station Building | transport | — | — | — | missing |  |
| 1096 | Police Station / Modern Police Station | transport | — | — | — | missing |  |
| 1097 | Police Station - complete version | transport | — | — | — | missing |  |
| 1098 | Police Station | transport | — | — | — | missing |  |
| 1099 | Fire Station Building | transport | — | — | — | missing |  |
| 1100 | Fire Station House | transport | — | — | — | missing |  |
| 1101 | Fire Station | transport | — | — | — | missing |  |
| 1102 | Fire Station | transport | — | — | — | missing |  |
| 1103 | equipped-firestation | public | — | — | — | missing |  |
| 1104 | Fire station | transport | — | — | — | missing |  |
| 1105 | Sims 3 Style City Hall | public | — | — | — | missing |  |
| 1106 | City Hall | public | — | — | — | missing |  |
| 1107 | Town hall | public | — | — | — | missing |  |
| 1108 | theater | public | — | — | — | missing |  |
| 1109 | Greek Theater | public | — | — | — | missing |  |
| 1110 | Theater | public | — | — | — | missing |  |
| 1111 | Shakespears theater | public | — | — | — | missing |  |
| 1112 | Modern Twin Cinema Building | public | — | — | — | missing |  |
| 1113 | Multi-Room Cinema with Concessions | public | — | — | — | missing |  |
| 1114 | 6 Room Cinema | public | — | — | — | missing |  |
| 1115 | Twin Cinema Complex | public | — | — | — | missing |  |
| 1116 | Cinema | public | — | — | — | missing |  |
| 1117 | 128KSU Power Plant Structure | industrial | — | — | — | missing |  |
| 1118 | Massive Steam Power Plant | industrial | — | — | — | missing |  |
| 1119 | Pixelmon Maze Power Plant | industrial | — | — | — | missing |  |
| 1120 | 256-Block Power Plant Structure | industrial | — | — | — | missing |  |
| 1121 | Power Plant | industrial | — | — | — | missing |  |
| 1122 | Pixelmon Power Plant | industrial | — | — | — | missing |  |
| 1123 | fallout 3 substation v1- zth | industrial | — | — | — | missing |  |
| 1124 | fallout 3 substation v2- zth | industrial | — | — | — | missing |  |
| 1125 | Barn with Water Tower | towers | — | — | — | missing |  |
| 1126 | Modern water tower | towers | — | — | — | missing |  |
| 1127 | Water Tower by iEdgy | towers | — | — | — | missing |  |
| 1128 | Double-Sided Sony Logo Billboard | public | — | — | — | missing |  |
| 1129 | "Do you even shift bro" billboard | public | — | — | — | missing |  |
| 1130 | Large Billboard | public | — | — | — | missing |  |
| 1131 | fallout 3 billboard- zth | decor | — | — | — | missing |  |
| 1132 | WorkBench | public | — | — | — | missing |  |
| 1133 | Toyland-FisherPrice Workbench | public | — | — | — | missing |  |
| 1134 | Small Gas Station and Store | transport | — | — | — | missing |  |
| 1135 | Gas station | transport | — | — | — | missing |  |
| 1136 | Gas Station 3 | transport | — | — | — | missing |  |
| 1137 | Petrol/ Gas station | transport | — | — | — | missing |  |
| 1138 | Sheetz Gas Station | transport | — | — | — | missing |  |
| 1139 | Art School Building | public | — | — | — | missing |  |
| 1140 | German School Building | public | — | — | — | missing |  |
| 1141 | Pixelmon School Building | public | — | — | — | missing |  |
| 1142 | School | public | — | — | — | missing |  |
| 1143 | Secondary School  - LE | public | — | — | — | missing |  |
| 1144 | Small Soccer Stadium Build | public | — | — | — | missing |  |
| 1145 | Apocalyptic Prison Mine | public | — | — | — | missing |  |
| 1146 | Small Prison Building | public | — | — | — | missing |  |
| 1147 | Desert Prison Structure | public | — | — | — | missing |  |
| 1148 | Sand Prison | public | — | — | — | missing |  |
| 1149 | Jail/Prison | public | — | — | — | missing |  |
| 1150 | Storage Warehouse | industrial | — | — | — | missing |  |
| 1151 | Storage Warehouse V1 | industrial | — | — | — | missing |  |
| 1152 | Large Warehouse | industrial | — | — | — | missing |  |
| 1153 | Warehouse | industrial | — | — | — | missing |  |
| 1154 | Warehouse 11 | industrial | — | — | — | missing |  |
| 1155 | 9-story Parking Garage | transport | — | — | — | missing |  |
| 1156 | Six-story parking lot | transport | — | — | — | missing |  |
| 1157 | Ambulance | vehicles | — | — | — | missing |  |
| 1158 | Train station | transport | — | — | — | missing |  |
| 1159 | Train Station Like Structure | transport | — | — | — | missing |  |
| 1160 | Nice village train station | transport | — | — | — | missing |  |
| 1161 | St Thomas Underground Train station | transport | — | — | — | missing |  |
| 1162 | Compact 3x3 Tunnel Drill | roads | — | — | — | missing |  |
| 1163 | Railway Tunnel | roads | — | — | — | missing |  |
| 1164 | Tunnel lighting | roads | — | — | — | missing |  |
| 1165 | Chafariz/Fonte - Fountain 02 | parks | — | — | — | missing |  |
| 1166 | 4 Sword Fountain | parks | — | — | — | missing |  |
| 1167 | Alexandria's Lighthouse | waterfront | — | — | — | missing |  |
| 1168 | Stone lighthouse - (with working fireplace) | waterfront | — | — | — | missing |  |
| 1169 | Modern Lakeside Townhouse | residential | — | — | — | missing |  |
| 1170 | Townhouse 7 | residential | — | — | — | missing |  |
| 1171 | Office Building | towers | — | — | — | missing |  |
| 1172 | ten story office building | towers | — | — | — | missing |  |
| 1173 | Drive on the Left Dual Simplex Minecart Track Intersection | intersections | — | — | — | missing |  |
| 1174 | 4 Way Intersection (Redstone) | intersections | — | — | — | missing |  |
| 1175 | Ancient Skyway Modified(T-Junction) | intersections | — | — | — | missing |  |
| 1176 | Highway Part 1 | roads | — | — | — | missing |  |
| 1177 | Highway Part 2 | roads | — | — | — | missing |  |
| 1178 | Highway Part 3 | roads | — | — | — | missing |  |
| 1179 | highway | roads | — | — | — | missing |  |
| 1180 | Railway Junction Train Station Base | intersections | — | — | — | missing |  |

## Не проанализировано

- `public_compact-hospital-structure_mc-mod_x.schem`
- `residential_compact-quartz-modern-house_mc-mod_x.schem`
- `towers_compact-two-story-office-building_mc-mod_x.schem`
- `industrial_compressed-cobblestone-factory_mc-mod_x.schem`
- `industrial_concrete-factory-structure_mc-mod_x.schem`
- `residential_concrete-warehouse-structure_mc-mod_x.schem`
- `towers_corporate-office-building-2_mc-mod_x.schem`
- `towers_corporate-office-building_mc-mod_x.schem`
- `public_country-library-building_mc-mod_x.schem`
- `bridges_covered-minecraft-bridge_mc-mod_x.schem`
- `residential_cozy-medium-house-with-garden_mc-mod_x.schem`
- `towers_cozy-small-hotel-building_mc-mod_x.schem`
- `residential_cozy-small-house-with-attic-and-basement_mc-mod_x.schem`
- `towers_cyan-tower-build_mc-mod_x.schem`
- `towers_dark-luminous-night-tower_mc-mod_x.schem`
- `towers_desert-sand-tower_mc-mod_x.schem`
- `public_dirt-church-structure_mc-mod_x.schem`
- `commercial_doughnut-shop-building_mc-mod_x.schem`
- `parks_dreamy-fountain-build_mc-mod_x.schem`
- `residential_early-20th-century-schoolhouse_mc-mod_x.schem`
- `public_early-american-library-building_mc-mod_x.schem`
- `towers_eight-story-hotel_mc-mod_x.schem`
- `residential_eldorado-house-lakeside-residence_mc-mod_x.schem`
- `public_eldwyn-library-structure_mc-mod_x.schem`
- `commercial_elegant-city-hall-for-small-towns_mc-mod_x.schem`
- `towers_elegant-grand-hotel_mc-mod_x.schem`
- `commercial_elegant-hotel-with-bar-and-dining_mc-mod_x.schem`
- `bridges_elegant-marble-bridge-design_mc-mod_x.schem`
- `towers_elegant-modern-office-tower_mc-mod_x.schem`
- `parks_elegant-quartz-fountain_mc-mod_x.schem`
- `parks_elegant-quartz-water-fountain_mc-mod_x.schem`
- `public_elementary-school-building_mc-mod_x.schem`
- `transport_elevated-metro-station-building_mc-mod_x.schem`
- `transport_elevated-metro-station-exterior_mc-mod_x.schem`
- `transport_elevated-metro-station-with-side-platform_mc-mod_x.schem`
- `transport_elevated-railway-station_mc-mod_x.schem`
- `towers_emerald-skyscraper-tower_mc-mod_x.schem`
- `commercial_essentialsx-shop-setup_mc-mod_x.schem`
- `industrial_factory-hall-2-0_mc-mod_x.schem`
- `bridges_fallout-3-inspired-overpass-ramp_mc-mod_x.schem`
- `transport_fallout-3-inspired-substation_mc-mod_x.schem`
- `residential_fallout-3-player-shack-house_mc-mod_x.schem`
- `towers_fallout-3-power-transmission-tower_mc-mod_x.schem`
- `residential_fallout-3-rubble-house_mc-mod_x.schem`
- `public_fallout-3-springvale-school-building_mc-mod_x.schem`
- `bridges_fallout-3-style-overpass-structure_mc-mod_x.schem`
- `bridges_fallout-3-style-overpass_mc-mod_x.schem`
- `transport_fallout-3-style-power-station_mc-mod_x.schem`
- `towers_fallout-3-water-tower-structure_mc-mod_x.schem`
- `public_fire-truck-vehicle_mc-mod_x.schem`
- `residential_functional-lighthouse_mc-mod_x.schem`
- `transport_functional-train-station_mc-mod_x.schem`
- `commercial_furnished-bank-building_mc-mod_x.schem`
- `commercial_furnished-family-home-with-garage_mc-mod_x.schem`
- `transport_futuristic-city-parking-lot_mc-mod_x.schem`
- `bridges_futuristic-marble-bridge_mc-mod_x.schem`
- `public_futuristic-stadium-angle-section_mc-mod_x.schem`
- `public_futuristic-stadium-panel_mc-mod_x.schem`
- `public_futuristic-stadium-wall-section_mc-mod_x.schem`
- `transport_futuristic-station-for-vehicles_mc-mod_x.schem`
- `parks_garden-fountain-design_mc-mod_x.schem`
- `parks_garden-fountain-structure_mc-mod_x.schem`
- `public_geologic-museum-minecraft-build_mc-mod_x.schem`
- `industrial_gingerbread-factory_mc-mod_x.schem`
- `industrial_glass-factory-build_mc-mod_x.schem`
- `industrial_gold-smelting-factory_mc-mod_x.schem`
- `public_gothic-church-minecraft-structure_mc-mod_x.schem`
- `public_grand-central-park-large-town-square_mc-mod_x.schem`
- `towers_grand-hotel-seventh-heaven_mc-mod_x.schem`
- `towers_grandpas-flower-power-tower-with-garden_mc-mod_x.schem`
- `towers_gray-tower-structure_mc-mod_x.schem`
- `bridges_guadalupe-river-bridge_mc-mod_x.schem`
- `public_hamburg-michel-church-structure_mc-mod_x.schem`
- `parks_hanging-gardens-of-brisbane_mc-mod_x.schem`
- `commercial_harbour-shops_mc-mod_x.schem`
- `residential_hidden-wooden-house_mc-mod_x.schem`
- `roads_highway-exit-structure_mc-mod_x.schem`
- `roads_highway-section-with-lighting-and-signs_mc-mod_x.schem`
- `roads_highway-toll-booth-structure_mc-mod_x.schem`
- `commercial_home-and-workshop-building_mc-mod_x.schem`
- `towers_hotel-hilton_mc-mod_x.schem`
- `towers_hotel-honk-house_mc-mod_x.schem`
- `towers_hotel-opal-seaside-resort_mc-mod_x.schem`
- `towers_hotel-weiss-v2_mc-mod_x.schem`
- `roads_immersive-railroading-bridge_mc-mod_x.schem`
- `roads_immersive-railroading-roundhouse-structure_mc-mod_x.schem`
- `roads_immersive-railroading-steamworks-station_mc-mod_x.schem`
- `residential_improved-warehouse-storage-structure_mc-mod_x.schem`
- `towers_indian-style-jade-mansion-tower_mc-mod_x.schem`
- `bridges_integral-bridge-structure_mc-mod_x.schem`
- `residential_island-house-lakefront_mc-mod_x.schem`
- `residential_item-storage-warehouse_mc-mod_x.schem`
- `towers_japanese-tower-style-asian-structure_mc-mod_x.schem`
- `towers_jive-49-modern-condominium-tower_mc-mod_x.schem`
- `bridges_jungle-spawn-bridge_mc-mod_x.schem`
- `residential_keralis-style-giant-mansion_mc-mod_x.schem`
- `residential_kingdom-banker-shop-house_mc-mod_x.schem`
- `towers_kokotonis-furnished-tower_mc-mod_x.schem`
- `residential_lapis-and-pickaxe-shop-medium-house_mc-mod_x.schem`
- `parks_large-car-park_mc-mod_x.schem`
- `residential_large-house-and-shop-building_mc-mod_x.schem`
- `commercial_large-modern-hotel-jungle-planks_mc-mod_x.schem`
- `residential_large-ranch-style-minimalist-house_mc-mod_x.schem`
- `residential_large-server-warehouse_mc-mod_x.schem`
- `commercial_large-smithy-workshop_mc-mod_x.schem`
- `bridges_large-stone-brick-bridge_mc-mod_x.schem`
- `bridges_large-stone-bridge-with-buildings_mc-mod_x.schem`
- `towers_large-stone-tower_mc-mod_x.schem`
- `residential_large-survival-mansion-house_mc-mod_x.schem`
- `towers_lava-hotel-resort_mc-mod_x.schem`
- `towers_leniland-office-building_mc-mod_x.schem`
- `transport_light-rail-transit-station_mc-mod_x.schem`
- `towers_lucavas-tower_mc-mod_x.schem`
- `residential_luxury-mansion-with-party-room_mc-mod_x.schem`
- `towers_luxury-palace-tower-with-elevator_mc-mod_x.schem`
- `residential_luxury-studio-apartment_mc-mod_x.schem`
- `residential_luxury-villa-with-courtyard-and-pool_mc-mod_x.schem`
- `parks_majestic-fountain-structure_mc-mod_x.schem`
- `commercial_market-stall_mc-mod_x.schem`
- `bridges_massive-lava-tunnel-with-minecart-track_mc-mod_x.schem`
- `towers_modern-city-hotel-building_mc-mod_x.schem`
- `intersections_modern-city-intersection-road_mc-mod_x.schem`
- `towers_modern-city-skyscraper_mc-mod_x.schem`
- `commercial_modern-coffee-shop_mc-mod_x.schem`
- `parks_modern-concrete-park_mc-mod_x.schem`
- `residential_modern-cyan-terracotta-house_mc-mod_x.schem`
- `towers_modern-decorated-tower_mc-mod_x.schem`
- `towers_modern-diamond-skyscraper_mc-mod_x.schem`
- `towers_modern-eco-skyscraper_mc-mod_x.schem`
- `commercial_modern-food-shop_mc-mod_x.schem`
- `parks_modern-fountain-design_mc-mod_x.schem`
- `towers_modern-four-story-hotel_mc-mod_x.schem`
- `roads_modern-four-story-shopping-mall-with-roads_mc-mod_x.schem`
- `commercial_modern-gas-station-and-shop_mc-mod_x.schem`
- `commercial_modern-gas-station-exterior_mc-mod_x.schem`
- `commercial_modern-gas-station-truck-stop_mc-mod_x.schem`
- `commercial_modern-gas-station-with-store_mc-mod_x.schem`
- `towers_modern-glass-office-tower-building_mc-mod_x.schem`
- `parks_modern-grand-fountain-medium-garden_mc-mod_x.schem`
- `towers_modern-hotel-building_mc-mod_x.schem`
- `residential_modern-house-design-with-library_mc-mod_x.schem`
- `residential_modern-lakehouse-mansion_mc-mod_x.schem`
- `public_modern-library-design_mc-mod_x.schem`
- `residential_modern-library-house_mc-mod_x.schem`
- `residential_modern-luxury-residence_mc-mod_x.schem`
- `towers_modern-office-building-sketch_mc-mod_x.schem`
- `towers_modern-office-tower-building_mc-mod_x.schem`
- `towers_modern-office-tower-with-elevator_mc-mod_x.schem`
- `towers_modern-office-tower_mc-mod_x.schem`
- `commercial_modern-parallel-heights-hotel-building_mc-mod_x.schem`
- `parks_modern-park-with-fountain-and-benches_mc-mod_x.schem`
- `transport_modern-parking-garage-structure_mc-mod_x.schem`
- `public_modern-police-station-building_mc-mod_x.schem`
- `public_modern-police-station-design_mc-mod_x.schem`
- `towers_modern-quartz-city-tower_mc-mod_x.schem`
- `residential_modern-quartz-house-with-birch-accents_mc-mod_x.schem`
- `commercial_modern-quartz-reserve-bank_mc-mod_x.schem`
- `towers_modern-quartz-skyscraper-tower_mc-mod_x.schem`
- `public_modern-school-building_mc-mod_x.schem`
- `towers_modern-skyscraper-build_mc-mod_x.schem`
- `towers_modern-skyscraper-design_mc-mod_x.schem`
- `towers_modern-skyscraper-tower-11_mc-mod_x.schem`
- `towers_modern-skyscraper-tower_mc-mod_x.schem`
- `towers_modern-skyscraper_mc-mod_x.schem`
- `residential_modern-small-to-medium-futuristic-house_mc-mod_x.schem`
- `towers_modern-spiral-skyscraper_mc-mod_x.schem`
- `commercial_modern-style-shop_mc-mod_x.schem`
- `towers_modern-style-tower-structure_mc-mod_x.schem`
- `towers_modern-torch-towers_mc-mod_x.schem`
- `transport_modern-train-station-design_mc-mod_x.schem`
- `residential_modern-villa-with-survival-features_mc-mod_x.schem`
- `residential_modern-warehouse-with-iron-gate-details_mc-mod_x.schem`
- `residential_modern-white-city-apartment-building_mc-mod_x.schem`
- `commercial_mr-burns-small-structure_mc-mod_x.schem`
- `towers_mud-tower-build_mc-mod_x.schem`
- `transport_multi-level-6-story-parking-lot_mc-mod_x.schem`
- `transport_multi-level-parking-garage-structure_mc-mod_x.schem`
- `commercial_multiplayer-survival-base-with-shop_mc-mod_x.schem`
- `towers_murchinson-modern-office-building-with-helip_mc-mod_x.schem`
- `public_mystcraft-inspired-library-structure_mc-mod_x.schem`
- `public_mystical-church-structure_mc-mod_x.schem`
- `commercial_mythological-shopping-mall-with-water-featur_mc-mod_x.schem`
- `public_nierta-central-park-town-square_mc-mod_x.schem`
- `residential_nine-story-apartment-building-series_mc-mod_x.schem`
- `bridges_nordic-style-small-bridge_mc-mod_x.schem`
- `towers_octagonal-hotel-interior-design_mc-mod_x.schem`
- `public_old-church-structure_mc-mod_x.schem`
- `industrial_old-factory-hall-building_mc-mod_x.schem`
- `towers_olimpushd-tower-large-build_mc-mod_x.schem`
- `towers_olympus-tower-large-build_mc-mod_x.schem`
- `towers_one-world-trade-centre-skyscraper_mc-mod_x.schem`
- `towers_orange-tower-large-scale-block-structure_mc-mod_x.schem`
- `transport_orbital-station_mc-mod_x.schem`
- `parks_ornamental-garden-fountain_mc-mod_x.schem`
- `parks_peaceful-fountain_mc-mod_x.schem`
- `parks_peaceful-minecraft-garden-oasis-build_mc-mod_x.schem`
- `commercial_pet-shop-building_mc-mod_x.schem`
- `towers_platinum-residential-tower-with-antenna_mc-mod_x.schem`
- `public_police-car-vehicle_mc-mod_x.schem`
- `public_police-vehicle_mc-mod_x.schem`
- `residential_portuguese-style-house_mc-mod_x.schem`
- `towers_prismarine-island-tower_mc-mod_x.schem`
- `residential_quad-steam-turbine-warehouse_mc-mod_x.schem`
- `public_quaint-library-structure_mc-mod_x.schem`
- `parks_quartz-pool-garden-feature_mc-mod_x.schem`
- `residential_quartz-spruce-small-house_mc-mod_x.schem`
- `towers_quickdeli-cargo-services-warehouse-and-offic_mc-mod_x.schem`
- `transport_railway-station-building_mc-mod_x.schem`
- `residential_rainbow-lighthouse_mc-mod_x.schem`
- `towers_red-bureaucratic-office-building_mc-mod_x.schem`
- `public_renaissance-church-structure_mc-mod_x.schem`
- `bridges_river-crossing-bridge_mc-mod_x.schem`
- `public_rivertown-library-structure_mc-mod_x.schem`
- `residential_rustic-cottage-house-3_mc-mod_x.schem`
- `residential_rustic-furnished-wooden-house_mc-mod_x.schem`
- `residential_rustic-modern-house-with-pool-and-barn_mc-mod_x.schem`
- `bridges_rustic-stone-bridge_mc-mod_x.schem`
- `towers_rustic-wood-tower-build_mc-mod_x.schem`
- `commercial_rustic-wooden-shop-medium-size_mc-mod_x.schem`
- `residential_sam-and-taurtis-roleplay-house_mc-mod_x.schem`
- `transport_sand-palace-station_mc-mod_x.schem`
- `towers_sandstone-hotel_mc-mod_x.schem`
- `towers_sandstone-office-tower-126k-blocks_mc-mod_x.schem`
- `bridges_scalable-long-bridge_mc-mod_x.schem`
- `towers_seaside-lighthouse-tower_mc-mod_x.schem`
- `residential_seaside-multi-story-house_mc-mod_x.schem`
- `residential_secluded-cove-house-with-shops_mc-mod_x.schem`
- `commercial_shady-oaks-hotel-townhouse_mc-mod_x.schem`
- `towers_shard-tower-tall-unfurnished-structure_mc-mod_x.schem`
- `residential_shop-house-building_mc-mod_x.schem`
- `residential_shop-house-for-sale_mc-mod_x.schem`
- `residential_shop-or-house-design_mc-mod_x.schem`
- `towers_simple-defense-tower_mc-mod_x.schem`
- `industrial_simple-factory-shed_mc-mod_x.schem`
- `public_simple-minecraft-church-building_mc-mod_x.schem`
- `residential_simple-small-house_mc-mod_x.schem`
- `bridges_simple-stone-bridge_mc-mod_x.schem`
- `bridges_simple-stone-river-bridge_mc-mod_x.schem`
- `transport_simple-train-station_mc-mod_x.schem`
- `residential_simple-yellow-house_mc-mod_x.schem`
- `roads_six-lane-highway_mc-mod_x.schem`
- `towers_six-story-hotel-with-furnished-rooms_mc-mod_x.schem`
- `transport_six-story-parking-garage_mc-mod_x.schem`
- `towers_skyscraper-city-building_mc-mod_x.schem`
- `towers_skyscraper_mc-mod_x.schem`
- `residential_small-apartment-building_mc-mod_x.schem`
- `residential_small-asian-style-house_mc-mod_x.schem`
- `commercial_small-carwash-station_mc-mod_x.schem`
- `commercial_small-chapel-structure_mc-mod_x.schem`
- `commercial_small-church_mc-mod_x.schem`
- `commercial_small-concrete-bus-stop-schematic_mc-mod_x.schem`
- `commercial_small-desert-cactus-fountain_mc-mod_x.schem`
- `commercial_small-double-modern-church-with-interior_mc-mod_x.schem`
- `commercial_small-driving-school_mc-mod_x.schem`
- `commercial_small-faction-base-for-hardcore-players_mc-mod_x.schem`
- `commercial_small-factory-shell-template_mc-mod_x.schem`
- `residential_small-fancy-wooden-house_mc-mod_x.schem`
- `commercial_small-garden-fountain-3_mc-mod_x.schem`
- `residential_small-house-with-garden-path_mc-mod_x.schem`
- `commercial_small-minecraft-church-building_mc-mod_x.schem`
- `commercial_small-miscellaneous-structure-2_mc-mod_x.schem`
- `towers_small-office-building_mc-mod_x.schem`
- `commercial_small-open-cafe-design_mc-mod_x.schem`
- `commercial_small-police-car-schematic_mc-mod_x.schem`
- `residential_small-schoolhouse-with-blackboard_mc-mod_x.schem`
- `commercial_small-shop-building_mc-mod_x.schem`
- `commercial_small-shopping-mall_mc-mod_x.schem`
- `bridges_small-skybridge-design_mc-mod_x.schem`
- `commercial_small-spade-shop_mc-mod_x.schem`
- `commercial_small-terracotta-vase-decoration_mc-mod_x.schem`
- `commercial_small-underground-faction-shop_mc-mod_x.schem`
- `residential_small-waterfront-house_mc-mod_x.schem`
- `commercial_small-wooden-shop-with-multiple-entrances_mc-mod_x.schem`
- `residential_soviet-style-apartment-building_mc-mod_x.schem`
- `residential_spacious-mansion-with-park_mc-mod_x.schem`
- `parks_spawn-fountain-garden_mc-mod_x.schem`
- `public_st-pancras-old-church-exterior-replica_mc-mod_x.schem`
- `roads_standard-railroad-station_mc-mod_x.schem`
- `bridges_stone-and-wood-survival-bridge_mc-mod_x.schem`
- `public_stone-church-building_mc-mod_x.schem`
- `residential_storage-warehouse-building_mc-mod_x.schem`
- `residential_storage-warehouse-structure_mc-mod_x.schem`
- `bridges_subway-tunnel-structure_mc-mod_x.schem`
- `residential_survival-mansion-2-story-build_mc-mod_x.schem`
- `bridges_suspended-bridge-minecraft-build_mc-mod_x.schem`
- `bridges_suspension-cable-bridge_mc-mod_x.schem`
- `commercial_tails-workshop-recreation_mc-mod_x.schem`
- `residential_tall-orange-quartz-apartment-building_mc-mod_x.schem`
- `parks_technoblade-tribute-parkour-build_mc-mod_x.schem`
- `residential_ten-story-apartment-building_mc-mod_x.schem`
- `public_the-hidden-library-from-the-book_mc-mod_x.schem`
- `towers_tilted-office-building_mc-mod_x.schem`
- `public_tnt-museum_mc-mod_x.schem`
- `transport_town-parking-lot_mc-mod_x.schem`
- `roads_towny-road-system-cobblestone-construction_mc-mod_x.schem`
- `commercial_traditional-brick-home-with-garage_mc-mod_x.schem`
- `commercial_traditional-british-pub-building_mc-mod_x.schem`
- `transport_trainyard-automatic-refill-station_mc-mod_x.schem`
- `commercial_tropical-mine-and-shop_mc-mod_x.schem`
- `commercial_truck-stop-gas-station_mc-mod_x.schem`
- `residential_two-story-house-with-attic-and-balcony_mc-mod_x.schem`
- `transport_two-story-warehouse-with-parking_mc-mod_x.schem`
- `transport_underground-metro-station-design_mc-mod_x.schem`
- `transport_underground-metro-station-with-blue-train_mc-mod_x.schem`
- `towers_unfurnished-office-building-structure_mc-mod_x.schem`
- `industrial_urban-compressed-air-factory_mc-mod_x.schem`
- `residential_urban-warehouse-storage-building-2_mc-mod_x.schem`
- `residential_vehicle-warehouse-storage_mc-mod_x.schem`
- `residential_vibrant-yellow-modern-apartment-building_mc-mod_x.schem`
- `roads_vienna-street-house-65-build_mc-mod_x.schem`
- `roads_vienna-street-house-66_mc-mod_x.schem`
- `roads_vienna-street-house-68_mc-mod_x.schem`
- `roads_vienna-street-house-70-build_mc-mod_x.schem`
- `roads_vienna-street-house-71_mc-mod_x.schem`
- `roads_vienna-street-house-73_mc-mod_x.schem`
- `roads_vienna-street-house-74_mc-mod_x.schem`
- `roads_vienna-street-houses-2_mc-mod_x.schem`
- `transport_vintage-train-station-building_mc-mod_x.schem`
- `residential_warehouse-13-storage-building_mc-mod_x.schem`
- `residential_warehouse-with-movie-sets_mc-mod_x.schem`
- `towers_water-wall-skyscraper_mc-mod_x.schem`
- `transport_western-train-station-structure_mc-mod_x.schem`
- `commercial_wii-island-hotel_mc-mod_x.schem`
- `towers_willis-tower-overhaul-schematic_mc-mod_x.schem`
- `towers_willis-tower-skyscraper-build_mc-mod_x.schem`
- `bridges_wooden-bridge-design_mc-mod_x.schem`
- `bridges_wooden-bridge-with-fences_mc-mod_x.schem`
- `towers_working-lighthouse-tower_mc-mod_x.schem`
- `public_world-relics-museum-build_mc-mod_x.schem`
- `public_yandere-high-school-electric-chair-room_mc-mod_x.schem`
- `commercial_yetis-alpine-shop_mc-mod_x.schem`
- `parks_yin-yang-garden-fountain_mc-mod_x.schem`
- `towers_youcube-office-structure_mc-mod_x.schem`
- `towers_zambias-tallest-skyscraper-findeco-house_mc-mod_x.schem`
- `high-security-jail.schem`
- `modern_house_n_2.schem`
- `radeon-prison.schem`
- `decor_magenta-storage-container_mc-mod_1.21.8.schem`
- `decor_blue-container-outdoor-decoration_mc-mod_1.21.8.schem`
- `decor_pink-container-decoration_mc-mod_1.21.8.schem`
- `intersections_modern-city-stoplight_mc-mod_x.schematic`
- `waterfront_automatic-ice-boat-crossing_mc-mod_x.schematic`
- `roads_off-road-6x6-tanker-truck_mc-mod_x.schematic`
- `residential_toll-booth-structure_mc-mod_x.schematic`
- `roads_street-cleaning-tanker-truck_mc-mod_x.schematic`
- `roads_street-lantern_mc-mod_x.schematic`
- `decor_fallout-3-billboard-structure_mc-mod_x.schematic`
- `vehicles_garbage-truck-with-front-loader_mc-mod_x.schematic`
- `public_bedwars-bed-defence-structure_mc-mod_x.schematic`
- `decor_large-advertisement-billboard-structure_mc-mod_x.schematic`
- `vehicles_japanese-garbage-compactor-structure_mc-mod_x.schematic`
- `industrial_industrial-warehouse-fence-and-gate_mc-mod_x.schematic`
- `decor_meme-billboard-advertisement_mc-mod_x.schematic`
- `public_automatic-trashcan-build_mc-mod_x.schematic`
- `decor_fence-totem-structure_mc-mod_x.schematic`
- `vehicles_realistic-car-trailer-468-blocks_mc-mod_1.21.1.nbt`
- `vehicles_1994-nissan-dump-truck-vehicle_mc-mod_x.schematic`
- `vehicles_super-motorcycle-design_mc-mod_x.schematic`
- `vehicles_tow-truck-semi-trailer_mc-mod_x.schematic`
- `vehicles_aluminum-van-truck-6x6_mc-mod_x.schematic`
- `vehicles_industrial-iron-car-vehicle_mc-mod_1.21.1.nbt`
- `vehicles_1995-isuzu-forward-crane-truck_mc-mod_x.schematic`
- `vehicles_ten-wheeler-crane-tow-truck_mc-mod_x.schematic`
- `vehicles_fuso-fighter-wing-van-truck_mc-mod_x.schematic`
- `vehicles_car-carrier-truck-and-trailer_mc-mod_x.schematic`
- `vehicles_1998-isuzu-freezer-truck_mc-mod_x.schematic`
- `vehicles_heavy-duty-ambulance-vehicle_mc-mod_x.schematic`
- `vehicles_japanese-van-with-8-wheels_mc-mod_x.schematic`
- `vehicles_fuso-fighter-dump-truck-vehicle_mc-mod_x.schematic`
- `vehicles_fire-truck-with-manlift_mc-mod_x.schematic`
- `vehicles_decorated-10w-truck-van_mc-mod_x.schematic`
- `vehicles_crane-truck-with-car-carrier_mc-mod_x.schematic`
- `vehicles_fuso-fv411j-dump-truck-model_mc-mod_x.schematic`
- `vehicles_decorated-12-wheel-refrigerated-van_mc-mod_x.schematic`
- `vehicles_frog-driving-a-car_mc-mod_x.schematic`
- `vehicles_fuso-fighter-cargo-truck-detailed-build_mc-mod_x.schematic`
- `vehicles_decorated-japanese-refrigerated-van_mc-mod_x.schematic`
- `vehicles_fallout-3-inspired-car-schematic_mc-mod_x.schematic`
- `vehicles_tractor-with-cometto-trailer_mc-mod_x.schematic`
- `vehicles_decorated-refrigerated-van_mc-mod_x.schematic`
- `vehicles_fallout-3-style-car-no-engine_mc-mod_x.schematic`
- `vehicles_aluminum-wing-van-truck-with-solar-radiator_mc-mod_x.schematic`
- `vehicles_fallout-3-car-replica_mc-mod_x.schematic`
- `vehicles_cometto-self-propelled-trailer_mc-mod_x.schematic`
- `vehicles_secure-transport-van_mc-mod_x.schematic`
- `vehicles_thomas-and-friends-candy-car_mc-mod_x.schematic`
- `vehicles_heavy-duty-14-wheeler-dump-truck_mc-mod_x.schematic`
- `vehicles_refrigerated-double-cab-van_mc-mod_x.schematic`
- `vehicles_concrete-pump-truck-with-derricks_mc-mod_x.schematic`
- `vehicles_10-wheeler-wing-van-truck-and-trailer_mc-mod_x.schematic`
- `vehicles_sdkfz-222-armored-car_mc-mod_x.schematic`
- `vehicles_heavy-crane-truck_mc-mod_x.schematic`
- `vehicles_fruehauf-empty-can-van-trailer_mc-mod_x.schematic`
- `vehicles_armored-snow-patrol-truck_mc-mod_x.schematic`
- `vehicles_9-block-long-van-box-truck-compartment_mc-mod_x.schematic`
- `vehicles_small-car-dealership-building_mc-mod_x.schematic`
- `vehicles_heavy-tractor-head-and-van-trailer_mc-mod_x.schematic`
- `vehicles_double-cab-pickup-truck_mc-mod_x.schematic`
- `vehicles_massive-haul-truck_mc-mod_x.schematic`
- `transport_acacia-spruce-small-aircraft-hangar_mc-mod_1.20.1.nbt`
- `transport_small-garden-with-wither-platform_mc-mod_x.schematic`
- `transport_abandoned-town-with-subway-system_mc-mod_x.schematic`
- `transport_minecraft-airport-terminal-building_mc-mod_x.schematic`
- `transport_fallout-3-red-rocket-gas-station_mc-mod_x.schematic`
- `transport_aircraft-hangar-structure_mc-mod_x.schematic`
- `transport_small-village-train-station_mc-mod_x.schematic`
- `transport_subway-station-build_mc-mod_1.19.schem`
- `transport_minecraft-airport-terminal-build_mc-mod_x.schematic`
- `transport_modern-gas-station-with-shop-and-tankers_mc-mod_x.schematic`
- `public_airfield-and-barracks-structure_mc-mod_x.schematic`
- `transport_wooden-platform-for-ravines-and-cliffs_mc-mod_x.schematic`
- `transport_small-gas-station-with-custom-blocks_mc-mod_x.schematic`
- `transport_obsidian-runway-build_mc-mod_x.schematic`
- `transport_long-cargo-platform_mc-mod_x.schematic`
- `transport_modern-fueling-station_mc-mod_1.19.2.schem`
- `transport_castiamc-lobby-platform-build_mc-mod_x.schematic`
- `transport_16x16-plains-train-station_mc-mod_1.21.1.nbt`
- `transport_ancient-mayan-depot-house_mc-mod_1.20.4.schem`
- `transport_minecart-dropper-station_mc-mod_x.schematic`
- `transport_modern-wi-fi-station-tower_mc-mod_x.schematic`
- `transport_customs-station-building_mc-mod_1.17.1.schem`
- `transport_minecraft-fire-station-and-football-field_mc-mod_1.19.4.schem`
- `waterfront_small-fishing-boat-with-storage_mc-mod_x.schematic`
- `waterfront_lostsea-ocean-village-with-ships_mc-mod_x.schematic`
- `waterfront_asian-style-dock_mc-mod_x.schematic`
- `waterfront_trading-ship-small-creative-build_mc-mod_x.schematic`
- `waterfront_diagonal-port-structure_mc-mod_x.schematic`
- `waterfront_axiumsa-luxury-liner-modern-yacht_mc-mod_x.schematic`
- `waterfront_corvette-tuna-naval-cannon-ship_mc-mod_x.schematic`
- `waterfront_moderate-size-dock-with-chests_mc-mod_x.schematic`
- `waterfront_imposing-flying-ship-design_mc-mod_x.schematic`
- `waterfront_coastal-port-village_mc-mod_x.schematic`
- `waterfront_gretjoy-boat-build_mc-mod_x.schematic`
- `waterfront_german-train-ferry-preussen-1909-ship-recreation_mc-mod_x.schematic`
- `waterfront_modern-port-town_mc-mod_1.15.2.schem`
- `waterfront_luxury-yacht-quartz-block-design_mc-mod_x.schematic`
- `waterfront_oak-sailing-ship_mc-mod_x.schematic`
- `waterfront_modern-vip-yacht_mc-mod_x.schematic`
- `waterfront_fishermans-hut-with-boat_mc-mod_x.schematic`
- `waterfront_three-masted-sailing-ship_mc-mod_x.schematic`
- `waterfront_sloop-boat_mc-mod_x.schematic`
- `waterfront_ancient-roman-galley-ship_mc-mod_x.schematic`
- `waterfront_small-fishing-trawler-boat_mc-mod_x.schematic`
- `waterfront_chinese-junk-ship_mc-mod_x.schematic`
- `public_minecraft-vet-clinic-building_mc-mod_x.schematic`
- `vehicles_futuristic-police-space-vehicle_mc-mod_x.schematic`
- `public_small-town-hall_mc-mod_x.schematic`
- `public_stone-library-outpost_mc-mod_x.schematic`
- `public_yandere-high-school-insane-rooms_mc-mod_x.schematic`
- `public_fallout-drive-in-movie-theater_mc-mod_x.schematic`
- `public_small-prison-structure_mc-mod_x.schematic`
- `vehicles_prison-transport-bus-for-police_mc-mod_x.schematic`
- `public_old-town-hall_mc-mod_x.schematic`
- `public_enchanted-library-building_mc-mod_1.14.4.schematic`
- `public_minecraft-theatre-stage-design_mc-mod_x.schematic`
- `public_prison-mining-outpost_mc-mod_x.schematic`
- `public_courthouse-design_mc-mod_x.schematic`
- `public_cozy-village-library_mc-mod_1.16.5.schem`
- `public_ancient-greek-theatre_mc-mod_x.schematic`
- `public_mastermind-prison-mine_mc-mod_x.schematic`
- `public_server-town-hall-building_mc-mod_x.schematic`
- `public_repaired-stronghold-with-libraries_mc-mod_1.20.1.schem`
- `public_wooden-amphitheatre-structure_mc-mod_1.16.3.schem`
- `vehicles_prisoner-transport-truck-vehicle_mc-mod_x.schematic`
- `public_britain-s-got-talent-theatre-with-interior_mc-mod_1.16.5.schem`
- `public_simple-jail-structure_mc-mod_x.schematic`
- `public_quartz-town-hall-versatile-design_mc-mod_x.schematic`
- `public_ancient-mayan-amphitheater-structure_mc-mod_1.20.1.schem`
- `public_bedrock-prison-structure_mc-mod_1.16.4.schem`
- `public_simple-town-hall-design_mc-mod_x.schematic`
- `public_covid-19-testing-town-hall-center_mc-mod_x.schematic`
- `public_corner-cinema-and-houses_mc-mod_1.14.4.schem`
- `public_basic-city-hall-for-small-towns_mc-mod_1.15.2.schem`
- `public_grand-performance-theatre_mc-mod_1.14.4.schem`
- `vehicles_european-style-prison-bus_mc-mod_1.18.1.schem`
- `public_hermitcraft-season-7-town-hall-replica_mc-mod_1.16.5.schem`
- `public_french-town-hall-building_mc-mod_1.16.5.schem`
- `public_simple-courthouse-design-v2_mc-mod_1.16.5.schem`
- `public_town-hall-building-2_mc-mod_1.17.1.schem`
- `public_village-town-hall-building_mc-mod_x.schematic`
- `industrial_diorite-stone-factory-2605-blocks_mc-mod_1.21.1.nbt`
- `industrial_industrial-warehouse-building_mc-mod_x.schematic`
- `towers_rustic-water-tower_mc-mod_1.16.3.schem`
- `industrial_fallout-3-style-grain-silo_mc-mod_x.schematic`
- `industrial_small-industrial-factory-structure_mc-mod_x.schematic`
- `industrial_granite-concrete-factory-8286-blocks_mc-mod_1.21.1.nbt`
- `industrial_village-warehouse-structure_mc-mod_x.schematic`
- `towers_solarpunk-quartz-tower_mc-mod_1.20.1.schem`
- `industrial_modern-water-mill-structure_mc-mod_x.schematic`
- `industrial_spacious-industrial-warehouse-building_mc-mod_x.schematic`
- `industrial_stone-brick-factory-building_mc-mod_1.20.1.nbt`
- `industrial_industrial-warehouse-storage-facility_mc-mod_x.schematic`
- `industrial_minecraft-lumber-mill-structure_mc-mod_x.schematic`
- `industrial_industrial-pipe-with-pressure-gauge_mc-mod_x.schematic`
- `industrial_warehouse-7-industrial-building_mc-mod_x.schematic`
- `bridges_industrial-style-bridge_mc-mod_x.schematic`
- `industrial_industrial-factory-hall_mc-mod_x.schematic`
- `industrial_create-mod-birch-lumber-mill-and-factory_mc-mod_1.21.1.nbt`
- `industrial_rustic-wood-workshop_mc-mod_x.schematic`
- `industrial_abandoned-textile-mill-structure_mc-mod_x.schematic`
- `industrial_create-mod-basic-workshop_mc-mod_1.21.1.nbt`
- `industrial_create-mod-andesite-factory_mc-mod_1.21.1.nbt`
- `industrial_mega-clothing-store-with-workshop_mc-mod_1.14.4.schem`
- `industrial_create-16x16-andesite-alloy-factory_mc-mod_1.21.1.nbt`
- `industrial_aik-foundry-structure_mc-mod_1.14.4.schem`
- `industrial_factory-build-v3_mc-mod_1.20.1.nbt`
- `industrial_advanced-syngas-industrial-complex_mc-mod_x.schematic`
- `industrial_create-mod-gravel-factory-16x16_mc-mod_1.21.1.nbt`
- `industrial_create-mod-andesite-factory-16x16-taiga_mc-mod_1.21.1.nbt`
- `industrial_industrial-style-modern-house_mc-mod_1.14.4.schem`
- `industrial_create-mod-andesite-factory-in-16x16-chunk_mc-mod_1.21.1.nbt`
- `industrial_industrial-style-house_mc-mod_1.14.4.schem`
- `industrial_industrial-factory-building-4_mc-mod_1.14.4.schem`
- `commercial_rustic-farmhouse-shop_mc-mod_x.schematic`
- `residential_town-layout-with-plots-for-houses-and-markets_mc-mod_x.schematic`
- `commercial_modern-mcdonalds-restaurant-with-exterior_mc-mod_x.schematic`
- `commercial_union-bank-building_mc-mod_x.schematic`
- `commercial_classical-greek-market_mc-mod_1.21.schem`
- `commercial_unique-treehouse-restaurant_mc-mod_x.schematic`
- `commercial_the-x-mall_mc-mod_1.16.4.schem`
- `commercial_witchs-potion-shop-house_mc-mod_x.schematic`
- `commercial_fallout-3-diner-restaurant-build_mc-mod_x.schematic`
- `commercial_gold-bank-vault-tower_mc-mod_x.schematic`
- `commercial_modern-shopping-mall_mc-mod_1.14.4.schem`
- `commercial_birch-blacksmith-shop_mc-mod_x.schematic`
- `commercial_seabubbles-cafe-building_mc-mod_x.schematic`
- `commercial_blacksmith-shop-structure_mc-mod_x.schematic`
- `commercial_joes-diner-restaurant_mc-mod_x.schematic`
- `commercial_brick-blacksmith-shop_mc-mod_x.schematic`
- `commercial_modern-fast-food-restaurant_mc-mod_x.schematic`
- `commercial_blacksmith-shop-npc_mc-mod_x.schematic`
- `commercial_mcdonalds-restaurant-with-play-area_mc-mod_x.schematic`
- `commercial_blacksmith-shop-in-jungle-setting_mc-mod_x.schematic`
- `commercial_spanish-italian-fusion-restaurant_mc-mod_x.schematic`
- `commercial_oak-blacksmith-shop_mc-mod_x.schematic`
- `commercial_mcdonalds-restaurant-building_mc-mod_x.schematic`
- `commercial_blacksmith-shop-sandstone-design_mc-mod_x.schematic`
- `commercial_restaurant-bar-towers_mc-mod_1.14.2.schematic`
- `commercial_spruce-blacksmith-shop_mc-mod_x.schematic`
- `commercial_mcdonalds-restaurant_mc-mod_x.schematic`
- `commercial_blacksmith-shop-exterior_mc-mod_x.schematic`
- `commercial_small-minecraft-bakery-shop_mc-mod_x.schematic`
- `commercial_restaurant-building_mc-mod_x.schematic`
- `commercial_gucci-store_mc-mod_x.schematic`
- `towers_quartz-gold-modern-office-tower_mc-mod_x.schematic`
- `public_cobblestone-and-glass-portal-towers_mc-mod_x.schematic`
- `towers_abandonedcraft-fortress-tower_mc-mod_x.schematic`
- `towers_big-bend-skyscraper-600m-tall_mc-mod_x.schematic`
- `towers_desert-tower-with-enchanting-room_mc-mod_x.schematic`
- `public_rustic-village-with-longhouse-and-towers_mc-mod_x.schematic`
- `public_desert-water-temple-with-symmetrical-towers_mc-mod_x.schematic`
- `towers_block-showcase-tower-with-mini-biomes_mc-mod_x.schematic`
- `towers_steampunk-skyscraper-model_mc-mod_1.19.3.schem`
- `towers_crusader-style-small-tower_mc-mod_x.schematic`
- `towers_steampunk-skyscraper-model-4_mc-mod_1.19.3.schem`
- `towers_stone-tower-with-automatic-lighting_mc-mod_x.schematic`
- `towers_steampunk-skyscraper-model-5-tower_mc-mod_1.19.3.schem`
- `towers_eiffel-tower_mc-mod_x.schematic`
- `towers_tower-trivia-game-show_mc-mod_x.schematic`
- `towers_enchanted-end-stone-brick-tower_mc-mod_x.schematic`
- `towers_maxs-tower-outpost_mc-mod_x.schematic`
- `towers_big-ben-clock-tower-replica-oak-birch-build_mc-mod_x.schematic`
- `residential_small-storage-house-2_mc-mod_x.schematic`
- `residential_spacious-modern-mansion-estate_mc-mod_x.schematic`
- `residential_modern-quartz-and-dirt-residence_mc-mod_x.schematic`
- `residential_medium-town-house-with-three-floors_mc-mod_x.schematic`
- `residential_medium-brick-cottage-house_mc-mod_x.schematic`
- `residential_modern-house-design-with-soartex-textures_mc-mod_x.schematic`
- `residential_small-decorative-town-house_mc-mod_x.schematic`
- `residential_starter-cottage-oak-quartz_mc-mod_x.schematic`
- `residential_basic-house-structure_mc-mod_x.schematic`
- `residential_large-estate-house_mc-mod_x.schematic`
- `residential_furnished-brick-townhouse_mc-mod_x.schematic`
- `residential_cozy-small-wooden-cottage_mc-mod_x.schematic`
- `residential_snowy-small-house_mc-mod_x.schematic`
- `residential_spacious-modern-mansion-with-furnished-interior_mc-mod_x.schematic`
- `residential_contemporary-residence-schematic_mc-mod_x.schematic`
- `residential_condensed-townhouse-compound-structure_mc-mod_x.schematic`
- `residential_rustic-log-cabin-house_mc-mod_x.schematic`
- `residential_small-house-with-kitchen-and-shower_mc-mod_x.schematic`
- `residential_large-three-story-mansion_mc-mod_x.schematic`
- `residential_large-modern-villa-residence_mc-mod_x.schematic`
- `residential_cozy-town-house-with-hay-roof_mc-mod_x.schematic`
- `residential_birch-cottage-house-with-furnishings_mc-mod_x.schematic`
- `residential_cozy-hillside-house_mc-mod_x.schematic`
- `residential_small-villa-house-with-storage_mc-mod_x.schematic`
- `residential_modern-villa-residence-dirt-white-concrete_mc-mod_x.schematic`
- `residential_rustic-country-cottage_mc-mod_x.schematic`
- `residential_rustic-3-story-mansion_mc-mod_x.schematic`
- `residential_small-brick-townhouse-with-jack-o-lanterns_mc-mod_1.19.2.schem`
- `residential_spruce-log-cabin-house_mc-mod_x.schematic`
- `residential_asian-style-house-with-furnished-interior_mc-mod_x.schematic`
- `residential_modern-blue-villa_mc-mod_x.schematic`
- `parks_modern-square-residence_mc-mod_x.schematic`
- `public_new-york-style-townhouses-with-pool_mc-mod_1.19.4.schem`
- `residential_cozy-woodcutter-s-cottage_mc-mod_x.schematic`
- `residential_modern-two-story-house-over-pond_mc-mod_x.schematic`
- `residential_modern-mansion-with-fire-safety-upgrades_mc-mod_x.schematic`
- `residential_simple-birch-cottage_mc-mod_1.16.1.schem`
- `vehicles_snowy-house-and-vehicles_mc-mod_1.21.1.nbt`
- `parks_piston-fountain-small-garden-feature_mc-mod_x.schematic`
- `parks_mini-hedge-maze-with-cave-entrance_mc-mod_x.schematic`
- `parks_small-town-square_mc-mod_x.schematic`
- `parks_rustic-farmhouse-with-garden-and-pond_mc-mod_x.schematic`
- `parks_sea-creature-park-megalodon-whale_mc-mod_x.schematic`
- `parks_small-garden-oasis_mc-mod_x.schematic`
- `parks_village-fountain_mc-mod_x.schematic`
- `parks_soviet-style-city-square_mc-mod_x.schematic`
- `parks_two-cubes-modern-house-with-garden-pool_mc-mod_x.schematic`
- `parks_park-ball-structure_mc-mod_x.schematic`
- `parks_creeper-head-fountain_mc-mod_x.schematic`
- `parks_simple-minecraft-tree_mc-mod_x.schematic`
- `parks_gothic-square-structure_mc-mod_1.20.1.schem`
- `parks_olive-garden-restaurant-salt-lake-city_mc-mod_1.16.5.schem`
- `parks_playground-park-for-minecrafty-town_mc-mod_1.19.4.schem`
- `parks_survival-sphere-house-and-garden_mc-mod_x.schematic`
- `parks_spanish-moss-oak-tree_mc-mod_x.schematic`
- `parks_cozy-brick-home-with-garden-and-storage_mc-mod_x.schematic`
- `parks_medium-palm-tree-with-cocoa-pods_mc-mod_x.schematic`
- `parks_beautiful-garden_mc-mod_x.schematic`
- `parks_tropical-palm-tree_mc-mod_x.schematic`
- `parks_rustic-garden-shed_mc-mod_x.schematic`
- `parks_small-oak-decorative-tree_mc-mod_x.schematic`
- `parks_small-tree-decoration_mc-mod_x.schematic`
- `parks_3tris-modern-garden-structure_mc-mod_x.schematic`
- `parks_decorative-lantern-tree_mc-mod_x.schematic`
- `parks_cozy-house-with-garden-and-garage_mc-mod_x.schematic`
- `parks_japanese-garden-house-spruce-dark-oak_mc-mod_x.schematic`
- `parks_massive-tree-structure_mc-mod_x.schematic`
- `parks_large-romantic-tree_mc-mod_x.schematic`
- `parks_custom-birch-tree-decoration_mc-mod_x.schematic`
- `intersections_intersection-road_mcbuild_x.schem`
- `intersections_sewer-template-intersection-shape_mcbuild_x.schem`
- `intersections_drive-on-the-right-dual-simplex-minecart-track-intersectio_mcbuild_x.schem`
- `intersections_intersection_mcbuild_x.schem`
- `intersections_stoplight_mcbuild_x.schem`
- `roads_ride-road-build_buildschematics_x.schematic`
- `roads_high-speed-quartz-road_buildschematics_x.schematic`
- `roads_fast-road-car-structure_buildschematics_x.nbt`
- `intersections_wild-west-crossroad_mcbuild_x.schem`
- `roads_road-b-normal-two-way-street_mcbuild_x.schem`
- `roads_cobble-towny-road-system_mcbuild_x.schem`
- `roads_decorative-street-lamp_mcbuild_x.schem`
- `roads_terraced-shop-with-sidewalk_buildschematics_x.schematic`
- `vehicles_bus-stop_mcbuild_x.schem`
- `vehicles_bus-stop_mcbuild_x-2.schem`
- `vehicles_bus-stop_mcbuild_x-3.schem`
- `transport_minecraft-airport-runway_buildschematics_x.nbt`
- `transport_airport_mcbuild_x.schem`
- `public_modern-hospital-building_buildschematics_x.schematic`
- `public_two-story-hospital-building_buildschematics_x.schematic`
- `public_huge-modern-hospital_mcbuild_x.schem`
- `public_hospital_mcbuild_x.schem`
- `transport_police-station-with-jail_buildschematics_x.schematic`
- `transport_city-police-station-building_buildschematics_x.schematic`
- `transport_police-station-modern-police-station_mcbuild_x.schem`
- `transport_police-station-complete-version_mcbuild_x.schem`
- `transport_police-station_mcbuild_x.schem`
- `transport_fire-station-building_buildschematics_x.schematic`
- `transport_fire-station-house_buildschematics_x.schematic`
- `transport_fire-station_mcbuild_x.schem`
- `transport_fire-station_mcbuild_x-2.schem`
- `public_equipped-firestation_mcbuild_x.schem`
- `transport_fire-station_mcbuild_x-3.schem`
- `public_sims-3-style-city-hall_buildschematics_x.schematic`
- `public_city-hall_mcbuild_x.schem`
- `public_town-hall_mcbuild_x.schem`
- `public_theater_mcbuild_x.schem`
- `public_greek-theater_mcbuild_x.schem`
- `public_theater_mcbuild_x-2.schem`
- `public_shakespears-theater_mcbuild_x.schem`
- `public_modern-twin-cinema-building_buildschematics_x.schematic`
- `public_multi-room-cinema-with-concessions_buildschematics_x.schematic`
- `public_6-room-cinema_mcbuild_x.schem`
- `public_twin-cinema-complex_mcbuild_x.schem`
- `public_cinema_mcbuild_x.schem`
- `industrial_128ksu-power-plant-structure_buildschematics_x.nbt`
- `industrial_massive-steam-power-plant_buildschematics_x.nbt`
- `industrial_pixelmon-maze-power-plant_buildschematics_x.schematic`
- `industrial_256-block-power-plant-structure_buildschematics_x.nbt`
- `industrial_power-plant_mcbuild_x.schem`
- `industrial_pixelmon-power-plant_mcbuild_x.schem`
- `industrial_fallout-3-substation-v1-zth_mcbuild_x.schem`
- `industrial_fallout-3-substation-v2-zth_mcbuild_x.schem`
- `towers_barn-with-water-tower_mcbuild_x.schem`
- `towers_modern-water-tower_mcbuild_x.schem`
- `towers_water-tower-by-iedgy_mcbuild_x.schem`
- `public_double-sided-sony-logo-billboard_buildschematics_x.schematic`
- `public_quot-do-you-even-shift-bro-quot-billboard_mcbuild_x.schem`
- `public_large-billboard_mcbuild_x.schem`
- `decor_fallout-3-billboard-zth_mcbuild_x.schem`
- `public_workbench_mcbuild_x.schem`
- `public_toyland-fisherprice-workbench_mcbuild_x.schem`
- `transport_small-gas-station-and-store_buildschematics_x.schematic`
- `transport_gas-station_mcbuild_x.schem`
- `transport_gas-station-3_mcbuild_x.schem`
- `transport_petrol-gas-station_mcbuild_x.schem`
- `transport_sheetz-gas-station_mcbuild_x.schem`
- `public_art-school-building_buildschematics_x.schematic`
- `public_german-school-building_buildschematics_x.schematic`
- `public_pixelmon-school-building_buildschematics_x.schematic`
- `public_school_mcbuild_x.schem`
- `public_secondary-school-le_mcbuild_x.schem`
- `public_small-soccer-stadium-build_buildschematics_x.schem`
- `public_apocalyptic-prison-mine_buildschematics_x.schematic`
- `public_small-prison-building_buildschematics_x.schematic`
- `public_desert-prison-structure_buildschematics_x.schematic`
- `public_sand-prison_mcbuild_x.schem`
- `public_jail-prison_mcbuild_x.schem`
- `industrial_storage-warehouse_buildschematics_x.nbt`
- `industrial_storage-warehouse-v1_buildschematics_x.nbt`
- `industrial_large-warehouse_mcbuild_x.schem`
- `industrial_warehouse_mcbuild_x.schem`
- `industrial_warehouse-11_mcbuild_x.schem`
- `transport_9-story-parking-garage_mcbuild_x.schem`
- `transport_six-story-parking-lot_mcbuild_x.schem`
- `vehicles_ambulance_mcbuild_x.schem`
- `transport_train-station_mcbuild_x-2.schem`
- `transport_train-station-like-structure_mcbuild_x.schem`
- `transport_nice-village-train-station_mcbuild_x.schem`
- `transport_st-thomas-underground-train-station_mcbuild_x.schem`
- `roads_compact-3x3-tunnel-drill_buildschematics_x.nbt`
- `roads_railway-tunnel_mcbuild_x.schem`
- `roads_tunnel-lighting_mcbuild_x.schem`
- `parks_chafariz-fonte-fountain-02_mcbuild_x.schem`
- `parks_4-sword-fountain_mcbuild_x.schem`
- `waterfront_alexandria-s-lighthouse_mcbuild_x.schem`
- `waterfront_stone-lighthouse-with-working-fireplace_mcbuild_x.schem`
- `residential_modern-lakeside-townhouse_buildschematics_x.schematic`
- `residential_townhouse-7_mcbuild_x.schem`
- `towers_office-building_mcbuild_x.schem`
- `towers_ten-story-office-building_mcbuild_x.schem`
- `intersections_drive-on-the-left-dual-simplex-minecart-track-intersection_mcbuild_x.schem`
- `intersections_4-way-intersection-redstone_mcbuild_x.schem`
- `intersections_ancient-skyway-modified-t-junction_mcbuild_x.schem`
- `roads_highway-part-1_mcbuild_x.schem`
- `roads_highway-part-2_mcbuild_x.schem`
- `roads_highway-part-3_mcbuild_x.schem`
- `roads_highway_mcbuild_x.schem`
- `intersections_railway-junction-train-station-base_buildschematics_x.nbt`
