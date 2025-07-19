import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      MainMenu: MainMenu.Any;
    }
  }
}

/**
 * The main menu application which is toggled via the ESC key.
 */
declare class MainMenu<
  RenderContext extends object = MainMenu.RenderContext,
  Configuration extends MainMenu.Configuration = MainMenu.Configuration,
  RenderOptions extends MainMenu.RenderOptions = MainMenu.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: MainMenu.DefaultOptions;
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * Configuration of Main Menu items.
   */
  static ITEMS: Record<string, MainMenu.MainMenuItem>;

  /**
   * A record of menu items which are currently enabled.
   */
  get items(): Record<string, MainMenu.MainMenuItem>;

  protected override _insertElement(element: HTMLElement): void;

  protected override _onFirstRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  /**
   * Toggle display of the menu, or render it in the first place.
   */
  toggle(): Promise<void>;

  static #MainMenuStatic: true;
}

declare namespace MainMenu {
  interface Any extends AnyMainMenu {}
  interface AnyConstructor extends Identity<typeof AnyMainMenu> {}

  /**
   * @remarks Foundry's override of `_prepareContext` does not call `super`. Therefore it does not
   * inherit context from its parent class.
   */
  interface RenderContext {
    items: Record<string, MainMenuItem>;
  }

  interface Configuration<MainMenu extends MainMenu.Any = MainMenu.Any>
    extends HandlebarsApplicationMixin.Configuration,
      ApplicationV2.Configuration<MainMenu> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<MainMenu extends MainMenu.Any = MainMenu.Any> = DeepPartial<Configuration<MainMenu>> & object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}

  interface MainMenuItem {
    label: string;
    icon: string;
    enabled: boolean | (() => boolean);
    onClick: (ev: PointerEvent) => void;
  }
}

declare abstract class AnyMainMenu extends MainMenu<object, MainMenu.Configuration, MainMenu.RenderOptions> {
  constructor(...args: never);
}

export default MainMenu;
