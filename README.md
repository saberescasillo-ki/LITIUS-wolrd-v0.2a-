# LITIUS-wolrd-v0.2a-
LITIUS wolrd more serius

## LITIUS Mobs (addon para Minecraft Bedrock)

Addon con variantes de mobs vanilla. Usa las texturas vanilla 16x16 de cada mob
(se cargan directamente del juego), así que solo incluye texturas propias para
la capa y la bufanda.

| Carpeta          | Tipo                     |
|------------------|--------------------------|
| `LITIUS_Mobs_BP` | Behavior pack (comportamiento, spawn, loot) |
| `LITIUS_Mobs_RP` | Resource pack (modelos, animaciones, texturas, partículas) |

### Mobs incluidos

| Mob | ID | Resumen |
|-----|----|---------|
| Esqueleto Furtivo | `litius:esqueleto_furtivo` | Capa + bufanda rústica. Más rápido (0.29 vs 0.25), detecta a 26 bloques (vanilla 16), dispara ráfagas de 2 flechas cada 1 s. Sale del suelo arrastrándose (1.5 s). Se inclina al caminar/correr y al girar; siempre lleva las manos en el arco. |
| Zombie Furtivo | `litius:zombie_furtivo` | Capa + bufanda rústica. Sale del suelo arrastrándose (1.7 s). Se inclina hacia adelante más que el esqueleto. Ataque rápido (0.4 s) de rasguño con ambas manos que aplica **Veneno 4 s**. |
| Creeper + | `litius:creeper_plus` | Patas ¼ de bloque más largas y torso más grueso. Se inclina ligeramente al caminar. Cabezazo rápido (0.5 s). Tras **1.7 s** cerca del objetivo enciende la mecha, tiembla y explota con potencia 5 (vanilla 3; cargado 9). Se apaga si pierde al objetivo. |
| Wither Furtivo | `litius:wither_furtivo` | Modelo y textura del wither esqueleto, cicatriz en el ojo derecho, brazo derecho de cuchilla y capa. 40 de vida, 7 de daño por golpe + **Wither 5 s**. Ataque: slash épico (alza la cuchilla por detrás del hombro, se lanza hacia adelante con un tajo diagonal y una onda de ceniza). Camina apuntando la cuchilla hacia adelante; en reposo echa el cuerpo atrás con los brazos detrás de las piernas. Aparece en el Nether (valle de almas y, raro, desiertos del Nether). |
| Esqueleto Exiliante | `litius:esqueleto_exiliante` | Esqueleto vanilla con capa muy rasgada y hombreras de cuero. No suelta objetos, solo experiencia. Solo cuerpo a cuerpo (cachetada exagerada con una mano, la otra detrás). Cuando tiene objetivo o recibe daño invoca **2 zombies** (enfriamiento de 30 s). Camina con los brazos a la espalda inclinado un poco hacia atrás; en reposo tiene los brazos extendidos, listo para invocar. |
| Jinete Acorazado | `litius:jinete_acorazado` | Zombie vanilla con armadura de hierro completa y espada de hierro, montado en un caballo zombie (`litius:caballo_acorazado`). Armadura y arma **nunca se sueltan**. **Mutación (25 %): lancero** con lanza de hierro, más alcance y daño. Aparece en llanuras, sabanas y praderas. |
| Jinete Wither | `litius:jinete_wither` | Wither esqueleto vanilla (40 de vida) con espada de piedra (no la suelta) montado en un caballo esqueleto color wither (`litius:caballo_wither`). **Mutación (25 %): lancero** con lanza de piedra. Aparece en el Nether. |
| Creeze | `litius:creeze` | Breeze azul (fuego de alma), animaciones vanilla, 48 de vida (breeze: 30). Si su objetivo no es un monstruo, invoca **2 breezes** cada 25 s (`litius:breeze_invocada`: igual al breeze, muere de un golpe, desaparece a los 90 s). Aparece en biomas templados/fríos, cuevas profundas (y < 0). |
| Zombie Raxier (minijefe) | `litius:zombie_raxier` | Zombie vanilla con hombreras de cuero, capa, guantes de piedra, cicatriz en el ojo izquierdo y un aro de hierro oxidado en el cuello. 225 de vida, velocidad de un jugador corriendo, detecta a 40 bloques. 15–4.5 bloques: lanza cargas de viento (1/s). Menos de 4.4: puñetazos. Cada 4–7 s: ráfaga de 4 cargas (cada 0.3 s) o se agacha 1 s e invoca **pinchos de aire** de 2 bloques en un área de 3x3 alrededor de cada jugador/golem cercano (5 de daño). No suelta objetos; da 50 de experiencia (como 10 enemigos). Aparece raro en biomas fríos. |
| Ahogado Furtivo | `litius:ahogado_furtivo` | Drowned vanilla con bufanda y tiras de algas, **siempre con tridente** (5 % de soltarlo). De cerca agarra con las dos manos (**Lentitud 3 s**); de lejos lanza el tridente. Aparece en ríos y océanos. |
| Momia Errante | `litius:momia_errante` | Husk vanilla con vendas, turbante y chal de arena. Sale de la arena arrastrándose; camina tambaleándose; doble zarpazo que aplica **Hambre 8 s**. No se quema al sol. Aparece en desiertos y mesas. |
| Stray Centinela | `litius:stray_centinela` | Stray vanilla (con su ropa) más capa de piel y bufanda de lana. Francotirador: detecta a 30 bloques y **se arrodilla para disparar** flechas de Lentitud cada 2.5 s. Aparece en biomas fríos. |
| Creeper Musgoso | `litius:creeper_musgoso` | Textura propia de musgo, piedra y liquen, con el **cuerpo curvado hacia atrás como un ")"**, mata de musgo, lianas, hongos y flores de azalea. Antes de explotar suelta una **nube de esporas** (Veneno 6 s + Náusea 8 s, radio 5). Aparece en junglas, pantanos y cuevas frondosas. |
| Zombie Minero | `litius:zombie_minero` | Zombie con casco de cuero, vela y saco, armado con un pico de hierro (8 % de soltarlo). Golpe de pico desde arriba que aplica **Fatiga minera 8 s**. Puede soltar carbón o hierro crudo. Aparece en cuevas (y < 40). |
| Jinete Araña | `litius:jinete_arana` | Esqueleto furtivo (capa y bufanda) montado en una araña (`litius:arana_montura`) que trepa paredes; dispara flechas desde la montura. Aparece de noche en zonas de monstruos. |
| Rey Exiliado (minijefe) | `litius:rey_exiliado` | Esqueleto con corona de oro viejo, capa real carmesí y cetro de calavera. 200 de vida. Golpe de cetro a dos manos. Cada 8–12 s: **invoca 2 Esqueletos Furtivos** (salen del suelo) o lanza un **grito** (Debilidad 6 s + Lentitud, radio 10). 60 de experiencia. Aparece raro en bosques/llanuras. |
| Guardián de Abedul (minijefe) | `litius:guardian_abedul` | Golem de abedul erguido (~3 bloques) con textura detallada, grieta brillante en el pecho y ojos que brillan en la oscuridad. 250 de vida. **Cada 4 s** hace brotar 8 ramas a su alrededor (5). Golpes lentos y pesados (12 + Lentitud). Cerca: **golpe al suelo** con ramas en un área de 3x3 (8 + Lentitud). Lejos: **hilera de ramas** que avanza hasta el jugador (10). Suelta troncos, palos y brotes de abedul; 70 de experiencia. |

### Dimensión: Islas Flotantes (`litius:islas`)

Una dimensión nueva con islas flotantes parecidas a las del End pero más pequeñas:
**musgo por arriba, piedra por abajo** (en forma de cono) y **árboles gigantes de
abedul y roble**. Las islas se generan solas alrededor del jugador mientras explora.
Ahí **solo aparecen los mobs de este addon** (incluidos los minijefes, uno a la vez);
cualquier otro mob se elimina. Los no-muertos del addon no se queman al sol en las islas.

- **Cómo entrar:** fabrica la **Llave de las Islas Flotantes** (musgo arriba, a los lados
  y en medio una brújula, perla de ender abajo) y úsala. Úsala otra vez para volver al
  lugar desde el que saliste. Con trucos: `/litius:islas`.
- Si caes al vacío, el viento te devuelve a la isla central.

> **Requiere el experimento "Beta APIs"** al crear el mundo: las dimensiones
> personalizadas de Bedrock todavía son experimentales y funcionan con script. Sin ese
> experimento el resto del addon funciona igual, pero la dimensión y la llave no.

### Instalación

1. Comprime cada carpeta por separado (el contenido de la carpeta en la raíz del zip):
   ```sh
   (cd LITIUS_Mobs_BP && zip -r ../LITIUS_Mobs_BP.mcpack .)
   (cd LITIUS_Mobs_RP && zip -r ../LITIUS_Mobs_RP.mcpack .)
   ```
   o junta ambos `.mcpack` en un zip y renómbralo a `LITIUS_Mobs.mcaddon`.
2. Abre los archivos con Minecraft, o copia las carpetas a
   `development_behavior_packs/` y `development_resource_packs/` de `com.mojang`.
3. Activa ambos packs en el mundo (el BP activa el RP automáticamente).

Para probar: `/summon litius:esqueleto_furtivo`, `/summon litius:zombie_furtivo`,
`/summon litius:creeper_plus`, `/summon litius:wither_furtivo`,
`/summon litius:esqueleto_exiliante`, `/summon litius:jinete_acorazado`,
`/summon litius:creeze`, `/summon litius:jinete_wither`, `/summon litius:zombie_raxier`,
`/summon litius:ahogado_furtivo`, `/summon litius:momia_errante`, `/summon litius:stray_centinela`,
`/summon litius:creeper_musgoso`, `/summon litius:zombie_minero`, `/summon litius:rey_exiliado`,
`/summon litius:guardian_abedul`, `/summon litius:jinete_arana`.

### Notas técnicas

- La animación de salir del suelo se controla con la propiedad
  `litius:emerging` (sincronizada al cliente). Mientras dura (1.5 s esqueleto,
  1.7 s zombie) el mob no se mueve ni ataca.
- La capa y la bufanda son una segunda geometría (`geometry.litius.capa_bufanda`)
  con los mismos huesos `root`/`body`, así sigue las animaciones del cuerpo.
  Texturas en `LITIUS_Mobs_RP/textures/entity/litius/`.
- Los ataques cuerpo a cuerpo usan `minecraft:behavior.delayed_attack`, así el
  golpe coincide con el momento del rasguño / cabezazo en la animación.
