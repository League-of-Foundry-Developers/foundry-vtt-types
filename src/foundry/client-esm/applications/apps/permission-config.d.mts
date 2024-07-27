import type { InterfaceToObject } from "../../../../types/helperTypes.d.mts";
import type { DeepPartial } from "../../../../types/utils.d.mts";
import type { UserPermission } from "../../../common/constants.d.mts";
import type { CONST } from "../../client.d.mts";
import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

type PermissionConfigRenderContext = InterfaceToObject<PermissionConfig.RenderContext>;

/**
 * An application for configuring the permissions which are available to each User role.
 */
declare class PermissionConfig<
  Configuration extends ApplicationV2.Configuration = ApplicationV2.Configuration,
  RenderOptions extends ApplicationV2.RenderOptions = ApplicationV2.RenderOptions,
  RenderContext extends PermissionConfigRenderContext = PermissionConfigRenderContext,
> extends HandlebarsApplicationMixin(ApplicationV2)<Configuration, RenderOptions, RenderContext> {
  // placeholder private member to help subclassing
  #permissionConfig: true;

  static override DEFAULT_OPTIONS: Partial<ApplicationV2.Configuration>;
  static override PARTS: PermissionConfig.Parts;

  /* -------------------------------------------- */
  /*  Rendering                                   */
  /* -------------------------------------------- */

  override _prepareContext(options: DeepPartial<RenderOptions>): Promise<RenderContext>;
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
    buttons: ApplicationV2.FormFooterButton[];
  }

  interface Parts extends Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart> {
    permissions: HandlebarsApplicationMixin.HandlebarsTemplatePart;
    footer: HandlebarsApplicationMixin.HandlebarsTemplatePart;
  }
}

export default PermissionConfig;
