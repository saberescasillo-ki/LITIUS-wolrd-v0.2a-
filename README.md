# LITIUS-wolrd-v0.2a-
LITIUS wolrd more serius

## LITIUS Mobs 1.0 (addon para Minecraft Bedrock)

Rehecho desde cero. Dos packs: `LITIUS_Mobs_BP` (comportamiento) y `LITIUS_Mobs_RP` (recursos).
No necesita experimentos.

### Mutaciones directas (sin huevo propio)

Cuando aparece uno de estos mobs vanilla (de forma natural, con su huevo o con `/summon`),
hay un **25 %** de que salga **mejorado**; el 75 % restante es el mob vanilla de siempre
(con sus variantes vanilla). **Los bebés nunca mutan.** El zombie tiene dos mutaciones:
70 % vanilla, 20 % mejorado y 10 % escalador.

| Mob | Mejora |
|-----|--------|
| Zombie | +0.5 bloques de alto, +35 % de vida, algo más rápido. Más probable que lleve armadura y arma (no asegurado) y menos probable que las suelte (3 %). **No se convierte en ahogado**, nada y va algo más rápido que un jugador nadando. |
| Zombie escalador | Sube bloques caminando, salta muros de 2 bloques y es más rápido. |
| Ahogado | Lo mismo que el zombie mejorado pero adaptado: siempre con **tridente**, armadura posible, nada más rápido. |
| Esqueleto | +0.4 bloques de alto, +25 % de vida, misma velocidad. **Usa espada en vez de arco**; puede llevar armadura; suelta poco lo que lleva (3 %). |
| Hoglin | +0.3 bloques, +35 % de velocidad, +10 % de vida; sus golpes dan **Lentitud I 5 s**. |
| Lepisma (silverfish) | +0.5 bloques de alto (hitbox a la mitad), +50 % de vida y de daño; sus golpes dan **Lentitud I 3 s**. |
| Endermite | Igual que la lepisma, con la hitbox un 25 % más pequeña. |
| Blaze | +0.2 bloques, más vida, más rápido; dispara **ráfagas de 5 bolas de fuego** más seguidas (vanilla: 3). |
| Enderman | +0.3 bloques, +30 % de vida, +20 % de velocidad (tranquilo y enojado). |
| Piglin zombie | +0.3 bloques, +35 % de vida, algo más rápido, siempre espada de oro y armadura de oro posible (suelta poco). |
| Phantom | +0.5 bloques (el doble de tamaño, hitbox un 25 % más pequeña), más rápido, más vida, **mismo daño**. |

### Jinetes (con huevo propio)

El jinete y la montura **atacan los dos**, así que si uno muere el otro sigue peleando.
Usan el comportamiento y el aspecto vanilla de cada mob; las monturas tienen **animaciones de ataque** (coz, cabezazo o mordisco) y bajan la cabeza al cargar. Las armas y armaduras se sueltan poco (3 %).

| Mob | Montura | Detalles |
|-----|---------|----------|
| Esqueleto Espadachín en Araña (`litius:esqueleto_arana`) | Araña | Esqueleto con espada (sin arco), puede llevar armadura. Aparece de noche en el Overworld. |
| Jinete Wither (`litius:jinete_wither`) | Caballo esqueleto color wither | Wither esqueleto con espada. Caballo **15 % más rápido que un hoglin corriendo**. Aparece en el Nether. |
| Jinete Zombie (`litius:jinete_zombie`) | Caballo zombie | Zombie con espada y armadura posible. Caballo **10 % más rápido que un jugador corriendo**. Aparece de noche en el Overworld. |
| Jinete Esqueleto (`litius:jinete_esqueleto`) | Caballo esqueleto | Casco de hierro y espada (70 %); mutaciones del mismo huevo: **hacha** (15 %) o **arco** (15 %). Aparece de noche en el Overworld. |
| Jinete Husk (`litius:jinete_husk`) | Camello zombie | Husk con espada y armadura posible. Camello **un poco más rápido que un jugador**. Aparece en desiertos. |

> Las velocidades de las monturas se calcularon tomando que un hoglin corriendo va
> más o menos tan rápido como un jugador corriendo.

### Instalación

1. Abre `LITIUS_Mobs.mcaddon` con Minecraft (o los dos `.mcpack`).
2. Activa el pack de comportamiento en el mundo (el de recursos se activa solo).

Para probar: `/summon zombie` (repite hasta ver uno grande), `/summon litius:jinete_zombie`,
`/summon litius:jinete_husk`, `/summon litius:jinete_wither`, `/summon litius:esqueleto_arana`.

### Notas técnicas

- Las mutaciones reemplazan los archivos de comportamiento vanilla de esos mobs (copiados
  de la versión actual del juego) y añaden una propiedad `litius:mejorado`. Si una futura
  versión de Minecraft cambia esos mobs, conviene regenerar el addon.
- El generador está pensado para ejecutarse con los archivos de `Mojang/bedrock-samples`.
