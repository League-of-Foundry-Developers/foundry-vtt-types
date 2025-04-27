import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * A TableResult configuration sheet
 * @remarks TODO: Stub
 */
declare class TableResultConfig<
  RenderContext extends TableResultConfig.RenderContext = TableResultConfig.RenderContext,
  Configuration extends TableResultConfig.Configuration = TableResultConfig.Configuration,
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  TableResult.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace TableResultConfig {
  interface RenderContext extends DocumentSheetV2.RenderContext<TableResult.Implementation> {}

  interface Configuration extends DocumentSheetV2.Configuration<TableResult.Implementation> {}
}

export default TableResultConfig;
