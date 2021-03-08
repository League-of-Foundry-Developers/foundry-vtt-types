/**
 * A generic application for configuring permissions for various Entity types
 *
 * @param entity - The Entity instance for which permissions are being configured.
 * @param options - Application options.
 */
declare class PermissionControl<E extends Entity> extends BaseEntitySheet<PermissionControl.Data<E>, E> {
  constructor(entity: E, options?: Partial<BaseEntitySheet.Options>);

  /**
   * @override
   * @defaultValue
   * ```typescript
   * mergeObject(super.defaultOptions, {
   *   id: "permission",
   *   template: "templates/apps/permission.html",
   *   width: 400
   * });
   * ```
   */
  static get defaultOptions(): BaseEntitySheet.Options;

  /** @override */
  get title(): string;

  /**
   * @param options - (unused)
   * @override
   */
  getData(options?: Application.RenderOptions): PermissionControl.Data<E>;

  /** @override */
  protected _updateObject(event: Event, formData: PermissionControl.FormData): Promise<E>;
}

declare namespace PermissionControl {
  interface Data<E extends Entity> {
    entity: E;
    currentDefault: number | '-1';
    instructions: string;
    defaultLevels: E extends Folder ? Data.FolderDefaultLevels : Data.EntityDefaultLevels;
    playerLevels: E extends Folder ? Data.FolderPlayerLevels : Data.EntityPlayerLevels;
    isFolder: E extends Folder ? true : false;
    users: { user: User; level: number | '-1' }[];
  }

  namespace Data {
    type EntityDefaultLevels = Omit<EntityPlayerLevels, '-1'>;

    type EntityPlayerLevels = Record<Const.EntityPermission, string> & { '-1': string };

    type FolderDefaultLevels = Omit<FolderPlayerLevels, '-2'>;

    type FolderPlayerLevels = Record<Const.EntityPermission, string> & { '-2': string; '-1': string };
  }

  interface FormData {
    [userId: string]: FormData.InputPermissionLevel;
    default: FormData.InputPermissionLevel;
  }

  namespace FormData {
    // TODO: find a way to get this dynamically from ENTITY_PERMISSIONS
    type InputPermissionLevel = '-1' | '0' | '1' | '2' | '3';
  }
}
