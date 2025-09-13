import type { FixedInstanceType, Identity, InexactPartial } from "#utils";
import type { AbstractBaseFilter, AbstractBaseMaskFilter } from "./_module.d.mts";
import type { AbstractBaseShader } from "../shaders/_module.mjs";

/**
 * Apply visibility coloration according to the baseLine color.
 * Uses very lightweight gaussian vertical and horizontal blur filter passes.
 */
declare class VisibilityFilter extends AbstractBaseMaskFilter {
  constructor(...args: ConstructorParameters<typeof AbstractBaseMaskFilter>);

  /**
   * @defaultValue
   * ```js
   * {
   *    exploredColor: [1, 1, 1],
   *    unexploredColor: [0, 0, 0],
   *    screenDimensions: [1, 1],
   *    visionTexture: null,
   *    primaryTexture: null,
   *    overlayTexture: null,
   *    overlayMatrix: new PIXI.Matrix(),
   *    hasOverlayTexture: false
   * }
   * ```
   */
  static override defaultUniforms: AbstractBaseShader.Uniforms;

  static override create<ThisType extends AbstractBaseFilter.AnyConstructor>(
    this: ThisType,
    initialUniforms?: AbstractBaseShader.Uniforms,
    options?: VisibilityFilter.FragmentShaderOptions,
  ): FixedInstanceType<ThisType>;

  static override vertexShader: string;

  static override fragmentShader(options: VisibilityFilter.FragmentShaderOptions): string;

  /**
   * Set the blur strength
   * @param value - blur strength
   */
  set blur(value: number);

  get blur(): number;

  override apply(
    filterManager: PIXI.FilterSystem,
    input: PIXI.RenderTexture,
    output: PIXI.RenderTexture,
    clear?: PIXI.CLEAR_MODES,
  ): void;

  /**
   * Calculate the fog overlay sprite matrix.
   */
  calculateMatrix(filterManager: PIXI.FilterSystem): void;

  #VisibilityFilter: true;
}

declare namespace VisibilityFilter {
  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode Implementation} instead */
  type Any = Internal.Any;

  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode ImplementationClass} instead */
  type AnyConstructor = Internal.AnyConstructor;

  namespace Internal {
    interface Any extends AnyVisibilityFilter {}
    interface AnyConstructor extends Identity<typeof AnyVisibilityFilter> {}
  }

  interface ImplementationClass extends Identity<CONFIG["Canvas"]["visibilityFilter"]> {}
  interface Implementation extends FixedInstanceType<ImplementationClass> {}

  /** @internal */
  type _FragmentShaderOptions = InexactPartial<{
    persistentVision: boolean;
  }>;

  interface FragmentShaderOptions extends _FragmentShaderOptions {}
}

export default VisibilityFilter;

declare abstract class AnyVisibilityFilter extends VisibilityFilter {
  constructor(...args: never);
}
