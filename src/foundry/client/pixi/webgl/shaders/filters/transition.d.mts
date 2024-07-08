import type { FilterSystem, RenderTexture, CLEAR_MODES } from "pixi.js";

export {};

declare global {
  /**
   * A filter specialized for transition effects between a source object and a target texture.
   */
  class TextureTransitionFilter extends AbstractBaseFilter {
    /**
     * If this filter requires padding (according to type)
     */
    #requirePadding: boolean;

    /**
     * Transition types for this shader.
     */
    static get TYPES(): Record<string, string>;

    static #TYPES: Record<string, string>;

    /**
     * Maps the type number to its string.
     */
    static #TYPE_NUMBER_TO_STRING: ReadonlyArray<string>;

    /**
     * Maps the type string to its number.
     */
    static #TYPE_STRING_TO_NUMBER: Readonly<{ [type: string]: number }>;

    /**
     * Types that requires padding
     */
    static #PADDED_TYPES: ReadonlyArray<string>;

    /**
     * The transition type (see {@link TextureTransitionFilter.TYPES}).
     * @defaultValue TextureTransitionFilter.TYPES.FADE
     */
    get type(): string;

    set type(type: string);

    /**
     * Sampler target for this filter.
     */
    set targetTexture(targetTexture: PIXI.Texture);

    /**
     * Animate a transition from a subject SpriteMesh/PIXI.Sprite to a given texture.
     * @returns   A Promise which resolves to true once the animation has concluded
     *            or false if the animation was prematurely terminated
     */
    static animate(
      /**
       * The source mesh/sprite to apply a transition.
       */
      subject: PIXI.Sprite | SpriteMesh,
      /**
       * The target texture.
       */
      texture: PIXI.Texture,
      options?: {
        /**
         * The transition type
         * @defaultValue `TYPES.FADE`
         */
        type?: typeof TextureTransitionFilter.TYPES;
        /**
         * The name of the {@link CanvasAnimation}.
         */
        name?: string | symbol;
        /**
         * The animation duration
         * @defaultValue 1000
         */
        duration?: number;
        /**
         * The easing function of the animation
         */
        easing?: Function | string;
      },
    ): Promise<boolean>;

    static defaultUniforms: AbstractBaseShader.Uniforms;

    static vertexShader: string;

    static fragmentShader: string;

    override apply(
      filterManager: FilterSystem,
      input: RenderTexture,
      output: RenderTexture,
      clearMode?: CLEAR_MODES,
    ): void;
  }
}
