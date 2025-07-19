import type { Identity } from "#utils";
import { ParticleEffect } from "#client/canvas/containers/_module.mjs";

/**
 * A full-screen weather effect which renders gently falling autumn leaves.
 */
declare class AutumnLeavesWeatherEffect extends ParticleEffect {
  /**
   * @remarks `options` is completely unused in this subclass, as it gets passed to {@linkcode AutumnLeavesWeatherEffect.getParticleEmitters | #getParticleEmitters},
   * which, unlike {@linkcode ParticleEffect | super}'s method, takes no arguments
   */
  constructor(options?: PIXI.particles.EmitterConfigV3);

  /**
   * @defaultValue `"WEATHER.AutumnLeaves"`
   * @remarks A localization key. Appears to be unused in v12.331, probably vestigial, is identical to the
   * `label` for the AmbienceConfig containing this effect in `CONFIG.Canvas.weatherEffects`
   */
  static label: string;

  /**
   * Configuration for the particle emitter for falling leaves
   * @remarks Not a complete {@linkcode PIXI.particles.EmitterConfigV3}; the `frequency` and `pos` required keys are omitted. `frequency` is set
   * up in {@linkcode AutumnLeavesWeatherEffect.getParticleEmitters | #getParticleEmitters}, but `pos` is not; it is erroneously marked as required
   * in the interface, see https://github.com/pixijs-userland/particle-emitter/issues/219
   */
  static LEAF_CONFIG: AutumnLeavesWeatherEffect.LeafConfig;

  /** @remarks This does not take a config parameter, unlike its parent class; uses {@linkcode AutumnLeavesWeatherEffect.LEAF_CONFIG} instead */
  override getParticleEmitters(): PIXI.particles.Emitter[];
}

declare namespace AutumnLeavesWeatherEffect {
  interface Any extends AnyAutumnLeavesWeatherEffect {}
  interface AnyConstructor extends Identity<typeof AnyAutumnLeavesWeatherEffect> {}

  /** @internal */
  interface _EmitterConfigOptionalProperties {
    pos?: PIXI.particles.EmitterConfigV3["pos"];
    frequency?: PIXI.particles.EmitterConfigV3["frequency"];
  }

  interface LeafConfig
    extends Omit<PIXI.particles.EmitterConfigV3, keyof _EmitterConfigOptionalProperties>,
      _EmitterConfigOptionalProperties {}
}

export default AutumnLeavesWeatherEffect;

declare abstract class AnyAutumnLeavesWeatherEffect extends AutumnLeavesWeatherEffect {
  constructor(...args: never);
}
