import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      ModuleManagement: ModuleManagement.Any;
    }
  }
}

/**
 * The Module Management Application.
 * This application provides a view of which modules are available to be used and allows for configuration of the
 * set of modules which are active within the World.
 * @remarks TODO: Stub
 */
declare class ModuleManagement<
  RenderContext extends ModuleManagement.RenderContext = ModuleManagement.RenderContext,
  Configuration extends ModuleManagement.Configuration = ModuleManagement.Configuration,
  RenderOptions extends ModuleManagement.RenderOptions = ModuleManagement.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  // Fake override.
  static override DEFAULT_OPTIONS: ModuleManagement.DefaultOptions;
}

declare namespace ModuleManagement {
  interface Any extends AnyModuleManagement {}
  interface AnyConstructor extends Identity<typeof AnyModuleManagement> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext {}

  interface Configuration<ModuleManagement extends ModuleManagement.Any = ModuleManagement.Any>
    extends HandlebarsApplicationMixin.Configuration,
      ApplicationV2.Configuration<ModuleManagement> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<ModuleManagement extends ModuleManagement.Any = ModuleManagement.Any> = DeepPartial<
    Configuration<ModuleManagement>
  > &
    object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}
}

declare abstract class AnyModuleManagement extends ModuleManagement<
  ModuleManagement.RenderContext,
  ModuleManagement.Configuration,
  ModuleManagement.RenderOptions
> {
  constructor(...args: never);
}

export default ModuleManagement;
