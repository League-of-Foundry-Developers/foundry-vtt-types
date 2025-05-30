import type { PrototypeToken } from "#common/data/data.mjs";
import type { Identity } from "#utils";
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
> extends TokenApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {}

declare namespace PrototypeTokenConfig {
  interface Any extends AnyPrototypeTokenConfig {}
  interface AnyConstructor extends Identity<typeof AnyPrototypeTokenConfig> {}

  interface RenderContext extends TokenApplicationMixin.RenderContext<PrototypeToken>, ApplicationV2.RenderContext {}
  interface Configuration extends TokenApplicationMixin.Configuration, ApplicationV2.Configuration {}
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
