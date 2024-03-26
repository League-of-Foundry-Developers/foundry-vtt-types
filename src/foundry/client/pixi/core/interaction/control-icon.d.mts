export {};

declare global {
  /**
   * A generic helper for drawing a standard Control Icon
   */
  class ControlIcon extends PIXI.Container {
    /**
     * @param size        - (default: `40`)
     * @param borderColor - (default: `0xFF5500`)
     * @param tint        - (default: `null`)
     */
    constructor({
      texture,
      size,
      borderColor,
      tint,
    }: {
      texture: string;
      size?: number;
      borderColor?: number;
      tint?: number | null;
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
    }?: {
      visible?: boolean;
      iconColor?: number;
      borderColor?: number;
      borderVisible?: boolean;
    }): this;
  }
}
