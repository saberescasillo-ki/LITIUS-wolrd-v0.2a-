# LITIUS-wolrd-v0.2a-
LITIUS wolrd more serius

## LITIUS Mobs 1.9 (addon para Minecraft Bedrock)

Rehecho desde cero. Dos packs: `LITIUS_Mobs_BP` (comportamiento) y `LITIUS_Mobs_RP` (recursos).
No necesita experimentos. Requiere Minecraft **1.26.60** o más nuevo.

**Compatible con packs de texturas y de animaciones:** el addon no reemplaza ningún archivo de aspecto
(cliente) de los mobs vanilla. Las mutaciones que tienen aspecto propio (zombie escalador, esqueletos
mejorado/de cueva/soldado, stray mejorado/soldado, bogged soldado, enderman mejorado y toro) son mobs
aparte que usan el comportamiento del mob vanilla. Así, un pack que randomiza texturas o cambia las
animaciones de los mobs vanilla funciona igual con este addon.

### Mutaciones directas (sin huevo propio)

Cuando aparece uno de estos mobs vanilla (de forma natural, con su huevo o con `/summon`),
hay un **25 %** de que salga **mejorado**; el 75 % restante es el mob vanilla de siempre
(con sus variantes vanilla). **Los bebés nunca mutan.** El zombie tiene tres mutaciones:
45 % vanilla, 20 % mejorado, 20 % escalador y 15 % acorazado. Las variantes mejoradas son **pesadas**
(resisten la mitad del empuje de los golpes).
El husk: 50 % vanilla, 25 % mejorado y 25 % con espada y casco.

| Mob | Mejora |
|-----|--------|
| Zombie | +0.5 bloques de alto, +35 % de vida, algo más rápido. Puede llevar armadura (con menos probabilidad que antes) y arma, y es poco probable que las suelte (3 %). **No se convierte en ahogado**, nada y va algo más rápido que un jugador nadando. |
| Zombie acorazado | Siempre lleva **armadura completa** de un solo material: cuero (30 %), malla (22 %), oro (18 %), hierro (18 %), diamante (9 %) o netherita (3 %). Cada pieza se suelta con más probabilidad cuanto menos valiosa es: cuero 10 %, oro 8 %, malla 6 %, hierro 4 %, diamante 2 %, netherita 1 %. **Sí se puede ahogar** (se convierte en ahogado). |
| Zombie escalador | Sube bloques caminando, salta muros de 2 bloques y es más rápido. Su piel es un poco más pálida para reconocerlo. |
| Husk mejorado | Igual que el zombie mejorado (+0.5 bloques, +35 % de vida, algo más rápido, armadura y arma posibles). |
| Husk con espada y casco | Siempre lleva **espada** (hierro, piedra u oro) y **casco**. |
| Ahogado | Lo mismo que el zombie mejorado pero adaptado: siempre con **tridente**, armadura posible, nada más rápido. |
| Esqueleto (35 % vanilla / 15 % mejorado / 12 % cueva / 12 % lentitud / 12 % oscuridad / 14 % soldado) | Mejorado: +0.4 bloques de alto, +25 % de vida, misma velocidad. **Usa espada en vez de arco**; puede llevar armadura; suelta poco lo que lleva (3 %). |
| Esqueleto de cueva | Sin armas, pelea cuerpo a cuerpo; aspecto de piedra con musgo y liquen y **estalactitas de dripstone** en hombros, cabeza, espalda y piernas. Sus golpes dan **Lentitud I 4 s**. |
| Esqueleto de lentitud | Sus flechas dan **Lentitud I 2 s**. |
| Esqueleto de oscuridad | Sus flechas dan **Oscuridad 2 s**. |
| Esqueleto / Stray / Bogged soldado | Siempre con **espada y casco**; pelea cuerpo a cuerpo con animaciones de espada. |
| Esqueleto wither | 20 %: soldado con **espada de hierro y casco**. |
| Hoglin | +0.3 bloques, +35 % de velocidad, +10 % de vida; sus golpes dan **Lentitud I 5 s**. |
| Lepisma (silverfish) | +0.5 bloques de alto (hitbox a la mitad), +50 % de vida y de daño; sus golpes dan **Lentitud I 3 s**. |
| Endermite | Igual que la lepisma, con la hitbox un 25 % más pequeña. |
| Blaze | +0.2 bloques, más vida, más rápido; dispara **ráfagas de 5 bolas de fuego** más seguidas (vanilla: 3). |
| Enderman | +0.3 bloques, +30 % de vida, +20 % de velocidad. **Ojos verdes**, piel algo más pálida y un **cristal verde brillante** incrustado en el pecho. |
| Piglin zombie | +0.3 bloques, +35 % de vida, algo más rápido, siempre espada de oro y armadura de oro posible (suelta poco). |
| Toro | **No se puede empujar.** Modelo y **5 texturas originales** del toro, según el clima: templado (naranja, rojizo o marrón oscuro), cálido (naranja con negro, naranja o rojizo) o frío (blanco o marrón oscuro). En la naturaleza sale en manadas de **1 toro + 3 vacas** o **2 toros + 4 vacas**; una vaca con huevo o `/summon` tiene un 25 % de ser toro, y entonces viene con 3 vacas. Se enfurece y te persigue 30 s si **le pegas a él o a una vaca cercana**. |
| Stray (60 % vanilla / 22 % mejorado / 18 % soldado) | Mejorado: dispara **3 flechas seguidas** de Lentitud, con poco tiempo entre ráfagas, y su paleta es algo más pálida. |
| Bogged (60 % vanilla / 22 % mejorado / 18 % soldado) | Mejorado: dispara **3 flechas seguidas**, con poco tiempo entre ráfagas, y tiene el **doble de vida**. |
| Phantom | +0.5 bloques (el doble de tamaño, hitbox un 25 % más pequeña), más rápido, más vida, **mismo daño**. |

### Cambios generales

- **Todos los mobs hostiles** detectan al jugador **5 bloques más lejos** (incluye arañas, husks, brujas, illagers, piglins, ghasts, slimes, etc.).
- **No muertos con casco:** zombies, esqueletos, strays, bogged, ahogados, aldeanos zombie y los jinetes que se queman tienen un **45 %** de salir con casco
  (cuero 50 %, malla 20 %, hierro 15 %, oro 15 %); con casco no arden al sol. El zombie acorazado y el Jinete Esqueleto siempre lo llevan. Los phantoms no pueden llevar casco y siguen ardiendo como en vanilla.
- **Esqueletos, strays y bogged disparan más seguido:** cada 1.4–1.9 s (1.0–1.4 s en difícil); vanilla dispara cada 3 s (2 s en difícil).
- **Creepers** un 10 % más rápidos.

### Aparición natural

| Mob | Peso | Grupo | Dónde |
|-----|------|-------|-------|
| Jinete Zombie | 18 | 1 | Overworld de noche (no desierto ni océano) |
| Jinete Esqueleto | 14 | 1 | Overworld de noche (no océano) |
| Esqueleto en Araña | 14 | 1 | Overworld de noche (no océano) |
| Jinete Husk | 70 | 1 | Desiertos de noche (allí hay muchos más husks) |
| Jinete Wither | 25 / 11 | 1 | Páramos del Nether / valle de almas |
| Vacas | 8 / 2 / 1 | 2–3 vacas / 1 toro + 3 vacas / 2 toros + 4 vacas | Igual que vanilla |
| Manada de zombies | 3 | 3 zombies + 1 zombie mejorado | Igual que el zombie (vanilla: peso 100, grupos de 2–4) |
| Araña | 80 | 1–3 | Igual que vanilla (vanilla: peso 100, sola) |
| Araña de cueva | 80 | 1–2 | Cuevas del Overworld (no Deep Dark) |
| Bogged | 40 / 10 / 12 | 1–2 | Pantanos y manglares / junglas y bosques oscuros / cuevas frondosas |
| Otros animales de granja | vanilla | vanilla +2 (mínimo 4) | Igual que vanilla |

Entre todos los jinetes sale **más o menos 1 de cada 15–18 monstruos** en cada zona (Overworld, desierto y Nether).
Cada tipo de jinete tiene un **límite de 3** cerca del jugador.

### Animaciones de los esqueletos

Todos los esqueletos (normales, mutados y jinetes) se animan según lo que llevan en la mano:
con **arco** apuntan como en vanilla; con **espada o hacha** se ponen en guardia y dan tajos con el arma;
**sin arma** (esqueleto de cueva) atacan con los brazos al frente.

### Creeper (todos)

Explosión **+1** (4 normal, 7 cargado) y también ataca a **golems de hierro, de nieve, de cobre y lobos** (los gatos le siguen dando miedo).

### Jinetes (con huevo propio)

El jinete y la montura **atacan los dos**: la montura pisotea a quien toque mientras lleva jinete y, si el jinete muere, sigue persiguiendo y atacando. **Los jugadores no pueden montar estas monturas**, las monturas **no se queman con el sol** y las monturas zombie
(caballo y camello) **no se pueden empujar**. Jinetes y monturas detectan a 45 bloques y los jinetes tienen **+0.3 bloques de alcance**
cuerpo a cuerpo para llegar desde la montura.
Usan el comportamiento y el aspecto vanilla de cada mob; las monturas tienen **animaciones de ataque** (coz, cabezazo o mordisco) y bajan la cabeza al cargar. Las armas y armaduras se sueltan poco (3 %).

| Mob | Montura | Detalles |
|-----|---------|----------|
| Esqueleto Espadachín en Araña (`litius:esqueleto_arana`) | Araña | Esqueleto con espada (sin arco), puede llevar armadura. Aparece de noche en el Overworld. |
| Jinete Wither (`litius:jinete_wither`) | Caballo esqueleto color wither | Wither esqueleto con espada. Caballo del **color del wither esqueleto**, **15 % más rápido que un hoglin corriendo**. Aparece en el Nether. |
| Jinete Zombie (`litius:jinete_zombie`) | Caballo zombie | Zombie con espada y armadura posible. Caballo **10 % más rápido que un jugador corriendo**. Aparece de noche en el Overworld. |
| Jinete Esqueleto (`litius:jinete_esqueleto`) | Caballo esqueleto | Casco de hierro y espada (70 %); mutaciones del mismo huevo: **hacha** (15 %) o **arco** (15 %, dispara cada 1.2–1.6 s). Aparece de noche en el Overworld. |
| Jinete Husk (`litius:jinete_husk`) | Camello zombie | Husk con espada y armadura posible. Camello **un poco más rápido que un jugador** (antes iba demasiado rápido). Aparece en desiertos. |

> Las velocidades de las monturas se calcularon tomando que un hoglin corriendo va
> más o menos tan rápido como un jugador corriendo.

### Instalación

1. Abre `LITIUS_Mobs.mcaddon` con Minecraft (o los dos `.mcpack`).
2. Activa el pack de comportamiento en el mundo (el de recursos se activa solo).

Para probar: `/summon zombie` (repite hasta ver uno grande), `/summon litius:jinete_zombie`,
`/summon litius:jinete_husk`, `/summon litius:jinete_wither`, `/summon litius:esqueleto_arana`,
`/summon litius:jinete_esqueleto`.

### Notas técnicas

- Las mutaciones reemplazan los archivos de comportamiento vanilla de esos mobs (copiados
  de la versión actual del juego) y añaden una propiedad `litius:mejorado`. Si una futura
  versión de Minecraft cambia esos mobs, conviene regenerar el addon.
- El generador está pensado para ejecutarse con los archivos de `Mojang/bedrock-samples`.
