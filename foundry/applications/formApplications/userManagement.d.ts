/**
 * The User Management setup application
 */
declare class UserManagement extends FormApplication<UserManagement.Data, Users> {
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
  static get defaultOptions(): FormApplication.Options;

  /** @override */
  protected _render(force?: boolean, options?: Application.RenderOptions): Promise<void>;

  /**
   * @param options - (unused)
   * @override
   */
  getData(options?: Application.RenderOptions): UserManagement.Data;

  /** @override */
  activateListeners(html: JQuery): void;

  /**
   * @param event - (unused)
   * @override
   */
  protected _updateObject(event: Event, formData: Record<string, string | number>): Promise<unknown>;

  /**
   * Reveal the access key for each player so that it can be learned without being changed
   */
  protected _onKeyShow(event: JQuery.ChangeEvent): void;

  /**
   * Handle new user creation event
   */
  protected _onAction(event: JQuery.ClickEvent): void;

  /**
   * Handle creating a new User record in the form
   */
  protected _onUserCreate(): Promise<void>;

  /**
   * Handle user deletion event
   */
  protected _onUserDelete(event: JQuery.ClickEvent): void;

  static readonly USER_TEMPLATE: 'templates/setup/player-create.html';
}

declare namespace UserManagement {
  interface Data {
    user: Game['user'];
    users: User['data'][];
    roles: typeof CONST['USER_ROLES'];
    options: UserManagement['options'];
    userTemplate: typeof UserManagement['USER_TEMPLATE'];
  }
}
