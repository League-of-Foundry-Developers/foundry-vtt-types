/**
 * A special full-screen weather effect which uses one Emitters to render gently falling autumn leaves
 */

declare class AutumnLeavesWeatherEffect extends SpecialEffect {
  static get label(): string;

  static get effectOptions(): SpecialEffect.Options;

  getParticleEmitters(): PIXI.particles.Emitter[];

  protected _getLeafEmitter(parent: PIXI.Container): PIXI.particles.Emitter;

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
   *     start: 20,
   *     end: 60,
   *     minimumSpeedMultiplier: 0.6
   *   },
   *   startRotation: {
   *     min: 0,
   *     max: 365
   *   },
   *   rotation: 180,
   *   rotationSpeed: {
   *     min: 100,
   *     max: 200
   *   },
   *   lifetime: {
   *     min: 10,
   *     max: 10
   *   }
   * }
   * ```
   */
  static LEAF_CONFIG: PIXI.particles.EmitterConfig | PIXI.particles.OldEmitterConfig;
}
