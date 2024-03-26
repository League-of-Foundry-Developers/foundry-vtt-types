export {};

declare global {
  /**
   * A full-screen weather effect which renders gently falling autumn leaves.
   */
  class AutumnLeavesWeatherEffect extends ParticleEffect {
    /**
     * @defaultValue `"WEATHER.AutumnLeaves"`
     */
    static label: string;

    /**
     * Configuration for the particle emitter for falling leaves
     */
    static LEAF_CONFIG: PIXI.particles.EmitterConfigV3;

    override getParticleEmitters(): PIXI.particles.Emitter[];
  }
}
