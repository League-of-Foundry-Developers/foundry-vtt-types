import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * The Application responsible for displaying and editing a single RollTable document.
 * @remarks TODO: Stub
 */
declare class RollTableConfig<
  RenderContext extends RollTableConfig.RenderContext = RollTableConfig.RenderContext,
  Configuration extends RollTableConfig.Configuration = RollTableConfig.Configuration,
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  RollTable.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace RollTableConfig {
  interface RenderContext extends DocumentSheetV2.RenderContext<RollTable.Implementation> {}

  interface Configuration extends DocumentSheetV2.Configuration<RollTable.Implementation> {}
}

export default RollTableConfig;
