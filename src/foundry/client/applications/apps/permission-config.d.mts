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

  /**
   * @defaultValue
   * ```js
   * {
   *   id: "permissions-config",
   *   tag: "form",
   *   window: {
   *     contentClasses: ["standard-form"],
   *     icon: "fa-solid fa-shield-keyhole",
   *     title: "PERMISSION.Title"
   *   },
   *   position: {width: 660},
   *   form: {
   *     closeOnSubmit: true,
   *     handler: PermissionConfig.#onSubmit
   *   },
   *   actions: {
   *     reset: PermissionConfig.#onReset
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: PermissionConfig.DefaultOptions;

  /**
   * @defaultValue
   * ```js
   * {
   *   permissions: {
   *     id: "permissions",
   *     template: "templates/apps/permission-config.hbs",
   *     root: true,
   *     scrollable: [".permissions-list"]
   *   },
   *   footer: {
   *     template: "templates/generic/form-footer.hbs"
   *   }
   * }
   * ```
   */
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
    roles: PermissionRole[];
  }

  interface PermissionRole {
    /** @remarks Of the form `{permissionId}.{roleValue}`; used as the checkbox's form name. */
    name: string;

    value: boolean;

    /** @remarks `"readonly"` for roles the permission always requires, otherwise `""`. */
    readonly: string;
  }

  /** The names of the {@linkcode CONST.USER_ROLES} which can be granted a permission; `"NONE"` never can. */
  type ConfigurableRole = Exclude<keyof typeof CONST.USER_ROLES, "NONE">;

  /**
   * @remarks Foundry's override of `_prepareContext` does not call `super`. Therefore it does not
   * inherit context from its parent class.
   */
  interface RenderContext {
    /** @remarks Keyed by role *name*, not value; each entry is a localization key. */
    roles: Record<ConfigurableRole, string>;

    /** @remarks Sorted by localized label. */
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
