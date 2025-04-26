export {};

declare global {
  /**
   * An application for configuring the permissions which are available to each User role.
   */
  class PermissionConfig<Options extends FormApplication.Options = FormApplication.Options> extends FormApplication<
    Options,
    FormApplication.NoObject
  > {
    /**
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
    static override get defaultOptions(): FormApplication.Options;

    // TODO: Implement GetDataReturnType
    override getData(options?: Partial<FormApplication.Options>): Promise<object>;

    /**
     * Prepare the permissions object used to render the configuration template
     * @param current - The current permission configuration
     * @returns Permission data for sheet rendering
     * @internal
     */
    protected _getPermissions(current: Game.Permissions): PermissionConfig.Permission[];

    override activateListeners(html: JQuery): void;

    /**
     * Handle button click to reset default settings
     * @param event - The initial button click event
     */
    protected _onResetDefaults(event: JQuery.ClickEvent): Promise<Application.Any>;

    protected override _onSubmit(
      event: Event,
      options?: FormApplication.OnSubmitOptions,
    ): ReturnType<FormApplication["_onSubmit"]>;

    protected override _updateObject(event: Event, formData: PermissionConfig.FormData): Promise<void>;
  }

  namespace PermissionConfig {
    interface Any extends PermissionConfig<any> {}

    type FormData = Record<string, boolean>;

    interface Permission extends foundry.CONST.UserPermission {
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
}
