/**
 * A full-screen weather effect which renders rain drops and splashes.
 */
declare class RainWeatherEffect extends ParticleEffect {
  /**
   * Configuration for the particle emitter for rain
   * @defaultValue `"WEATHER.Rain"`
   */
  static override label: string;

  /**
   * Configuration for the particle emitter for rain
   */
  static RAIN_CONFIG: PIXI.particles.EmitterConfigV3;

  /**
   * Configuration for the particle emitter for splashes
   */
  static SPLASH_CONFIG: PIXI.particles.EmitterConfigV3;

  override getParticleEmitters(): PIXI.particles.Emitter[];
}
