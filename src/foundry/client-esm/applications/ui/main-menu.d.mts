import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * The main menu application which is toggled via the ESC key.
 * @remarks TODO: Stub
 */
declare class MainMenu<
  RenderContext extends object = MainMenu.RenderContext,
  Configuration extends ApplicationV2.Configuration = ApplicationV2.Configuration,
  RenderOptions extends ApplicationV2.RenderOptions = ApplicationV2.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {}

declare namespace MainMenu {
  interface MainMenuItem {
    label: string;
    icon: string;
    enabled: boolean | (() => boolean);
    onClick: (PointerEvent) => void;
  }

  interface RenderContext {
    items: Record<string, MainMenuItem>;
  }
}

export default MainMenu;
