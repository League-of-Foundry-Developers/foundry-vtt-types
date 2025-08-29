import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type Document from "#common/abstract/document.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      Hotbar: Hotbar.Any;
    }
  }
}

/**
 * An action bar displayed at the bottom of the game view which contains Macros as interactive buttons.
 * The Hotbar supports 5 pages of macros which can be dragged and dropped to organize as you wish.
 * Left-clicking a Macro button triggers its effect.
 * Right-clicking the button displays a context menu of Macro options.
 * The number keys 1 through 0 activate numbered hotbar slots.
 */
declare class Hotbar<
  RenderContext extends object = Hotbar.RenderContext,
  Configuration extends Hotbar.Configuration = Hotbar.Configuration,
  RenderOptions extends Hotbar.RenderOptions = Hotbar.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: Hotbar.DefaultOptions;
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * The current hotbar page number.
   */
  get page(): number;

  /**
   * The currently rendered macro data.
   */
  get slots(): Hotbar.SlotData[];

  /**
   * Whether the hotbar is locked.
   */
  get locked(): boolean;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _onFirstRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  /**
   * Get the set of ContextMenu options which should be applied for Macros in the hotbar.
   */
  protected _getContextMenuOptions(): foundry.applications.ux.ContextMenu.Entry<HTMLElement>[];

  /**
   * Update the presented state of toggle buttons.
   * @internal
   * @remarks Called externally in {@linkcode foundry.applications.sidebar.tabs.PlaylistDirectory._onGlobalVolume | PlaylistDirectory#_onGlobalVolume}
   */
  _updateToggles(): void;

  /**
   * Change to a specific numbered page from 1 to 5
   * @param page - The page number to change to
   */
  changePage(page: number): Promise<void>;

  /**
   * Change the page of the hotbar by cycling up (positive) or down (negative).
   * @param direction - The direction to cycle
   */
  cyclePage(direction: number): Promise<void>;

  /**
   * A reusable helper that can be used for toggling display of a document sheet.
   * @param uuid - The Document UUID to display
   */
  static toggleDocumentSheet(uuid: string): Promise<void>;

  /**
   * Update hotbar display based on viewport size.
   * @internal
   */
  protected _onResize(): void;

  /**
   * Create a Macro which rolls a RollTable when executed
   * @param table - The RollTable document
   */
  protected _createRollTableRollMacro(table: Document.Any): Promise<Macro.Implementation>;

  /**
   * Create a Macro document which can be used to toggle display of a Journal Entry.
   * @param doc - A Document which should be toggled
   */
  protected _createDocumentSheetToggle(doc: Document.Any): Promise<Macro.Implementation>;

  /**
   * @deprecated "{@linkcode Hotbar#macros} is deprecated in favor of {@linkcode Hotbar#slots}." (since v13, until v15)
   * @ignore
   */
  get macros(): Hotbar.SlotData[];

  /**
   * @deprecated "{@linkcode Hotbar#collapse} is no longer a supported feature." (since v13, until v15)
   * @ignore
   */
  collapse(): void;

  /**
   * @deprecated "{@linkcode Hotbar#expand} is no longer a supported feature." (since v13, until v15)
   * @ignore
   */
  expand(): void;

  static #HotbarStatic: true;
  #Hotbar: true;
}

declare namespace Hotbar {
  interface Any extends AnyHotbar {}
  interface AnyConstructor extends Identity<typeof AnyHotbar> {}

  interface SlotData {
    slot: number;
    macro: Macro.Implementation | null;
    key: number;
    img: Macro.Implementation["img"] | null;
    cssClass: "full" | "open";
    tooltip: string | null;
    ariaLabel: string;
  }

  /**
   * @remarks Foundry's override of `_prepareContext` does not call `super`. Therefore it does not
   * inherit context from its parent class.
   */
  interface RenderContext {
    slots: SlotData[];
    page: number;
  }

  interface Configuration<Hotbar extends Hotbar.Any = Hotbar.Any>
    extends HandlebarsApplicationMixin.Configuration,
      ApplicationV2.Configuration<Hotbar> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<Hotbar extends Hotbar.Any = Hotbar.Any> = DeepPartial<Configuration<Hotbar>> & object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}
}

declare abstract class AnyHotbar extends Hotbar<object, Hotbar.Configuration, Hotbar.RenderOptions> {
  constructor(...args: never);
}

export default Hotbar;
