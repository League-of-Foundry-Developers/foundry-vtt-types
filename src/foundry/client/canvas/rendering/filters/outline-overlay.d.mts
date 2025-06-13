import type { FixedInstanceType, Identity } from "#utils";
import type { AbstractBaseFilter } from "./_module.d.mts";
import type { AbstractBaseShader } from "../shaders/_module.mjs";

/**
 * A filter which implements an outline.
 * Inspired from https://github.com/pixijs/filters/tree/main/filters/outline
 * @remarks MIT License
 */
declare class OutlineOverlayFilter extends AbstractBaseFilter {
  /**
   * @defaultValue `3`
   */
  override padding: number;

  /**
   * @defaultValue `false`
   */
  override autoFit: boolean;

  /**
   * If the filter is animated or not.
   * @defaultValue `true`
   */
  animated: boolean;

  /**
   * @defaultValue
   * ```js
   * {
   *    outlineColor: [1, 1, 1, 1],
   *    thickness: [1, 1],
   *    alphaThreshold: 0.60,
   *    knockout: true,
   *    wave: false
   * }
   * ```
   */
  static override defaultUniforms: AbstractBaseShader.Uniforms;

  static override vertexShader: string;

  /**
   * Dynamically create the fragment shader used for filters of this type.
   */
  static createFragmentShader(): string;

  /**
   * The thickness of the outline.
   * @defaultValue `3`
   */
  get thickness(): number;

  set thickness(value);

  static override create<ThisType extends AbstractBaseFilter.AnyConstructor>(
    this: ThisType,
    initialUniforms?: AbstractBaseShader.Uniforms,
  ): FixedInstanceType<ThisType>;

  override apply(
    filterManager: PIXI.FilterSystem,
    input: PIXI.RenderTexture,
    output: PIXI.RenderTexture,
    clear?: PIXI.CLEAR_MODES,
  ): void;

  /**
   * @deprecated "`OutlineOverlayFilter#animate` is deprecated in favor of {@link OutlineOverlayFilter.animated | `OutlineOverlayFilter#animated`}." (since v12, until v14)
   */
  get animate(): boolean;

  set animate(v);

  #OutlineOverlayFilter: true;
}

declare namespace OutlineOverlayFilter {
  interface Any extends AnyOutlineOverlayFilter {}
  interface AnyConstructor extends Identity<typeof AnyOutlineOverlayFilter> {}
}

export default OutlineOverlayFilter;

declare abstract class AnyOutlineOverlayFilter extends OutlineOverlayFilter {
  constructor(...args: never);
}
