import type { Brand, Identity, InexactPartial } from "fvtt-types/utils";

declare global {
  /**
   * A filter specialized for transition effects between a source object and a target texture.
   */
  class TextureTransitionFilter extends AbstractBaseFilter {
    static get TYPES(): TextureTransitionFilter.Types;

    /**
     * The transition type (see {@link TextureTransitionFilter.TYPES | `TextureTransitionFilter.TYPES`}).
     * @defaultValue `TYPES.FADE`
     */
    get type(): TextureTransitionFilter.TYPES;

    set type(type);

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
      options?: TextureTransitionFilter.AnimateOptions,
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

  namespace TextureTransitionFilter {
    interface Any extends AnyTextureTransitionFilter {}
    interface AnyConstructor extends Identity<typeof AnyTextureTransitionFilter> {}

    type TYPES = Brand<string, "TextureTransitionFilter.TYPES">;

    /**
     * Transition types for this shader.
     */
    interface Types {
      readonly FADE: "fade" & TextureTransitionFilter.TYPES;
      readonly SWIRL: "swirl" & TextureTransitionFilter.TYPES;
      readonly WATER_DROP: "waterDrop" & TextureTransitionFilter.TYPES;
      readonly MORPH: "morph" & TextureTransitionFilter.TYPES;
      readonly CROSSHATCH: "crosshatch" & TextureTransitionFilter.TYPES;
      readonly WIND: "wind" & TextureTransitionFilter.TYPES;
      readonly WAVES: "waves" & TextureTransitionFilter.TYPES;
      readonly WHITE_NOISE: "whiteNoise" & TextureTransitionFilter.TYPES;
      readonly HOLOGRAM: "hologram" & TextureTransitionFilter.TYPES;
      readonly HOLE: "hole" & TextureTransitionFilter.TYPES;
      readonly HOLE_SWIRL: "holeSwirl" & TextureTransitionFilter.TYPES;
      readonly GLITCH: "glitch" & TextureTransitionFilter.TYPES;
      readonly DOTS: "dots" & TextureTransitionFilter.TYPES;
    }

    /** @internal */
    type _AnimateOptions = InexactPartial<{
      /**
       * The transition type
       * @defaultValue `TYPES.FADE`
       * @remarks Can't be null because it only has a signature-provided default.
       */
      type: TextureTransitionFilter.TYPES;

      /**
       * The name of the {@link CanvasAnimation | `CanvasAnimation`}.
       * @remarks All use of `name` in `CanvasAnimation.animate` is predicated on `if (name)`, so null should be equivalent to leaving it off.
       */
      name: PropertyKey | null;

      /**
       * The animation duration
       * @defaultValue `1000`
       * @remarks This function does not provide a default, but CanvasAnimation.animate does. Can't be null beause that default is only signature-provided.
       */
      duration: number;

      /**
       * The easing function of the animation
       */
      easing: CanvasAnimation.EasingFunction | null;
    }>;

    interface AnimateOptions extends _AnimateOptions {}
  }
}

declare abstract class AnyTextureTransitionFilter extends TextureTransitionFilter {
  constructor(arg0: never, ...args: never[]);
}
