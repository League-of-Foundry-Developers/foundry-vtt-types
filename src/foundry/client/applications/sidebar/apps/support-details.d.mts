import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type { DeepPartial, Identity } from "#utils";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      SupportDetails: SupportDetails.Any;
    }
  }
}

/**
 * @remarks TODO: Stub
 */
declare class SupportDetails<
  RenderContext extends SupportDetails.RenderContext = SupportDetails.RenderContext,
  Configuration extends SupportDetails.Configuration = SupportDetails.Configuration,
  RenderOptions extends SupportDetails.RenderOptions = SupportDetails.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  // Fake override.
  static override DEFAULT_OPTIONS: SupportDetails.DefaultOptions;
}

declare namespace SupportDetails {
  interface Any extends AnySupportDetails {}
  interface AnyConstructor extends Identity<typeof AnySupportDetails> {}

  interface RenderContext extends ApplicationV2.RenderContext {}

  interface Configuration<
    SupportDetails extends SupportDetails.Any = SupportDetails.Any,
  > extends ApplicationV2.Configuration<SupportDetails> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<SupportDetails extends SupportDetails.Any = SupportDetails.Any> = DeepPartial<
    Configuration<SupportDetails>
  > &
    object;

  interface RenderOptions extends ApplicationV2.RenderOptions {}
}

declare abstract class AnySupportDetails extends SupportDetails<
  SupportDetails.RenderContext,
  SupportDetails.Configuration,
  SupportDetails.RenderOptions
> {
  constructor(...args: never);
}

export default SupportDetails;
