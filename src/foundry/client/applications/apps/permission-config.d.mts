import type { InterfaceToObject, MustConform, DeepPartial, Identity } from "#utils";
import type { UserPermission } from "#common/constants.d.mts";
import type { CONST } from "../../client.d.mts";
import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      PermissionConfig: PermissionConfig.Any;
    }
  }
}

/**
 * An application for configuring the permissions which are available to each User role.
 */
declare class PermissionConfig<
  RenderContext extends PermissionConfig.RenderContext = PermissionConfig.RenderContext,
  Configuration extends PermissionConfig.Configuration = PermissionConfig.Configuration,
  RenderOptions extends PermissionConfig.RenderOptions = PermissionConfig.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  // placeholder private member to help subclassing
  #permissionConfig: true;

  static override DEFAULT_OPTIONS: PermissionConfig.DefaultOptions;
  static override PARTS: InterfaceToObject<PermissionConfig.Parts>;

  /* -------------------------------------------- */
  /*  Rendering                                   */
  /* -------------------------------------------- */

  override _prepareContext(options: DeepPartial<RenderOptions>): Promise<RenderContext>;
}

declare namespace PermissionConfig {
  interface Any extends AnyPermissionConfig {}
  interface AnyConstructor extends Identity<typeof AnyPermissionConfig> {}

  interface PermissionWithRoles extends UserPermission {
    id: string;
    roles: {
      name: string;
      value: boolean;
      readonly: string;
    }[];
  }

  /**
   * @remarks Foundry's override of `_prepareContext` does not call `super`. Therefore it does not
   * inherit context from its parent class.
   */
  interface RenderContext {
    roles: Record<CONST.USER_ROLES, string>;
    permissions: PermissionWithRoles[];
    buttons: ApplicationV2.FormFooterButton[];
  }

  interface Configuration<PermissionConfig extends PermissionConfig.Any = PermissionConfig.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<PermissionConfig> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<PermissionConfig extends PermissionConfig.Any = PermissionConfig.Any> = DeepPartial<
    Configuration<PermissionConfig>
  > &
    object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}

  interface Parts {
    permissions: HandlebarsApplicationMixin.HandlebarsTemplatePart;
    footer: HandlebarsApplicationMixin.HandlebarsTemplatePart;
  }
}

declare abstract class AnyPermissionConfig extends PermissionConfig<
  PermissionConfig.RenderContext,
  PermissionConfig.Configuration,
  PermissionConfig.RenderOptions
> {}

type _PartsMustBeValid = MustConform<
  InterfaceToObject<PermissionConfig.Parts>,
  Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>
>;

export default PermissionConfig;
