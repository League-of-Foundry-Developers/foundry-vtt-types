import type { Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      Players: Players.Any;
    }
  }
}

/**
 * A UI element which displays the Users defined for this world.
 * Currently active users are always displayed, while inactive users can be displayed on toggle.
 * @remarks TODO: Stub
 */
declare class Players<
  RenderContext extends Players.RenderContext = Players.RenderContext,
  Configuration extends Players.Configuration = Players.Configuration,
  RenderOptions extends Players.RenderOptions = Players.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {}

declare namespace Players {
  interface Any extends AnyPlayers {}
  interface AnyConstructor extends Identity<typeof AnyPlayers> {}

  /**
   * @remarks Foundry's override of `_prepareContext` does not call `super`. Therefore it does not
   * inherit context from its parent class.
   */
  interface RenderContext {
    active: UserContext[];
    inactive: UserContext[];
  }

  interface UserContext {
    id: string;
    name: string;
    role: CONST.USER_ROLES;
    tooltip: string;
    isSelf: boolean;
    cssClass: string;
    color: string;
    border: string;
  }

  interface Configuration extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration {}
  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}
}

declare abstract class AnyPlayers extends Players<Players.RenderContext, Players.Configuration, Players.RenderOptions> {
  constructor(...args: never);
}

export default Players;
