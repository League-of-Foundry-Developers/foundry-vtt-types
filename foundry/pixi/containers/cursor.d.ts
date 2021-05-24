/**
 * A single Mouse Cursor
 */
declare class Cursor extends PIXI.Container {
  constructor(user: User);

  target: { x: number; y: number };

  /**
   * Draw the user's cursor as a small dot with their user name attached as text
   */
  draw(user: User): void;

  /**
   * Move an existing cursor to a new position smoothly along the animation loop
   */
  protected _animate(): void;

  /**
   * Remove the cursor update from the animation loop and destroy the container.
   * @param options - Additional options passed to the parent `PIXI.Container.destroy()` method
   */
  destroy(options?: { children?: boolean; texture?: boolean; baseTexture?: boolean }): void;
}
