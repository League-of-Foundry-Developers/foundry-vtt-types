import type { AnyObject } from "../../../../../types/utils.d.mts";

export {};

declare global {
  /**
   * A layer of background alteration effects which change the appearance of the primary group render texture.
   */
  class CanvasDarknessEffects extends CanvasLayer {
    /**
     * @defaultValue `true`
     */
    override sortableChildren: boolean;

    /**
     * Clear coloration effects container
     */
    clear(): void;

    override _draw(options: AnyObject): Promise<void>;
  }
}
