import type { InexactPartial } from "fvtt-types/utils";

declare global {
  /**
   * An extension of the default PIXI.Text object which forces double resolution.
   * At default resolution Text often looks blurry or fuzzy.
   */
  class PreciseText extends PIXI.Text {
    /**
     * @param options - Additional options merged with the default TextStyle
     */
    constructor(...args: ConstructorParameters<typeof PIXI.Text>);

    /**
     * Prepare a TextStyle object which merges the canvas defaults with user-provided options
     * @param anchor  - A text anchor point from CONST.TEXT_ANCHOR_POINTS
     * @param options - Additional options merged with the default TextStyle
     * @returns The prepared TextStyle
     */
    static getTextStyle({
      anchor,
      ...options
    }?: {
      anchor?: foundry.CONST.TEXT_ANCHOR_POINTS;
    } /**
     * @remarks Can't be NullishProps because keys are only checked for `!== undefined`
     */ & InexactPartial<PIXI.ITextStyle>): PIXI.TextStyle;
  }

  namespace PreciseText {
    type AnyConstructor = typeof AnyPreciseText;
  }
}

declare abstract class AnyPreciseText extends PreciseText {
  constructor(arg0: never, ...args: never[]);
}
