// import type { UserPermission } from "../../../common/constants.d.mts";
import type { DeepPartial } from "../../../../types/utils.d.mts";
import type { UserPermission } from "../../../common/constants.d.mts";
import type { CONST } from "../../client.d.mts";
import type { ApplicationConfiguration, ApplicationRenderOptions, FormFooterButton } from "../_types.d.mts";
import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * An application for configuring the permissions which are available to each User role.
 */

declare class PermissionConfig<
  Configuration extends ApplicationV2.Configuration = ApplicationV2.Configuration,
  RenderOptions extends ApplicationV2.RenderOptions = ApplicationV2.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<Configuration, RenderOptions> {
  // placeholder private member to help subclassing
  #permissionConfig: true;

  static override DEFAULT_OPTIONS: Partial<ApplicationConfiguration>;
  static override PARTS: PermissionConfig.Parts;

  /* -------------------------------------------- */
  /*  Rendering                                   */
  /* -------------------------------------------- */

  override _prepareContext(options: DeepPartial<ApplicationRenderOptions>): Promise<PermissionConfig.RenderContext>;
}

declare namespace PermissionConfig {
  interface PermissionWithRoles extends UserPermission {
    id: string;
    roles: {
      name: string;
      value: boolean;
      readonly: string;
    }[];
  }

  interface RenderContext {
    roles: Record<CONST.USER_ROLES, string>;
    permissions: PermissionWithRoles[];
    buttons: FormFooterButton[];
  }

  interface Parts extends Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart> {
    permissions: HandlebarsApplicationMixin.HandlebarsTemplatePart;
    footer: HandlebarsApplicationMixin.HandlebarsTemplatePart;
  }
}

export default PermissionConfig;
