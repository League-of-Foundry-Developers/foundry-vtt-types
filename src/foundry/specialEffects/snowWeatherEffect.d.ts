/**
 * A special full-screen weather effect which uses one Emitters to render snowflakes
 */
declare class SnowWeatherEffect extends SpecialEffect {
  static get label(): string;

  getParticleEmitters(): PIXI.particles.Emitter[];

  _getSnowEmitter(parent: PIXI.Container): PIXI.particles.Emitter;

  /**
   * @defaultValue
   * ```typescript
   * {
   *   maxSpeed: 0,
   *   noRotation: false,
   *   blendMode: 'normal',
   *   emitterLifetime: -1,
   *   pos: {
   *     x: 0,
   *     y: 0
   *   },
   *   spawnType: 'rect',
   *   alpha: {
   *     start: 0.9,
   *     end: 0.5
   *   },
   *   scale: {
   *     start: 0.2,
   *     end: 0.4,
   *     minimumScaleMultiplier: 0.5
   *   },
   *   speed: {
   *     start: 190,
   *     end: 210,
   *     minimumSpeedMultiplier: 0.6
   *   },
   *   startRotation: {
   *     min: 50,
   *     max: 75
   *   },
   *   rotation: 90,
   *   rotationSpeed: {
   *     min: 0,
   *     max: 200
   *   },
   *   lifetime: {
   *     min: 4,
   *     max: 4
   *   }
   * }
   * ```
   */
  static SNOW_CONFIG: PIXI.particles.EmitterConfig | PIXI.particles.OldEmitterConfig;
}
