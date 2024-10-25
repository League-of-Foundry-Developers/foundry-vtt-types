import type { EventMode } from "pixi.js";

declare global {
  /**
   * A specialized canvas group for rendering hidden containers before all others (like masks).
   */
  class HiddenCanvasGroup extends CanvasGroupMixin(PIXI.Container) {
    /**
     * @defaultValue `"none"`
     */
    override eventMode: EventMode;

    /**
     * The container which hold masks.
     */
    masks: PIXI.Container;

    /**
     * @defaultValue `"hidden"`
     */
    static override groupName: string;

    /**
     * Add a mask to this group.
     * @param name          - Name of the mask.
     * @param displayObject - Display object to add.
     * @param position      - Position of the mask.
     */
    addMask(name: string, displayObject: PIXI.DisplayObject, position?: number): void;

    /**
     * Invalidate the masks: flag them for rerendering.
     */
    invalidateMasks(): void;

    override _draw(options: CanvasGroupMixin.DrawOptions): Promise<void>;

    override _tearDown(options: CanvasGroupMixin.TearDownOptions): Promise<void>;
  }
}
