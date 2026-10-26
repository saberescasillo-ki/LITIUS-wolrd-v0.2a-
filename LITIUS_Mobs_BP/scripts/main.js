// LITIUS Mobs - Dimension de las Islas Flotantes.
// Requiere el experimento "Beta APIs" (las dimensiones personalizadas son experimentales).
import {
  world,
  system,
  Player,
  BlockPermutation,
  BlockVolume,
  CommandPermissionLevel,
  CustomCommandStatus,
} from "@minecraft/server";

const DIM_ID = "litius:islas";
const CELL = 48;                 // tamano de cada zona de generacion
const GEN_RADIUS = 96;           // genera zonas a esta distancia del jugador
const SPAWN = { x: 0.5, y: 99, z: 0.5 };
const RESCUE_Y = 10;             // por debajo de esta altura se rescata al jugador
const MOB_CAP = 10;              // mobs del addon alrededor de cada jugador
const SEED = 7331;

// ---------------------------------------------------------------- registro
system.beforeEvents.startup.subscribe((ev) => {
  ev.dimensionRegistry.registerCustomDimension(DIM_ID);
  ev.customCommandRegistry.registerCommand(
    {
      name: "litius:islas",
      description: "Viaja a las Islas Flotantes (o vuelve de ellas)",
      permissionLevel: CommandPermissionLevel.GameDirectors,
      cheatsRequired: true,
    },
    (origin) => {
      const player = origin.sourceEntity;
      if (!(player instanceof Player)) {
        return { status: CustomCommandStatus.Failure, message: "Solo un jugador puede usar este comando." };
      }
      system.run(() => viajar(player));
      return { status: CustomCommandStatus.Success };
    }
  );
});

// ---------------------------------------------------------------- utilidades
function rng(a, b) {
  // mulberry32 sembrado por la zona: la misma zona siempre genera las mismas islas
  let t = (Math.imul(a, 73856093) ^ Math.imul(b, 19349663) ^ SEED) >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
const ri = (r, a, b) => a + Math.floor(r() * (b - a + 1));
const cellKey = (cx, cz) => `litius:c_${cx}_${cz}`;
const dim = () => world.getDimension(DIM_ID);

const P = {};
function perm(id, states) {
  const key = id + JSON.stringify(states ?? {});
  if (!P[key]) P[key] = BlockPermutation.resolve(id, states);
  return P[key];
}
function set(d, x, y, z, id, states) {
  try {
    d.setBlockPermutation({ x, y, z }, perm(id, states));
  } catch {
    /* fuera de los chunks cargados */
  }
}
function setIfAir(d, x, y, z, id, states) {
  try {
    const b = d.getBlock({ x, y, z });
    if (b && b.isAir) b.setPermutation(perm(id, states));
  } catch {
    /* fuera de los chunks cargados */
  }
}

// ---------------------------------------------------------------- islas
function islasDeZona(cx, cz) {
  const r = rng(cx, cz);
  if (cx === 0 && cz === 0) {
    return [{ x: 0, z: 0, top: 96, radius: 13, trees: [{ x: 6, z: 5, kind: "abedul" }, { x: -6, z: -5, kind: "roble" }], r }];
  }
  if (r() < 0.12) return [];                       // zona vacia: hueco entre islas
  const n = r() < 0.25 ? 2 : 1;
  const out = [];
  for (let i = 0; i < n; i++) {
    const radius = n === 1 ? ri(r, 7, 14) : ri(r, 5, 9);
    const x = cx * CELL + ri(r, radius + 2, CELL - radius - 2);
    const z = cz * CELL + ri(r, radius + 2, CELL - radius - 2);
    const top = ri(r, 78, 122);
    const trees = [];
    const nt = radius >= 10 ? ri(r, 1, 3) : radius >= 7 ? ri(r, 0, 1) : 0;
    for (let t = 0; t < nt; t++) {
      const a = r() * Math.PI * 2;
      const d = r() * radius * 0.45;
      trees.push({ x: Math.round(Math.cos(a) * d), z: Math.round(Math.sin(a) * d), kind: r() < 0.5 ? "abedul" : "roble" });
    }
    out.push({ x, z, top, radius, trees, r });
  }
  return out;
}

function* construirIsla(d, isla) {
  const { x: X, z: Z, top: TOP, radius: R, r } = isla;
  const f1 = r() * 6.28, f2 = r() * 6.28;
  let ops = 0;
  for (let dx = -R - 3; dx <= R + 3; dx++) {
    for (let dz = -R - 3; dz <= R + 3; dz++) {
      const dist = Math.sqrt(dx * dx + dz * dz);
      const th = Math.atan2(dz, dx);
      const edge = R * (1 + 0.13 * Math.sin(3 * th + f1) + 0.08 * Math.sin(5 * th + f2));
      if (dist > edge) continue;
      const t = dist / edge;
      const x = X + dx, z = Z + dz;
      const yTop = TOP + Math.round((1 - t) * 2);
      const depth = Math.max(1, Math.round((1 - Math.pow(t, 1.6)) * R * 1.15) + 1);
      const yBot = yTop - depth;
      // piedra por abajo
      if (yTop - 3 >= yBot) {
        const roll = r();
        const piedra = roll < 0.12 ? "minecraft:andesite" : roll < 0.22 ? "minecraft:cobblestone" : "minecraft:stone";
        try {
          d.fillBlocks(new BlockVolume({ x, y: yBot, z }, { x, y: yTop - 3, z }), piedra);
        } catch {
          /* chunk sin cargar */
        }
        if (r() < 0.25) set(d, x, yTop - 3, z, "minecraft:mossy_cobblestone");
      }
      // tierra y musgo por arriba
      if (yTop - 2 >= yBot) set(d, x, yTop - 2, z, "minecraft:dirt");
      if (yTop - 1 >= yBot) set(d, x, yTop - 1, z, "minecraft:moss_block");
      set(d, x, yTop, z, "minecraft:moss_block");
      // decoracion
      const deco = r();
      if (t < 0.92) {
        if (deco < 0.22) set(d, x, yTop + 1, z, "minecraft:short_grass");
        else if (deco < 0.3) set(d, x, yTop + 1, z, "minecraft:moss_carpet");
        else if (deco < 0.32) set(d, x, yTop + 1, z, r() < 0.5 ? "minecraft:azalea" : "minecraft:flowering_azalea");
      }
      if (++ops % 24 === 0) yield;
    }
  }
  for (const tr of isla.trees) {
    const tx = X + tr.x, tz = Z + tr.z;
    const ty = TOP + Math.round((1 - Math.sqrt(tr.x * tr.x + tr.z * tr.z) / R) * 2) + 1;
    if (tr.kind === "abedul") yield* abedulGigante(d, tx, ty, tz, r);
    else yield* robleGigante(d, tx, ty, tz, r);
  }
}

function* copa(d, cx, cy, cz, rad, leaf, r, density = 0.85) {
  let ops = 0;
  for (let dx = -rad; dx <= rad; dx++) {
    for (let dy = -Math.ceil(rad * 0.7); dy <= Math.ceil(rad * 0.8); dy++) {
      for (let dz = -rad; dz <= rad; dz++) {
        const q = (dx * dx) / (rad * rad) + (dy * dy) / (rad * rad * 0.55) + (dz * dz) / (rad * rad);
        if (q > 1 || r() > density + (1 - q) * 0.3) continue;
        setIfAir(d, cx + dx, cy + dy, cz + dz, leaf, { persistent_bit: true });
        if (++ops % 40 === 0) yield;
      }
    }
  }
}

function* abedulGigante(d, x, y, z, r) {
  const h = ri(r, 16, 22);
  for (let i = 0; i < h; i++) set(d, x, y + i, z, "minecraft:birch_log");
  // ramas cortas
  for (let b = 0; b < 3; b++) {
    const by = y + ri(r, Math.floor(h * 0.55), h - 3);
    const dir = [[1, 0, "x"], [-1, 0, "x"], [0, 1, "z"], [0, -1, "z"]][ri(r, 0, 3)];
    for (let s = 1; s <= 2; s++) set(d, x + dir[0] * s, by, z + dir[1] * s, "minecraft:birch_log", { pillar_axis: dir[2] });
    yield* copa(d, x + dir[0] * 3, by + 1, z + dir[1] * 3, 2, "minecraft:birch_leaves", r);
  }
  yield* copa(d, x, y + h - 2, z, 4, "minecraft:birch_leaves", r);
  yield* copa(d, x, y + h + 1, z, 3, "minecraft:birch_leaves", r);
}

function* robleGigante(d, x, y, z, r) {
  const h = ri(r, 10, 14);
  for (let i = 0; i < h; i++) {
    for (const [ox, oz] of [[0, 0], [1, 0], [0, 1], [1, 1]]) set(d, x + ox, y + i, z + oz, "minecraft:oak_log");
  }
  // raices
  for (const [ox, oz, ax] of [[-1, 0, "x"], [2, 1, "x"], [0, -1, "z"], [1, 2, "z"]]) set(d, x + ox, y, z + oz, "minecraft:oak_log", { pillar_axis: ax });
  // ramas grandes
  for (const [dx, dz, ax] of [[1, 0, "x"], [-1, 0, "x"], [0, 1, "z"], [0, -1, "z"]]) {
    if (r() < 0.3) continue;
    const by = y + h - ri(r, 2, 4);
    for (let s = 1; s <= 4; s++) set(d, x + (dx > 0 ? 1 : 0) + dx * s, by + (s > 2 ? 1 : 0), z + (dz > 0 ? 1 : 0) + dz * s, "minecraft:oak_log", { pillar_axis: ax });
    yield* copa(d, x + dx * 5, by + 2, z + dz * 5, 3, "minecraft:oak_leaves", r);
  }
  yield* copa(d, x, y + h + 1, z, 6, "minecraft:oak_leaves", r, 0.8);
}

// ---------------------------------------------------------------- generacion bajo demanda
const enCurso = new Set();
let ocupado = false;
const cola = [];

function zonaCargada(d, cx, cz) {
  try {
    for (const [ox, oz] of [[0, 0], [CELL - 1, 0], [0, CELL - 1], [CELL - 1, CELL - 1], [CELL / 2, CELL / 2]]) {
      if (!d.isChunkLoaded({ x: cx * CELL + ox, y: 100, z: cz * CELL + oz })) return false;
    }
    return true;
  } catch {
    return false;
  }
}

function generarZona(cx, cz) {
  const key = cellKey(cx, cz);
  if (world.getDynamicProperty(key) || enCurso.has(key)) return Promise.resolve();
  enCurso.add(key);
  return new Promise((resolve) => {
    cola.push({ cx, cz, key, resolve });
    siguiente();
  });
}

function siguiente() {
  if (ocupado || cola.length === 0) return;
  ocupado = true;
  const { cx, cz, key, resolve } = cola.shift();
  const d = dim();
  system.runJob(
    (function* () {
      try {
        for (const isla of islasDeZona(cx, cz)) yield* construirIsla(d, isla);
        world.setDynamicProperty(key, true);
      } catch (e) {
        console.warn(`[LITIUS] error generando zona ${cx},${cz}: ${e}`);
      }
      enCurso.delete(key);
      ocupado = false;
      resolve();
      siguiente();
    })()
  );
}

system.runInterval(() => {
  let d;
  try {
    d = dim();
  } catch {
    return;
  }
  for (const p of d.getPlayers()) {
    const pcx = Math.floor(p.location.x / CELL), pcz = Math.floor(p.location.z / CELL);
    const span = Math.ceil(GEN_RADIUS / CELL);
    for (let cx = pcx - span; cx <= pcx + span; cx++) {
      for (let cz = pcz - span; cz <= pcz + span; cz++) {
        const mx = cx * CELL + CELL / 2 - p.location.x, mz = cz * CELL + CELL / 2 - p.location.z;
        if (mx * mx + mz * mz > GEN_RADIUS * GEN_RADIUS) continue;
        if (world.getDynamicProperty(cellKey(cx, cz)) || enCurso.has(cellKey(cx, cz))) continue;
        if (zonaCargada(d, cx, cz)) generarZona(cx, cz);
      }
    }
    // rescate si cae al vacio
    if (p.location.y < RESCUE_Y) {
      p.teleport(SPAWN, { dimension: d });
      p.addEffect("slow_falling", 200, { showParticles: false });
      p.sendMessage("§aEl viento de las islas te devuelve a la isla central.");
    }
  }
}, 20);

// ---------------------------------------------------------------- viajar
async function viajar(player) {
  if (player.dimension.id === DIM_ID) {
    const ret = player.getDynamicProperty("litius:retorno");
    let dest = { x: 0.5, y: 80, z: 0.5, dim: "minecraft:overworld" };
    try {
      if (ret) dest = JSON.parse(ret);
    } catch {
      /* dato corrupto: usa el valor por defecto */
    }
    player.teleport({ x: dest.x, y: dest.y, z: dest.z }, { dimension: world.getDimension(dest.dim) });
    player.sendMessage("§aHas vuelto de las Islas Flotantes.");
    return;
  }
  player.setDynamicProperty(
    "litius:retorno",
    JSON.stringify({ x: player.location.x, y: player.location.y, z: player.location.z, dim: player.dimension.id })
  );
  player.sendMessage("§eViajando a las Islas Flotantes...");
  const d = dim();
  const area = "litius_islas_llegada";
  let conArea = false;
  try {
    await world.tickingAreaManager.createTickingArea(area, {
      dimension: d,
      from: { x: -24, y: 60, z: -24 },
      to: { x: 24, y: 130, z: 24 },
    });
    conArea = true;
    await generarZona(0, 0);
    await generarZona(-1, 0);
    await generarZona(0, -1);
    await generarZona(-1, -1);
  } catch (e) {
    console.warn(`[LITIUS] sin area de carga: ${e}`);
  }
  player.teleport(SPAWN, { dimension: d });
  player.addEffect("slow_falling", 200, { showParticles: false });
  player.sendMessage("§aBienvenido a las Islas Flotantes. Usa la llave otra vez para volver.");
  if (conArea) system.runTimeout(() => world.tickingAreaManager.removeTickingArea(area), 100);
}

world.afterEvents.itemUse.subscribe(({ source, itemStack }) => {
  if (itemStack?.typeId !== "litius:llave_islas" || !(source instanceof Player)) return;
  viajar(source);
});

// ---------------------------------------------------------------- mobs: solo los del addon
const MOBS = [
  ["litius:esqueleto_furtivo", 10], ["litius:zombie_furtivo", 10], ["litius:creeper_plus", 6],
  ["litius:creeper_musgoso", 6], ["litius:esqueleto_exiliante", 5], ["litius:momia_errante", 5],
  ["litius:stray_centinela", 5], ["litius:zombie_minero", 5], ["litius:ahogado_furtivo", 3],
  ["litius:wither_furtivo", 3], ["litius:creeze", 4], ["litius:jinete_acorazado", 4],
  ["litius:jinete_wither", 2], ["litius:jinete_arana", 4],
  ["litius:zombie_raxier", 1], ["litius:rey_exiliado", 1], ["litius:guardian_abedul", 1],
];
const JEFES = new Set(["litius:zombie_raxier", "litius:rey_exiliado", "litius:guardian_abedul"]);
const TOTAL = MOBS.reduce((s, [, w]) => s + w, 0);
const SUELO = new Set(["minecraft:moss_block", "minecraft:moss_carpet", "minecraft:short_grass"]);

function elegirMob(hayJefe) {
  for (let i = 0; i < 4; i++) {
    let n = Math.random() * TOTAL;
    for (const [id, w] of MOBS) {
      if ((n -= w) <= 0) {
        if (JEFES.has(id) && hayJefe) break;
        return id;
      }
    }
  }
  return "litius:zombie_furtivo";
}

system.runInterval(() => {
  let d;
  try {
    d = dim();
  } catch {
    return;
  }
  for (const p of d.getPlayers()) {
    const cerca = d.getEntities({ location: p.location, maxDistance: 48 }).filter((e) => e.typeId.startsWith("litius:"));
    if (cerca.length >= MOB_CAP) continue;
    const hayJefe = d.getEntities({ location: p.location, maxDistance: 96 }).some((e) => JEFES.has(e.typeId));
    for (let intento = 0; intento < 4; intento++) {
      const a = Math.random() * Math.PI * 2, dist = 18 + Math.random() * 22;
      const x = Math.floor(p.location.x + Math.cos(a) * dist), z = Math.floor(p.location.z + Math.sin(a) * dist);
      try {
        if (!d.isChunkLoaded({ x, y: 100, z })) continue;
        const top = d.getTopmostBlock({ x, z }, 40);
        if (!top || !SUELO.has(top.typeId)) continue;
        d.spawnEntity(elegirMob(hayJefe), { x: x + 0.5, y: top.location.y + 1, z: z + 0.5 });
        break;
      } catch {
        /* chunk sin cargar o posicion invalida */
      }
    }
  }
}, 100);

world.afterEvents.entitySpawn.subscribe(({ entity }) => {
  if (!entity?.isValid || entity.dimension.id !== DIM_ID) return;
  system.runTimeout(() => {
    if (!entity.isValid || entity.typeId === "minecraft:player") return;
    const familia = entity.getComponent("minecraft:type_family");
    if (!familia?.hasTypeFamily("mob")) return;
    if (entity.typeId.startsWith("litius:") || entity.hasTag("litius_invocado")) {
      // en las islas el sol pega fuerte: los no-muertos del addon no se queman
      if (familia.hasTypeFamily("undead")) entity.addEffect("fire_resistance", 20000000, { showParticles: false });
      return;
    }
    entity.remove();
  }, 2);
});
