// @TODO:

/**
 * A generic application for configuring permissions for various Entity types
 *
 * @param entity - The Entity instance for which permissions are being configured.
 * @param options - Application options.
 */
declare class PermissionControl extends BaseEntitySheet {
  /**
   * @param options - (unused)
   * @override
   */
  getData (options?: any): BaseEntitySheet.Data<object, Entity>
}
