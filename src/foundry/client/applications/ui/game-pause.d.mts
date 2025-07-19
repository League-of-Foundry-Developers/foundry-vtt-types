import type { DeepPartial, Identity } from "#utils";
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
 */
declare class GamePause<
  RenderContext extends GamePause.RenderContext = GamePause.RenderContext,
  Configuration extends GamePause.Configuration = GamePause.Configuration,
  RenderOptions extends GamePause.RenderOptions = GamePause.RenderOptions,
> extends ApplicationV2<RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: GamePause.DefaultOptions;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _renderHTML(
    _context: RenderContext,
    _options: DeepPartial<RenderOptions>,
  ): Promise<GamePause.RenderHTMLResult>;

  protected override _replaceHTML(
    result: GamePause.RenderHTMLResult,
    content: HTMLElement,
    _options: DeepPartial<RenderOptions>,
  ): void;
}

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

  type RenderHTMLResult = [HTMLImageElement, HTMLElement];

  interface Configuration<GamePause extends GamePause.Any = GamePause.Any>
    extends ApplicationV2.Configuration<GamePause> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<GamePause extends GamePause.Any = GamePause.Any> = DeepPartial<Configuration<GamePause>> & object;

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
