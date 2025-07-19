import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      AbstractSidebarTab: AbstractSidebarTab.Any;
    }
  }
}

/**
 * The sidebar tab interface that allows any sidebar tab to also be rendered as a popout.
 */
declare abstract class AbstractSidebarTab<
  RenderContext extends AbstractSidebarTab.RenderContext = AbstractSidebarTab.RenderContext,
  Configuration extends AbstractSidebarTab.Configuration = AbstractSidebarTab.Configuration,
  RenderOptions extends AbstractSidebarTab.RenderOptions = AbstractSidebarTab.RenderOptions,
> extends ApplicationV2<RenderContext, Configuration, RenderOptions> {
  // Fake override.
  static override DEFAULT_OPTIONS: AbstractSidebarTab.DefaultOptions;

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
  interface Any extends AnyAbstractSidebarTab {}
  interface AnyConstructor extends Identity<typeof AnyAbstractSidebarTab> {}

  interface RenderContext extends ApplicationV2.RenderContext {}

  interface Configuration<AbstractSidebarTab extends AbstractSidebarTab.Any = AbstractSidebarTab.Any>
    extends ApplicationV2.Configuration<AbstractSidebarTab> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<AbstractSidebarTab extends AbstractSidebarTab.Any = AbstractSidebarTab.Any> = DeepPartial<
    Configuration<AbstractSidebarTab>
  > &
    object;

  interface RenderOptions extends ApplicationV2.RenderOptions {}

  type EmittedEvents = Readonly<["render", "close", "position", "activate", "deactivate"]>;

  interface RenderContext extends ApplicationV2.RenderContext {
    user: User.Implementation;
  }
}

declare abstract class AnyAbstractSidebarTab extends AbstractSidebarTab<
  AbstractSidebarTab.RenderContext,
  AbstractSidebarTab.Configuration,
  AbstractSidebarTab.RenderOptions
> {
  constructor(...args: never);
}

export default AbstractSidebarTab;
