import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      DependencyResolution: DependencyResolution.Any;
    }
  }
}

/**
 * A class responsible for prompting the user about dependency resolution for their modules.
 * @remarks TODO: Stub
 */
declare class DependencyResolution<
  RenderContext extends DependencyResolution.RenderContext = DependencyResolution.RenderContext,
  Configuration extends DependencyResolution.Configuration = DependencyResolution.Configuration,
  RenderOptions extends DependencyResolution.RenderOptions = DependencyResolution.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  // Fake override.
  static override DEFAULT_OPTIONS: DependencyResolution.DefaultOptions;
}

declare namespace DependencyResolution {
  interface Any extends AnyRollResolver {}
  interface AnyConstructor extends Identity<typeof AnyRollResolver> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext {}

  interface Configuration<DependencyResolution extends DependencyResolution.Any = DependencyResolution.Any>
    extends HandlebarsApplicationMixin.Configuration,
      ApplicationV2.Configuration<DependencyResolution> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<DependencyResolution extends DependencyResolution.Any = DependencyResolution.Any> = DeepPartial<
    Configuration<DependencyResolution>
  > &
    object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}
}

declare abstract class AnyRollResolver extends DependencyResolution<
  DependencyResolution.RenderContext,
  DependencyResolution.Configuration,
  DependencyResolution.RenderOptions
> {
  constructor(...args: never);
}

export default DependencyResolution;
