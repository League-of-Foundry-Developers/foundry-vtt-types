/**
 * A generic helper for drawing a standard Control Icon
 */
declare class ControlIcon extends PIXI.Container {
  /**
   * @param size        - (default: `40`)
   * @param borderColor - (default: `0xFF5500`)
   * @param tint        - (default: `null`)
   */
  constructor({
    texture,
    size,
    borderColor,
    tint
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
   * @defaultValue `true`
   */
  interactive: boolean;

  /**
   * @defaultValue `false`
   */
  interactiveChildren: boolean;

  hitArea: PIXI.Rectangle;

  bg: PIXI.Graphics;

  icon: PIXI.Sprite;

  border: PIXI.Graphics;

  draw(): Promise<this>;

  protected _onHoverIn(event: PIXI.InteractionEvent): void;

  protected _onHoverOut(event: PIXI.InteractionEvent): void;
}
