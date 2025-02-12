import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * The Combatant configuration application.
 * @remarks TODO: Stub
 */
declare class CombatantConfig<
  RenderContext extends CombatantConfig.RenderContext = CombatantConfig.RenderContext,
  Configuration extends CombatantConfig.Configuration = CombatantConfig.Configuration,
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  Combatant.ConfiguredInstance,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace CombatantConfig {
  interface RenderContext extends DocumentSheetV2.RenderContext<Combatant.ConfiguredInstance> {}

  interface Configuration extends DocumentSheetV2.Configuration<Combatant.ConfiguredInstance> {}
}

export default CombatantConfig;
