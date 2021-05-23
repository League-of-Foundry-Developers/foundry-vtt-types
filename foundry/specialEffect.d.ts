/**
 * I don't know what this will do yet
 */
declare class SpecialEffect {
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
   *   spawnType: 'rect'
   * }
   * ```
   */
  static DEFAULT_CONFIG: PIXI.particles.EmitterConfig | PIXI.particles.OldEmitterConfig;

  static OPTION_TYPES: {
    VALUE: 1;
    CHECKBOX: 2;
    RANGE: 3;
    SELECT: 4;
  };

  static get label(): string;

  static get effectOptions(): SpecialEffect.Options;

  constructor(parent: PIXI.Container, options?: DeepPartial<SpecialEffect.Options>);

  emitters: PIXI.particles.Emitter[];

  options: SpecialEffect.Options;

  parent: PIXI.Container;

  /**
   * Use this flag as a way to pass a stop signal into the animation frame
   */
  protected _stop: boolean | null;

  getParticleEmitters(): PIXI.particles.Emitter[];

  play(duration: number): void;

  stop(): void;

  protected _startEmitter(emitter: PIXI.particles.Emitter): void;
}

declare namespace SpecialEffect {
  interface Options {
    density: {
      /**
       * @defaultValue `'Particle Density'`
       */
      label: string;

      /**
       * @defaultValue `SpecialEffect.OPTION_TYPES.RANGE`
       */
      type: ValueOf<typeof SpecialEffect['OPTION_TYPES']>;

      /**
       * @defaultValue `0.5`
       */
      value: number;

      /**
       * @defaultValue `0.1`
       */
      min: number;

      /**
       * @defaultValue `5`
       */
      max: number;

      /**
       * @defaultValue `0.1`
       */
      step: number;
    };
  }

  type BlendMode =
    | 'normal'
    | 'add'
    | 'multiply'
    | 'screen'
    | 'overlay'
    | 'darken'
    | 'lighten'
    | 'color_dodge'
    | 'color_burn'
    | 'hard_light'
    | 'soft_light'
    | 'difference'
    | 'exclusion'
    | 'hue'
    | 'saturation'
    | 'color'
    | 'luminosity';

  type SpawnType = 'point' | 'rect' | 'circle' | 'ring' | 'burst';
}
