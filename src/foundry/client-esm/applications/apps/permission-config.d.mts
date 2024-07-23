// import type { UserPermission } from "../../../common/constants.d.mts";
import type { UserPermission } from "../../../common/constants.d.mts";
import type { CONST } from "../../client.d.mts";
import type { ApplicationConfiguration } from "../_types.d.mts";
import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.mjs";

// TODO: decide if we want to keep this as part of _prepareContext return
type PermissionWithRoles = UserPermission & {
  id: string;
  roles: {
    name: string;
    value: boolean;
    readonly: string;
  }[];
};

// TODO- temporary; I suspect there's a better type already somewhere
type PermissingConfigButton = {
  type: string;
  action: string;
  icon: string;
  label: string;
};

type PermissionConfigRenderContext = {
  roles: Record<CONST.USER_ROLES, string>;
  permissions: PermissionWithRoles[];
  buttons: PermissingConfigButton[];
};

/**
 * An application for configuring the permissions which are available to each User role.
 */

declare class PermissionConfig extends HandlebarsApplicationMixin(ApplicationV2) {
  // placeholder private member to help subclassing
  #permissionConfig: true;

  static override DEFAULT_OPTIONS: Partial<ApplicationConfiguration>;
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /* -------------------------------------------- */
  /*  Rendering                                   */
  /* -------------------------------------------- */

  override _prepareContext(): Promise<PermissionConfigRenderContext>;
}

export default PermissionConfig;
