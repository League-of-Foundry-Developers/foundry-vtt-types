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
declare class DrawingTab extends PlaceableTab<"drawings"> {
  constructor(options: PlaceableTab.InputOptions<DrawingTab.Configuration>);

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

  /** @defaultValue `"templates/sidebar/tabs/placeable/drawings.hbs"` */
  static override DIRECTORY_PARTIAL: string;

  protected override _getEntryLabel(entry: DrawingDocument.Implementation): string;

  protected override _prepareDirectoryContext(
    context: DeepPartial<DrawingTab.RenderContext>,
    options: DeepPartial<PlaceableTab.RenderOptions>,
  ): Promise<DrawingTab.RenderContext>;

  protected override _prepareEntry(
    entry: DrawingDocument.Implementation,
    context: PlaceableTab.PartialEntryContext,
  ): Promise<DrawingTab.EntryContext>;

  #DrawingTab: true;
}

declare namespace DrawingTab {
  interface Any extends AnyDrawingTab {}
  interface AnyConstructor extends Identity<typeof AnyDrawingTab> {}

  interface Configuration extends PlaceableTab.Configuration<"drawings"> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions = DeepPartial<Configuration> & object;

  interface EntryContext extends PlaceableTab.EntryContext {
    /** @remarks Added by {@linkcode DrawingTab._prepareEntry | #_prepareEntry} */
    author: User.Stored | null;
  }

  interface GroupContext {
    color?: Color | undefined;
    id?: string | undefined;
    label: string;
    entries: EntryContext[];
  }

  interface RenderContext extends PlaceableTab.RenderContext {
    /** @remarks Added by {@linkcode DrawingTab._prepareDirectoryContext | #_prepareDirectoryContext} */
    groups?: GroupContext[] | undefined;
  }
}

declare abstract class AnyDrawingTab extends DrawingTab {
  constructor(...args: never);
}

export default DrawingTab;
