import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

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
 * @remarks TODO: Stub
 */
declare class Hotbar<
  RenderContext extends object = Hotbar.RenderContext,
  Configuration extends Hotbar.Configuration = Hotbar.Configuration,
  RenderOptions extends Hotbar.RenderOptions = Hotbar.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  // Fake override.
  static override DEFAULT_OPTIONS: Hotbar.DefaultOptions;
}

declare namespace Hotbar {
  interface Any extends AnyHotbar {}
  interface AnyConstructor extends Identity<typeof AnyHotbar> {}

  interface SlotData {
    slot: number;
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
