import type { InexactPartial } from "../../../../../types/utils.d.mts";

declare global {
  /**
   * A generic helper for drawing a standard Control Icon
   */
  class ControlIcon extends PIXI.Container {
    constructor(args: {
      texture: string;

      /** @defaultValue `40` */
      size?: number;

      /** @defaultValue `0xFF5500` */
      borderColor?: number;

      /** @defaultValue `null` */
      tint?: number | null;

      /** @defaultValue `number` */
      elevation: number;
    });

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
    override eventMode: "none" | "passive" | "auto" | "static" | "dynamic";

    /**
     * @defaultValue `false`
     */
    interactiveChildren: boolean;

    hitArea: PIXI.Rectangle;

    bg: PIXI.Graphics;

    icon: PIXI.Sprite;

    /**
     * @defaultValue
     * The `visible` property is true.
     */
    border: PIXI.Graphics;

    tooltip: PreciseText;

    /**
     * The elevation of the ControlIcon, which is displayed in its tooltip text.
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
    refresh({
      visible,
      iconColor,
      borderColor,
      borderVisible,
    }?: InexactPartial<{
      visible: boolean;
      iconColor: number;
      borderColor: number;
      borderVisible: boolean;
    }>): this;
  }
}
