/**
 * A special full-screen weather effect which uses one Emitters to render gently falling autumn leaves
 */

declare class AutumnLeavesWeatherEffect extends SpecialEffect {
  static get label(): string;

  static get effectOptions(): SpecialEffect.Options;

  getParticleEmitters(): PIXI.particles.Emitter[];

  protected _getLeafEmitter(parent: PIXI.Container): PIXI.particles.Emitter;

  static LEAF_CONFIG: typeof SpecialEffect['DEFAULT_CONFIG'] & {
    alpha: {
      /**
       * @defaultValue `0.9`
       */
      start: number;

      /**
       * @defaultValue `0.5`
       */
      end: number;
    };

    scale: {
      /**
       * @defaultValue `0.2`
       */
      start: number;

      /**
       * @defaultValue `0.4`
       */
      end: number;

      /**
       * @defaultValue `0.5`
       */
      minimumScaleMultiplier: number;
    };

    speed: {
      /**
       * @defaultValue `20`
       */
      start: number;

      /**
       * @defaultValue `60`
       */
      end: number;

      /**
       * @defaultValue `0.6`
       */
      minimumSpeedMultiplier: number;
    };

    startRotation: {
      /**
       * @defaultValue `0`
       */
      min: number;

      /**
       * @defaultValue `365`
       */
      max: number;
    };

    /**
     * @defaultValue `180`
     */
    rotation: number;

    rotationSpeed: {
      /**
       * @defaultValue `100`
       */
      min: number;

      /**
       * @defaultValue `200`
       */
      max: number;
    };

    lifetime: {
      /**
       * @defaultValue `10`
       */
      min: number;

      /**
       * @defaultValue `10`
       */
      max: number;
    };
  };
}
