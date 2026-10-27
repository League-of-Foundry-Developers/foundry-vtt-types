import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "#client/applications/api/application.d.mts";
import type HandlebarsApplicationMixin from "#client/applications/api/handlebars-application.d.mts";

/**
 * The Join Game setup application.
 */
declare class JoinGameForm<
  RenderContext extends JoinGameForm.RenderContext = JoinGameForm.RenderContext,
  Configuration extends JoinGameForm.Configuration = JoinGameForm.Configuration,
  RenderOptions extends JoinGameForm.RenderOptions = JoinGameForm.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  /**
   * @remarks Registers the application in `game.users.apps`, so it re-renders when a User changes.
   */
  constructor(options?: DeepPartial<Configuration>);

  /**
   * @defaultValue
   * ```js
   * {
   *   id: "join-game",
   *   window: {
   *     frame: false,
   *     positioned: false
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: JoinGameForm.DefaultOptions;

  /**
   * @defaultValue
   * ```js
   * {
   *   form: {
   *     id: "form",
   *     template: "templates/setup/parts/join-form.hbs",
   *     forms: {
   *       "#join-game-form": {
   *         handler: JoinGameForm.#onSubmitLoginForm
   *       }
   *     }
   *   },
   *   details: {
   *     id: "details",
   *     template: "templates/setup/parts/join-details.hbs"
   *   },
   *   setup: {
   *     id: "setup",
   *     template: "templates/setup/parts/join-setup.hbs",
   *     forms: {
   *       "#join-game-setup": {
   *         handler: JoinGameForm.#onSubmitSetupForm
   *       }
   *     }
   *   },
   *   world: {
   *     id: "world",
   *     template: "templates/setup/parts/join-world.hbs",
   *     scrollable: ["#world-description"]
   *   }
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * @remarks Only the `form` and `setup` parts are rendered when the World's `joinTheme` is `"minimal"`.
   */
  protected override _configureRenderOptions(options: DeepPartial<RenderOptions>): void;

  /**
   * @remarks Does not call `super`.
   */
  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _syncPartState(
    partId: string,
    newElement: HTMLElement,
    priorElement: HTMLElement,
    state: HandlebarsApplicationMixin.PartState,
  ): void;

  #JoinGameForm: true;
  static #JoinGameFormStatic: true;
}

declare namespace JoinGameForm {
  interface Any extends AnyJoinGameForm {}
  interface AnyConstructor extends Identity<typeof AnyJoinGameForm> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext {
    isAdmin: boolean;

    users: foundry.documents.collections.Users.Implementation;

    world: foundry.packages.World;

    /** @remarks The placeholder the server sends in place of an existing password. */
    passwordString: string;

    /** @remarks The number of active Users. */
    usersCurrent: number;

    /** @remarks The total number of Users. */
    usersMax: number;

    /**
     * @remarks A Gamemaster to select by default, when an administrator joins a World with a single User and nobody
     * else is connected. Otherwise `null`, or `undefined` if the World's only User is not a Gamemaster.
     */
    preselected: User.Implementation | null | undefined;

    adminUsernameRequired: boolean;

    externalAdminAuthRequired: boolean;

    /** @remarks The localized time of the World's next session. Absent when no valid session is scheduled. */
    nextTime?: string;
  }

  interface Configuration<JoinGameForm extends JoinGameForm.Any = JoinGameForm.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<JoinGameForm> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<JoinGameForm extends JoinGameForm.Any = JoinGameForm.Any> = DeepPartial<
    Configuration<JoinGameForm>
  > &
    object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}
}

declare abstract class AnyJoinGameForm extends JoinGameForm<
  JoinGameForm.RenderContext,
  JoinGameForm.Configuration,
  JoinGameForm.RenderOptions
> {
  constructor(...args: never);
}

export default JoinGameForm;
