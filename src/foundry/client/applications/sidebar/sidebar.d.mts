import type { DeepPartial, Identity } from "#utils";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type AbstractSidebarTab from "./sidebar-tab.d.mts";

import ApplicationV2 = foundry.applications.api.ApplicationV2;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      Sidebar: Sidebar.Any;
    }
  }
}

/**
 * The main sidebar application.
 */
declare class Sidebar<
  RenderContext extends Sidebar.RenderContext = Sidebar.RenderContext,
  Configuration extends Sidebar.Configuration = Sidebar.Configuration,
  RenderOptions extends Sidebar.RenderOptions = Sidebar.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   id: "sidebar",
   *   tag: "aside",
   *   window: {
   *     frame: false,
   *     positioned: false
   *   },
   *   actions: {
   *     toggleState: Sidebar.#onToggleState
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: Sidebar.DefaultOptions;

  // TODO: This override of `TABS` is completely unsound subclassing-wise.
  // static override TABS: Record<string, Sidebar.TabDescriptor>;

  override tabGroups: {
    /** @defaultValue `"chat"` */
    primary: string;
  };

  /**
   * @defaultValue
   * ```js
   * {
   *   tabs: {
   *     id: "tabs",
   *     template: "templates/sidebar/tabs.hbs"
   *   }
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * Whether the sidebar is currently expanded.
   */
  get expanded(): boolean;

  /**
   * The currently popped-out sidebar tabs.
   *
   * @remarks Keyed by {@linkcode AbstractSidebarTab.tabName | tabName}. Entries are added by
   * {@linkcode AbstractSidebarTab._onFirstRender} and removed by {@linkcode AbstractSidebarTab._onClose},
   * so only popped-out tabs appear here.
   *
   * @privateRemarks Foundry's `@type` says `Record<string, SidebarTab|AbstractSidebarTab>`, but `SidebarTab`
   * — the AppV1 sidebar tab — no longer exists in V14, and the only writer stores `this` from
   * `AbstractSidebarTab`.
   */
  popouts: Record<string, AbstractSidebarTab.Any>;

  protected override _configureRenderOptions(options: DeepPartial<RenderOptions>): void;

  protected override _onFirstRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  /**
   * Prepare render context for the tabs.
   * @param context - Shared context provided by _prepareContext.
   * @param options - Options for configuring rendering behavior.
   */
  protected _prepareTabContext(
    context: ApplicationV2.RenderContext,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  /**
   * @remarks On the first render this delegates to the mixin and returns a stub element per part. On
   * every later render it re-renders the requested tabs itself and resolves to an empty record.
   */
  protected override _renderHTML(
    context: RenderContext,
    options: DeepPartial<RenderOptions>,
  ): Promise<Record<string, HTMLElement>>;

  protected override _onClickTab(event: PointerEvent): void;

  override changeTab(tab: string, group: string, options?: ApplicationV2.ChangeTabOptions): void;

  /**
   * Collapse the sidebar.
   */
  collapse(): void;

  /**
   * Expand the sidebar.
   */
  expand(): void;

  /**
   * Toggle the expanded state of the sidebar.
   * @param expanded - Force the expanded state to the provided value, otherwise toggle the state.
   *
   * @remarks Calls the `collapseSidebar` hook with the sidebar and the new collapsed state.
   */
  toggleExpanded(expanded?: boolean): void;

  /**
   * @deprecated since v13 will be removed in v15
   * @ignore
   */
  activateTab(tabName: string): void;

  static #SidebarStatic: true;
  #Sidebar: true;
}

declare namespace Sidebar {
  interface Any extends AnySidebar {}
  interface AnyConstructor extends Identity<typeof AnySidebar> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext {}

  interface Configuration<Sidebar extends Sidebar.Any = Sidebar.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<Sidebar> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<Sidebar extends Sidebar.Any = Sidebar.Any> = DeepPartial<Configuration<Sidebar>> & object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}

  interface TabDescriptor {
    /** The tab's tooltip. */
    tooltip?: string | undefined;

    /** The tab's Font Awesome icon class. */
    icon?: string | undefined;

    /** A Document name to retrieve tooltip and icon information from automatically. */
    documentName?: string | undefined;

    /** Whether the tab is only rendered for GM users. */
    gmOnly?: boolean | undefined;
  }
}

declare abstract class AnySidebar extends Sidebar<Sidebar.RenderContext, Sidebar.Configuration, Sidebar.RenderOptions> {
  constructor(...args: never);
}

export default Sidebar;
