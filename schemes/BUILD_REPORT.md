# Отчёт по качеству каталога построек

Дата: 2026-09-28 · объектов: **1160** · проанализировано картинок: **1160**

Для каждой постройки проверялось три вещи: **подходит ли название** к тому, что на превью, **подходит ли категория** и **подходят ли теги**.
Источники фактов: картинка (`schemes/thumbs/*.png` — глазами) + метаданные (`tools/metadata-audit.mjs` — правила по словам в названии).

## Сводка

| проверка | результат |
|---|---|
| Название ↔ картинка | **87%** (877 совпадает, 262 частично, 21 не совпадает, 0 не читается) |
| Категория ↔ картинка | **86%** (998 подходит, 162 не подходит) |
| Теги ↔ картинка | **72%** (836 подходят, 38 не хватает, 286 лишние) |

Итоговый вердикт по объекту:

| вердикт | кол-во | доля |
|---|---|---|
| OK | 604 | 52% |
| мелочь | 385 | 33% |
| РАСХОЖДЕНИЕ | 171 | 15% |

Флаги (наложение правил по названию и того, что видно на картинке):

| флаг | кол-во |
|---|---|
| meta-word-in-name | 147 |
| non-building-in-name | 80 |
| franchise | 79 |
| duplicate-name | 67 |
| fantasy | 25 |
| non-real/fantasy | 24 |
| vehicle | 23 |
| empty | 10 |
| text | 10 |
| almost-empty | 3 |

## По категориям

| категория | всего | вердикт OK | мелочь | расхождение | сломано | категория≠картинка | название≠картинка |
|---|---|---|---|---|---|---|---|
| roads | 22 | 15 | 5 | 2 | 0 | 2 | 0 |
| intersections | 13 | 7 | 6 | 0 | 0 | 0 | 0 |
| residential | 295 | 166 | 104 | 25 | 0 | 25 | 1 |
| commercial | 120 | 52 | 41 | 27 | 0 | 25 | 3 |
| public | 143 | 72 | 46 | 25 | 0 | 23 | 4 |
| towers | 139 | 87 | 40 | 12 | 0 | 12 | 1 |
| parks | 59 | 27 | 27 | 5 | 0 | 3 | 2 |
| industrial | 85 | 34 | 29 | 22 | 0 | 22 | 2 |
| transport | 85 | 39 | 35 | 11 | 0 | 10 | 0 |
| bridges | 41 | 29 | 10 | 2 | 0 | 1 | 0 |
| decor | 50 | 16 | 13 | 21 | 0 | 21 | 7 |
| vehicles | 70 | 41 | 14 | 15 | 0 | 14 | 1 |
| waterfront | 38 | 19 | 15 | 4 | 0 | 4 | 0 |

Куда по картинке переносили (топ переходов):

- commercial→commercial — 25
- residential→residential — 25
- public→public — 23
- industrial→industrial — 22
- decor→decor — 21
- vehicles→vehicles — 14
- towers→towers — 12
- transport→transport — 10
- waterfront→waterfront — 4
- parks→parks — 3
- roads→roads — 2
- bridges→bridges — 1

## Проблемные объекты

Всего 483 записей (сломано, расхождение, флаг или категория не по картинке). Порядок: сначала худшие.

### Steampunk Bridge

- файл: `bridges_steampunk-bridge_mcbuild_x.schem` · категория: **bridges** · теги: bridge|large|tall · 49x66x93 · 19638 блоков · источник: mcbuild
- превью: `schemes/thumbs/bridges_steampunk-bridge_mcbuild_x.png`
- вердикт: РАСХОЖДЕНИЕ · флаги: fantasy, non-real/fantasy
- комментарий: парящие зелёные острова с деревянным переходом и свисающими столбами воды, стимпанк-механики нет

### Immersive Railroading Bridge

- файл: `roads_immersive-railroading-bridge_mc-mod_x.schem` · категория: **bridges** · теги: bridge|road|small · 11x8x40 · 611 блоков · источник: mc-mod
- превью: `schemes/thumbs/roads_immersive-railroading-bridge_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «bridges» не по картинке → bridges
- комментарий: видны лишь бетонные устои без пролёта, путь едва читается

### City Gas Station

- файл: `public_city-gas-station_buildschematics_x.schem` · категория: **commercial** · теги: medium|station · 48x11x39 · 4306 блоков · источник: buildschematics
- превью: `schemes/thumbs/public_city-gas-station_buildschematics_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «commercial» не по картинке → commercial · разошлись правила и картинка (words→transport, image→commercial)
- комментарий: Заправка с навесом и колонками на площадке — это коммерция, а не общественное здание.

### Modern Hotel Building With Fountain

- файл: `towers_modern-hotel-building-with-fountain_buildschematics_x.schem` · категория: **commercial** · теги: hotel|medium|modern · 66x31x48 · 17840 блоков · источник: buildschematics
- превью: `schemes/thumbs/towers_modern-hotel-building-with-fountain_buildschematics_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «commercial» не по картинке → commercial · теги: -fountain -water
- комментарий: низкий серо-коричневый корпус на площадке, ни фонтана, ни воды не видно, башня это не

### Market with the villagers

- файл: `residential_market-with-the-villagers_mcbuild_x.schem` · категория: **commercial** · теги: house|shop|small · 28x22x15 · 3915 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_market-with-the-villagers_mcbuild_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «commercial» не по картинке → commercial
- комментарий: рыночная площадка под серым навесом с прилавками и сеном — торговля

### Building Contractors Office

- файл: `towers_building-contractors-office_mc-mod_x.schem` · категория: **commercial** · теги: medium · 48x25x80 · 13023 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_building-contractors-office_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «commercial» не по картинке → commercial · теги: -office
- комментарий: участок подрядчика: несколько низких построек и опоры, ни башни ни офиса не видно

### City Hotel With Penthouses

- файл: `towers_city-hotel-with-penthouses_mc-mod_x.schem` · категория: **commercial** · теги: hotel|house|medium · 44x34x52 · 18781 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_city-hotel-with-penthouses_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «commercial» не по картинке → commercial · разошлись правила и картинка (words→residential, image→commercial)
- комментарий: широкий отель на шесть-семь этажей с балконами и навесом, башня это не башня

### Compact Highway Gas Station

- файл: `roads_compact-highway-gas-station_mc-mod_x.schem` · категория: **commercial** · теги: medium|road|station · 41x13x60 · 7769 блоков · источник: mc-mod
- превью: `schemes/thumbs/roads_compact-highway-gas-station_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «commercial» не по картинке → commercial
- комментарий: заправка у трассы с навесом и площадкой — это коммерция, а не дорожная постройка

### Compact Two-Story Office Building

- файл: `towers_compact-two-story-office-building_mc-mod_x.schem` · категория: **commercial** · теги: medium|office · 57x27x63 · 27435 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_compact-two-story-office-building_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «commercial» не по картинке → commercial
- комментарий: плоский двухэтажный офисный корпус, к башням не относится

### Hotel Honk House

- файл: `towers_hotel-honk-house_mc-mod_x.schem` · категория: **commercial** · теги: hotel|medium · 41x37x38 · 23840 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_hotel-honk-house_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «commercial» не по картинке → commercial · теги: -house · разошлись правила и картинка (words→residential, image→commercial)
- комментарий: длинный стеклянный павильон-ангар, на башню и дом не тянет

### Minecraft Casino Mansion Structure

- файл: `residential_minecraft-casino-mansion-structure_mc-mod_x.schem` · категория: **commercial** · теги: house|huge|tall · 79x93x92 · 49502 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_minecraft-casino-mansion-structure_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «commercial» не по картинке → commercial · флаги: franchise, meta-word-in-name
- комментарий: крупное здание с гигантским колесом на кровле — это казино, а не жилой дом

### Mini Shop Blockhouse

- файл: `residential_mini-shop-blockhouse_mc-mod_x.schem` · категория: **commercial** · теги: shop|tiny · 3x2x6 · 29 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_mini-shop-blockhouse_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «commercial» не по картинке → commercial · теги: -house
- комментарий: крохотная будка с прилавком — это ларёк, а не жилой дом

### Modern 3 Story Office Building

- файл: `towers_modern-3-story-office-building_mc-mod_x.schem` · категория: **commercial** · теги: modern|office|small · 33x16x25 · 3126 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_modern-3-story-office-building_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «commercial» не по картинке → commercial
- комментарий: низкое трёхэтажное здание с террасой на кровле, к башням не относится

### Modern Business Building

- файл: `transport_modern-business-building_mc-mod_x.schem` · категория: **commercial** · теги: medium|modern · 37x11x45 · 5916 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_modern-business-building_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «commercial» не по картинке → commercial · флаги: non-building-in-name · разошлись правила и картинка (words→vehicles, image→commercial)
- комментарий: низкое остеклённое здание офисного вида, к транспорту отношения не имеет

### Modern Four Story Shopping Mall With Roads

- файл: `roads_modern-four-story-shopping-mall-with-roads_mc-mod_x.schem` · категория: **commercial** · теги: medium|modern|road · 28x28x36 · 2661 блоков · источник: mc-mod
- превью: `schemes/thumbs/roads_modern-four-story-shopping-mall-with-roads_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «commercial» не по картинке → commercial · теги: -shop
- комментарий: Глухая коричневая коробка без витрин, это здание а не дорога

### Modern Office Building Sketch

- файл: `towers_modern-office-building-sketch_mc-mod_x.schem` · категория: **commercial** · теги: medium|modern|office · 31x34x36 · 6368 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_modern-office-building-sketch_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «commercial» не по картинке → commercial
- комментарий: Приземистый офис-куб, к башням не относится

### Octagonal Hotel Interior Design

- файл: `towers_octagonal-hotel-interior-design_mc-mod_x.schem` · категория: **commercial** · теги: hotel|medium · 47x55x46 · 7833 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_octagonal-hotel-interior-design_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «commercial» не по картинке → commercial · теги: -tall
- комментарий: плоская деревянная восьмигранка; не башня и не высотка

### Shop House Building

- файл: `residential_shop-house-building_mc-mod_x.schem` · категория: **commercial** · теги: shop · 27x20x25 · 2350 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_shop-house-building_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «commercial» не по картинке → commercial · теги: -house -small
- комментарий: красный офисный блок, на жилой дом не похож

### Shop House for Sale

- файл: `residential_shop-house-for-sale_mc-mod_x.schem` · категория: **commercial** · теги: shop · 14x16x29 · 2735 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_shop-house-for-sale_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «commercial» не по картинке → commercial · теги: -house -small
- комментарий: светлый торговый бокс, жилой дом не читается

### Small Miscellaneous Structure

- файл: `commercial_small-miscellaneous-structure-2_mc-mod_x.schem` · категория: **commercial** · теги: huge|tall · 78x185x72 · 338124 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_small-miscellaneous-structure-2_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · название: не совпадает · флаги: meta-word-in-name · теги: -road -shop
- комментарий: гигантский скальный комплекс с дворами, ни разу не small

### Tilted Office Building

- файл: `towers_tilted-office-building_mc-mod_x.schem` · категория: **commercial** · теги: huge|office · 180x85x67 · 172199 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_tilted-office-building_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «commercial» не по картинке → commercial · теги: -tall
- комментарий: длинный красный ступенчатый офис; невысокий, не башня

### Small Car Dealership Building

- файл: `vehicles_small-car-dealership-building_mc-mod_x.schematic` · категория: **commercial** · теги: shop|small · 31x8x31 · 2861 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_small-car-dealership-building_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «commercial» не по картинке → commercial · флаги: non-building-in-name, vehicle · теги: -boat -car
- комментарий: одноэтажный автосалон с витринами; это здание, а не машина

### Industrial Style House

- файл: `industrial_industrial-style-house_mc-mod_1.14.4.schem` · категория: **commercial** · теги: medium|tall · 30x60x31 · 12542 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_industrial-style-house_mc-mod_1.14.4.png`
- вердикт: РАСХОЖДЕНИЕ · категория «commercial» не по картинке → commercial · теги: -house
- комментарий: стеклянная офисная башня, а не дом

### Unique Treehouse Restaurant

- файл: `commercial_unique-treehouse-restaurant_mc-mod_x.schematic` · категория: **commercial** · теги: house|small · 15x8x17 · 961 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_unique-treehouse-restaurant_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · название: не совпадает · теги: -tree · разошлись правила и картинка (words→decor, image→ok)
- комментарий: плоская коробка без дерева и домика на нём

### Tower Trivia Game Show

- файл: `towers_tower-trivia-game-show_mc-mod_x.schematic` · категория: **commercial** · теги: medium · 26x30x37 · 4816 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_tower-trivia-game-show_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «commercial» не по картинке → commercial · теги: -tower
- комментарий: низкий студийный блок с креслами, на башню не похож

### Olive Garden Restaurant Salt Lake City

- файл: `parks_olive-garden-restaurant-salt-lake-city_mc-mod_1.16.5.schem` · категория: **commercial** · теги: shop|small · 26x10x41 · 2843 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_olive-garden-restaurant-salt-lake-city_mc-mod_1.16.5.png`
- вердикт: РАСХОЖДЕНИЕ · категория «commercial» не по картинке → commercial · теги: +shop -park
- комментарий: бежевый ресторанный корпус с парковкой; к паркам не относится

### Massive Tree Structure

- файл: `parks_massive-tree-structure_mc-mod_x.schematic` · категория: **commercial** · теги: medium · 39x11x48 · 4306 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_massive-tree-structure_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «commercial» не по картинке → commercial · название: не совпадает · флаги: meta-word-in-name · теги: -tree · разошлись правила и картинка (words→decor, image→commercial)
- комментарий: плоский складской корпус с фонарями; дерева нет вовсе

### Wild West Crossroad

- файл: `intersections_wild-west-crossroad_mcbuild_x.schem` · категория: **commercial** · теги: large · 68x30x69 · 12735 блоков · источник: mcbuild
- превью: `schemes/thumbs/intersections_wild-west-crossroad_mcbuild_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «commercial» не по картинке → commercial · теги: -road
- комментарий: вестерн-квартал домиков; перекрёстка не видно

### Terraced Shop with Sidewalk

- файл: `roads_terraced-shop-with-sidewalk_buildschematics_x.schematic` · категория: **commercial** · теги: medium|shop · 29x23x33 · 4054 блоков · источник: buildschematics
- превью: `schemes/thumbs/roads_terraced-shop-with-sidewalk_buildschematics_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «commercial» не по картинке → commercial · теги: -car
- комментарий: красное кирпичное торговое здание с тротуаром; это коммерция, не дорога

### Square Earth Build

- файл: `parks_square-earth-build-2_buildschematics_x.schem` · категория: **decor** · теги: medium · 31x31x31 · 16852 блоков · источник: buildschematics
- превью: `schemes/thumbs/parks_square-earth-build-2_buildschematics_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «decor» не по картинке → decor · флаги: meta-word-in-name · теги: -park
- комментарий: серый куб с рельефом поверхности: парка и зелени здесь нет, это декоративный объект

### Small fountain

- файл: `commercial_small-fountain_mcbuild_x.schem` · категория: **decor** · теги: fountain|tiny|water · 11x10x11 · 186 блоков · источник: mcbuild
- превью: `schemes/thumbs/commercial_small-fountain_mcbuild_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «decor» не по картинке → decor · теги: -shop
- комментарий: ярусный фонтан с водой — это малая декоративная форма, а не коммерческое здание

### Small pond 1

- файл: `commercial_small-pond-1_mcbuild_x.schem` · категория: **decor** · теги: pool|small|water · 16x12x14 · 662 блоков · источник: mcbuild
- превью: `schemes/thumbs/commercial_small-pond-1_mcbuild_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «decor» не по картинке → decor · теги: -shop
- комментарий: пруд с голубой водой на газоне, торговой или магазинной застройки нет

### EssentialsX Shop Setup

- файл: `commercial_essentialsx-shop-setup_mc-mod_x.schem` · категория: **decor** · теги: large · 85x46x84 · 63930 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_essentialsx-shop-setup_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «decor» не по картинке → decor · название: не совпадает · теги: -shop -tall
- комментарий: двор с красными крышами и драконом, не магазин

### Mr. Burns Small Structure

- файл: `commercial_mr-burns-small-structure_mc-mod_x.schem` · категория: **decor** · теги: small|tall · 13x42x17 · 1134 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_mr-burns-small-structure_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «decor» не по картинке → decor · флаги: franchise, meta-word-in-name · теги: -shop
- комментарий: статуя старика в костюме, Симпсоны; не коммерция

### Orange Tower &#8211; Large Scale Block Structure

- файл: `towers_orange-tower-large-scale-block-structure_mc-mod_x.schem` · категория: **decor** · теги: small · 11x23x11 · 995 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_orange-tower-large-scale-block-structure_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «decor» не по картинке → decor · название: не совпадает · флаги: meta-word-in-name, text · теги: -tower
- комментарий: пиксель-фигурка человечка; ни башня, ни масштаб

### Small Terracotta Vase Decoration

- файл: `commercial_small-terracotta-vase-decoration_mc-mod_x.schem` · категория: **decor** · теги: small · 18x28x18 · 1019 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_small-terracotta-vase-decoration_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «decor» не по картинке → decor · теги: -shop
- комментарий: коричневый терракотовый кувшин с орнаментом, декор

### Technoblade Tribute Parkour Build

- файл: `parks_technoblade-tribute-parkour-build_mc-mod_x.schem` · категория: **decor** · теги: huge · 94x83x66 · 9367 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_technoblade-tribute-parkour-build_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «decor» не по картинке → decor · флаги: meta-word-in-name · теги: -park -tall
- комментарий: фигура свиньи-трибьют и купол; парка и паркура не видно

### Bedwars Bed Defence Structure

- файл: `public_bedwars-bed-defence-structure_mc-mod_x.schematic` · категория: **decor** · теги: small · 13x13x19 · 405 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_bedwars-bed-defence-structure_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «decor» не по картинке → decor · флаги: franchise, meta-word-in-name
- комментарий: синее ступенчатое укрепление из блоков, к общественным не относится

### Super Motorcycle Design

- файл: `vehicles_super-motorcycle-design_mc-mod_x.schematic` · категория: **decor** · теги: huge · 256x1x128 · 32727 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_super-motorcycle-design_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «decor» не по картинке → decor · флаги: text · теги: -medium +huge
- комментарий: плоский пиксель-арт мотоцикла на огромном полотне, не модель

### Frog Driving a Car

- файл: `vehicles_frog-driving-a-car_mc-mod_x.schematic` · категория: **decor** · теги: car|tiny · 16x15x1 · 152 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_frog-driving-a-car_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «decor» не по картинке → decor · флаги: non-building-in-name, text
- комментарий: плоский пиксельный лягушонок, а не объёмная машина; пиксель-арт

### CastiaMC Lobby Platform Build

- файл: `transport_castiamc-lobby-platform-build_mc-mod_x.schematic` · категория: **decor** · теги: medium|tall · 29x45x32 · 5992 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_castiamc-lobby-platform-build_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «decor» не по картинке → decor · название: не совпадает · флаги: meta-word-in-name, non-real/fantasy, text
- комментарий: парящее сердце-остров из блоков, а не лобби-платформа

### Rustic Wood Workshop

- файл: `industrial_rustic-wood-workshop_mc-mod_x.schematic` · категория: **decor** · теги: large|tall · 69x87x70 · 65191 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_rustic-wood-workshop_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «decor» не по картинке → decor · название: не совпадает · флаги: fantasy · теги: -shop
- комментарий: летающий остров со стеклом вместо мастерской

### Block Showcase Tower with Mini Biomes

- файл: `towers_block-showcase-tower-with-mini-biomes_mc-mod_x.schematic` · категория: **decor** · теги: large · 97x23x98 · 50275 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_block-showcase-tower-with-mini-biomes_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «decor» не по картинке → decor · название: не совпадает · теги: -tower
- комментарий: плоская полосатая платформа, башни и биомов нет

### Ride Road Build

- файл: `roads_ride-road-build_buildschematics_x.schematic` · категория: **decor** · теги: large|tall · 186x82x10 · 13336 блоков · источник: buildschematics
- превью: `schemes/thumbs/roads_ride-road-build_buildschematics_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «decor» не по картинке → decor · название: не совпадает · флаги: meta-word-in-name, text · теги: -road
- комментарий: проволочная надпись вместо дороги; это текст-арт

### Double-Sided Sony Logo Billboard

- файл: `public_double-sided-sony-logo-billboard_buildschematics_x.schematic` · категория: **decor** · теги: small · 64x19x11 · 3029 блоков · источник: buildschematics
- превью: `schemes/thumbs/public_double-sided-sony-logo-billboard_buildschematics_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «decor» не по картинке → decor · флаги: non-building-in-name, text
- комментарий: щит с объёмными буквами бренда; это декор, а не общественное здание

### "Do you even shift bro" billboard

- файл: `public_quot-do-you-even-shift-bro-quot-billboard_mcbuild_x.schem` · категория: **decor** · теги: medium|tall · 49x41x13 · 5167 блоков · источник: mcbuild
- превью: `schemes/thumbs/public_quot-do-you-even-shift-bro-quot-billboard_mcbuild_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «decor» не по картинке → decor · флаги: text
- комментарий: чёрный щит с пиксельной надписью; по сути декор

### Large Billboard

- файл: `public_large-billboard_mcbuild_x.schem` · категория: **decor** · теги: medium|tall · 49x41x13 · 2717 блоков · источник: mcbuild
- превью: `schemes/thumbs/public_large-billboard_mcbuild_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «decor» не по картинке → decor
- комментарий: пустая решётчатая конструкция без полотна; декор, не общественное

### WorkBench

- файл: `public_workbench_mcbuild_x.schem` · категория: **decor** · теги: small · 16x17x16 · 2042 блоков · источник: mcbuild
- превью: `schemes/thumbs/public_workbench_mcbuild_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «decor» не по картинке → decor
- комментарий: гигантский верстак-куб; декор, а не общественное здание

### Toyland-FisherPrice Workbench

- файл: `public_toyland-fisherprice-workbench_mcbuild_x.schem` · категория: **decor** · теги: medium · 31x31x23 · 2887 блоков · источник: mcbuild
- превью: `schemes/thumbs/public_toyland-fisherprice-workbench_mcbuild_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «decor» не по картинке → decor · флаги: franchise
- комментарий: игрушечный пластиковый верстак; бренд в имени, это декор

### 4 Way Intersection (Redstone)

- файл: `intersections_4-way-intersection-redstone_mcbuild_x.schem` · категория: **decor** · теги: tiny · 11x14x11 · 905 блоков · источник: mcbuild
- превью: `schemes/thumbs/intersections_4-way-intersection-redstone_mcbuild_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «decor» не по картинке → decor · название: не совпадает · флаги: non-building-in-name
- комментарий: серая будка механизма без развилки, на перекресток не похоже

### Simple resource warehouse

- файл: `residential_simple-resource-warehouse_mcbuild_x.schem` · категория: **industrial** · теги: house|small · 17x10x13 · 1032 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_simple-resource-warehouse_mcbuild_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «industrial» не по картинке → industrial
- комментарий: деревянный сарай с пологой крышей и сеном у входа — это склад, а не жильё

### Chest-Shaped Storage Warehouse

- файл: `residential_chest-shaped-storage-warehouse_mc-mod_x.schem` · категория: **industrial** · теги: small · 23x13x19 · 1027 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_chest-shaped-storage-warehouse_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «industrial» не по картинке → industrial · теги: -house
- комментарий: гигантский сундук-хранилище на газоне, это склад, а не жилой дом

### Concrete Warehouse Structure

- файл: `residential_concrete-warehouse-structure_mc-mod_x.schem` · категория: **industrial** · теги: small · 25x20x25 · 1781 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_concrete-warehouse-structure_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «industrial» не по картинке → industrial · флаги: meta-word-in-name · теги: -house
- комментарий: арочный серый склад-ангар, жилой категории не соответствует

### Improved Warehouse Storage Structure

- файл: `residential_improved-warehouse-storage-structure_mc-mod_x.schem` · категория: **industrial** · теги: huge · 121x20x217 · 42262 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_improved-warehouse-storage-structure_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «industrial» не по картинке → industrial · флаги: meta-word-in-name · теги: -house
- комментарий: плоский складской двор с ячейками, не жильё

### Item Storage Warehouse

- файл: `residential_item-storage-warehouse_mc-mod_x.schem` · категория: **industrial** · теги: medium · 84x16x19 · 8496 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_item-storage-warehouse_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «industrial» не по картинке → industrial · теги: -house
- комментарий: длинный складской корпус, не жильё

### Large Server Warehouse

- файл: `residential_large-server-warehouse_mc-mod_x.schem` · категория: **industrial** · теги: large · 55x105x54 · 23556 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_large-server-warehouse_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «industrial» не по картинке → industrial · теги: -house -tall
- комментарий: приземистый складской корпус, серверов и высоты нет

### Massive Storage Warehouse Structure

- файл: `residential_massive-storage-warehouse-structure_mc-mod_x.schem` · категория: **industrial** · теги: large · 169x22x85 · 24720 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_massive-storage-warehouse-structure_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «industrial» не по картинке → industrial · флаги: meta-word-in-name · теги: -house
- комментарий: длинный склад с открытым каркасом кровли, к жилой застройке не относится

### Medium Orange Warehouse

- файл: `residential_medium-orange-warehouse_mc-mod_x.schem` · категория: **industrial** · теги: large · 74x21x117 · 21686 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_medium-orange-warehouse_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «industrial» не по картинке → industrial · теги: -house
- комментарий: серо-белый склад со световыми окнами, оранжевого цвета нет и это не жильё

### Modern Cyan Terracotta House

- файл: `residential_modern-cyan-terracotta-house_mc-mod_x.schem` · категория: **industrial** · теги: large|modern · 67x22x53 · 26211 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_modern-cyan-terracotta-house_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «industrial» не по картинке → industrial · название: не совпадает · теги: -house -medium +large
- комментарий: Длинные стеклянные теплицы, а не жилой дом

### Modern Warehouse with Iron Gate Details

- файл: `residential_modern-warehouse-with-iron-gate-details_mc-mod_x.schem` · категория: **industrial** · теги: large|modern · 135x18x83 · 29565 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_modern-warehouse-with-iron-gate-details_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «industrial» не по картинке → industrial · флаги: non-building-in-name · теги: -house
- комментарий: длинный складской ангар; к жилью не относится

### Quad Steam Turbine Warehouse

- файл: `residential_quad-steam-turbine-warehouse_mc-mod_x.schem` · категория: **industrial** · теги: medium · 30x7x147 · 11770 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_quad-steam-turbine-warehouse_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «industrial» не по картинке → industrial · теги: -house
- комментарий: длинные серые цеха, к жилым домам не относится

### QuickDeli Cargo Services Warehouse and Office

- файл: `towers_quickdeli-cargo-services-warehouse-and-offic_mc-mod_x.schem` · категория: **industrial** · теги: huge|office · 161x21x177 · 57634 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_quickdeli-cargo-services-warehouse-and-offic_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «industrial» не по картинке → industrial · флаги: non-building-in-name · теги: -house -car · разошлись правила и картинка (words→residential, image→industrial)
- комментарий: огромный складской комплекс, башней не является

### Small Factory Shell Template

- файл: `commercial_small-factory-shell-template_mc-mod_x.schem` · категория: **industrial** · теги: tiny · 13x7x9 · 432 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_small-factory-shell-template_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «industrial» не по картинке → industrial · флаги: meta-word-in-name · теги: -shop
- комментарий: красно-коричневый цех-коробка, промышленное, не торговля

### Storage Warehouse Building

- файл: `residential_storage-warehouse-building_mc-mod_x.schem` · категория: **industrial** · теги: huge · 110x25x307 · 68573 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_storage-warehouse-building_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «industrial» не по картинке → industrial · теги: -house
- комментарий: длинный складской ангар со светлой крышей; к жилью не относится

### Storage Warehouse Structure

- файл: `residential_storage-warehouse-structure_mc-mod_x.schem` · категория: **industrial** · теги: medium · 81x22x66 · 15379 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_storage-warehouse-structure_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «industrial» не по картинке → industrial · флаги: meta-word-in-name · теги: -house
- комментарий: тёмный складской корпус с фонарями в крыше; жилой тег лишний

### Two Story Warehouse With Parking

- файл: `transport_two-story-warehouse-with-parking_mc-mod_x.schem` · категория: **industrial** · теги: medium|parking · 65x18x102 · 25747 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_two-story-warehouse-with-parking_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «industrial» не по картинке → industrial · теги: -house -park · разошлись правила и картинка (words→residential, image→industrial)
- комментарий: склад с большой парковкой; дом и парк лишние

### Large Urban Warehouse Storage Building

- файл: `residential_urban-warehouse-storage-building-2_mc-mod_x.schem` · категория: **industrial** · теги: large · 145x24x69 · 25530 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_urban-warehouse-storage-building-2_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «industrial» не по картинке → industrial · теги: -house
- комментарий: длинный склад с коричневой крышей; не жильё

### Vehicle Warehouse Storage

- файл: `residential_vehicle-warehouse-storage_mc-mod_x.schem` · категория: **industrial** · теги: large · 135x19x83 · 34041 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_vehicle-warehouse-storage_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «industrial» не по картинке → industrial · теги: -house
- комментарий: большой серый склад-ангар; техники внутри не видно

### Vienna Street House 71

- файл: `roads_vienna-street-house-71_mc-mod_x.schem` · категория: **industrial** · теги: medium|tall · 14x49x54 · 8406 блоков · источник: mc-mod
- превью: `schemes/thumbs/roads_vienna-street-house-71_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «industrial» не по картинке → industrial · название: не совпадает · теги: -house -road -tree
- комментарий: фабричный корпус с трубами, а не дом; к дорогам не относится

### Warehouse 13 Storage Building

- файл: `residential_warehouse-13-storage-building_mc-mod_x.schem` · категория: **industrial** · теги: huge · 181x19x181 · 78026 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_warehouse-13-storage-building_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «industrial» не по картинке → industrial · теги: -house
- комментарий: огромный склад со стеклянной крышей; не жильё

### Warehouse With Movie Sets

- файл: `residential_warehouse-with-movie-sets_mc-mod_x.schem` · категория: **industrial** · теги: huge · 147x40x139 · 69931 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_warehouse-with-movie-sets_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «industrial» не по картинке → industrial · теги: -house
- комментарий: белые студийные ангары; декорации почти не читаются

### Japanese Garbage Compactor Structure

- файл: `vehicles_japanese-garbage-compactor-structure_mc-mod_x.schematic` · категория: **industrial** · теги: tiny · 5x4x8 · 49 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_japanese-garbage-compactor-structure_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «industrial» не по картинке → industrial · флаги: meta-word-in-name
- комментарий: россыпь блоков пресса, на машину не похоже; ближе к цеху

### Grand Central Park &#8211; Large Town Square

- файл: `public_grand-central-park-large-town-square_mc-mod_x.schem` · категория: **parks** · теги: huge|park · 142x49x126 · 65580 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_grand-central-park-large-town-square_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «parks» не по картинке → parks · теги: -tall
- комментарий: гигантская площадь с фонтаном и клумбами, это парк

### Small Desert Cactus Fountain

- файл: `commercial_small-desert-cactus-fountain_mc-mod_x.schem` · категория: **parks** · теги: fountain|small|water · 13x12x13 · 448 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_small-desert-cactus-fountain_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «parks» не по картинке → parks · теги: -shop
- комментарий: каменный фонтан с водой, кактуса не видно; не торговля

### Small Garden Fountain

- файл: `commercial_small-garden-fountain-3_mc-mod_x.schem` · категория: **parks** · теги: fountain|park|tiny|water · 7x9x7 · 188 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_small-garden-fountain-3_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «parks» не по картинке → parks · теги: -shop
- комментарий: квадратный фонтан-беседка с водой, садовый, не торговля

### Sea Creature Park Megalodon Whale

- файл: `parks_sea-creature-park-megalodon-whale_mc-mod_x.schematic` · категория: **parks** · теги: medium|park · 52x26x62 · 71810 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_sea-creature-park-megalodon-whale_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · название: не совпадает
- комментарий: два пустых бетонных бассейна, кита-мегалодона не видно

### Rustic Garden Shed

- файл: `parks_rustic-garden-shed_mc-mod_x.schematic` · категория: **parks** · теги: tiny · 12x8x7 · 124 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_rustic-garden-shed_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · название: не совпадает · теги: -park
- комментарий: коричневая ступенчатая глыба; сарай и сад не читаются

### Spruce Village Pack - Church

- файл: `residential_spruce-village-pack---church_mcbuild_x.schem` · категория: **public** · теги: church|house|small|tree · 16x26x11 · 839 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_spruce-village-pack---church_mcbuild_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «public» не по картинке → public
- комментарий: маленькая деревянная часовня с высоким шпилем; к жилым зданиям не относится

### City Hall Building

- файл: `decor_city-hall-building_mc-mod_x.schem` · категория: **public** · теги: medium · 30x30x21 · 3775 блоков · источник: mc-mod
- превью: `schemes/thumbs/decor_city-hall-building_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «public» не по картинке → public
- комментарий: ратуша с колоннадой и парадной лестницей на газоне — общественное здание, не декор

### Early 20th Century Schoolhouse

- файл: `residential_early-20th-century-schoolhouse_mc-mod_x.schem` · категория: **public** · теги: school|small · 40x17x18 · 4884 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_early-20th-century-schoolhouse_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «public» не по картинке → public · теги: -house
- комментарий: школьный корпус буквой Г, к жилью не относится

### Elegant City Hall For Small Towns

- файл: `commercial_elegant-city-hall-for-small-towns_mc-mod_x.schem` · категория: **public** · теги: medium · 36x27x29 · 5999 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_elegant-city-hall-for-small-towns_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «public» не по картинке → public · теги: -shop
- комментарий: классическая ратуша с колоннами, не торговля

### Metro City Spawn

- файл: `transport_metro-city-spawn_mc-mod_x.schem` · категория: **public** · теги: large|tall · 56x73x56 · 23416 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_metro-city-spawn_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «public» не по картинке → public
- комментарий: городская площадь с фонтаном, деревьями и двумя башнями, транспортной инфраструктуры нет

### Small Chapel Structure

- файл: `commercial_small-chapel-structure_mc-mod_x.schem` · категория: **public** · теги: church|small · 19x21x20 · 971 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_small-chapel-structure_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «public» не по картинке → public · флаги: meta-word-in-name · теги: -shop
- комментарий: серый замок-часовня с жёлтыми окнами, не торговля

### Small Church

- файл: `commercial_small-church_mc-mod_x.schem` · категория: **public** · теги: church|tall · 23x115x29 · 29481 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_small-church_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «public» не по картинке → public · теги: -shop -medium
- комментарий: серая башня со мхом и рваным верхом, церковность не читается

### Small Double Modern Church With Interior

- файл: `commercial_small-double-modern-church-with-interior_mc-mod_x.schem` · категория: **public** · теги: church|modern · 56x46x50 · 3606 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_small-double-modern-church-with-interior_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «public» не по картинке → public · теги: -shop -large -tall
- комментарий: два крошечных серых домика в поле, церквей не видно

### Small Minecraft Church Building

- файл: `commercial_small-minecraft-church-building_mc-mod_x.schem` · категория: **public** · теги: church|medium · 19x34x34 · 2840 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_small-minecraft-church-building_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «public» не по картинке → public · флаги: franchise · теги: -shop
- комментарий: белая часовня с крестом и голубыми окнами, не торговля

### Small Schoolhouse With Blackboard

- файл: `residential_small-schoolhouse-with-blackboard_mc-mod_x.schem` · категория: **public** · теги: house|school|tiny · 12x5x8 · 293 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_small-schoolhouse-with-blackboard_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «public» не по картинке → public · теги: -shop · разошлись правила и картинка (words→commercial, image→public)
- комментарий: коричневая коробка со стеклянной крышей, доски не видно

### Small Shop Building

- файл: `commercial_small-shop-building_mc-mod_x.schem` · категория: **public** · теги: small · 21x25x19 · 1665 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_small-shop-building_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «public» не по картинке → public · название: не совпадает · теги: -shop
- комментарий: каменное здание с белым шпилем — церковь, а не магазин

### Minecraft Fire Station and Football Field

- файл: `transport_minecraft-fire-station-and-football-field_mc-mod_1.19.4.schem` · категория: **public** · теги: medium|station · 89x20x63 · 1745 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_minecraft-fire-station-and-football-field_mc-mod_1.19.4.png`
- вердикт: РАСХОЖДЕНИЕ · категория «public» не по картинке → public · флаги: empty, franchise
- комментарий: редкие мелкие фрагменты на тёмной плите; пожарка не транспорт

### Mastermind Prison Mine

- файл: `public_mastermind-prison-mine_mc-mod_x.schematic` · категория: **public** · теги: huge · 78x67x119 · 36117 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_mastermind-prison-mine_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · название: не совпадает · теги: -tall
- комментарий: плоская серая плита сверху; ни шахты, ни тюрьмы не видно

### Stone Brick Industrial Factory

- файл: `industrial_industrial-factory-building-4_mc-mod_1.14.4.schem` · категория: **public** · теги: medium · 20x27x34 · 4762 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_industrial-factory-building-4_mc-mod_1.14.4.png`
- вердикт: РАСХОЖДЕНИЕ · категория «public» не по картинке → public · название: не совпадает
- комментарий: азиатский павильон с фонарями, а не фабрика

### Police Station With Jail

- файл: `transport_police-station-with-jail_buildschematics_x.schematic` · категория: **public** · теги: large|station|tall · 49x69x39 · 49777 блоков · источник: buildschematics
- превью: `schemes/thumbs/transport_police-station-with-jail_buildschematics_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «public» не по картинке → public
- комментарий: белый административный блок без вывесок; участок скорее public

### City Police Station Building

- файл: `transport_city-police-station-building_buildschematics_x.schematic` · категория: **public** · теги: small|station · 25x17x32 · 4132 блоков · источник: buildschematics
- превью: `schemes/thumbs/transport_city-police-station-building_buildschematics_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «public» не по картинке → public
- комментарий: краснокирпичное здание с парковкой без вывески; участок неявный

### Police Station | Modern Police Station

- файл: `transport_police-station-modern-police-station_mcbuild_x.schem` · категория: **public** · теги: medium|modern|station · 26x38x41 · 5680 блоков · источник: mcbuild
- превью: `schemes/thumbs/transport_police-station-modern-police-station_mcbuild_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «public» не по картинке → public
- комментарий: серый современный офисный блок без вывески; к transport не относится

### Police Station - complete version

- файл: `transport_police-station-complete-version_mcbuild_x.schem` · категория: **public** · теги: medium|station · 42x19x29 · 8207 блоков · источник: mcbuild
- превью: `schemes/thumbs/transport_police-station-complete-version_mcbuild_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «public» не по картинке → public
- комментарий: стеклянное административное здание; вывески участка нет

### Police Station

- файл: `transport_police-station_mcbuild_x.schem` · категория: **public** · теги: medium|station · 45x14x45 · 6661 блоков · источник: mcbuild
- превью: `schemes/thumbs/transport_police-station_mcbuild_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «public» не по картинке → public
- комментарий: здание с крупной надписью POLICE и парковкой, читается

### Fire Station Building

- файл: `transport_fire-station-building_buildschematics_x.schematic` · категория: **public** · теги: medium|station · 45x40x45 · 5977 блоков · источник: buildschematics
- превью: `schemes/thumbs/transport_fire-station-building_buildschematics_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «public» не по картинке → public
- комментарий: светлое депо с красными воротами и пожарной машиной, читается

### Fire Station House

- файл: `transport_fire-station-house_buildschematics_x.schematic` · категория: **public** · теги: large|station · 99x31x121 · 46228 блоков · источник: buildschematics
- превью: `schemes/thumbs/transport_fire-station-house_buildschematics_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «public» не по картинке → public · теги: -house
- комментарий: крупный комплекс с вертолётной площадкой; на жилой дом не похоже

### Fire Station

- файл: `transport_fire-station_mcbuild_x.schem` · категория: **public** · теги: large|station · 110x29x55 · 31610 блоков · источник: mcbuild
- превью: `schemes/thumbs/transport_fire-station_mcbuild_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «public» не по картинке → public · флаги: duplicate-name
- комментарий: бежевый комплекс депо с плоскими крышами; пожарная специфика неявная

### Fire Station

- файл: `transport_fire-station_mcbuild_x-2.schem` · категория: **public** · теги: medium|station · 45x40x45 · 5967 блоков · источник: mcbuild
- превью: `schemes/thumbs/transport_fire-station_mcbuild_x-2.png`
- вердикт: РАСХОЖДЕНИЕ · категория «public» не по картинке → public · флаги: duplicate-name
- комментарий: то же светлое депо с машиной; похоже на дубликат соседнего объекта

### Fire station

- файл: `transport_fire-station_mcbuild_x-3.schem` · категория: **public** · теги: medium|station|tall · 20x69x27 · 7189 блоков · источник: mcbuild
- превью: `schemes/thumbs/transport_fire-station_mcbuild_x-3.png`
- вердикт: РАСХОЖДЕНИЕ · категория «public» не по картинке → public · флаги: duplicate-name
- комментарий: узкая высокая башня-каланча; признаки депо неявные

### Secondary School  - LE

- файл: `public_secondary-school-le_mcbuild_x.schem` · категория: **public** · теги: church|medium · 26x33x29 · 3757 блоков · источник: mcbuild
- превью: `schemes/thumbs/public_secondary-school-le_mcbuild_x.png`
- вердикт: РАСХОЖДЕНИЕ · название: не совпадает · теги: -school +church
- комментарий: на кадре деревянная церковь с башней, а не школа

### Vienna Street House 67

- файл: `roads_vienna-street-house-67_buildschematics_x.schem` · категория: **residential** · теги: house|medium|tall · 29x41x20 · 6565 блоков · источник: buildschematics
- превью: `schemes/thumbs/roads_vienna-street-house-67_buildschematics_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «residential» не по картинке → residential · теги: -road -tree
- комментарий: узкий многоэтажный дом с декоративным фасадом стоит на газоне: ни дороги, ни дерева нет

### Small Town

- файл: `commercial_small-town_mcbuild_x.schem` · категория: **residential** · теги: large · 68x28x75 · 21060 блоков · источник: mcbuild
- превью: `schemes/thumbs/commercial_small-town_mcbuild_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «residential» не по картинке → residential · теги: -shop
- комментарий: улочка с домами и церковью, читается; к коммерции не относится

### Modern Burger Shop

- файл: `commercial_modern-burger-shop_mcbuild_x.schem` · категория: **residential** · теги: modern|small · 21x27x24 · 6432 блоков · источник: mcbuild
- превью: `schemes/thumbs/commercial_modern-burger-shop_mcbuild_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «residential» не по картинке → residential · название: не совпадает · теги: -shop
- комментарий: серо-белый многоэтажный блок с балконами и вентиляцией на кровле; магазина и витрин нет

### Futurist Modern house/tower

- файл: `towers_futurist-modern-house-tower_mcbuild_x.schem` · категория: **residential** · теги: house|medium|modern · 39x37x49 · 11171 блоков · источник: mcbuild
- превью: `schemes/thumbs/towers_futurist-modern-house-tower_mcbuild_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «residential» не по картинке → residential · теги: -tower
- комментарий: широкий многоуровневый модерн-дом с террасами и навесами, по массе это не башня

### Charming Cottage with Living Area and Garage

- файл: `commercial_charming-cottage-with-living-area-and-garage_mc-mod_x.schem` · категория: **residential** · теги: house|medium|parking · 37x12x37 · 4402 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_charming-cottage-with-living-area-and-garage_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «residential» не по картинке → residential
- комментарий: длинный красный дом с двускатной серой кровлёй на газоне — это коттедж

### Furnished Family Home with Garage

- файл: `commercial_furnished-family-home-with-garage_mc-mod_x.schem` · категория: **residential** · теги: house|large|parking · 61x38x101 · 24524 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_furnished-family-home-with-garage_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «residential» не по картинке → residential
- комментарий: большой дом с гаражом и скатной крышей, это жильё

### Medium Mansion With Bridge

- файл: `bridges_medium-mansion-with-bridge_mc-mod_x.schem` · категория: **residential** · теги: bridge|house|huge|tall · 105x133x82 · 443361 блоков · источник: mc-mod
- превью: `schemes/thumbs/bridges_medium-mansion-with-bridge_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «residential» не по картинке → residential
- комментарий: особняк на скале с ручьём: мостик там крошечный, основной объём — жилой дом

### Multiplayer Survival Base with Shop

- файл: `commercial_multiplayer-survival-base-with-shop_mc-mod_x.schem` · категория: **residential** · теги: medium · 32x16x40 · 5540 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_multiplayer-survival-base-with-shop_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «residential» не по картинке → residential · флаги: non-real/fantasy · теги: -shop
- комментарий: коричневый бункер-база без вывески; магазина не видно

### Small Faction Base for Hardcore Players

- файл: `commercial_small-faction-base-for-hardcore-players_mc-mod_x.schem` · категория: **residential** · теги: small · 16x13x16 · 1358 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_small-faction-base-for-hardcore-players_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «residential» не по картинке → residential · теги: -shop
- комментарий: стена-компаунд с водой внутри, база клана, не магазин

### Traditional Brick Home With Garage

- файл: `commercial_traditional-brick-home-with-garage_mc-mod_x.schem` · категория: **residential** · теги: house|medium|parking · 61x35x52 · 14732 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_traditional-brick-home-with-garage_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «residential» не по картинке → residential
- комментарий: кирпичный дом с гаражом и участком; не коммерция

### Vienna Street House 65 Build

- файл: `roads_vienna-street-house-65-build_mc-mod_x.schem` · категория: **residential** · теги: house|medium|tall · 22x42x22 · 4908 блоков · источник: mc-mod
- превью: `schemes/thumbs/roads_vienna-street-house-65-build_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «residential» не по картинке → residential · флаги: meta-word-in-name · теги: -road -tree
- комментарий: высокий бежевый таунхаус; дороги и дерева нет

### Vienna Street House 66

- файл: `roads_vienna-street-house-66_mc-mod_x.schem` · категория: **residential** · теги: house|medium|tall · 27x41x20 · 5867 блоков · источник: mc-mod
- превью: `schemes/thumbs/roads_vienna-street-house-66_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «residential» не по картинке → residential · теги: -road -tree
- комментарий: красный высокий таунхаус; дороги и дерева нет

### Vienna Street House 68

- файл: `roads_vienna-street-house-68_mc-mod_x.schem` · категория: **residential** · теги: house|medium|tall · 24x41x17 · 5140 блоков · источник: mc-mod
- превью: `schemes/thumbs/roads_vienna-street-house-68_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «residential» не по картинке → residential · теги: -road -tree
- комментарий: коричневый высокий таунхаус; дороги и дерева нет

### Vienna Street House 70 Build

- файл: `roads_vienna-street-house-70-build_mc-mod_x.schem` · категория: **residential** · теги: house|medium|tall · 27x42x19 · 6991 блоков · источник: mc-mod
- превью: `schemes/thumbs/roads_vienna-street-house-70-build_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «residential» не по картинке → residential · флаги: meta-word-in-name · теги: -road -tree
- комментарий: бело-коричневый таунхаус; дороги и дерева нет

### Vienna Street House 73

- файл: `roads_vienna-street-house-73_mc-mod_x.schem` · категория: **residential** · теги: house|medium|tall · 34x41x18 · 8301 блоков · источник: mc-mod
- превью: `schemes/thumbs/roads_vienna-street-house-73_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «residential» не по картинке → residential · теги: -road -tree
- комментарий: коричневый таунхаус с эркерами; дороги и дерева нет

### Vienna Street House 74

- файл: `roads_vienna-street-house-74_mc-mod_x.schem` · категория: **residential** · теги: house|medium|tall · 36x42x20 · 8908 блоков · источник: mc-mod
- превью: `schemes/thumbs/roads_vienna-street-house-74_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «residential» не по картинке → residential · теги: -road -tree
- комментарий: коричневый таунхаус на углу; дороги и дерева нет

### Vienna Street House With Jungle Planks

- файл: `roads_vienna-street-houses-2_mc-mod_x.schem` · категория: **residential** · теги: house|medium · 29x40x19 · 6086 блоков · источник: mc-mod
- превью: `schemes/thumbs/roads_vienna-street-houses-2_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «residential» не по картинке → residential · теги: -road -tree
- комментарий: серо-коричневый таунхаус; дороги и дерева нет

### Abandoned Town with Subway System

- файл: `transport_abandoned-town-with-subway-system_mc-mod_x.schematic` · категория: **residential** · теги: apartment|house|medium · 64x20x70 · 37138 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_abandoned-town-with-subway-system_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «residential» не по картинке → residential · теги: +house +apartment
- комментарий: квартал с серым корпусом и красными домиками; метро и заброшенности не видно

### Industrial Style Modern House

- файл: `industrial_industrial-style-modern-house_mc-mod_1.14.4.schem` · категория: **residential** · теги: house|medium|modern|tall · 30x42x31 · 9071 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_industrial-style-modern-house_mc-mod_1.14.4.png`
- вердикт: РАСХОЖДЕНИЕ · категория «residential» не по картинке → residential
- комментарий: серый современный дом-офис, промзоне не место

### Rustic Village with Longhouse and Towers

- файл: `public_rustic-village-with-longhouse-and-towers_mc-mod_x.schematic` · категория: **residential** · теги: house|large|tower · 68x28x75 · 21060 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_rustic-village-with-longhouse-and-towers_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «residential» не по картинке → residential
- комментарий: деревня с частоколом и домами, жилое а не общественное

### New York Style Townhouses With Pool

- файл: `public_new-york-style-townhouses-with-pool_mc-mod_1.19.4.schem` · категория: **residential** · теги: house|medium|pool|water · 48x25x47 · 11281 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_new-york-style-townhouses-with-pool_mc-mod_1.19.4.png`
- вердикт: РАСХОЖДЕНИЕ · категория «residential» не по картинке → residential
- комментарий: красные дома с бассейном и дорогой; не public, а жилые

### Rustic Farmhouse with Garden and Pond

- файл: `parks_rustic-farmhouse-with-garden-and-pond_mc-mod_x.schematic` · категория: **residential** · теги: house|medium|park|pool|water · 37x29x52 · 11943 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_rustic-farmhouse-with-garden-and-pond_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «residential» не по картинке → residential · флаги: non-building-in-name
- комментарий: деревенский дом с садом и фонарями; это жильё, а не парк

### Two Cubes Modern House With Garden Pool

- файл: `parks_two-cubes-modern-house-with-garden-pool_mc-mod_x.schematic` · категория: **residential** · теги: house|modern|park|pool|small|water · 20x17x18 · 1803 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_two-cubes-modern-house-with-garden-pool_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «residential» не по картинке → residential
- комментарий: белый куб-модерн с садом; жилой дом, а не парк

### Cozy Brick Home with Garden and Storage

- файл: `parks_cozy-brick-home-with-garden-and-storage_mc-mod_x.schematic` · категория: **residential** · теги: house|medium · 44x18x31 · 3871 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_cozy-brick-home-with-garden-and-storage_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «residential» не по картинке → residential · теги: -park
- комментарий: длинный кирпичный корпус с окнами; жильё, а не парк

### Cozy House with Garden and Garage

- файл: `parks_cozy-house-with-garden-and-garage_mc-mod_x.schematic` · категория: **residential** · теги: house|tiny · 13x12x10 · 977 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_cozy-house-with-garden-and-garage_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «residential» не по картинке → residential · теги: -park -parking
- комментарий: видна лишь ступенчатая крыша домика; гаража и сада нет

### Modern Street With Five Houses

- файл: `decor_modern-street-with-five-houses_buildschematics_x.schem` · категория: **roads** · теги: house|huge|modern|road|tree · 139x25x200 · 83871 блоков · источник: buildschematics
- превью: `schemes/thumbs/decor_modern-street-with-five-houses_buildschematics_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «roads» не по картинке → roads
- комментарий: сверху видна улица с дорогой, газонами и несколькими домами, к декору это не относится

### Toll Booth Structure

- файл: `residential_toll-booth-structure_mc-mod_x.schematic` · категория: **roads** · теги: huge|road · 440x17x115 · 57768 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_toll-booth-structure_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «roads» не по картинке → roads · флаги: meta-word-in-name · теги: +road
- комментарий: длинное шоссе с будками проезда, к жилью не относится

### Mega Tower With Working Elevators

- файл: `industrial_mega-tower-with-working-elevators_buildschematics_x.schem` · категория: **towers** · теги: huge|tall|tower · 51x254x44 · 117512 блоков · источник: buildschematics
- превью: `schemes/thumbs/industrial_mega-tower-with-working-elevators_buildschematics_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «towers» не по картинке → towers · флаги: non-building-in-name
- комментарий: тонкая высокая башня с лифтовой шахтой и окнами, к промышленным постройкам не относится

### Asian 4 Storey Pagoda Nr3

- файл: `commercial_asian-4-storey-pagoda-nr3_mcbuild_x.schem` · категория: **towers** · теги: medium|tall · 44x54x43 · 2244 блоков · источник: mcbuild
- превью: `schemes/thumbs/commercial_asian-4-storey-pagoda-nr3_mcbuild_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «towers» не по картинке → towers · теги: -shop
- комментарий: четырёхъярусная пагода с подвесными фонарями: это башня-сооружение, а не магазин

### Lighthouse 

- файл: `residential_lighthouse_mcbuild_x.schem` · категория: **towers** · теги: house|medium|tall · 21x98x32 · 8490 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_lighthouse_mcbuild_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «towers» не по картинке → towers · теги: -water
- комментарий: красно-белый маяк с фонарём и куполом, к жилым домам не относится, воды в кадре нет

### 432 Park Avenue Skyscraper Replica

- файл: `roads_park-avenue-skyscraper-replica_mc-mod_x.schem` · категория: **towers** · теги: large|tall|tower · 25x202x25 · 49086 блоков · источник: mc-mod
- превью: `schemes/thumbs/roads_park-avenue-skyscraper-replica_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «towers» не по картинке → towers · теги: -road -park
- комментарий: тонкий белый небоскрёб с сеткой окон: это башня, а не дорога; дороги и парка в кадре нет

### Basic Lighthouse Structure

- файл: `residential_basic-lighthouse-structure_mc-mod_x.schem` · категория: **towers** · теги: medium|tall|water · 30x64x45 · 17845 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_basic-lighthouse-structure_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «towers» не по картинке → towers · флаги: meta-word-in-name · теги: -house
- комментарий: высокий серый маяк на островке посреди воды, к жилым зданиям не относится

### Blue And White Lighthouse Structure

- файл: `residential_blue-and-white-lighthouse-structure_mc-mod_x.schem` · категория: **towers** · теги: medium|tall|water · 16x69x16 · 4587 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_blue-and-white-lighthouse-structure_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «towers» не по картинке → towers · флаги: meta-word-in-name · теги: -house
- комментарий: ярусная башня из восьмигранных секций наверху дымовой трубы, похожа на маяк

### Classic Minecraft Lighthouse Decoration

- файл: `residential_classic-minecraft-lighthouse-decoration-2_mc-mod_x.schem` · категория: **towers** · теги: medium|tall|water · 20x47x17 · 1587 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_classic-minecraft-lighthouse-decoration-2_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «towers» не по картинке → towers · флаги: franchise · теги: -house
- комментарий: серый маяк с расширенным основанием и деревянной площадкой сверху, дома нет

### Coastal Lighthouse &#8211; Polished Andesite &amp; Stone Bricks

- файл: `residential_coastal-lighthouse-polished-andesite-stone-b_mc-mod_x.schem` · категория: **towers** · теги: house|small|water · 11x29x16 · 1211 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_coastal-lighthouse-polished-andesite-stone-b_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «towers» не по картинке → towers · разошлись правила и картинка (words→waterfront, image→towers)
- комментарий: высокий серый маяк на синей воде с маленьким домиком рядом, категория не жилая

### Coastal Lighthouse Structure

- файл: `residential_coastal-lighthouse-structure_mc-mod_x.schem` · категория: **towers** · теги: house|medium|tall · 17x41x29 · 3044 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_coastal-lighthouse-structure_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «towers» не по картинке → towers · флаги: meta-word-in-name · теги: -water · разошлись правила и картинка (words→waterfront, image→towers)
- комментарий: многоярусная башенка с деревянными кровлями на траве, берега и воды не видно

### Rainbow Lighthouse

- файл: `residential_rainbow-lighthouse_mc-mod_x.schem` · категория: **towers** · теги: tiny|water · 2x23x2 · 25 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_rainbow-lighthouse_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «towers» не по картинке → towers · флаги: empty · теги: -house
- комментарий: тонкий столб без радуги и воды, на дом не тянет

### Yeti&#8217;s Alpine Shop

- файл: `commercial_yetis-alpine-shop_mc-mod_x.schem` · категория: **towers** · теги: medium|tall · 29x81x49 · 18437 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_yetis-alpine-shop_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «towers» не по картинке → towers · название: не совпадает · теги: -shop
- комментарий: высокая коричневая башня вместо магазина, к торговле не относится

### Cobblestone and Glass Portal Towers

- файл: `public_cobblestone-and-glass-portal-towers_mc-mod_x.schematic` · категория: **towers** · теги: large|tall|tower · 74x71x92 · 28350 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_cobblestone-and-glass-portal-towers_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «towers» не по картинке → towers
- комментарий: две башни из булыжника со стеклом, это башни а не общественное

### Immersive Railroading Roundhouse Structure

- файл: `roads_immersive-railroading-roundhouse-structure_mc-mod_x.schem` · категория: **transport** · теги: large|station · 110x15x111 · 12086 блоков · источник: mc-mod
- превью: `schemes/thumbs/roads_immersive-railroading-roundhouse-structure_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «transport» не по картинке → transport · флаги: meta-word-in-name · теги: -house -road +station
- комментарий: красное полукруглое депо веером, это не дорога

### Immersive Railroading Steamworks Station

- файл: `roads_immersive-railroading-steamworks-station_mc-mod_x.schem` · категория: **transport** · теги: medium|station · 66x18x41 · 5136 блоков · источник: mc-mod
- превью: `schemes/thumbs/roads_immersive-railroading-steamworks-station_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «transport» не по картинке → transport · теги: -road
- комментарий: красный цех-станция с депо, к дорогам не относится

### Large Car Park

- файл: `parks_large-car-park_mc-mod_x.schem` · категория: **transport** · теги: medium|parking · 191x2x175 · 33721 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_large-car-park_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «transport» не по картинке → transport · флаги: non-building-in-name · теги: -park +parking -car
- комментарий: пустая асфальтовая парковка, парка и машин нет

### Simple Train Station

- файл: `transport_simple-train-station_mc-mod_x.schem` · категория: **transport** · теги: tiny · 6x11x16 · 432 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_simple-train-station_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · теги: -station
- комментарий: серая коробка без признаков станции

### Small Concrete Bus Stop Schematic

- файл: `commercial_small-concrete-bus-stop-schematic_mc-mod_x.schem` · категория: **transport** · теги: small|station · 15x6x25 · 235 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_small-concrete-bus-stop-schematic_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «transport» не по картинке → transport · флаги: meta-word-in-name, non-building-in-name · теги: +station -shop
- комментарий: длинный бетонный навес с лавками, остановка читается

### Standard Railroad Station

- файл: `roads_standard-railroad-station_mc-mod_x.schem` · категория: **transport** · теги: station|tiny · 11x8x11 · 401 блоков · источник: mc-mod
- превью: `schemes/thumbs/roads_standard-railroad-station_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «transport» не по картинке → transport · теги: -road
- комментарий: красный сарай с серой крышей, рельсов не видно

### Subway Tunnel Structure

- файл: `bridges_subway-tunnel-structure_mc-mod_x.schem` · категория: **transport** · теги: tiny · 7x5x18 · 450 блоков · источник: mc-mod
- превью: `schemes/thumbs/bridges_subway-tunnel-structure_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «transport» не по картинке → transport · флаги: meta-word-in-name
- комментарий: короткий серый тоннельный сегмент с путями; это не мост

### Airfield and Barracks Structure

- файл: `public_airfield-and-barracks-structure_mc-mod_x.schematic` · категория: **transport** · теги: medium · 47x16x134 · 11553 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_airfield-and-barracks-structure_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «transport» не по картинке → transport · флаги: meta-word-in-name
- комментарий: ряд арочных ангаров вдоль полосы; к общественным не относится

### Bus Stop

- файл: `vehicles_bus-stop_mcbuild_x.schem` · категория: **transport** · теги: tiny · 5x7x8 · 99 блоков · источник: mcbuild
- превью: `schemes/thumbs/vehicles_bus-stop_mcbuild_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «transport» не по картинке → transport · флаги: duplicate-name, non-building-in-name
- комментарий: маленький навес остановки со скамьёй; не техника, а транспортная инфраструктура

### bus stop

- файл: `vehicles_bus-stop_mcbuild_x-2.schem` · категория: **transport** · теги: tiny · 16x7x10 · 305 блоков · источник: mcbuild
- превью: `schemes/thumbs/vehicles_bus-stop_mcbuild_x-2.png`
- вердикт: РАСХОЖДЕНИЕ · категория «transport» не по картинке → transport · флаги: duplicate-name, non-building-in-name
- комментарий: навес остановки с лавками и урнами; относится к транспорту, не к технике

### bus stop

- файл: `vehicles_bus-stop_mcbuild_x-3.schem` · категория: **transport** · теги: small · 15x6x25 · 235 блоков · источник: mcbuild
- превью: `schemes/thumbs/vehicles_bus-stop_mcbuild_x-3.png`
- вердикт: РАСХОЖДЕНИЕ · категория «transport» не по картинке → transport · флаги: duplicate-name, non-building-in-name
- комментарий: длинная платформа остановки с навесом; категория скорее transport

### Luxury Yacht - Small Boat Design

- файл: `waterfront_luxury-yacht-small-boat-design_buildschematics_x.schem` · категория: **vehicles** · теги: boat|small · 46x14x11 · 1696 блоков · источник: buildschematics
- превью: `schemes/thumbs/waterfront_luxury-yacht-small-boat-design_buildschematics_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «vehicles» не по картинке → vehicles · флаги: vehicle · теги: -shop · разошлись правила и картинка (words→commercial, image→vehicles)
- комментарий: белая яхта с красной окантовкой палубы; судно должно быть в vehicles, магазина нет

### Medium Yacht Boat

- файл: `waterfront_medium-yacht-boat_buildschematics_x.schem` · категория: **vehicles** · теги: boat|medium · 20x20x61 · 4725 блоков · источник: buildschematics
- превью: `schemes/thumbs/waterfront_medium-yacht-boat_buildschematics_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «vehicles» не по картинке → vehicles · флаги: vehicle
- комментарий: бледная яхта с надстройкой; судно попало не в ту категорию, нужен vehicles

### Small Motorboat Vehicle

- файл: `waterfront_small-motorboat-vehicle_buildschematics_x.nbt` · категория: **vehicles** · теги: boat|tiny · 8x3x5 · 35 блоков · источник: buildschematics
- превью: `schemes/thumbs/waterfront_small-motorboat-vehicle_buildschematics_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «vehicles» не по картинке → vehicles · флаги: vehicle · теги: -shop · разошлись правила и картинка (words→commercial, image→vehicles)
- комментарий: коричневый катер с бледной палубой — судно, waterfront ему не подходит

### Small Yacht for One or Two

- файл: `waterfront_small-yacht-for-one-or-two_buildschematics_x.schem` · категория: **vehicles** · теги: boat|medium · 58x32x23 · 1097 блоков · источник: buildschematics
- превью: `schemes/thumbs/waterfront_small-yacht-for-one-or-two_buildschematics_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «vehicles» не по картинке → vehicles · флаги: vehicle · теги: -shop · разошлись правила и картинка (words→commercial, image→vehicles)
- комментарий: судно-яхта на воде: это техника, а не набережная, и торговой палубы не видно

### Furnished Yacht 

- файл: `waterfront_furnished-yacht_mcbuild_x.schem` · категория: **vehicles** · теги: boat|large|tall · 39x43x169 · 21400 блоков · источник: mcbuild
- превью: `schemes/thumbs/waterfront_furnished-yacht_mcbuild_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «vehicles» не по картинке → vehicles · флаги: vehicle
- комментарий: многопалубная белая яхта с мостиком и антеннами: судно, а не прибрежная застройка

### Large Yacht

- файл: `waterfront_large-yacht_mcbuild_x.schem` · категория: **vehicles** · теги: boat|medium · 76x19x19 · 7330 блоков · источник: mcbuild
- превью: `schemes/thumbs/waterfront_large-yacht_mcbuild_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «vehicles» не по картинке → vehicles · флаги: vehicle
- комментарий: длинное белое судно с палубами на синей воде, скорее лайнер, чем здание набережной

### Airport Service Truck

- файл: `waterfront_airport-service-truck_mc-mod_x.schem` · категория: **vehicles** · теги: car|tiny · 6x5x17 · 156 блоков · источник: mc-mod
- превью: `schemes/thumbs/waterfront_airport-service-truck_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «vehicles» не по картинке → vehicles · флаги: non-building-in-name, vehicle · разошлись правила и картинка (words→transport, image→vehicles)
- комментарий: маленькая белая служебная машина с синими блоками: это транспорт, а не набережная

### Classic School Bus Design

- файл: `public_classic-school-bus-design_mc-mod_x.schem` · категория: **vehicles** · теги: school|tiny · 17x5x5 · 134 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_classic-school-bus-design_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «vehicles» не по картинке → vehicles · флаги: non-building-in-name, vehicle
- комментарий: жёлтый школьный автобус на асфальтовой площадке, здания здесь нет

### Fire Truck Vehicle

- файл: `public_fire-truck-vehicle_mc-mod_x.schem` · категория: **vehicles** · теги: car|tiny · 13x5x5 · 75 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_fire-truck-vehicle_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «vehicles» не по картинке → vehicles · флаги: non-building-in-name, vehicle
- комментарий: крошечная красная пожарная машина, а не общественное здание

### Police Car Vehicle

- файл: `public_police-car-vehicle_mc-mod_x.schem` · категория: **vehicles** · теги: car|medium · 36x32x88 · 9052 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_police-car-vehicle_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «vehicles» не по картинке → vehicles · флаги: non-building-in-name, vehicle
- комментарий: полицейский седан вид сверху; не общественное здание

### Police Vehicle

- файл: `public_police-vehicle_mc-mod_x.schem` · категория: **vehicles** · теги: tiny · 6x6x10 · 74 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_police-vehicle_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «vehicles» не по картинке → vehicles · флаги: vehicle
- комментарий: крошечная угловатая машинка; полиция не читается

### Small Police Car Schematic

- файл: `commercial_small-police-car-schematic_mc-mod_x.schem` · категория: **vehicles** · теги: car|medium · 22x21x56 · 3393 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_small-police-car-schematic_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «vehicles» не по картинке → vehicles · флаги: meta-word-in-name, non-building-in-name, vehicle · теги: -shop
- комментарий: бело-серый патрульный автомобиль, не торговое здание

### Off-Road 6×6 Tanker Truck

- файл: `roads_off-road-6x6-tanker-truck_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 12x6x5 · 78 блоков · источник: mc-mod
- превью: `schemes/thumbs/roads_off-road-6x6-tanker-truck_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «vehicles» не по картинке → vehicles · флаги: non-building-in-name, vehicle · теги: -road
- комментарий: разрозненные детали танкера-грузовика, дороги рядом нет

### Street Cleaning Tanker Truck

- файл: `roads_street-cleaning-tanker-truck_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 14x6x5 · 91 блоков · источник: mc-mod
- превью: `schemes/thumbs/roads_street-cleaning-tanker-truck_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «vehicles» не по картинке → vehicles · флаги: non-building-in-name, vehicle · теги: -road -tree
- комментарий: цистерна-грузовик, дороги и дерева рядом нет

### European Style Prison Bus

- файл: `vehicles_european-style-prison-bus_mc-mod_1.18.1.schem` · категория: **vehicles** · теги: large · 84x38x40 · 9177 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_european-style-prison-bus_mc-mod_1.18.1.png`
- вердикт: РАСХОЖДЕНИЕ · название: не совпадает · флаги: non-building-in-name
- комментарий: на превью ландшафт с дорогой и деревьями, автобуса не видно

### Island Lighthouse Structure

- файл: `residential_island-lighthouse-structure_buildschematics_x.schem` · категория: **waterfront** · теги: medium|tall|water · 25x76x27 · 21876 блоков · источник: buildschematics
- превью: `schemes/thumbs/residential_island-lighthouse-structure_buildschematics_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «waterfront» не по картинке → waterfront · флаги: meta-word-in-name · теги: -house
- комментарий: светлая башня маяка на кубе воды, к жилым зданиям не относится, нужна набережная

### Sandstone Cliffside Mansion with Boat Dock

- файл: `transport_sandstone-cliffside-mansion-with-boat-dock_buildschematics_x.schem` · категория: **waterfront** · теги: boat|house|huge|water · 163x36x110 · 216123 блоков · источник: buildschematics
- превью: `schemes/thumbs/transport_sandstone-cliffside-mansion-with-boat-dock_buildschematics_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «waterfront» не по картинке → waterfront
- комментарий: песчаниковый особняк на склоне у воды с доком; категория transport не соответствует

### Light House (with working lights)

- файл: `residential_light-house--with-working-lights-_mcbuild_x.schem` · категория: **waterfront** · теги: medium|tall · 31x54x32 · 6248 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_light-house--with-working-lights-_mcbuild_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «waterfront» не по картинке → waterfront · теги: -house
- комментарий: полосатый маяк на скалистом острове в воде; к жилой застройке не относится

### Functional Lighthouse

- файл: `residential_functional-lighthouse_mc-mod_x.schem` · категория: **waterfront** · теги: medium|tall|tower|water · 20x51x20 · 5391 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_functional-lighthouse_mc-mod_x.png`
- вердикт: РАСХОЖДЕНИЕ · категория «waterfront» не по картинке → waterfront · теги: +tower -house
- комментарий: стройная светлая башня маяка без жилья, у воды уместнее

### Fallout 3 Inspired Overpass Ramp

- файл: `bridges_fallout-3-inspired-overpass-ramp_mc-mod_x.schem` · категория: **bridges** · теги: bridge|medium|tall · 47x45x29 · 4943 блоков · источник: mc-mod
- превью: `schemes/thumbs/bridges_fallout-3-inspired-overpass-ramp_mc-mod_x.png`
- флаги: franchise · теги: +bridge
- комментарий: эстакада на столбе, тег моста отсутствует

### Fallout 3 Style Overpass Structure

- файл: `bridges_fallout-3-style-overpass-structure_mc-mod_x.schem` · категория: **bridges** · теги: medium|tall · 39x42x40 · 4593 блоков · источник: mc-mod
- превью: `schemes/thumbs/bridges_fallout-3-style-overpass-structure_mc-mod_x.png`
- флаги: franchise, meta-word-in-name
- комментарий: обломок эстакады на опоре, дорожное полотно видно сверху

### Fallout 3 Style Overpass

- файл: `bridges_fallout-3-style-overpass_mc-mod_x.schem` · категория: **bridges** · теги: medium|tall · 48x42x29 · 4750 блоков · источник: mc-mod
- превью: `schemes/thumbs/bridges_fallout-3-style-overpass_mc-mod_x.png`
- флаги: franchise
- комментарий: прямой пролёт эстакады на бетонной опоре, читается

### Blacksmith Shop House

- файл: `commercial_blacksmith-shop-house_buildschematics_x.schem` · категория: **commercial** · теги: house|shop|small · 34x15x15 · 2543 блоков · источник: buildschematics
- превью: `schemes/thumbs/commercial_blacksmith-shop-house_buildschematics_x.png`
- флаги: fantasy, non-real/fantasy
- комментарий: Открытая деревянная постройка с тяжёлой двускатной крышей, кузницы или наковальни не видно.

### Shopping Mall Elevator with Floor Selection

- файл: `commercial_shopping-mall-elevator-with-floor-selection_buildschematics_x.schem` · категория: **commercial** · теги: medium · 28x30x23 · 7321 блоков · источник: buildschematics
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

- файл: `commercial_mall-shop_mcbuild_x.schem` · категория: **commercial** · теги: medium|shop · 36x55x59 · 15877 блоков · источник: mcbuild
- превью: `schemes/thumbs/commercial_mall-shop_mcbuild_x.png`
- флаги: text · теги: -tall
- комментарий: широкое здание с витринами и фонарями у входа, на крыше крупная надпись; невысокое

### Modern Gas Station &amp; Truck Stop

- файл: `commercial_modern-gas-station-truck-stop_mc-mod_x.schem` · категория: **commercial** · теги: medium|modern|station · 62x11x114 · 8958 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_modern-gas-station-truck-stop_mc-mod_x.png`
- флаги: non-building-in-name · теги: -car · разошлись правила и картинка (words→transport, image→ok)
- комментарий: Огромная пустая плита, навес крошечный, машин нет

### Modern Style Shop

- файл: `commercial_modern-style-shop_mc-mod_x.schem` · категория: **commercial** · теги: modern|small · 28x11x23 · 2932 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_modern-style-shop_mc-mod_x.png`
- флаги: empty · теги: -shop
- комментарий: пустая белая коробка без витрин и входа, читается слабо

### Small Carwash Station

- файл: `commercial_small-carwash-station_mc-mod_x.schem` · категория: **commercial** · теги: station|tiny · 13x7x9 · 395 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_small-carwash-station_mc-mod_x.png`
- флаги: non-building-in-name · теги: -car -shop
- комментарий: стеклянный павильон с коричневыми проёмами, машин и мойки нет

### Tails&#8217; Workshop Recreation

- файл: `commercial_tails-workshop-recreation_mc-mod_x.schem` · категория: **commercial** · теги: shop|small · 15x13x18 · 928 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_tails-workshop-recreation_mc-mod_x.png`
- флаги: franchise
- комментарий: компактная коричневая мастерская; герой Соника, франшиза

### Truck Stop Gas Station

- файл: `commercial_truck-stop-gas-station_mc-mod_x.schem` · категория: **commercial** · теги: huge|station · 132x13x314 · 15472 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_truck-stop-gas-station_mc-mod_x.png`
- флаги: non-building-in-name · теги: -car · разошлись правила и картинка (words→transport, image→ok)
- комментарий: длинная полоса заправки для фур; машин не видно

### Witch’s Potion Shop House

- файл: `commercial_witchs-potion-shop-house_mc-mod_x.schematic` · категория: **commercial** · теги: house|small · 17x21x21 · 1985 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_witchs-potion-shop-house_mc-mod_x.png`
- флаги: fantasy, non-real/fantasy · теги: -shop
- комментарий: деревянный домик с витражом читается, ведьмовского и лавки не видно

### Fallout 3 Diner Restaurant Build

- файл: `commercial_fallout-3-diner-restaurant-build_mc-mod_x.schematic` · категория: **commercial** · теги: tiny · 17x6x14 · 499 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_fallout-3-diner-restaurant-build_mc-mod_x.png`
- флаги: franchise, meta-word-in-name
- комментарий: приземистый дайнер с плоской крышей, читается; отсылка к игре

### Birch Blacksmith Shop

- файл: `commercial_birch-blacksmith-shop_mc-mod_x.schematic` · категория: **commercial** · теги: shop|tiny · 7x6x10 · 276 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_birch-blacksmith-shop_mc-mod_x.png`
- флаги: fantasy, non-real/fantasy · теги: -tree
- комментарий: маленькая лавка с плоской крышей, кузни и березы не видно

### Blacksmith Shop Structure

- файл: `commercial_blacksmith-shop-structure_mc-mod_x.schematic` · категория: **commercial** · теги: shop|tiny · 7x6x10 · 276 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_blacksmith-shop-structure_mc-mod_x.png`
- флаги: fantasy, meta-word-in-name, non-real/fantasy
- комментарий: маленькая лавка с красным карнизом, кузня не читается

### Brick Blacksmith Shop

- файл: `commercial_brick-blacksmith-shop_mc-mod_x.schematic` · категория: **commercial** · теги: shop|tiny · 7x6x10 · 276 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_brick-blacksmith-shop_mc-mod_x.png`
- флаги: fantasy, non-real/fantasy
- комментарий: маленькая лавка с красным цоколем, кузнечного не видно

### Blacksmith Shop NPC

- файл: `commercial_blacksmith-shop-npc_mc-mod_x.schematic` · категория: **commercial** · теги: shop|tiny · 7x6x10 · 276 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_blacksmith-shop-npc_mc-mod_x.png`
- флаги: fantasy, non-real/fantasy
- комментарий: та же маленькая лавка, персонажа и кузни не видно

### Blacksmith Shop in Jungle Setting

- файл: `commercial_blacksmith-shop-in-jungle-setting_mc-mod_x.schematic` · категория: **commercial** · теги: shop|tiny · 7x6x10 · 276 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_blacksmith-shop-in-jungle-setting_mc-mod_x.png`
- флаги: fantasy, non-real/fantasy
- комментарий: та же маленькая лавка, джунглей вокруг нет

### Oak Blacksmith Shop

- файл: `commercial_oak-blacksmith-shop_mc-mod_x.schematic` · категория: **commercial** · теги: shop|tiny · 7x6x10 · 276 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_oak-blacksmith-shop_mc-mod_x.png`
- флаги: fantasy, non-real/fantasy · теги: -tree
- комментарий: маленькая лавка без дуба и кузни, деревьев нет

### Blacksmith Shop – Sandstone Design

- файл: `commercial_blacksmith-shop-sandstone-design_mc-mod_x.schematic` · категория: **commercial** · теги: shop|tiny · 7x6x10 · 276 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_blacksmith-shop-sandstone-design_mc-mod_x.png`
- флаги: fantasy, non-real/fantasy
- комментарий: маленькая лавка с песочным навесом, кузня не читается

### Spruce Blacksmith Shop

- файл: `commercial_spruce-blacksmith-shop_mc-mod_x.schematic` · категория: **commercial** · теги: shop|tiny · 7x6x10 · 276 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_spruce-blacksmith-shop_mc-mod_x.png`
- флаги: fantasy, non-real/fantasy · теги: -tree
- комментарий: та же маленькая лавка, ели и кузни не видно

### Blacksmith Shop Exterior

- файл: `commercial_blacksmith-shop-exterior_mc-mod_x.schematic` · категория: **commercial** · теги: shop|tiny · 7x6x10 · 276 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_blacksmith-shop-exterior_mc-mod_x.png`
- флаги: fantasy, non-real/fantasy
- комментарий: маленькая лавка, виден лишь фасад без кузни

### Small Minecraft Bakery Shop

- файл: `commercial_small-minecraft-bakery-shop_mc-mod_x.schematic` · категория: **commercial** · теги: shop|tiny · 5x4x10 · 76 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_small-minecraft-bakery-shop_mc-mod_x.png`
- флаги: franchise
- комментарий: крошечный прилавок-навес, на пекарню похоже слабо

### Cascade City

- файл: `decor_cascade-city_mcbuild_x.schem` · категория: **decor** · теги: huge|tall · 101x109x102 · 84485 блоков · источник: mcbuild
- превью: `schemes/thumbs/decor_cascade-city_mcbuild_x.png`
- флаги: fantasy
- комментарий: не город, а декоративная башня с круглыми каскадными площадками и растительностью

### Fallout 3 Billboard Structure

- файл: `decor_fallout-3-billboard-structure_mc-mod_x.schematic` · категория: **decor** · теги: tiny · 10x6x4 · 80 блоков · источник: mc-mod
- превью: `schemes/thumbs/decor_fallout-3-billboard-structure_mc-mod_x.png`
- флаги: franchise, meta-word-in-name
- комментарий: коричневый щит билборда, читается; отсылка к франшизе

### Large Advertisement Billboard Structure

- файл: `decor_large-advertisement-billboard-structure_mc-mod_x.schematic` · категория: **decor** · теги: medium|tall · 49x41x13 · 2765 блоков · источник: mc-mod
- превью: `schemes/thumbs/decor_large-advertisement-billboard-structure_mc-mod_x.png`
- флаги: meta-word-in-name
- комментарий: голый ферменный каркас щита без рекламного полотна

### fallout 3 billboard- zth

- файл: `decor_fallout-3-billboard-zth_mcbuild_x.schem` · категория: **decor** · теги: tiny · 10x6x4 · 80 блоков · источник: mcbuild
- превью: `schemes/thumbs/decor_fallout-3-billboard-zth_mcbuild_x.png`
- флаги: franchise
- комментарий: крошечная пустая табличка без надписи; франшиза лишь в имени

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

- файл: `industrial_small-grain-elevator-structure_buildschematics_x.schem` · категория: **industrial** · теги: large|tall · 26x67x72 · 10390 блоков · источник: buildschematics
- превью: `schemes/thumbs/industrial_small-grain-elevator-structure_buildschematics_x.png`
- флаги: meta-word-in-name, non-building-in-name · теги: -shop · разошлись правила и картинка (words→commercial, image→ok)
- комментарий: ряд высоких вертикальных силосов, элеватор читается; тег shop лишний

### Glass Factory Build

- файл: `industrial_glass-factory-build_mc-mod_x.schem` · категория: **industrial** · теги: medium · 26x38x28 · 26789 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_glass-factory-build_mc-mod_x.png`
- флаги: meta-word-in-name
- комментарий: бежевая коробка с ленточными окнами, цех угадывается слабо

### Industrial Warehouse Fence and Gate

- файл: `industrial_industrial-warehouse-fence-and-gate_mc-mod_x.schematic` · категория: **industrial** · теги: tiny · 1x5x49 · 245 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_industrial-warehouse-fence-and-gate_mc-mod_x.png`
- флаги: non-building-in-name · теги: -house
- комментарий: длинный складской забор, домика рядом нет

### Small Industrial Factory Structure

- файл: `industrial_small-industrial-factory-structure_mc-mod_x.schematic` · категория: **industrial** · теги: small · 22x32x19 · 1171 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_small-industrial-factory-structure_mc-mod_x.png`
- флаги: meta-word-in-name · теги: -shop
- комментарий: цех со стеклянной крышей, витрины магазина не видно

### Modern Water Mill Structure

- файл: `industrial_modern-water-mill-structure_mc-mod_x.schematic` · категория: **industrial** · теги: small · 17x37x17 · 1414 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_modern-water-mill-structure_mc-mod_x.png`
- флаги: meta-word-in-name · теги: -modern
- комментарий: деревянный ветряк со стеклами, на modern не тянет

### AIK Foundry Structure

- файл: `industrial_aik-foundry-structure_mc-mod_1.14.4.schem` · категория: **industrial** · теги: medium|tall · 29x60x36 · 61258 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_aik-foundry-structure_mc-mod_1.14.4.png`
- флаги: meta-word-in-name
- комментарий: глухой бежевый куб, признаков литейни нет

### Pixelmon Maze Power Plant

- файл: `industrial_pixelmon-maze-power-plant_buildschematics_x.schematic` · категория: **industrial** · теги: medium|tall · 38x45x66 · 25170 блоков · источник: buildschematics
- превью: `schemes/thumbs/industrial_pixelmon-maze-power-plant_buildschematics_x.png`
- флаги: franchise
- комментарий: серый корпус с вентиляцией; Pixelmon в имени — франшиза

### fallout 3 substation v1- zth

- файл: `industrial_fallout-3-substation-v1-zth_mcbuild_x.schem` · категория: **industrial** · теги: small|station · 26x9x19 · 1393 блоков · источник: mcbuild
- превью: `schemes/thumbs/industrial_fallout-3-substation-v1-zth_mcbuild_x.png`
- флаги: franchise, meta-word-in-name · разошлись правила и картинка (words→transport, image→ok)
- комментарий: красный корпус подстанции; префикс франшизы и мусор в имени лишние

### fallout 3 substation v2- zth

- файл: `industrial_fallout-3-substation-v2-zth_mcbuild_x.schem` · категория: **industrial** · теги: small|station · 25x10x20 · 1523 блоков · источник: mcbuild
- превью: `schemes/thumbs/industrial_fallout-3-substation-v2-zth_mcbuild_x.png`
- флаги: franchise, meta-word-in-name · разошлись правила и картинка (words→transport, image→ok)
- комментарий: серая подстанция из четырёх ячеек; франшиза и версия в имени лишние

### Storage Warehouse V1

- файл: `industrial_storage-warehouse-v1_buildschematics_x.nbt` · категория: **industrial** · теги: medium|shop · 69x17x68 · 6860 блоков · источник: buildschematics
- превью: `schemes/thumbs/industrial_storage-warehouse-v1_buildschematics_x.png`
- флаги: meta-word-in-name · теги: -house +shop
- комментарий: складской двор с лотками; версия в имени лишняя, дома нет

### Sewer Template Intersection Shape

- файл: `intersections_sewer-template-intersection-shape_mcbuild_x.schem` · категория: **intersections** · теги:  · 47x6x47 · 1923 блоков · источник: mcbuild
- превью: `schemes/thumbs/intersections_sewer-template-intersection-shape_mcbuild_x.png`
- флаги: meta-word-in-name · теги: -small
- комментарий: иксообразный тоннельный узел; на small не тянет

### Four Tier Garden Structure

- файл: `parks_four-tier-garden-structure_buildschematics_x.schem` · категория: **parks** · теги: medium|park|tall · 36x69x37 · 14348 блоков · источник: buildschematics
- превью: `schemes/thumbs/parks_four-tier-garden-structure_buildschematics_x.png`
- флаги: meta-word-in-name
- комментарий: Четыре круглых яруса, сложенные башней-тортом; зелени и клумб на них не видно.

### SuperMario Parkour

- файл: `parks_supermario-parkour_mcbuild_x.schem` · категория: **parks** · теги: small · 73x10x4 · 1699 блоков · источник: mcbuild
- превью: `schemes/thumbs/parks_supermario-parkour_mcbuild_x.png`
- флаги: franchise, text · теги: -park
- комментарий: полоса паркура с пиксель-артом фигур из Марио; парковой застройки нет, только аттракционная разметка

### Peaceful Minecraft Garden Oasis Build

- файл: `parks_peaceful-minecraft-garden-oasis-build_mc-mod_x.schem` · категория: **parks** · теги: medium|park|tree|water · 66x27x30 · 14270 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_peaceful-minecraft-garden-oasis-build_mc-mod_x.png`
- флаги: franchise, meta-word-in-name · теги: +water +tree
- комментарий: ландшафт с рекой и лагерем; сада как постройки нет

### Simple Minecraft Tree

- файл: `parks_simple-minecraft-tree_mc-mod_x.schematic` · категория: **parks** · теги: tiny|tree · 8x12x6 · 153 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_simple-minecraft-tree_mc-mod_x.png`
- флаги: franchise · разошлись правила и картинка (words→industrial, image→ok)
- комментарий: одинокий ствол без кроны; дерево угадывается слабо

### Gothic Square Structure

- файл: `parks_gothic-square-structure_mc-mod_1.20.1.schem` · категория: **parks** · теги: fountain|large|park · 91x29x91 · 14299 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_gothic-square-structure_mc-mod_1.20.1.png`
- флаги: meta-word-in-name · теги: +fountain
- комментарий: круглая площадь с центральным монументом; готики не видно

### Playground Park for Minecrafty Town

- файл: `parks_playground-park-for-minecrafty-town_mc-mod_1.19.4.schem` · категория: **parks** · теги: park|small · 18x9x16 · 122 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_playground-park-for-minecrafty-town_mc-mod_1.19.4.png`
- флаги: franchise
- комментарий: абстрактные горки-лазалки в раме; площадка угадывается

### Tropical Palm Tree

- файл: `parks_tropical-palm-tree_mc-mod_x.schematic` · категория: **parks** · теги: tiny|tree · 7x9x4 · 38 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_tropical-palm-tree_mc-mod_x.png`
- флаги: empty · разошлись правила и картинка (words→decor, image→ok)
- комментарий: огрызок ствола из пары блоков без кроны

### Small Tree Decoration

- файл: `parks_small-tree-decoration_mc-mod_x.schematic` · категория: **parks** · теги: tiny|tree · 5x10x7 · 11 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_small-tree-decoration_mc-mod_x.png`
- флаги: almost-empty, empty · теги: -shop · разошлись правила и картинка (words→commercial, image→ok)
- комментарий: прутик-рогатка из пары блоков; декор едва читается

### 3Tri’s Modern Garden Structure

- файл: `parks_3tris-modern-garden-structure_mc-mod_x.schematic` · категория: **parks** · теги: medium|modern · 47x37x50 · 5002 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_3tris-modern-garden-structure_mc-mod_x.png`
- флаги: meta-word-in-name · теги: -park
- комментарий: три белые пилонные башни на плитке; сада не видно

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

### Compact Hospital Structure

- файл: `public_compact-hospital-structure_mc-mod_x.schem` · категория: **public** · теги: hospital|medium · 28x31x36 · 2368 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_compact-hospital-structure_mc-mod_x.png`
- флаги: meta-word-in-name
- комментарий: бледный компактный корпус с башней, функция больницы снаружи не читается

### Eldwyn Library Structure

- файл: `public_eldwyn-library-structure_mc-mod_x.schem` · категория: **public** · теги: castle-like|large|library|tall · 73x60x101 · 23651 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_eldwyn-library-structure_mc-mod_x.png`
- флаги: fantasy, meta-word-in-name · теги: +castle-like
- комментарий: сказочный дворцовый корпус, фэнтезийные крыши

### Fallout 3 Springvale School Building

- файл: `public_fallout-3-springvale-school-building_mc-mod_x.schem` · категория: **public** · теги: large|school|tall · 80x41x100 · 85884 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_fallout-3-springvale-school-building_mc-mod_x.png`
- флаги: franchise
- комментарий: руины школьного двора с колоннадой и трибунами, масштабно

### Futuristic Stadium Panel

- файл: `public_futuristic-stadium-panel_mc-mod_x.schem` · категория: **public** · теги: modern|stadium|tiny · 57x9x3 · 867 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_futuristic-stadium-panel_mc-mod_x.png`
- флаги: text
- комментарий: серая стеновая панель с надписью, фрагмент трибуны

### Geologic Museum Minecraft Build

- файл: `public_geologic-museum-minecraft-build_mc-mod_x.schem` · категория: **public** · теги: museum|small · 23x11x21 · 1217 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_geologic-museum-minecraft-build_mc-mod_x.png`
- флаги: franchise, meta-word-in-name
- комментарий: крестообразный деревянный павильон, музей не считывается

### Mystcraft-Inspired Library Structure

- файл: `public_mystcraft-inspired-library-structure_mc-mod_x.schem` · категория: **public** · теги: small · 17x10x17 · 655 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_mystcraft-inspired-library-structure_mc-mod_x.png`
- флаги: empty, meta-word-in-name · теги: -library
- комментарий: серая коробка с лестницей; библиотеки не читается

### Old Church Structure

- файл: `public_old-church-structure_mc-mod_x.schem` · категория: **public** · теги: church|tiny · 49x20x64 · 4252 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_old-church-structure_mc-mod_x.png`
- флаги: meta-word-in-name · теги: -medium +tiny
- комментарий: крошечная часовня на большом участке; medium не подходит

### Quaint Library Structure

- файл: `public_quaint-library-structure_mc-mod_x.schem` · категория: **public** · теги: medium · 9x256x14 · 749 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_quaint-library-structure_mc-mod_x.png`
- флаги: meta-word-in-name · теги: -library -tall
- комментарий: плоская коричневая коробка на подложке, библиотеки не видно

### Yandere High School Electric Chair Room

- файл: `public_yandere-high-school-electric-chair-room_mc-mod_x.schem` · категория: **public** · теги: tiny · 8x5x9 · 289 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_yandere-high-school-electric-chair-room_mc-mod_x.png`
- флаги: franchise · теги: -school
- комментарий: серая коробка комнаты, стул не виден; школьного не заметно

### Yandere High School: Insane Rooms

- файл: `public_yandere-high-school-insane-rooms_mc-mod_x.schematic` · категория: **public** · теги: tiny · 5x5x11 · 212 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_yandere-high-school-insane-rooms_mc-mod_x.png`
- флаги: franchise · теги: -school
- комментарий: два красных отсека-камеры; школы вокруг не видно

### Fallout Drive-In Movie Theater

- файл: `public_fallout-drive-in-movie-theater_mc-mod_x.schematic` · категория: **public** · теги: tiny · 3x10x16 · 172 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_fallout-drive-in-movie-theater_mc-mod_x.png`
- флаги: franchise
- комментарий: светлая стена-экран и две тёмные тумбы; площадки кино нет

### Small Prison Structure

- файл: `public_small-prison-structure_mc-mod_x.schematic` · категория: **public** · теги: medium · 89x11x30 · 12939 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_small-prison-structure_mc-mod_x.png`
- флаги: meta-word-in-name · теги: -shop · разошлись правила и картинка (words→commercial, image→ok)
- комментарий: длинный красный корпус с двором и рядами камер; лавок нет

### Britain’s Got Talent Theatre with Interior

- файл: `public_britain-s-got-talent-theatre-with-interior_mc-mod_1.16.5.schem` · категория: **public** · теги: large|tall · 82x50x76 · 91212 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_britain-s-got-talent-theatre-with-interior_mc-mod_1.16.5.png`
- флаги: franchise
- комментарий: глухая коричневая коробка без признаков театра и интерьера

### Simple Jail Structure

- файл: `public_simple-jail-structure_mc-mod_x.schematic` · категория: **public** · теги: tiny · 6x6x6 · 83 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_simple-jail-structure_mc-mod_x.png`
- флаги: meta-word-in-name
- комментарий: крошечный двухцветный куб без решёток и двери; камер не видно

### Bedrock Prison Structure

- файл: `public_bedrock-prison-structure_mc-mod_1.16.4.schem` · категория: **public** · теги: tiny · 7x4x8 · 162 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_bedrock-prison-structure_mc-mod_1.16.4.png`
- флаги: meta-word-in-name
- комментарий: малый красный бокс с двумя окнами; тюремного не видно

### Simple Courthouse Design V2

- файл: `public_simple-courthouse-design-v2_mc-mod_1.16.5.schem` · категория: **public** · теги: medium · 36x12x38 · 1566 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_simple-courthouse-design-v2_mc-mod_1.16.5.png`
- флаги: meta-word-in-name · теги: -house
- комментарий: белый павильон с окнами в крыше; на суд и дом не тянет

### Sims 3 Style City Hall

- файл: `public_sims-3-style-city-hall_buildschematics_x.schematic` · категория: **public** · теги: large|tall · 67x52x40 · 14228 блоков · источник: buildschematics
- превью: `schemes/thumbs/public_sims-3-style-city-hall_buildschematics_x.png`
- флаги: franchise
- комментарий: белый классический сити-холл с башней; Sims в имени — франшиза

### theater

- файл: `public_theater_mcbuild_x.schem` · категория: **public** · теги: medium · 48x32x50 · 11175 блоков · источник: mcbuild
- превью: `schemes/thumbs/public_theater_mcbuild_x.png`
- флаги: duplicate-name
- комментарий: длинный современный серый корпус; театральная функция неявная

### Pixelmon School Building

- файл: `public_pixelmon-school-building_buildschematics_x.schematic` · категория: **public** · теги: huge|school|tall · 118x62x105 · 50968 блоков · источник: buildschematics
- превью: `schemes/thumbs/public_pixelmon-school-building_buildschematics_x.png`
- флаги: franchise
- комментарий: кампус с башней и фонтаном; префикс игры в имени лишний

### Small Soccer Stadium Build

- файл: `public_small-soccer-stadium-build_buildschematics_x.schem` · категория: **public** · теги: large|stadium · 97x27x65 · 10258 блоков · источник: buildschematics
- превью: `schemes/thumbs/public_small-soccer-stadium-build_buildschematics_x.png`
- флаги: meta-word-in-name · теги: -shop · разошлись правила и картинка (words→commercial, image→ok)
- комментарий: поле с трибунами читается; магазинов нет

### Desert Prison Structure

- файл: `public_desert-prison-structure_buildschematics_x.schematic` · категория: **public** · теги: large|tall · 42x74x42 · 93856 блоков · источник: buildschematics
- превью: `schemes/thumbs/public_desert-prison-structure_buildschematics_x.png`
- флаги: meta-word-in-name
- комментарий: коричневый куб с декором; тюремного не видно

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

- файл: `residential_small-modern-house-2_buildschematics_x.schem` · категория: **residential** · теги: house|modern|small · 23x14x25 · 1525 блоков · источник: buildschematics
- превью: `schemes/thumbs/residential_small-modern-house-2_buildschematics_x.png`
- флаги: duplicate-name · теги: -shop · разошлись правила и картинка (words→commercial, image→ok)
- комментарий: коричневый дом с голубыми окнами и светлой террасой; тег shop лишний

### Seaside Nordic Mansion

- файл: `residential_seaside-nordic-mansion_mcbuild_x.schem` · категория: **residential** · теги: house|large|tall · 57x49x57 · 7478 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_seaside-nordic-mansion_mcbuild_x.png`
- флаги: duplicate-name
- комментарий: тёмный деревянный дом с серой крышей на огромном газоне, воды в кадре нет

### Seaside Nordic Mansion

- файл: `residential_seaside-nordic-mansion_mcbuild_x-2.schem` · категория: **residential** · теги: house|large · 57x49x57 · 7478 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_seaside-nordic-mansion_mcbuild_x-2.png`
- флаги: duplicate-name · теги: -tall
- комментарий: белый дом с чёрной кровлей и террасами, стиль читается, но этаж один и моря не видно

### Small Cozy House

- файл: `residential_small-cozy-house_mcbuild_x.schem` · категория: **residential** · теги: house|small · 21x12x13 · 1577 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_small-cozy-house_mcbuild_x.png`
- флаги: duplicate-name · теги: -shop · разошлись правила и картинка (words→commercial, image→ok)
- комментарий: деревянный домик с двускатной кровлей и пристройкой, торговой вывески нет

### Small Cozy House

- файл: `residential_small-cozy-house_mcbuild_x-2.schem` · категория: **residential** · теги: house|small · 21x12x13 · 1577 блоков · источник: mcbuild
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

- файл: `residential_small-modern-house_mcbuild_x.schem` · категория: **residential** · теги: house|medium|modern · 28x24x41 · 9976 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_small-modern-house_mcbuild_x.png`
- флаги: duplicate-name · теги: -shop · разошлись правила и картинка (words→commercial, image→ok)
- комментарий: белый двухэтажный дом с плоской крышей и ограждённым участком, признаков магазина не видно

### Basalt Block House

- файл: `residential_basalt-block-house_mc-mod_x.schem` · категория: **residential** · теги: small · 11x14x17 · 675 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_basalt-block-house_mc-mod_x.png`
- флаги: empty · теги: -house
- комментарий: каркас из серых блоков с балками и фонарями на пустом основании, дом не собран

### City 17 Style Apartment Block

- файл: `residential_city-17-style-apartment-block_mc-mod_x.schem` · категория: **residential** · теги: apartment|medium · 23x24x40 · 8645 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_city-17-style-apartment-block_mc-mod_x.png`
- флаги: franchise
- комментарий: строгий бетонный блок с плоской кровлёй, отсылка к вымышленному городу из игры

### Fallout 3 Player Shack House

- файл: `residential_fallout-3-player-shack-house_mc-mod_x.schem` · категория: **residential** · теги: house|small · 20x12x25 · 2615 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_fallout-3-player-shack-house_mc-mod_x.png`
- флаги: franchise
- комментарий: приземистая лачуга с плоской крышей, разруха в стиле игры видна

### Fallout 3 Rubble House

- файл: `residential_fallout-3-rubble-house_mc-mod_x.schem` · категория: **residential** · теги: house|small · 23x12x19 · 546 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_fallout-3-rubble-house_mc-mod_x.png`
- флаги: franchise
- комментарий: развалины дома с обломками стен и ступенями, читаются

### Kingdom Banker Shop House

- файл: `residential_kingdom-banker-shop-house_mc-mod_x.schem` · категория: **residential** · теги: house|tiny · 11x11x13 · 587 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_kingdom-banker-shop-house_mc-mod_x.png`
- флаги: non-real/fantasy · теги: -bank -shop · разошлись правила и картинка (words→commercial, image→ok)
- комментарий: крошечная деревянная хижина, банка и лавки не видно

### Modern Blue Apartment Building Schematic

- файл: `residential_modern-blue-apartment-building-schematic_mc-mod_x.schem` · категория: **residential** · теги: apartment|modern|small · 22x17x21 · 2520 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_modern-blue-apartment-building-schematic_mc-mod_x.png`
- флаги: meta-word-in-name
- комментарий: корпус в коричневой отделке, синими остеклены только балконы

### Survival Mansion 2-Story Build

- файл: `residential_survival-mansion-2-story-build_mc-mod_x.schem` · категория: **residential** · теги: house|small · 22x10x25 · 2534 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_survival-mansion-2-story-build_mc-mod_x.png`
- флаги: meta-word-in-name
- комментарий: коричневый двухэтажный домик; на особняк не тянет

### Modern House Design with Soartex Textures

- файл: `residential_modern-house-design-with-soartex-textures_mc-mod_x.schematic` · категория: **residential** · теги: house|medium|modern · 31x58x29 · 5279 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_modern-house-design-with-soartex-textures_mc-mod_x.png`
- флаги: non-building-in-name · теги: -tall
- комментарий: модерновый дом с плоской крышей и окнами; высоким не выглядит

### Contemporary Residence Schematic

- файл: `residential_contemporary-residence-schematic_mc-mod_x.schematic` · категория: **residential** · теги: house|modern|small · 21x14x21 · 1243 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_contemporary-residence-schematic_mc-mod_x.png`
- флаги: meta-word-in-name · теги: -apartment +house
- комментарий: ступенчатый коричневый дом; скорее house, чем apartment

### Street Lantern

- файл: `roads_street-lantern_mc-mod_x.schematic` · категория: **roads** · теги: tiny · 1x3x1 · 3 блоков · источник: mc-mod
- превью: `schemes/thumbs/roads_street-lantern_mc-mod_x.png`
- флаги: almost-empty · теги: -road -tree
- комментарий: малый уличный фонарь-столб, дороги и дерева нет

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

### Cyan Tower Build

- файл: `towers_cyan-tower-build_mc-mod_x.schem` · категория: **towers** · теги: small|tall|tower · 13x60x13 · 2068 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_cyan-tower-build_mc-mod_x.png`
- флаги: meta-word-in-name
- комментарий: серая высокая башня с коричневым, циана не видно

### Fallout 3 Power Transmission Tower

- файл: `towers_fallout-3-power-transmission-tower_mc-mod_x.schem` · категория: **towers** · теги: small|tall|tower · 7x44x21 · 862 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_fallout-3-power-transmission-tower_mc-mod_x.png`
- флаги: franchise
- комментарий: тёмная решётчатая опора ЛЭП, высокая и узнаваемая

### Fallout 3 Water Tower Structure

- файл: `towers_fallout-3-water-tower-structure_mc-mod_x.schem` · категория: **towers** · теги: small|tower · 12x27x12 · 400 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_fallout-3-water-tower-structure_mc-mod_x.png`
- флаги: franchise, meta-word-in-name
- комментарий: компактный бак водонапорки на деревянной обвязке, узнаваем

### Small Hilton Hotel Build

- файл: `towers_hotel-hilton_mc-mod_x.schem` · категория: **towers** · теги: hotel|medium · 17x31x31 · 6431 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_hotel-hilton_mc-mod_x.png`
- флаги: meta-word-in-name · теги: -shop · разошлись правила и картинка (words→commercial, image→ok)
- комментарий: серый отель с балконами и оранжевыми окнами, витрин нет

### Massive Skyscraper Structure

- файл: `towers_massive-skyscraper-structure_mc-mod_x.schem` · категория: **towers** · теги: medium|tall|tower · 20x200x20 · 14072 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_massive-skyscraper-structure_mc-mod_x.png`
- флаги: meta-word-in-name
- комментарий: тонкая глухая башня с длинным шпилем, мощного небоскрёба с окнами не видно

### Modern Office Tower with Elevator

- файл: `towers_modern-office-tower-with-elevator_mc-mod_x.schem` · категория: **towers** · теги: modern|office|small|tall|tower · 18x41x17 · 6014 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_modern-office-tower-with-elevator_mc-mod_x.png`
- флаги: non-building-in-name
- комментарий: Приземистый белый корпус, лифт и башня не читаются

### Modern Skyscraper Build

- файл: `towers_modern-skyscraper-build_mc-mod_x.schem` · категория: **towers** · теги: large|modern|tall|tower · 27x105x40 · 39496 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_modern-skyscraper-build_mc-mod_x.png`
- флаги: meta-word-in-name · теги: -medium +large
- комментарий: Полосатая высотка, размер скорее большой а не средний

### Modern Skyscraper Tower

- файл: `towers_modern-skyscraper-tower-11_mc-mod_x.schem` · категория: **towers** · теги: modern|tall|tower · 20x199x20 · 14039 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_modern-skyscraper-tower-11_mc-mod_x.png`
- флаги: duplicate-name · теги: -medium
- комментарий: игла-башня со шпилем высотой под 200 блоков; medium не подходит

### OlimpusHD Tower &#8211; Large Build

- файл: `towers_olimpushd-tower-large-build_mc-mod_x.schem` · категория: **towers** · теги: large|tall|tower · 68x60x57 · 27056 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_olimpushd-tower-large-build_mc-mod_x.png`
- флаги: meta-word-in-name
- комментарий: низкий офисный блок плитой; на башню тянет слабо

### Iron Quartz Skyscraper Near Build Limit

- файл: `towers_skyscraper_mc-mod_x.schem` · категория: **towers** · теги: huge|tall|tower · 12x240x12 · 19856 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_skyscraper_mc-mod_x.png`
- флаги: meta-word-in-name · теги: -medium +huge
- комментарий: неестественно тонкий белый столб до неба, ширина не читается

### Abandonedcraft Fortress Tower

- файл: `towers_abandonedcraft-fortress-tower_mc-mod_x.schematic` · категория: **towers** · теги: large|tall|tower · 28x125x49 · 30854 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_abandonedcraft-fortress-tower_mc-mod_x.png`
- флаги: fantasy, non-real/fantasy · теги: -castle-like
- комментарий: арочная высотка без крепостных черт, замкового нет

### Desert Tower with Enchanting Room

- файл: `towers_desert-tower-with-enchanting-room_mc-mod_x.schematic` · категория: **towers** · теги: medium|tall|tower · 33x56x26 · 4432 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_desert-tower-with-enchanting-room_mc-mod_x.png`
- флаги: fantasy
- комментарий: коричневая шипастая башня с огнями, пустыни не видно

### Steampunk Skyscraper Model

- файл: `towers_steampunk-skyscraper-model_mc-mod_1.19.3.schem` · категория: **towers** · теги: huge|tall|tower · 53x251x56 · 28420 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_steampunk-skyscraper-model_mc-mod_1.19.3.png`
- флаги: fantasy, non-real/fantasy
- комментарий: темная клепаная высотка, стимпанк читается

### Crusader Style Small Tower

- файл: `towers_crusader-style-small-tower_mc-mod_x.schematic` · категория: **towers** · теги: small|tower · 11x22x11 · 853 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_crusader-style-small-tower_mc-mod_x.png`
- флаги: fantasy · теги: -shop · разошлись правила и картинка (words→commercial, image→ok)
- комментарий: приземистый павильон с пирамидальной крышей, лавки нет

### Steampunk Skyscraper Model 4

- файл: `towers_steampunk-skyscraper-model-4_mc-mod_1.19.3.schem` · категория: **towers** · теги: huge|tall|tower · 44x251x50 · 35644 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_steampunk-skyscraper-model-4_mc-mod_1.19.3.png`
- флаги: fantasy, non-real/fantasy
- комментарий: темная башня с красным основанием, стимпанк читается

### Steampunk Skyscraper Model 5 Tower

- файл: `towers_steampunk-skyscraper-model-5-tower_mc-mod_1.19.3.schem` · категория: **towers** · теги: huge|tall|tower · 48x273x47 · 51498 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_steampunk-skyscraper-model-5-tower_mc-mod_1.19.3.png`
- флаги: fantasy, non-real/fantasy
- комментарий: круглая клепаная башня на синем цоколе, читается

### Enchanted End Stone Brick Tower

- файл: `towers_enchanted-end-stone-brick-tower_mc-mod_x.schematic` · категория: **towers** · теги: medium|tall|tower · 17x67x17 · 632 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_enchanted-end-stone-brick-tower_mc-mod_x.png`
- флаги: fantasy, non-real/fantasy
- комментарий: светлая башня из эндер-камня с подсветкой, читается

### Big Ben Clock Tower Replica – Oak & Birch Build

- файл: `towers_big-ben-clock-tower-replica-oak-birch-build_mc-mod_x.schematic` · категория: **towers** · теги: medium|tall|tower · 21x100x24 · 4676 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_big-ben-clock-tower-replica-oak-birch-build_mc-mod_x.png`
- флаги: meta-word-in-name · теги: -tree
- комментарий: высокая коричневая часовая башня; деревьев рядом нет

### Water Tower by iEdgy

- файл: `towers_water-tower-by-iedgy_mcbuild_x.schem` · категория: **towers** · теги: castle-like|medium|tall|tower · 36x57x36 · 5719 блоков · источник: mcbuild
- превью: `schemes/thumbs/towers_water-tower-by-iedgy_mcbuild_x.png`
- флаги: fantasy · теги: +castle-like
- комментарий: ажурная синяя башня без резервуара, скорее фэнтези

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

- файл: `transport_story-modern-parking-garage-structure_mc-mod_x.schem` · категория: **transport** · теги: huge|modern|parking|tall · 81x177x71 · 426226 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_story-modern-parking-garage-structure_mc-mod_x.png`
- флаги: meta-word-in-name · теги: -park · разошлись правила и картинка (words→parks, image→ok)
- комментарий: серая башня с горизонтальными рядами этажей, паркинг неочевиден; зелёного парка нет

### Fallout 3 Inspired Substation

- файл: `transport_fallout-3-inspired-substation_mc-mod_x.schem` · категория: **transport** · теги: small|station · 26x9x19 · 1188 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_fallout-3-inspired-substation_mc-mod_x.png`
- флаги: franchise
- комментарий: красная подстанция с трубами и башнями, постапокалипсис считывается

### Fallout 3 Style Power Station

- файл: `transport_fallout-3-style-power-station_mc-mod_x.schem` · категория: **transport** · теги: large|station|tall · 79x64x58 · 24145 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_fallout-3-style-power-station_mc-mod_x.png`
- флаги: franchise
- комментарий: кирпичный корпус электростанции с тремя трубами, мощный

### Minecraft Railway Station

- файл: `transport_minecraft-railway-station_mc-mod_x.schem` · категория: **transport** · теги: station|tiny · 17x5x18 · 575 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_minecraft-railway-station_mc-mod_x.png`
- флаги: franchise
- комментарий: низкое серое здание с красными блоками, рельсов и платформы не видно

### Modern Parking Garage Structure

- файл: `transport_modern-parking-garage-structure_mc-mod_x.schem` · категория: **transport** · теги: modern|parking|small · 28x10x33 · 2612 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_modern-parking-garage-structure_mc-mod_x.png`
- флаги: meta-word-in-name · теги: -park · разошлись правила и картинка (words→parks, image→ok)
- комментарий: Закрытый паркинг-бокс без зелени, тег парка лишний

### Multi-Level Parking Garage Structure

- файл: `transport_multi-level-parking-garage-structure_mc-mod_x.schem` · категория: **transport** · теги: huge|parking|tall · 169x64x93 · 241162 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_multi-level-parking-garage-structure_mc-mod_x.png`
- флаги: meta-word-in-name · теги: -park · разошлись правила и картинка (words→parks, image→ok)
- комментарий: огромный серый паркинг-короб; парка-сквера нет

### Sand Palace Station

- файл: `transport_sand-palace-station_mc-mod_x.schem` · категория: **transport** · теги: large|station · 87x45x115 · 247767 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_sand-palace-station_mc-mod_x.png`
- флаги: duplicate-name · теги: -tall
- комментарий: огромный станционный комплекс у воды, высоты нет

### Fallout 3 Red Rocket Gas Station

- файл: `transport_fallout-3-red-rocket-gas-station_mc-mod_x.schematic` · категория: **transport** · теги: small|station · 25x25x17 · 937 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_fallout-3-red-rocket-gas-station_mc-mod_x.png`
- флаги: franchise
- комментарий: полуразрушенный бетонный каркас заправки в духе Fallout, читается

### Aircraft Hangar Structure

- файл: `transport_aircraft-hangar-structure_mc-mod_x.schematic` · категория: **transport** · теги: medium · 36x24x40 · 10969 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_aircraft-hangar-structure_mc-mod_x.png`
- флаги: meta-word-in-name
- комментарий: громадный гладкий ангар-коробка без деталей, читается с натяжкой

### Long Cargo Platform

- файл: `transport_long-cargo-platform_mc-mod_x.schematic` · категория: **transport** · теги: tiny · 3x4x7 · 26 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_long-cargo-platform_mc-mod_x.png`
- флаги: non-building-in-name · теги: -car
- комментарий: крошечная плита из 26 блоков; ни длины, ни груза, ни машины

### Minecraft Airport Runway

- файл: `transport_minecraft-airport-runway_buildschematics_x.nbt` · категория: **transport** · теги: huge · 283x2x13 · 7127 блоков · источник: buildschematics
- превью: `schemes/thumbs/transport_minecraft-airport-runway_buildschematics_x.png`
- флаги: franchise · теги: +huge -small
- комментарий: длинная серая полоса взлётки; размер явно не small

### Train station

- файл: `transport_train-station_mcbuild_x-2.schem` · категория: **transport** · теги: large|station · 60x42x151 · 54443 блоков · источник: mcbuild
- превью: `schemes/thumbs/transport_train-station_mcbuild_x-2.png`
- флаги: duplicate-name · теги: -tall
- комментарий: длинный классический вокзал; высотности не видно

### Train Station Like Structure

- файл: `transport_train-station-like-structure_mcbuild_x.schem` · категория: **transport** · теги: medium|station|tall · 17x41x37 · 2754 блоков · источник: mcbuild
- превью: `schemes/thumbs/transport_train-station-like-structure_mcbuild_x.png`
- флаги: meta-word-in-name
- комментарий: зал со стеклянной крышей; оговорка в имени лишняя

### AxiumSA Medium Boat

- файл: `vehicles_axiumsa-medium-boat_buildschematics_x.schem` · категория: **vehicles** · теги: boat|medium|tall · 29x46x65 · 2851 блоков · источник: buildschematics
- превью: `schemes/thumbs/vehicles_axiumsa-medium-boat_buildschematics_x.png`
- флаги: vehicle
- комментарий: Виден лишь каркас деревянного корпуса с веслами, наружная обшивка не закончена.

### Garbage Truck with Front Loader

- файл: `vehicles_garbage-truck-with-front-loader_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 11x4x7 · 41 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_garbage-truck-with-front-loader_mc-mod_x.png`
- флаги: non-building-in-name
- комментарий: разрозненные детали мусоровоза, читается с натяжкой

### Aluminum Van Truck 6×6

- файл: `vehicles_aluminum-van-truck-6x6_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 11x6x5 · 53 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_aluminum-van-truck-6x6_mc-mod_x.png`
- флаги: non-building-in-name
- комментарий: детали фургона-грузовика разрознены, читается с натяжкой

### Fallout 3 Inspired Car Schematic

- файл: `vehicles_fallout-3-inspired-car-schematic_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 5x3x13 · 75 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_fallout-3-inspired-car-schematic_mc-mod_x.png`
- флаги: franchise, meta-word-in-name, non-building-in-name
- комментарий: ржавая легковушка в духе Fallout, читается; франшиза

### Fallout 3 Style Car (No Engine)

- файл: `vehicles_fallout-3-style-car-no-engine_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 12x3x5 · 68 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_fallout-3-style-car-no-engine_mc-mod_x.png`
- флаги: franchise, non-building-in-name
- комментарий: разбитая легковушка без двигателя в духе Fallout; франшиза

### Fallout 3 Car Replica

- файл: `vehicles_fallout-3-car-replica_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 5x3x13 · 64 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_fallout-3-car-replica_mc-mod_x.png`
- флаги: franchise, non-building-in-name
- комментарий: серая легковушка-реплика в духе Fallout; франшиза

### Thomas and Friends Candy Car

- файл: `vehicles_thomas-and-friends-candy-car_mc-mod_x.schematic` · категория: **vehicles** · теги: car|small · 7x14x33 · 815 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_thomas-and-friends-candy-car_mc-mod_x.png`
- флаги: franchise, non-building-in-name
- комментарий: коричневый вагон в стиле Томаса и друзей; франшиза

### Heavy Crane Truck

- файл: `vehicles_heavy-crane-truck_mc-mod_x.schematic` · категория: **vehicles** · теги: car|large · 51x10x9 · 788 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_heavy-crane-truck_mc-mod_x.png`
- флаги: non-building-in-name · теги: +large -small
- комментарий: очень длинный кран на шасси; тег small маловат, нужен large

### Massive Haul Truck

- файл: `vehicles_massive-haul-truck_mc-mod_x.schematic` · категория: **vehicles** · теги: car|large|tall · 25x26x45 · 9197 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_massive-haul-truck_mc-mod_x.png`
- флаги: non-building-in-name · теги: +large +tall -medium
- комментарий: гигантский карьерный самосвал; тег medium маловат

### Yellow and Red Lighthouse Structure

- файл: `waterfront_yellow-and-red-lighthouse-structure_buildschematics_x.schem` · категория: **waterfront** · теги: medium|tall|water · 21x53x21 · 2716 блоков · источник: buildschematics
- превью: `schemes/thumbs/waterfront_yellow-and-red-lighthouse-structure_buildschematics_x.png`
- флаги: meta-word-in-name · теги: -house
- комментарий: высокий цилиндрический маяк с красной вершиной, но жёлтого цвета и дома здесь нет

### Trading Ship – Small Creative Build

- файл: `waterfront_trading-ship-small-creative-build_mc-mod_x.schematic` · категория: **waterfront** · теги: boat|large|tall · 114x83x48 · 76528 блоков · источник: mc-mod
- превью: `schemes/thumbs/waterfront_trading-ship-small-creative-build_mc-mod_x.png`
- флаги: meta-word-in-name · теги: -shop · разошлись правила и картинка (words→commercial, image→ok)
- комментарий: большой парусный галеон; торговли и лавки не видно

### Imposing Flying Ship Design

- файл: `waterfront_imposing-flying-ship-design_mc-mod_x.schematic` · категория: **waterfront** · теги: boat|large|tall · 33x70x89 · 7851 блоков · источник: mc-mod
- превью: `schemes/thumbs/waterfront_imposing-flying-ship-design_mc-mod_x.png`
- флаги: fantasy · разошлись правила и картинка (words→vehicles, image→ok)
- комментарий: летучий парусник с парусами; сказочно, но корабль читается

### Covered Minecraft Bridge

- файл: `bridges_covered-minecraft-bridge_mc-mod_x.schem` · категория: **bridges** · теги: bridge|tiny · 4x5x29 · 290 блоков · источник: mc-mod
- превью: `schemes/thumbs/bridges_covered-minecraft-bridge_mc-mod_x.png`
- флаги: franchise
- комментарий: длинный крытый мост с остеклением, читается

### Integral Bridge Structure

- файл: `bridges_integral-bridge-structure_mc-mod_x.schem` · категория: **bridges** · теги: bridge|small · 49x12x7 · 726 блоков · источник: mc-mod
- превью: `schemes/thumbs/bridges_integral-bridge-structure_mc-mod_x.png`
- флаги: meta-word-in-name
- комментарий: длинный мост на опорах с фонарями, читается

### Massive Minecraft Bridge

- файл: `bridges_massive-minecraft-bridge_mc-mod_x.schem` · категория: **bridges** · теги: bridge|large|tall · 25x75x115 · 43574 блоков · источник: mc-mod
- превью: `schemes/thumbs/bridges_massive-minecraft-bridge_mc-mod_x.png`
- флаги: franchise
- комментарий: каменный мост на массивных опорах с перилами и дорогой сверху, читается

### Suspended Bridge Minecraft Build

- файл: `bridges_suspended-bridge-minecraft-build_mc-mod_x.schem` · категория: **bridges** · теги: bridge|tiny · 10x8x20 · 409 блоков · источник: mc-mod
- превью: `schemes/thumbs/bridges_suspended-bridge-minecraft-build_mc-mod_x.png`
- флаги: franchise, meta-word-in-name
- комментарий: маленький мост через воду с опорами; читается

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

### Rustic Farmhouse & Shop

- файл: `commercial_rustic-farmhouse-shop_mc-mod_x.schematic` · категория: **commercial** · теги: house|shop|small · 33x15x28 · 2766 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_rustic-farmhouse-shop_mc-mod_x.png`
- флаги: non-building-in-name
- комментарий: дом с пирамидальной крышей и каналом, читается

### Modern McDonald’s Restaurant With Exterior

- файл: `commercial_modern-mcdonalds-restaurant-with-exterior_mc-mod_x.schematic` · категория: **commercial** · теги: medium|modern · 35x21x44 · 2854 блоков · источник: mc-mod
- превью: `schemes/thumbs/commercial_modern-mcdonalds-restaurant-with-exterior_mc-mod_x.png`
- флаги: franchise
- комментарий: голубой ресторан с парковкой, читается

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

### Fence Totem Structure

- файл: `decor_fence-totem-structure_mc-mod_x.schematic` · категория: **decor** · теги: small · 17x17x16 · 302 блоков · источник: mc-mod
- превью: `schemes/thumbs/decor_fence-totem-structure_mc-mod_x.png`
- флаги: meta-word-in-name
- комментарий: крестообразный тотем из заборов, читается

### Concrete Factory Structure

- файл: `industrial_concrete-factory-structure_mc-mod_x.schem` · категория: **industrial** · теги: large|tall · 63x47x52 · 31478 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_concrete-factory-structure_mc-mod_x.png`
- флаги: meta-word-in-name
- комментарий: завод с красными трубами и цистернами, читается

### Fallout 3 Style Grain Silo

- файл: `industrial_fallout-3-style-grain-silo_mc-mod_x.schematic` · категория: **industrial** · теги: small · 13x22x13 · 556 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_fallout-3-style-grain-silo_mc-mod_x.png`
- флаги: franchise
- комментарий: высокий деревянный силос с ледяной отделкой, читается

### Village Warehouse Structure

- файл: `industrial_village-warehouse-structure_mc-mod_x.schematic` · категория: **industrial** · теги: house|small · 31x18x18 · 2737 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_village-warehouse-structure_mc-mod_x.png`
- флаги: meta-word-in-name · разошлись правила и картинка (words→residential, image→ok)
- комментарий: деревянный амбар с красной отделкой, читается

### Minecraft Lumber Mill Structure

- файл: `industrial_minecraft-lumber-mill-structure_mc-mod_x.schematic` · категория: **industrial** · теги: tiny · 9x11x19 · 684 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_minecraft-lumber-mill-structure_mc-mod_x.png`
- флаги: franchise, meta-word-in-name
- комментарий: открытая деревянная лесопилка, читается

### Abandoned Textile Mill Structure

- файл: `industrial_abandoned-textile-mill-structure_mc-mod_x.schematic` · категория: **industrial** · теги: medium · 44x24x57 · 41032 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_abandoned-textile-mill-structure_mc-mod_x.png`
- флаги: meta-word-in-name
- комментарий: серый фабричный комплекс на грунте, читается

### Factory Build V3

- файл: `industrial_factory-build-v3_mc-mod_1.20.1.nbt` · категория: **industrial** · теги: large|tall · 84x57x81 · 24644 блоков · источник: mc-mod
- превью: `schemes/thumbs/industrial_factory-build-v3_mc-mod_1.20.1.png`
- флаги: meta-word-in-name
- комментарий: коричневый промкомплекс с трубами, читается

### 128KSU Power Plant Structure

- файл: `industrial_128ksu-power-plant-structure_buildschematics_x.nbt` · категория: **industrial** · теги: small · 17x10x15 · 327 блоков · источник: buildschematics
- превью: `schemes/thumbs/industrial_128ksu-power-plant-structure_buildschematics_x.png`
- флаги: meta-word-in-name
- комментарий: малая серая техно-конструкция электростанции, читается

### 256-Block Power Plant Structure

- файл: `industrial_256-block-power-plant-structure_buildschematics_x.nbt` · категория: **industrial** · теги: small · 17x11x28 · 1202 блоков · источник: buildschematics
- превью: `schemes/thumbs/industrial_256-block-power-plant-structure_buildschematics_x.png`
- флаги: meta-word-in-name
- комментарий: серая техно-конструкция с синими энерголиниями, читается

### Central Fountain Maze Schematic

- файл: `parks_central-fountain-maze-schematic_mc-mod_x.schem` · категория: **parks** · теги: fountain|medium|water · 60x7x55 · 3265 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_central-fountain-maze-schematic_mc-mod_x.png`
- флаги: meta-word-in-name · разошлись правила и картинка (words→decor, image→ok)
- комментарий: зелёный лабиринт из невысоких изгородей с круглым фонтаном в центре

### Dreamy Fountain Build

- файл: `parks_dreamy-fountain-build_mc-mod_x.schem` · категория: **parks** · теги: fountain|small|water · 13x28x15 · 996 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_dreamy-fountain-build_mc-mod_x.png`
- флаги: meta-word-in-name · разошлись правила и картинка (words→decor, image→ok)
- комментарий: компактный фонтан с синей водой, читается

### Garden Fountain Structure

- файл: `parks_garden-fountain-structure_mc-mod_x.schem` · категория: **parks** · теги: fountain|park|small|water · 27x9x19 · 718 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_garden-fountain-structure_mc-mod_x.png`
- флаги: meta-word-in-name
- комментарий: прямоугольный садик с фонтаном по центру, ухоженный

### Majestic Fountain Structure

- файл: `parks_majestic-fountain-structure_mc-mod_x.schem` · категория: **parks** · теги: fountain|medium|water · 31x36x39 · 3692 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_majestic-fountain-structure_mc-mod_x.png`
- флаги: meta-word-in-name · разошлись правила и картинка (words→decor, image→ok)
- комментарий: скальный фонтан со струёй воды, читается

### Park Ball Structure

- файл: `parks_park-ball-structure_mc-mod_x.schematic` · категория: **parks** · теги: medium|park · 41x14x39 · 4096 блоков · источник: mc-mod
- превью: `schemes/thumbs/parks_park-ball-structure_mc-mod_x.png`
- флаги: meta-word-in-name
- комментарий: кольцо зелени с красным центром, мяч читается

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

### Dirt Church Structure

- файл: `public_dirt-church-structure_mc-mod_x.schem` · категория: **public** · теги: church|medium · 33x30x43 · 9934 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_dirt-church-structure_mc-mod_x.png`
- флаги: meta-word-in-name
- комментарий: коричневая церковь со скатными крышами, читается

### Gothic Church Minecraft Structure

- файл: `public_gothic-church-minecraft-structure_mc-mod_x.schem` · категория: **public** · теги: church|huge|tall · 125x113x75 · 62900 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_gothic-church-minecraft-structure_mc-mod_x.png`
- флаги: franchise, meta-word-in-name
- комментарий: огромный готический собор с шпилями и витражами, цельный

### Hamburg Michel Church Structure

- файл: `public_hamburg-michel-church-structure_mc-mod_x.schem` · категория: **public** · теги: church|medium|tall · 27x55x38 · 4396 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_hamburg-michel-church-structure_mc-mod_x.png`
- флаги: meta-word-in-name
- комментарий: красный храм с зелёной башней под снежной крышей, яркий

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

### Mystical Church Structure

- файл: `public_mystical-church-structure_mc-mod_x.schem` · категория: **public** · теги: church|large|tall · 40x115x82 · 32604 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_mystical-church-structure_mc-mod_x.png`
- флаги: meta-word-in-name
- комментарий: белый ажурный храм со шпилем и крестом, читается

### Renaissance Church Structure

- файл: `public_renaissance-church-structure_mc-mod_x.schem` · категория: **public** · теги: church|medium|tall · 61x42x27 · 11064 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_renaissance-church-structure_mc-mod_x.png`
- флаги: meta-word-in-name
- комментарий: бежевая церковь с круглой апсидой, читается

### Rivertown Library Structure

- файл: `public_rivertown-library-structure_mc-mod_x.schem` · категория: **public** · теги: library|medium|tall · 39x41x53 · 12202 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_rivertown-library-structure_mc-mod_x.png`
- флаги: meta-word-in-name
- комментарий: тёмное здание со сложной крышей, похоже на библиотеку

### Simple Minecraft Church Building

- файл: `public_simple-minecraft-church-building_mc-mod_x.schem` · категория: **public** · теги: church|medium · 39x38x59 · 8431 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_simple-minecraft-church-building_mc-mod_x.png`
- флаги: franchise
- комментарий: серая церковь с коричневыми крышами, читается

### World Relics Museum Build

- файл: `public_world-relics-museum-build_mc-mod_x.schem` · категория: **public** · теги: huge|museum|tall · 114x58x77 · 96360 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_world-relics-museum-build_mc-mod_x.png`
- флаги: meta-word-in-name
- комментарий: парадный музейный корпус с внутренним двором, читается

### High Security Jail (default map)

- файл: `high-security-jail.schem` · категория: **public** · теги: huge|tall · 131x54x119 · 88508 блоков · источник: pre-existing
- превью: `schemes/thumbs/high-security-jail.png`
- флаги: meta-word-in-name
- комментарий: огороженный стенами тюремный комплекс, читается

### Automatic Trashcan Build

- файл: `public_automatic-trashcan-build_mc-mod_x.schematic` · категория: **public** · теги: tiny · 8x5x6 · 156 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_automatic-trashcan-build_mc-mod_x.png`
- флаги: meta-word-in-name · разошлись правила и картинка (words→decor, image→ok)
- комментарий: красно-белая урна-мусорка, читается

### Minecraft Vet Clinic Building

- файл: `public_minecraft-vet-clinic-building_mc-mod_x.schematic` · категория: **public** · теги: hospital|medium · 38x25x46 · 5541 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_minecraft-vet-clinic-building_mc-mod_x.png`
- флаги: franchise
- комментарий: современный корпус с красной полосой и голубым бассейном, читается

### Minecraft Theatre Stage Design

- файл: `public_minecraft-theatre-stage-design_mc-mod_x.schematic` · категория: **public** · теги: medium · 41x19x78 · 27769 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_minecraft-theatre-stage-design_mc-mod_x.png`
- флаги: franchise
- комментарий: светлый театральный корпус с красными витражами и крыльцом, читается

### Wooden Amphitheatre Structure

- файл: `public_wooden-amphitheatre-structure_mc-mod_1.16.3.schem` · категория: **public** · теги: medium · 63x25x70 · 8274 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_wooden-amphitheatre-structure_mc-mod_1.16.3.png`
- флаги: meta-word-in-name
- комментарий: деревянная арена с рядами и световыми дорожками, читается

### Ancient Mayan Amphitheater Structure

- файл: `public_ancient-mayan-amphitheater-structure_mc-mod_1.20.1.schem` · категория: **public** · теги: medium · 33x22x25 · 3063 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_ancient-mayan-amphitheater-structure_mc-mod_1.20.1.png`
- флаги: meta-word-in-name, non-real/fantasy
- комментарий: каменное кольцо арены с зелёным полем и факелами, читается

### Hermitcraft Season 7 Town Hall Replica

- файл: `public_hermitcraft-season-7-town-hall-replica_mc-mod_1.16.5.schem` · категория: **public** · теги: medium|tall · 50x45x41 · 13652 блоков · источник: mc-mod
- превью: `schemes/thumbs/public_hermitcraft-season-7-town-hall-replica_mc-mod_1.16.5.png`
- флаги: franchise
- комментарий: кирпичная ратуша с куполом и башней, читается

### Theater

- файл: `public_theater_mcbuild_x-2.schem` · категория: **public** · теги: large · 60x37x96 · 104571 блоков · источник: mcbuild
- превью: `schemes/thumbs/public_theater_mcbuild_x-2.png`
- флаги: duplicate-name
- комментарий: крупный театральный комплекс с внутренним двором, читается

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

### Beach House

- файл: `residential_beach-house_mcbuild_x.schem` · категория: **residential** · теги: house|medium · 35x32x33 · 5323 блоков · источник: mcbuild
- превью: `schemes/thumbs/residential_beach-house_mcbuild_x.png`
- флаги: duplicate-name
- комментарий: дом на сваях у воды, читается

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

### Condensed Townhouse Compound Structure

- файл: `residential_condensed-townhouse-compound-structure_mc-mod_x.schematic` · категория: **residential** · теги: house|huge · 251x20x203 · 208838 блоков · источник: mc-mod
- превью: `schemes/thumbs/residential_condensed-townhouse-compound-structure_mc-mod_x.png`
- флаги: meta-word-in-name
- комментарий: огромный квартал домов с бассейном, читается отлично

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

### Highway Exit Structure

- файл: `roads_highway-exit-structure_mc-mod_x.schem` · категория: **roads** · теги: medium|road · 50x10x33 · 3225 блоков · источник: mc-mod
- превью: `schemes/thumbs/roads_highway-exit-structure_mc-mod_x.png`
- флаги: meta-word-in-name
- комментарий: развязка-съезд с шоссе на несколько полос, читается

### Highway Toll Booth Structure

- файл: `roads_highway-toll-booth-structure_mc-mod_x.schem` · категория: **roads** · теги: medium|road · 48x9x59 · 4076 блоков · источник: mc-mod
- превью: `schemes/thumbs/roads_highway-toll-booth-structure_mc-mod_x.png`
- флаги: meta-word-in-name
- комментарий: пункт оплаты шоссе с навесом и будками, аккуратный

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

### Gray Tower Structure

- файл: `towers_gray-tower-structure_mc-mod_x.schem` · категория: **towers** · теги: small|tower · 9x28x9 · 464 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_gray-tower-structure_mc-mod_x.png`
- флаги: meta-word-in-name
- комментарий: серая ярусная башня с шатровой крышей, аккуратная

### Hotel Weiss V2

- файл: `towers_hotel-weiss-v2_mc-mod_x.schem` · категория: **towers** · теги: hotel|large|tall · 50x52x50 · 30321 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_hotel-weiss-v2_mc-mod_x.png`
- флаги: meta-word-in-name · разошлись правила и картинка (words→commercial, image→ok)
- комментарий: две стеклянные башни отеля, современный корпус читается

### Japanese Tower Style Asian Structure

- файл: `towers_japanese-tower-style-asian-structure_mc-mod_x.schem` · категория: **towers** · теги: small|tower · 13x30x13 · 991 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_japanese-tower-style-asian-structure_mc-mod_x.png`
- флаги: meta-word-in-name
- комментарий: красная пагода с изогнутыми крышами, читается

### Luxury Palace Tower With Elevator

- файл: `towers_luxury-palace-tower-with-elevator_mc-mod_x.schem` · категория: **towers** · теги: large|tall|tower · 40x110x40 · 52275 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_luxury-palace-tower-with-elevator_mc-mod_x.png`
- флаги: non-building-in-name
- комментарий: красно-белая дворцовая башня, читается

### Modern Apartment Tower &#8211; 10 Floors

- файл: `towers_modern-apartment-tower-10-floors_mc-mod_x.schem` · категория: **towers** · теги: apartment|large|modern|tall|tower · 37x168x37 · 40202 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_modern-apartment-tower-10-floors_mc-mod_x.png`
- флаги: duplicate-name
- комментарий: стройная башня примерно на десять этажей с балконами по периметру

### Modern Skyscraper Tower

- файл: `towers_modern-skyscraper-tower_mc-mod_x.schem` · категория: **towers** · теги: large|modern|tall|tower · 62x172x44 · 82874 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_modern-skyscraper-tower_mc-mod_x.png`
- флаги: duplicate-name
- комментарий: ступенчатые стеклянные цилиндры группой, читается

### Modern Style Tower Structure

- файл: `towers_modern-style-tower-structure_mc-mod_x.schem` · категория: **towers** · теги: medium|modern|tall|tower · 38x84x22 · 16924 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_modern-style-tower-structure_mc-mod_x.png`
- флаги: meta-word-in-name
- комментарий: узкая красно-серая башня с сеткой окон, читается

### Mud Tower Build

- файл: `towers_mud-tower-build_mc-mod_x.schem` · категория: **towers** · теги: small|tower · 10x28x10 · 556 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_mud-tower-build_mc-mod_x.png`
- флаги: meta-word-in-name
- комментарий: коричневая башенка с каменным верхом, читается

### Olympus Tower &#8211; Large Build

- файл: `towers_olympus-tower-large-build_mc-mod_x.schem` · категория: **towers** · теги: large|tall|tower · 43x75x45 · 8374 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_olympus-tower-large-build_mc-mod_x.png`
- флаги: meta-word-in-name
- комментарий: дерево-стеклянная башня с парящим навесом, читается

### Rustic Wood Tower Build

- файл: `towers_rustic-wood-tower-build_mc-mod_x.schem` · категория: **towers** · теги: small|tall|tower · 11x50x11 · 1434 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_rustic-wood-tower-build_mc-mod_x.png`
- флаги: meta-word-in-name
- комментарий: высокая деревянная башня, читается

### Shard Tower &#8211; Tall Unfurnished Structure

- файл: `towers_shard-tower-tall-unfurnished-structure_mc-mod_x.schem` · категория: **towers** · теги: large|tall|tower · 44x185x44 · 31644 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_shard-tower-tall-unfurnished-structure_mc-mod_x.png`
- флаги: meta-word-in-name
- комментарий: красная острая башня, читается

### Unfurnished Office Building Structure

- файл: `towers_unfurnished-office-building-structure_mc-mod_x.schem` · категория: **towers** · теги: medium|office|tall · 40x67x43 · 18504 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_unfurnished-office-building-structure_mc-mod_x.png`
- флаги: meta-word-in-name · разошлись правила и картинка (words→commercial, image→ok)
- комментарий: серая ар-деко офисная башня; читается

### Willis Tower Overhaul Schematic

- файл: `towers_willis-tower-overhaul-schematic_mc-mod_x.schem` · категория: **towers** · теги: large|tall|tower · 51x194x50 · 100695 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_willis-tower-overhaul-schematic_mc-mod_x.png`
- флаги: meta-word-in-name
- комментарий: ступенчатая кирпичная башня с антеннами, читается

### Willis Tower Skyscraper Build

- файл: `towers_willis-tower-skyscraper-build_mc-mod_x.schem` · категория: **towers** · теги: huge|tall|tower · 62x254x61 · 23439 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_willis-tower-skyscraper-build_mc-mod_x.png`
- флаги: meta-word-in-name
- комментарий: красная высотка со шпилями, читается

### Youcube Office Structure

- файл: `towers_youcube-office-structure_mc-mod_x.schem` · категория: **towers** · теги: medium|office|tall · 21x41x28 · 5748 блоков · источник: mc-mod
- превью: `schemes/thumbs/towers_youcube-office-structure_mc-mod_x.png`
- флаги: meta-word-in-name · разошлись правила и картинка (words→commercial, image→ok)
- комментарий: серый офисный корпус с красной буквой, читается

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

### Train Station

- файл: `transport_train-station_mcbuild_x.schem` · категория: **transport** · теги: medium|station|tall · 17x41x37 · 2754 блоков · источник: mcbuild
- превью: `schemes/thumbs/transport_train-station_mcbuild_x.png`
- флаги: duplicate-name
- комментарий: длинный вокзал с часовыми башнями, читается

### Western Train Station Structure

- файл: `transport_western-train-station-structure_mc-mod_x.schem` · категория: **transport** · теги: small|station · 26x11x15 · 1086 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_western-train-station-structure_mc-mod_x.png`
- флаги: meta-word-in-name
- комментарий: низкая платформа-навес станции, читается

### Minecraft Airport Terminal Building

- файл: `transport_minecraft-airport-terminal-building_mc-mod_x.schematic` · категория: **transport** · теги: small|station · 30x14x27 · 2904 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_minecraft-airport-terminal-building_mc-mod_x.png`
- флаги: franchise
- комментарий: серый терминал с деревянным навесом и синими акцентами, читается

### Subway Station Build

- файл: `transport_subway-station-build_mc-mod_1.19.schem` · категория: **transport** · теги: small|station · 17x11x17 · 969 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_subway-station-build_mc-mod_1.19.png`
- флаги: meta-word-in-name
- комментарий: компактный серый павильон-вход метро, читается

### Minecraft Airport Terminal Build

- файл: `transport_minecraft-airport-terminal-build_mc-mod_x.schematic` · категория: **transport** · теги: station|tiny · 9x6x22 · 607 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_minecraft-airport-terminal-build_mc-mod_x.png`
- флаги: franchise, meta-word-in-name
- комментарий: стеклянный зал терминала с телетрапами, читается

### Obsidian Runway Build

- файл: `transport_obsidian-runway-build_mc-mod_x.schematic` · категория: **transport** · теги: small · 135x2x13 · 1105 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_obsidian-runway-build_mc-mod_x.png`
- флаги: meta-word-in-name
- комментарий: длинная тёмная полоса с огнями, читается

### Ancient Mayan Depot House

- файл: `transport_ancient-mayan-depot-house_mc-mod_1.20.4.schem` · категория: **transport** · теги: house|small|station · 15x16x16 · 313 блоков · источник: mc-mod
- превью: `schemes/thumbs/transport_ancient-mayan-depot-house_mc-mod_1.20.4.png`
- флаги: non-real/fantasy · разошлись правила и картинка (words→residential, image→ok)
- комментарий: ступенчатое депо в майяском духе, читается

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

### 1994 Nissan Dump Truck Vehicle

- файл: `vehicles_1994-nissan-dump-truck-vehicle_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 9x4x5 · 68 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_1994-nissan-dump-truck-vehicle_mc-mod_x.png`
- флаги: non-building-in-name
- комментарий: бортовой самосвал с кабиной, читается

### Tow Truck Semi-Trailer

- файл: `vehicles_tow-truck-semi-trailer_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 5x4x13 · 88 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_tow-truck-semi-trailer_mc-mod_x.png`
- флаги: non-building-in-name
- комментарий: шасси эвакуатора с кабиной, читается

### Industrial Iron Car Vehicle

- файл: `vehicles_industrial-iron-car-vehicle_mc-mod_1.21.1.nbt` · категория: **vehicles** · теги: car|tiny · 15x7x11 · 190 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_industrial-iron-car-vehicle_mc-mod_1.21.1.png`
- флаги: non-building-in-name
- комментарий: белый угловатый автомобильчик, читается

### 1995 Isuzu Forward Crane Truck

- файл: `vehicles_1995-isuzu-forward-crane-truck_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 11x4x5 · 52 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_1995-isuzu-forward-crane-truck_mc-mod_x.png`
- флаги: non-building-in-name
- комментарий: серое шасси грузовика с краном и жёлтыми колёсами

### Ten-Wheeler Crane Tow Truck

- файл: `vehicles_ten-wheeler-crane-tow-truck_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 10x4x5 · 42 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_ten-wheeler-crane-tow-truck_mc-mod_x.png`
- флаги: non-building-in-name
- комментарий: шасси эвакуатора с краном, кабина и колёса читаются

### Fuso Fighter Wing Van Truck

- файл: `vehicles_fuso-fighter-wing-van-truck_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 5x5x13 · 47 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_fuso-fighter-wing-van-truck_mc-mod_x.png`
- флаги: non-building-in-name
- комментарий: длинное шасси фургона с красной кабиной, читается

### Car Carrier Truck and Trailer

- файл: `vehicles_car-carrier-truck-and-trailer_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 24x8x5 · 218 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_car-carrier-truck-and-trailer_mc-mod_x.png`
- флаги: non-building-in-name
- комментарий: длинный пустой автовоз-прицеп, читается

### 1998 Isuzu Freezer Truck

- файл: `vehicles_1998-isuzu-freezer-truck_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 5x5x13 · 43 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_1998-isuzu-freezer-truck_mc-mod_x.png`
- флаги: non-building-in-name
- комментарий: кабина рефрижератора с длинной рамой, читается

### Fuso Fighter Dump Truck Vehicle

- файл: `vehicles_fuso-fighter-dump-truck-vehicle_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 5x5x8 · 54 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_fuso-fighter-dump-truck-vehicle_mc-mod_x.png`
- флаги: non-building-in-name
- комментарий: серый самосвал с жёлтыми фарами, читается

### Fire Truck with Manlift

- файл: `vehicles_fire-truck-with-manlift_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 5x7x13 · 156 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_fire-truck-with-manlift_mc-mod_x.png`
- флаги: non-building-in-name
- комментарий: пожарная машина с люлькой-подъёмником, читается

### Decorated 10W Truck Van

- файл: `vehicles_decorated-10w-truck-van_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 17x5x5 · 70 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_decorated-10w-truck-van_mc-mod_x.png`
- флаги: non-building-in-name
- комментарий: длинный голубой фургон на шасси, читается

### Crane Truck with Car Carrier

- файл: `vehicles_crane-truck-with-car-carrier_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 5x4x14 · 91 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_crane-truck-with-car-carrier_mc-mod_x.png`
- флаги: non-building-in-name
- комментарий: грузовик с краном и площадкой автовоза, читается

### Fuso FV411J Dump Truck Model

- файл: `vehicles_fuso-fv411j-dump-truck-model_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 9x5x5 · 61 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_fuso-fv411j-dump-truck-model_mc-mod_x.png`
- флаги: non-building-in-name
- комментарий: бело-серый самосвал, кузов и кабина читаются

### Fuso Fighter Cargo Truck Detailed Build

- файл: `vehicles_fuso-fighter-cargo-truck-detailed-build_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 11x5x5 · 57 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_fuso-fighter-cargo-truck-detailed-build_mc-mod_x.png`
- флаги: meta-word-in-name, non-building-in-name
- комментарий: грузовой фургон с кабиной, читается

### Aluminum Wing Van Truck with Solar Radiator

- файл: `vehicles_aluminum-wing-van-truck-with-solar-radiator_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 14x6x5 · 94 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_aluminum-wing-van-truck-with-solar-radiator_mc-mod_x.png`
- флаги: non-building-in-name
- комментарий: белый фургон с красной полосой, читается

### Heavy Duty 14-Wheeler Dump Truck

- файл: `vehicles_heavy-duty-14-wheeler-dump-truck_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 13x5x5 · 103 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_heavy-duty-14-wheeler-dump-truck_mc-mod_x.png`
- флаги: non-building-in-name
- комментарий: голубой самосвал, кузов и кабина читаются

### Concrete Pump Truck with Derricks

- файл: `vehicles_concrete-pump-truck-with-derricks_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 18x6x5 · 185 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_concrete-pump-truck-with-derricks_mc-mod_x.png`
- флаги: non-building-in-name
- комментарий: тёмный бетононасос на шасси, читается

### 10-Wheeler Wing Van Truck and Trailer

- файл: `vehicles_10-wheeler-wing-van-truck-and-trailer_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 24x5x5 · 224 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_10-wheeler-wing-van-truck-and-trailer_mc-mod_x.png`
- флаги: non-building-in-name
- комментарий: голубые фургон и прицеп парой, читаются

### Sdkfz 222 Armored Car

- файл: `vehicles_sdkfz-222-armored-car_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 8x8x16 · 226 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_sdkfz-222-armored-car_mc-mod_x.png`
- флаги: non-building-in-name
- комментарий: коричневый броневик на серой плите, читается

### Armored Snow Patrol Truck

- файл: `vehicles_armored-snow-patrol-truck_mc-mod_x.schematic` · категория: **vehicles** · теги: car|huge|tall · 162x63x89 · 65318 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_armored-snow-patrol-truck_mc-mod_x.png`
- флаги: non-building-in-name
- комментарий: детальный камуфляжный броневик, читается

### 9 Block Long Van Box Truck Compartment

- файл: `vehicles_9-block-long-van-box-truck-compartment_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 5x5x10 · 39 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_9-block-long-van-box-truck-compartment_mc-mod_x.png`
- флаги: non-building-in-name
- комментарий: голубой грузовой отсек без кабины, как заявлено

### Double Cab Pickup Truck

- файл: `vehicles_double-cab-pickup-truck_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 9x4x5 · 50 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_double-cab-pickup-truck_mc-mod_x.png`
- флаги: non-building-in-name
- комментарий: маленький голубой пикап с кузовом, читается

### Prison Transport Bus For Police

- файл: `vehicles_prison-transport-bus-for-police_mc-mod_x.schematic` · категория: **vehicles** · теги: tiny · 13x6x5 · 123 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_prison-transport-bus-for-police_mc-mod_x.png`
- флаги: non-building-in-name · разошлись правила и картинка (words→public, image→ok)
- комментарий: серый тюремный автобус с тёмными окнами и жёлтой дверью, читается

### Prisoner Transport Truck Vehicle

- файл: `vehicles_prisoner-transport-truck-vehicle_mc-mod_x.schematic` · категория: **vehicles** · теги: car|tiny · 5x4x9 · 74 блоков · источник: mc-mod
- превью: `schemes/thumbs/vehicles_prisoner-transport-truck-vehicle_mc-mod_x.png`
- флаги: non-building-in-name
- комментарий: крошечный красно-серый автозак с жёлтыми фарами, читается

### Diagonal Port Structure

- файл: `waterfront_diagonal-port-structure_mc-mod_x.schematic` · категория: **waterfront** · теги: medium|tall · 43x45x48 · 9309 блоков · источник: mc-mod
- превью: `schemes/thumbs/waterfront_diagonal-port-structure_mc-mod_x.png`
- флаги: meta-word-in-name · разошлись правила и картинка (words→transport, image→ok)
- комментарий: портовое здание на скалах у воды, читается

### Gretjoy Boat Build

- файл: `waterfront_gretjoy-boat-build_mc-mod_x.schematic` · категория: **waterfront** · теги: boat|large|tall · 75x52x51 · 4633 блоков · источник: mc-mod
- превью: `schemes/thumbs/waterfront_gretjoy-boat-build_mc-mod_x.png`
- флаги: meta-word-in-name · разошлись правила и картинка (words→vehicles, image→ok)
- комментарий: парусник с серыми парусами, читается

## Полный список по постройкам

| # | постройка | категория | название↔картинка | категория↔картинка | теги↔картинка | вердикт | комментарий |
|---|---|---|---|---|---|---|---|
| 1 | Apartment Building 06 | residential | совпадает | подходит | подходят | OK | Высотный жилой дом со стеклянным фасадом, балконами и машинными этажами сверху. |
| 2 | Automated Andesite Alloy Factory | industrial | совпадает | подходит | подходят | OK | Серый промышленный узел с трубами, резервуарами и двумя подъёмными башенками. |
| 3 | Automatic Wooden Streetlight | decor | совпадает | подходит | лишние (-tree) | мелочь | Деревянный столб с фонарём сверху, деревьев рядом нет — тег tree лишний. |
| 4 | AxiumSA Medium Boat | vehicles | частично | подходит | подходят | мелочь | Виден лишь каркас деревянного корпуса с веслами, наружная обшивка не закончена. |
| 5 | Blacksmith Shop House | commercial | частично | подходит | подходят | мелочь | Открытая деревянная постройка с тяжёлой двускатной крышей, кузницы или наковальни не видно. |
| 6 | Blue House Minecraft Build | residential | частично | подходит | подходят | мелочь | Маленький дом с серой черепичной крышей; синего цвета на превью не различить. |
| 7 | Brick Factory Building - 5037 Blocks | industrial | совпадает | подходит | подходят | OK | Кирпичное здание фабрики, обвитое лианами, со шатровой крышей и входом сбоку. |
| 8 | Cardiff Townhouse - Multi-Story Shop and Residence | residential | совпадает | подходит | подходят | OK | Многоэтажный таунхаус с витриной и навесом на первом этаже, выше жилые ярусы. |
| 9 | Catering Truck for Airports | vehicles | совпадает | подходит | подходят | OK | Белый грузовик с высоким изотермическим кузовом и кабиной, размер компактный. |
| 10 | Champion Race Car | vehicles | совпадает | подходит | подходят | OK | Низкий гоночный автомобиль красно-белого цвета с широким обвесом. |
| 11 | City Gas Station | commercial | совпадает | **не подходит**→commercial | подходят | РАСХОЖДЕНИЕ | Заправка с навесом и колонками на площадке — это коммерция, а не общественное здание. |
| 12 | City Hospital with Elevator - 10890 Blocks | public | частично | подходит | подходят | мелочь | Просторный серый корпус с рядами окон, медицинской символики и признаков больницы нет. |
| 13 | Cobbled Deepslate 4-Way Train Intersection | intersections | совпадает | подходит | подходят | OK | Рельсовый перекрёсток в форме X с сигналами и площадками во все четыре направления. |
| 14 | Contemporary Residence with Two Unfurnished Floors | residential | частично | подходит | подходят | мелочь | Длинное светлое здание с колоннадой и красными стойками скорее похоже на зал, чем на дом. |
| 15 | Cozy Duplex House for Two Families | residential | совпадает | подходит | подходят | OK | Компактный дом с террасной деревянной крышей и небольшим садиком сбоку. |
| 16 | Cozy Wooden House for Roleplay Servers | residential | совпадает | подходит | подходят | OK | Небольшой деревянный дом с панорамной стеклянной крышей и выходом на террасу. |
| 17 | Deepslate Dual Train Station | public | совпадает | подходит | подходят | OK | Две параллельные платформы с навесами, фонарями и переходом между ними. |
| 18 | Desert Home With Extra Rooms | residential | совпадает | подходит | подходят | OK | Пустынный дом из песчаных блоков с плоскими крышами и пристроенными дополнительными объёмами. |
| 19 | Desert Oasis Treehouse Village | decor | частично | подходит | не хватает (+water) | мелочь | Пустынный оазис с большим водоёмом и высокой башней; домов на деревьях и деревьев не видно. |
| 20 | Detailed Wood Villa with Pool | residential | совпадает | подходит | подходят | OK | Деревянная вилла из брёвен с террасами и небольшим бассейном у подножия. |
| 21 | Double Cab Crane Truck | vehicles | совпадает | подходит | подходят | OK | Грузовик с двухрядной кабиной и выдвижной стрелой крана на шасси. |
| 22 | Electric Passenger Train Coach - First Class | transport | совпадает | подходит | подходят | OK | Светлый пассажирский вагон с жёлтой полосой, рядами окон и крышей. |
| 23 | Elegant Mansion With Garden | residential | частично | подходит | подходят | мелочь | Участок с белыми стенами и кольцевыми дорожками читается скорее как сад-лабиринт, чем особняк. |
| 24 | Elegant Quartz Bridge | bridges | совпадает | подходит | подходят | OK | Белая кварцевая арка моста с перилами и массивными опорами по краям. |
| 25 | Factory and Train Station Structure | transport | частично | подходит | подходят | мелочь | Дугообразный навес с рядами деревьев вокруг: и завод, и станция читаются с натяжкой. |
| 26 | Fallout 3 Broadcast Tower Structure | industrial | совпадает | подходит | подходят | мелочь | Тёмная решётчатая вышка с красными маяками на основании; отсылки к игре на картинке не видно. |
| 27 | First Class Passenger Train Car | transport | совпадает | подходит | подходят | OK | Длинный вагон с красным блоком на торце и рядом круглых элементов вдоль борта. |
| 28 | Four Tier Garden Structure | parks | частично | подходит | подходят | мелочь | Четыре круглых яруса, сложенные башней-тортом; зелени и клумб на них не видно. |
| 29 | Futuristic Arcology Garden | parks | частично | подходит | подходят | мелочь | Большой светло-синий купол на цилиндрическом основании с подсветкой, сада не видно. |
| 30 | Futuristic Industrial Complex | industrial | совпадает | подходит | подходят | OK | Комплекс из стеклянных и белых корпусов с решётчатой башней и транспортными площадками. |
| 31 | Futuristic Stadium Entrance Gate | public | частично | подходит | подходят | мелочь | Массивные пилоны с красными навершиями и пологими рампами; самого стадиона за кадром нет. |
| 32 | Gothic Cathedral Structure | public | совпадает | подходит | подходят | OK | Большой готический собор с аркадами, контрфорсами и башней над алтарной частью. |
| 33 | Gothic Church Structure | public | совпадает | подходит | подходят | OK | Готическая церковь с острым шпилем, контрфорсами и круглым окном на фасаде. |
| 34 | Gravel Crossroads with Lighting | intersections | частично | подходит | подходят | мелочь | Многогранный земляный участок с фонарями по краям; дорожное полотно и перекрёсток не читаются. |
| 35 | Hawkseye Pavilion Event Stage | parks | совпадает | подходит | подходят | OK | Крупный павильон с плоской крышей, колоннами и широким входом на газоне. |
| 36 | Heavy Duty Off-Road Dump Truck | vehicles | совпадает | подходит | подходят | OK | Короткий самосвал с крупным кузовом, кабиной и толстыми внедорожными колёсами. |
| 37 | Heavy-Duty Tractor-Trailer with Self-Loader Truck | vehicles | совпадает | подходит | подходят | OK | Длинный грузовик с красной кабиной, серым прицепом и несколькими осями колёс. |
| 38 | Hollywood Style Mansion | residential | совпадает | подходит | не хватает (+pool) | мелочь | Просторный особняк с бассейном и ландшафтным парком; тег pool в списке отсутствует. |
| 39 | Industrial Factory Building | industrial | совпадает | подходит | подходят | OK | длинный промышленный корпус с серой крышей и кирпичными вставками, ряды окон по фасаду читаются |
| 40 | Industrial Iron Factory Structure | industrial | частично | подходит | подходят | мелочь | оборудование цеха с трубами и подсветкой на висящем острове, цельного здания фабрики нет |
| 41 | Iron Stone Arch Bridge | bridges | совпадает | подходит | подходят | OK | белая арка из железа и камня с башенками на обоих берегах, мост читается однозначно |
| 42 | Ironworks Industrial Smelter | industrial | совпадает | подходит | подходят | OK | промышленный блок с пятью трубами и вентиляцией на крыше, стоит на травяном плинте |
| 43 | Island Bridge | bridges | совпадает | подходит | подходят | OK | очень длинный мост из повторяющихся секций, протяжённость и высота соответствуют названию |
| 44 | Island Lighthouse Structure | waterfront | совпадает | **не подходит**→waterfront | лишние (-house) | РАСХОЖДЕНИЕ | светлая башня маяка на кубе воды, к жилым зданиям не относится, нужна набережная |
| 45 | Italian Gelato Shop Small Build | commercial | совпадает | подходит | подходят | OK | небольшой кремовый магазинчик с навесом, витринами и наружной лестницей, размер сходится |
| 46 | Japanese Electric Train Coach Schematic | transport | совпадает | подходит | подходят | OK | серый вагон электрички с оконной полосой и буферами, компактный и читаемый |
| 47 | Jungle Wood House with Furniture | residential | совпадает | подходит | подходят | OK | круглый деревянный дом с покатой крышей на площадке с дорожками и купальнями |
| 48 | Kami House Minecraft Build | residential | частично | подходит | подходят | мелочь | ледяный остров с несколькими постройками, стиль «ками» и японский мотив не читаются |
| 49 | Large Modern House | residential | совпадает | подходит | подходят | OK | современный серый дом с плоской крышей и каменным основанием на газоне, всё сходится |
| 50 | Large Woodland Manor House | residential | совпадает | подходит | подходят | OK | большой деревянный особняк с бассейном и колоннадой, деревянная фактура читается |
| 51 | Luxury Yacht - Small Boat Design | vehicles | совпадает | **не подходит**→vehicles | лишние (-shop) | РАСХОЖДЕНИЕ | белая яхта с красной окантовкой палубы; судно должно быть в vehicles, магазина нет |
| 52 | Luxury Yacht | vehicles | совпадает | подходит | подходят | OK | белая яхта с надстройкой и синим пятном на палубе, категория vehicles верна |
| 53 | Magical Tree Structure | decor | совпадает | подходит | подходят | OK | крошечное деревце с бледной кроной на зелёном плинте, теги tiny и tree сходятся |
| 54 | Medium Apartment Building | residential | совпадает | подходит | подходят | OK | типовой серый жилой дом с регулярной сеткой окон, высота и этажность читаются |
| 55 | Medium Lighthouse Tower | waterfront | совпадает | подходит | лишние (-house -water) | мелочь | высокий полосатый маяк на постаменте, воды вокруг не видно, домом он не является |
| 56 | Medium Townhouse Structure | residential | совпадает | подходит | подходят | OK | коричневый таунхаус с окнами и балконами, пропорции и размер названию соответствуют |
| 57 | Medium Yacht Boat | vehicles | совпадает | **не подходит**→vehicles | подходят | РАСХОЖДЕНИЕ | бледная яхта с надстройкой; судно попало не в ту категорию, нужен vehicles |
| 58 | Mega Tower With Working Elevators | towers | совпадает | **не подходит**→towers | подходят | РАСХОЖДЕНИЕ | тонкая высокая башня с лифтовой шахтой и окнами, к промышленным постройкам не относится |
| 59 | Modern Apartment Building 03 | residential | совпадает | подходит | подходят | OK | многоэтажный жилой блок с балконной сеткой и гладким фасадом, всё сходится |
| 60 | Modern Apartment Shops and Housing | residential | частично | подходит | лишние (-shop) | мелочь | серый жилой комплекс с колоннами балконов, боковая стена глухая, магазины не видны |
| 61 | Modern Apartment Tower &#8211; 10 Floors | towers | совпадает | подходит | подходят | OK | бледно-голубая башня с балконами и чёткими этажами, около десяти этажей правдоподобно |
| 62 | Modern Burger Cafe With Elevator | commercial | совпадает | подходит | подходят | OK | компактное здание с витринами, навесами и входной группой, коммерческий характер виден |
| 63 | Modern City Apartment Tower | residential | совпадает | подходит | подходят | OK | современная городская башня с гладкими фасадами и колоннами, высота читается |
| 64 | Modern Dark Oak Residence | residential | совпадает | подходит | лишние (-apartment) | мелочь | дом с двускатной крышей, светлые стены и деревья вокруг; это дом, а не апартаменты |
| 65 | Modern Duplex House | residential | совпадает | подходит | подходят | OK | белый дуплекс из двух объёмов с красными вставками, форма названию соответствует |
| 66 | Modern Home Exterior | residential | совпадает | подходит | не хватает (+pool) | мелочь | современный белый дом с плоскими крышами и бассейном у террасы, бассейн не отмечен в тегах |
| 67 | Modern Hotel Building With Fountain | commercial | совпадает | **не подходит**→commercial | лишние (-fountain -water) | РАСХОЖДЕНИЕ | низкий серо-коричневый корпус на площадке, ни фонтана, ни воды не видно, башня это не |
| 68 | Modern Office Tower Design | towers | совпадает | подходит | подходят | OK | высокая башня с вертикальными оконными лентами и шапкой, офисная башня читается |
| 69 | Modern Retail Store | commercial | совпадает | подходит | подходят | OK | небольшой серо-белый магазин с витринами вдоль фасада, размер и категория сходятся |
| 70 | Modern Server Shop | commercial | совпадает | подходит | подходят | OK | здание с остеклённым фасадом в белой раме, торговый характер и средний размер видны |
| 71 | Modern Shop House | commercial | совпадает | подходит | подходят | OK | двухэтажный магазин-дом с широкой витриной первого этажа, силуэт читается |
| 72 | Modern Sphere House Design | residential | частично | подходит | подходят | мелочь | дом с террасами и синими площадками, сферическая форма из названия не подтверждается |
| 73 | Modern Street With Five Houses | roads | совпадает | **не подходит**→roads | подходят | РАСХОЖДЕНИЕ | сверху видна улица с дорогой, газонами и несколькими домами, к декору это не относится |
| 74 | Modern Three-Story House | residential | совпадает | подходит | подходят | OK | трёхэтажный деревянный дом с тёмной крышей, аккуратный и хорошо читаемый |
| 75 | Modern Townhouse with Furniture | residential | совпадает | подходит | подходят | OK | дом в разрезе с видимой мебелью, перегородками и лестницами, интерьер читается |
| 76 | Modern Two-Story House With Garage | residential | частично | подходит | лишние (-parking) | мелочь | светлый двухэтажный дом на большом газоне, ворота гаража и парковка в кадре не читаются |
| 77 | Modern Two-Story House With Pond | residential | частично | подходит | лишние (-pool -water) | мелочь | белый дом с тёмно-красными полосами по этажам на участке, пруда в кадре не видно |
| 78 | Modern Urban Apartment House | residential | совпадает | подходит | подходят | OK | комплекс из нескольких высотных серых башен на общей плите, городской характер читается |
| 79 | Monorail Maglev Transportation System | transport | совпадает | подходит | подходят | OK | длинный тонкий состав монорайли с голубыми окнами, читается |
| 80 | Narrow Gauge Train With Caboose | transport | совпадает | подходит | подходят | OK | узкоколожный локомотив с вагончиком, красно-жёлтые акценты видны |
| 81 | Passenger Train Carriage | transport | совпадает | подходит | подходят | OK | вытянутый пассажирский вагон с тёмными окнами, силуэт читается |
| 82 | Pennsylvania Railroad Coaling Tower | industrial | совпадает | подходит | лишние (-road) | мелочь | коричневая угольная башня над ж/д площадкой; тег road картинкой не подтверждается |
| 83 | PokeMart Shop | commercial | совпадает | подходит | подходят | OK | голубой кубический магазин на газоне, но название связано с франшизой Pokémon |
| 84 | Portland-Style Townhouse - Two Story Design | residential | частично | подходит | подходят | мелочь | узкий городской дом с колоннами окон, стиль и число этажей не читаются |
| 85 | Quartz Home | residential | совпадает | подходит | подходят | OK | большой белый дом из кварца с тёмной кровлей и зелёным участком |
| 86 | Realistic Highway Tunnel For Minecraft | roads | совпадает | подходит | подходят | OK | длинный бетонный тоннель с порталом и подъездами, читается |
| 87 | Red Japanese House 2 Minecraft Build | residential | частично | подходит | подходят | мелочь | тёмно-коричневое основание со светлой надстройкой, красного японского дома не видно |
| 88 | Ridable German ICE Train | transport | совпадает | подходит | подходят | OK | белый скоростной поезд со светло-голубыми окнами и локомотивом |
| 89 | Ridge Mansion With Pool And Tower | residential | совпадает | подходит | подходят | OK | огромный особняк с башней, газоном и водным участком у террасы |
| 90 | Riverside Log Cabin with Dock | waterfront | совпадает | подходит | подходят | OK | бревенчатая хижина у воды с настилом-доком, всё на месте |
| 91 | Row House Facade Design | residential | совпадает | подходит | подходят | OK | фасад ряда домов с рядами красных окон на зелёном основании |
| 92 | Rustic Log Cabin Shop | commercial | совпадает | подходит | подходят | OK | сруб с треугольным фасадом из брёвен и витриной, читается как магазин |
| 93 | Rustic Overgrown Church | public | совпадает | подходит | подходят | OK | небольшая деревянная церковь, стены и крыша заросшие зеленью |
| 94 | Rustic Wooden Train Station | public | совпадает | подходит | подходят | OK | крупная деревянная постройка с высокой двускатной крышей, вокзал читается |
| 95 | Sakura Tree Decoration | decor | совпадает | подходит | подходят | OK | дерево с ярко-розовой кроной на зелёном основании, сакура читается |
| 96 | Sandstone Cliffside Mansion with Boat Dock | waterfront | совпадает | **не подходит**→waterfront | подходят | РАСХОЖДЕНИЕ | песчаниковый особняк на склоне у воды с доком; категория transport не соответствует |
| 97 | Sandstone Library Building | public | совпадает | подходит | подходят | OK | песчаниковое здание с вертикальными лопатками и синими окнами |
| 98 | Sao Paulo Central Train Station Structure | public | совпадает | подходит | подходят | OK | крупный вокзал со светло-голубым остеклением и высоким объёмом |
| 99 | Sazayama Prefecture Decoration Tree Big 9 | decor | частично | подходит | подходят | мелочь | ветвящиеся голые стволы без листвы, дерево читается не целиком |
| 100 | Sazayama Prefecture Decoration Tree Cherry 1 | decor | совпадает | подходит | подходят | OK | дерево с плотной серо-зелёной кроной и стволом, форма читается |
| 101 | Sazayama Prefecture Decoration Tree Palm 2 | decor | совпадает | подходит | подходят | OK | пальма с широкой кроной голубоватого оттенка на прямом стволе |
| 102 | Shakespearean Theater Structure | public | частично | подходит | подходят | мелочь | крупное коричневое здание с подсвеченным входом, театральных признаков не видно |
| 103 | Shopping Mall Elevator with Floor Selection | commercial | частично | подходит | лишние (-shop) | мелочь | глухая серо-бежевая коробка, лифт и панель выбора этажей не различимы |
| 104 | Simple Beginner Treehouse | decor | совпадает | подходит | лишние (-hotel) | мелочь | домик в кроне дерева на зелёном участке; тег hotel картинка не подтверждает |
| 105 | Single Cart Metro Train | transport | частично | подходит | подходят | мелочь | удлинённый вагончик коричнево-жёлтых тонов, метро читается с натяжкой |
| 106 | Small Apartment Building Exterior | residential | совпадает | подходит | лишние (-shop) | мелочь | серо-белый дом с блоками голубых окон на газоне; тег shop лишний |
| 107 | Small Arabian House | residential | совпадает | подходит | лишние (-shop) | мелочь | песочный дом с плоской кровлей и тёплыми тонами, магазина не видно |
| 108 | Small Furnished Apartment Building | residential | совпадает | подходит | лишние (-shop) | мелочь | светло-серый дом с окнами и бежевой боковой стеной; тег shop лишний |
| 109 | Small Grain Elevator Structure | industrial | совпадает | подходит | лишние (-shop) | мелочь | ряд высоких вертикальных силосов, элеватор читается; тег shop лишний |
| 110 | Small Hotel With Garden | commercial | совпадает | подходит | лишние (-shop) | мелочь | здание с зелёным садом и цветными акцентами у входа; тег shop не виден |
| 111 | Small Lighthouse Tower | waterfront | совпадает | подходит | лишние (-shop) | мелочь | серый маяк на синей воде с жёлтыми огнями; тег shop лишний |
| 112 | Small Modern House | residential | совпадает | подходит | лишние (-shop) | мелочь | коричневый дом с голубыми окнами и светлой террасой; тег shop лишний |
| 113 | Small Modern Train Station | public | совпадает | подходит | лишние (-shop) | мелочь | здание с красной кровлёй и голубым остеклением — вокзал; тег shop лишний |
| 114 | Small Motorboat Vehicle | vehicles | совпадает | **не подходит**→vehicles | лишние (-shop) | РАСХОЖДЕНИЕ | коричневый катер с бледной палубой — судно, waterfront ему не подходит |
| 115 | Small Rustic Log Cabin House | residential | совпадает | подходит | лишние (-shop) | мелочь | бревенчатый дом с высокой кровлёй и зелёным участком; тег shop лишний |
| 116 | Small Single-Track Railway Bridge | bridges | совпадает | подходит | лишние (-shop) | мелочь | однопутный мост на опорах из серого камня; тег shop не подтверждается |
| 117 | Small Terraced Houses with Garage | residential | совпадает | подходит | лишние (-car -shop) | мелочь | длинный ряд красных террасных домов с гаражом на торце, ни машин, ни магазина не видно |
| 118 | Small Town Cafe Building | commercial | частично | подходит | подходят | мелочь | маленькое кубическое здание с плоской крышей и фонарём, признаков кафе нет |
| 119 | Small Wooden Boat Dock | transport | совпадает | подходит | лишние (-shop) | мелочь | деревянный причал с постройкой на синей воде, лавки в кадре нет |
| 120 | Small Yacht for One or Two | vehicles | совпадает | **не подходит**→vehicles | лишние (-shop) | РАСХОЖДЕНИЕ | судно-яхта на воде: это техника, а не набережная, и торговой палубы не видно |
| 121 | Spacious Modern Mansion | residential | частично | подходит | подходят | мелочь | крупный дом со ступенчатой серой крышей и большими окнами, стиль модерн читается неясно |
| 122 | Speedboat Vehicle | vehicles | совпадает | подходит | подходят | OK | маленький белый катер на воде, категория и теги совпадают |
| 123 | Square Earth Build | decor | совпадает | **не подходит**→decor | лишние (-park) | РАСХОЖДЕНИЕ | серый куб с рельефом поверхности: парка и зелени здесь нет, это декоративный объект |
| 124 | Starter House and Workshop | residential | совпадает | подходит | подходят | OK | деревянный дом с открытой стропильной рамой и двориком с прудом, читается |
| 125 | Stone Factory Building - 20315 Blocks | industrial | совпадает | подходит | подходят | OK | крупное серое промышленное здание-коробка с плоской крышей и входным навесом |
| 126 | Teenager Club House Design | residential | частично | подходит | подходят | мелочь | большое красное здание с широкой двускатной крышей, признаков клуба не видно |
| 127 | Terraced Wooden House | residential | частично | подходит | лишние (-car) | мелочь | деревянный комплекс с террасной застройкой и фонарями, машины во дворе нет |
| 128 | To The Moon Lighthouse House | waterfront | совпадает | подходит | подходят | OK | остров с домом, круглой башней-маяком и участком воды, всё видно |
| 129 | Town Hall Building With Road | roads | совпадает | подходит | подходят | OK | кирпичное здание ратуши, обнесённое асфальтовой дорогой-кольцом на газоне |
| 130 | Transport Van with Barrel Storage | vehicles | совпадает | подходит | подходят | OK | маленький белый фургон с бочками на кузове, размеры и категория верны |
| 131 | Tudor Blacksmith Shop | commercial | частично | подходит | подходят | мелочь | каменное строение со ступенчатой крышей и столбами, тюдоровский облик не читается |
| 132 | Tudor House with Hayloft and Stables | residential | частично | подходит | подходят | мелочь | два отдельных дома с двускатными крышами, конюшню и сенник отличить невозможно |
| 133 | Twin Towers Gate with Auto Night Protection | towers | совпадает | подходит | подходят | OK | каменные ворота с двумя зубчатыми башнями и факелами: средневековье, не реальная архитектура |
| 134 | United We Craft Server Tower | towers | совпадает | подходит | подходят | OK | высокая башня со стеклянным фасадом на подиуме, всё сходится |
| 135 | Vertical Modular Garage System | transport | частично | подходит | подходят | мелочь | чёрные перекрытия парковки и трубы, но узлы конструкции выглядят разрозненно |
| 136 | Vienna Street House 67 | residential | совпадает | **не подходит**→residential | лишние (-road -tree) | РАСХОЖДЕНИЕ | узкий многоэтажный дом с декоративным фасадом стоит на газоне: ни дороги, ни дерева нет |
| 137 | William Andrews Apartment Building | residential | совпадает | подходит | подходят | OK | светлый жилой блок с плоской крышей, остеклённой секцией и газоном |
| 138 | Wishing Well - Village Centerpiece | decor | частично | подходит | лишние (-house) | мелочь | круглая многоярусная постройка с зелёным верхом и скамьями, колодец не читается |
| 139 | Yellow and Red Lighthouse Structure | waterfront | частично | подходит | лишние (-house) | мелочь | высокий цилиндрический маяк с красной вершиной, но жёлтого цвета и дома здесь нет |
| 140 | Wooden house | residential | совпадает | подходит | подходят | OK | деревянный дом с двускатной крышей и трубой на земельном участке |
| 141 | diagonal shore port | waterfront | совпадает | подходит | подходят | OK | порт на диагональном берегу: синяя вода, деревянные причалы, краны и суда |
| 142 | Small fountain | decor | совпадает | **не подходит**→decor | лишние (-shop) | РАСХОЖДЕНИЕ | ярусный фонтан с водой — это малая декоративная форма, а не коммерческое здание |
| 143 | Old Wooden House | residential | совпадает | подходит | подходят | OK | старый деревянный дом с каменной дорожкой и прудом на участке |
| 144 | Stonewood Bridge | bridges | совпадает | подходит | подходят | OK | каменно-деревянный мостик с перилами и опорами, всё читается |
| 145 | Cave House | residential | частично | подходит | лишние (-house) | мелочь | зелёный холм с каменным обрывом и большим деревом, жилой части снаружи не видно |
| 146 | Modern House 10 | residential | совпадает | подходит | подходят | OK | современный дом с плоской крышей и террасой на огороженном участке |
| 147 | Modern House #11 | residential | совпадает | подходит | подходят | OK | крупный бело-красный дом в стиле модерн с бассейном и изгородями |
| 148 | Stone Bridge | bridges | совпадает | подходит | подходят | OK | каменный мост с арочными опорами, название и категория верны |
| 149 | Treehouse | residential | совпадает | подходит | подходят | OK | домики с настилами на мощном дереве, всё видно |
| 150 | Teahouse | residential | частично | подходит | подходят | мелочь | длинная постройка с несколькими двускатными крышами и фонарями, чайный дом неочевиден |
| 151 | Lakehouse | residential | совпадает | подходит | не хватает (+water) | мелочь | деревянный дом стоит прямо у синего водоёма, но тега воды в списке нет |
| 152 | Tree (Lanterns) | decor | частично | подходит | подходят | мелочь | голое дерево с парой коричневых блоков вместо кроны, фонари не разобрать |
| 153 | Traditional Spruce House | residential | совпадает | подходит | лишние (-tree) | мелочь | деревянный дом с двускатной крышей на газоне, деревьев рядом нет |
| 154 | Asian 4 Storey Pagoda Nr3 | towers | совпадает | **не подходит**→towers | лишние (-shop) | РАСХОЖДЕНИЕ | четырёхъярусная пагода с подвесными фонарями: это башня-сооружение, а не магазин |
| 155 | Rustic-Modern Home | residential | совпадает | подходит | подходят | OK | деревянный дом с патио, мебелью и ограждённым двором, стиль совпадает |
| 156 | Asian Hotel | commercial | совпадает | подходит | подходят | OK | низкий деревянный комплекс с внутренним двором, двускатными крышами и фонарями |
| 157 | Dark Oak House | residential | совпадает | подходит | подходят | OK | тёмный деревянный дом с высокой крышей и белой трубой на зелёном участке |
| 158 | Contemporary Home | residential | совпадает | подходит | подходят | OK | широкий серо-бетонный дом с большими вставками из голубого стекла, низкий |
| 159 | Modern House(Green) [Update from 2016] | residential | совпадает | подходит | подходят | OK | серый современный дом с зелёными акцентами на фасаде и высоким объёмом |
| 160 | Big spruce house | residential | совпадает | подходит | подходят | OK | деревянный дом с высокой двускатной крышей, фонарями и зелёным двором |
| 161 | Tower Gate (ZeroHero1458) | towers | частично | подходит | подходят | мелочь | узкая каменно-деревянная башня на траве, проём ворот внизу не читается |
| 162 | Spruce Village Pack - Church | public | совпадает | **не подходит**→public | подходят | РАСХОЖДЕНИЕ | маленькая деревянная часовня с высоким шпилем; к жилым зданиям не относится |
| 163 | Big Tree [v.1.0] | decor | совпадает | подходит | подходят | OK | дерево с густой коричневой кроной на толстом стволе, листва сухая |
| 164 | Nice looking House | residential | совпадает | подходит | подходят | OK | небольшой каменный дом с деревянными деталями и окнами, аккуратный |
| 165 | Minecraft - Vet Clinic | public | совпадает | подходит | подходят | OK | серо-белое здание с витринами и синими акцентами вдоль фасада, читается |
| 166 | Big Tree | decor | совпадает | подходит | подходят | OK | высокое дерево с редкой коричневой кроной, зелени почти нет |
| 167 | Factory 2.0 | industrial | совпадает | подходит | подходят | OK | промышленный комплекс из серого камня и красного кирпича с трубами |
| 168 | Ancient oak tree | decor | совпадает | подходит | подходят | OK | облезлое дерево целиком из бруса, листвы и травы нет, ветви читаются |
| 169 | Modern house 1 | residential | совпадает | подходит | подходят | OK | низкий светло-серый дом с плоской крышей на просторном газоне |
| 170 | Modern house 2 | residential | частично | подходит | лишние (-modern) | мелочь | деревяно-серый дом на огромном газоне, признаков современного стиля мало |
| 171 | Mediterranean Style / Traditional House | residential | совпадает | подходит | подходят | OK | крупный дом со светлыми стенами, террасами и газоном вокруг |
| 172 | Modern Apartment Building / 1.6.2 | residential | совпадает | подходит | подходят | OK | высотный дом со светлым фасадом, тёмными окнами и зеленью у основания |
| 173 | Wood Shop | commercial | совпадает | подходит | подходят | OK | крупная постройка: тёмно-серая плоская кровля и деревянный каркас сверху |
| 174 | Mansion | residential | совпадает | подходит | подходят | OK | крупный особняк с несколькими крыльями, камнем и деревом в отделке |
| 175 | Tower with clock | towers | частично | подходит | подходят | мелочь | деревянная башня на большом газоне, циферблат разглядеть не удалось |
| 176 | Spawn House | residential | совпадает | подходит | подходят | OK | маленький деревянный домик с фонарями на столбах по краям участка |
| 177 | Wood Modern House | residential | совпадает | подходит | подходят | OK | почти целиком деревянный дом с ломаной кровлей, окон немного |
| 178 | Modern Apartment Building | residential | совпадает | подходит | подходят | OK | высокий серый дом с рядами окон и балконами на зелёном участке |
| 179 | Seaside Nordic Mansion | residential | частично | подходит | подходят | мелочь | тёмный деревянный дом с серой крышей на огромном газоне, воды в кадре нет |
| 180 | Wood house | residential | частично | подходит | подходят | мелочь | каменный дом: серые стены и кровля, дерева заметно меньше, чем в имени |
| 181 | Blue Modern Tower | towers | совпадает | подходит | подходят | OK | узкая высокая башня из голубого стекла и светлого бетона, читается |
| 182 | Stylish House | residential | совпадает | подходит | подходят | OK | деревянный дом с большими окнами и панорамным остеклением фасада |
| 183 | Small pond 1 | decor | совпадает | **не подходит**→decor | лишние (-shop) | РАСХОЖДЕНИЕ | пруд с голубой водой на газоне, торговой или магазинной застройки нет |
| 184 | Cherry Tree | decor | частично | подходит | подходят | мелочь | дерево с крупной голубовато-белой кроной, розовой вишнёвой листвы не видно |
| 185 | Stark Tower | towers | совпадает | подходит | подходят | мелочь | высокая башня из синего стекла со шпилем; в имени отсылка к Marvel |
| 186 | A Small Modern House | residential | совпадает | подходит | подходят | OK | маленький низкий дом из серого бетона с панорамным остеклением |
| 187 | Real KFC Restaurant | commercial | частично | подходит | подходят | мелочь | низкое серое здание на газоне у большого водоёма, фирменной окраски не видно |
| 188 | Starting House (Mansion) | residential | совпадает | подходит | подходят | OK | деревянный дом с высокой двускатной крышей и трубой, аккуратный |
| 189 | Simple resource warehouse | industrial | совпадает | **не подходит**→industrial | подходят | РАСХОЖДЕНИЕ | деревянный сарай с пологой крышей и сеном у входа — это склад, а не жильё |
| 190 | Big minecraft modern house | residential | совпадает | подходит | подходят | OK | широкий низкий дом с плоской крышей, бассейном и большим газоном |
| 191 | Market with the villagers | commercial | совпадает | **не подходит**→commercial | подходят | РАСХОЖДЕНИЕ | рыночная площадка под серым навесом с прилавками и сеном — торговля |
| 192 | Stark Tower | towers | совпадает | подходит | подходят | мелочь | та же башня из синего стекла со шпилем — вторая копия в этом батче |
| 193 | Modern Mansion | residential | совпадает | подходит | подходят | OK | огромный белый особняк с плоской крышей и большим бассейном |
| 194 | Blue Modern Tower | towers | совпадает | подходит | подходят | OK | повтор той же голубой стеклянной башни — полный дубль в батче |
| 195 | Lakehouse  | residential | совпадает | подходит | подходят | OK | деревянный дом с плоской травяной крышей у пруда, на крыше стоят деревья |
| 196 | Iron Man's Mansion | residential | совпадает | подходит | подходят | OK | огромный бело-серый особняк с изогнутыми террасами и подъездами по периметру |
| 197 | Classic Modern House | residential | совпадает | подходит | подходят | OK | современный одноэтажный дом с плоскими кровлями, внутренним двором и бассейном |
| 198 | Modern Apartment Building | residential | совпадает | подходит | подходят | OK | высотный жилой дом с балконами, деревянными панелями и остеклённым цоколем |
| 199 | Lighthouse  | towers | совпадает | **не подходит**→towers | лишние (-water) | РАСХОЖДЕНИЕ | красно-белый маяк с фонарём и куполом, к жилым домам не относится, воды в кадре нет |
| 200 |  Clock Tower | towers | совпадает | подходит | подходят | OK | башня с циферблатом, резным навершием и окнами по ярусам |
| 201 | Colonial Mansion | residential | совпадает | подходит | подходят | OK | кирпичный особняк с бассейном, подъездом и живыми изгородями |
| 202 | Small Town | residential | совпадает | **не подходит**→residential | лишние (-shop) | РАСХОЖДЕНИЕ | улочка с домами и церковью, читается; к коммерции не относится |
| 203 | Skate Park | parks | совпадает | подходит | подходят | OK | бетонный скейт-парк с рампами, перилами и столбами по краю площадки |
| 204 | Factory Building | industrial | совпадает | подходит | подходят | OK | серый промышленный корпус с красными трубами и остеклёнными проходами |
| 205 | Traditional House | residential | совпадает | подходит | подходят | OK | крупный деревянный дом с террасами и белыми наличниками вдоль фасада |
| 206 | Beach House | residential | совпадает | подходит | подходят | OK | дом на сваях у воды, читается |
| 207 | Dream Survival House | residential | совпадает | подходит | подходят | OK | небольшой деревянный дом с открытой террасой и входной лестницей |
| 208 | Harbor Village | residential | совпадает | подходит | подходят | OK | деревянная гавань-деревня на воде с кораблём, каналом и сторожевыми башнями |
| 209 | Furnished Yacht  | vehicles | совпадает | **не подходит**→vehicles | подходят | РАСХОЖДЕНИЕ | многопалубная белая яхта с мостиком и антеннами: судно, а не прибрежная застройка |
| 210 | Large Yacht | vehicles | совпадает | **не подходит**→vehicles | подходят | РАСХОЖДЕНИЕ | длинное белое судно с палубами на синей воде, скорее лайнер, чем здание набережной |
| 211 | Giant Church | public | совпадает | подходит | подходят | OK | длинный серый храм с башней-колокольней, трапезной и алтарным крылом |
| 212 | Most Secured House | residential | совпадает | подходит | подходят | OK | обнесённый стеной дом с двором, читается |
| 213 | Desert City | decor | совпадает | подходит | подходят | OK | песчаный укреплённый квартал с дворами, воротами и низкими постройками |
| 214 | Skyscraper  | towers | совпадает | подходит | подходят | OK | изогнутая стеклянная башня с белыми панелями на небольшой площадке |
| 215 | Japanese Style House | residential | совпадает | подходит | подходят | OK | деревянная постройка с многоярусной пирамидальной кровлей и наличниками |
| 216 | Seaside Nordic Mansion | residential | частично | подходит | лишние (-tall) | мелочь | белый дом с чёрной кровлей и террасами, стиль читается, но этаж один и моря не видно |
| 217 | Little Shop | commercial | частично | подходит | подходят | мелочь | мелкая деревянная конструкция с открытым каркасом, скорее недострой, чем магазин |
| 218 | Apartment Building | residential | совпадает | подходит | подходят | OK | серо-белый жилой блок в форме подковы с балконами и несколькими этажами |
| 219 | Small Cozy House | residential | совпадает | подходит | лишние (-shop) | мелочь | деревянный домик с двускатной кровлей и пристройкой, торговой вывески нет |
| 220 | Assassins Creed Tower | towers | совпадает | подходит | подходят | OK | крепостная башня из серых блоков с золотыми зубцами и ярусами |
| 221 | Twins Towers Gate | towers | совпадает | подходит | подходят | OK | две небольшие башни с золотыми шпилями, соединённые воротами с аркой |
| 222 | Hollywood Hills Mansion | residential | частично | подходит | подходят | мелочь | крупное многооконное здание с жёлтыми акцентами, скорее отель, чем особняк |
| 223 | Modern Hotel | towers | совпадает | подходит | лишние (-tall) | мелочь | серое здание отеля с вывеской и входной группой, примерно шесть этажей |
| 224 | Beach Hotel | towers | совпадает | подходит | подходят | OK | красно-белая высотная башня с балконами и плоской кровлей |
| 225 | Train Station | transport | совпадает | подходит | подходят | OK | длинный вокзал с часовыми башнями, читается |
| 226 | Modern House on a Hilltop | residential | совпадает | подходит | подходят | OK | современный дом с террасами, выступами и пандусами на склоне холма |
| 227 | Villa | residential | частично | подходит | подходят | мелочь | распластанный комплекс с бассейнами, самой виллы почти не видно |
| 228 | Resident Evil 4 Church | public | совпадает | подходит | подходят | OK | серый храм с шпилем, контрфорсами и пристройкой, у входа цветник |
| 229 | The Majestic Hotel | towers | совпадает | подходит | подходят | OK | высотная башня с венцом наверху и жёлто-красными акцентами на фасаде |
| 230 | Saltillo Cathedral Tower | towers | совпадает | подходит | подходят | OK | резная соборная башня с ярусами, шпилем и позолотой наверху |
| 231 | Rustic Mansion | residential | совпадает | подходит | подходят | OK | деревянный усадебный дом с бассейном, верандой и елями вокруг участка |
| 232 | Apple Store | commercial | совпадает | подходит | подходят | OK | стеклянный куб магазина, читается |
| 233 | Sydney Museum of Modern Art | public | совпадает | подходит | подходят | OK | широкий серо-жёлтый музейный комплекс с площадкой и остеклённым фасадом |
| 234 | SuperMario Parkour | parks | совпадает | подходит | лишние (-park) | мелочь | полоса паркура с пиксель-артом фигур из Марио; парковой застройки нет, только аттракционная разметка |
| 235 | Sand Palace Station | transport | частично | подходит | подходят | мелочь | длинный песочный комплекс у озера с набережной и дорогой; вокзальная функция на превью не читается |
| 236 | supreme house asian style | residential | совпадает | подходит | подходят | OK | деревянный дом в азиатском стиле с рвом и золотыми фонарями, читается |
| 237 | Modern 2 story house above small pond | residential | совпадает | подходит | лишние (-shop) | мелочь | белый двухэтажный дом у пруда с бассейном и террасой; торговой части на картинке нет |
| 238 | Rustic Small town | commercial | совпадает | подходит | подходят | OK | деревянный посёлок рядной застройки с площадью, торговые ряды вдоль улицы читаются |
| 239 | Georgian House #1 / full furnished / 1.6.4 | residential | совпадает | подходит | подходят | OK | кирпичный классический дом с бассейном, садом и подъездной дорожкой, читается |
| 240 | Modern house II | residential | совпадает | подходит | подходят | OK | современный дом со стеклянной кровлёй, перголой и открытой террасой, читается |
| 241 | Small Cozy House | residential | совпадает | подходит | лишние (-shop) | мелочь | маленький бревенчатый домик с сенными тюками; признаков торговой точки нет |
| 242 | burger shop | commercial | совпадает | подходит | подходят | OK | фастфуд с парковкой, навесом и отдельным столбом вывески, коммерческая функция читается |
| 243 | LARGE 3 story Mansion | residential | совпадает | подходит | подходят | OK | крупный трёхэтажный особняк с террасами, бассейном и подъездами, читается |
| 244 | Stark Tower | towers | частично | подходит | подходят | мелочь | стеклянная башня со скошенным фасадом; кинокомиксная отсылка есть только в имени, на картинке её нет |
| 245 | Suburban House #1 / Full Furnished / 1.7.4 | residential | совпадает | подходит | подходят | OK | пригородный участок с домом, бассейном, дорожками и деревьями, читается |
| 246 | European Mansion #1 / By Goldeneye33 | residential | совпадает | подходит | подходят | OK | большой особняк с регулярным садом, бассейном и аллеями, читается |
| 247 | Modern House [D.I.Y Interior] | residential | совпадает | подходит | подходят | OK | двухэтажный дом в стиле модерн с гаражом и террасами, читается |
| 248 | Traditional house | residential | совпадает | подходит | подходят | OK | традиционный дом с высокой двускатной кровлёй и изогнутым подъездом, читается |
| 249 | Traditional House 2 | residential | совпадает | подходит | подходят | OK | большой традиционный дом с внутренним двором и подъездной площадкой, читается |
| 250 | Traditional House #4 / by Goldeneye33 | residential | совпадает | подходит | подходят | OK | деревянный дом с прудом, террасой и деревьями участка, читается |
| 251 | Jungle Treehouse | residential | частично | подходит | подходят | мелочь | дом на крупном стволе с водопадами читается, но ярусы и листва слились в единый массив |
| 252 | Modern Burger Shop | residential | не совпадает | **не подходит**→residential | лишние (-shop) | РАСХОЖДЕНИЕ | серо-белый многоэтажный блок с балконами и вентиляцией на кровле; магазина и витрин нет |
| 253 | Hollywood Style Mansion / by Goldeneye33 | residential | совпадает | подходит | подходят | OK | особняк с бассейном, подъездом и ровным газоном, стиль читается |
| 254 | Nordic house #2 | residential | частично | подходит | подходят | мелочь | северный дом с крутыми крышами читается, но нижняя часть выглядит разобранной или недостроенной |
| 255 | Japanese pagoda Plus Tea House | residential | частично | подходит | подходят | мелочь | многоярусная деревянная постройка с выносами ярусов и чайным домиком у основания, пагода с натяжкой |
| 256 | Futurist Modern House #2 | residential | совпадает | подходит | подходят | OK | белый футуристичный дом с бассейном и плоскими кровлями, читается |
| 257 | Plantation Mansion #1 / Architecture | residential | совпадает | подходит | подходят | OK | дом в стиле плантации с колоннадой и аллеей деревьев, читается |
| 258 | Office Building / Architecture | towers | совпадает | подходит | подходят | OK | многоэтажный офис со стеклянным фасадом и сеткой окон, читается |
| 259 | European Mansion 2 | residential | совпадает | подходит | подходят | OK | особняк с подъездом, газонами и ограждением участка, читается |
| 260 | Futurist Modern house/tower | residential | частично | **не подходит**→residential | лишние (-tower) | РАСХОЖДЕНИЕ | широкий многоуровневый модерн-дом с террасами и навесами, по массе это не башня |
| 261 | Modern House | residential | совпадает | подходит | подходят | OK | одно-двухэтажный модерн-дом из дерева и стекла на ровном участке, читается |
| 262 | Grand Central Park | parks | совпадает | подходит | лишние (-tall) | мелочь | большой парк с дорожками, площадкой и деревьями; вертикальных элементов нет, тег tall лишний |
| 263 | Modern Grand Fountain | parks | совпадает | подходит | подходят | OK | высокая колонна фонтана в круглом бассейне под навесом, читается |
| 264 | Modern/Futuristic City Building. | decor | совпадает | подходит | подходят | OK | современное здание с изогнутой кровлёй, навесом и вымощенной площадкой, городской модерн читается |
| 265 | Big tree | decor | совпадает | подходит | подходят | OK | крупное дерево без листвы с толстым стволом и ветвями, читается |
| 266 | Colonial Mansion 1 | residential | совпадает | подходит | подходят | OK | колониальный особняк с бассейном и рядами деревьев, читается |
| 267 | 35x35 Futuristic House Plot | residential | совпадает | подходит | подходят | OK | футуристичный дом на плотном участке со стеклом и террасами, читается |
| 268 | Mansion #3 | residential | совпадает | подходит | подходят | OK | огромный особняк с подъездной площадью, газонами и служебными постройками, читается |
| 269 | Twin Hotel Towers | towers | совпадает | подходит | подходят | OK | две высокие башни, соединённые переходом над водой, читается |
| 270 | Modern House | residential | совпадает | подходит | подходят | OK | модерн-дом с бассейном, мощением и деревьями на широком участке, читается |
| 271 | Luxurious Cove House | residential | совпадает | подходит | подходят | OK | дом на скалистом берегу с бухтой, террасами и деревьями, читается |
| 272 | Classic Modern House | residential | совпадает | подходит | подходят | OK | стеклянный модерн-дом с бассейном на холмистом участке, читается |
| 273 | Traditional Mansion | residential | совпадает | подходит | подходят | OK | крупное традиционное поместье: деревянные дома, дороги, два пруда и деревья на участке |
| 274 | Modern city building | decor | совпадает | подходит | подходят | OK | высотная башня со стеклянным фасадом, вертикальной шахтой и подиумом у основания |
| 275 | Exampleton Basic Village | residential | совпадает | подходит | подходят | OK | большой участок с множеством мелких деревянных домов и дорожками между ними — посёлок |
| 276 | Modern Townhouse 2 | residential | совпадает | подходит | подходят | OK | компактный двухэтажный дом с плоскими кровлями, деревянными акцентами и остеклением |
| 277 | Modern Box house | residential | совпадает | подходит | подходят | OK | коробочный дом из белых плоских объёмов с панорамным стеклом на мощёной площадке |
| 278 | Contemporary Survival Starter House | residential | совпадает | подходит | подходят | OK | узкий тёмный дом-столб на 10x10 со светлым верхним объёмом, пропорции вытянуты вверх |
| 279 | Modern house | residential | совпадает | подходит | подходят | OK | низкий современный дом с плоскими кровлями, деревянными вставками и газоном вокруг |
| 280 | Japanese style house | residential | совпадает | подходит | подходят | OK | деревянный дом с многоярусной тёмной крышей и красными деталями на зелёном участке |
| 281 | Japanese style house (Standard) | residential | совпадает | подходит | подходят | OK | вариант того же японского дома: террасная крыша, деревянный низ, зелёный газон |
| 282 | 16x16 Modern House 1 | residential | совпадает | подходит | подходят | OK | небольшой квадратный дом с плоской кровлей, деревянными вставками и окнами на газоне |
| 283 | 16x16 Modern House 2 | residential | совпадает | подходит | подходят | OK | белый коробочный дом с большими стеклянными окнами и плоской крышей |
| 284 | 16x16 Modern House 3 | residential | совпадает | подходит | подходят | OK | дом с деревянным фасадом, выносными террасами и стеклянными балюстрадами |
| 285 | Desert city | decor | совпадает | подходит | подходят | OK | песочный город-крепость: стены с башнями по углам и плотная застройка внутри |
| 286 | Modern Mansion | residential | совпадает | подходит | подходят | OK | крупный белый особняк у дороги и водоёма, вокруг газон, деревья и подъезд |
| 287 | traditional mansion 2 | residential | совпадает | подходит | подходят | OK | большой традиционный дом с мансардными окнами, подъездной дорожкой и газоном |
| 288 | Rustic Mansion/Large House | residential | совпадает | подходит | подходят | OK | массивный деревянный дом из брёвен с высокими скатными крышами и трубой |
| 289 | Mansion | residential | совпадает | подходит | подходят | OK | крупный особняк с серыми скатными крышами, подъездом и прогулочной зоной на участке |
| 290 | Traditional mansion | residential | совпадает | подходит | подходят | OK | традиционный особняк с тёмной кровлей и подъездной дорожкой, светлый газон |
| 291 | Large modern house | residential | совпадает | подходит | подходят | OK | длинный низкий дом с террасами вдоль дороги, участок озеленён |
| 292 | Cascade City | decor | частично | подходит | подходят | мелочь | не город, а декоративная башня с круглыми каскадными площадками и растительностью |
| 293 | Modern house | residential | совпадает | подходит | подходят | OK | современный дом с плоской кровлёй, бассейном и газоном, читается |
| 294 | Modern house | residential | совпадает | подходит | подходят | OK | двухэтажный дом в бело-серой гамме с деревом, стеклом и лужайкой |
| 295 | Modern house 3 | residential | совпадает | подходит | подходят | OK | современный дом с плоскими кровлями, деревянными панелями и стеклянным ограждением |
| 296 | Futuristic house | residential | совпадает | подходит | подходят | OK | дом с плавными террасными формами на зелёном склоне, облик футуристичный |
| 297 | Iron Man's Mansion | residential | частично | подходит | подходят | мелочь | огромный белый модернистский комплекс на склоне с дорогами и кипарисами; отсылки к персонажу не видно |
| 298 | Modern mansion | residential | совпадает | подходит | подходят | OK | крупный белый особняк с изогнутыми объёмами, бассейном и газоном |
| 299 | Epich Yacht [Fully Furnished] | waterfront | совпадает | подходит | подходят | OK | большая яхта с надстройкой и мачтой на синей воде, палуба детализирована |
| 300 | Modern house | residential | совпадает | подходит | подходят | OK | современный дом серо-белой гаммы с деревянными акцентами и плоской кровлей |
| 301 | Futuristic house | residential | частично | подходит | подходят | мелочь | вилла с большим бассейном и плоскими кровлями; футуристичность на превью не читается |
| 302 | Modern house | residential | совпадает | подходит | подходят | OK | современный дом со скошенными кровлями, стеклом и газоном вокруг |
| 303 | Oakheart House II | residential | совпадает | подходит | лишние (-tree) | мелочь | деревянный дом с высокой двускатной крышей на сером основании; зелени и деревьев не видно |
| 304 | Panda express restaurant | commercial | совпадает | подходит | подходят | OK | одноэтажное коммерческое здание с вывеской на крыше и асфальтовой площадкой перед ним |
| 305 | Large traditional modern house | residential | совпадает | подходит | подходят | OK | крупный дом из белых современных объёмов с серой черепичной кровлёй и террасами |
| 306 | Town: &quot;Portland&quot; | waterfront | совпадает | подходит | подходят | OK | город на реке с водопадом, деревянной застройкой и причалами вдоль воды |
| 307 | Large modern house | residential | совпадает | подходит | подходят | OK | современный белый дом с бассейном, террасой и подъездной площадкой |
| 308 | Modern house | residential | совпадает | подходит | подходят | OK | ступенчатый дом из серо-коричневых объёмов с круглыми световодами на крыше |
| 309 | Futuristic mansion | residential | частично | подходит | подходят | мелочь | крупный особняк с двумя бассейнами и террасами; футуристичность не видна |
| 310 | Light House (with working lights) | waterfront | совпадает | **не подходит**→waterfront | лишние (-house) | РАСХОЖДЕНИЕ | полосатый маяк на скалистом острове в воде; к жилой застройке не относится |
| 311 | Alexandar V Luxury Yacht | waterfront | частично | подходит | подходят | мелочь | судно с палубной надстройкой на воде, но детали палубы больше похожи на спецсудно |
| 312 | Modern house | residential | совпадает | подходит | подходят | OK | длинный современный дом с плоскими кровлями, деревянной террасой и газоном |
| 313 | Small modern house | residential | совпадает | подходит | лишние (-shop) | мелочь | белый двухэтажный дом с плоской крышей и ограждённым участком, признаков магазина не видно |
| 314 | Steampunk Bridge | bridges | частично | подходит | подходят | РАСХОЖДЕНИЕ | парящие зелёные острова с деревянным переходом и свисающими столбами воды, стимпанк-механики нет |
| 315 | Large modern house | residential | совпадает | подходит | подходят | OK | длинный белый дом с бассейном на огромном газоне среди деревьев с красной листвой |
| 316 | Modern House | residential | совпадает | подходит | подходят | OK | небольшой дом с широкой серой крышей, белыми стенами и площадкой перед входом |
| 317 | Great garden detailed | parks | совпадает | подходит | подходят | OK | регулярный сад с тремя фонтанами, изгородями, дорожками и лавками, всё читается |
| 318 | Ancient lightower | towers | совпадает | подходит | подходят | OK | округлая каменная башня с голубым фонарём наверху, у основания водный круг |
| 319 | Petronas Twin Towers, Kuala Lumpur, Malaysia | towers | совпадает | подходит | подходят | OK | две симметричные башни, соединённые мостиком, с мозаичной отделкой и шпилями |
| 320 | Mall Shop | commercial | совпадает | подходит | лишние (-tall) | мелочь | широкое здание с витринами и фонарями у входа, на крыше крупная надпись; невысокое |
| 321 | Sugar can factory | industrial | совпадает | подходит | подходят | OK | прямоугольное здание с горизонтальными ярусами, голубыми стенами и жёлтой отмосткой снизу |
| 322 | Beach House | residential | совпадает | подходит | подходят | OK | деревянный дом с широкой террасой, колоннами и лестницей на приподнятом основании |
| 323 | Big treehouse | residential | совпадает | подходит | подходят | OK | большое дерево с деревянными настилами, лестницами и фонариками между ветвями |
| 324 | Mansion | residential | совпадает | подходит | подходят | OK | крупный особняк с множеством острых крыш и башенками, к нему ведёт красная дорожка |
| 325 | Great Oak Tree with Spanish Moss | decor | совпадает | подходит | подходят | OK | дерево с толстым стволом и широкой кроной из бурых блоков, свисающих прядей много |
| 326 | 1950s Moses Lake High School Building | public | совпадает | подходит | подходят | OK | протяжённый школьный корпус с крыльями и внутренним двором, рядом спортивное поле |
| 327 | 29-Story Modern Parking Garage Structure | transport | частично | подходит | лишние (-park) | мелочь | серая башня с горизонтальными рядами этажей, паркинг неочевиден; зелёного парка нет |
| 328 | 432 Park Avenue Skyscraper Replica | towers | совпадает | **не подходит**→towers | лишние (-road -park) | РАСХОЖДЕНИЕ | тонкий белый небоскрёб с сеткой окон: это башня, а не дорога; дороги и парка в кадре нет |
| 329 | A Walkable Bridge | bridges | совпадает | подходит | подходят | OK | пролёт из бруса с перилами и раскосами, по центру вниз спускается опора |
| 330 | Addexio&#8217;s Sausage Kiosk | commercial | совпадает | подходит | подходят | OK | крохотный ларёк с голубым навесом, прилавком и деревянной дверцей, компактный |
| 331 | Age of Empires Sentry Tower | towers | совпадает | подходит | подходят | OK | низкая каменная башенка с широким плоским деревянным навесом на столбах; отсылка к игре |
| 332 | AIK Bank Building | commercial | частично | подходит | лишние (-bank) | мелочь | голый бежевой куб без окон, снизу проступает вскрытый подземный уровень; вид банка нет |
| 333 | Aik House 03 Modern Residence | residential | совпадает | подходит | подходят | OK | двухэтажный дом с балконами, плоскими крышами и открытой лестницей, жилой вид |
| 334 | AIK House 16: Large Quartz City Residence | residential | частично | подходит | подходят | мелочь | трёхэтажный дом с зелёной кровлей-садом и балконами, но фасад бежевый, а не кварцевый |
| 335 | AIK Weaving Factory | industrial | частично | подходит | подходят | мелочь | здание в два яруса с деревянными навесами вместо кровли, производство не читается |
| 336 | Airport Service Truck | vehicles | совпадает | **не подходит**→vehicles | подходят | РАСХОЖДЕНИЕ | маленькая белая служебная машина с синими блоками: это транспорт, а не набережная |
| 337 | Ancient Fountain | parks | совпадает | подходит | подходят | OK | каменный фонтан с чашей и водой на зелёном газоне, ступенчатое основание |
| 338 | Ancient Greek Library Structure | public | совпадает | подходит | подходят | OK | античная колоннада с фризом и ступенчатым цоколем, крыша плоская, читается |
| 339 | Ancient Stone Archway Bridge | bridges | частично | подходит | подходят | мелочь | пролёт на столбах с голубым прозрачным настилом и деревянными элементами; каменной арки нет |
| 340 | Apartment Building Replica | residential | частично | подходит | подходят | мелочь | красный жилой блок с глухими стенами и рядом сухое дерево, ряды окон не читаются |
| 341 | Apartment Building Under Construction | residential | совпадает | подходит | подходят | OK | стройка: сетка колонн и перекрытий на пятне застройки, фасада ещё нет |
| 342 | Apartment Building With Colorful Block Design | residential | совпадает | подходит | подходят | OK | многоэтажный дом с яркой раскладкой красных, белых и синих панелей на фасаде |
| 343 | Apartment Building With Shop | residential | частично | подходит | лишние (-shop) | мелочь | узкий серый дом в четыре этажа с балконами и световым люком, входа магазина нет |
| 344 | Simple Asian Bridge | bridges | совпадает | подходит | подходят | OK | деревянный настил с перилами и частыми поперечными балками на опорах вдоль пролёта |
| 345 | Asian Hotel Building | commercial | совпадает | подходит | подходят | OK | корпус замыкает двор с бассейном, по периметру деревянные балки и колонны |
| 346 | Asian Pagoda Tower | towers | совпадает | подходит | подходят | OK | три яруса с загнутыми крышами, белые стены и золотые коньки, этажность читается |
| 347 | Automatic Nighttime Streetlight | roads | совпадает | подходит | лишние (-tree) | мелочь | серый фонарный столб с горизонтальной лампой; дерево в кадре отсутствует |
| 348 | Automotive Tuning Workshop | commercial | совпадает | подходит | подходят | OK | крупная ровная крыша на рядах столбов, снизу открытый пролёт — похож на автосервис |
| 349 | Avalon Manor House | residential | совпадает | подходит | подходят | OK | вытянутый особняк с многоярусной серой крышей и рядом окон вдоль фасада |
| 350 | Avengers Tower Build | towers | совпадает | подходит | подходят | OK | высотная башня с расширенной верхушкой и красно-белой отделкой, силуэт Мстителей |
| 351 | Average Decor House | residential | совпадает | подходит | подходят | OK | деревянный дом с крутой серой крышей, тёплым светом в окнах и гирляндами на стенах |
| 352 | Bank and Financial Building | commercial | совпадает | подходит | подходят | OK | крупное современное здание со стеклянным фасадом и лёгкой навесной крышей, офисный вид |
| 353 | Baroque Quartz Villa With Garden | residential | совпадает | подходит | подходят | OK | большая вилла с деревянной кровлей, вокруг сад, пруды и фонтанчики — сад читается |
| 354 | Basalt Block House | residential | частично | подходит | лишние (-house) | мелочь | каркас из серых блоков с балками и фонарями на пустом основании, дом не собран |
| 355 | Baseball Stadium | public | совпадает | подходит | подходят | OK | бейсбольное поле с бело-голубым ромбом и бетонными трибунами вокруг, читается |
| 356 | Basic Lighthouse Structure | towers | совпадает | **не подходит**→towers | лишние (-house) | РАСХОЖДЕНИЕ | высокий серый маяк на островке посреди воды, к жилым зданиям не относится |
| 357 | Beautiful Fountain | parks | совпадает | подходит | подходят | OK | высокий фонтан: голубой столб воды на круглой колоннаде с чашей |
| 358 | Big House 11 Modern Complex | residential | совпадает | подходит | подходят | OK | два современных корпуса со стеклом и бассейном на огороженном участке |
| 359 | Blocks Ahoy Hotel &#8211; Towering Presidential Suite | towers | совпадает | подходит | подходят | OK | высотняк с сетчатым стеклянным фасадом и остеклённой скатной кровлёй |
| 360 | Blue And White Lighthouse Structure | towers | совпадает | **не подходит**→towers | лишние (-house) | РАСХОЖДЕНИЕ | ярусная башня из восьмигранных секций наверху дымовой трубы, похожа на маяк |
| 361 | Blue-Orange Apartment Building Progress | residential | совпадает | подходит | подходят | OK | крупный строящийся каркас с рядами колонн и внутренним ядром, стадия прогресса |
| 362 | Blue Orange Apartment Building Under Construction | residential | совпадает | подходит | подходят | OK | недостроенный каркас многоэтажки на пятне застройки, названию соответствует |
| 363 | Blue Palace Furnished Residence | residential | совпадает | подходит | лишние (-tall) | мелочь | протяжённый низкий дворец с прудом и внутренним двором, этажности не видно |
| 364 | Building Contractors Office | commercial | частично | **не подходит**→commercial | лишние (-office) | РАСХОЖДЕНИЕ | участок подрядчика: несколько низких построек и опоры, ни башни ни офиса не видно |
| 365 | Candy Cane Road Light | roads | совпадает | подходит | подходят | OK | голубая арка-фонарь в форме леденца, отдельно стоящая компактная деталь |
| 366 | Central Fountain Maze Schematic | parks | совпадает | подходит | подходят | OK | зелёный лабиринт из невысоких изгородей с круглым фонтаном в центре |
| 367 | Ceramic Production Factory | industrial | совпадает | подходит | подходят | OK | кирпичный завод с высокой трубой, утиными трубами и волнистой кровлёй цеха |
| 368 | Charming Cottage with Living Area and Garage | residential | совпадает | **не подходит**→residential | подходят | РАСХОЖДЕНИЕ | длинный красный дом с двускатной серой кровлёй на газоне — это коттедж |
| 369 | Charming Small House Shop | residential | частично | подходит | подходят | мелочь | длинное низкое строение с полосатой кровлёй, и «маленький», и «магазин» не видны |
| 370 | Chest-Shaped Storage Warehouse | industrial | совпадает | **не подходит**→industrial | лишние (-house) | РАСХОЖДЕНИЕ | гигантский сундук-хранилище на газоне, это склад, а не жилой дом |
| 371 | Chest Shop Galleria | commercial | совпадает | подходит | подходят | OK | красный сундук-магазин с рёбрами и замочной скважиной, форма читается |
| 372 | Chiseled Stone Brick Bridge | bridges | совпадает | подходит | подходят | OK | длинный арочный мост из каменной кладки с фонарями по обоим краям |
| 373 | Chrysler Building Skyscraper | towers | совпадает | подходит | подходят | OK | небоскрёб в стиле ар-деко со ступенчатыми верхами и тонким шпилем |
| 374 | City 17 Style Apartment Block | residential | совпадает | подходит | подходят | мелочь | строгий бетонный блок с плоской кровлёй, отсылка к вымышленному городу из игры |
| 375 | City Hall Building | public | совпадает | **не подходит**→public | подходят | РАСХОЖДЕНИЕ | ратуша с колоннадой и парадной лестницей на газоне — общественное здание, не декор |
| 376 | City Hotel With Penthouses | commercial | совпадает | **не подходит**→commercial | подходят | РАСХОЖДЕНИЕ | широкий отель на шесть-семь этажей с балконами и навесом, башня это не башня |
| 377 | City Intersection Crossroads | intersections | совпадает | подходит | подходят | OK | перекрёсток из брусчатки с пешеходными переходами и фонарями на углах |
| 378 | City Library Building | public | совпадает | подходит | подходят | OK | современное низкое здание со светлым фасадом и остеклением на газоне с деревьями |
| 379 | City Park Garden | parks | совпадает | подходит | подходят | OK | огороженный сад с дорожками, стрижеными деревьями, изгородями и прудиком |
| 380 | City Road Construction Project | roads | совпадает | подходит | подходят | OK | дорожная сетка с перекрёстками, газонными разделителями и красно-белыми ограждениями |
| 381 | Classic Lighthouse Tower | towers | совпадает | подходит | лишние (-house) | мелочь | каменный маяк с фонарной камерой сверху, дома у основания не видно |
| 382 | Classic Minecraft Lighthouse Decoration | towers | совпадает | **не подходит**→towers | лишние (-house) | РАСХОЖДЕНИЕ | серый маяк с расширенным основанием и деревянной площадкой сверху, дома нет |
| 383 | Classic Museum Building Berlin | public | совпадает | подходит | лишние (-tall) | мелочь | огромное классическое музейное здание с колоннадой и внутренним двором, оно низкое |
| 384 | Classic School Bus Design | vehicles | совпадает | **не подходит**→vehicles | подходят | РАСХОЖДЕНИЕ | жёлтый школьный автобус на асфальтовой площадке, здания здесь нет |
| 385 | Classic Train Station Design | transport | совпадает | подходит | подходят | OK | зал станции с арочными перекрытиями и красными вертикальными лентами на фасаде |
| 386 | Coastal Lighthouse &#8211; Polished Andesite &amp; Stone Bricks | towers | совпадает | **не подходит**→towers | подходят | РАСХОЖДЕНИЕ | высокий серый маяк на синей воде с маленьким домиком рядом, категория не жилая |
| 387 | Coastal Lighthouse Structure | towers | частично | **не подходит**→towers | лишние (-water) | РАСХОЖДЕНИЕ | многоярусная башенка с деревянными кровлями на траве, берега и воды не видно |
| 388 | Coastal Lighthouse Tower | towers | совпадает | подходит | лишние (-house) | мелочь | белая спиральная башня маяка с фонарём наверху, дома у основания нет |
| 389 | Cobblestone House Design | residential | частично | подходит | подходят | мелочь | широкое шестиугольное строение с коричневой кровлёй, обычный дом не читается |
| 390 | Communist Apartment Block | residential | совпадает | подходит | подходят | OK | длинный краснокирпичный жилой дом со множеством окон, типичный блочный |
| 391 | Compact Football Stadium | public | совпадает | подходит | подходят | OK | стадион с зелёным полем и трибунами по периметру бетонной коробки |
| 392 | Compact Highway Gas Station | commercial | совпадает | **не подходит**→commercial | подходят | РАСХОЖДЕНИЕ | заправка у трассы с навесом и площадкой — это коммерция, а не дорожная постройка |
| 393 | Compact Hospital Structure | public | частично | подходит | подходят | мелочь | бледный компактный корпус с башней, функция больницы снаружи не читается |
| 394 | Compact Quartz Modern House | residential | совпадает | подходит | подходят | OK | кварцевый домик с бассейном и террасой, читается отлично |
| 395 | Compact Two-Story Office Building | commercial | совпадает | **не подходит**→commercial | подходят | РАСХОЖДЕНИЕ | плоский двухэтажный офисный корпус, к башням не относится |
| 396 | Concrete Factory Structure | industrial | совпадает | подходит | подходят | OK | завод с красными трубами и цистернами, читается |
| 397 | Concrete Warehouse Structure | industrial | совпадает | **не подходит**→industrial | лишние (-house) | РАСХОЖДЕНИЕ | арочный серый склад-ангар, жилой категории не соответствует |
| 398 | Large Corporate Office Building | towers | совпадает | подходит | подходят | OK | крупный офисный блок со стеклянным атриумом, читается |
| 399 | Corporate Office Building | towers | совпадает | подходит | подходят | OK | голубая офисная башня с отделкой, читается |
| 400 | Country Library Building | public | частично | подходит | подходят | мелочь | бледная плоская коробка, на библиотеку тянет слабо |
| 401 | Covered Minecraft Bridge | bridges | совпадает | подходит | подходят | OK | длинный крытый мост с остеклением, читается |
| 402 | Cozy Medium House With Garden | residential | совпадает | подходит | подходят | OK | красный домик с садом и фонарями, читается отлично |
| 403 | Cozy Small Hotel Building | towers | совпадает | подходит | лишние (-shop) | мелочь | серая гостиничная башня, витрин магазина не видно |
| 404 | Cozy Small House with Attic and Basement | residential | совпадает | подходит | лишние (-shop) | мелочь | маленькое бунгало под пирамидальной крышей, магазина нет |
| 405 | Cyan Tower Build | towers | частично | подходит | подходят | мелочь | серая высокая башня с коричневым, циана не видно |
| 406 | Dark Luminous Night Tower | towers | совпадает | подходит | подходят | OK | белый светящийся башенный комплекс, читается |
| 407 | Desert Sand Tower | towers | совпадает | подходит | подходят | OK | песочная башенка с красным верхом, читается |
| 408 | Dirt Church Structure | public | совпадает | подходит | подходят | OK | коричневая церковь со скатными крышами, читается |
| 409 | Doughnut Shop Building | commercial | совпадает | подходит | подходят | OK | лавка с гигантским пончиком на крыше, читается отлично |
| 410 | Dreamy Fountain Build | parks | совпадает | подходит | подходят | OK | компактный фонтан с синей водой, читается |
| 411 | Early 20th Century Schoolhouse | public | совпадает | **не подходит**→public | лишние (-house) | РАСХОЖДЕНИЕ | школьный корпус буквой Г, к жилью не относится |
| 412 | Early American Library Building | public | частично | подходит | лишние (-small +tall) | мелочь | узкая красная высотка, на библиотеку не читается |
| 413 | Eight Story Hotel | towers | совпадает | подходит | подходят | OK | стеклянный восьмиэтажный отель, читается |
| 414 | Eldorado House Lakeside Residence | residential | совпадает | подходит | лишние (-apartment) | мелочь | деревянный дом у озера, на апартаменты не тянет |
| 415 | Eldwyn Library Structure | public | частично | подходит | не хватает (+castle-like) | мелочь | сказочный дворцовый корпус, фэнтезийные крыши |
| 416 | Elegant City Hall For Small Towns | public | совпадает | **не подходит**→public | лишние (-shop) | РАСХОЖДЕНИЕ | классическая ратуша с колоннами, не торговля |
| 417 | Elegant Grand Hotel | towers | совпадает | подходит | подходят | OK | огромный красно-белый отель у воды, читается |
| 418 | Elegant Hotel With Bar And Dining | commercial | совпадает | подходит | подходят | OK | коричневый блочный отель, читается |
| 419 | Elegant Marble Bridge Design | bridges | совпадает | подходит | подходят | OK | белый мраморный мост, читается |
| 420 | Elegant Modern Office Tower | towers | совпадает | подходит | подходят | OK | высокая современная офисная башня, читается |
| 421 | Elegant Quartz Fountain | parks | совпадает | подходит | подходят | OK | кварцевый фонтанчик с синей водой, читается |
| 422 | Elegant Quartz Water Fountain | parks | совпадает | подходит | подходят | OK | большой кварцевый фонтан с водой, читается |
| 423 | Elementary School Building | public | совпадает | подходит | подходят | OK | красная кирпичная школа, читается |
| 424 | Elevated Metro Station Building | transport | совпадает | подходит | подходят | OK | эстакадная станция метро, конструкции читаются |
| 425 | Elevated Metro Station Exterior | transport | совпадает | подходит | подходят | OK | открытый каркас эстакадной станции, читается |
| 426 | Elevated Metro Station With Side Platform | transport | совпадает | подходит | подходят | OK | эстакадная станция с боковой платформой, читается |
| 427 | Elevated Railway Station | transport | частично | подходит | подходят | мелочь | виадук с путями без здания станции, с натяжкой |
| 428 | EssentialsX Shop Setup | decor | не совпадает | **не подходит**→decor | лишние (-shop -tall) | РАСХОЖДЕНИЕ | двор с красными крышами и драконом, не магазин |
| 429 | Factory Hall 2.0 | industrial | совпадает | подходит | подходят | OK | кирпичный заводской цех с трубами, читается отлично |
| 430 | Fallout 3 Inspired Overpass Ramp | bridges | совпадает | подходит | не хватает (+bridge) | мелочь | эстакада на столбе, тег моста отсутствует |
| 431 | Fallout 3 Inspired Substation | transport | совпадает | подходит | подходят | мелочь | красная подстанция с трубами и башнями, постапокалипсис считывается |
| 432 | Fallout 3 Player Shack House | residential | совпадает | подходит | подходят | мелочь | приземистая лачуга с плоской крышей, разруха в стиле игры видна |
| 433 | Fallout 3 Power Transmission Tower | towers | совпадает | подходит | подходят | мелочь | тёмная решётчатая опора ЛЭП, высокая и узнаваемая |
| 434 | Fallout 3 Rubble House | residential | совпадает | подходит | подходят | мелочь | развалины дома с обломками стен и ступенями, читаются |
| 435 | Fallout 3 Springvale School Building | public | совпадает | подходит | подходят | мелочь | руины школьного двора с колоннадой и трибунами, масштабно |
| 436 | Fallout 3 Style Overpass Structure | bridges | совпадает | подходит | подходят | мелочь | обломок эстакады на опоре, дорожное полотно видно сверху |
| 437 | Fallout 3 Style Overpass | bridges | совпадает | подходит | подходят | мелочь | прямой пролёт эстакады на бетонной опоре, читается |
| 438 | Fallout 3 Style Power Station | transport | совпадает | подходит | подходят | мелочь | кирпичный корпус электростанции с тремя трубами, мощный |
| 439 | Fallout 3 Water Tower Structure | towers | совпадает | подходит | подходят | мелочь | компактный бак водонапорки на деревянной обвязке, узнаваем |
| 440 | Fire Truck Vehicle | vehicles | совпадает | **не подходит**→vehicles | подходят | РАСХОЖДЕНИЕ | крошечная красная пожарная машина, а не общественное здание |
| 441 | Functional Lighthouse | waterfront | совпадает | **не подходит**→waterfront | не хватает (+tower -house) | РАСХОЖДЕНИЕ | стройная светлая башня маяка без жилья, у воды уместнее |
| 442 | Functional Train Station | transport | совпадает | подходит | подходят | OK | компактный вокзал с жёлтой крышей и перроном, аккуратный |
| 443 | Furnished Bank Building | commercial | совпадает | подходит | подходят | OK | классический банк с колоннадой и лестницами, парадный |
| 444 | Furnished Family Home with Garage | residential | совпадает | **не подходит**→residential | подходят | РАСХОЖДЕНИЕ | большой дом с гаражом и скатной крышей, это жильё |
| 445 | Futuristic City Parking Lot | transport | совпадает | подходит | лишние (-park) | мелочь | плоская плита стоянки с красной зоной и буквой, читается |
| 446 | Futuristic Marble Bridge | bridges | совпадает | подходит | подходят | OK | светлый арочный мост с перилами, изящный |
| 447 | Futuristic Stadium Angle Section | public | совпадает | подходит | подходят | OK | угловой сектор стадиона с трибунами и мачтами, крупный |
| 448 | Futuristic Stadium Panel | public | совпадает | подходит | подходят | мелочь | серая стеновая панель с надписью, фрагмент трибуны |
| 449 | Futuristic Stadium Wall Section | public | совпадает | подходит | подходят | OK | фрагмент стены стадиона с ярусами и крышей, детальный |
| 450 | Futuristic Station for Vehicles | transport | совпадает | подходит | подходят | OK | футуристичный гараж-станция с красными боксами, читается |
| 451 | Garden Fountain Design | parks | совпадает | подходит | подходят | OK | круглая синяя чаша фонтана в белом ограждении, аккуратная |
| 452 | Garden Fountain Structure | parks | совпадает | подходит | подходят | OK | прямоугольный садик с фонтаном по центру, ухоженный |
| 453 | Geologic Museum Minecraft Build | public | частично | подходит | подходят | мелочь | крестообразный деревянный павильон, музей не считывается |
| 454 | Gingerbread Factory | industrial | частично | подходит | подходят | мелочь | крупный цех со стеклянной крышей, пряничность не видна |
| 455 | Glass Factory Build | industrial | частично | подходит | подходят | мелочь | бежевая коробка с ленточными окнами, цех угадывается слабо |
| 456 | Gold Smelting Factory | industrial | совпадает | подходит | подходят | OK | промрамка цеха с красными печами и трубой, выразительно |
| 457 | Gothic Church Minecraft Structure | public | совпадает | подходит | подходят | OK | огромный готический собор с шпилями и витражами, цельный |
| 458 | Grand Central Park &#8211; Large Town Square | parks | совпадает | **не подходит**→parks | лишние (-tall) | РАСХОЖДЕНИЕ | гигантская площадь с фонтаном и клумбами, это парк |
| 459 | Grandpa&#8217;s Flower Power Tower with Garden | towers | совпадает | подходит | подходят | OK | цилиндрическая башня в цветах с садиком у подножия, милая |
| 460 | Gray Tower Structure | towers | совпадает | подходит | подходят | OK | серая ярусная башня с шатровой крышей, аккуратная |
| 461 | Guadalupe River Bridge | bridges | совпадает | подходит | подходят | OK | длинный мост с фонарями над руслом, протяжённый |
| 462 | Hamburg Michel Church Structure | public | совпадает | подходит | подходят | OK | красный храм с зелёной башней под снежной крышей, яркий |
| 463 | Hanging Gardens of Brisbane | parks | совпадает | подходит | подходят | OK | ярусный круглый сад с голубым куполом, пышный |
| 464 | Harbour Shops | commercial | совпадает | подходит | не хватает (+water) | мелочь | лавки на каменной набережной у воды, живописно |
| 465 | Hidden Wooden House | residential | совпадает | подходит | подходят | OK | бревенчатый дом с высокой крышей и трубой, скрытный |
| 466 | Highway Exit Structure | roads | совпадает | подходит | подходят | OK | развязка-съезд с шоссе на несколько полос, читается |
| 467 | Highway Section with Lighting and Signs | roads | совпадает | подходит | подходят | OK | прямой участок шоссе с фонарями и разметкой, ровный |
| 468 | Highway Toll Booth Structure | roads | совпадает | подходит | подходят | OK | пункт оплаты шоссе с навесом и будками, аккуратный |
| 469 | Home and Workshop Building | commercial | совпадает | подходит | подходят | OK | небольшой дом-мастерская с пристройкой и навесом, цельный |
| 470 | Small Hilton Hotel Build | towers | совпадает | подходит | лишние (-shop) | мелочь | серый отель с балконами и оранжевыми окнами, витрин нет |
| 471 | Hotel Honk House | commercial | частично | **не подходит**→commercial | лишние (-house) | РАСХОЖДЕНИЕ | длинный стеклянный павильон-ангар, на башню и дом не тянет |
| 472 | Hotel Opal Seaside Resort | towers | совпадает | подходит | подходят | OK | стеклянный отель с вертолётной площадкой, читается |
| 473 | Hotel Weiss V2 | towers | совпадает | подходит | подходят | OK | две стеклянные башни отеля, современный корпус читается |
| 474 | Immersive Railroading Bridge | bridges | частично | **не подходит**→bridges | подходят | РАСХОЖДЕНИЕ | видны лишь бетонные устои без пролёта, путь едва читается |
| 475 | Immersive Railroading Roundhouse Structure | transport | совпадает | **не подходит**→transport | лишние (-house -road +station) | РАСХОЖДЕНИЕ | красное полукруглое депо веером, это не дорога |
| 476 | Immersive Railroading Steamworks Station | transport | совпадает | **не подходит**→transport | лишние (-road) | РАСХОЖДЕНИЕ | красный цех-станция с депо, к дорогам не относится |
| 477 | Improved Warehouse Storage Structure | industrial | совпадает | **не подходит**→industrial | лишние (-house) | РАСХОЖДЕНИЕ | плоский складской двор с ячейками, не жильё |
| 478 | Indian Style Jade Mansion Tower | towers | совпадает | подходит | подходят | OK | особняк с нефритовой крышей и драконом, башня читается |
| 479 | Integral Bridge Structure | bridges | совпадает | подходит | подходят | OK | длинный мост на опорах с фонарями, читается |
| 480 | Island House Lakefront | residential | совпадает | подходит | не хватает (+water) | мелочь | скалистый остров с домиком, водой и мостиком |
| 481 | Item Storage Warehouse | industrial | совпадает | **не подходит**→industrial | лишние (-house) | РАСХОЖДЕНИЕ | длинный складской корпус, не жильё |
| 482 | Japanese Tower Style Asian Structure | towers | совпадает | подходит | подходят | OK | красная пагода с изогнутыми крышами, читается |
| 483 | Jive 49 Modern Condominium Tower | towers | совпадает | подходит | подходят | OK | красные высотные башни с белой кровлей, читаются |
| 484 | Jungle Spawn Bridge | bridges | совпадает | подходит | подходят | OK | маленький деревянный мостик с фонарями, читается |
| 485 | Keralis Style Giant Mansion | residential | совпадает | подходит | подходят | OK | огромная усадьба с полями и постройками, читается |
| 486 | Kingdom Banker Shop House | residential | частично | подходит | лишние (-bank -shop) | мелочь | крошечная деревянная хижина, банка и лавки не видно |
| 487 | Kokotoni&#8217;s Furnished Tower | towers | совпадает | подходит | подходят | OK | ажурная высокая башня со шпилями, читается |
| 488 | Lapis and Pickaxe Shop &#8211; Medium House | residential | совпадает | подходит | подходят | OK | серое здание с гигантской киркой на крыше, лавка читается |
| 489 | Large Car Park | transport | совпадает | **не подходит**→transport | лишние (-park +parking -car) | РАСХОЖДЕНИЕ | пустая асфальтовая парковка, парка и машин нет |
| 490 | Large House and Shop Building | residential | совпадает | подходит | подходят | OK | длинный торговый павильон с прилавками, читается |
| 491 | Large Modern Hotel &#8211; Jungle Planks | commercial | совпадает | подходит | подходят | OK | светлый современный корпус отеля, читается |
| 492 | Large Ranch Style Minimalist House | residential | совпадает | подходит | подходят | OK | одноэтажное ранчо с двором и подсветкой, читается |
| 493 | Large Server Warehouse | industrial | частично | **не подходит**→industrial | лишние (-house -tall) | РАСХОЖДЕНИЕ | приземистый складской корпус, серверов и высоты нет |
| 494 | Large Smithy Workshop | commercial | совпадает | подходит | подходят | OK | коричневая кузница-мастерская, читается |
| 495 | Large Stone Brick Bridge | bridges | совпадает | подходит | подходят | OK | длинный каменный виадук с арками, читается |
| 496 | Large Stone Bridge With Buildings | bridges | совпадает | подходит | подходят | OK | каменный мост с деревянными надстройками, читается |
| 497 | Large Stone Tower | towers | совпадает | подходит | подходят | OK | высокая серая каменная башня, читается |
| 498 | Large Survival Mansion House | residential | совпадает | подходит | подходят | OK | большой особняк с красными дверями, читается |
| 499 | Lava Hotel Resort | towers | частично | подходит | подходят | мелочь | белый корпус отеля, лавы нигде не видно |
| 500 | Leniland Office Building | towers | совпадает | подходит | подходят | OK | офисный корпус с подсветкой окон, читается |
| 501 | Light Rail Transit Station | transport | совпадает | подходит | подходят | OK | длинная эстакадная станция, читается |
| 502 | Lucava&#8217;s Tower | towers | совпадает | подходит | подходят | OK | ажурная красно-золотая башня с шаром, читается |
| 503 | Luxury Mansion With Party Room | residential | совпадает | подходит | подходят | OK | белый современный особняк с террасой, читается |
| 504 | Luxury Palace Tower With Elevator | towers | совпадает | подходит | подходят | OK | красно-белая дворцовая башня, читается |
| 505 | Luxury Studio Apartment | residential | частично | подходит | подходят | мелочь | крошечная коричневая ячейка-комната, люкса не видно |
| 506 | Luxury Villa with Courtyard and Pool | residential | частично | подходит | лишние (-pool -water) | мелочь | вилла с двором, голубой воды бассейна не видно |
| 507 | Majestic Fountain Structure | parks | совпадает | подходит | подходят | OK | скальный фонтан со струёй воды, читается |
| 508 | Market Stall | commercial | совпадает | подходит | подходят | OK | крошечный торговый прилавок, читается |
| 509 | Massive Lava Tunnel With Minecart Track | bridges | частично | подходит | лишние (-car) | мелочь | тоннель виден линией на 1000 блоков, содержимое не разглядеть |
| 510 | Massive Minecraft Bridge | bridges | совпадает | подходит | подходят | OK | каменный мост на массивных опорах с перилами и дорогой сверху, читается |
| 511 | Massive Skyscraper Structure | towers | частично | подходит | подходят | мелочь | тонкая глухая башня с длинным шпилем, мощного небоскрёба с окнами не видно |
| 512 | Massive Storage Warehouse Structure | industrial | совпадает | **не подходит**→industrial | лишние (-house) | РАСХОЖДЕНИЕ | длинный склад с открытым каркасом кровли, к жилой застройке не относится |
| 513 | Maximum Height Tower | towers | совпадает | подходит | подходят | OK | гладкая высокая башня без окон со ступенью на макушке, всё сходится |
| 514 | McCready Grocery Store | commercial | совпадает | подходит | подходят | OK | крупное плоское здание магазина с большой парковкой и машинами у въезда |
| 515 | McFey Astroworld Amusement Park | parks | частично | подходит | лишние (-park) | мелочь | одиночная аттракционная конструкство вертикальной формы, территории парка нет |
| 516 | Mediterranean Plaza Build | public | совпадает | подходит | подходят | OK | вымощенная площадь с газонами, деревьями и рядами фонарей-колонн |
| 517 | Mediterranean Style Apartment House | residential | совпадает | подходит | подходят | OK | многоэтажный дом с балконами и верхними террасами, категория верна |
| 518 | Mediterranean Style Shopping Center | commercial | совпадает | подходит | подходят | OK | комплекс корпусов с навесами-перголами и внутренним двором, читается |
| 519 | Medium Mansion With Bridge | residential | совпадает | **не подходит**→residential | подходят | РАСХОЖДЕНИЕ | особняк на скале с ручьём: мостик там крошечный, основной объём — жилой дом |
| 520 | Medium Merchant&#8217;s House | residential | совпадает | подходит | подходят | OK | деревянный дом с высокой двускатной крышей и трубой, всё как в имени |
| 521 | Medium Orange Warehouse | industrial | частично | **не подходит**→industrial | лишние (-house) | РАСХОЖДЕНИЕ | серо-белый склад со световыми окнами, оранжевого цвета нет и это не жильё |
| 522 | Medium Wooden Bridge Design | bridges | частично | подходит | подходят | мелочь | пролёт между бетонными опорами с синей полосой настила, дерево не читается |
| 523 | Metro City Spawn | public | совпадает | **не подходит**→public | подходят | РАСХОЖДЕНИЕ | городская площадь с фонтаном, деревьями и двумя башнями, транспортной инфраструктуры нет |
| 524 | Metro Train Pass | transport | частично | подходит | подходят | мелочь | мелкий серый бокс с проёмом и панелью, похож на будку, назначение неясно |
| 525 | Metro Train Station | transport | совпадает | подходит | подходят | OK | длинная платформа с красными составами и фонарями, станция видна |
| 526 | Mid-Century Hotel | towers | совпадает | подходит | подходят | OK | стеклянная башня с просматриваемыми этажами и колоннами, форма подходит |
| 527 | MineBank Building | commercial | совпадает | подходит | подходят | OK | высокий деловой корпус с рядами окон и оборудованием на кровле |
| 528 | Minecraft Build Book House | residential | совпадает | подходит | подходят | OK | земельный участок с двухэтажным домом и большим бассейном, жильё видно |
| 529 | Minecraft Casino Mansion Structure | commercial | совпадает | **не подходит**→commercial | подходят | РАСХОЖДЕНИЕ | крупное здание с гигантским колесом на кровле — это казино, а не жилой дом |
| 530 | Minecraft Gas Station Build | commercial | совпадает | подходит | подходят | OK | красное здание и отдельный навес на столбах, характерный для заправки |
| 531 | Minecraft Hospital Building | public | совпадает | подходит | подходят | OK | высотный корпус со стеклом и плоской синей кровлей под вертолётную площадку |
| 532 | Minecraft Railway Station | transport | частично | подходит | подходят | мелочь | низкое серое здание с красными блоками, рельсов и платформы не видно |
| 533 | Minecraft Soccer Stadium Schematic | public | совпадает | подходит | подходят | OK | стадион с зелёным полем, трибунами и фигурками игроков на площадке |
| 534 | Minecraftia Elementary School Blue and White Campus | public | совпадает | подходит | подходят | OK | крупный сине-белый учебный корпус с внутренним двором и двумя крыльями |
| 535 | Mini Shop Blockhouse | commercial | совпадает | **не подходит**→commercial | лишние (-house) | РАСХОЖДЕНИЕ | крохотная будка с прилавком — это ларёк, а не жилой дом |
| 536 | Modern 3 Story Office Building | commercial | совпадает | **не подходит**→commercial | подходят | РАСХОЖДЕНИЕ | низкое трёхэтажное здание с террасой на кровле, к башням не относится |
| 537 | Modern Apartment Block Townhouse | residential | совпадает | подходит | подходят | OK | два корпуса с балконами и зелёными кровлями-садами, жилой комплекс |
| 538 | Modern Apartment Block &#8211; White Concrete | residential | совпадает | подходит | подходят | OK | серо-белый жилой дом с балконами и глухим торцом, всё сходится |
| 539 | Modern Apartment Tower &#8211; White &amp; Blue Concrete | towers | совпадает | подходит | подходят | OK | семиэтажка с выносными балконами и остеклёнными проходами, читается |
| 540 | Modern Apartment Complex | residential | совпадает | подходит | подходят | OK | три длинных пятиэтажных дома в ряд на общей площадке, комплекс виден |
| 541 | Modern Apartment Tower &#8211; 10 Floors | towers | совпадает | подходит | подходят | OK | стройная башня примерно на десять этажей с балконами по периметру |
| 542 | Modern Blue Apartment Building Schematic | residential | частично | подходит | подходят | мелочь | корпус в коричневой отделке, синими остеклены только балконы |
| 543 | Modern Blue Glass Tower | towers | частично | подходит | подходят | мелочь | башня с диагональными панелями: синее стекло соседствует с оранжевым |
| 544 | Modern Bridge Design | bridges | совпадает | подходит | подходят | OK | узкий настил между двух опор с рядами столбов-фонарей и синей полосой по центру |
| 545 | Modern Business Building | commercial | совпадает | **не подходит**→commercial | подходят | РАСХОЖДЕНИЕ | низкое остеклённое здание офисного вида, к транспорту отношения не имеет |
| 546 | Modern City Apartment Building | residential | частично | подходит | подходят | мелочь | крупный серый блок с рядами окон, щитом на фасаде и округлым объёмом на кровле |
| 547 | Modern City Apartments | residential | совпадает | подходит | подходят | OK | многоэтажка с белыми перекрытиями, глухим ядром и оборудованием на кровле |
| 548 | Modern City Connecting Bridge | bridges | совпадает | подходит | подходят | OK | подвесной мост с двумя пилонами и канатами над синей водой, читается |
| 549 | Modern City Hotel Building | towers | совпадает | подходит | подходят | OK | Высокая светлая гостиничная башня, читается отлично |
| 550 | Modern City Intersection Road | intersections | совпадает | подходит | подходят | OK | Ровный дорожный крест на зелёном газоне, читается |
| 551 | Modern City Skyscraper | towers | частично | подходит | лишние (-tall -tower) | мелочь | Среднеэтажный серый квартал, на небоскрёб не тянет |
| 552 | Modern Coffee Shop | commercial | совпадает | подходит | подходят | OK | Компактная современная кофейня с террасами, читается |
| 553 | Modern Concrete Park | parks | частично | подходит | подходят | мелочь | Только белые скамьи без зелени и дорожек |
| 554 | Modern Cyan Terracotta House | industrial | не совпадает | **не подходит**→industrial | лишние (-house -medium +large) | РАСХОЖДЕНИЕ | Длинные стеклянные теплицы, а не жилой дом |
| 555 | Modern Decorated Tower | towers | совпадает | подходит | подходят | OK | Стройная декорированная башня, фасад читается |
| 556 | Modern Diamond Skyscraper | towers | совпадает | подходит | подходят | OK | Высокая башня с ромбовидным фасадом, читается |
| 557 | Modern Eco Skyscraper | towers | совпадает | подходит | подходят | OK | Светлая высотка с красной крышей и озеленением |
| 558 | Modern Food Shop | commercial | совпадает | подходит | подходят | OK | Небольшой современный продуктовый магазин, читается |
| 559 | Modern Fountain Design | parks | совпадает | подходит | подходят | OK | Компактный синий фонтан на газоне, читается |
| 560 | Modern Four-Story Hotel | towers | совпадает | подходит | подходят | OK | Широкий четырёхэтажный отель буквой Г, читается |
| 561 | Modern Four Story Shopping Mall With Roads | commercial | частично | **не подходит**→commercial | лишние (-shop) | РАСХОЖДЕНИЕ | Глухая коричневая коробка без витрин, это здание а не дорога |
| 562 | Modern Gas Station And Shop | commercial | совпадает | подходит | подходят | OK | АЗС с магазином и разметкой парковки, читается |
| 563 | Modern Gas Station Exterior | commercial | совпадает | подходит | подходят | OK | Навес заправки с колонками и газоном, читается |
| 564 | Modern Gas Station &amp; Truck Stop | commercial | частично | подходит | лишние (-car) | мелочь | Огромная пустая плита, навес крошечный, машин нет |
| 565 | Modern Gas Station With Store | commercial | совпадает | подходит | подходят | OK | Большая АЗС с магазином и навесами, читается |
| 566 | Modern Glass Office Tower Building | towers | совпадает | подходит | подходят | OK | Стеклянная офисная башня-пирамида, читается |
| 567 | Modern Grand Fountain &#8211; Medium Garden | parks | совпадает | подходит | подходят | OK | Синяя фонтанная ротонда с колоннами, читается |
| 568 | Modern Hotel Building | towers | совпадает | подходит | подходят | OK | Стеклянный гостиничный корпус из блоков, читается |
| 569 | Modern House Design With Library | residential | частично | подходит | лишние (-library) | мелочь | Дома с бассейном, библиотека снаружи не видна |
| 570 | Modern Lakehouse Mansion | residential | совпадает | подходит | не хватает (+water) | мелочь | Особняк у воды с причалом, тег воды отсутствует |
| 571 | Modern Library Design | public | совпадает | подходит | подходят | OK | Длинный современный корпус библиотеки, читается |
| 572 | Modern Library House | residential | частично | подходит | лишние (-library) | мелочь | Плитный каркас без стен, дом и библиотека не читаются |
| 573 | Modern Luxury Residence | residential | совпадает | подходит | подходят | OK | Комплекс с красными крышами и бассейном, читается |
| 574 | Modern Office Building Sketch | commercial | совпадает | **не подходит**→commercial | подходят | РАСХОЖДЕНИЕ | Приземистый офис-куб, к башням не относится |
| 575 | Modern Office Tower Building | towers | совпадает | подходит | подходят | OK | Высокая красная офисная башня, читается |
| 576 | Modern Office Tower with Elevator | towers | частично | подходит | подходят | мелочь | Приземистый белый корпус, лифт и башня не читаются |
| 577 | Modern Office Tower | towers | совпадает | подходит | подходят | OK | Красный офисный корпус с лифтовой шахтой, читается |
| 578 | Modern Parallel Heights Hotel Building | commercial | частично | подходит | лишние (-hotel) | мелочь | Длинный белый корпус без признаков отеля |
| 579 | Modern Park with Fountain and Benches | parks | совпадает | подходит | подходят | OK | Уютный парк с фонтаном и скамейками, читается |
| 580 | Modern Parking Garage Structure | transport | совпадает | подходит | лишние (-park) | мелочь | Закрытый паркинг-бокс без зелени, тег парка лишний |
| 581 | Modern Police Station Building | public | совпадает | подходит | подходят | OK | Белый корпус полицейского участка, читается |
| 582 | Modern Police Station Design | public | совпадает | подходит | подходят | OK | Низкий серый комплекс участка, читается |
| 583 | Modern Quartz City Tower | towers | совпадает | подходит | подходят | OK | Белая кварцевая башня с красными окнами, читается |
| 584 | Modern Quartz House With Birch Accents | residential | совпадает | подходит | подходят | OK | Белый кварцевый дом с берёзовой отделкой, читается |
| 585 | Modern Quartz Reserve Bank | commercial | совпадает | подходит | подходят | OK | Представительный корпус банка с колоннами, читается |
| 586 | Modern Quartz Skyscraper Tower | towers | совпадает | подходит | подходят | OK | Светлая кварцевая высотка, читается |
| 587 | Modern School Building | public | совпадает | подходит | подходят | OK | Светло-голубое здание школы со двором, читается |
| 588 | Modern Skyscraper Build | towers | совпадает | подходит | лишние (-medium +large) | мелочь | Полосатая высотка, размер скорее большой а не средний |
| 589 | Modern Skyscraper Design | towers | совпадает | подходит | подходят | OK | средний офисный корпус с синими окнами на подиуме, читается |
| 590 | Modern Skyscraper Tower | towers | совпадает | подходит | лишние (-medium) | мелочь | игла-башня со шпилем высотой под 200 блоков; medium не подходит |
| 591 | Modern Skyscraper Tower | towers | совпадает | подходит | подходят | OK | ступенчатые стеклянные цилиндры группой, читается |
| 592 | Modern Skyscraper | towers | совпадает | подходит | подходят | OK | тёмный плиточный небоскрёб на подиуме, читается |
| 593 | Modern Small to Medium Futuristic House | residential | совпадает | подходит | лишние (-shop) | мелочь | плоскокрылый модерн-дом на газоне; витрин магазина нет |
| 594 | Modern Spiral Skyscraper | towers | совпадает | подходит | подходят | OK | красная спиральная башня-конус с белыми поясами, читается |
| 595 | Modern Style Shop | commercial | частично | подходит | лишние (-shop) | мелочь | пустая белая коробка без витрин и входа, читается слабо |
| 596 | Modern Style Tower Structure | towers | совпадает | подходит | подходят | OK | узкая красно-серая башня с сеткой окон, читается |
| 597 | Modern Torch Towers | towers | частично | подходит | лишние (-modern) | мелочь | факелы-скульптуры на скале с водой; modern натяжка |
| 598 | Modern Train Station Design | transport | частично | подходит | подходят | мелочь | арочный перронный зал без путей и платформ, читается слабо |
| 599 | Modern Villa With Survival Features | residential | совпадает | подходит | лишние (-tall +water) | мелочь | огромная усадьба сверху с бассейнами; высотности нет |
| 600 | Modern Warehouse with Iron Gate Details | industrial | совпадает | **не подходит**→industrial | лишние (-house) | РАСХОЖДЕНИЕ | длинный складской ангар; к жилью не относится |
| 601 | Modern White City Apartment Building | residential | совпадает | подходит | подходят | OK | белый квартирный блок с голубыми балконами, читается |
| 602 | Mr. Burns Small Structure | decor | совпадает | **не подходит**→decor | лишние (-shop) | РАСХОЖДЕНИЕ | статуя старика в костюме, Симпсоны; не коммерция |
| 603 | Mud Tower Build | towers | совпадает | подходит | подходят | OK | коричневая башенка с каменным верхом, читается |
| 604 | Multi-Level 6-Story Parking Lot | transport | совпадает | подходит | лишние (-park) | мелочь | серая многоэтажка-паркинг; парка-сквера нет |
| 605 | Multi-Level Parking Garage Structure | transport | совпадает | подходит | лишние (-park) | мелочь | огромный серый паркинг-короб; парка-сквера нет |
| 606 | Multiplayer Survival Base with Shop | residential | частично | **не подходит**→residential | лишние (-shop) | РАСХОЖДЕНИЕ | коричневый бункер-база без вывески; магазина не видно |
| 607 | Murchinson Modern Office Building With Helipad | towers | совпадает | подходит | подходят | OK | бледная офисная плита с вертолёткой на крыше, читается |
| 608 | Mystcraft-Inspired Library Structure | public | частично | подходит | лишние (-library) | мелочь | серая коробка с лестницей; библиотеки не читается |
| 609 | Mystical Church Structure | public | совпадает | подходит | подходят | OK | белый ажурный храм со шпилем и крестом, читается |
| 610 | Mythological Shopping Mall with Water Features | commercial | частично | подходит | подходят | мелочь | круглая тёмная шайба с синими куполами; вода не читается |
| 611 | Nierta Central Park Town Square | public | совпадает | подходит | не хватает (+fountain +water) | мелочь | плоская мощёная площадь с фонтаном в центре, читается |
| 612 | Nine-Story Apartment Building Series | residential | совпадает | подходит | подходят | OK | серая девятиэтажка-пластина с балконами, читается |
| 613 | Nordic Style Small Bridge | bridges | совпадает | подходит | лишние (-shop) | мелочь | снежный мостик над водой; shop лишний |
| 614 | Octagonal Hotel Interior Design | commercial | частично | **не подходит**→commercial | лишние (-tall) | РАСХОЖДЕНИЕ | плоская деревянная восьмигранка; не башня и не высотка |
| 615 | Old Church Structure | public | совпадает | подходит | лишние (-medium +tiny) | мелочь | крошечная часовня на большом участке; medium не подходит |
| 616 | Old Factory Hall Building | industrial | совпадает | подходит | подходят | OK | красно-серый цех с пилой крышей, читается |
| 617 | OlimpusHD Tower &#8211; Large Build | towers | частично | подходит | подходят | мелочь | низкий офисный блок плитой; на башню тянет слабо |
| 618 | Olympus Tower &#8211; Large Build | towers | совпадает | подходит | подходят | OK | дерево-стеклянная башня с парящим навесом, читается |
| 619 | One World Trade Centre Skyscraper | towers | совпадает | подходит | подходят | OK | красно-серая клиновидная высотка в духе WTC, читается |
| 620 | Orange Tower &#8211; Large Scale Block Structure | decor | не совпадает | **не подходит**→decor | лишние (-tower) | РАСХОЖДЕНИЕ | пиксель-фигурка человечка; ни башня, ни масштаб |
| 621 | Orbital Station | transport | совпадает | подходит | подходят | OK | орбитальная станция с солнечными панелями, читается |
| 622 | Ornamental Garden Fountain | parks | совпадает | подходит | подходят | OK | бело-синий ажурный фонтан на мощёной плазе, читается |
| 623 | Peaceful Fountain | parks | частично | подходит | не хватает (+park +tree) | мелочь | разросшийся остров-парк с деревьями и фонтанами, шире имени |
| 624 | Peaceful Minecraft Garden Oasis Build | parks | частично | подходит | не хватает (+water +tree) | мелочь | ландшафт с рекой и лагерем; сада как постройки нет |
| 625 | Pet Shop Building | commercial | совпадает | подходит | подходят | OK | малый павильон-ларёк с красной лестницей, читается |
| 626 | Platinum Residential Tower with Antenna | towers | совпадает | подходит | подходят | OK | высоченная жилая башня со шпилем в духе Эмпайр, читается |
| 627 | Police Car Vehicle | vehicles | совпадает | **не подходит**→vehicles | подходят | РАСХОЖДЕНИЕ | полицейский седан вид сверху; не общественное здание |
| 628 | Police Vehicle | vehicles | частично | **не подходит**→vehicles | подходят | РАСХОЖДЕНИЕ | крошечная угловатая машинка; полиция не читается |
| 629 | Portuguese Style House | residential | совпадает | подходит | подходят | OK | белый дом с красной крышей и террасами, читается |
| 630 | Prismarine Island Tower | towers | совпадает | подходит | подходят | OK | бело-красная островная башня, читается |
| 631 | Quad Steam Turbine Warehouse | industrial | совпадает | **не подходит**→industrial | лишние (-house) | РАСХОЖДЕНИЕ | длинные серые цеха, к жилым домам не относится |
| 632 | Quaint Library Structure | public | частично | подходит | лишние (-library -tall) | мелочь | плоская коричневая коробка на подложке, библиотеки не видно |
| 633 | Quartz Pool Garden Feature | parks | совпадает | подходит | подходят | OK | кварцевый бассейн с колоннами на газоне, читается |
| 634 | Quartz Spruce Small House | residential | совпадает | подходит | лишние (-shop -tree) | мелочь | современный серый дом, магазина и дерева не видно |
| 635 | QuickDeli Cargo Services Warehouse and Office | industrial | совпадает | **не подходит**→industrial | лишние (-house -car) | РАСХОЖДЕНИЕ | огромный складской комплекс, башней не является |
| 636 | Railway Station Building | transport | совпадает | подходит | подходят | OK | красно-белое здание с колоннами, похоже на вокзал |
| 637 | Rainbow Lighthouse | towers | частично | **не подходит**→towers | лишние (-house) | РАСХОЖДЕНИЕ | тонкий столб без радуги и воды, на дом не тянет |
| 638 | Red Bureaucratic Office Building | towers | частично | подходит | подходят | мелочь | стеклянный офис, красного цвета почти нет |
| 639 | Renaissance Church Structure | public | совпадает | подходит | подходят | OK | бежевая церковь с круглой апсидой, читается |
| 640 | River Crossing Bridge | bridges | совпадает | подходит | подходят | OK | длинный мост из сегментов, читается |
| 641 | Rivertown Library Structure | public | совпадает | подходит | подходят | OK | тёмное здание со сложной крышей, похоже на библиотеку |
| 642 | Rustic Cottage House | residential | частично | подходит | подходят | мелочь | ступенчатая коричневая крыша с водой, коттедж с натяжкой |
| 643 | Rustic Furnished Wooden House | residential | совпадает | подходит | подходят | OK | деревянный дом с прудом во дворе, читается |
| 644 | Rustic Modern House with Pool and Barn | residential | совпадает | подходит | подходят | OK | деревянный дом с бассейном во дворе, читается |
| 645 | Rustic Stone Bridge | bridges | совпадает | подходит | подходят | OK | каменный мостик через воду с фонарями, читается |
| 646 | Rustic Wood Tower Build | towers | совпадает | подходит | подходят | OK | высокая деревянная башня, читается |
| 647 | Rustic Wooden Shop &#8211; Medium Size | commercial | совпадает | подходит | подходят | OK | большая деревянная лавка с навесами, читается |
| 648 | Sam and Taurtis&#8217; Roleplay House | residential | частично | подходит | подходят | мелочь | узкая голубая коробка с крышей, очень простенько |
| 649 | Sand Palace Station | transport | совпадает | подходит | лишние (-tall) | мелочь | огромный станционный комплекс у воды, высоты нет |
| 650 | Sandstone Hotel | towers | совпадает | подходит | подходят | OK | песочный отель со щипцовыми крышами, читается |
| 651 | Sandstone Office Tower &#8211; 126k Blocks | towers | совпадает | подходит | подходят | OK | коричневая офисная башня, читается |
| 652 | Scalable Long Bridge | bridges | совпадает | подходит | подходят | OK | вантовый мост на высоких опорах, читается |
| 653 | Seaside Lighthouse Tower | towers | совпадает | подходит | подходят | OK | маяк на скале в воде, читается |
| 654 | Seaside Multi-Story House | residential | совпадает | подходит | подходят | OK | большой многоэтажный дом у воды, читается |
| 655 | Secluded Cove House With Shops | residential | совпадает | подходит | лишние (-tall) | мелочь | огромная бухта с постройками, высоты почти нет |
| 656 | Shady Oaks Hotel Townhouse | commercial | частично | подходит | лишние (-hotel -tree) | мелочь | красный дом-сарай с забором, отеля и дубов не видно |
| 657 | Shard Tower &#8211; Tall Unfurnished Structure | towers | совпадает | подходит | подходят | OK | красная острая башня, читается |
| 658 | Shop House Building | commercial | частично | **не подходит**→commercial | лишние (-house -small) | РАСХОЖДЕНИЕ | красный офисный блок, на жилой дом не похож |
| 659 | Shop House for Sale | commercial | частично | **не подходит**→commercial | лишние (-house -small) | РАСХОЖДЕНИЕ | светлый торговый бокс, жилой дом не читается |
| 660 | Shop or House Design | residential | совпадает | подходит | подходят | OK | маленький дом с лестницей, читается |
| 661 | Simple Defense Tower | towers | совпадает | подходит | подходят | OK | серая зубчатая башенка, читается |
| 662 | Simple Factory Shed | industrial | совпадает | подходит | подходят | OK | простой цех-ангар под крышей, читается |
| 663 | Simple Minecraft Church Building | public | совпадает | подходит | подходят | OK | серая церковь с коричневыми крышами, читается |
| 664 | Simple Small House | residential | частично | подходит | лишние (-shop -tall) | мелочь | коричневый кубик на подложке, простенько и без магазина |
| 665 | Simple Stone Bridge | bridges | совпадает | подходит | лишние (-tiny +small) | мелочь | длинный каменный мост, на крошечный не тянет |
| 666 | Simple Stone River Bridge | bridges | совпадает | подходит | подходят | OK | каменный мост с жёлтыми блоками, читается |
| 667 | Simple Train Station | transport | частично | подходит | лишние (-station) | РАСХОЖДЕНИЕ | серая коробка без признаков станции |
| 668 | Simple Yellow House | residential | частично | подходит | подходят | мелочь | деревянный домик, жёлтого почти нет |
| 669 | Six Lane Highway | roads | совпадает | подходит | подходят | OK | две красные полосы с разметкой и серыми бордюрами, шоссе читается |
| 670 | Six Story Hotel With Furnished Rooms | towers | частично | подходит | подходят | мелочь | бежевый корпус с балконами и тёмной крышей, этажей меньше шести |
| 671 | Six Story Parking Garage | transport | совпадает | подходит | лишние (-park) | мелочь | серая многоярусная парковка с разметкой, зелени нет |
| 672 | Skyscraper City Building | towers | совпадает | подходит | подходят | OK | высокая светло-голубая башня со шпилем в духе эмпайр-стейт |
| 673 | Iron Quartz Skyscraper Near Build Limit | towers | частично | подходит | лишние (-medium +huge) | мелочь | неестественно тонкий белый столб до неба, ширина не читается |
| 674 | Small Apartment Building | residential | совпадает | подходит | лишние (-shop) | мелочь | круглый дом с балконами и лоджиями, витрин нет |
| 675 | Small Asian Style House | residential | частично | подходит | лишние (-shop) | мелочь | ступенчатая серая крыша пагоды на голубой плите, стен нет |
| 676 | Small Carwash Station | commercial | частично | подходит | лишние (-car -shop) | мелочь | стеклянный павильон с коричневыми проёмами, машин и мойки нет |
| 677 | Small Chapel Structure | public | совпадает | **не подходит**→public | лишние (-shop) | РАСХОЖДЕНИЕ | серый замок-часовня с жёлтыми окнами, не торговля |
| 678 | Small Church | public | частично | **не подходит**→public | лишние (-shop -medium) | РАСХОЖДЕНИЕ | серая башня со мхом и рваным верхом, церковность не читается |
| 679 | Small Concrete Bus Stop Schematic | transport | совпадает | **не подходит**→transport | не хватает (+station -shop) | РАСХОЖДЕНИЕ | длинный бетонный навес с лавками, остановка читается |
| 680 | Small Desert Cactus Fountain | parks | частично | **не подходит**→parks | лишние (-shop) | РАСХОЖДЕНИЕ | каменный фонтан с водой, кактуса не видно; не торговля |
| 681 | Small Double Modern Church With Interior | public | частично | **не подходит**→public | лишние (-shop -large -tall) | РАСХОЖДЕНИЕ | два крошечных серых домика в поле, церквей не видно |
| 682 | Small Driving School | commercial | совпадает | подходит | лишние (-shop) | мелочь | овальный трек с трибунами и корпусами, школа вождения читается |
| 683 | Small Faction Base for Hardcore Players | residential | совпадает | **не подходит**→residential | лишние (-shop) | РАСХОЖДЕНИЕ | стена-компаунд с водой внутри, база клана, не магазин |
| 684 | Small Factory Shell Template | industrial | совпадает | **не подходит**→industrial | лишние (-shop) | РАСХОЖДЕНИЕ | красно-коричневый цех-коробка, промышленное, не торговля |
| 685 | Small Fancy Wooden House | residential | совпадает | подходит | лишние (-shop) | мелочь | угловой коричневый сруб со светящимися окнами, уютный |
| 686 | Small Garden Fountain | parks | совпадает | **не подходит**→parks | лишние (-shop) | РАСХОЖДЕНИЕ | квадратный фонтан-беседка с водой, садовый, не торговля |
| 687 | Small House with Garden Path | residential | частично | подходит | лишние (-shop) | мелочь | дом с двором на крыше земляного куба с подвалом |
| 688 | Small Minecraft Church Building | public | совпадает | **не подходит**→public | лишние (-shop) | РАСХОЖДЕНИЕ | белая часовня с крестом и голубыми окнами, не торговля |
| 689 | Small Miscellaneous Structure | commercial | не совпадает | подходит | лишние (-road -shop) | РАСХОЖДЕНИЕ | гигантский скальный комплекс с дворами, ни разу не small |
| 690 | Small Office Building | towers | частично | подходит | лишние (-shop) | мелочь | вид сверху на коричневую коробку, высота 256 не читается |
| 691 | Small Open Cafe Design | commercial | частично | подходит | лишние (-shop) | мелочь | вид сверху на павильон со стеклом, кафе не подтверждается |
| 692 | Small Police Car Schematic | vehicles | совпадает | **не подходит**→vehicles | лишние (-shop) | РАСХОЖДЕНИЕ | бело-серый патрульный автомобиль, не торговое здание |
| 693 | Small Schoolhouse With Blackboard | public | частично | **не подходит**→public | лишние (-shop) | РАСХОЖДЕНИЕ | коричневая коробка со стеклянной крышей, доски не видно |
| 694 | Small Shop Building | public | не совпадает | **не подходит**→public | лишние (-shop) | РАСХОЖДЕНИЕ | каменное здание с белым шпилем — церковь, а не магазин |
| 695 | Small Shopping Mall | commercial | совпадает | подходит | подходят | OK | крестообразный павильон с колоннадой и светлой крышей |
| 696 | Small Skybridge Design | bridges | частично | подходит | лишние (-shop) | мелочь | низкие каменные пролёты над водой, не skybridge |
| 697 | Small Spade Shop | commercial | частично | подходит | лишние (-shop) | мелочь | земляной куб с освещённым интерьером, лопаты и лавки нет |
| 698 | Small Terracotta Vase Decoration | decor | совпадает | **не подходит**→decor | лишние (-shop) | РАСХОЖДЕНИЕ | коричневый терракотовый кувшин с орнаментом, декор |
| 699 | Small Underground Faction Shop | commercial | частично | подходит | лишние (-shop) | мелочь | плоская серая крыша, подземелье скрыто, лавки не видно |
| 700 | Small Waterfront House | residential | совпадает | подходит | не хватает (+water -shop) | мелочь | деревянный домик-причал на синей воде со сваями |
| 701 | Small Wooden Shop with Multiple Entrances | commercial | частично | подходит | лишние (-shop) | мелочь | светлый крест-павильон, дерево и входы не читаются |
| 702 | Soviet Style Apartment Building | residential | совпадает | подходит | подходят | OK | серая блочная пятиэтажка с плоской крышей, узнаваемо |
| 703 | Spacious Mansion With Park | residential | совпадает | подходит | подходят | OK | особняк с садом, прудом и аллеями, парк читается |
| 704 | Spawn Fountain Garden | parks | частично | подходит | лишние (-park) | мелочь | серая площадь с мелким фонтаном, зелени и сада нет |
| 705 | St. Pancras Old Church Exterior Replica | public | совпадает | подходит | подходят | OK | длинная церковь с коричневой крышей и башней, реплика читается |
| 706 | Standard Railroad Station | transport | частично | **не подходит**→transport | лишние (-road) | РАСХОЖДЕНИЕ | красный сарай с серой крышей, рельсов не видно |
| 707 | Stone and Wood Survival Bridge | bridges | совпадает | подходит | подходят | OK | ледяной мост с деревянными вставками через пролёт |
| 708 | Stone Church Building | public | совпадает | подходит | подходят | OK | белый двухбашенный храм с тёмными окнами, крупный |
| 709 | Storage Warehouse Building | industrial | совпадает | **не подходит**→industrial | лишние (-house) | РАСХОЖДЕНИЕ | длинный складской ангар со светлой крышей; к жилью не относится |
| 710 | Storage Warehouse Structure | industrial | совпадает | **не подходит**→industrial | лишние (-house) | РАСХОЖДЕНИЕ | тёмный складской корпус с фонарями в крыше; жилой тег лишний |
| 711 | Subway Tunnel Structure | transport | совпадает | **не подходит**→transport | подходят | РАСХОЖДЕНИЕ | короткий серый тоннельный сегмент с путями; это не мост |
| 712 | Survival Mansion 2-Story Build | residential | частично | подходит | подходят | мелочь | коричневый двухэтажный домик; на особняк не тянет |
| 713 | Suspended Bridge Minecraft Build | bridges | совпадает | подходит | подходят | OK | маленький мост через воду с опорами; читается |
| 714 | Suspension Cable Bridge | bridges | совпадает | подходит | подходят | OK | длинный каменный мост с фонарями; читается |
| 715 | Tails&#8217; Workshop Recreation | commercial | совпадает | подходит | подходят | мелочь | компактная коричневая мастерская; герой Соника, франшиза |
| 716 | Tall Orange Quartz Apartment Building | residential | частично | подходит | подходят | мелочь | высокий светлый квартирный блок; оранжевого почти не видно |
| 717 | Technoblade Tribute Parkour Build | decor | частично | **не подходит**→decor | лишние (-park -tall) | РАСХОЖДЕНИЕ | фигура свиньи-трибьют и купол; парка и паркура не видно |
| 718 | Ten Story Apartment Building | residential | совпадает | подходит | подходят | OK | тёмный десятиэтажный квартирный корпус; читается |
| 719 | The Hidden Library From The Book | public | совпадает | подходит | подходят | OK | маленькая деревянная диорама-библиотека; читается |
| 720 | Tilted Office Building | commercial | частично | **не подходит**→commercial | лишние (-tall) | РАСХОЖДЕНИЕ | длинный красный ступенчатый офис; невысокий, не башня |
| 721 | TNT Museum | public | частично | подходит | лишние (-museum) | мелочь | серый куб на грунтовой платформе; музей не читается |
| 722 | Town Parking Lot | transport | частично | подходит | лишние (-park) | мелочь | серая плита на столбах без разметки; озеленения нет |
| 723 | Towny Road System &#8211; Cobblestone Construction | roads | совпадает | подходит | подходят | OK | кольцевая брусчатая развязка с газонами; читается |
| 724 | Traditional Brick Home With Garage | residential | совпадает | **не подходит**→residential | подходят | РАСХОЖДЕНИЕ | кирпичный дом с гаражом и участком; не коммерция |
| 725 | Traditional British Pub Building | commercial | совпадает | подходит | подходят | OK | маленький паб с timber-фахверком и тёплыми окнами |
| 726 | Trainyard Automatic Refill Station | transport | совпадает | подходит | подходят | OK | индустриальный корпус депо с красными воротами; читается |
| 727 | Tropical Mine and Shop | commercial | частично | подходит | подходят | мелочь | серая коробка магазина с зеленью; шахты не видно |
| 728 | Truck Stop Gas Station | commercial | совпадает | подходит | лишние (-car) | мелочь | длинная полоса заправки для фур; машин не видно |
| 729 | Two Story House With Attic And Balcony | residential | совпадает | подходит | подходят | OK | коричневый дом с мансардой и жёлтыми балконами; читается |
| 730 | Two Story Warehouse With Parking | industrial | совпадает | **не подходит**→industrial | лишние (-house -park) | РАСХОЖДЕНИЕ | склад с большой парковкой; дом и парк лишние |
| 731 | Underground Metro Station Design | transport | частично | подходит | лишние (-station) | мелочь | глухой серый блок; станция не читается |
| 732 | Underground Metro Station With Blue Train | transport | совпадает | подходит | подходят | OK | станция в разрезе с поездом; читается |
| 733 | Unfurnished Office Building Structure | towers | совпадает | подходит | подходят | OK | серая ар-деко офисная башня; читается |
| 734 | Urban Compressed Air Factory | industrial | совпадает | подходит | подходят | OK | длинный ажурный цех со стеклянной крышей; читается |
| 735 | Large Urban Warehouse Storage Building | industrial | совпадает | **не подходит**→industrial | лишние (-house) | РАСХОЖДЕНИЕ | длинный склад с коричневой крышей; не жильё |
| 736 | Vehicle Warehouse Storage | industrial | совпадает | **не подходит**→industrial | лишние (-house) | РАСХОЖДЕНИЕ | большой серый склад-ангар; техники внутри не видно |
| 737 | Vibrant Yellow Modern Apartment Building | residential | частично | подходит | подходят | мелочь | малый модерн-блок с балконами; жёлтого почти нет |
| 738 | Vienna Street House 65 Build | residential | совпадает | **не подходит**→residential | лишние (-road -tree) | РАСХОЖДЕНИЕ | высокий бежевый таунхаус; дороги и дерева нет |
| 739 | Vienna Street House 66 | residential | совпадает | **не подходит**→residential | лишние (-road -tree) | РАСХОЖДЕНИЕ | красный высокий таунхаус; дороги и дерева нет |
| 740 | Vienna Street House 68 | residential | совпадает | **не подходит**→residential | лишние (-road -tree) | РАСХОЖДЕНИЕ | коричневый высокий таунхаус; дороги и дерева нет |
| 741 | Vienna Street House 70 Build | residential | совпадает | **не подходит**→residential | лишние (-road -tree) | РАСХОЖДЕНИЕ | бело-коричневый таунхаус; дороги и дерева нет |
| 742 | Vienna Street House 71 | industrial | не совпадает | **не подходит**→industrial | лишние (-house -road -tree) | РАСХОЖДЕНИЕ | фабричный корпус с трубами, а не дом; к дорогам не относится |
| 743 | Vienna Street House 73 | residential | совпадает | **не подходит**→residential | лишние (-road -tree) | РАСХОЖДЕНИЕ | коричневый таунхаус с эркерами; дороги и дерева нет |
| 744 | Vienna Street House 74 | residential | совпадает | **не подходит**→residential | лишние (-road -tree) | РАСХОЖДЕНИЕ | коричневый таунхаус на углу; дороги и дерева нет |
| 745 | Vienna Street House With Jungle Planks | residential | совпадает | **не подходит**→residential | лишние (-road -tree) | РАСХОЖДЕНИЕ | серо-коричневый таунхаус; дороги и дерева нет |
| 746 | Vintage Train Station Building | transport | совпадает | подходит | подходят | OK | малый вокзал с белой крышей и перроном; читается |
| 747 | Warehouse 13 Storage Building | industrial | совпадает | **не подходит**→industrial | лишние (-house) | РАСХОЖДЕНИЕ | огромный склад со стеклянной крышей; не жильё |
| 748 | Warehouse With Movie Sets | industrial | частично | **не подходит**→industrial | лишние (-house) | РАСХОЖДЕНИЕ | белые студийные ангары; декорации почти не читаются |
| 749 | Water Wall Skyscraper | towers | совпадает | подходит | подходят | OK | синий монолит-башня с решёткой на крыше, читается |
| 750 | Western Train Station Structure | transport | совпадает | подходит | подходят | OK | низкая платформа-навес станции, читается |
| 751 | Wii Island Hotel | commercial | совпадает | подходит | подходят | OK | серый гостиничный корпус с бассейном и пляжем, читается |
| 752 | Willis Tower Overhaul Schematic | towers | совпадает | подходит | подходят | OK | ступенчатая кирпичная башня с антеннами, читается |
| 753 | Willis Tower Skyscraper Build | towers | совпадает | подходит | подходят | OK | красная высотка со шпилями, читается |
| 754 | Wooden Bridge Design | bridges | совпадает | подходит | подходят | OK | длинный деревянный мост через воду, читается |
| 755 | Wooden Bridge with Fences | bridges | совпадает | подходит | подходят | OK | деревянный мостик с ограждением на траве, читается |
| 756 | Working Lighthouse Tower | towers | совпадает | подходит | лишние (-house -water) | мелочь | серая маячная башня без домика и воды рядом |
| 757 | World Relics Museum Build | public | совпадает | подходит | подходят | OK | парадный музейный корпус с внутренним двором, читается |
| 758 | Yandere High School Electric Chair Room | public | частично | подходит | лишние (-school) | мелочь | серая коробка комнаты, стул не виден; школьного не заметно |
| 759 | Yeti&#8217;s Alpine Shop | towers | не совпадает | **не подходит**→towers | лишние (-shop) | РАСХОЖДЕНИЕ | высокая коричневая башня вместо магазина, к торговле не относится |
| 760 | Yin Yang Garden Fountain | parks | совпадает | подходит | подходят | OK | синяя чаша фонтана в виде инь-ян, читается |
| 761 | Youcube Office Structure | towers | совпадает | подходит | подходят | OK | серый офисный корпус с красной буквой, читается |
| 762 | Zambia&#8217;s Tallest Skyscraper &#8211; Findeco House | towers | совпадает | подходит | лишние (-house) | мелочь | полосатая высотка с нижним корпусом, домика рядом нет |
| 763 | High Security Jail (default map) | public | совпадает | подходит | подходят | OK | огороженный стенами тюремный комплекс, читается |
| 764 | Modern house N2 | residential | совпадает | подходит | подходят | OK | модерновый дом на сваях с террасой, читается |
| 765 | Radeon prison | public | совпадает | подходит | подходят | OK | тёмный блочный корпус тюрьмы с решётками, читается |
| 766 | Magenta Storage Container | decor | частично | подходит | подходят | мелочь | серый грузовой контейнер, пурпурного цвета не видно |
| 767 | Blue Container Outdoor Decoration | decor | совпадает | подходит | подходят | OK | сине-белый грузовой контейнер, читается |
| 768 | Pink Container Decoration | decor | частично | подходит | подходят | мелочь | серый контейнер, розового цвета не видно |
| 769 | Modern City Stoplight | intersections | частично | подходит | лишние (-modern) | мелочь | серый столб-сигнал, головка светофора не читается |
| 770 | Automatic Ice Boat Crossing | waterfront | совпадает | подходит | лишние (-boat) | мелочь | ажурная ледяная трасса-переправа, лодки в кадре нет |
| 771 | Off-Road 6×6 Tanker Truck | vehicles | частично | **не подходит**→vehicles | лишние (-road) | РАСХОЖДЕНИЕ | разрозненные детали танкера-грузовика, дороги рядом нет |
| 772 | Toll Booth Structure | roads | совпадает | **не подходит**→roads | не хватает (+road) | РАСХОЖДЕНИЕ | длинное шоссе с будками проезда, к жилью не относится |
| 773 | Street Cleaning Tanker Truck | vehicles | совпадает | **не подходит**→vehicles | лишние (-road -tree) | РАСХОЖДЕНИЕ | цистерна-грузовик, дороги и дерева рядом нет |
| 774 | Street Lantern | roads | совпадает | подходит | лишние (-road -tree) | мелочь | малый уличный фонарь-столб, дороги и дерева нет |
| 775 | Fallout 3 Billboard Structure | decor | совпадает | подходит | подходят | мелочь | коричневый щит билборда, читается; отсылка к франшизе |
| 776 | Garbage Truck with Front Loader | vehicles | частично | подходит | подходят | мелочь | разрозненные детали мусоровоза, читается с натяжкой |
| 777 | Bedwars Bed Defence Structure | decor | совпадает | **не подходит**→decor | подходят | РАСХОЖДЕНИЕ | синее ступенчатое укрепление из блоков, к общественным не относится |
| 778 | Large Advertisement Billboard Structure | decor | частично | подходит | подходят | мелочь | голый ферменный каркас щита без рекламного полотна |
| 779 | Japanese Garbage Compactor Structure | industrial | частично | **не подходит**→industrial | подходят | РАСХОЖДЕНИЕ | россыпь блоков пресса, на машину не похоже; ближе к цеху |
| 780 | Industrial Warehouse Fence and Gate | industrial | совпадает | подходит | лишние (-house) | мелочь | длинный складской забор, домика рядом нет |
| 781 | Meme Billboard Advertisement | decor | совпадает | подходит | подходят | OK | серый щит билборда на фермах, читается |
| 782 | Automatic Trashcan Build | public | совпадает | подходит | подходят | OK | красно-белая урна-мусорка, читается |
| 783 | Fence Totem Structure | decor | совпадает | подходит | подходят | OK | крестообразный тотем из заборов, читается |
| 784 | 1994 Nissan Dump Truck Vehicle | vehicles | совпадает | подходит | подходят | OK | бортовой самосвал с кабиной, читается |
| 785 | Super Motorcycle Design | decor | совпадает | **не подходит**→decor | не хватает (-medium +huge) | РАСХОЖДЕНИЕ | плоский пиксель-арт мотоцикла на огромном полотне, не модель |
| 786 | Tow Truck Semi-Trailer | vehicles | совпадает | подходит | подходят | OK | шасси эвакуатора с кабиной, читается |
| 787 | Aluminum Van Truck 6×6 | vehicles | частично | подходит | подходят | мелочь | детали фургона-грузовика разрознены, читается с натяжкой |
| 788 | Industrial Iron Car Vehicle | vehicles | совпадает | подходит | подходят | OK | белый угловатый автомобильчик, читается |
| 789 | 1995 Isuzu Forward Crane Truck | vehicles | совпадает | подходит | подходят | OK | серое шасси грузовика с краном и жёлтыми колёсами |
| 790 | Ten-Wheeler Crane Tow Truck | vehicles | совпадает | подходит | подходят | OK | шасси эвакуатора с краном, кабина и колёса читаются |
| 791 | Fuso Fighter Wing Van Truck | vehicles | совпадает | подходит | подходят | OK | длинное шасси фургона с красной кабиной, читается |
| 792 | Car Carrier Truck and Trailer | vehicles | совпадает | подходит | подходят | OK | длинный пустой автовоз-прицеп, читается |
| 793 | 1998 Isuzu Freezer Truck | vehicles | совпадает | подходит | подходят | OK | кабина рефрижератора с длинной рамой, читается |
| 794 | Heavy Duty Ambulance Vehicle | vehicles | совпадает | подходит | не хватает (+car) | мелочь | фургон скорой с красными крестами; не хватает тега car |
| 795 | Japanese Van with 8 Wheels | vehicles | совпадает | подходит | подходят | OK | длинное шасси фургона на восьми колёсах, читается |
| 796 | Fuso Fighter Dump Truck Vehicle | vehicles | совпадает | подходит | подходят | OK | серый самосвал с жёлтыми фарами, читается |
| 797 | Fire Truck with Manlift | vehicles | совпадает | подходит | подходят | OK | пожарная машина с люлькой-подъёмником, читается |
| 798 | Decorated 10W Truck Van | vehicles | совпадает | подходит | подходят | OK | длинный голубой фургон на шасси, читается |
| 799 | Crane Truck with Car Carrier | vehicles | совпадает | подходит | подходят | OK | грузовик с краном и площадкой автовоза, читается |
| 800 | Fuso FV411J Dump Truck Model | vehicles | совпадает | подходит | подходят | OK | бело-серый самосвал, кузов и кабина читаются |
| 801 | Decorated 12-Wheel Refrigerated Van | vehicles | совпадает | подходит | подходят | OK | длинный прицеп-рефрижератор на колёсах, читается |
| 802 | Frog Driving a Car | decor | частично | **не подходит**→decor | подходят | РАСХОЖДЕНИЕ | плоский пиксельный лягушонок, а не объёмная машина; пиксель-арт |
| 803 | Fuso Fighter Cargo Truck Detailed Build | vehicles | совпадает | подходит | подходят | OK | грузовой фургон с кабиной, читается |
| 804 | Decorated Japanese Refrigerated Van | vehicles | совпадает | подходит | подходят | OK | рамный прицеп-рефрижератор, читается |
| 805 | Fallout 3 Inspired Car Schematic | vehicles | совпадает | подходит | подходят | мелочь | ржавая легковушка в духе Fallout, читается; франшиза |
| 806 | Tractor With Cometto Trailer | vehicles | совпадает | подходит | не хватает (+car) | мелочь | очень длинный трал с тягачом; не хватает тега car |
| 807 | Decorated Refrigerated Van | vehicles | совпадает | подходит | подходят | OK | белый фургон-рефрижератор, читается |
| 808 | Fallout 3 Style Car (No Engine) | vehicles | совпадает | подходит | подходят | мелочь | разбитая легковушка без двигателя в духе Fallout; франшиза |
| 809 | Aluminum Wing Van Truck with Solar Radiator | vehicles | совпадает | подходит | подходят | OK | белый фургон с красной полосой, читается |
| 810 | Fallout 3 Car Replica | vehicles | совпадает | подходит | подходят | мелочь | серая легковушка-реплика в духе Fallout; франшиза |
| 811 | Cometto Self-Propelled Trailer | vehicles | совпадает | подходит | не хватает (+car) | мелочь | длинная многоосная платформа-трал; не хватает тега car |
| 812 | Secure Transport Van | vehicles | совпадает | подходит | подходят | OK | серый инкассаторский фургон, читается |
| 813 | Thomas and Friends Candy Car | vehicles | совпадает | подходит | подходят | мелочь | коричневый вагон в стиле Томаса и друзей; франшиза |
| 814 | Heavy Duty 14-Wheeler Dump Truck | vehicles | совпадает | подходит | подходят | OK | голубой самосвал, кузов и кабина читаются |
| 815 | Refrigerated Double-Cab Van | vehicles | совпадает | подходит | подходят | OK | маленькая кабина фургона на шасси, читается |
| 816 | Concrete Pump Truck with Derricks | vehicles | совпадает | подходит | подходят | OK | тёмный бетононасос на шасси, читается |
| 817 | 10-Wheeler Wing Van Truck and Trailer | vehicles | совпадает | подходит | подходят | OK | голубые фургон и прицеп парой, читаются |
| 818 | Sdkfz 222 Armored Car | vehicles | совпадает | подходит | подходят | OK | коричневый броневик на серой плите, читается |
| 819 | Heavy Crane Truck | vehicles | совпадает | подходит | не хватает (+large -small) | мелочь | очень длинный кран на шасси; тег small маловат, нужен large |
| 820 | Fruehauf Empty Can Van Trailer | vehicles | совпадает | подходит | подходят | OK | голубой пустой фургон-прицеп, читается |
| 821 | Armored Snow Patrol Truck | vehicles | совпадает | подходит | подходят | OK | детальный камуфляжный броневик, читается |
| 822 | 9 Block Long Van Box Truck Compartment | vehicles | совпадает | подходит | подходят | OK | голубой грузовой отсек без кабины, как заявлено |
| 823 | Small Car Dealership Building | commercial | совпадает | **не подходит**→commercial | лишние (-boat -car) | РАСХОЖДЕНИЕ | одноэтажный автосалон с витринами; это здание, а не машина |
| 824 | Heavy Tractor Head and Van Trailer | vehicles | совпадает | подходит | подходят | OK | тягач с голубым полуприцепом, читается |
| 825 | Double Cab Pickup Truck | vehicles | совпадает | подходит | подходят | OK | маленький голубой пикап с кузовом, читается |
| 826 | Massive Haul Truck | vehicles | совпадает | подходит | не хватает (+large +tall -medium) | мелочь | гигантский карьерный самосвал; тег medium маловат |
| 827 | Acacia & Spruce Small Aircraft Hangar | transport | совпадает | подходит | лишние (-shop -tree) | мелочь | деревянный ангар для самолёта; shop и tree на кадре не видны |
| 828 | Small Garden With Wither Platform | transport | совпадает | подходит | подходят | OK | сад с водоёмом, мостиками и тёмной платформой в центре, читается |
| 829 | Abandoned Town with Subway System | residential | частично | **не подходит**→residential | не хватает (+house +apartment) | РАСХОЖДЕНИЕ | квартал с серым корпусом и красными домиками; метро и заброшенности не видно |
| 830 | Minecraft Airport Terminal Building | transport | совпадает | подходит | подходят | OK | серый терминал с деревянным навесом и синими акцентами, читается |
| 831 | Fallout 3 Red Rocket Gas Station | transport | совпадает | подходит | подходят | мелочь | полуразрушенный бетонный каркас заправки в духе Fallout, читается |
| 832 | Aircraft Hangar Structure | transport | частично | подходит | подходят | мелочь | громадный гладкий ангар-коробка без деталей, читается с натяжкой |
| 833 | Small Village Train Station | transport | совпадает | подходит | лишние (-house -shop) | мелочь | перрон с деревянным навесом над путями; домика и лавки не видно |
| 834 | Subway Station Build | transport | совпадает | подходит | подходят | OK | компактный серый павильон-вход метро, читается |
| 835 | Minecraft Airport Terminal Build | transport | совпадает | подходит | подходят | OK | стеклянный зал терминала с телетрапами, читается |
| 836 | Modern Gas Station With Shop and Tankers | transport | совпадает | подходит | подходят | OK | широкие навесы АЗС с колонками на большой площадке, читается |
| 837 | Airfield and Barracks Structure | transport | совпадает | **не подходит**→transport | подходят | РАСХОЖДЕНИЕ | ряд арочных ангаров вдоль полосы; к общественным не относится |
| 838 | Wooden Platform for Ravines and Cliffs | transport | совпадает | подходит | подходят | OK | небольшой деревянный помост на сваях, читается |
| 839 | Small Gas Station With Custom Blocks | transport | совпадает | подходит | подходят | OK | красный киоск и плита навеса АЗС, читается |
| 840 | Obsidian Runway Build | transport | совпадает | подходит | подходят | OK | длинная тёмная полоса с огнями, читается |
| 841 | Long Cargo Platform | transport | частично | подходит | лишние (-car) | мелочь | крошечная плита из 26 блоков; ни длины, ни груза, ни машины |
| 842 | Modern Fueling Station | transport | совпадает | подходит | подходят | OK | здание заправки с парковкой и прудом, современное, читается |
| 843 | CastiaMC Lobby Platform Build | decor | не совпадает | **не подходит**→decor | подходят | РАСХОЖДЕНИЕ | парящее сердце-остров из блоков, а не лобби-платформа |
| 844 | 16×16 Plains Train Station | transport | совпадает | подходит | подходят | OK | перрон с навесом и рельсами в прерии, читается |
| 845 | Ancient Mayan Depot House | transport | совпадает | подходит | подходят | OK | ступенчатое депо в майяском духе, читается |
| 846 | Minecart Dropper Station | transport | частично | подходит | лишние (-car) | мелочь | серый механизм выгрузки вагонеток; на станцию тянет слабо |
| 847 | Modern Wi-Fi Station Tower | transport | совпадает | подходит | подходят | OK | красная мачта с тарелками и опорами, читается |
| 848 | Customs Station Building | transport | совпадает | подходит | подходят | OK | большой каменный корпус таможни под коричневой крышей, читается |
| 849 | Minecraft Fire Station and Football Field | public | частично | **не подходит**→public | подходят | РАСХОЖДЕНИЕ | редкие мелкие фрагменты на тёмной плите; пожарка не транспорт |
| 850 | Small Fishing Boat with Storage | waterfront | совпадает | подходит | лишние (-shop) | мелочь | рыбацкое судно у причала на воде; лавки не видно |
| 851 | LostSea Ocean Village with Ships | waterfront | совпадает | подходит | подходят | OK | остров с зеленью и кораблями вокруг, читается |
| 852 | Asian Style Dock | waterfront | частично | подходит | лишние (-boat) | мелочь | ступенчатая крыша причала над водой; лодки не видно |
| 853 | Trading Ship – Small Creative Build | waterfront | совпадает | подходит | лишние (-shop) | мелочь | большой парусный галеон; торговли и лавки не видно |
| 854 | Diagonal Port Structure | waterfront | совпадает | подходит | подходят | OK | портовое здание на скалах у воды, читается |
| 855 | AxiumSA Luxury Liner – Modern Yacht | waterfront | совпадает | подходит | подходят | OK | крупный белый круизный лайнер, современный, читается |
| 856 | Corvette Tuna Naval Cannon Ship | waterfront | совпадает | подходит | подходят | OK | малый серый боевой катер, читается |
| 857 | Moderate Size Dock with Chests | waterfront | совпадает | подходит | лишние (-boat) | мелочь | Г-образный причал-платформа; лодки рядом нет |
| 858 | Imposing Flying Ship Design | waterfront | совпадает | подходит | подходят | мелочь | летучий парусник с парусами; сказочно, но корабль читается |
| 859 | Coastal Port Village | waterfront | совпадает | подходит | подходят | OK | плотная прибрежная застройка на утёсе, читается |
| 860 | Gretjoy Boat Build | waterfront | совпадает | подходит | подходят | OK | парусник с серыми парусами, читается |
| 861 | German Train Ferry Preussen 1909 Ship Recreation | waterfront | совпадает | подходит | подходят | OK | белый железнодорожный паром с фермами, читается |
| 862 | Modern Port Town | waterfront | частично | подходит | подходят | мелочь | один голубой сарай на набережной, а не портовый город |
| 863 | Luxury Yacht – Quartz Block Design | waterfront | совпадает | подходит | подходят | OK | малая белая яхта из кварца, читается |
| 864 | Oak Sailing Ship | waterfront | совпадает | подходит | лишние (-tree) | мелочь | малая деревянная шхуна; живого дерева рядом нет |
| 865 | Modern VIP Yacht | waterfront | совпадает | подходит | подходят | OK | крупная белая ВИП-яхта, современная, читается |
| 866 | Fisherman’s Hut with Boat | waterfront | частично | подходит | лишние (-boat) | мелочь | хижина с фонарями на воде; лодка не различима |
| 867 | Three-Masted Sailing Ship | waterfront | совпадает | подходит | подходят | OK | трёхмачтовый парусник на воде, читается |
| 868 | Sloop Boat | waterfront | совпадает | подходит | подходят | OK | парусный шлюп с мачтами и серыми парусами на воде, читается |
| 869 | Ancient Roman Galley Ship | waterfront | совпадает | подходит | подходят | OK | галера с вёслами по бортам и парусом на синей подставке, читается |
| 870 | Small Fishing Trawler Boat | waterfront | частично | подходит | лишние (-shop) | мелочь | небольшое судно под серым навесом на стойках; лавки не видно |
| 871 | Chinese Junk Ship | waterfront | совпадает | подходит | подходят | OK | джонка с тремя мачтами и светлыми парусами на воде, читается |
| 872 | Minecraft Vet Clinic Building | public | совпадает | подходит | подходят | OK | современный корпус с красной полосой и голубым бассейном, читается |
| 873 | Futuristic Police Space Vehicle | vehicles | совпадает | подходит | подходят | OK | футуристичный красно-серый полицейский аппарат с кабиной, читается |
| 874 | Small Town Hall | public | совпадает | подходит | лишние (-shop) | мелочь | представительный корпус с внутренним двором и террасами; лавок нет |
| 875 | Stone Library Outpost | public | частично | подходит | лишние (-library) | мелочь | глухой ступенчатый каменный куб без окон; библиотеки не видно |
| 876 | Yandere High School: Insane Rooms | public | частично | подходит | лишние (-school) | мелочь | два красных отсека-камеры; школы вокруг не видно |
| 877 | Fallout Drive-In Movie Theater | public | частично | подходит | подходят | мелочь | светлая стена-экран и две тёмные тумбы; площадки кино нет |
| 878 | Small Prison Structure | public | совпадает | подходит | лишние (-shop) | мелочь | длинный красный корпус с двором и рядами камер; лавок нет |
| 879 | Prison Transport Bus For Police | vehicles | совпадает | подходит | подходят | OK | серый тюремный автобус с тёмными окнами и жёлтой дверью, читается |
| 880 | Old Town Hall | public | совпадает | подходит | подходят | OK | историческая ратуша с башней под серой черепичной крышей, читается |
| 881 | Enchanted Library Building | public | совпадает | подходит | подходят | OK | каменный купольный корпус с башенками, под библиотеку подходит |
| 882 | Minecraft Theatre Stage Design | public | совпадает | подходит | подходят | OK | светлый театральный корпус с красными витражами и крыльцом, читается |
| 883 | Prison Mining Outpost | public | частично | подходит | лишние (-tall) | мелочь | кольцевой карьер со стенами и деревьями; тюрьмы не видно |
| 884 | Courthouse Design | public | совпадает | подходит | лишние (-house) | мелочь | красно-белый суд с портиком и ступенями; не жилой дом |
| 885 | Cozy Village Library | public | совпадает | подходит | подходят | OK | уютный деревенский домик с черепичной крышей и крыльцом, читается |
| 886 | Ancient Greek Theatre | public | совпадает | подходит | подходят | OK | полукруглые ряды античных трибун дугой, читаются |
| 887 | Mastermind Prison Mine | public | не совпадает | подходит | лишние (-tall) | РАСХОЖДЕНИЕ | плоская серая плита сверху; ни шахты, ни тюрьмы не видно |
| 888 | Server Town Hall Building | public | совпадает | подходит | подходят | OK | бело-красный классический корпус с крестовой крышей, читается |
| 889 | Repaired Stronghold With Libraries | public | совпадает | подходит | подходят | OK | разветвлённые серые коридоры крепости на чёрном фоне, читаются |
| 890 | Wooden Amphitheatre Structure | public | совпадает | подходит | подходят | OK | деревянная арена с рядами и световыми дорожками, читается |
| 891 | Prisoner Transport Truck Vehicle | vehicles | совпадает | подходит | подходят | OK | крошечный красно-серый автозак с жёлтыми фарами, читается |
| 892 | Britain’s Got Talent Theatre with Interior | public | частично | подходит | подходят | мелочь | глухая коричневая коробка без признаков театра и интерьера |
| 893 | Simple Jail Structure | public | частично | подходит | подходят | мелочь | крошечный двухцветный куб без решёток и двери; камер не видно |
| 894 | Quartz Town Hall – Versatile Design | public | совпадает | подходит | подходят | OK | белый кварцевый зал с колоннадой и красной дорожкой, читается |
| 895 | Ancient Mayan Amphitheater Structure | public | совпадает | подходит | подходят | OK | каменное кольцо арены с зелёным полем и факелами, читается |
| 896 | Bedrock Prison Structure | public | частично | подходит | подходят | мелочь | малый красный бокс с двумя окнами; тюремного не видно |
| 897 | Simple Town Hall Design | public | совпадает | подходит | подходят | OK | деревянный зал со стеклянным коньком и фонарями, читается |
| 898 | Covid 19 Testing Town Hall Center | public | совпадает | подходит | подходят | OK | малый серый павильон с голубой окантовкой, под пункт подходит |
| 899 | Corner Cinema and Houses | public | совпадает | подходит | подходят | OK | угловой современный корпус со стеклянной крышей и балконами, читается |
| 900 | Basic City Hall for Small Towns | public | совпадает | подходит | лишние (-shop) | мелочь | нарядная мэрия с колоннами и фонарями; лавок нет |
| 901 | Grand Performance Theatre | public | совпадает | подходит | подходят | OK | парадный коричневый театр с колоннами и лепниной, читается |
| 902 | European Style Prison Bus | vehicles | не совпадает | подходит | подходят | РАСХОЖДЕНИЕ | на превью ландшафт с дорогой и деревьями, автобуса не видно |
| 903 | Hermitcraft Season 7 Town Hall Replica | public | совпадает | подходит | подходят | OK | кирпичная ратуша с куполом и башней, читается |
| 904 | French Town Hall Building | public | совпадает | подходит | подходят | OK | современная мэрия с парковкой и газоном, читается |
| 905 | Simple Courthouse Design V2 | public | частично | подходит | лишние (-house) | мелочь | белый павильон с окнами в крыше; на суд и дом не тянет |
| 906 | Grand Town Hall | public | совпадает | подходит | подходят | OK | огромная нарядная ратуша с башнями и красной крышей, читается |
| 907 | Village Town Hall Building | public | совпадает | подходит | подходят | OK | малый серый домик с красной отделкой и крыльцом, читается |
| 908 | Diorite Stone Factory – 2605 Blocks | industrial | совпадает | подходит | подходят | OK | серый цех с печами и конвейерами, название и размер читаются |
| 909 | Industrial Warehouse Building | industrial | совпадает | подходит | лишние (-house) | мелочь | большой стальной склад-ангар, на дом не тянет |
| 910 | Rustic Water Tower | towers | совпадает | подходит | подходят | OK | деревянная водонапорная башня на опорах, читается |
| 911 | Fallout 3 Style Grain Silo | industrial | совпадает | подходит | подходят | OK | высокий деревянный силос с ледяной отделкой, читается |
| 912 | Small Industrial Factory Structure | industrial | совпадает | подходит | лишние (-shop) | мелочь | цех со стеклянной крышей, витрины магазина не видно |
| 913 | Granite Concrete Factory – 8286 Blocks | industrial | совпадает | подходит | подходят | OK | длинный бетонный корпус без окон, читается как цех |
| 914 | Village Warehouse Structure | industrial | совпадает | подходит | подходят | OK | деревянный амбар с красной отделкой, читается |
| 915 | Solarpunk Quartz Tower | towers | совпадает | подходит | подходят | OK | белый шпиль высотой за двести блоков, читается |
| 916 | Modern Water Mill Structure | industrial | частично | подходит | лишние (-modern) | мелочь | деревянный ветряк со стеклами, на modern не тянет |
| 917 | Spacious Industrial Warehouse Building | industrial | совпадает | подходит | лишние (-house) | мелочь | длинный открытый каркас склада, читается |
| 918 | Stone Brick Factory Building | industrial | совпадает | подходит | подходят | OK | серая коробка с окнами и плоской крышей, читается |
| 919 | Industrial Warehouse Storage Facility | industrial | совпадает | подходит | лишние (-house) | мелочь | большая база хранения с рядами боксов, читается |
| 920 | Minecraft Lumber Mill Structure | industrial | совпадает | подходит | подходят | OK | открытая деревянная лесопилка, читается |
| 921 | Industrial Pipe with Pressure Gauge | industrial | совпадает | подходит | подходят | OK | серая труба с вентилем, читается как узел |
| 922 | Warehouse 7 Industrial Building | industrial | совпадает | подходит | лишние (-house) | мелочь | огромный склад с красной подсветкой крыши, читается |
| 923 | Industrial Style Bridge | bridges | совпадает | подходит | подходят | OK | красный фермовый мост, читается |
| 924 | Industrial Factory Hall | industrial | совпадает | подходит | подходят | OK | длинный цех с трубой, читается |
| 925 | Create Mod Birch Lumber Mill and Factory | industrial | совпадает | подходит | лишние (-tree) | мелочь | серый цех с трубой, деревьев рядом нет |
| 926 | Rustic Wood Workshop | decor | не совпадает | **не подходит**→decor | лишние (-shop) | РАСХОЖДЕНИЕ | летающий остров со стеклом вместо мастерской |
| 927 | Abandoned Textile Mill Structure | industrial | совпадает | подходит | подходят | OK | серый фабричный комплекс на грунте, читается |
| 928 | Create Mod Basic Workshop | industrial | совпадает | подходит | подходят | OK | маленькая хижина с ящиками, читается |
| 929 | Create Mod Andesite Factory | industrial | частично | подходит | подходят | мелочь | бежевый офисный блок, цеха снаружи не видно |
| 930 | Mega Clothing Store With Workshop | industrial | совпадает | подходит | подходят | OK | бело-коричневый корпус с витринами, читается |
| 931 | Create 16×16 Andesite Alloy Factory | industrial | частично | подходит | подходят | мелочь | красно-серый высотный блок, на цех похож слабо |
| 932 | AIK Foundry Structure | industrial | частично | подходит | подходят | мелочь | глухой бежевый куб, признаков литейни нет |
| 933 | Factory Build V3 | industrial | совпадает | подходит | подходят | OK | коричневый промкомплекс с трубами, читается |
| 934 | Advanced Syngas Industrial Complex | industrial | совпадает | подходит | лишние (-car) | мелочь | длинный светлый склад, машин рядом нет |
| 935 | Create Mod Gravel Factory 16×16 | industrial | совпадает | подходит | подходят | OK | два серых корпуса с трубой, читается |
| 936 | Create Mod Andesite Factory 16×16 Taiga | industrial | частично | подходит | подходят | мелочь | тёмный дом-башня, на цех не похож |
| 937 | Industrial Style Modern House | residential | совпадает | **не подходит**→residential | подходят | РАСХОЖДЕНИЕ | серый современный дом-офис, промзоне не место |
| 938 | Create Mod Andesite Factory In 16×16 Chunk | industrial | частично | подходит | подходят | мелочь | серо-коричневый офисный блок, цеха не видно |
| 939 | Industrial Style House | commercial | частично | **не подходит**→commercial | лишние (-house) | РАСХОЖДЕНИЕ | стеклянная офисная башня, а не дом |
| 940 | Stone Brick Industrial Factory | public | не совпадает | **не подходит**→public | подходят | РАСХОЖДЕНИЕ | азиатский павильон с фонарями, а не фабрика |
| 941 | Rustic Farmhouse & Shop | commercial | совпадает | подходит | подходят | OK | дом с пирамидальной крышей и каналом, читается |
| 942 | Town Layout with Plots for Houses and Markets | residential | совпадает | подходит | лишние (-house -shop) | мелочь | пустая сетка улиц под застройку, домов пока нет |
| 943 | Modern McDonald’s Restaurant With Exterior | commercial | совпадает | подходит | подходят | OK | голубой ресторан с парковкой, читается |
| 944 | Union Bank Building | commercial | совпадает | подходит | подходят | OK | высокая голубая башня банка, читается |
| 945 | Classical Greek Market | commercial | совпадает | подходит | подходят | OK | греческий храм с колоннадой, читается как рынок |
| 946 | Unique Treehouse Restaurant | commercial | не совпадает | подходит | лишние (-tree) | РАСХОЖДЕНИЕ | плоская коробка без дерева и домика на нём |
| 947 | The X Mall | commercial | совпадает | подходит | подходят | OK | белый куб с голубой вывеской, читается как молл |
| 948 | Witch’s Potion Shop House | commercial | частично | подходит | лишние (-shop) | мелочь | деревянный домик с витражом читается, ведьмовского и лавки не видно |
| 949 | Fallout 3 Diner Restaurant Build | commercial | совпадает | подходит | подходят | мелочь | приземистый дайнер с плоской крышей, читается; отсылка к игре |
| 950 | Gold Bank Vault Tower | commercial | частично | подходит | лишние (-tower) | мелочь | кубовидное хранилище, золота и башни не видно |
| 951 | Modern Shopping Mall | commercial | частично | подходит | лишние (-shop) | мелочь | стеклянный офисный блок с садом на крыше, скорее офис чем молл |
| 952 | Birch Blacksmith Shop | commercial | частично | подходит | лишние (-tree) | мелочь | маленькая лавка с плоской крышей, кузни и березы не видно |
| 953 | Seabubbles Cafe Building | commercial | совпадает | подходит | подходят | OK | компактное кафе с красной крышей, читается |
| 954 | Blacksmith Shop Structure | commercial | частично | подходит | подходят | мелочь | маленькая лавка с красным карнизом, кузня не читается |
| 955 | Joe’s Diner Restaurant | commercial | совпадает | подходит | подходят | OK | коричневый дайнер со столиками у входа, читается |
| 956 | Brick Blacksmith Shop | commercial | частично | подходит | подходят | мелочь | маленькая лавка с красным цоколем, кузнечного не видно |
| 957 | Modern Fast Food Restaurant | commercial | частично | подходит | лишние (-modern) | мелочь | длинный деревянный корпус с трубой, на модерн не похож |
| 958 | Blacksmith Shop NPC | commercial | частично | подходит | подходят | мелочь | та же маленькая лавка, персонажа и кузни не видно |
| 959 | McDonald’s Restaurant with Play Area | commercial | частично | подходит | не хватает (+large -medium) | мелочь | крупный комплекс с оградой, вывесок и игрового двора не разобрать |
| 960 | Blacksmith Shop in Jungle Setting | commercial | частично | подходит | подходят | мелочь | та же маленькая лавка, джунглей вокруг нет |
| 961 | Spanish Italian Fusion Restaurant | commercial | совпадает | подходит | подходят | OK | длинный ресторан со стеклом и башенкой, читается |
| 962 | Oak Blacksmith Shop | commercial | частично | подходит | лишние (-tree) | мелочь | маленькая лавка без дуба и кузни, деревьев нет |
| 963 | McDonald’s Restaurant Building | commercial | совпадает | подходит | подходят | OK | белый корпус с мачтой-вывеской, на ресторан похож |
| 964 | Blacksmith Shop – Sandstone Design | commercial | частично | подходит | подходят | мелочь | маленькая лавка с песочным навесом, кузня не читается |
| 965 | Restaurant Bar Towers | commercial | совпадает | подходит | подходят | OK | две стеклянные высотки с подсветкой, читаются |
| 966 | Spruce Blacksmith Shop | commercial | частично | подходит | лишние (-tree) | мелочь | та же маленькая лавка, ели и кузни не видно |
| 967 | McDonalds Restaurant | commercial | совпадает | подходит | подходят | OK | белый павильон с красной полосой, читается |
| 968 | Blacksmith Shop Exterior | commercial | частично | подходит | подходят | мелочь | маленькая лавка, виден лишь фасад без кузни |
| 969 | Small Minecraft Bakery Shop | commercial | частично | подходит | подходят | мелочь | крошечный прилавок-навес, на пекарню похоже слабо |
| 970 | Restaurant Building | commercial | совпадает | подходит | не хватает (+pool) | мелочь | террасный корпус с бассейном сбоку, бассейн в тегах пропущен |
| 971 | Gucci Store | commercial | совпадает | подходит | подходят | OK | компактный светлый бутик с витриной, читается |
| 972 | Quartz Gold Modern Office Tower | towers | частично | подходит | подходят | мелочь | тонкая высокая плита, офиса и золота не разобрать |
| 973 | Cobblestone and Glass Portal Towers | towers | совпадает | **не подходит**→towers | подходят | РАСХОЖДЕНИЕ | две башни из булыжника со стеклом, это башни а не общественное |
| 974 | Abandonedcraft Fortress Tower | towers | частично | подходит | лишние (-castle-like) | мелочь | арочная высотка без крепостных черт, замкового нет |
| 975 | Big Bend Skyscraper 600m Tall | towers | совпадает | подходит | подходят | OK | арочный небоскреб-перемычка, узнаваем и читается |
| 976 | Desert Tower with Enchanting Room | towers | частично | подходит | подходят | мелочь | коричневая шипастая башня с огнями, пустыни не видно |
| 977 | Rustic Village with Longhouse and Towers | residential | совпадает | **не подходит**→residential | подходят | РАСХОЖДЕНИЕ | деревня с частоколом и домами, жилое а не общественное |
| 978 | Desert Water Temple With Symmetrical Towers | public | совпадает | подходит | не хватает (+water +large -medium) | мелочь | квадратный храм с бассейнами и башнями, вода и размер не в тегах |
| 979 | Block Showcase Tower with Mini Biomes | decor | не совпадает | **не подходит**→decor | лишние (-tower) | РАСХОЖДЕНИЕ | плоская полосатая платформа, башни и биомов нет |
| 980 | Steampunk Skyscraper Model | towers | совпадает | подходит | подходят | мелочь | темная клепаная высотка, стимпанк читается |
| 981 | Crusader Style Small Tower | towers | частично | подходит | лишние (-shop) | мелочь | приземистый павильон с пирамидальной крышей, лавки нет |
| 982 | Steampunk Skyscraper Model 4 | towers | совпадает | подходит | подходят | мелочь | темная башня с красным основанием, стимпанк читается |
| 983 | Stone Tower with Automatic Lighting | towers | совпадает | подходит | подходят | OK | каменная башенка с фонарем наверху, читается |
| 984 | Steampunk Skyscraper Model 5 Tower | towers | совпадает | подходит | подходят | мелочь | круглая клепаная башня на синем цоколе, читается |
| 985 | Eiffel Tower | towers | совпадает | подходит | подходят | OK | ажурная башня с подсветкой и флагом, узнаваема |
| 986 | Tower Trivia Game Show | commercial | частично | **не подходит**→commercial | лишние (-tower) | РАСХОЖДЕНИЕ | низкий студийный блок с креслами, на башню не похож |
| 987 | Enchanted End Stone Brick Tower | towers | совпадает | подходит | подходят | мелочь | светлая башня из эндер-камня с подсветкой, читается |
| 988 | Max’s Tower Outpost | towers | совпадает | подходит | подходят | OK | компактная каменная сторожевая башня с зубцами, читается отлично |
| 989 | Big Ben Clock Tower Replica – Oak & Birch Build | towers | совпадает | подходит | лишние (-tree) | мелочь | высокая коричневая часовая башня; деревьев рядом нет |
| 990 | Small Storage House | residential | совпадает | подходит | лишние (-shop -tall) | мелочь | крошечный кубический склад с окном и стеклянной крышей; магазина нет |
| 991 | Spacious Modern Mansion Estate | residential | совпадает | подходит | лишние (-medium +large +pool) | мелочь | огромный П-образный современный комплекс с бассейном; никакой не medium |
| 992 | Modern Quartz and Dirt Residence | residential | совпадает | подходит | лишние (-apartment +house +pool) | мелочь | белый модерновый дом с бассейном; скорее house, чем apartment |
| 993 | Medium Town House with Three Floors | residential | совпадает | подходит | подходят | OK | трёхэтажный коричневый дом с грядками, читается хорошо |
| 994 | Medium Brick Cottage House | residential | совпадает | подходит | подходят | OK | кирпичный дом с забором и садом, читается хорошо |
| 995 | Modern House Design with Soartex Textures | residential | совпадает | подходит | лишние (-tall) | мелочь | модерновый дом с плоской крышей и окнами; высоким не выглядит |
| 996 | Small Decorative Town House | residential | совпадает | подходит | лишние (-shop) | мелочь | белый компактный домик у воды; витрины магазина нет |
| 997 | Starter Cottage – Oak & Quartz | residential | совпадает | подходит | лишние (-tree) | мелочь | два маленьких домика с прудом; деревьев не видно |
| 998 | Large Estate House | residential | совпадает | подходит | лишние (-small +large) | мелочь | крупный дом со ступенчатой крышей; тег small ошибочен |
| 999 | Furnished Brick Townhouse | residential | совпадает | подходит | подходят | OK | ступенчатый кирпичный дом в несколько этажей, читается |
| 1000 | Cozy Small Wooden Cottage | residential | совпадает | подходит | лишние (-shop -medium +small) | мелочь | заснеженный деревянный коттедж; магазина нет, он small |
| 1001 | Snowy Small House | residential | частично | подходит | лишние (-shop) | мелочь | белый павильон с внутренним двором; на жилой дом похоже слабо |
| 1002 | Spacious Modern Mansion with Furnished Interior | residential | совпадает | подходит | подходят | OK | просторный тёмный особняк с высокой крышей, читается |
| 1003 | Contemporary Residence Schematic | residential | совпадает | подходит | лишние (-apartment +house) | мелочь | ступенчатый коричневый дом; скорее house, чем apartment |
| 1004 | Condensed Townhouse Compound Structure | residential | совпадает | подходит | подходят | OK | огромный квартал домов с бассейном, читается отлично |
| 1005 | Rustic Log Cabin House | residential | частично | подходит | не хватает (+tall) | мелочь | высокий блочный дом, на уютную хижину похож слабо |
| 1006 | Small House With Kitchen and Shower | residential | совпадает | подходит | лишние (-large -shop -tall +small) | мелочь | компактный домик со рвом; ни large, ни tall, ни shop |
| 1007 | Large Three-Story Mansion | residential | совпадает | подходит | подходят | OK | большой бело-красный особняк с бассейном, читается |
| 1008 | Large Modern Villa Residence | residential | совпадает | подходит | лишние (-apartment -medium +large) | мелочь | раскидистая белая вилла; apartment и medium лишние |
| 1009 | Cozy Town House with Hay Roof | residential | частично | подходит | подходят | мелочь | открытый павильон на столбах; стен нет, крыша не похожа на солому |
| 1010 | Birch Cottage House with Furnishings | residential | совпадает | подходит | лишние (-tree) | мелочь | деревянный коттедж с верандой; деревьев рядом нет |
| 1011 | Cozy Hillside House | residential | частично | подходит | подходят | мелочь | крупный фрагмент остроконечной крыши; дом целиком не читается |
| 1012 | Small Villa House with Storage | residential | совпадает | подходит | лишние (-shop) | мелочь | большой дом с высокой крышей; магазина не видно |
| 1013 | Modern Villa Residence – Dirt & White Concrete | residential | частично | подходит | подходят | мелочь | плоская белая вилла с бассейном и двором, сверху читается слабо |
| 1014 | Rustic Country Cottage | residential | совпадает | подходит | подходят | OK | деревенский домик на сваях со стеклянной крышей, читается |
| 1015 | Rustic 3-Story Mansion | residential | совпадает | подходит | подходят | OK | П-образный коричневый особняк с фонтаном, читается |
| 1016 | Small Brick Townhouse With Jack-o-Lanterns | residential | совпадает | подходит | лишние (-shop) | мелочь | красно-белый многоэтажный дом; магазина нет |
| 1017 | Spruce Log Cabin House | residential | совпадает | подходит | лишние (-tree) | мелочь | большой бревенчатый дом; деревьев рядом не видно |
| 1018 | Asian Style House with Furnished Interior | residential | совпадает | подходит | подходят | OK | дом в азиатском стиле с фонарями, читается |
| 1019 | Modern Blue Villa | residential | совпадает | подходит | подходят | OK | серый особняк с забором и садом, читается |
| 1020 | New York Style Townhouses With Pool | residential | совпадает | **не подходит**→residential | подходят | РАСХОЖДЕНИЕ | красные дома с бассейном и дорогой; не public, а жилые |
| 1021 | Cozy Woodcutter’s Cottage | residential | частично | подходит | подходят | мелочь | крупный фрагмент бревенчатого сруба, общий вид не читается |
| 1022 | Modern Two-Story House Over Pond | residential | совпадает | подходит | подходят | OK | белая вилла на пруду с фонарями, читается отлично |
| 1023 | Modern Mansion with Fire Safety Upgrades | residential | совпадает | подходит | подходят | OK | крупный коричневый особняк с высокой крышей, читается |
| 1024 | Snowy House and Vehicles | vehicles | совпадает | подходит | не хватает (+car) | мелочь | современный дом с машинами вокруг; тег car отсутствует |
| 1025 | Piston Fountain – Small Garden Feature | parks | совпадает | подходит | лишние (-shop) | мелочь | крошечный поршневой фонтан в каменной чаше, читается; магазин тут лишний |
| 1026 | Mini Hedge Maze With Cave Entrance | parks | совпадает | подходит | не хватает (+park +water) | мелочь | живой лабиринт с водными дорожками, читается; не хватает тегов парка и воды |
| 1027 | Small Town Square | parks | частично | подходит | подходят | мелочь | квартал домиков на зелёном поле; сама площадь выражена слабо |
| 1028 | Rustic Farmhouse with Garden and Pond | residential | совпадает | **не подходит**→residential | подходят | РАСХОЖДЕНИЕ | деревенский дом с садом и фонарями; это жильё, а не парк |
| 1029 | Sea Creature Park Megalodon Whale | parks | не совпадает | подходит | подходят | РАСХОЖДЕНИЕ | два пустых бетонных бассейна, кита-мегалодона не видно |
| 1030 | Small Garden Oasis | parks | частично | подходит | лишние (-shop) | мелочь | садик с грядками и высокой колонной; магазин лишний |
| 1031 | Village Fountain | parks | совпадает | подходит | лишние (-house) | мелочь | каменный фонтан с водопадами, читается; дома рядом нет |
| 1032 | Soviet Style City Square | parks | частично | подходит | подходят | мелочь | серый колонный павильон; советского и площади не видно |
| 1033 | Two Cubes Modern House With Garden Pool | residential | совпадает | **не подходит**→residential | подходят | РАСХОЖДЕНИЕ | белый куб-модерн с садом; жилой дом, а не парк |
| 1034 | Park Ball Structure | parks | совпадает | подходит | подходят | OK | кольцо зелени с красным центром, мяч читается |
| 1035 | Creeper Head Fountain | parks | частично | подходит | подходят | мелочь | белый куб над водной чашей; морды крипера не видно |
| 1036 | Simple Minecraft Tree | parks | частично | подходит | подходят | мелочь | одинокий ствол без кроны; дерево угадывается слабо |
| 1037 | Gothic Square Structure | parks | частично | подходит | не хватает (+fountain) | мелочь | круглая площадь с центральным монументом; готики не видно |
| 1038 | Olive Garden Restaurant Salt Lake City | commercial | совпадает | **не подходит**→commercial | не хватает (+shop -park) | РАСХОЖДЕНИЕ | бежевый ресторанный корпус с парковкой; к паркам не относится |
| 1039 | Playground Park for Minecrafty Town | parks | частично | подходит | подходят | мелочь | абстрактные горки-лазалки в раме; площадка угадывается |
| 1040 | Survival Sphere House and Garden | parks | частично | подходит | подходят | мелочь | стеклянная сфера-купол на траве; дома и сада внутри не видно |
| 1041 | Spanish Moss Oak Tree | parks | частично | подходит | подходят | мелочь | голые коричневые ветви без листвы и мха |
| 1042 | Cozy Brick Home with Garden and Storage | residential | частично | **не подходит**→residential | лишние (-park) | РАСХОЖДЕНИЕ | длинный кирпичный корпус с окнами; жильё, а не парк |
| 1043 | Medium Palm Tree With Cocoa Pods | parks | частично | подходит | подходят | мелочь | коричневый ствол со светлыми гроздьями; пальмовых листьев нет |
| 1044 | Tropical Palm Tree | parks | частично | подходит | подходят | мелочь | огрызок ствола из пары блоков без кроны |
| 1045 | Rustic Garden Shed | parks | не совпадает | подходит | лишние (-park) | РАСХОЖДЕНИЕ | коричневая ступенчатая глыба; сарай и сад не читаются |
| 1046 | Small Oak Decorative Tree | parks | частично | подходит | лишние (-shop) | мелочь | коричневый ствол без кроны; магазина нет |
| 1047 | Small Tree Decoration | parks | частично | подходит | лишние (-shop) | мелочь | прутик-рогатка из пары блоков; декор едва читается |
| 1048 | 3Tri’s Modern Garden Structure | parks | частично | подходит | лишние (-park) | мелочь | три белые пилонные башни на плитке; сада не видно |
| 1049 | Decorative Lantern Tree | parks | совпадает | подходит | подходят | OK | кубическое дерево с фонарями, читается |
| 1050 | Cozy House with Garden and Garage | residential | частично | **не подходит**→residential | лишние (-park -parking) | РАСХОЖДЕНИЕ | видна лишь ступенчатая крыша домика; гаража и сада нет |
| 1051 | Japanese Garden House – Spruce & Dark Oak | parks | совпадает | подходит | подходят | OK | остров с японскими крышами и садом, читается |
| 1052 | Massive Tree Structure | commercial | не совпадает | **не подходит**→commercial | лишние (-tree) | РАСХОЖДЕНИЕ | плоский складской корпус с фонарями; дерева нет вовсе |
| 1053 | Large Romantic Tree | parks | совпадает | подходит | подходят | OK | белое дерево с фонарями на террасе, читается |
| 1054 | Custom Birch Tree Decoration | parks | частично | подходит | подходят | мелочь | голый тёмный ствол; берёзы и листвы не видно |
| 1055 | Intersection Road | intersections | совпадает | подходит | подходят | OK | разметка перекрёстка на зелени, читается |
| 1056 | Sewer Template Intersection Shape | intersections | совпадает | подходит | лишние (-small) | мелочь | иксообразный тоннельный узел; на small не тянет |
| 1057 | Drive on the Right Dual Simplex Minecart Track Intersection | intersections | совпадает | подходит | лишние (-car) | мелочь | рельсовые развилки на плитах; машин тут нет |
| 1058 | Intersection | intersections | совпадает | подходит | подходят | OK | декоративный перекрёсток с фонарями, читается |
| 1059 | Stoplight | intersections | совпадает | подходит | подходят | OK | голова светофора на тумбе, читается |
| 1060 | Ride Road Build | decor | не совпадает | **не подходит**→decor | лишние (-road) | РАСХОЖДЕНИЕ | проволочная надпись вместо дороги; это текст-арт |
| 1061 | Wild West Crossroad | commercial | частично | **не подходит**→commercial | лишние (-road) | РАСХОЖДЕНИЕ | вестерн-квартал домиков; перекрёстка не видно |
| 1062 | Road B (Normal two-way street) | roads | совпадает | подходит | лишние (-tree) | мелочь | прямой участок дороги с тротуарами и жёлтыми фонарями; деревьев не видно |
| 1063 | Cobble Towny Road System | roads | совпадает | подходит | не хватает (+huge -medium) | мелочь | большая булыжная дорожная сетка с газонами и фонарями; явно крупнее medium |
| 1064 | Decorative Street Lamp. | roads | совпадает | подходит | лишние (-tree -road) | мелочь | несколько декоративных фонарных столбов; ни дороги, ни деревьев нет |
| 1065 | Terraced Shop with Sidewalk | commercial | совпадает | **не подходит**→commercial | лишние (-car) | РАСХОЖДЕНИЕ | красное кирпичное торговое здание с тротуаром; это коммерция, не дорога |
| 1066 | Bus Stop | transport | совпадает | **не подходит**→transport | подходят | РАСХОЖДЕНИЕ | маленький навес остановки со скамьёй; не техника, а транспортная инфраструктура |
| 1067 | bus stop | transport | совпадает | **не подходит**→transport | подходят | РАСХОЖДЕНИЕ | навес остановки с лавками и урнами; относится к транспорту, не к технике |
| 1068 | bus stop | transport | совпадает | **не подходит**→transport | подходят | РАСХОЖДЕНИЕ | длинная платформа остановки с навесом; категория скорее transport |
| 1069 | Minecraft Airport Runway | transport | совпадает | подходит | не хватает (+huge -small) | мелочь | длинная серая полоса взлётки; размер явно не small |
| 1070 | Airport | transport | совпадает | подходит | подходят | OK | крупный аэровокзал с ангарами и перроном, читается |
| 1071 | Modern Hospital Building | public | совпадает | подходит | подходят | OK | белый корпус с красными крестами, больница читается |
| 1072 | Two-Story Hospital Building | public | совпадает | подходит | подходят | OK | краснокирпичный двухэтажный корпус с парковкой, больница |
| 1073 | Huge Modern Hospital! | public | совпадает | подходит | подходят | OK | высокий белый больничный корпус, крупный и высокий |
| 1074 | Hospital | public | совпадает | подходит | подходят | OK | серая больница с красным крестом и вертолётной площадкой H |
| 1075 | Police Station With Jail | public | частично | **не подходит**→public | подходят | РАСХОЖДЕНИЕ | белый административный блок без вывесок; участок скорее public |
| 1076 | City Police Station Building | public | частично | **не подходит**→public | подходят | РАСХОЖДЕНИЕ | краснокирпичное здание с парковкой без вывески; участок неявный |
| 1077 | Police Station / Modern Police Station | public | частично | **не подходит**→public | подходят | РАСХОЖДЕНИЕ | серый современный офисный блок без вывески; к transport не относится |
| 1078 | Police Station - complete version | public | частично | **не подходит**→public | подходят | РАСХОЖДЕНИЕ | стеклянное административное здание; вывески участка нет |
| 1079 | Police Station | public | совпадает | **не подходит**→public | подходят | РАСХОЖДЕНИЕ | здание с крупной надписью POLICE и парковкой, читается |
| 1080 | Fire Station Building | public | совпадает | **не подходит**→public | подходят | РАСХОЖДЕНИЕ | светлое депо с красными воротами и пожарной машиной, читается |
| 1081 | Fire Station House | public | частично | **не подходит**→public | лишние (-house) | РАСХОЖДЕНИЕ | крупный комплекс с вертолётной площадкой; на жилой дом не похоже |
| 1082 | Fire Station | public | частично | **не подходит**→public | подходят | РАСХОЖДЕНИЕ | бежевый комплекс депо с плоскими крышами; пожарная специфика неявная |
| 1083 | Fire Station | public | совпадает | **не подходит**→public | подходят | РАСХОЖДЕНИЕ | то же светлое депо с машиной; похоже на дубликат соседнего объекта |
| 1084 | equipped-firestation | public | частично | подходит | подходят | мелочь | тот же крупный комплекс с площадкой; категория public здесь верная |
| 1085 | Fire station | public | частично | **не подходит**→public | подходят | РАСХОЖДЕНИЕ | узкая высокая башня-каланча; признаки депо неявные |
| 1086 | Sims 3 Style City Hall | public | совпадает | подходит | подходят | мелочь | белый классический сити-холл с башней; Sims в имени — франшиза |
| 1087 | City Hall | public | совпадает | подходит | подходят | OK | классический холл с колоннами и стеклянной крышей, читается |
| 1088 | Town hall | public | совпадает | подходит | подходят | OK | коричнево-красный таун-холл с мансардной крышей, читается |
| 1089 | theater | public | частично | подходит | подходят | мелочь | длинный современный серый корпус; театральная функция неявная |
| 1090 | Greek Theater | public | совпадает | подходит | подходят | OK | белая колоннада с золотом в греческом стиле, читается |
| 1091 | Theater | public | совпадает | подходит | подходят | OK | крупный театральный комплекс с внутренним двором, читается |
| 1092 | Shakespears theater | public | совпадает | подходит | подходят | OK | коричневый корпус с открытым двором в духе театра Глобус |
| 1093 | Modern Twin Cinema Building | public | частично | подходит | подходят | мелочь | современное здание со слоистой крышей; вывесок кинотеатра нет |
| 1094 | Multi-Room Cinema with Concessions | public | частично | подходит | не хватает (+large) | мелочь | видна лишь плоская крыша длинного корпуса; фасад не читается |
| 1095 | 6 Room Cinema | public | частично | подходит | не хватает (+large) | мелочь | та же плоская крыша длинного корпуса, фасад не виден |
| 1096 | Twin Cinema Complex | public | частично | подходит | подходят | мелочь | бежево-голубое современное здание; признаки кинотеатра неявные |
| 1097 | Cinema | public | частично | подходит | подходят | мелочь | глухая красная коробка без окон и вывесок; кинотеатр не читается |
| 1098 | 128KSU Power Plant Structure | industrial | совпадает | подходит | подходят | OK | малая серая техно-конструкция электростанции, читается |
| 1099 | Massive Steam Power Plant | industrial | совпадает | подходит | подходят | OK | тёмный индустриальный корпус с трубами и оборудованием, читается |
| 1100 | Pixelmon Maze Power Plant | industrial | совпадает | подходит | подходят | мелочь | серый корпус с вентиляцией; Pixelmon в имени — франшиза |
| 1101 | 256-Block Power Plant Structure | industrial | совпадает | подходит | подходят | OK | серая техно-конструкция с синими энерголиниями, читается |
| 1102 | Power Plant | industrial | совпадает | подходит | подходят | OK | градирня и корпуса станции на острове, читается |
| 1103 | Pixelmon Power Plant | industrial | совпадает | подходит | подходят | OK | тёмный корпус с тремя полосатыми трубами, читается |
| 1104 | fallout 3 substation v1- zth | industrial | частично | подходит | подходят | мелочь | красный корпус подстанции; префикс франшизы и мусор в имени лишние |
| 1105 | fallout 3 substation v2- zth | industrial | частично | подходит | подходят | мелочь | серая подстанция из четырёх ячеек; франшиза и версия в имени лишние |
| 1106 | Barn with Water Tower | towers | частично | подходит | подходят | мелочь | деревянный сарай виден, а водонапорка едва читается |
| 1107 | Modern water tower | towers | совпадает | подходит | подходят | OK | белый сферический бак на ажурной опоре, читается |
| 1108 | Water Tower by iEdgy | towers | частично | подходит | не хватает (+castle-like) | мелочь | ажурная синяя башня без резервуара, скорее фэнтези |
| 1109 | Double-Sided Sony Logo Billboard | decor | совпадает | **не подходит**→decor | подходят | РАСХОЖДЕНИЕ | щит с объёмными буквами бренда; это декор, а не общественное здание |
| 1110 | "Do you even shift bro" billboard | decor | совпадает | **не подходит**→decor | подходят | РАСХОЖДЕНИЕ | чёрный щит с пиксельной надписью; по сути декор |
| 1111 | Large Billboard | decor | частично | **не подходит**→decor | подходят | РАСХОЖДЕНИЕ | пустая решётчатая конструкция без полотна; декор, не общественное |
| 1112 | fallout 3 billboard- zth | decor | частично | подходит | подходят | мелочь | крошечная пустая табличка без надписи; франшиза лишь в имени |
| 1113 | WorkBench | decor | совпадает | **не подходит**→decor | подходят | РАСХОЖДЕНИЕ | гигантский верстак-куб; декор, а не общественное здание |
| 1114 | Toyland-FisherPrice Workbench | decor | совпадает | **не подходит**→decor | подходят | РАСХОЖДЕНИЕ | игрушечный пластиковый верстак; бренд в имени, это декор |
| 1115 | Small Gas Station and Store | transport | частично | подходит | подходят | мелочь | навес и ряды колонок сверху; магазин не читается |
| 1116 | Gas station | transport | совпадает | подходит | подходят | OK | заправка с навесом и павильоном, читается |
| 1117 | Gas Station 3 | transport | совпадает | подходит | подходят | OK | большой навес с рядами колонок, читается |
| 1118 | Petrol/ Gas station | transport | совпадает | подходит | подходят | OK | компактная заправка с навесом и колонками, читается |
| 1119 | Sheetz Gas Station | transport | совпадает | подходит | не хватает (+shop) | мелочь | крупный комплекс с магазином и парковкой; магазину нужен тег |
| 1120 | Art School Building | public | частично | подходит | подходят | мелочь | светлый павильон с круглой крышей; школьного не видно |
| 1121 | German School Building | public | совпадает | подходит | подходят | OK | кирпичный корпус с внутренним двором, читается |
| 1122 | Pixelmon School Building | public | совпадает | подходит | подходят | мелочь | кампус с башней и фонтаном; префикс игры в имени лишний |
| 1123 | School | public | совпадает | подходит | подходят | OK | современные корпуса с двором, читается |
| 1124 | Secondary School  - LE | public | не совпадает | подходит | лишние (-school +church) | РАСХОЖДЕНИЕ | на кадре деревянная церковь с башней, а не школа |
| 1125 | Small Soccer Stadium Build | public | совпадает | подходит | лишние (-shop) | мелочь | поле с трибунами читается; магазинов нет |
| 1126 | Apocalyptic Prison Mine | public | совпадает | подходит | подходят | OK | огороженный комплекс с корпусами и двором, читается |
| 1127 | Small Prison Building | public | частично | подходит | лишние (-shop) | мелочь | глухая белая коробка без тюремных признаков; магазинов нет |
| 1128 | Desert Prison Structure | public | частично | подходит | подходят | мелочь | коричневый куб с декором; тюремного не видно |
| 1129 | Sand Prison | public | частично | подходит | подходят | мелочь | бежевый куб с декором, повтор соседней модели; тюрьмы не видно |
| 1130 | Jail/Prison | public | частично | подходит | подходят | мелочь | серая крошечная камера; высота 256 в кадре не читается |
| 1131 | Storage Warehouse | industrial | совпадает | подходит | лишние (-house) | мелочь | длинный склад-сарай с навесом; дом тут ни при чём |
| 1132 | Storage Warehouse V1 | industrial | частично | подходит | лишние (-house +shop) | мелочь | складской двор с лотками; версия в имени лишняя, дома нет |
| 1133 | Large Warehouse | industrial | совпадает | подходит | лишние (-house) | мелочь | длинный ангар с фонарём по коньку; тег дома лишний |
| 1134 | Warehouse | industrial | совпадает | подходит | лишние (-house) | мелочь | полосатый складской корпус; тег дома лишний |
| 1135 | Warehouse 11 | industrial | совпадает | подходит | лишние (-house) | мелочь | огромный светлый ангар; тег дома лишний |
| 1136 | 9-story Parking Garage | transport | совпадает | подходит | лишние (-park) | мелочь | серая девятиэтажная парковка; парка рядом нет |
| 1137 | Six-story parking lot | transport | совпадает | подходит | лишние (-park) | мелочь | открытый паркинг с разметкой; парка рядом нет |
| 1138 | Ambulance | vehicles | совпадает | подходит | не хватает (+car) | мелочь | красно-белая санитарная машина; не хватает тега авто |
| 1139 | Train station | transport | совпадает | подходит | лишние (-tall) | мелочь | длинный классический вокзал; высотности не видно |
| 1140 | Train Station Like Structure | transport | частично | подходит | подходят | мелочь | зал со стеклянной крышей; оговорка в имени лишняя |
| 1141 | Nice village train station | transport | совпадает | подходит | лишние (-house) | мелочь | деревянный навес платформы; дома тут нет |
| 1142 | St Thomas Underground Train station | transport | совпадает | подходит | лишние (-tall) | мелочь | стеклянный вокзальный павильон с путями и разрезом грунта; на высотку не тянет |
| 1143 | Railway Tunnel | roads | совпадает | подходит | подходят | OK | серый бетонный тоннель с порталами и подсветкой, читается |
| 1144 | Tunnel lighting | roads | совпадает | подходит | подходят | OK | длинный тоннельный лоток с подсветкой и направляющими, читается |
| 1145 | Chafariz/Fonte - Fountain 02 | parks | совпадает | подходит | подходят | OK | круглая синяя чаша фонтана с каменной окантовкой, читается |
| 1146 | 4 Sword Fountain | parks | совпадает | подходит | подходят | OK | высокий белый фонтан с синей чашей и шпилями, читается |
| 1147 | Alexandria's Lighthouse | waterfront | совпадает | подходит | лишние (-house -water) | мелочь | высокая ступенчатая башня маяка на черном фоне, воды не видно |
| 1148 | Stone lighthouse - (with working fireplace) | waterfront | совпадает | подходит | подходят | OK | каменный домик маяка с фонарем на синем основании, читается |
| 1149 | Modern Lakeside Townhouse | residential | частично | подходит | подходят | мелочь | современная плоская вилла с террасами; озера рядом не видно |
| 1150 | Townhouse 7 | residential | совпадает | подходит | подходят | OK | деревянный домик со стеклянной пристройкой, читается |
| 1151 | Office Building | towers | совпадает | подходит | подходят | OK | среднеэтажный офисный блок со светлой крышей, читается |
| 1152 | ten story office building | towers | частично | подходит | лишние (-huge) | мелочь | офисный корпус этажей на семь и круглый пристрой; не десять |
| 1153 | Drive on the Left Dual Simplex Minecart Track Intersection | intersections | совпадает | подходит | лишние (-car) | мелочь | платформа со сплетением рельс и редстоуна; вагонеток нет |
| 1154 | 4 Way Intersection (Redstone) | decor | не совпадает | **не подходит**→decor | подходят | РАСХОЖДЕНИЕ | серая будка механизма без развилки, на перекресток не похоже |
| 1155 | Ancient Skyway Modified(T-Junction) | intersections | совпадает | подходит | подходят | OK | V-образная эстакада с желтой окантовкой, развилка читается |
| 1156 | Highway Part 1 | roads | совпадает | подходит | подходят | OK | двухполосная эстакада на опорах, читается |
| 1157 | Highway Part 2 | roads | совпадает | подходит | подходят | OK | крупная развязка с рампами и лестницами, читается |
| 1158 | Highway Part 3 | roads | совпадает | подходит | подходят | OK | плоская развязка с белыми блоками, читается |
| 1159 | highway | roads | совпадает | подходит | подходят | OK | красные полосы дорожного полотна крупным планом, читаются |
| 1160 | Railway Junction Train Station Base | intersections | совпадает | подходит | лишние (-station -medium +large) | мелочь | террасированный фундамент под станцию без построек, большой |
