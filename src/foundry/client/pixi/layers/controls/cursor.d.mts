export {};

declare global {
  /**
   * A single Mouse Cursor
   */
  class Cursor extends PIXI.Container {
    constructor(user: User.Implementation);

    /**
     * Update visibility and animations
     * @param user - The user
     */
    refreshVisibility(user: User.Implementation): void;

    /**
     * @defaultValue `{x: 0, y: 0}`
     */
    target: { x: number; y: number };

    /**
     * Draw the user's cursor as a small dot with their user name attached as text
     */
    draw(user: User.Implementation): void;

    /**
     * Move an existing cursor to a new position smoothly along the animation loop
     */
    protected _animate(): void;

    override destroy(options?: PIXI.DisplayObject.DestroyOptions): void;
  }
}
