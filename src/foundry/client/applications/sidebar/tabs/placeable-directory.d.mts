import type { AnyObject, DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type AbstractSidebarTab from "../sidebar-tab.d.mts";
import type PlaceableTab from "./placeable-tab.d.mts";

import PlaceableObject = foundry.canvas.placeables.PlaceableObject;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      PlaceableDirectory: PlaceableDirectory.Any;
    }
  }
}

/**
 * The sidebar placeables tab.
 */
declare class PlaceableDirectory<
  RenderContext extends PlaceableDirectory.RenderContext = PlaceableDirectory.RenderContext,
  Configuration extends PlaceableDirectory.Configuration = PlaceableDirectory.Configuration,
  RenderOptions extends PlaceableDirectory.RenderOptions = PlaceableDirectory.RenderOptions,
> extends HandlebarsApplicationMixin(AbstractSidebarTab)<RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: PlaceableDirectory.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  static override TABS: Record<string, ApplicationV2.TabsConfiguration>;

  /**
   * @defaultValue `"placeables"`
   */
  static override tabName: string;

  /**
   * The currently rendered tab.
   *
   * @remarks `undefined` until the first {@linkcode PlaceableDirectory._renderTab | #_renderTab} completes.
   */
  get tab(): PlaceableTab.Any | undefined;

  protected override _canRender(options: DeepPartial<RenderOptions>): boolean | void;

  /**
   * @remarks Resolves without closing unless the Scene itself was deleted.
   */
  override close(options?: PlaceableDirectory.ClosingOptions): Promise<this | void>;

  protected override _configureRenderParts(
    options: HandlebarsApplicationMixin.RenderOptions,
  ): Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * @privateRemarks The `sheet` group's tabs carry `disabled` and `order` beyond
   * {@linkcode ApplicationV2.Tab}, so this narrows the base's return.
   */
  protected override _getTabsConfig(group: string): PlaceableDirectory.TabsConfiguration | null;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  /**
   * Render the directory for a given placeable type.
   * @param context - Render context.
   * @param options - Render options.
   */
  protected _renderTab(context: RenderContext, options: DeepPartial<RenderOptions>): Promise<void>;

  override changeTab(tab: string, group: string, options?: ApplicationV2.ChangeTabOptions): void;

  protected override _onActivate(): void;

  protected override _onDeactivate(): void;

  /**
   * Update the notification pip on the placeables sidebar tab button.
   * The pip is shown when the placeables tab is not active and the current sub-tab has an active filter.
   */
  _updateFilterPip(): void;

  /**
   * Highlight a hovered entry in the sidebar.
   * @param object - The object being hovered on canvas.
   * @param hover  - The hover state.
   */
  hoverEntry(object: PlaceableObject.Any, hover: boolean): void;

  /**
   * Determine if a placeable is visible in the sidebar.
   * @param object - The placeable.
   */
  isEntryVisible(object: PlaceableObject.Any): boolean;

  #PlaceableDirectory: true;
}

declare namespace PlaceableDirectory {
  interface Any extends AnyPlaceableDirectory {}
  interface AnyConstructor extends Identity<typeof AnyPlaceableDirectory> {}

  /** One entry of the `sheet` tab group, generated from the canvas layers that register a sidebar. */
  interface LayerTab extends Omit<ApplicationV2.Tab, "group" | "active"> {
    /** @remarks `true` while no Scene is viewed. */
    disabled: boolean;

    /**
     * The sort order taken from the document's `CONFIG` entry.
     *
     * @defaultValue `1000`
     */
    order: number;
  }

  interface TabsConfiguration extends Omit<ApplicationV2.TabsConfiguration, "tabs"> {
    tabs: LayerTab[];
  }

  interface ClosingOptions extends ApplicationV2.ClosingOptions {
    /** @remarks Closing is skipped unless this is `"deleteScene"`. */
    renderContext?: string | undefined;
  }

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, AbstractSidebarTab.RenderContext {}

  interface Configuration<PlaceableDirectory extends PlaceableDirectory.Any = PlaceableDirectory.Any>
    extends HandlebarsApplicationMixin.Configuration, AbstractSidebarTab.Configuration<PlaceableDirectory> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<PlaceableDirectory extends PlaceableDirectory.Any = PlaceableDirectory.Any> = DeepPartial<
    Configuration<PlaceableDirectory>
  > &
    object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, AbstractSidebarTab.RenderOptions {
    /**
     * Re-render the tab part even when this is not the first render.
     *
     * @remarks Passed by the canvas when the active layer changes.
     */
    tabs?: boolean | undefined;

    /** A string with the format "\{operation\}\{documentName\}" providing context */
    renderContext?: string | undefined;

    /** Data describing the document modification that occurred */
    renderData?: AnyObject | undefined;
  }
}

declare abstract class AnyPlaceableDirectory extends PlaceableDirectory<
  PlaceableDirectory.RenderContext,
  PlaceableDirectory.Configuration,
  PlaceableDirectory.RenderOptions
> {
  constructor(...args: never);
}

export default PlaceableDirectory;
