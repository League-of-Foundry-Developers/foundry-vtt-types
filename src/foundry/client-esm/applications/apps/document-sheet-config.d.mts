import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * An Application for configuring Document sheet settings.
 * @remarks TODO: Stub
 */
declare class DocumentSheetConfig<
  Document extends foundry.abstract.Document.Any = foundry.abstract.Document.Any,
  RenderContext extends DocumentSheetConfig.RenderContext<Document> = DocumentSheetConfig.RenderContext<Document>,
  Configuration extends DocumentSheetConfig.Configuration<Document> = DocumentSheetConfig.Configuration<Document>,
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<Document, RenderContext, Configuration, RenderOptions> {}

declare namespace DocumentSheetConfig {
  interface RenderContext<Document extends foundry.abstract.Document.Any>
    extends DocumentSheetV2.RenderContext<Document> {}

  interface Configuration<Document extends foundry.abstract.Document.Any>
    extends DocumentSheetV2.Configuration<Document> {}
}

export default DocumentSheetConfig;
