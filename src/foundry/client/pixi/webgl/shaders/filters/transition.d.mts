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
     * @param subject - The source mesh/sprite to apply a transition.
     * @param texture - The target texture.
     * @param options - Animation options.
     * @returns   A Promise which resolves to true once the animation has concluded
     *            or false if the animation was prematurely terminated
     */
    static animate(
      subject: PIXI.Sprite | SpriteMesh,
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

    static override defaultUniforms: AbstractBaseShader.Uniforms;

    static override vertexShader: string;

    static override fragmentShader: string | ((...args: any[]) => string) | undefined;

    override apply(
      filterManager: FilterSystem,
      input: RenderTexture,
      output: RenderTexture,
      clearMode?: CLEAR_MODES,
    ): void;
  }
}
