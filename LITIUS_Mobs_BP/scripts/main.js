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
const MOB_CAP = 12;              // mobs alrededor de cada jugador
const SIM_CHUNKS = 4;             // radio de simulacion alrededor de cada jugador (en chunks)
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
const TIPOS = [["pradera", 22], ["bosque", 18], ["lago", 12], ["pico", 12], ["rocas", 10], ["ruinas", 12], ["azalea", 14]];
const TIPOS_TOTAL = TIPOS.reduce((a, [, w]) => a + w, 0);
function tipoAleatorio(r) {
  let n = r() * TIPOS_TOTAL;
  for (const [t, w] of TIPOS) if ((n -= w) <= 0) return t;
  return "pradera";
}

function islasDeZona(cx, cz) {
  const r = rng(cx, cz);
  if (cx === 0 && cz === 0) return [{ tipo: "spawn", r }];
  if (r() < 0.12) return [];                       // zona vacia: hueco entre islas
  const tipo = tipoAleatorio(r);
  const out = [];
  if (tipo === "rocas") {                          // archipielago de rocas pequenas
    const n = ri(r, 4, 7);
    for (let i = 0; i < n; i++) {
      out.push({ tipo, x: cx * CELL + ri(r, 6, CELL - 6), z: cz * CELL + ri(r, 6, CELL - 6), top: ri(r, 72, 130),
                 radius: ri(r, 2, 4), stretch: 1 + r() * 0.5, angle: r() * 6.28, trees: [], r });
    }
  } else {
    const n = tipo === "pradera" && r() < 0.3 ? 2 : 1;
    for (let i = 0; i < n; i++) {
      const radius = n === 2 ? ri(r, 5, 9) : tipo === "pico" ? ri(r, 6, 9) : ri(r, 8, 15);
      const stretch = 1 + r() * 0.7;              // islas alargadas o redondas
      const reach = Math.ceil(radius * stretch) + 2;
      const x = cx * CELL + ri(r, Math.min(reach, CELL / 2), Math.max(CELL - reach, CELL / 2));
      const z = cz * CELL + ri(r, Math.min(reach, CELL / 2), Math.max(CELL - reach, CELL / 2));
      const trees = [];
      const nt = { bosque: ri(r, 3, 5), pradera: ri(r, 0, 2), lago: ri(r, 0, 1), ruinas: ri(r, 0, 1), azalea: ri(r, 2, 4), pico: ri(r, 0, 1) }[tipo];
      for (let t = 0; t < nt; t++) {
        const a = r() * Math.PI * 2;
        const d = (tipo === "lago" ? 0.6 + r() * 0.2 : r() * 0.55) * radius;
        trees.push({ x: Math.round(Math.cos(a) * d), z: Math.round(Math.sin(a) * d),
                     kind: tipo === "azalea" ? "azalea" : r() < 0.5 ? "abedul" : "roble" });
      }
      out.push({ tipo, x, z, top: ri(r, 72, 128), radius, stretch, angle: r() * 6.28, trees, r });
    }
  }
  // la isla del spawn y sus rocas ocupan ~45 bloques: nada se genera encima
  return out.filter((i) => Math.hypot(i.x, i.z) - (i.radius * i.stretch * 1.25 + 2) > 46);
}

function forma(isla, dx, dz) {
  // distancia normalizada (0 centro, 1 borde) de una isla elipsoidal con borde irregular
  const { radius: R, stretch: S, angle: A, f1, f2 } = isla;
  const ca = Math.cos(A), sa = Math.sin(A);
  const u = (dx * ca + dz * sa) / S, v = -dx * sa + dz * ca;
  const th = Math.atan2(v, u);
  const edge = R * (1 + 0.13 * Math.sin(3 * th + f1) + 0.08 * Math.sin(5 * th + f2));
  return Math.sqrt(u * u + v * v) / edge;
}

function* construirIsla(d, isla) {
  if (isla.tipo === "spawn") return yield* construirSpawn(d, isla.r);
  const { x: X, z: Z, top: TOP, radius: R, r, tipo } = isla;
  isla.f1 = r() * 6.28; isla.f2 = r() * 6.28;
  const reach = Math.ceil(R * isla.stretch * 1.25) + 2;
  let ops = 0;
  for (let dx = -reach; dx <= reach; dx++) {
    for (let dz = -reach; dz <= reach; dz++) {
      const t = forma(isla, dx, dz);
      if (t > 1) continue;
      const x = X + dx, z = Z + dz;
      let yTop = TOP + Math.round((1 - t) * 2);
      if (tipo === "pico") yTop = TOP + Math.round(Math.pow(1 - t, 2) * R * 1.6);
      const depth = Math.max(1, Math.round((1 - Math.pow(t, 1.6)) * R * (tipo === "rocas" ? 1.4 : 1.15)) + 1);
      const yBot = yTop - depth;
      // piedra por abajo (con algo de mineral)
      if (yTop - 3 >= yBot) {
        const roll = r();
        const piedra = roll < 0.12 ? "minecraft:andesite" : roll < 0.22 ? "minecraft:cobblestone" : "minecraft:stone";
        try {
          d.fillBlocks(new BlockVolume({ x, y: yBot, z }, { x, y: yTop - 3, z }), piedra);
        } catch {
          /* chunk sin cargar */
        }
        const ore = r();
        if (ore < 0.05) set(d, x, ri(r, yBot, yTop - 3), z, ore < 0.012 ? "minecraft:iron_ore" : ore < 0.02 ? "minecraft:copper_ore" : "minecraft:coal_ore");
        if (r() < 0.25) set(d, x, yTop - 3, z, "minecraft:mossy_cobblestone");
      }
      if ((tipo === "azalea" || tipo === "bosque") && r() < 0.06) set(d, x, yBot - 1, z, "minecraft:hanging_roots");
      const capa = tipo === "pico" && t < 0.45 && r() < 0.6 ? "minecraft:stone" : "minecraft:moss_block";
      const tierra = tipo === "azalea" ? "minecraft:dirt_with_roots" : "minecraft:dirt";
      if (yTop - 2 >= yBot) set(d, x, yTop - 2, z, tierra);
      if (yTop - 1 >= yBot) set(d, x, yTop - 1, z, capa === "minecraft:stone" ? "minecraft:stone" : "minecraft:moss_block");
      // lago: agua en el centro con arcilla debajo
      if (tipo === "lago" && t < 0.38) {
        set(d, x, yTop - 1, z, "minecraft:clay");
        set(d, x, yTop, z, "minecraft:water");
        if (r() < 0.08) set(d, x, yTop + 1, z, "minecraft:waterlily");
      } else {
        set(d, x, yTop, z, capa);
        const deco = r();
        if (t < 0.92 && capa === "minecraft:moss_block") {
          if (deco < (tipo === "bosque" ? 0.32 : 0.2)) set(d, x, yTop + 1, z, r() < 0.25 ? "minecraft:fern" : "minecraft:short_grass");
          else if (deco < 0.27) set(d, x, yTop + 1, z, "minecraft:moss_carpet");
          else if (deco < (tipo === "azalea" ? 0.36 : 0.29)) set(d, x, yTop + 1, z, r() < 0.5 ? "minecraft:azalea" : "minecraft:flowering_azalea");
          else if (deco < 0.31) set(d, x, yTop + 1, z, r() < 0.5 ? "minecraft:dandelion" : "minecraft:poppy");
        }
      }
      if (++ops % 24 === 0) yield;
    }
  }
  if (tipo === "ruinas") yield* ruinas(d, X, TOP, Z, R, r);
  for (const tr of isla.trees) {
    const tx = X + tr.x, tz = Z + tr.z;
    const ty = TOP + Math.round((1 - forma(isla, tr.x, tr.z)) * 2) + 1;
    if (tr.kind === "abedul") yield* abedulGigante(d, tx, ty, tz, r);
    else if (tr.kind === "roble") yield* robleGigante(d, tx, ty, tz, r);
    else yield* azaleaArbol(d, tx, ty, tz, r);
  }
}

function* ruinas(d, X, TOP, Z, R, r) {
  const n = ri(r, 4, 7);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + r() * 0.3, rad = R * 0.55;
    const x = X + Math.round(Math.cos(a) * rad), z = Z + Math.round(Math.sin(a) * rad);
    const y = TOP + 2, h = ri(r, 1, 5);
    for (let k = 0; k < h; k++) set(d, x, y + k, z, r() < 0.4 ? "minecraft:cracked_stone_bricks" : "minecraft:mossy_stone_bricks");
    yield;
  }
  for (let dx = -2; dx <= 2; dx++) for (let dz = -2; dz <= 2; dz++) if (r() < 0.7) set(d, X + dx, TOP + 2, Z + dz, "minecraft:mossy_stone_bricks");
}

function* azaleaArbol(d, x, y, z, r) {
  const h = ri(r, 5, 8);
  for (let i = 0; i < h; i++) set(d, x, y + i, z, "minecraft:oak_log");
  set(d, x, y - 1, z, "minecraft:dirt_with_roots");
  for (let dx = -3; dx <= 3; dx++) {
    for (let dy = -1; dy <= 2; dy++) {
      for (let dz = -3; dz <= 3; dz++) {
        if (dx * dx + dz * dz + dy * dy * 2 > 11 || r() < 0.15) continue;
        setIfAir(d, x + dx, y + h - 1 + dy, z + dz, r() < 0.35 ? "minecraft:azalea_leaves_flowered" : "minecraft:azalea_leaves", { persistent_bit: true });
      }
    }
    yield;
  }
}

// ---------------------------------------------------------------- isla del spawn
function* construirSpawn(d, r) {
  // Isla grande y plana con plaza de piedra, pilares con faroles, arbol ancestral,
  // estanque con cascada al vacio y rocas satelite. El jugador aparece en 0 99 0.
  const R = 26;
  const isla = { radius: R, stretch: 1, angle: 0, f1: 0.7, f2: 2.1 };
  let ops = 0;
  for (let dx = -R - 6; dx <= R + 6; dx++) {
    for (let dz = -R - 6; dz <= R + 6; dz++) {
      const t = forma(isla, dx, dz);
      if (t > 1) continue;
      const yTop = t < 0.3 ? 98 : 98 - Math.round((t - 0.3) * 5);
      const yBot = yTop - Math.max(2, Math.round((1 - Math.pow(t, 1.5)) * R * 1.45) + 1);
      try {
        d.fillBlocks(new BlockVolume({ x: dx, y: yBot, z: dz }, { x: dx, y: yTop - 3, z: dz }), r() < 0.2 ? "minecraft:deepslate" : "minecraft:stone");
      } catch {
        /* chunk sin cargar */
      }
      if (r() < 0.06) set(d, dx, ri(r, yBot, yTop - 3), dz, r() < 0.3 ? "minecraft:iron_ore" : "minecraft:coal_ore");
      if (r() < 0.05) set(d, dx, yBot - 1, dz, "minecraft:hanging_roots");
      set(d, dx, yTop - 2, dz, "minecraft:dirt");
      set(d, dx, yTop - 1, dz, "minecraft:moss_block");
      set(d, dx, yTop, dz, "minecraft:moss_block");
      const deco = r();
      if (t > 0.3 && t < 0.95) {
        if (deco < 0.25) set(d, dx, yTop + 1, dz, "minecraft:short_grass");
        else if (deco < 0.31) set(d, dx, yTop + 1, dz, r() < 0.5 ? "minecraft:dandelion" : "minecraft:poppy");
        else if (deco < 0.34) set(d, dx, yTop + 1, dz, "minecraft:flowering_azalea");
      }
      if (++ops % 24 === 0) yield;
    }
  }
  // plaza circular de piedra con el centro tallado (aqui aparece el jugador)
  for (let dx = -7; dx <= 7; dx++) {
    for (let dz = -7; dz <= 7; dz++) {
      const q = dx * dx + dz * dz;
      if (q > 49) continue;
      for (let y = 99; y <= 103; y++) set(d, dx, y, dz, "minecraft:air");
      set(d, dx, 98, dz, q <= 1 ? "minecraft:chiseled_stone_bricks" : q > 36 ? "minecraft:mossy_stone_bricks" : r() < 0.3 ? "minecraft:mossy_stone_bricks" : "minecraft:stone_bricks");
    }
    yield;
  }
  // pilares con faroles
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const x = Math.round(Math.cos(a) * 7.5), z = Math.round(Math.sin(a) * 7.5);
    for (let y = 99; y <= 102; y++) set(d, x, y, z, y === 102 ? "minecraft:chiseled_stone_bricks" : "minecraft:mossy_stone_bricks");
    set(d, x, 103, z, "minecraft:lantern");
  }
  // camino al arbol ancestral
  for (let x = 8; x <= 14; x++) for (let z = -1; z <= 1; z++) set(d, x, 98, z, r() < 0.5 ? "minecraft:mossy_stone_bricks" : "minecraft:stone_bricks");
  yield* arbolAncestral(d, 17, 99, -1, r);
  // estanque con cascada que cae al vacio
  for (let dx = -3; dx <= 3; dx++) {
    for (let dz = -3; dz <= 3; dz++) {
      if (dx * dx + dz * dz > 9) continue;
      set(d, -14 + dx, 97, 8 + dz, "minecraft:clay");
      set(d, -14 + dx, 98, 8 + dz, "minecraft:water");
      if (r() < 0.1) set(d, -14 + dx, 99, 8 + dz, "minecraft:waterlily");
    }
  }
  for (let x = -17; x >= -27; x--) set(d, x, 98, 8, "minecraft:water");
  yield;
  // rocas satelite flotando alrededor
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2 + 0.4;
    const roca = { tipo: "rocas", x: Math.round(Math.cos(a) * ri(r, 34, 40)), z: Math.round(Math.sin(a) * ri(r, 34, 40)),
                   top: ri(r, 92, 112), radius: ri(r, 2, 3), stretch: 1, angle: 0, trees: [], r };
    yield* construirIsla(d, roca);
  }
}

function* arbolAncestral(d, x, y, z, r) {
  const h = 26;
  for (let i = 0; i < h; i++) {
    for (let ox = 0; ox < 3; ox++) for (let oz = 0; oz < 3; oz++) set(d, x + ox, y + i, z + oz, "minecraft:oak_log");
    if (i % 4 === 0) yield;
  }
  for (const [ox, oz, ax] of [[-1, 1, "x"], [3, 1, "x"], [1, -1, "z"], [1, 3, "z"], [-2, 1, "x"], [4, 1, "x"]]) set(d, x + ox, y, z + oz, "minecraft:oak_log", { pillar_axis: ax });
  for (const [dx, dz, ax] of [[1, 0, "x"], [-1, 0, "x"], [0, 1, "z"], [0, -1, "z"], [1, 1, "x"], [-1, -1, "z"]]) {
    const by = y + ri(r, 15, 21);
    for (let s = 1; s <= 6; s++) set(d, x + 1 + dx * (s + 1), by + Math.floor(s / 2), z + 1 + dz * (s + 1), "minecraft:oak_log", { pillar_axis: ax });
    yield* copa(d, x + 1 + dx * 8, by + 4, z + 1 + dz * 8, 4, "minecraft:oak_leaves", r);
  }
  yield* copa(d, x + 1, y + h + 1, z + 1, 9, "minecraft:oak_leaves", r, 0.82);
  yield* copa(d, x + 1, y + h - 4, z + 1, 7, "minecraft:birch_leaves", r, 0.5);
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

// ---------------------------------------------------------------- simulacion de 4 chunks alrededor de cada jugador
const areas = new Map(); // id del jugador -> { id, x, z, pendiente }

async function moverArea(player, d) {
  const key = player.id;
  const prev = areas.get(key);
  const cx = Math.floor(player.location.x / 16) * 16, cz = Math.floor(player.location.z / 16) * 16;
  if (prev && (prev.pendiente || (Math.abs(prev.x - cx) < 32 && Math.abs(prev.z - cz) < 32))) return;
  const id = `litius_sim_${key}`.replace(/[^a-zA-Z0-9_]/g, "_");
  areas.set(key, { id, x: cx, z: cz, pendiente: true });
  try {
    if (prev) world.tickingAreaManager.removeTickingArea(prev.id);
  } catch {
    /* ya no existia */
  }
  const r = SIM_CHUNKS * 16;
  try {
    await world.tickingAreaManager.createTickingArea(id, {
      dimension: d,
      from: { x: cx - r, y: 0, z: cz - r },
      to: { x: cx + r + 15, y: 250, z: cz + r + 15 },
    });
  } catch (e) {
    console.warn(`[LITIUS] no se pudo crear el area de simulacion: ${e}`);
  }
  areas.set(key, { id, x: cx, z: cz, pendiente: false });
}

function limpiarAreas(presentes) {
  for (const [key, a] of areas) {
    if (presentes.has(key) || a.pendiente) continue;
    try {
      world.tickingAreaManager.removeTickingArea(a.id);
    } catch {
      /* ya no existia */
    }
    areas.delete(key);
  }
}

// ---------------------------------------------------------------- bucle principal de las islas
system.runInterval(() => {
  let d;
  try {
    d = dim();
  } catch {
    return;
  }
  const presentes = new Set();
  for (const p of d.getPlayers()) {
    presentes.add(p.id);
    moverArea(p, d);
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
  limpiarAreas(presentes);
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
    // la isla del spawn y sus rocas satelite ocupan unos 45 bloques alrededor del 0 0
    await world.tickingAreaManager.createTickingArea(area, {
      dimension: d,
      from: { x: -48, y: 40, z: -48 },
      to: { x: 47, y: 140, z: 47 },
    });
    conArea = true;
    await generarZona(0, 0);
  } catch (e) {
    console.warn(`[LITIUS] sin area de carga: ${e}`);
  }
  // siempre se aparece en el centro de la plaza de la isla del spawn: 0 99 0
  player.teleport(SPAWN, { dimension: d, rotation: { x: 0, y: 0 } });
  player.addEffect("slow_falling", 100, { showParticles: false });
  player.sendMessage("§aBienvenido a las Islas Flotantes. Usa la llave otra vez para volver.");
  if (conArea) system.runTimeout(() => world.tickingAreaManager.removeTickingArea(area), 200);
}

world.afterEvents.itemUse.subscribe(({ source, itemStack }) => {
  if (itemStack?.typeId !== "litius:llave_islas" || !(source instanceof Player)) return;
  viajar(source);
});

// ---------------------------------------------------------------- mobs: cualquier mob puede aparecer
const ADDON = [
  ["litius:esqueleto_furtivo", 10], ["litius:zombie_furtivo", 10], ["litius:creeper_plus", 6],
  ["litius:creeper_musgoso", 6], ["litius:esqueleto_exiliante", 5], ["litius:momia_errante", 5],
  ["litius:stray_centinela", 5], ["litius:zombie_minero", 5], ["litius:ahogado_furtivo", 3],
  ["litius:wither_furtivo", 3], ["litius:creeze", 4], ["litius:jinete_acorazado", 4],
  ["litius:jinete_wither", 2], ["litius:jinete_arana", 4],
  ["litius:zombie_raxier", 1], ["litius:rey_exiliado", 1], ["litius:guardian_abedul", 1],
];
const HOSTILES = [
  ["minecraft:zombie", 10], ["minecraft:skeleton", 10], ["minecraft:creeper", 8], ["minecraft:spider", 8],
  ["minecraft:enderman", 4], ["minecraft:witch", 2], ["minecraft:slime", 2], ["minecraft:bogged", 2], ["minecraft:breeze", 1],
];
const PASIVOS = [
  ["minecraft:sheep", 8], ["minecraft:cow", 6], ["minecraft:pig", 6], ["minecraft:chicken", 6], ["minecraft:rabbit", 4],
  ["minecraft:fox", 3], ["minecraft:goat", 2], ["minecraft:bee", 2], ["minecraft:parrot", 2], ["minecraft:allay", 1],
];
const JEFES = new Set(["litius:zombie_raxier", "litius:rey_exiliado", "litius:guardian_abedul"]);
const SUELO = new Set(["minecraft:moss_block", "minecraft:moss_carpet", "minecraft:short_grass", "minecraft:fern",
                       "minecraft:dandelion", "minecraft:poppy", "minecraft:stone", "minecraft:mossy_stone_bricks", "minecraft:stone_bricks"]);

function elegir(lista) {
  let n = Math.random() * lista.reduce((a, [, w]) => a + w, 0);
  for (const [id, w] of lista) if ((n -= w) <= 0) return id;
  return lista[0][0];
}
function elegirMob(hayJefe) {
  const t = world.getTimeOfDay();
  const noche = t > 13000 && t < 23000;
  // de noche dominan los monstruos; de dia los animales
  const grupos = noche ? [[ADDON, 55], [HOSTILES, 35], [PASIVOS, 10]] : [[ADDON, 40], [HOSTILES, 10], [PASIVOS, 50]];
  for (let i = 0; i < 4; i++) {
    let n = Math.random() * 100, lista = ADDON;
    for (const [l, w] of grupos) if ((n -= w) <= 0) { lista = l; break; }
    const id = elegir(lista);
    if (!(JEFES.has(id) && hayJefe)) return id;
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
    const cerca = d.getEntities({ location: p.location, maxDistance: 48, families: ["mob"] });
    if (cerca.length >= MOB_CAP) continue;
    const hayJefe = d.getEntities({ location: p.location, maxDistance: 96 }).some((e) => JEFES.has(e.typeId));
    for (let intento = 0; intento < 4; intento++) {
      const a = Math.random() * Math.PI * 2, dist = 18 + Math.random() * 30;
      const x = Math.floor(p.location.x + Math.cos(a) * dist), z = Math.floor(p.location.z + Math.sin(a) * dist);
      if (x * x + z * z < 64) continue; // nunca dentro de la plaza del spawn
      try {
        if (!d.isChunkLoaded({ x, y: 100, z })) continue;
        const top = d.getTopmostBlock({ x, z }, 40);
        if (!top || !SUELO.has(top.typeId)) continue;
        d.spawnEntity(elegirMob(hayJefe), { x: x + 0.5, y: top.location.y + 1, z: z + 0.5 });
        break;
      } catch {
        /* chunk sin cargar, mob no disponible en esta version o posicion invalida */
      }
    }
  }
}, 80);

world.afterEvents.entitySpawn.subscribe(({ entity }) => {
  if (!entity?.isValid || entity.dimension.id !== DIM_ID || !entity.typeId.startsWith("litius:")) return;
  system.runTimeout(() => {
    if (!entity.isValid) return;
    // en las islas el sol pega fuerte: los no-muertos del addon no se queman
    if (entity.getComponent("minecraft:type_family")?.hasTypeFamily("undead")) {
      entity.addEffect("fire_resistance", 20000000, { showParticles: false });
    }
  }, 2);
});
