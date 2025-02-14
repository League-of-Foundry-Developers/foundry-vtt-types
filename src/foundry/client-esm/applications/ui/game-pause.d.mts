import type ApplicationV2 from "../api/application.d.mts";

/**
 * The Game Paused banner.
 * @remarks TODO: Stub
 */
declare class GamePause<
  RenderContext extends GamePause.RenderContext = GamePause.RenderContext,
  Configuration extends ApplicationV2.Configuration = ApplicationV2.Configuration,
  RenderOptions extends ApplicationV2.RenderOptions = ApplicationV2.RenderOptions,
> extends ApplicationV2<RenderContext, Configuration, RenderOptions> {}

declare namespace GamePause {
  interface RenderContext {
    cssClass: string;
    icon: string;
    text: string;
    spin: boolean;
  }
}

export default GamePause;
