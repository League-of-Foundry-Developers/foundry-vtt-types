import type { Identity } from "#utils";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      TableResultConfig: TableResultConfig.Any;
    }
  }
}

/**
 * A TableResult configuration sheet
 * @remarks TODO: Stub
 */
declare class TableResultConfig<
  RenderContext extends TableResultConfig.RenderContext = TableResultConfig.RenderContext,
  Configuration extends TableResultConfig.Configuration = TableResultConfig.Configuration,
  RenderOptions extends TableResultConfig.RenderOptions = TableResultConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  TableResult.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace TableResultConfig {
  interface Any extends AnyTableResultConfig {}
  interface AnyConstructor extends Identity<typeof AnyTableResultConfig> {}

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext, DocumentSheetV2.RenderContext<TableResult.Implementation> {}

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration, DocumentSheetV2.Configuration<TableResult.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyTableResultConfig extends TableResultConfig<
  TableResultConfig.RenderContext,
  TableResultConfig.Configuration,
  TableResultConfig.RenderOptions
> {
  constructor(...args: never);
}

export default TableResultConfig;
