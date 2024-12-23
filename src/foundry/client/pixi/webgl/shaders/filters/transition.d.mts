import type { InexactPartial, ValueOf } from "../../../../../../utils/index.d.mts";

declare abstract class AnyTextureTransitionFilter extends TextureTransitionFilter {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace TextureTransitionFilter {
    type AnyConstructor = typeof AnyTextureTransitionFilter;

    /**
     * @privateRemarks types are literals and not `string` to make the `type` getter and setter typings work
     */
    interface TYPES {
      FADE: "fade";
      SWIRL: "swirl";
      WATER_DROP: "waterDrop";
      MORPH: "morph";
      CROSSHATCH: "crosshatch";
      WIND: "wind";
      WAVES: "waves";
      WHITE_NOISE: "whiteNoise";
      HOLOGRAM: "hologram";
      HOLE: "hole";
      HOLE_SWIRL: "holeSwirl";
      GLITCH: "glitch";
      DOTS: "dots";
    }
  }

  /**
   * A filter specialized for transition effects between a source object and a target texture.
   */
  class TextureTransitionFilter extends AbstractBaseFilter {
    /**
     * Transition types for this shader.
     */
    static get TYPES(): TextureTransitionFilter.TYPES;

    /**
     * The transition type (see {@link TextureTransitionFilter.TYPES}).
     * @defaultValue TYPES.FADE
     */
    get type(): ValueOf<TextureTransitionFilter.TYPES>;

    set type(type: ValueOf<TextureTransitionFilter.TYPES>);

    /**
     * Sampler target for this filter.
     */
    set targetTexture(targetTexture: PIXI.Texture);

    /**
     * Animate a transition from a subject SpriteMesh/PIXI.Sprite to a given texture.
     * @param subject - The source mesh/sprite to apply a transition.
     * @param texture - The target texture.
     * @param options - Animation options.
     * @returns   A Promise which resolves to true once the animation has concluded
     *            or false if the animation was prematurely terminated
     */
    static animate(
      subject: PIXI.Sprite | SpriteMesh,
      texture: PIXI.Texture,
      options?: InexactPartial<{
        /**
         * The transition type
         * @defaultValue `TYPES.FADE`
         */
        type: ValueOf<TextureTransitionFilter.TYPES>;

        /**
         * The name of the {@link CanvasAnimation}.
         */
        name: string | symbol;

        /**
         * The animation duration
         * @defaultValue 1000
         * @remarks this function does not provide a default, but CanvasAnimation.animate does
         */
        duration: number;

        /**
         * The easing function of the animation
         */
        easing: CanvasAnimation.EasingFunction;
      }>,
    ): Promise<boolean>;

    /**
     * @defaultValue
     * ```js
     * {
     *   tintAlpha: [1, 1, 1, 1],
     *   targetTexture: null,
     *   progress: 0,
     *   rotation: 0,
     *   anchor: {x: 0.5, y: 0.5},
     *   type: 1,
     *   filterMatrix: new PIXI.Matrix(),
     *   filterMatrixInverse: new PIXI.Matrix(),
     *   targetUVMatrix: new PIXI.Matrix()
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    static override vertexShader: string;

    static override fragmentShader: string;

    override apply(
      filterManager: PIXI.FilterSystem,
      input: PIXI.RenderTexture,
      output: PIXI.RenderTexture,
      clearMode?: PIXI.CLEAR_MODES,
    ): void;
  }
}
