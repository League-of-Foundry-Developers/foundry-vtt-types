/**
 * I don't know what this will do yet
 */
declare class SpecialEffect {
  constructor(parent: PIXI.Container, options?: DeepPartial<SpecialEffect.Options>);

  parent: PIXI.Container;

  options: SpecialEffect.Options;

  emitters: PIXI.particles.Emitter[];

  /**
   * Use this flag as a way to pass a stop signal into the animation frame
   */
  protected _stop: boolean | null;

  static get label(): string;

  static get effectOptions(): SpecialEffect.Options;

  getParticleEmitters(): PIXI.particles.Emitter[];

  play(duration: number): void;

  stop(): void;

  protected _startEmitter(emitter: PIXI.particles.Emitter): void;

  static OPTION_TYPES: {
    VALUE: 1;
    CHECKBOX: 2;
    RANGE: 3;
    SELECT: 4;
  };

  static DEFAULT_CONFIG: {
    /**
     * @defaultValue `0`
     */
    maxSpeed: number;

    /**
     * @defaultValue `false`
     */
    noRotation: boolean;

    /**
     * @defaultValue `'normal'`
     */
    blendMode: SpecialEffect.BlendMode;

    /**
     * @defaultValue `-1`
     */
    emitterLifetime: number;

    pos: {
      /**
       * @defaultValue `0`
       */
      x: number;

      /**
       * @defaultValue `0`
       */
      y: number;
    };

    /**
     * @defaultValue `'rect'`
     */
    spawnType: SpecialEffect.SpawnType;
  };
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

  type SpawnType = 'point ' | 'rect  ' | 'circle' | 'ring  ' | 'burst ';
}
