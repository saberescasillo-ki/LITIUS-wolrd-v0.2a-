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
| Jinete Acorazado | `litius:jinete_acorazado` | Zombie vanilla con armadura de hierro completa y espada de hierro, montado en un caballo zombie (`litius:caballo_acorazado`), todo con texturas y animaciones vanilla. Armadura y espada **nunca se sueltan** (`drop_chance` 0). Aparece en llanuras, sabanas y praderas. |
| Jinete Wither | `litius:jinete_wither` | Wither esqueleto vanilla (40 de vida) con espada de piedra (no la suelta) montado en un caballo esqueleto color wither (`litius:caballo_wither`). Aparece en el Nether. |
| Creeze | `litius:creeze` | Breeze azul (fuego de alma), animaciones vanilla, 48 de vida (breeze: 30). Si su objetivo no es un monstruo, invoca **2 breezes** cada 25 s (`litius:breeze_invocada`: igual al breeze, muere de un golpe, desaparece a los 90 s). Aparece en biomas templados/fríos, cuevas profundas (y < 0) y en el Abedul Furtivo. |
| Zombie Raxier (minijefe) | `litius:zombie_raxier` | Zombie con camiseta café/gris, pantalón café claro, guantes mágicos rojo→celeste, capa y sombrero plano de nieve. 150 de vida, barra de jefe, velocidad de un jugador corriendo, detecta a 40 bloques. 15–4.5 bloques: lanza cargas de viento (1/s). Menos de 4.4: puñetazos. A veces ráfaga de 4 cargas (cada 0.3 s) o se agacha 1 s e invoca **pinchos de aire** bajo cada jugador/golem cercano (5 de daño). Al morir extiende los brazos y se arrodilla. No suelta objetos; da 50 de experiencia (como 10 enemigos). Aparece raro en biomas fríos. |

### Bioma: Abedul Furtivo (`litius:abedul_furtivo`)

Reemplaza parte de los bosques de abedul (y un poco de los bosques normales).
Tiene abedules con tronco 3 veces más alto (15–22 bloques) y hierba. Como no
tiene las etiquetas `monster`/`animal`, ahí **solo aparecen los mobs furtivos, el Exiliante
y el Creeze** (ni mobs vanilla, ni el Creeper +, ni el Wither Furtivo).

> El bioma solo aparece en chunks nuevos (mejor en un mundo nuevo). En versiones
> antiguas del juego puede requerir el experimento **"Custom Biomes"**.

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
`/summon litius:creeze`, `/summon litius:jinete_wither`, `/summon litius:zombie_raxier`. Para el bioma: `/locate biome litius:abedul_furtivo`.

### Notas técnicas

- La animación de salir del suelo se controla con la propiedad
  `litius:emerging` (sincronizada al cliente). Mientras dura (1.5 s esqueleto,
  1.7 s zombie) el mob no se mueve ni ataca.
- La capa y la bufanda son una segunda geometría (`geometry.litius.capa_bufanda`)
  con los mismos huesos `root`/`body`, así sigue las animaciones del cuerpo.
  Texturas en `LITIUS_Mobs_RP/textures/entity/litius/`.
- Los ataques cuerpo a cuerpo usan `minecraft:behavior.delayed_attack`, así el
  golpe coincide con el momento del rasguño / cabezazo en la animación.
