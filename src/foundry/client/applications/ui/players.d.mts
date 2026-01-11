import type { DeepPartial, Identity } from "#utils";
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
 */
declare class Players<
  RenderContext extends Players.RenderContext = Players.RenderContext,
  Configuration extends Players.Configuration = Players.Configuration,
  RenderOptions extends Players.RenderOptions = Players.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: Players.DefaultOptions;
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * How often latency is refreshed.
   * @defaultValue `60 * 1000`
   */
  static REFRESH_LATENCY_FREQUENCY_MS: number;

  /**
   * A threshold of time in milliseconds after which a player is considered idle if they have no observed activity.
   * @defaultValue `5 * 60 * 1000`
   */
  static IDLE_THRESHOLD_MS: number;

  /**
   * Is the application currently expanded?
   */
  get expanded(): boolean;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  /**
   * Format the display of a user's name using their name, pronouns (if defined), and character name (if defined).
   */
  protected _formatName(user: User.Implementation): string;

  protected override _onFirstRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  /**
   * Collapse the players list.
   */
  collapse(): void;

  /**
   * Expand the players list.
   */
  expand(): void;

  /**
   * Update the display which reports average latency.
   */
  refreshLatency(): void;

  /**
   * Update the display which reports average framerate.
   * @param options - Options which customize FPS reporting (default: `{}`)
   */
  refreshFPS({ deactivate }?: Players.RefreshFPSOptions): void;

  /**
   * Toggle the expanded state of scene navigation.
   * @param expanded - Force the expanded state to the provided value, otherwise toggle the state.
   */
  toggleExpanded(expanded?: boolean): void;

  /**
   * Get the set of ContextMenu options which should be applied to each User in the Players UI.
   */
  protected _getContextMenuOptions(): foundry.applications.ux.ContextMenu.Entry<HTMLElement>[];

  static #PlayersStatic: true;
  #Players: true;
}

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

  interface RefreshFPSOptions {
    /**
     * Deactivate tracking
     * @defaultValue `false`
     */
    deactivate?: boolean | undefined;
  }

  interface Configuration<Players extends Players.Any = Players.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<Players> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<Players extends Players.Any = Players.Any> = DeepPartial<Configuration<Players>> & object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}
}

declare abstract class AnyPlayers extends Players<Players.RenderContext, Players.Configuration, Players.RenderOptions> {
  constructor(...args: never);
}

export default Players;
