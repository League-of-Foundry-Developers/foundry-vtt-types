/**
 * A full-screen weather effect which renders drifting snowflakes.
 */
declare class SnowWeatherEffect extends ParticleEffect {
  /**
   * @defaultValue `"WEATHER.Snow"`
   */
  static override label: string;

  /**
   * Configuration for the particle emitter for snow
   */
  static SNOW_CONFIG: PIXI.particles.EmitterConfigV3;

  override getParticleEmitters(): PIXI.particles.Emitter[];
}
