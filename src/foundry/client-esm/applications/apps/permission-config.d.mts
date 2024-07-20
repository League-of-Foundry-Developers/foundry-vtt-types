// import type { UserPermission } from "../../../common/constants.d.mts";
import type { ApplicationConfiguration, ApplicationRenderContext, ApplicationRenderOptions } from "../_types.d.mts";
import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.mjs";

// TODO: decide if we want to keep this as part of _prepareContext return
// type PermissionWithRole = UserPermission & {
//   id: string;
//   roles: {
//     name: string;
//     value: boolean;
//     readonly: string;
//   }[];
// };

/**
 * An application for configuring the permissions which are available to each User role.
 */

declare class PermissionConfig extends HandlebarsApplicationMixin(ApplicationV2) {
  static override DEFAULT_OPTIONS: Partial<ApplicationConfiguration>;
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /* -------------------------------------------- */
  /*  Rendering                                   */
  /* -------------------------------------------- */

  override _prepareContext(_options: ApplicationRenderOptions): Promise<ApplicationRenderContext>;
}

export default PermissionConfig;
