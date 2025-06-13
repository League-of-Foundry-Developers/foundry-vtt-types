import type { Identity, InexactPartial } from "#utils";
import { PreciseText } from "#client/canvas/containers/_module.mjs";

/**
 * A generic helper for drawing a standard Control Icon
 */
declare class ControlIcon extends PIXI.Container {
  /**
   * @remarks
   * - Despite being an `={}` param, `options` is required (specifically its `texture` property)
   * - Foundry adds a `...args` rest param after `options` and calls `super(...args)`, but `new PIXI.Container()` takes no arguments
   */
  constructor(options: ControlIcon.Options);

  iconSrc: string;

  size: number;

  rect: [number, number, number, number];

  borderColor: number;

  /**
   * The color of the icon tint, if any
   */
  tintColor: number | null;

  /**
   * @defaultValue `static`
   */
  override eventMode: PIXI.EventMode;

  /**
   * @defaultValue `false`
   */
  override interactiveChildren: boolean;

  override hitArea: PIXI.Rectangle;

  override cursor: string;

  bg: PIXI.Graphics;

  icon: PIXI.Sprite;

  border: PIXI.Graphics;

  tooltip: PreciseText;

  /**
   * The elevation of the ControlIcon, which is displayed in its tooltip text.
   * @throws If a set is attempted with anything but a finite number
   */
  get elevation(): number;

  set elevation(value);

  /**
   * Initial drawing of the ControlIcon
   */
  draw(): Promise<this>;

  /**
   * Incremental refresh for ControlIcon appearance.
   */
  refresh({ visible, iconColor, borderColor, borderVisible }?: ControlIcon.RefreshOptions): this;
}

declare namespace ControlIcon {
  interface Any extends AnyControlIcon {}
  interface AnyConstructor extends Identity<typeof AnyControlIcon> {}

  /** @internal */
  type _Options = InexactPartial<{
    /**
     * @defaultValue `40`
     * @remarks Can't be `null` as it only has a parameter default, and `null` coerced to `0` is a nonsensical size value
     */
    size: number;

    /**
     * @defaultValue `0xFF5500`
     * @remarks Can't be `null` as that's not a valid value for the `PIXI.Color` constructor,
     * and it only has a parameter default
     */
    borderColor: number;

    /**
     * @defaultValue `null`
     * @remarks The default value of `null` is equivalent to `0xFFFFFF`, or effectively no tint
     */
    tint: number | null;

    /**
     * @defaultValue `number`
     * @remarks Can't be null as the `ControlIcon#elevation` setter throws if passed anything but a finite number,
     * and it only has a parameter default
     */
    elevation: number;
  }>;

  interface Options extends _Options {
    /** A source string for the icon's texture */
    texture: string;
  }

  /** @internal */
  type _RefreshOptions = InexactPartial<{
    /** @remarks Can't be `null` because of an explicit `!== undefined` check */
    visible: boolean;

    /** @remarks Can't be `null` because of an explicit `!== undefined` check */
    iconColor: number;

    /** @remarks Can't be `null` because of an explicit `!== undefined` check */
    borderColor: number;

    /** @remarks Can't be `null` because of an explicit `!== undefined` check */
    borderVisible: boolean;
  }>;

  interface RefreshOptions extends _RefreshOptions {}
}

export default ControlIcon;

declare abstract class AnyControlIcon extends ControlIcon {
  constructor(...args: never);
}
