import type { HandleEmptyObject } from "../../../../types/utils.d.mts";

declare global {
  /**
   * A specialized canvas group for rendering hidden containers before all others (like masks).
   */
  class HiddenCanvasGroup<
    DrawOptions extends HiddenCanvasGroup.DrawOptions = HiddenCanvasGroup.DrawOptions,
    TearDownOptions extends HiddenCanvasGroup.TearDownOptions = HiddenCanvasGroup.TearDownOptions,
  > extends CanvasGroupMixin<typeof PIXI.Container, "hidden">(PIXI.Container)<DrawOptions, TearDownOptions> {
    /**
     * @defaultValue `"none"`
     * @remarks Actually an override of `PIXI.Container#eventMode`
     */
    eventMode: PIXI.EventMode;

    /**
     * The container which hold masks.
     */
    masks: PIXI.Container;

    /**
     * Add a mask to this group.
     * @param name          - Name of the mask.
     * @param displayObject - Display object to add.
     * @param position      - Position of the mask.
     * @throws If `displayObject` doesn't implement a `clear` method, or if `name` is an empty string
     */
    addMask(name: string, displayObject: PIXI.DisplayObject, position?: number | null): void;

    /**
     * Invalidate the masks: flag them for rerendering.
     */
    invalidateMasks(): void;

    protected override _draw(options: HandleEmptyObject<DrawOptions>): Promise<void>;

    protected override _tearDown(options: HandleEmptyObject<TearDownOptions>): Promise<void>;
  }

  namespace HiddenCanvasGroup {
    type Any = AnyHiddenCanvasGroup;
    type AnyConstructor = typeof AnyHiddenCanvasGroup;

    interface DrawOptions extends CanvasGroupMixin.DrawOptions {}

    interface TearDownOptions extends CanvasGroupMixin.TeardownOptions {}
  }
}

declare abstract class AnyHiddenCanvasGroup extends HiddenCanvasGroup {
  constructor(arg0: never, ...args: never[]);
}
