/**
 * An application for configuring the permissions which are available to each User role.
 */
declare class PermissionConfig extends FormApplication<PermissionConfig.Data> {
  /**
   * @override
   * @defaultValue
   * ```typescript
   * mergeObject(super.defaultOptions, {
   *   title: game.i18n.localize("PERMISSION.Title"),
   *   id: "permissions-config",
   *   template: "templates/sidebar/apps/permission-config.html",
   *   width: 660,
   *   height: "auto",
   *   scrollY: [".permissions-list"],
   *   closeOnSubmit: true
   * })
   * ```
   */
  static get defaultOptions(): FormApplication.Options;

  /**
   * @param options - (unused)
   * @override
   */
  getData(options?: Application.RenderOptions): PermissionConfig.Data;

  /**
   * Prepare the permissions object used to render the configuration template
   */
  protected _getPermissions(current: typeof CONFIG['User']['permissions']): PermissionConfig.Permission[];

  /** @override */
  activateListeners(html: JQuery): void;

  /**
   * Handle button click to reset default settings
   * @param event - The initial button click event
   */
  protected _onResetDefaults(event: JQuery.ClickEvent): void;

  /** @override */
  protected _onSubmit(
    event: Event,
    options?: FormApplication.OnSubmitOptions
  ): ReturnType<FormApplication['_onSubmit']>;

  /**
   * @param event - (unused)
   * @override
   */
  protected _updateObject(event: Event, formData: Record<string, boolean>): Promise<void>;
}

declare namespace PermissionConfig {
  interface Data {
    roles: { [Key in Exclude<keyof typeof CONST['USER_ROLES'], 'NONE'>]: `USER.Role${Capitalize<Lowercase<Key>>}` };
    permissions: ReturnType<PermissionConfig['_getPermissions']>;
  }

  interface Permission extends Config.Permission {
    id: string;
    roles: Permission.Role[];
  }

  namespace Permission {
    interface Role {
      name: string;
      value: boolean;
      disabled: boolean;
    }
  }
}
