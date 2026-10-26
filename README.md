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
| Esqueleto Furtivo | `litius:esqueleto_furtivo` | Capa + bufanda. Más rápido (0.29 vs 0.25), detecta a 26 bloques (vanilla 16), dispara ráfagas de 2 flechas cada 1 s. Sale del suelo arrastrándose. Se inclina al caminar/correr y gira; siempre lleva las manos en el arco (reposo, correr y apuntar). |
| Zombie Furtivo | `litius:zombie_furtivo` | Capa + bufanda. Sale del suelo arrastrándose. Se inclina hacia adelante más que el esqueleto. Ataque: rasguño hacia el frente con ambas manos que aplica **Veneno 4 s**. |
| Creeper + | `litius:creeper_plus` | Patas ¼ de bloque más largas y torso un poco más grueso. Se inclina muy ligeramente al caminar. Ataca cuerpo a cuerpo con un cabezazo (cabeza atrás → cabeza y torso hacia adelante). Tras 3–5.5 s cerca del objetivo enciende la mecha, tiembla y explota con potencia 5 (vanilla 3; cargado 9 vs 6). Se apaga si pierde al objetivo. También se puede encender con mechero. |

Los tres aparecen de forma natural de noche / en la oscuridad (igual que sus
versiones vanilla, con menos peso) y tienen huevo de generación en el
inventario creativo.

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
`/summon litius:creeper_plus`.

### Notas técnicas

- La animación de salir del suelo se controla con la propiedad
  `litius:emerging` (sincronizada al cliente). Mientras dura (2.5 s esqueleto,
  2.8 s zombie) el mob no se mueve ni ataca.
- La capa y la bufanda son una segunda geometría (`geometry.litius.capa_bufanda`)
  con los mismos huesos `root`/`body`, así sigue las animaciones del cuerpo.
  Texturas en `LITIUS_Mobs_RP/textures/entity/litius/`.
- Los ataques cuerpo a cuerpo usan `minecraft:behavior.delayed_attack`, así el
  golpe coincide con el momento del rasguño / cabezazo en la animación.
