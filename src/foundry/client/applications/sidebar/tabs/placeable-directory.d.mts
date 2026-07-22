import type { DeepPartial, Identity } from "#utils";
import type PlaceableObject from "#client/canvas/placeables/placeable-object.d.mts";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type AbstractSidebarTab from "../sidebar-tab.d.mts";
import type PlaceableTab from "./placeable-tab.d.mts";

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
declare class PlaceableDirectory extends HandlebarsApplicationMixin(AbstractSidebarTab) {
  /**
   * @defaultValue
   * ```js
   * {
   *   classes: ["flexcol"],
   *   window: {
   *     title: "SIDEBAR.TabPlaceables"
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: PlaceableDirectory.DefaultOptions;

  /**
   * @defaultValue
   * ```js
   * {
   *   tabs: { template: "templates/sidebar/tabs/placeable/tabs.hbs" },
   *   tab: { template: "templates/sidebar/tabs/placeable/tab.hbs" }
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * @defaultValue
   * ```js
   * {
   *   sheet: {
   *     tabs: [],
   *     initial: ""
   *   }
   * }
   * ```
   */
  static override TABS: Record<string, ApplicationV2.TabsConfiguration>;

  /** @defaultValue `"placeables"` */
  static override tabName: string;

  /**
   * The currently rendered tab.
   */
  get tab(): PlaceableTab.Any | undefined;

  protected override _canRender(options: DeepPartial<PlaceableDirectory.RenderOptions>): false | void;

  /**
   * @remarks Foundry's JSDoc types `options` as an `ApplicationClosingOptions`, but at runtime this is also invoked
   * with a `renderContext` field (e.g. from a `deleteScene` hook) that isn't part of that interface.
   */
  override close(
    options?: DeepPartial<ApplicationV2.ClosingOptions> & { renderContext?: string | undefined },
  ): Promise<this | void>;

  protected override _configureRenderParts(
    options: DeepPartial<PlaceableDirectory.RenderOptions>,
  ): Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  protected override _getTabsConfig(group: string): ApplicationV2.TabsConfiguration | null;

  protected override _onRender(
    context: DeepPartial<PlaceableDirectory.RenderContext>,
    options: DeepPartial<PlaceableDirectory.RenderOptions>,
  ): Promise<void>;

  protected override _prepareContext(
    options: DeepPartial<PlaceableDirectory.RenderOptions> & { isFirstRender: boolean },
  ): Promise<PlaceableDirectory.RenderContext>;

  /**
   * Render the directory for a given placeable type.
   * @param context - Render context.
   * @param options - Render options.
   */
  protected _renderTab(
    context: DeepPartial<PlaceableDirectory.RenderContext>,
    options: DeepPartial<PlaceableDirectory.RenderOptions>,
  ): Promise<void>;

  override changeTab(tab: string, group: string, options?: ApplicationV2.ChangeTabOptions): void;

  protected override _onActivate(): void;

  protected override _onDeactivate(): void;

  /**
   * Update the notification pip on the placeables sidebar tab button.
   * The pip is shown when the placeables tab is not active and the current sub-tab has an active filter.
   * @remarks Foundry does not mark this `@protected` or `@internal`, and it is called externally by
   * {@linkcode PlaceableTab._applyFilters | PlaceableTab#_applyFilters} via `ui.placeables`.
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

  interface Configuration extends AbstractSidebarTab.Configuration, HandlebarsApplicationMixin.Configuration {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions = DeepPartial<Configuration> & object;

  interface RenderOptions extends AbstractSidebarTab.RenderOptions, HandlebarsApplicationMixin.RenderOptions {
    /**
     * The event that re-renders of this directory are in response to, e.g. `"createToken"`.
     * @remarks Consumed by {@linkcode PlaceableDirectory._canRender | #_canRender}.
     */
    renderContext?: string | undefined;

    /**
     * Whether to re-render the `tab` part on a non-first render.
     * @remarks Consumed by {@linkcode PlaceableDirectory._configureRenderParts | #_configureRenderParts}, which
     * drops the `tab` part when this is falsey on a re-render.
     */
    tabs?: boolean | undefined;
  }

  interface RenderContext extends AbstractSidebarTab.RenderContext, HandlebarsApplicationMixin.RenderContext {}
}

declare abstract class AnyPlaceableDirectory extends PlaceableDirectory {
  constructor(...args: never);
}

export default PlaceableDirectory;
