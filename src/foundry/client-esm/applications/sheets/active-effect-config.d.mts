import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * The Application responsible for configuring a single ActiveEffect document within a parent Actor or Item.
 * @remarks TODO: Stub
 */
declare class ActiveEffectConfig<
  RenderContext extends ActiveEffectConfig.RenderContext = ActiveEffectConfig.RenderContext,
  Configuration extends ActiveEffectConfig.Configuration = ActiveEffectConfig.Configuration,
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  ActiveEffect.ConfiguredInstance,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace ActiveEffectConfig {
  interface RenderContext extends DocumentSheetV2.RenderContext<ActiveEffect.ConfiguredInstance> {}

  interface Configuration extends DocumentSheetV2.Configuration<ActiveEffect.ConfiguredInstance> {}
}

export default ActiveEffectConfig;
