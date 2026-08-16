import type { DeepPartial, Identity } from "#utils";
import type PlaceableTab from "./placeable-tab.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      DrawingTab: DrawingTab.Any;
    }
  }
}

/**
 * The Drawing-specific placeables tab.
 */
declare class DrawingTab<
  RenderContext extends DrawingTab.RenderContext = DrawingTab.RenderContext,
  Configuration extends DrawingTab.Configuration = DrawingTab.Configuration,
  RenderOptions extends DrawingTab.RenderOptions = DrawingTab.RenderOptions,
> extends PlaceableTab<RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   actions: {
   *     selectGroup: DrawingTab.#onSelectGroup
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: DrawingTab.DefaultOptions;

  /**
   * @defaultValue `"templates/sidebar/tabs/placeable/drawings.hbs"`
   */
  static override DIRECTORY_PARTIAL: string;

  /**
   * @remarks Falls back to the drawing's text before its ID.
   */
  protected override _getEntryLabel(entry: PlaceableTab.PlaceableDocument): string;

  /**
   * @remarks Groups the prepared entries by author, with any authorless drawings in a leading group.
   */
  protected override _prepareDirectoryContext(
    context: RenderContext,
    options: DeepPartial<RenderOptions>,
  ): Promise<RenderContext>;

  protected override _prepareEntry(
    entry: PlaceableTab.PlaceableDocument,
    context: PlaceableTab._EntryContext,
  ): Promise<DrawingTab.EntryContext>;

  #DrawingTab: true;

  static #DrawingTabStatic: true;
}

declare namespace DrawingTab {
  interface Any extends AnyDrawingTab {}
  interface AnyConstructor extends Identity<typeof AnyDrawingTab> {}

  interface EntryContext extends PlaceableTab.EntryContext {
    /** @remarks `null` for a drawing whose author is no longer a known User. */
    author: User.Implementation | null;
  }

  /** The drawings of a single author, rendered as one collapsible group. */
  interface Group {
    /** @remarks Absent from the group holding authorless drawings. */
    color?: Color | undefined;

    /** @remarks Absent from the group holding authorless drawings. */
    id?: string | undefined;

    label: string;

    entries: EntryContext[];
  }

  interface RenderContext extends PlaceableTab.RenderContext {
    entries?: EntryContext[] | undefined;

    groups?: Group[] | undefined;
  }

  interface Configuration<
    DrawingTab extends DrawingTab.Any = DrawingTab.Any,
  > extends PlaceableTab.Configuration<DrawingTab> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<DrawingTab extends DrawingTab.Any = DrawingTab.Any> = DeepPartial<
    Omit<Configuration<DrawingTab>, "collectionName" | "directory">
  > &
    object;

  interface RenderOptions extends PlaceableTab.RenderOptions {}
}

declare abstract class AnyDrawingTab extends DrawingTab<
  DrawingTab.RenderContext,
  DrawingTab.Configuration,
  DrawingTab.RenderOptions
> {
  constructor(...args: never);
}

export default DrawingTab;
