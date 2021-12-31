/**
 * TODO: Document Me
 */
declare class SpecialEffect {
  constructor(parent: PIXI.Container, options?: DeepPartial<SpecialEffect.Options>);

  parent: PIXI.Container;

  options: SpecialEffect.Options;

  emitters: PIXI.particles.Emitter[];

  /**
   * Use this flag as a way to pass a stop signal into the animation frame
   * @internal
   */
  protected _stop: boolean | null;

  static OPTION_TYPES: {
    VALUE: 1;
    CHECKBOX: 2;
    RANGE: 3;
    SELECT: 4;
  };

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

  /**
   * @defaultValue `'Special Effect'`
   */
  static get label(): string;

  /**
   * @defaultValue
   * ```typescript
   * {
   *   density: {
   *     label: "Particle Density",
   *     type: this.OPTION_TYPES.RANGE,
   *     value: 0.5,
   *     min: 0.1,
   *     max: 5,
   *     step: 0.1
   *   }
   * }
   * ```
   */
  static get effectOptions(): SpecialEffect.Options;

  getParticleEmitters(): PIXI.particles.Emitter[];

  play(duration: number): void;

  stop(): void;

  /**
   * @internal
   */
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
