import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "#client/applications/api/application.d.mts";
import type HandlebarsApplicationMixin from "#client/applications/api/handlebars-application.d.mts";

/**
 * The User Management setup application.
 */
declare class UserManagement<
  RenderContext extends UserManagement.RenderContext = UserManagement.RenderContext,
  Configuration extends UserManagement.Configuration = UserManagement.Configuration,
  RenderOptions extends UserManagement.RenderOptions = UserManagement.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   id: "manage-players",
   *   classes: ["application", "framed"],
   *   tag: "form",
   *   window: {
   *     frame: false,
   *     positioned: false
   *   },
   *   actions: {
   *     createUser: UserManagement.#onUserCreate,
   *     configurePermissions: UserManagement.#onConfigurePermission,
   *     deleteUser: UserManagement.#onUserDelete,
   *     loginAsUser: UserManagement.#onLoginAsUser,
   *     showPassword: UserManagement.#onShowPassword
   *   },
   *   form: {
   *     handler: UserManagement.#onSubmitForm
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: UserManagement.DefaultOptions;

  /**
   * The template path used to render a single user.
   * @defaultValue `"templates/setup/parts/user-management-user.hbs"`
   */
  static USER_TEMPLATE: string;

  /**
   * @defaultValue
   * ```js
   * {
   *   form: {
   *     id: "form",
   *     template: "templates/setup/parts/user-management-form.hbs",
   *     templates: [this.USER_TEMPLATE],
   *     scrollable: ["#player-list"]
   *   }
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * @remarks Does not call `super`.
   */
  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _attachPartListeners(
    partId: string,
    htmlElement: HTMLElement,
    options: DeepPartial<RenderOptions>,
  ): void;

  static #UserManagement: true;
}

declare namespace UserManagement {
  interface Any extends AnyUserManagement {}
  interface AnyConstructor extends Identity<typeof AnyUserManagement> {}

  interface UserEntry {
    _id: string;

    name: string;

    role: CONST.USER_ROLES;

    /** @remarks `true` only for the first User, on the server's first launch. */
    passwordWarning: boolean;
  }

  interface Labels {
    /** @remarks The localized label of the submit button. */
    launch: string;
  }

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext {
    users: UserEntry[];

    /** @remarks Localized labels, keyed by role. */
    roles: Record<CONST.USER_ROLES, string>;

    canConfigurePermissions: boolean;

    /** @remarks {@linkcode UserManagement.USER_TEMPLATE} of the rendering class. */
    userTemplate: string;

    firstLaunch: boolean;

    /** @remarks The placeholder the server sends in place of an existing password. */
    passwordString: string;

    labels: Labels;
  }

  interface Configuration<UserManagement extends UserManagement.Any = UserManagement.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<UserManagement> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<UserManagement extends UserManagement.Any = UserManagement.Any> = DeepPartial<
    Configuration<UserManagement>
  > &
    object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}
}

declare abstract class AnyUserManagement extends UserManagement<
  UserManagement.RenderContext,
  UserManagement.Configuration,
  UserManagement.RenderOptions
> {
  constructor(...args: never);
}

export default UserManagement;
