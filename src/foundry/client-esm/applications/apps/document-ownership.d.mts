import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";

/**
 * A generic application for configuring permissions for various Document types.
 * @remarks TODO: Stub
 */
declare class DocumentOwnershipConfig<
  Document extends foundry.abstract.Document.Any = foundry.abstract.Document.Any,
  RenderContext extends object = DocumentOwnershipConfig.RenderContext<Document>,
  Configuration extends DocumentSheetV2.Configuration<Document> = DocumentSheetV2.Configuration<Document>,
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<Document, RenderContext, Configuration, RenderOptions> {}

declare namespace DocumentOwnershipConfig {
  interface RenderContext<Document extends foundry.abstract.Document.Any = foundry.abstract.Document.Any>
    extends DocumentSheetV2.RenderContext<Document> {}
}

export default DocumentOwnershipConfig;
