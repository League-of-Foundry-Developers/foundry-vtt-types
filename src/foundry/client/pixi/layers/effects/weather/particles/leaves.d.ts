/**
 * A full-screen weather effect which renders gently falling autumn leaves.
 */
declare class AutumnLeavesWeatherEffect extends ParticleEffect {
  /**
   * @defaultValue `"WEATHER.AutumnLeaves"`
   */
  static override label: string;

  /**
   * Configuration for the particle emitter for falling leaves
   */
  static LEAF_CONFIG: PIXI.particles.EmitterConfigV3;

  override getParticleEmitters(): PIXI.particles.Emitter[];
}
