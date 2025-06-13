import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

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
  static override DEFAULT_OPTIONS: Partial<Sidebar.Configuration>;

  // TODO: This override of `TABS` is completely unsound subclassing-wise.
  // static override TABS: Record<string, Sidebar.TabDescriptor>;

  override tabGroups: {
    /** @defaultValue `"chat"` */
    primary: string;
  };

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * Whether the sidebar is currently expanded.
   */
  get expanded(): boolean;

  /**
   * The currently popped-out sidebar tabs.
   */
  popouts: Record<string, foundry.applications.sidebar.AbstractSidebarTab>;

  protected override _configureRenderOptions(options: DeepPartial<RenderOptions>): void;

  protected override _onFirstRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _preparePartContext(
    partId: string,
    context: HandlebarsApplicationMixin.HandlebarsApplication.RenderContextFor<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<HandlebarsApplicationMixin.HandlebarsApplication.RenderContextFor<this>>;

  /**
   * Prepare render context for the tabs.
   * @param context - Shared context provided by _prepareContext.
   * @param options - Options for configuring rendering behavior.
   */
  protected _prepareTabContext(
    context: ApplicationV2.RenderContext,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _renderHTML(
    _context: RenderContext,
    _options: DeepPartial<RenderOptions>,
  ): Promise<HTMLFormElement>;

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
  interface Configuration extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration {}
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
