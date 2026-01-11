import type { PrototypeToken } from "#common/data/data.mjs";
import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type TokenApplicationMixin from "./mixin.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      PrototypeTokenConfig: PrototypeTokenConfig.Any;
    }
  }
}

/**
 * The Application responsible for configuring an actor's PrototypeToken
 * @remarks TODO: Stub
 */
declare class PrototypeTokenConfig<
  RenderContext extends PrototypeTokenConfig.RenderContext = PrototypeTokenConfig.RenderContext,
  Configuration extends PrototypeTokenConfig.Configuration = PrototypeTokenConfig.Configuration,
  RenderOptions extends PrototypeTokenConfig.RenderOptions = PrototypeTokenConfig.RenderOptions,
> extends TokenApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  // Fake override.
  static override DEFAULT_OPTIONS: PrototypeTokenConfig.DefaultOptions;

  override get token(): TokenDocument.Implementation | PrototypeToken;
}

declare namespace PrototypeTokenConfig {
  interface Any extends AnyPrototypeTokenConfig {}
  interface AnyConstructor extends Identity<typeof AnyPrototypeTokenConfig> {}

  interface RenderContext extends TokenApplicationMixin.RenderContext<PrototypeToken>, ApplicationV2.RenderContext {}

  interface Configuration<PrototypeTokenConfig extends PrototypeTokenConfig.Any = PrototypeTokenConfig.Any>
    extends TokenApplicationMixin.Configuration, ApplicationV2.Configuration<PrototypeTokenConfig> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<PrototypeTokenConfig extends PrototypeTokenConfig.Any = PrototypeTokenConfig.Any> = DeepPartial<
    Configuration<PrototypeTokenConfig>
  > &
    object;

  interface RenderOptions extends TokenApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}
}

declare abstract class AnyPrototypeTokenConfig extends PrototypeTokenConfig<
  PrototypeTokenConfig.RenderContext,
  PrototypeTokenConfig.Configuration,
  PrototypeTokenConfig.RenderOptions
> {
  constructor(...args: never);
}

export default PrototypeTokenConfig;
