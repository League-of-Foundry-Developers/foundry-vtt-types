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

  bg: PIXI.Graphics;

  border: PIXI.Graphics;

  borderColor: number;

  hitArea: PIXI.Rectangle;

  icon: PIXI.Sprite;

  iconSrc: string;

  /**
   * @defaultValue `true`
   */
  interactive: boolean;

  /**
   * @defaultValue `false`
   */
  interactiveChildren: boolean;

  rect: [number, number, number, number];

  size: number;

  tintColor: number | null;

  draw(): Promise<this>;

  protected _onHoverIn(event: PIXI.InteractionEvent): void;

  protected _onHoverOut(event: PIXI.InteractionEvent): void;
}
