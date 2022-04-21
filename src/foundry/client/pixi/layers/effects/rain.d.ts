/**
 * A special full-screen weather effect which uses two Emitters to render drops and splashes
 */
declare class RainWeatherEffect extends SpecialEffect {
  /**
   * Configuration for the particle emitter for rain
   * @defaultValue `'Rain'`
   */
  static get label(): string;

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
   *     start: 0.7,
   *     end: 0.1
   *   },
   *   scale: {
   *     start: 1.0,
   *     end: 1.0,
   *     minimumScaleMultiplier: 0.8
   *   },
   *   speed: {
   *     start: 3500,
   *     end: 3500,
   *     minimumSpeedMultiplier: 0.8
   *   },
   *   startRotation: {
   *     min: 75,
   *     max: 75
   *   },
   *   rotation: 90,
   *   rotationSpeed: {
   *     min: 0,
   *     max: 0
   *   },
   *   lifetime: {
   *     min: 0.5,
   *     max: 0.5
   *   }
   * }
   * ```
   */
  static RAIN_CONFIG: PIXI.particles.EmitterConfig | PIXI.particles.OldEmitterConfig;

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
   *     start: 1,
   *     end: 1
   *   },
   *   scale: {
   *     start: 0.6,
   *     end: 0.6,
   *     minimumScaleMultiplier: 0.8
   *   },
   *   speed: {
   *     start: 0,
   *     end: 0
   *   },
   *   startRotation: {
   *     min: -90,
   *     max: -90
   *   },
   *   noRotation: true,
   *   lifetime: {
   *     min: 0.5,
   *     max: 0.5
   *   }
   * }
   * ```
   */
  static SPLASH_CONFIG: PIXI.particles.EmitterConfig | PIXI.particles.OldEmitterConfig;

  getParticleEmitters(): PIXI.particles.Emitter[];

  /**
   * @internal
   */
  protected _getRainEmitter(parent: PIXI.Container): PIXI.particles.Emitter;

  /**
   * @internal
   */
  protected _getSplashEmitter(parent: PIXI.Container): PIXI.particles.Emitter;
}
