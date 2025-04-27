import type { DeepPartial } from "../../../../utils/index.d.mts";
import type ApplicationV2 from "../api/application.d.mts";

/**
 * The sidebar tab interface that allows any sidebar tab to also be rendered as a popout.
 */
declare abstract class AbstractSidebarTab<
  RenderContext extends AbstractSidebarTab.RenderContext = AbstractSidebarTab.RenderContext,
  Configuration extends ApplicationV2.Configuration = ApplicationV2.Configuration,
  RenderOptions extends ApplicationV2.RenderOptions = ApplicationV2.RenderOptions,
> extends ApplicationV2<RenderContext, Configuration, RenderOptions> {
  static tabName: string;

  static override readonly emittedEvents: string[];

  /**
   * Whether this tab is currently active in the sidebar.
   */
  get active(): boolean;

  /**
   * Whether this is the popped-out tab or the in-sidebar one.
   */
  get isPopout(): boolean;

  /**
   * A reference to the popped-out version of this tab, if one exists.
   */
  get popout(): this | undefined;

  /**
   * The base name of the sidebar tab.
   */
  get tabName(): string;

  protected override _initializeApplicationOptions(options: DeepPartial<Configuration>): Configuration;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _renderFrame(options: DeepPartial<RenderOptions>): Promise<HTMLElement>;

  override render(options?: DeepPartial<RenderOptions>): Promise<this>;
  override render(options: boolean, _options?: DeepPartial<RenderOptions>): Promise<this>;

  /**
   * Activate this tab in the sidebar.
   */
  activate(): void;

  /**
   * Pop-out this sidebar tab as a new application.
   */
  renderPopout(): Promise<this>;

  /**
   * Actions performed when this tab is activated in the sidebar.
   */
  protected _onActivate(): void;

  protected override _onClose(options: DeepPartial<RenderOptions>): void;

  /**
   * Actions performed when this tab is deactivated in the sidebar.
   */
  protected _onDeactivate(): void;

  protected override _onFirstRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;
}

declare namespace AbstractSidebarTab {
  type Any = AbstractSidebarTab<any, any, any>;
  type AnyConstructor = typeof AbstractSidebarTab;

  type EmittedEvents = Readonly<["render", "close", "position", "activate", "deactivate"]>;

  interface RenderContext extends ApplicationV2.RenderContext {
    user: User.Implementation;
  }
}

export default AbstractSidebarTab;
