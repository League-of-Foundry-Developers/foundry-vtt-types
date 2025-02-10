import type ApplicationV2 from "../../api/application.d.mts";
import type TokenApplicationMixin from "./mixin.d.mts";

/**
 * The Application responsible for configuring an actor's PrototypeToken
 * @remarks TODO: Stub
 */
declare class PrototypeTokenConfig<
  RenderContext extends PrototypeTokenConfig.RenderContext = PrototypeTokenConfig.RenderContext,
  Configuration extends ApplicationV2.Configuration = ApplicationV2.Configuration,
  RenderOptions extends ApplicationV2.RenderOptions = ApplicationV2.RenderOptions,
> extends TokenApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {}

declare namespace PrototypeTokenConfig {
  interface RenderContext extends ApplicationV2.RenderContext {}
}

export default PrototypeTokenConfig;
