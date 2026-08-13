import type { AnyObject, Identity, InexactPartial } from "#utils";
import type Color from "#common/utils/color.d.mts";
import type { BaseShapeData } from "#common/data/data.d.mts";
import type SpriteMesh from "#client/canvas/containers/elements/sprite-mesh.d.mts";
import type BaseSamplerShader from "#client/canvas/rendering/shaders/samplers/base-sampler.d.mts";
// TODO: V14 renames this to `PolygonTree` and moves it to `client/data/polygon-tree.mjs`; retarget this
// import in the `client/data` migration.
import type { RegionPolygonTree } from "#client/data/region-shapes/_module.d.mts";

/**
 * A lightweight, native particle generator designed for VFX.
 *
 * ParticleGenerator manages:
 * - An internal container on the chosen canvas layer (usually `canvas.primary`)
 * - Particle pooling (reusing sprites instead of constantly allocating new ones)
 * - Lifetime, fade-in/out, basic motion, and optional constraints
 * - Two usage styles:
 *   - **ambient**: keep a steady density in the visible area (viewport-driven budget)
 *   - **effect**: spawn particles in a specific area (manual spawns or a fixed target count)
 *
 * The API is intentionally compact:
 * - Put most settings at the top level (`textures`, `blend`, `alpha`, `scale`, `count`, `lifetime`, etc.)
 * - Use `area` to define where particles spawn
 * - Use `spawnParticle()` or `spawnParticles()` to spawn particles (optionally overriding texture/area/position)
 * - Use `start({spawn: n})` when you want to immediately seed a certain number of particles on start
 * - Use `shaderClass` when you want a custom sampler shader for particles
 * - Use `onSpawn` to customize each particle after it has been positioned and configured
 * - Use `onUpdate` to apply per-particle per-frame logic after position, rotation, tint, and alpha are computed
 * - Use `onDeath` to react when particles are recycled (optional)
 *
 * ## Core concepts
 *
 * ### Mode
 * - `mode: "ambient"` maintains a stable density in the visible region.
 *   `count` is scaled by the visible area ratio, and spawning uses the padded viewport (`viewPadding`).
 * - `mode: "effect"` spawns in a defined `area`. `count` is treated as an absolute target.
 *    You can use `manual: true` and spawn at your own rate via `spawnParticle()` / `spawnParticles()`.
 *
 * ### Fade
 * `fade.in` / `fade.out` accept:
 * - milliseconds when value \>= 1
 * - a fraction of the particle lifetime when `0 < value < 1`
 *
 * ### Velocity
 * `velocity` can be:
 * - fixed: `{x, y}` or `new PIXI.Point(x, y)`
 * - ranged: `{x: [min, max], y: [min, max]}`
 * - polar: `{speed: value, angle: [min, max]}` (angle in degrees)
 * - function: `{fn: (particle, dt, out) => {out.x = vx; out.y = vy;}}`
 *   evaluated at spawn and during each update as the full velocity vector for that frame
 *
 * ### Attribute Values
 * `alpha`, `scale`, polar `velocity.speed`, and `rotation.speed` accept fixed values, random ranges,
 * `{min, max, curve}` objects, or `{fn}` objects.
 * `tint` accepts fixed color sources or `{curve}` / `{fn}` color objects. Curve points use color sources; `fn` returns
 * a 0xRRGGBB number. Curve time is normalized over each particle lifetime.
 * - `alpha` is multiplied by the fade envelope
 * - `scale` is applied directly to the particle
 * - `velocity.speed` updates magnitude while preserving the spawn direction
 * - `rotation.speed` updates angular velocity in degrees per second
 * - `tint` interpolates RGB channels between curve points
 *
 * ### Shader
 * Pass `shaderClass` to render particles with a custom sampler shader.
 * - Batchable shaders are recommended for anything more than modest particle counts.
 * - ParticleGenerator uses plain `SpriteMesh` instances, so the shader must be compatible with `SpriteMesh`.
 * - If your batch shader needs custom per-particle data, attach it in `onSpawn` or `onUpdate` and read it from
 *   `element.object` in the shader `_packInterleavedGeometry` override.
 *
 * ### Area
 * `area` supports:
 * - Point: `{x, y}`
 * - Rect: `{x, y, width, height}` or `new PIXI.Rectangle(x, y, w, h)`
 * - Circle: `{x, y, radius}`
 * - Ring: `{x, y, innerRadius, outerRadius}` or `{x, y, radius: [inner, outer]}`
 * - Line: `{from: {x, y}, to: {x, y}}`
 * - Points: `{points: [{x, y}, ...]}` or `{shape: "points", points: [{x, y}, ...]}`
 * - Polyline: `{path: [{x, y}, ...]}`, `{shape: "path", path: [...]}`, or
 *   `{shape: "polyline", points: [{x, y}, ...]}`
 * - Ellipse: `{x, y, radiusX, radiusY}`, `{shape: "ellipse", x, y, radiusX, radiusY}`, with optional
 *   `holeScale`, `minAngle`, `maxAngle`, `shapeRotation`, and `affectRotation`.
 * - Shape instance: {@linkcode foundry.data.BaseShapeData}
 * - Shape source data: `{type: "circle", x, y, radius}` using the {@linkcode foundry.data.BaseShapeData} schema.
 * Plain object areas without a `type` are inferred from their properties.
 *
 * Set `sampleMode` to `"boundary"` to spawn along the edge of area types that support boundary sampling.
 *
 * If you provide an `anchor`, object-based areas can be treated as offsets relative to that anchor.
 * To force an absolute rectangle while anchored, pass a `PIXI.Rectangle`.
 * Plain objects with a valid {@linkcode foundry.data.BaseShapeData} `type` are shape source data, not object areas,
 * and are always interpreted in absolute scene coordinates.
 *
 * ### Debug
 * Use `debug` while tuning a generator or diagnosing why particles are not spawning as expected. It is optional and
 * should usually be disabled in final effects.
 * - `debug: true` enables spawn and recycle counters.
 * - `debug.stats: true` enables `generator.debugStats`.
 * - `debug.profile: true` also records the most recent update, spawn, and tick timings.
 * - `debug.tint: true` gives each spawned particle a random tint.
 * - `debug.tint: {mode: "palette", palette: [0xFFAA00, 0x66CCFF]}` tints particles from a palette.
 * - `debug.tint: {mode: "byTexture"}` gives each texture a stable debug color.
 * - `debug.useWhiteTexture: true` falls back to `PIXI.Texture.WHITE` when no textures are configured.
 *
 * ```js
 * const gen = new foundry.canvas.animation.ParticleGenerator({
 *   mode: "effect",
 *   count: 100,
 *   spawnRate: 300,
 *   area: {x: 1200, y: 900, radius: 180},
 *   debug: {
 *     stats: true,
 *     profile: true,
 *     tint: {mode: "byTexture"},
 *     useWhiteTexture: true
 *   }
 * });
 * gen.start({spawn: 100});
 *
 * console.table(gen.debugStats);
 * ```
 *
 * ## Performance tips
 * - Preload textures before creating the generator.
 * - Prefer calling `spawnParticle()` or `spawnParticles()` with no options when you can. It avoids per-spawn object
 *   allocations.
 * - Keep `positionTest` cheap. It runs in a hot path.
 * - Prefer batchable shaders for sustained effects. Direct-render shaders are best kept to smaller particle counts.
 * - Avoid blur unless you really need it (pre-blurred textures are better).
 *
 * ## Practical limits
 * ParticleGenerator is meant for local, short-lived effects (bursts, embers, motes, small auras),
 * not for filling the entire scene with massive particle counts. If you push it into many thousands of active
 * particles, performance could degrade quickly. In practice, you'll get better results by using moderate counts,
 * short lifetimes, and small spawn areas, and by stopping the effect when it's no longer needed.
 *
 * Texture size also matters. Large particle textures (or heavy blur) increase pixel work,
 * especially with additive/screen blends and overdraw, which can become fill-rate bound on some GPUs.
 * Prefer small textures (and sprite sheets!), keep particle sizes reasonable on screen, and avoid expensive
 * full-screen coverage when you only need a local effect.
 *
 * ## Examples
 *
 * @example
 * ### 1) Ambient leaves (steady density in view)
 * Use this for soft, always-on atmospheric particles.
 * ```js
 * const gen = new foundry.canvas.animation.ParticleGenerator({
 *   mode: "ambient",
 *   textures: [
 *     "ui/particles/leaf1.png",
 *     "ui/particles/leaf2.png",
 *     "ui/particles/leaf3.png",
 *     "ui/particles/leaf4.png",
 *     "ui/particles/leaf5.png",
 *     "ui/particles/leaf6.png"
 *   ],
 *   blend: PIXI.BLEND_MODES.NORMAL,
 *   count: 300,
 *   viewPadding: 0.25,
 *   lifetime: [1200, 2200],
 *   fade: {in: 0.15, out: 0.25},
 *   velocity: {x: [-5, 5], y: [-10, -30]},
 *   alpha: [0.2, 0.4],
 *   scale: [0.35, 0.85]
 * });
 * gen.start();
 * ```
 *
 * ### 2) Ambient snow (padding + random age)
 * Great for snowfall that looks continuous when you pan the camera.
 * ```js
 * const gen = new foundry.canvas.animation.ParticleGenerator({
 *   mode: "ambient",
 *   textures: ["ui/particles/snow.png"],
 *   count: 400,
 *   viewPadding: 0.3,
 *   randomizeAgeInPadding: true,
 *   lifetime: [2500, 4500],
 *   fade: {in: 0.2, out: 0.2},
 *   velocity: {x: [-8, 8], y: [25, 55]},
 *   alpha: [0.12, 0.25],
 *   scale: [0.3, 0.9],
 *   blend: PIXI.BLEND_MODES.SCREEN
 * });
 * gen.start();
 * ```
 *
 * ### 3) Manual burst at a point (effect mode)
 * Use this for clicks, impacts, or quick one-shot effects.
 * ```js
 * const gen = new foundry.canvas.animation.ParticleGenerator({
 *   mode: "effect",
 *   manual: true,
 *   textures: ["ui/particles/snow.png"],
 *   lifetime: [450, 900],
 *   fade: {in: 0.05, out: 0.4},
 *   velocity: {speed: [80, 200], angle: [0, 360]},
 *   alpha: [0.4, 0.8],
 *   scale: [0.3, 0.8]
 * });
 * gen.start();
 *
 * // Spawn a burst at {x,y}
 * const p = {x: 1000, y: 800};
 * gen.spawnParticles(120, {position: p});
 * ```
 *
 * ### 4) Anchored emitter (leaves around a token)
 * Use this for a continuous local effect attached to a moving object.
 * ```js
 * const token = canvas.tokens.controlled[0];
 * const area = {radius: 70}; // relative to anchor, no x/y needed
 *
 * const gen = new foundry.canvas.animation.ParticleGenerator({
 *   mode: "effect",
 *   anchor: token,
 *   anchorPoint: "center",
 *   area,
 *   count: 120,
 *   spawnRate: 90,
 *   elevation: token.document.elevation ?? 0,
 *   textures: [
 *     "ui/particles/leaf1.png",
 *     "ui/particles/leaf2.png",
 *     "ui/particles/leaf3.png",
 *     "ui/particles/leaf4.png",
 *     "ui/particles/leaf5.png",
 *     "ui/particles/leaf6.png"
 *   ],
 *   lifetime: [450, 900],
 *   fade: {in: 0.05, out: 0.4},
 *   velocity: {x: [-160, 160], y: [-160, 160]},
 *   rotation: {speed: 180},
 *   alpha: [0.5, 0.75],
 *   scale: [0.25, 0.75],
 *   blend: PIXI.BLEND_MODES.NORMAL
 * });
 * gen.start();
 * ```
 *
 * ### 5) Custom onTick spawning (leaves around a token)
 * Use this when custom logic decides whether the generator should spawn during a tick.
 * ```js
 * const token = canvas.tokens.controlled[0];
 * let spawnBudget = 0;
 *
 * const gen = new foundry.canvas.animation.ParticleGenerator({
 *   mode: "effect",
 *   manual: true,
 *   anchor: token,
 *   anchorPoint: "center",
 *   area: {radius: 80},
 *   count: 120,
 *   textures: [
 *     "ui/particles/leaf1.png",
 *     "ui/particles/leaf2.png",
 *     "ui/particles/leaf3.png"
 *   ],
 *   lifetime: [700, 1300],
 *   fade: {in: 0.1, out: 0.35},
 *   velocity: {x: [-90, 90], y: [-120, -20]},
 *   alpha: [0.35, 0.7],
 *   scale: [0.25, 0.65],
 *   onTick: (dt, generator) => {
 *     if ( !token?.visible ) return;
 *     const available = generator.adjustedMaxParticles - generator.particles.length;
 *     if ( available <= 0 ) return;
 *     spawnBudget += 45 * dt * 0.001;
 *     const n = Math.min(Math.floor(spawnBudget), available);
 *     if ( n <= 0 ) return;
 *     spawnBudget -= n;
 *     generator.spawnParticles(n);
 *   }
 * });
 * gen.start();
 * ```
 *
 * ### 6) Spawn-position direction toward a focal point
 * Use `velocity.fn` when each particle direction depends on where it spawned.
 * ```js
 * const dims = canvas.scene.dimensions;
 * const bounds = new PIXI.Rectangle(dims.sceneX, dims.sceneY, dims.sceneWidth, dims.sceneHeight);
 * const focal = {x: 1200, y: 900};
 * const focalLocal = {x: focal.x - bounds.x, y: focal.y - bounds.y};
 *
 * const gen = new foundry.canvas.animation.ParticleGenerator({
 *   mode: "effect",
 *   manual: true,
 *   bounds,
 *   textures: ["ui/particles/snow.png"],
 *   area: {x: focal.x, y: focal.y, innerRadius: 180, outerRadius: 260},
 *   lifetime: [700, 1100],
 *   fade: {in: 0.1, out: 0.3},
 *   alpha: [0.4, 0.9],
 *   scale: [0.3, 0.7],
 *   velocity: {
 *     fn: (p, dt, out) => {
 *       if ( p.time === 0 ) {
 *         let dx = focalLocal.x - p.x;
 *         let dy = focalLocal.y - p.y;
 *
 *         const distance = Math.hypot(dx, dy) || 1;
 *         dx /= distance;
 *         dy /= distance;
 *
 *         const speed = 260;
 *         p.focalVelocityX = dx * speed;
 *         p.focalVelocityY = dy * speed;
 *       }
 *
 *       out.x = p.focalVelocityX;
 *       out.y = p.focalVelocityY;
 *     }
 *   }
 * });
 * gen.start({spawn: 120});
 * ```
 *
 * ### 7) Direction evolving over lifetime (spiral)
 * Use `velocity.fn` when `particle.time` should bend the path during update.
 * ```js
 * const dims = canvas.scene.dimensions;
 * const bounds = new PIXI.Rectangle(dims.sceneX, dims.sceneY, dims.sceneWidth, dims.sceneHeight);
 * const origin = {x: 1200, y: 900};
 * const originLocal = {x: origin.x - bounds.x, y: origin.y - bounds.y};
 *
 * const gen = new foundry.canvas.animation.ParticleGenerator({
 *   mode: "effect",
 *   manual: true,
 *   bounds,
 *   textures: ["ui/particles/snow.png"],
 *   area: {x: origin.x, y: origin.y, radius: 40},
 *   lifetime: [900, 1300],
 *   fade: {in: 0.1, out: 0.35},
 *   alpha: [0.35, 0.8],
 *   scale: {min: 0.35, max: 0.7, curve: [{time: 0, value: 1}, {time: 1, value: 0.35}]},
 *   velocity: {
 *     fn: (p, dt, out) => {
 *       let dx = p.x - originLocal.x;
 *       let dy = p.y - originLocal.y;
 *
 *       const distance = Math.hypot(dx, dy) || 1;
 *       dx /= distance;
 *       dy /= distance;
 *
 *       const radial = 90 + (180 * p.time);
 *       const tangent = 240 * (1 - (0.35 * p.time));
 *       out.x = (dx * radial) + (-dy * tangent);
 *       out.y = (dy * radial) + (dx * tangent);
 *     }
 *   }
 * });
 * gen.start({spawn: 90});
 * ```
 *
 * ### 8) Keep particles inside a rectangle (wrap)
 * Use this for localized ambient effects in a region.
 * ```js
 * const zone = new PIXI.Rectangle(900, 700, 600, 400);
 * const gen = new foundry.canvas.animation.ParticleGenerator({
 *   mode: "effect",
 *   count: 250,
 *   spawnRate: 180,
 *   area: zone,
 *   constraintMode: "wrap",
 *   constraintArea: zone,
 *   textures: ["ui/particles/snow.png"],
 *   lifetime: [1200, 2200],
 *   fade: {in: 0.2, out: 0.2},
 *   velocity: {x: [-20, 20], y: [-10, 10]},
 *   alpha: [0.1, 0.25],
 *   scale: [0.4, 0.9]
 * });
 * gen.start({spawn: 250});
 * ```
 *
 * ### 9) Bounce inside bounds (arcade-style)
 * Great for “energy balls” in a box or magic motes in a bounded area.
 * ```js
 * const zone = new PIXI.Rectangle(900, 700, 600, 400);
 * const gen = new foundry.canvas.animation.ParticleGenerator({
 *   mode: "effect",
 *   count: 80,
 *   spawnRate: 60,
 *   area: zone,
 *   constraintMode: "bounce",
 *   constraintArea: zone,
 *   restitution: 0.9,
 *   textures: ["ui/particles/snow.png"],
 *   lifetime: [2000, 4000],
 *   fade: {in: 0.15, out: 0.25},
 *   velocity: {x: [-120, 120], y: [-120, 120]},
 *   alpha: [0.25, 0.6],
 *   scale: [0.5, 1.0],
 *   blend: PIXI.BLEND_MODES.SCREEN
 * });
 * gen.start({spawn: 80});
 * ```
 *
 * ### 10) Use a clip mask (hard visual boundary)
 * Use this when you need a strict rectangle cutout.
 * ```js
 * const clipRect = new PIXI.Rectangle(900, 700, 600, 400);
 * const gen = new foundry.canvas.animation.ParticleGenerator({
 *   mode: "effect",
 *   count: 300,
 *   spawnRate: 120,
 *   area: clipRect,
 *   clip: clipRect,
 *   textures: ["ui/particles/snow.png"],
 *   lifetime: [2000, 4000],
 *   fade: {in: 0.2, out: 0.2},
 *   velocity: {x: [-10, 10], y: [-10, 10]},
 *   alpha: [0.08, 0.18],
 *   scale: [0.8, 1.6],
 *   blend: PIXI.BLEND_MODES.SCREEN
 * });
 * gen.start({spawn: 300});
 * ```
 *
 * ### 11) Multiple textures + additive blend (magic leaves)
 * Use this for “sparkly” looks with layered variation.
 * ```js
 * const gen = new foundry.canvas.animation.ParticleGenerator({
 *   mode: "effect",
 *   count: 150,
 *   spawnRate: 90,
 *   area: {x: 1200, y: 900, radius: 250},
 *   textures: [
 *     "ui/particles/leaf1.png",
 *     "ui/particles/leaf2.png",
 *     "ui/particles/leaf3.png",
 *     "ui/particles/leaf4.png",
 *     "ui/particles/leaf5.png",
 *     "ui/particles/leaf6.png"
 *   ],
 *   blend: PIXI.BLEND_MODES.SCREEN,
 *   lifetime: [1500, 2600],
 *   fade: {in: 0.2, out: 0.35},
 *   velocity: {speed: [5, 20], angle: [0, 360]},
 *   rotation: {speed: 45},
 *   alpha: [0.15, 0.45],
 *   scale: [0.3, 0.8]
 * });
 * gen.start({spawn: 150});
 * ```
 *
 * ### 12) Force a specific texture per spawn
 * Useful when you want a rare “special” particle occasionally.
 * ```js
 * const gen = new foundry.canvas.animation.ParticleGenerator({
 *   mode: "effect",
 *   manual: true,
 *   textures: [
 *     "ui/particles/leaf1.png",
 *     "ui/particles/leaf2.png",
 *     "ui/particles/leaf3.png",
 *     "ui/particles/leaf4.png",
 *     "ui/particles/leaf5.png",
 *     "ui/particles/leaf6.png"
 *   ]
 * });
 * gen.start();
 * gen.spawnParticle({texture: "ui/particles/snow.png", position: {x: 1200, y: 900}});
 * ```
 *
 * ### 13) Spawn into a temporary override area
 * Use this to reuse one generator for multiple nearby spawns without rebuilding it.
 * ```js
 * const gen = new foundry.canvas.animation.ParticleGenerator({
 *   mode: "effect",
 *   manual: true,
 *   textures: ["ui/particles/snow.png"],
 *   lifetime: [500, 900]
 * });
 *
 * // Start the generator
 * gen.start();
 *
 * const r1 = new PIXI.Rectangle(900, 700, 200, 200);
 * const r2 = new PIXI.Rectangle(1500, 700, 200, 200);
 * gen.spawnParticles(50, {area: r1});
 * gen.spawnParticles(50, {area: r2});
 *
 * // Stop the generator (soft stop by default)
 * gen.stop()
 * ```
 *
 * ### 14) Use a custom batch shader
 * Assume `MySparkleSamplerShader` is a `BaseSamplerShader` subclass whose batch plugin was already registered.
 * ```js
 * const gen = new foundry.canvas.animation.ParticleGenerator({
 *   mode: "effect",
 *   count: 120,
 *   spawnRate: 120,
 *   area: {x: 1200, y: 900, radius: 180},
 *   textures: ["ui/particles/snow.png"],
 *   shaderClass: MySparkleSamplerShader,
 *   lifetime: [900, 1600],
 *   fade: {in: 0.15, out: 0.3},
 *   velocity: {speed: [10, 45], angle: [0, 360]},
 *   alpha: [0.2, 0.5],
 *   scale: [0.25, 0.7],
 *   onSpawn: p => {
 *     p.sparklePhase = Math.random() * (Math.PI * 2);
 *     p.sparkleStrength = Math.mix(0.5, 1.0, Math.random());
 *   }
 * });
 * gen.start({spawn: 120});
 * ```
 *
 * ### 15) Use a simple BaseShapeData source area (interior)
 * BaseShapeData source objects can be passed directly as areas. A simple shape, such as a circle, uses the shape's
 * optimized point sampler after construction.
 * ```js
 * const area = {type: "circle", x: 1200, y: 900, radius: 160};
 * const gen = new foundry.canvas.animation.ParticleGenerator({
 *   mode: "effect",
 *   count: 100,
 *   spawnRate: 120,
 *   area,
 *   sampleMode: "interior",
 *   textures: ["ui/particles/snow.png"],
 *   lifetime: [800, 1400],
 *   fade: {in: 0.15, out: 0.3},
 *   velocity: {speed: [5, 25], angle: [0, 360]},
 *   alpha: [0.15, 0.4],
 *   scale: [0.3, 0.8],
 *   blend: PIXI.BLEND_MODES.SCREEN
 * });
 * gen.start({spawn: 100});
 * ```
 *
 * ### 16) Use a complex BaseShapeData area (boundary)
 * On a gridded scene, GridShapeData can represent a union of multiple grid spaces. The resulting geometry is sampled
 * through its PolygonTree, which is useful for complex boundaries.
 * ```js
 * const origin = canvas.grid.getOffset({x: 1200, y: 900});
 * const area = new foundry.data.GridShapeData({
 *   offsets: [
 *     origin,
 *     {i: origin.i + 1, j: origin.j},
 *     {i: origin.i + 1, j: origin.j + 1},
 *     {i: origin.i + 2, j: origin.j + 1}
 *   ]
 * }, {parent: canvas.scene});
 *
 * const gen = new foundry.canvas.animation.ParticleGenerator({
 *   mode: "effect",
 *   count: 120,
 *   spawnRate: 120,
 *   area,
 *   sampleMode: "boundary",
 *   textures: ["ui/particles/snow.png"],
 *   lifetime: [900, 1600],
 *   fade: {in: 0.1, out: 0.35},
 *   velocity: {speed: [15, 45], angle: [0, 360]},
 *   alpha: [0.2, 0.55],
 *   scale: [0.25, 0.7],
 *   blend: PIXI.BLEND_MODES.SCREEN
 * });
 * gen.start({spawn: 120});
 * ```
 *
 * ### 17) Continuous spray with over-life curves
 * Use `spawnRate` and over-life curves for effects that accelerate, shrink, or fade without custom callbacks.
 * ```js
 * const gen = new foundry.canvas.animation.ParticleGenerator({
 *   mode: "effect",
 *   count: 220,
 *   spawnRate: 180,
 *   area: {from: {x: 900, y: 700}, to: {x: 1300, y: 760}},
 *   textures: ["ui/particles/spray.png"],
 *   lifetime: [900, 1300],
 *   velocity: {
 *     angle: [70, 110],
 *     speed: {min: 525, max: 700, curve: [{time: 0, value: 1}, {time: 1, value: 0.2}]}
 *   },
 *   rotation: {
 *     speed: {min: -120, max: 120, curve: [{time: 0, value: 1}, {time: 1, value: 0.25}]}
 *   },
 *   alpha: {
 *     min: 0.45,
 *     max: 0.8,
 *     curve: [{time: 0, value: 0}, {time: 0.15, value: 1}, {time: 1, value: 0}]
 *   },
 *   scale: {min: 0.48, max: 0.8, curve: [{time: 0, value: 1.4}, {time: 1, value: 0.25}]},
 *   tint: {
 *     curve: [{time: 0, value: 0x66CCFF}, {time: 0.65, value: 0xFFFFFF}, {time: 1, value: 0x4F6DFF}]
 *   }
 * });
 * gen.start();
 * ```
 */
declare class ParticleGenerator {
  constructor(config?: ParticleGenerator.Configuration);

  /**
   * Default generator config.
   */
  static DEFAULT_OPTIONS: ParticleGenerator.Configuration;

  /**
   * The runtime mode.
   */
  mode: ParticleGenerator.Mode;

  /**
   * The parent container which receives the internal particle container.
   * @remarks Defaults to {@linkcode foundry.canvas.Canvas.primary | canvas.primary}
   */
  container: PIXI.Container;

  /**
   * An optional anchor used to attach areas and behaviors.
   */
  anchor: ParticleGenerator.Anchor;

  /**
   * Which point to use when anchoring.
   */
  anchorPoint: ParticleGenerator.AnchorPoint;

  /**
   * A fixed offset (scene pixels) applied to the anchor.
   */
  anchorOffset: PIXI.IPointData | null;

  /**
   * The configured particle textures.
   */
  textures: PIXI.Texture[];

  /**
   * An optional sprite anchor override for all particles.
   */
  particleAnchor: PIXI.IPointData | null;

  /**
   * The shader class used to render particles.
   */
  shaderClass: BaseSamplerShader.AnyConstructor;

  /**
   * Viewport-related behavior (used primarily in ambient mode).
   */
  viewport: ParticleGenerator.ViewportOptions;

  /**
   * The target particle count.
   */
  maxParticles: number;

  /**
   * The initial proportion (0..1) of the computed target particle count to spawn on start.
   */
  initialBatch: number;

  /**
   * If true, particles are never spawned automatically.
   */
  manualSpawning: boolean;

  /**
   * The chance (0..1) that a spawn attempt actually creates a particle.
   */
  spawnProbability: number;

  /**
   * An optional spawn validator.
   */
  positionTest: ParticleGenerator.PositionTest | null;

  /**
   * Which part of the spawn area to sample.
   */
  sampleMode: ParticleGenerator.AreaSampleMode;

  /**
   * Out-of-bounds constraint configuration.
   */
  constraints: ParticleGenerator.ResolvedConstraints;

  /**
   * Clip (mask) options for the default clip behavior.
   */
  clip: ParticleGenerator.ResolvedClipOptions;

  /**
   * The particle lifetime configuration in milliseconds.
   */
  particleLifetime: ParticleGenerator.Range;

  /**
   * The fade-in duration in milliseconds, or a fraction of lifetime if `0 < value < 1`.
   */
  fadeInDuration: number;

  /**
   * The fade-out duration in milliseconds, or a fraction of lifetime if `0 < value < 1`.
   */
  fadeOutDuration: number;

  /**
   * The blend mode used to render particles.
   */
  blendMode: PIXI.BLEND_MODES;

  /**
   * Resolved rotation configuration for particles.
   */
  rotation: ParticleGenerator.ResolvedRotationOptions;

  /**
   * The velocity configuration used to generate per-particle movement.
   */
  velocity: ParticleGenerator.VelocityOptions | null;

  /**
   * Optional random drift configuration.
   */
  drift: ParticleGenerator.ResolvedDriftOptions;

  /**
   * Optional blur filter options applied to the internal container.
   */
  blurOptions: ParticleGenerator.ResolvedBlurOptions | null;

  /**
   * The elevation for the particle container.
   */
  elevation: number;

  /**
   * The sorting key for the particle container.
   */
  sort: number;

  /**
   * Orbit behavior options.
   */
  orbit: ParticleGenerator.ResolvedOrbitOptions;

  /**
   * Follow behavior options.
   */
  follow: ParticleGenerator.ResolvedFollowOptions;

  /**
   * An optional callback called after the particle has been placed and configured.
   */
  onSpawn: ParticleGenerator.ParticleCallback | null;

  /**
   * An optional callback called each frame for each live particle.
   */
  onUpdate: ParticleGenerator.ParticleCallback | null;

  /**
   * An optional callback called when a particle is recycled.
   */
  onDeath: ParticleGenerator.DeathCallback | null;

  /**
   * An optional callback called one time per frame (not per particle!).
   */
  onTick: ParticleGenerator.TickCallback | null;

  /**
   * The computed target particle count based on visible area (ambient mode) or the configured budget (effect mode).
   * @defaultValue `0`
   */
  adjustedMaxParticles: number;

  /**
   * The currently active particle instances.
   * @defaultValue `[]`
   */
  particles: ParticleGenerator.ParticleMesh[];

  /**
   * A pool of recycled particles ready to be reused.
   * @defaultValue `[]`
   */
  particlePool: ParticleGenerator.ParticleMesh[];

  /**
   * Generator bounds in scene coordinates.
   */
  protected _bounds: PIXI.Rectangle;

  /**
   * The configured default spawn area (effect mode).
   * This area is defined in scene coordinates and may be interpreted relative to an anchor.
   * {@linkcode foundry.data.BaseShapeData} instances and source data are always interpreted in absolute scene
   * coordinates. Shape source data is converted to a {@linkcode foundry.data.BaseShapeData} instance.
   * Re-read each frame, so it can be replaced or its values mutated at runtime to animate the spawn region.
   * @defaultValue `null`
   */
  spawnArea: ParticleGenerator.Area | null;

  /**
   * Optional custom constraint rectangle in local coordinates.
   * @defaultValue `null`
   */
  protected _constraintRect: PIXI.Rectangle | null;

  /**
   * Whether the generator is soft-stopped.
   * @defaultValue `true`
   */
  protected _stopped: boolean;

  /**
   * Whether the update callback is attached to the ticker.
   * @defaultValue `false`
   */
  protected _tickerAttached: boolean;

  /**
   * Whether the generator has spawned its initial batch.
   * @defaultValue `false`
   */
  protected _initialized: boolean;

  /**
   * The internal container which holds all particles.
   * @defaultValue `null`
   */
  protected _particlesContainer: PIXI.Container | null;

  /**
   * The display object used to mask particle rendering.
   * @defaultValue `null`
   */
  protected _mask: PIXI.DisplayObject | null;

  /**
   * The blur filter applied to the internal container, if any.
   * @defaultValue `null`
   */
  protected _blurFilter: PIXI.Filter | null;

  /**
   * The local-space viewport rectangle without padding.
   */
  protected _viewRectLocal: PIXI.Rectangle;

  /**
   * The local-space viewport rectangle with padding.
   */
  protected _budgetRectLocal: PIXI.Rectangle;

  /**
   * The local-space generator bounds.
   */
  protected _worldRectLocal: PIXI.Rectangle;

  /**
   * The previous-frame budget rectangle.
   */
  protected _oldBudgetRectLocal: PIXI.Rectangle;

  /**
   * Whether the previous-frame budget rectangle is initialized.
   * @defaultValue `false`
   */
  protected _hasOldBudgetRectLocal: boolean;

  /**
   * A fixed pool of rectangles used to describe newly visible areas.
   */
  protected _newlyVisibleAreaPool: PIXI.Rectangle[];

  /**
   * The list of newly visible areas for the current frame in local coordinates.
   * @defaultValue `[]`
   */
  protected _newlyVisibleAreas: PIXI.Rectangle[];

  /**
   * The current anchor position in scene coordinates.
   */
  protected _anchorScene: PIXI.Point;

  /**
   * The current anchor position in local coordinates.
   */
  protected _anchorLocal: PIXI.Point;

  /**
   * The active behavior implementation.
   * @defaultValue `null`
   */
  protected _behavior: ParticleGenerator.Behavior | null;

  /**
   * A cached context object passed to behavior hooks.
   */
  protected _behaviorContext: ParticleGenerator.BehaviorContext;

  /**
   * Temp point used to avoid per-frame allocations.
   */
  protected _tlScreen: PIXI.Point;

  /**
   * Temp point used to avoid per-frame allocations.
   */
  protected _brScreen: PIXI.Point;

  /**
   * Temp point used to avoid per-frame allocations.
   */
  protected _tlLocal: PIXI.Point;

  /**
   * Temp point used to avoid per-frame allocations.
   */
  protected _brLocal: PIXI.Point;

  /**
   * Temp point used to sample shape-based spawn areas.
   */
  protected _spawnPoint: PIXI.Point;

  /**
   * A function which generates per-particle movement speed vectors.
   */
  protected _generateMovementSpeed: (out: PIXI.Point, particle: ParticleGenerator.ParticleMesh) => void;

  /**
   * Normalized debug options.
   * @defaultValue `null`
   */
  protected _debug: ParticleGenerator.ResolvedDebugOptions | null;

  /**
   * Debug statistics and profiling output.
   * Null when debug stats are disabled.
   * @defaultValue `null`
   */
  protected _debugStats: ParticleGenerator.DebugStats | null;

  /**
   * Whether profiling is enabled.
   * @defaultValue `false`
   */
  protected _debugProfile: boolean;

  /**
   * Cached debug tint options.
   * @defaultValue `null`
   */
  protected _debugTint: ParticleGenerator.ResolvedDebugTintOptions | null;

  /**
   * A mapping from textures to deterministic tint values.
   * @defaultValue `null`
   */
  protected _debugTintByTexture: WeakMap<PIXI.Texture, number> | null;

  /**
   * The bounding rectangle of the generator in scene coordinates.
   * Used to convert between local particle coordinates and scene coordinates.
   */
  get bounds(): PIXI.Rectangle;

  /**
   * The PIXI container that holds all particle display objects.
   */
  get particlesContainer(): PIXI.Container | null;

  /**
   * The current unpadded viewport rectangle in the generator's local space.
   */
  get viewRectLocal(): PIXI.Rectangle;

  /**
   * The current padded viewport rectangle used for budget/spawning in ambient mode.
   */
  get budgetRectLocal(): PIXI.Rectangle;

  /**
   * The maximum number of particles that may be spawned per second (auto-spawn mode).
   */
  get spawnRate(): number;

  set spawnRate(value);

  /**
   * The mask applied to the particle container. Set to null to remove the mask.
   * The generator does not manage the lifecycle of externally assigned masks.
   */
  get mask(): PIXI.DisplayObject | null;

  set mask(value: PIXI.DisplayObject | null);

  /**
   * Debug statistics and profiling output.
   * Returns null if {@linkcode ParticleGenerator.DebugOptions.stats | debug.stats} is not enabled.
   *
   * Note: This getter returns a stable object reference and updates the live values (active/pool/target)
   * on access.
   */
  get debugStats(): ParticleGenerator.DebugStats | null;

  /**
   * Start the generator, create the update loop and optionally spawn an initial batch.
   */
  start(options?: ParticleGenerator.StartOptions): void;

  /**
   * Stop the generator.
   */
  stop(options?: ParticleGenerator.StopOptions): void;

  /**
   * Spawn a single particle.
   * In "ambient" mode, the default spawn area is the current padded viewport rectangle.
   * In "effect" mode, the default spawn area is the configured {@linkcode ParticleGenerator.Area}.
   */
  spawnParticle(options?: ParticleGenerator.SpawnParticleOptions): ParticleGenerator.ParticleMesh | null;

  /**
   * Spawn multiple particles.
   * @param count - The number of particles to spawn.
   * @returns The number of successfully spawned particles.
   */
  spawnParticles(count: number, options?: ParticleGenerator.SpawnParticlesOptions): number;

  /**
   * Migrate deprecated configuration options.
   * @param config - The user-provided configuration object.
   * @param cfg    - The prepared configuration object.
   */
  protected _migrateConfig(config: ParticleGenerator.Configuration, cfg: ParticleGenerator._Configuration): void;

  /**
   * Apply the configuration to the ParticleGenerator instance.
   * @param cfg - The configuration object.
   */
  protected _configureOptions(cfg: ParticleGenerator._Configuration): void;

  /**
   * Configure optional debug helpers.
   * This feature set is fully opt-in and is designed to have near-zero overhead when disabled.
   */
  protected _configureDebug(debug: ParticleGenerator.DebugOptions | boolean | null | undefined): void;

  /**
   * Initialize behaviors from the configuration object.
   */
  protected _initializeBehaviors(cfg: ParticleGenerator._Configuration): void;

  /**
   * Initialize cached generators from the configuration object.
   */
  protected _initializeCachedGenerators(cfg: ParticleGenerator._Configuration): void;

  /**
   * Compute the current viewport rectangles and target particle count.
   * All rectangles are in the local coordinate space of the internal container.
   */
  protected _calculateGeneratorProperties(): void;

  /**
   * Compute the portions of newRect that were not visible in oldRect.
   * This method reuses a fixed pool of rectangles to avoid per-frame allocations.
   */
  protected _computeNewlyVisibleAreas(oldRect: PIXI.Rectangle, newRect: PIXI.Rectangle): void;

  /**
   * Spawn the initial particle batch.
   * In ambient mode, particle ages are randomized so the scene appears pre-settled.
   */
  protected _initializeParticles(): void;

  /**
   * Ticker callback.
   */
  protected _onTick(): void;

  /**
   * Update all active particles.
   * @param dt - Delta time in milliseconds.
   */
  protected _updateExistingParticles(dt: number): void;

  /**
   * Update particles without constraints.
   * @param dt - Delta time in milliseconds.
   * @param ds - Delta time in seconds.
   */
  protected _updateParticlesUnconstrained(
    dt: number,
    ds: number,
    particles: ParticleGenerator.ParticleMesh[],
    behavior: ParticleGenerator.Behavior | null,
    bctx: ParticleGenerator.BehaviorContext | null,
  ): void;

  /**
   * Update particles with constraints applied.
   */
  protected _updateParticlesConstrained(
    dt: number,
    ds: number,
    bounds: PIXI.Rectangle,
    particles: ParticleGenerator.ParticleMesh[],
    behavior: ParticleGenerator.Behavior | null,
    bctx: ParticleGenerator.BehaviorContext | null,
    mode: ParticleGenerator.ConstraintMode,
  ): void;

  /**
   * Spawn particles to move toward the current target count.
   */
  protected _autoSpawnParticles(): void;

  /**
   * Apply a random drift vector to a particle.
   */
  protected _applyRandomDrift(particle: ParticleGenerator.ParticleMesh): void;

  /**
   * Create a new particle instance.
   */
  protected _createNewParticle(texture: PIXI.Texture): ParticleGenerator.ParticleMesh;

  /**
   * Initialize/refresh base particle properties.
   */
  protected _setupParticleBase(particle: ParticleGenerator.ParticleMesh): void;

  /**
   * Recycle a particle to the pool.
   */
  protected _recycleParticle(particle: ParticleGenerator.ParticleMesh, reason: string): void;

  /**
   * Get a random texture from the configured set.
   */
  protected _getRandomTexture(): PIXI.Texture | null;

  /**
   * Get default bounds from the current scene dimensions.
   */
  protected _getDefaultBounds(): PIXI.Rectangle;

  /**
   * @deprecated "`ParticleGenerator#maxParticlesPerFrame` is deprecated. Use
   * {@linkcode ParticleGenerator.spawnRate | ParticleGenerator#spawnRate} instead." (since v14, until v16)
   */
  get maxParticlesPerFrame(): number;

  set maxParticlesPerFrame(value);

  /**
   * @deprecated "`ParticleGenerator#alphaRange` is deprecated. Use
   * {@linkcode ParticleGenerator.Configuration.alpha | ParticleGeneratorConfiguration#alpha} instead."
   * (since v14, until v16)
   */
  get alphaRange(): ParticleGenerator.MinMaxRange;

  set alphaRange(value: ParticleGenerator.Range | undefined);

  /**
   * @deprecated "`ParticleGenerator#scaleRange` is deprecated. Use
   * {@linkcode ParticleGenerator.Configuration.scale | ParticleGeneratorConfiguration#scale} instead."
   * (since v14, until v16)
   */
  get scaleRange(): ParticleGenerator.MinMaxRange;

  set scaleRange(value: ParticleGenerator.Range | undefined);

  #ParticleGenerator: true;
}

declare namespace ParticleGenerator {
  interface Any extends AnyParticleGenerator {}
  interface AnyConstructor extends Identity<typeof AnyParticleGenerator> {}

  type Mode = "ambient" | "effect";

  /** A numeric range: a fixed value, a `[min, max]` uniform range, or a `{min, max}` uniform range. */
  type Range = number | number[] | MinMaxRange;

  interface MinMaxRange {
    min: number;
    max: number;
  }

  interface CurvePoint {
    /** Normalized lifetime position, from 0 to 1. */
    time: number;

    /** Value at this lifetime position. */
    value: number;
  }

  /** A user-defined function that computes a particle value during particle update. */
  type ValueFunction = (particle: ParticleMesh, dt: number) => number;

  /** @internal */
  interface _ValueOptions {
    /** Minimum base value sampled once per particle. */
    min: number;

    /** Maximum base value sampled once per particle. */
    max: number;

    /**
     * Optional curve over normalized lifetime. Points must start at time 0, end at time 1, and use strictly
     * increasing times.
     */
    curve: CurvePoint[];

    /**
     * Evaluate curve values in discrete steps instead of interpolation.
     * @defaultValue `false`
     */
    step: boolean;

    /** Complete custom value function. */
    fn: ValueFunction;
  }

  /**
   * Advanced particle value configuration.
   * If a base range is combined with a curve, the owning attribute decides how they compose.
   * `fn` is a complete override and must not be combined with the other fields.
   */
  interface ValueOptions extends InexactPartial<_ValueOptions> {}

  type Value = number | number[] | ValueOptions;

  interface ColorCurvePoint {
    /** Normalized lifetime position, from 0 to 1. */
    time: number;

    /** A color source at this lifetime position. */
    value: Color.Source;
  }

  /** A user-defined function that computes a particle color during particle update. */
  type ColorFunction = (particle: ParticleMesh, dt: number) => number;

  /**
   * Advanced particle color configuration.
   * `fn` is a complete override and must not be combined with `curve`.
   */
  interface ColorValueOptions {
    /**
     * Optional color curve over normalized lifetime. Points must start at time 0, end at time 1, and use
     * strictly increasing times.
     */
    curve?: ColorCurvePoint[] | undefined;

    /** Complete custom color function. */
    fn?: ColorFunction | undefined;
  }

  type ColorValue = Color.Source | ColorValueOptions;

  type Point = PIXI.IPointData;

  type Rectangle = PIXI.Rectangle | { x: number; y: number; width: number; height: number };

  /**
   * An anchor source used to attach spawn areas and behaviors to a moving object.
   * Supported sources:
   * - A {@linkcode foundry.canvas.placeables.PlaceableObject} (for example a Token): uses
   *   {@linkcode ParticleGenerator.AnchorPoint} to choose a point.
   * - A point in scene coordinates.
   * - A function which returns a point-like object in scene coordinates.
   */
  type Anchor = PIXI.IPointData | (() => Point) | null;

  /**
   * Which point to use when anchoring to an object.
   * - "center": use `source.center` when available (recommended for Tokens).
   * - "position": use `{x: source.x, y: source.y}`.
   * - function: invoked as `(source) => ({x, y})`.
   */
  type AnchorPoint = "center" | "position" | ((source: object) => Point);

  interface ViewportOptions {
    padding: number;
    newlyVisible: boolean;
    randomizeAgeInPadding: boolean;
  }

  type BehaviorId = "default" | "orbit" | "follow";

  /** @internal */
  interface _OrbitOptions {
    /**
     * Orbit radius in pixels. If null, use the particle's initial distance from the anchor.
     * @defaultValue `null`
     */
    radius: Range | null;

    /**
     * Angular speed in degrees per second.
     * @defaultValue `120`
     */
    angularSpeed: Range;

    /**
     * Initial angle in degrees. Only used when {@linkcode ParticleGenerator.OrbitOptions.radius | radius} is
     * provided.
     * @defaultValue `[0, 360]`
     */
    phase: Range;

    /**
     * Radial speed in pixels per second.
     * @defaultValue `0`
     */
    radialSpeed: Range;

    /**
     * Orbit direction.
     * @defaultValue `1`
     */
    direction: 1 | -1 | "random";

    /**
     * If set, override sprite rotation each frame.
     * @defaultValue `"none"`
     */
    rotation: "none" | "tangent" | "radial";
  }

  interface OrbitOptions extends InexactPartial<_OrbitOptions> {}

  interface ResolvedOrbitOptions extends _OrbitOptions {}

  /** @internal */
  interface _FollowOptions {
    /**
     * Fixed local offset from the anchor in pixels. If null, use the particle's initial offset from the anchor.
     * @defaultValue `null`
     */
    offset: Point | null;

    /**
     * A 0..1 smoothing factor. 1 snaps to the target every frame.
     * @defaultValue `1`
     */
    stiffness: number;
  }

  interface FollowOptions extends InexactPartial<_FollowOptions> {}

  interface ResolvedFollowOptions extends _FollowOptions {}

  interface Behavior {
    /** Called once during construction. */
    initialize?: ((generator: ParticleGenerator) => void) | undefined;

    /** Called for each spawned particle. */
    spawn?: ((particle: ParticleMesh, ctx: BehaviorContext) => void) | undefined;

    /**
     * Called for each particle during update.
     * Return true to indicate the behavior handled positional integration for this particle.
     */
    update?: ((particle: ParticleMesh, dt: number, ctx: BehaviorContext) => boolean | void) | undefined;
  }

  interface BehaviorContext {
    generator: ParticleGenerator;
    anchor: {
      active: boolean;
      scene: PIXI.Point;
      local: PIXI.Point;
    };
    dt: number;
    ds: number;
  }

  type AreaSampleMode = "interior" | "boundary";

  /** Source data for a {@linkcode foundry.data.BaseShapeData} subclass. */
  interface ShapeDataSource extends AnyObject {
    /** A valid type from {@linkcode foundry.data.BaseShapeData.TYPES}. */
    type: string;
  }

  type PointList = Point[];

  type PolylineDefinition = PointList | PointList[];

  /**
   * A spawn area definition in scene coordinates.
   * When an {@linkcode ParticleGenerator.Anchor} is provided, object-based areas are interpreted as offsets
   * relative to the anchor point. To provide an absolute rectangle while anchored, pass a {@linkcode PIXI.Rectangle}.
   * {@linkcode foundry.data.BaseShapeData} instances and source data are always interpreted in absolute scene
   * coordinates.
   * Supported shapes:
   * - Point: `{x, y}`
   * - Rect: `{x, y, width, height}` or `PIXI.Rectangle`
   * - Circle: `{x, y, radius}`
   * - Ring: `{x, y, innerRadius, outerRadius}` or `{x, y, radius: [inner, outer]}`
   * - Line: `{from: {x, y}, to: {x, y}}`
   * - Points: `{points: [{x, y}, ...]}` or `{shape: "points", points: [{x, y}, ...]}`
   * - Polyline: `{path: [{x, y}, ...]}`, `{shape: "path", path: [...]}`, or
   *   `{shape: "polyline", points: [{x, y}, ...]}`
   * - Ellipse: `{x, y, radiusX, radiusY}`, `{shape: "ellipse", x, y, radiusX, radiusY}`, with optional
   *   `holeScale`, `minAngle`, `maxAngle`, `shapeRotation`, and `affectRotation`.
   * - Shape instance: {@linkcode foundry.data.BaseShapeData}
   * - Shape source data: `{type: "circle", x, y, radius}` using the {@linkcode foundry.data.BaseShapeData} schema.
   * Plain object areas without a `type` are inferred from their properties.
   */
  type Area =
    | PIXI.Rectangle
    | RegionPolygonTree
    | AnyBaseShapeData
    | ShapeDataSource
    | Point
    | { x: number; y: number; width: number; height: number }
    | { x: number; y: number; radius: number | number[] }
    | { x: number; y: number; innerRadius: number; outerRadius: number }
    | { from: Point; to: Point }
    | { points: PointList; shape?: "points" | undefined }
    | { path: PolylineDefinition; shape?: "path" | "polyline" | undefined }
    | { points: PolylineDefinition; shape: "polyline" }
    | {
        x: number;
        y: number;
        radiusX: number;
        radiusY: number;
        shape?: "ellipse" | undefined;
        holeScale?: number | undefined;
        minAngle?: number | undefined;
        maxAngle?: number | undefined;
        shapeRotation?: number | undefined;
        rotation?: number | undefined;
        affectRotation?: boolean | undefined;
      };

  /** @internal */
  interface _FadeOptions {
    /**
     * Fade-in duration in milliseconds, or a fraction of lifetime if `0 < value < 1`.
     * @defaultValue `0`
     */
    in: number;

    /**
     * Fade-out duration in milliseconds, or a fraction of lifetime if `0 < value < 1`.
     * @defaultValue `0`
     */
    out: number;
  }

  interface FadeOptions extends InexactPartial<_FadeOptions> {}

  /**
   * Particle rotation configuration that controls initial rotation of spawned particles and their rotational speed.
   *
   * Initial rotation is determined as:
   * 1. Base: Zero or, if `alignVelocity` is true, the particle's velocity angle
   * 2. Offset: `initial` is added to the base
   * 3. Spread: a random value in `[-spread, spread]` is added, default full-circle randomization
   *
   * After spawn, `speed` (degrees per second) governs ongoing rotation.
   */
  interface _RotationOptions {
    /**
     * Align initial rotation to the particle's velocity direction.
     * @defaultValue `false`
     */
    alignVelocity: boolean;

    /**
     * Fixed rotation offset in radians, additive to the base.
     * @defaultValue `0`
     */
    initial: number;

    /**
     * Symmetric random spread in radians around the base+initial. 0 means no randomization; Math.PI gives
     * full-circle random.
     * @defaultValue `Math.PI`
     */
    spread: number;

    /**
     * Rotation speed over the particle lifetime. Initially specified in degrees-per-second, internally managed
     * in radians-per-second.
     * @defaultValue `0`
     */
    speed: Value;
  }

  interface RotationOptions extends InexactPartial<_RotationOptions> {}

  interface ResolvedRotationOptions {
    alignVelocity: boolean;
    initial: number;
    spread: number;
    speed: MinMaxRange;
  }

  /**
   * A user-defined function that computes a particle velocity vector in pixels per second.
   * The function may either write into `out` and return void, or return a point-like velocity object.
   */
  type VelocityFunction = (particle: ParticleMesh, dt: number, out: PIXI.Point) => PIXI.IPointData | void | null;

  type VelocityOptions = Point | { x: Range; y: Range } | { speed: Value; angle: Range } | { fn: VelocityFunction };

  type ConstraintMode = "none" | "kill" | "clamp" | "wrap" | "bounce";

  interface ResolvedConstraints {
    mode: ConstraintMode;
    area: "budget" | "view" | "world" | PIXI.Rectangle | null;
    restitution: number;
  }

  type DebugTintMode = "random" | "palette" | "byTexture";

  /** @internal */
  interface _DebugTintOptions {
    /**
     * How to apply debug tinting.
     * @defaultValue `"random"`
     */
    mode: DebugTintMode;

    /** A list of 0xRRGGBB colors used for "palette" or "byTexture" modes. */
    palette: number[];
  }

  interface DebugTintOptions extends InexactPartial<_DebugTintOptions> {}

  interface ResolvedDebugTintOptions {
    mode: DebugTintMode;
    palette: number[];
  }

  /** @internal */
  interface _DebugOptions {
    /**
     * If true, fall back to {@linkcode PIXI.Texture.WHITE} when no textures are configured.
     * @defaultValue `false`
     */
    useWhiteTexture: boolean;

    /**
     * Optional automatic tinting for spawned particles.
     * @defaultValue `null`
     */
    tint: DebugTintOptions | boolean | null;

    /**
     * Whether to collect debug statistics.
     * @defaultValue `false`
     */
    stats: boolean;

    /**
     * Whether to capture per-tick timings (requires stats).
     * @defaultValue `false`
     */
    profile: boolean;
  }

  interface DebugOptions extends InexactPartial<_DebugOptions> {}

  interface ResolvedDebugOptions {
    useWhiteTexture: boolean;
    tint: ResolvedDebugTintOptions | null;
    stats: boolean;
    profile: boolean;
  }

  interface DebugStats {
    /** Current number of active particles. */
    active: number;

    /** Current number of pooled particles. */
    pool: number;

    /** Current adjusted target particle count. */
    target: number;

    /** Number of spawn attempts. */
    spawnAttempts: number;

    /** Number of successfully spawned particles. */
    spawned: number;

    /** Spawn attempts rejected by probability (auto-spawn only). */
    spawnRejectedProbability: number;

    /** Spawn attempts rejected by {@linkcode ParticleGenerator.positionTest}. */
    spawnRejectedPositionTest: number;

    /** Spawn attempts rejected because no valid spawn area was available. */
    spawnRejectedNoArea: number;

    /** Particles recycled due to lifetime expiration. */
    recycledLifetime: number;

    /** Particles recycled due to constraint handling. */
    recycledConstraint: number;

    /** Particles recycled/cleared due to a hard stop. */
    recycledStop: number;

    /** Number of newly-visible rectangles this frame (ambient mode). */
    newlyVisibleAreaCount: number;

    /** Time spent updating particles during the most recent tick (milliseconds). */
    updateMS: number;

    /** Time spent auto-spawning particles during the most recent tick (milliseconds). */
    spawnMS: number;

    /** Total tick time for the most recent tick (milliseconds). */
    tickMS: number;
  }

  /** @internal */
  interface _ClipOptions {
    /**
     * Whether to apply a managed clip mask. If null, defaults to true in ambient mode and false in effect mode.
     * @defaultValue `null`
     */
    enabled: boolean | null;

    /**
     * Optional clip rectangle in scene coordinates. If omitted, a shape-based spawn area is used when available.
     * Otherwise the generator bounds are used.
     * @defaultValue `null`
     */
    rect: Rectangle | null;
  }

  interface ClipOptions extends InexactPartial<_ClipOptions> {}

  interface ResolvedClipOptions {
    /**
     * @privateRemarks `#normalizeClip` can return `null`, but `_configureOptions` resolves it to a mode-based
     * default right after, so the resolved property is never `null`.
     */
    enabled: boolean;

    rect: PIXI.Rectangle | null;
  }

  type PositionTest = (
    x: number,
    y: number,
    context: { generator: ParticleGenerator; particle: ParticleMesh },
  ) => boolean;

  type ParticleCallback = (particle: ParticleMesh, context: { generator: ParticleGenerator }) => void;

  type DeathCallback = (particle: ParticleMesh, context: { generator: ParticleGenerator; reason: string }) => void;

  type TickCallback = (dt: number, generator: ParticleGenerator) => void;

  /** @internal */
  interface _DriftOptions {
    /** @defaultValue `false` */
    enabled: boolean;

    /** @defaultValue `1` */
    intensity: number;
  }

  interface DriftOptions extends InexactPartial<_DriftOptions> {}

  interface ResolvedDriftOptions extends _DriftOptions {}

  type BlurOptions =
    | number
    | { intensity: number; quality?: number | undefined }
    | { enabled: boolean; intensity: number; quality?: number | undefined }
    | null;

  interface ResolvedBlurOptions {
    enabled: boolean;
    intensity: number;
    quality: number | undefined;
  }

  /** @internal */
  interface _Configuration {
    /**
     * The runtime mode.
     * - "ambient": maintains a stable density in the visible region (viewport-based budget).
     * - "effect": spawns in a defined area; particles are lifetime-driven unless constrained.
     * @defaultValue `"ambient"`
     */
    mode: Mode;

    /**
     * Optional generator bounds in scene coordinates. This is used for coordinate conversion, viewport clamping,
     * and optional clipping. Defaults to the current Scene dimensions.
     * @defaultValue `null`
     */
    bounds: Rectangle | null;

    /**
     * The target particle count.
     * - In "ambient" mode, this is the maximum for the full bounds and is scaled by visible area.
     * - In "effect" mode, this is the absolute target.
     * @defaultValue `0`
     */
    count: number;

    /**
     * The maximum number of particles that may be spawned per second (auto-spawn mode).
     * @defaultValue `5 * PIXI.Ticker.targetFPMS * 1000`
     */
    spawnRate: number;

    /**
     * @deprecated since v14. Use {@linkcode ParticleGenerator._Configuration.spawnRate | spawnRate} instead. If
     * `spawnRate` is omitted or null, this legacy per-frame value is converted using the Pixi ticker target
     * frame rate.
     * @defaultValue `5`
     */
    perFrame: number;

    /**
     * The initial proportion (0..1) of the computed target particle count to spawn on start.
     * @defaultValue `0.25`
     */
    initial: number;

    /**
     * If true, particles are never spawned automatically. If null, defaults to true in "effect" mode unless
     * `spawnRate` is explicitly configured and false in "ambient" mode. Legacy `perFrame` does not change the
     * default.
     * @defaultValue `null`
     */
    manual: boolean | null;

    /**
     * The chance (0..1) that a spawn attempt actually creates a particle.
     * @defaultValue `1`
     */
    probability: number;

    /**
     * A proportion (0..1+) of extra area around the visible region used for spawning. For example, 0.2 extends
     * the spawn region by 20% in each dimension.
     * @defaultValue `0`
     */
    viewPadding: number;

    /**
     * If true, prioritize spawning particles in newly-visible areas when the view changes (pan/zoom).
     * @defaultValue `true`
     */
    newlyVisible: boolean;

    /**
     * If true, particles spawned in padded regions can start partially through their lifetime.
     * @defaultValue `true`
     */
    randomizeAgeInPadding: boolean;

    /**
     * The default spawn area in "effect" mode (scene coordinates).
     * @defaultValue `null`
     */
    area: Area | null;

    /**
     * Which part of the spawn area to sample.
     * @defaultValue `"interior"`
     */
    sampleMode: AreaSampleMode;

    /**
     * An optional spawn validator. The function is invoked as `(x, y, {generator, particle})` and must return
     * true if the location is valid. Coordinates are scene coordinates in pixels. The generator evaluates a
     * single candidate position per spawn attempt.
     * @defaultValue `null`
     */
    positionTest: PositionTest | null;

    /**
     * How to handle particles leaving the constraint area. If null, defaults to "kill" in ambient mode and
     * "none" in effect mode.
     * @defaultValue `null`
     */
    constraintMode: ConstraintMode | null;

    /**
     * The constraint area.
     * - "budget": the padded viewport rectangle.
     * - "view": the unpadded viewport rectangle.
     * - "world": the generator bounds.
     * - Rectangle: a custom rectangle in scene coordinates.
     * If null, defaults to "budget" in ambient mode when constraintMode is not "none".
     * @defaultValue `null`
     */
    constraintArea: "budget" | "view" | "world" | Rectangle | null;

    /**
     * Bounce restitution factor (0..1) used when constraintMode is "bounce".
     * @defaultValue `1`
     */
    restitution: number;

    /**
     * Clip (`=>` mask) configuration. Use true for default clipping. If no clip rectangle is provided and
     * {@linkcode ParticleGenerator._Configuration.area | area} is a {@linkcode foundry.data.BaseShapeData}, that
     * shape is used.
     * @defaultValue `{ enabled: null, rect: null }`
     */
    clip: ClipOptions | Rectangle | boolean;

    /**
     * An explicit mask for the particle container. Accepts either a pre-built PIXI.DisplayObject, a PIXI shape,
     * or a {@linkcode foundry.data.BaseShapeData} which is drawn into a PIXI.Graphics. Presence implies masking
     * is desired, and this mask takes precedence over `clip`.
     * @defaultValue `null`
     */
    mask: PIXI.DisplayObject | PIXI.IShape | AnyBaseShapeData | null;

    /**
     * The particle lifetime in milliseconds.
     * @defaultValue `1000`
     */
    lifetime: Range;

    /**
     * Fade envelope configuration.
     * @defaultValue `{ in: 0, out: 0 }`
     */
    fade: FadeOptions;

    /**
     * The particle velocity in pixels per second.
     * @defaultValue `null`
     */
    velocity: VelocityOptions | null;

    /**
     * Rotation configuration for particles.
     * @defaultValue `{}`
     */
    rotation: RotationOptions;

    /**
     * @deprecated since v14. Use {@linkcode ParticleGenerator._Configuration.rotation | rotation.speed} instead.
     */
    rotationSpeed: Value;

    /**
     * Optional random drift configuration.
     * @defaultValue `{ enabled: false, intensity: 1 }`
     */
    drift: DriftOptions;

    /**
     * The particle texture sources. Each entry may be a PIXI.Texture or a string path usable by
     * `foundry.canvas.getTexture`/`PIXI.Texture.from`.
     * @defaultValue `[]`
     */
    textures: (PIXI.Texture | string)[];

    /**
     * Optional sprite anchor override for particle textures. If null, each texture's `defaultAnchor` is used.
     * @defaultValue `null`
     */
    particleAnchor: Point | null;

    /**
     * Optional shader class used to render particles. Defaults to {@linkcode BaseSamplerShader}. Batchable
     * shaders are the fast path for sustained effects. ParticleGenerator creates plain
     * {@linkcode SpriteMesh} instances, so shaders which require
     * {@linkcode foundry.canvas.primary.PrimarySpriteMesh} occlusion or depth data are not supported.
     * @defaultValue `null`
     */
    shaderClass: BaseSamplerShader.AnyConstructor | null;

    /**
     * The blend mode used to render particles.
     * @defaultValue `PIXI.BLEND_MODES.NORMAL`
     */
    blend: PIXI.BLEND_MODES;

    /**
     * An optional blur filter applied to the internal container.
     * @defaultValue `null`
     */
    blur: BlurOptions;

    /**
     * The alpha value for particles.
     * @defaultValue `1`
     */
    alpha: Value;

    /**
     * The scale value for particles.
     * @defaultValue `1`
     */
    scale: Value;

    /**
     * The tint color for particles.
     * @defaultValue `0xFFFFFF`
     */
    tint: ColorValue;

    /**
     * The elevation for the particle container.
     * @defaultValue `0`
     */
    elevation: number;

    /**
     * The sorting key for the particle container.
     * @defaultValue `0`
     */
    sort: number;

    /**
     * The parent container which receives the internal particle container. Defaults to canvas.primary.
     * @defaultValue `null`
     */
    container: PIXI.Container | null;

    /**
     * The ticker used to drive the update loop. Defaults to {@linkcode CanvasAnimation.ticker}.
     * @defaultValue `null`
     */
    ticker: PIXI.Ticker | null;

    /**
     * An optional anchor used to attach areas and behaviors.
     * @defaultValue `null`
     */
    anchor: Anchor;

    /**
     * Which point to use when anchoring.
     * @defaultValue `"center"`
     */
    anchorPoint: AnchorPoint;

    /**
     * A fixed offset (scene pixels) applied to the anchor.
     * @defaultValue `null`
     */
    anchorOffset: Point | null;

    /**
     * Optional behavior.
     * @defaultValue `null`
     */
    behavior: BehaviorId | Behavior | null;

    /**
     * Orbit behavior options.
     * @defaultValue `{}`
     */
    orbit: OrbitOptions;

    /**
     * Follow behavior options.
     * @defaultValue `{}`
     */
    follow: FollowOptions;

    /**
     * An optional callback called after the particle has been placed and configured. This is a handy place to
     * attach custom per-particle data for batch shaders.
     * @defaultValue `null`
     */
    onSpawn: ParticleCallback | null;

    /**
     * An optional callback called each frame for each live particle, after position, rotation, tint, and alpha
     * have been computed.
     * @defaultValue `null`
     */
    onUpdate: ParticleCallback | null;

    /**
     * An optional callback called when a particle is recycled.
     * @defaultValue `null`
     */
    onDeath: DeathCallback | null;

    /**
     * An optional callback called per frame (not per particle!).
     * @defaultValue `null`
     */
    onTick: TickCallback | null;

    /**
     * Optional debugging helpers.
     * @defaultValue `null`
     */
    debug: DebugOptions | boolean | null;
  }

  interface Configuration extends InexactPartial<_Configuration> {}

  /** @internal */
  interface _StartOptions {
    /**
     * Spawn this many particles immediately after starting. If {@linkcode ParticleGenerator.manualSpawning} is
     * false, this is capped to the remaining budget (target - active).
     * @defaultValue `0`
     */
    spawn: number;
  }

  interface StartOptions extends InexactPartial<_StartOptions> {}

  /** @internal */
  interface _StopOptions {
    /**
     * If true, detach the update loop and destroy internal resources. If false, stop spawning and let existing
     * particles expire naturally.
     * @defaultValue `false`
     */
    hard: boolean;
  }

  interface StopOptions extends InexactPartial<_StopOptions> {}

  /** @internal */
  interface _SpawnOptions {
    /** A texture (or texture source string) to force for this particle/burst. */
    texture: PIXI.Texture | string;

    /**
     * Which part of the spawn area to sample. Defaults to the configured generator sample mode.
     */
    sampleMode: AreaSampleMode;

    /**
     * An optional spawn area override. Interpreted the same as the configured area (scene coordinates, or
     * relative-to-anchor when anchored).
     * @defaultValue `null`
     */
    area: Area | null;
  }

  /** @internal */
  interface _SpawnParticleOptions extends _SpawnOptions {
    /**
     * An optional explicit spawn position. Coordinates are in scene space.
     * @defaultValue `null`
     */
    position: PIXI.Point | Point | null;
  }

  interface SpawnParticleOptions extends InexactPartial<_SpawnParticleOptions> {}

  /** @internal */
  interface _SpawnParticlesOptions extends _SpawnOptions {
    /**
     * An optional explicit spawn position (scene coordinates).
     * @defaultValue `null`
     */
    position: Point | null;
  }

  interface SpawnParticlesOptions extends InexactPartial<_SpawnParticlesOptions> {}

  /**
   * @remarks {@linkcode SpriteMesh} extended with the runtime-only fields `ParticleGenerator` attaches to each
   * pooled particle instance.
   */
  interface ParticleMesh extends SpriteMesh {
    generator: ParticleGenerator;
    elapsedTime: number;
    time: number;
    lifetime: number;
    fadeInDuration: number;
    fadeOutDuration: number;
    maxAlpha: number;
    _baseScale: number;
    _baseTint: number;
    _baseSpeed?: number | undefined;
    _baseRotationSpeed: number;
    rotationSpeed: number;
    movementSpeed: PIXI.Point;
    _movementDirectionX?: number | undefined;
    _movementDirectionY?: number | undefined;
    _movementDriftX?: number | undefined;
    _movementDriftY?: number | undefined;
    _velocityFunctionBounceX?: number | undefined;
    _velocityFunctionBounceY?: number | undefined;
  }
}

export default ParticleGenerator;

declare abstract class AnyParticleGenerator extends ParticleGenerator {
  constructor(...args: never);
}

declare abstract class AnyBaseShapeData extends BaseShapeData<BaseShapeData.Schema> {
  constructor(...args: never);
}
