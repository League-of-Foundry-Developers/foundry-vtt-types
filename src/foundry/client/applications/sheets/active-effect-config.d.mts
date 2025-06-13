import type { Identity } from "#utils";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      ActiveEffectConfig: ActiveEffectConfig.Any;
    }
  }
}

/**
 * The Application responsible for configuring a single ActiveEffect document within a parent Actor or Item.
 * @remarks TODO: Stub
 */
declare class ActiveEffectConfig<
  RenderContext extends ActiveEffectConfig.RenderContext = ActiveEffectConfig.RenderContext,
  Configuration extends ActiveEffectConfig.Configuration = ActiveEffectConfig.Configuration,
  RenderOptions extends ActiveEffectConfig.RenderOptions = ActiveEffectConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  ActiveEffect.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace ActiveEffectConfig {
  interface Any extends AnyActiveEffectConfig {}
  interface AnyConstructor extends Identity<typeof AnyActiveEffectConfig> {}

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext,
      DocumentSheetV2.RenderContext<ActiveEffect.Implementation> {}

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration,
      DocumentSheetV2.Configuration<ActiveEffect.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyActiveEffectConfig extends ActiveEffectConfig<
  ActiveEffectConfig.RenderContext,
  ActiveEffectConfig.Configuration,
  ActiveEffectConfig.RenderOptions
> {
  constructor(...args: never);
}

export default ActiveEffectConfig;
