/**
 * The User Management setup application
 */
declare class UserManagement extends FormApplication<FormApplication.Options, UserManagement.Data, Users> {
  /**
   * @defaultValue `'templates/setup/player-create.html'`
   */
  static USER_TEMPLATE: string;

  /**
   * @override
   * @defaultValue
   * ```typescript
   * mergeObject(super.defaultOptions, {
   *   id: "manage-players",
   *   classes: ["dark"],
   *   template: "templates/setup/user-management.html",
   *   popOut: false,
   *   closeOnSubmit: false,
   *   scrollY: ["#player-list"]
   * });
   * ```
   */
  static get defaultOptions(): typeof FormApplication['defaultOptions'];

  /** @override */
  activateListeners(html: JQuery): void;

  /**
   * @param options - (unused)
   * @override
   */
  getData(options?: Application.RenderOptions): UserManagement.Data;

  /**
   * Handle new user creation event
   */
  protected _onAction(event: JQuery.ClickEvent): void;

  /**
   * Reveal the access key for each player so that it can be learned without being changed
   */
  protected _onKeyShow(event: JQuery.ChangeEvent): void;

  /**
   * Handle creating a new User record in the form
   */
  protected _onUserCreate(): Promise<void>;

  /**
   * Handle user deletion event
   */
  protected _onUserDelete(event: JQuery.ClickEvent): void;

  /** @override */
  protected _render(force?: boolean, options?: Application.RenderOptions): Promise<void>;

  /**
   * @param event - (unused)
   * @override
   */
  protected _updateObject(event: Event, formData: UserManagement.FormData): Promise<unknown>;
}

declare namespace UserManagement {
  interface Data {
    options: UserManagement['options'];
    roles: typeof CONST['USER_ROLES'];
    user: Game['user'];
    userTemplate: typeof UserManagement['USER_TEMPLATE'];
    users: User['data'][];
  }

  type FormData = Record<string, string | number>;
}
