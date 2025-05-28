import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * The Application responsible for editing, displaying, and using a single RollTable document.
 * @remarks TODO: Stub
 */
declare class RollTableSheet<
  RenderContext extends RollTableSheet.RenderContext = RollTableSheet.RenderContext,
  Configuration extends RollTableSheet.Configuration = RollTableSheet.Configuration,
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  RollTable.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace RollTableSheet {
  interface RenderContext extends DocumentSheetV2.RenderContext<RollTable.Implementation> {}

  interface Configuration extends DocumentSheetV2.Configuration<RollTable.Implementation> {}
}

export default RollTableSheet;
