import type { Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      GamePause: GamePause.Any;
    }
  }
}

/**
 * The Game Paused banner.
 * @remarks TODO: Stub
 */
declare class GamePause<
  RenderContext extends GamePause.RenderContext = GamePause.RenderContext,
  Configuration extends GamePause.Configuration = GamePause.Configuration,
  RenderOptions extends GamePause.RenderOptions = GamePause.RenderOptions,
> extends ApplicationV2<RenderContext, Configuration, RenderOptions> {}

declare namespace GamePause {
  interface Any extends AnyGamePause {}
  interface AnyConstructor extends Identity<typeof AnyGamePause> {}

  /**
   * @remarks Foundry's override of `_prepareContext` does not call `super`. Therefore it does not
   * inherit context from its parent class.
   */
  interface RenderContext {
    cssClass: string;
    icon: string;
    text: string;
    spin: boolean;
  }

  interface Configuration extends ApplicationV2.Configuration {}
  interface RenderOptions extends ApplicationV2.RenderOptions {}
}

declare abstract class AnyGamePause extends GamePause<
  GamePause.RenderContext,
  GamePause.Configuration,
  GamePause.RenderOptions
> {
  constructor(...args: never);
}

export default GamePause;
