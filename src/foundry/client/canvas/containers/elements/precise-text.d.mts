import type { Identity, InexactPartial, NullishProps } from "#utils";

/**
 * An extension of the default PIXI.Text object which forces double resolution.
 * At default resolution Text often looks blurry or fuzzy.
 */
declare class PreciseText extends PIXI.Text {
  constructor(...args: ConstructorParameters<typeof PIXI.Text>);

  /** @defaultValue `false` */
  override _autoResolution: boolean;

  /** @defaultValue `2` */
  override _resolution: number;

  /**
   * Prepare a TextStyle object which merges the canvas defaults with user-provided options
   * @param anchor  - A text anchor point from CONST.TEXT_ANCHOR_POINTS
   * @param options - Additional options merged with the default TextStyle
   * @returns The prepared TextStyle
   */
  static getTextStyle({ anchor, ...options }?: PreciseText.GetTextStyleOptions): PIXI.TextStyle;
}

declare namespace PreciseText {
  interface Any extends AnyPreciseText {}
  interface AnyConstructor extends Identity<typeof AnyPreciseText> {}

  /** @internal */
  type _GetTextStyleOptions = NullishProps<{
    /**
     * A text anchor point from CONST.TEXT_ANCHOR_POINTS
     * @remarks Only checked againt `.RIGHT` and `.LEFT`, and only if an `align` key is omitted
     */
    anchor: foundry.CONST.TEXT_ANCHOR_POINTS;
  }> &
    // Can't be NullishProps because keys are only checked for `!== undefined` in PIXI
    InexactPartial<PIXI.ITextStyle>;
  interface GetTextStyleOptions extends _GetTextStyleOptions {}
}

export default PreciseText;

declare abstract class AnyPreciseText extends PreciseText {
  constructor(...args: never);
}
