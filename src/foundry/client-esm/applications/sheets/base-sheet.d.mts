import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * The Application responsible for displaying a basic sheet for any Document sub-types that do not have a sheet registered.
 * @remarks TODO: Stub
 */
declare class BaseSheet<
  Document extends foundry.abstract.Document.Any = foundry.abstract.Document.Any,
  RenderContext extends BaseSheet.RenderContext<Document> = BaseSheet.RenderContext<Document>,
  Configuration extends DocumentSheetV2.Configuration<Document> = DocumentSheetV2.Configuration<Document>,
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<Document, RenderContext, Configuration, RenderOptions> {}

declare namespace BaseSheet {
  interface RenderContext<Document extends foundry.abstract.Document.Any>
    extends DocumentSheetV2.RenderContext<Document> {
    descriptionHTML?: string;
    hasNothing: boolean;
  }
}

export default BaseSheet;
