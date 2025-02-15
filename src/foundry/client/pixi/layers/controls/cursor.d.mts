export {};

declare global {
  /**
   * A single Mouse Cursor
   */
  class Cursor extends PIXI.Container {
    constructor(user: User.ConfiguredInstance);

    /**
     * @defaultValue `{x: 0, y: 0}`
     */
    target: PIXI.IPointData;

    /**
     * Update visibility and animations
     * @param user - The user
     */
    refreshVisibility(user: User.ConfiguredInstance): void;

    /**
     * Draw the user's cursor as a small dot with their user name attached as text
     */
    draw(user: User.ConfiguredInstance): void;

    /**
     * Move an existing cursor to a new position smoothly along the animation loop
     */
    protected _animate(): void;

    override destroy(options?: PIXI.IDestroyOptions | boolean): void;
  }

  namespace Cursor {
    interface Any extends AnyCursor {}
    type AnyConstructor = typeof AnyCursor;
  }
}

declare abstract class AnyCursor extends Cursor {
  constructor(arg0: never, ...args: never[]);
}
