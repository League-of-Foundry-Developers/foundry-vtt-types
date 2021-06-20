/**
 * A generic application for configuring permissions for various Entity types
 * @typeParam P - the type of the options object
 * @typeParam E - the type of the entity
 */
declare class PermissionControl<
  P extends DocumentSheet.Options = DocumentSheet.Options,
  E extends foundry.abstract.Document<any, any> = foundry.abstract.Document<any, any>
> extends DocumentSheet<P, PermissionControl.Data<E>, E> {
  /**
   * @param entity  - The Entity instance for which permissions are being configured.
   * @param options - Application options.
   */
  constructor(entity: E, options?: Partial<P>);

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
  static get defaultOptions(): typeof DocumentSheet['defaultOptions'];

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
  interface Data<E extends foundry.abstract.Document<any, any>> extends DocumentSheet.Data {
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

    type EntityPlayerLevels = Record<foundry.CONST.EntityPermission, string> & { '-1': string };

    type FolderDefaultLevels = Omit<FolderPlayerLevels, '-2'>;

    type FolderPlayerLevels = Record<foundry.CONST.EntityPermission, string> & { '-2': string; '-1': string };
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
