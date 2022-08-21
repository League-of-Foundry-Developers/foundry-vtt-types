import { ConfiguredDocumentClass } from "../../../../../types/helperTypes";

declare global {
  /**
   * A single Mouse Cursor
   */
  class Cursor extends PIXI.Container {
    constructor(user: InstanceType<ConfiguredDocumentClass<typeof User>>);

    /**
     * @defaultValue `{x: 0, y: 0}`
     */
    target: { x: number; y: number };

    /**
     * Draw the user's cursor as a small dot with their user name attached as text
     */
    draw(user: InstanceType<ConfiguredDocumentClass<typeof User>>): void;

    /**
     * Move an existing cursor to a new position smoothly along the animation loop
     */
    protected _animate(): void;

    override destroy(options?: Parameters<PIXI.Container["destroy"]>[0]): void;
  }
}
