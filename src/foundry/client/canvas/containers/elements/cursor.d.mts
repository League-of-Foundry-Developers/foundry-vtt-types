import type { Identity } from "#utils";

/**
 * A single Mouse Cursor
 */
declare class Cursor extends PIXI.Container {
  constructor(user: User.Implementation);

  /**
   * The target cursor position.
   * @defaultValue `{x: 0, y: 0}`
   */
  target: PIXI.IPointData;

  /**
   * Update the position of this cursor based on the current position?
   * @defaultValue `true`
   * @internal
   */
  protected _updatePosition: boolean;

  override updateTransform(): void;

  /**
   * Update visibility and animations
   * @param user - The user
   */
  refreshVisibility(user: User.Implementation): void;

  /**
   * Draw the user's cursor as a small dot with their user name attached as text
   */
  draw(user: User.Implementation): void;

  /**
   * Move an existing cursor to a new position smoothly along the animation loop
   * @deprecated Made hard private in v13 (this warning will be removed in v14)
   */
  protected _animate(): never;

  override destroy(options?: PIXI.IDestroyOptions | boolean): void;

  #Cursor: true;
}

declare namespace Cursor {
  interface Any extends AnyCursor {}
  interface AnyConstructor extends Identity<typeof AnyCursor> {}
}

export default Cursor;

declare abstract class AnyCursor extends Cursor {
  constructor(...args: never);
}
