import type { ConformRecord, InterfaceToObject, MustConform, DeepPartial } from "fvtt-types/utils";
import type { UserPermission } from "../../../common/constants.d.mts";
import type { CONST } from "../../client.d.mts";
import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

type PermissionConfigRenderContext = InterfaceToObject<PermissionConfig.RenderContext>;

type PermissionConfigParts = ConformRecord<PermissionConfig.Parts, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

/**
 * An application for configuring the permissions which are available to each User role.
 */
declare class PermissionConfig<
  RenderContext extends PermissionConfigRenderContext = PermissionConfigRenderContext,
  Configuration extends ApplicationV2.Configuration = ApplicationV2.Configuration,
  RenderOptions extends
    HandlebarsApplicationMixin.ApplicationV2RenderOptions = HandlebarsApplicationMixin.ApplicationV2RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  // placeholder private member to help subclassing
  #permissionConfig: true;

  static override DEFAULT_OPTIONS: Partial<ApplicationV2.Configuration>;
  static override PARTS: PermissionConfigParts;

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

  interface Parts {
    permissions: HandlebarsApplicationMixin.HandlebarsTemplatePart;
    footer: HandlebarsApplicationMixin.HandlebarsTemplatePart;
  }
}

type _PartsMustBeValid = MustConform<
  InterfaceToObject<PermissionConfig.Parts>,
  Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>
>;

export default PermissionConfig;
