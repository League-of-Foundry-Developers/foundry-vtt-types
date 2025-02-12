import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * An action bar displayed at the bottom of the game view which contains Macros as interactive buttons.
 * The Hotbar supports 5 pages of macros which can be dragged and dropped to organize as you wish.
 * Left-clicking a Macro button triggers its effect.
 * Right-clicking the button displays a context menu of Macro options.
 * The number keys 1 through 0 activate numbered hotbar slots.
 * @remarks TODO: Stub
 */
declare class Hotbar<
  RenderContext extends object = Hotbar.RenderContext,
  Configuration extends ApplicationV2.Configuration = ApplicationV2.Configuration,
  RenderOptions extends ApplicationV2.RenderOptions = ApplicationV2.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {}

declare namespace Hotbar {
  interface SlotData {
    slot: number;
  }

  interface RenderContext {
    slots: SlotData[];
    page: number;
  }
}

export default Hotbar;
