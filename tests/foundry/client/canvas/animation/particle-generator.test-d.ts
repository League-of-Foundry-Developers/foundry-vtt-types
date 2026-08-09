import { describe, expectTypeOf, test } from "vitest";

import ParticleGenerator = foundry.canvas.animation.ParticleGenerator;

declare const texture: PIXI.Texture;
declare const rect: PIXI.Rectangle;
declare const container: PIXI.Container;
declare const ticker: PIXI.Ticker;
declare const displayObject: PIXI.DisplayObject;
declare const particle: ParticleGenerator.ParticleMesh;

describe("ParticleGenerator tests", () => {
  test("Construction", () => {
    new ParticleGenerator();
    new ParticleGenerator({});

    new ParticleGenerator({
      mode: "effect",
      bounds: rect,
      count: 100,
      spawnRate: 300,
      initial: 0.25,
      manual: true,
      probability: 0.5,
      viewPadding: 0.2,
      newlyVisible: true,
      randomizeAgeInPadding: false,
      area: { x: 1200, y: 900, radius: 180 },
      sampleMode: "boundary",
      positionTest: (x, y, context) => {
        expectTypeOf(x).toBeNumber();
        expectTypeOf(y).toBeNumber();
        expectTypeOf(context.generator).toEqualTypeOf<ParticleGenerator>();
        expectTypeOf(context.particle).toEqualTypeOf<ParticleGenerator.ParticleMesh>();
        return true;
      },
      constraintMode: "bounce",
      constraintArea: "budget",
      restitution: 0.8,
      clip: { enabled: true, rect },
      mask: displayObject,
      lifetime: [300, 700],
      fade: { in: 50, out: 200 },
      velocity: { speed: 4, angle: [0, 360] },
      rotation: { alignVelocity: true, initial: 0, spread: Math.PI, speed: 180 },
      drift: { enabled: true, intensity: 0.4 },
      textures: [texture, "assets/particles/spark.png"],
      particleAnchor: { x: 0.5, y: 0.5 },
      shaderClass: null,
      blend: PIXI.BLEND_MODES.SCREEN,
      blur: { enabled: true, intensity: 2, quality: 4 },
      alpha: { min: 0.2, max: 0.6 },
      scale: { min: 0.2, max: 0.6, curve: [{ time: 0, value: 1 }], step: false },
      tint: 0xffaa00,
      elevation: 10,
      sort: 1,
      container,
      ticker,
      anchor: { x: 100, y: 200 },
      anchorPoint: "center",
      anchorOffset: { x: 0, y: 0 },
      behavior: "orbit",
      orbit: { radius: 70, angularSpeed: 120, phase: [0, 360], radialSpeed: 0, direction: 1, rotation: "tangent" },
      follow: { offset: { x: 0, y: 0 }, stiffness: 1 },
      onSpawn: (p, ctx) => {
        expectTypeOf(p).toEqualTypeOf<ParticleGenerator.ParticleMesh>();
        expectTypeOf(ctx.generator).toEqualTypeOf<ParticleGenerator>();
      },
      onUpdate: () => {},
      onDeath: (p, ctx) => {
        expectTypeOf(ctx.reason).toBeString();
      },
      onTick: (dt, generator) => {
        expectTypeOf(dt).toBeNumber();
        expectTypeOf(generator).toEqualTypeOf<ParticleGenerator>();
      },
      debug: { stats: true, profile: true, tint: { mode: "byTexture" }, useWhiteTexture: true },
    });

    // Value/color options with `fn` overrides
    new ParticleGenerator({
      alpha: { fn: (p, dt) => p.time * dt },
      tint: { fn: () => 0xffffff },
      velocity: {
        fn: (p, dt, out) => {
          out.x = p.time;
          out.y = dt;
        },
      },
    });

    new ParticleGenerator({
      area: {
        x: 0,
        y: 0,
        radiusX: 10,
        radiusY: 20,
        shape: undefined,
        holeScale: undefined,
        minAngle: undefined,
        maxAngle: undefined,
        shapeRotation: undefined,
        rotation: undefined,
        affectRotation: undefined,
      },
      blur: { intensity: 2, quality: undefined },
    });

    new ParticleGenerator({ area: { points: [], shape: undefined } });
    new ParticleGenerator({ area: { path: [], shape: undefined } });
    new ParticleGenerator({ blur: { enabled: true, intensity: 2, quality: undefined } });

    // deprecated since v14:
    new ParticleGenerator({
      perFrame: 5,
      rotationSpeed: 180,
    });
  });

  const gen = new ParticleGenerator();

  test("Static properties", () => {
    expectTypeOf(ParticleGenerator.DEFAULT_OPTIONS).toEqualTypeOf<ParticleGenerator.Configuration>();
  });

  test("Configuration properties", () => {
    expectTypeOf(gen.mode).toEqualTypeOf<ParticleGenerator.Mode>();
    expectTypeOf(gen.container).toEqualTypeOf<PIXI.Container>();
    expectTypeOf(gen.anchor).toEqualTypeOf<ParticleGenerator.Anchor>();
    expectTypeOf(gen.anchorPoint).toEqualTypeOf<ParticleGenerator.AnchorPoint>();
    expectTypeOf(gen.anchorOffset).toEqualTypeOf<PIXI.IPointData | null>();
    expectTypeOf(gen.textures).toEqualTypeOf<PIXI.Texture[]>();
    expectTypeOf(gen.particleAnchor).toEqualTypeOf<PIXI.IPointData | null>();
    expectTypeOf(gen.viewport).toEqualTypeOf<ParticleGenerator.ViewportOptions>();
    expectTypeOf(gen.maxParticles).toBeNumber();
    expectTypeOf(gen.initialBatch).toBeNumber();
    expectTypeOf(gen.manualSpawning).toBeBoolean();
    expectTypeOf(gen.spawnProbability).toBeNumber();
    expectTypeOf(gen.positionTest).toEqualTypeOf<ParticleGenerator.PositionTest | null>();
    expectTypeOf(gen.sampleMode).toEqualTypeOf<ParticleGenerator.AreaSampleMode>();
    expectTypeOf(gen.constraints).toEqualTypeOf<ParticleGenerator.ResolvedConstraints>();
    expectTypeOf(gen.clip).toEqualTypeOf<ParticleGenerator.ResolvedClipOptions>();
    expectTypeOf(gen.particleLifetime).toEqualTypeOf<ParticleGenerator.Range>();
    expectTypeOf(gen.fadeInDuration).toBeNumber();
    expectTypeOf(gen.fadeOutDuration).toBeNumber();
    expectTypeOf(gen.blendMode).toEqualTypeOf<PIXI.BLEND_MODES>();
    expectTypeOf(gen.rotation).toEqualTypeOf<ParticleGenerator.ResolvedRotationOptions>();
    expectTypeOf(gen.velocity).toEqualTypeOf<ParticleGenerator.VelocityOptions | null>();
    expectTypeOf(gen.drift).toEqualTypeOf<ParticleGenerator.ResolvedDriftOptions>();
    expectTypeOf(gen.blurOptions).toEqualTypeOf<ParticleGenerator.ResolvedBlurOptions | null>();
    expectTypeOf(gen.elevation).toBeNumber();
    expectTypeOf(gen.sort).toBeNumber();
    expectTypeOf(gen.orbit).toEqualTypeOf<ParticleGenerator.ResolvedOrbitOptions>();
    expectTypeOf(gen.follow).toEqualTypeOf<ParticleGenerator.ResolvedFollowOptions>();
    expectTypeOf(gen.onSpawn).toEqualTypeOf<ParticleGenerator.ParticleCallback | null>();
    expectTypeOf(gen.onUpdate).toEqualTypeOf<ParticleGenerator.ParticleCallback | null>();
    expectTypeOf(gen.onDeath).toEqualTypeOf<ParticleGenerator.DeathCallback | null>();
    expectTypeOf(gen.onTick).toEqualTypeOf<ParticleGenerator.TickCallback | null>();
    expectTypeOf(gen.adjustedMaxParticles).toBeNumber();
    expectTypeOf(gen.particles).toEqualTypeOf<ParticleGenerator.ParticleMesh[]>();
    expectTypeOf(gen.particlePool).toEqualTypeOf<ParticleGenerator.ParticleMesh[]>();
    expectTypeOf(gen.spawnArea).toEqualTypeOf<ParticleGenerator.Area | null>();
  });

  test("Internal state", () => {
    expectTypeOf(gen["_bounds"]).toEqualTypeOf<PIXI.Rectangle>();
    expectTypeOf(gen["_constraintRect"]).toEqualTypeOf<PIXI.Rectangle | null>();
    expectTypeOf(gen["_stopped"]).toBeBoolean();
    expectTypeOf(gen["_tickerAttached"]).toBeBoolean();
    expectTypeOf(gen["_initialized"]).toBeBoolean();
    expectTypeOf(gen["_particlesContainer"]).toEqualTypeOf<PIXI.Container | null>();
    expectTypeOf(gen["_mask"]).toEqualTypeOf<PIXI.DisplayObject | null>();
    expectTypeOf(gen["_blurFilter"]).toEqualTypeOf<PIXI.Filter | null>();
    expectTypeOf(gen["_viewRectLocal"]).toEqualTypeOf<PIXI.Rectangle>();
    expectTypeOf(gen["_budgetRectLocal"]).toEqualTypeOf<PIXI.Rectangle>();
    expectTypeOf(gen["_worldRectLocal"]).toEqualTypeOf<PIXI.Rectangle>();
    expectTypeOf(gen["_oldBudgetRectLocal"]).toEqualTypeOf<PIXI.Rectangle>();
    expectTypeOf(gen["_hasOldBudgetRectLocal"]).toBeBoolean();
    expectTypeOf(gen["_newlyVisibleAreaPool"]).toEqualTypeOf<PIXI.Rectangle[]>();
    expectTypeOf(gen["_newlyVisibleAreas"]).toEqualTypeOf<PIXI.Rectangle[]>();
    expectTypeOf(gen["_anchorScene"]).toEqualTypeOf<PIXI.Point>();
    expectTypeOf(gen["_anchorLocal"]).toEqualTypeOf<PIXI.Point>();
    expectTypeOf(gen["_behavior"]).toEqualTypeOf<ParticleGenerator.Behavior | null>();
    expectTypeOf(gen["_behaviorContext"]).toEqualTypeOf<ParticleGenerator.BehaviorContext>();
    expectTypeOf(gen["_spawnPoint"]).toEqualTypeOf<PIXI.Point>();
    expectTypeOf(gen["_debug"]).toEqualTypeOf<ParticleGenerator.ResolvedDebugOptions | null>();
    expectTypeOf(gen["_debugStats"]).toEqualTypeOf<ParticleGenerator.DebugStats | null>();
    expectTypeOf(gen["_debugProfile"]).toBeBoolean();
    expectTypeOf(gen["_debugTint"]).toEqualTypeOf<ParticleGenerator.ResolvedDebugTintOptions | null>();
    expectTypeOf(gen["_debugTintByTexture"]).toEqualTypeOf<WeakMap<PIXI.Texture, number> | null>();
  });

  test("Getters", () => {
    expectTypeOf(gen.bounds).toEqualTypeOf<PIXI.Rectangle>();
    expectTypeOf(gen.particlesContainer).toEqualTypeOf<PIXI.Container | null>();
    expectTypeOf(gen.viewRectLocal).toEqualTypeOf<PIXI.Rectangle>();
    expectTypeOf(gen.budgetRectLocal).toEqualTypeOf<PIXI.Rectangle>();
    expectTypeOf(gen.spawnRate).toBeNumber();
    expectTypeOf(gen.mask).toEqualTypeOf<PIXI.DisplayObject | null>();
    expectTypeOf(gen.debugStats).toEqualTypeOf<ParticleGenerator.DebugStats | null>();
  });

  test("Public methods", () => {
    expectTypeOf(gen.start()).toBeVoid();
    expectTypeOf(gen.start({})).toBeVoid();
    expectTypeOf(gen.start({ spawn: 100 })).toBeVoid();
    expectTypeOf(gen.start({ spawn: undefined })).toBeVoid();

    expectTypeOf(gen.stop()).toBeVoid();
    expectTypeOf(gen.stop({ hard: true })).toBeVoid();
    expectTypeOf(gen.stop({ hard: undefined })).toBeVoid();

    expectTypeOf(gen.spawnParticle()).toEqualTypeOf<ParticleGenerator.ParticleMesh | null>();
    expectTypeOf(
      gen.spawnParticle({
        texture: "assets/particles/spark.png",
        sampleMode: "boundary",
        area: rect,
        position: { x: 1, y: 2 },
      }),
    ).toEqualTypeOf<ParticleGenerator.ParticleMesh | null>();
    expectTypeOf(
      gen.spawnParticle({ texture: undefined, sampleMode: undefined, area: null, position: null }),
    ).toEqualTypeOf<ParticleGenerator.ParticleMesh | null>();

    expectTypeOf(gen.spawnParticles(10)).toBeNumber();
    expectTypeOf(gen.spawnParticles(10, { texture, area: rect, position: { x: 1, y: 2 } })).toBeNumber();
  });

  test("Protected methods", () => {
    expectTypeOf(gen["_calculateGeneratorProperties"]()).toBeVoid();
    expectTypeOf(gen["_computeNewlyVisibleAreas"](rect, rect)).toBeVoid();
    expectTypeOf(gen["_initializeParticles"]()).toBeVoid();
    expectTypeOf(gen["_onTick"]()).toBeVoid();
    expectTypeOf(gen["_updateExistingParticles"](16)).toBeVoid();
    expectTypeOf(gen["_updateParticlesUnconstrained"](16, 0.016, [particle], null, null)).toBeVoid();
    expectTypeOf(gen["_updateParticlesConstrained"](16, 0.016, rect, [particle], null, null, "kill")).toBeVoid();
    expectTypeOf(gen["_autoSpawnParticles"]()).toBeVoid();
    expectTypeOf(gen["_applyRandomDrift"](particle)).toBeVoid();
    expectTypeOf(gen["_createNewParticle"](texture)).toEqualTypeOf<ParticleGenerator.ParticleMesh>();
    expectTypeOf(gen["_setupParticleBase"](particle)).toBeVoid();
    expectTypeOf(gen["_recycleParticle"](particle, "lifetime")).toBeVoid();
    expectTypeOf(gen["_getRandomTexture"]()).toEqualTypeOf<PIXI.Texture | null>();
    expectTypeOf(gen["_getDefaultBounds"]()).toEqualTypeOf<PIXI.Rectangle>();
    expectTypeOf(gen["_configureDebug"](true)).toBeVoid();
    expectTypeOf(gen["_configureDebug"](null)).toBeVoid();
  });

  test("Particle mesh shape", () => {
    expectTypeOf(particle.generator).toEqualTypeOf<ParticleGenerator>();
    expectTypeOf(particle.elapsedTime).toBeNumber();
    expectTypeOf(particle.time).toBeNumber();
    expectTypeOf(particle.lifetime).toBeNumber();
    expectTypeOf(particle.maxAlpha).toBeNumber();
    expectTypeOf(particle.rotationSpeed).toBeNumber();
    expectTypeOf(particle.movementSpeed).toEqualTypeOf<PIXI.Point>();

    particle._baseSpeed = undefined;
    particle._movementDirectionX = undefined;
    particle._movementDirectionY = undefined;
    particle._movementDriftX = undefined;
    particle._movementDriftY = undefined;
    particle._velocityFunctionBounceX = undefined;
    particle._velocityFunctionBounceY = undefined;
  });

  test("Deprecated", () => {
    /* eslint-disable @typescript-eslint/no-deprecated */
    expectTypeOf(gen.maxParticlesPerFrame).toBeNumber();
    expectTypeOf(gen.alphaRange).toEqualTypeOf<ParticleGenerator.MinMaxRange>();
    expectTypeOf(gen.scaleRange).toEqualTypeOf<ParticleGenerator.MinMaxRange>();
    /* eslint-enable @typescript-eslint/no-deprecated */
  });
});
