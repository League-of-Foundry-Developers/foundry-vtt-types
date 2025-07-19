import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type DrawingHUD from "./drawing-hud.d.mts";
import type TileHUD from "./tile-hud.d.mts";
import type TokenHUD from "./token-hud.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      HeadsUpDisplayContainer: HeadsUpDisplayContainer.Any;
    }
  }
}

/**
 * The Heads-Up Display Container is a canvas-sized Application which renders HTML overtop of the game canvas.
 * @remarks TODO: Stub
 */
declare class HeadsUpDisplayContainer<
  RenderContext extends HeadsUpDisplayContainer.RenderContext = HeadsUpDisplayContainer.RenderContext,
  Configuration extends HeadsUpDisplayContainer.Configuration = HeadsUpDisplayContainer.Configuration,
  RenderOptions extends HeadsUpDisplayContainer.RenderOptions = HeadsUpDisplayContainer.RenderOptions,
> extends ApplicationV2<RenderContext, Configuration, RenderOptions> {
  // Fake override.
  static override DEFAULT_OPTIONS: HeadsUpDisplayContainer.DefaultOptions;

  token: TokenHUD;

  tile: TileHUD;

  drawing: DrawingHUD;
}

declare namespace HeadsUpDisplayContainer {
  interface Any extends AnyHeadsUpDisplayContainer {}
  interface AnyConstructor extends Identity<typeof AnyHeadsUpDisplayContainer> {}

  interface RenderContext extends ApplicationV2.RenderContext {}

  interface Configuration<HeadsUpDisplayContainer extends HeadsUpDisplayContainer.Any = HeadsUpDisplayContainer.Any>
    extends ApplicationV2.Configuration<HeadsUpDisplayContainer> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<HeadsUpDisplayContainer extends HeadsUpDisplayContainer.Any = HeadsUpDisplayContainer.Any> =
    DeepPartial<Configuration<HeadsUpDisplayContainer>> & object;

  interface RenderOptions extends ApplicationV2.RenderOptions {}
}

declare abstract class AnyHeadsUpDisplayContainer extends HeadsUpDisplayContainer<
  HeadsUpDisplayContainer.RenderContext,
  HeadsUpDisplayContainer.Configuration,
  HeadsUpDisplayContainer.RenderOptions
> {
  constructor(...args: never);
}

export default HeadsUpDisplayContainer;
