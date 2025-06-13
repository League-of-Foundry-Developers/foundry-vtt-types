import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type { Identity } from "#utils";

import Document = foundry.abstract.Document;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      DocumentOwnershipConfig: DocumentOwnershipConfig.Any;
    }
  }
}

/**
 * A generic application for configuring permissions for various Document types.
 * @remarks TODO: Stub
 */
declare class DocumentOwnershipConfig<
  Document extends Document.Any = Document.Any,
  RenderContext extends object = DocumentOwnershipConfig.RenderContext<Document>,
  Configuration extends
    DocumentOwnershipConfig.Configuration<Document> = DocumentOwnershipConfig.Configuration<Document>,
  RenderOptions extends DocumentOwnershipConfig.RenderOptions = DocumentOwnershipConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<Document, RenderContext, Configuration, RenderOptions> {}

declare namespace DocumentOwnershipConfig {
  interface Any extends AnyDocumentOwnershipConfig {}
  interface AnyConstructor extends Identity<typeof AnyDocumentOwnershipConfig> {}

  interface RenderContext<Document extends Document.Any = Document.Any>
    extends HandlebarsApplicationMixin.RenderContext,
      DocumentSheetV2.RenderContext<Document> {}

  interface Configuration<Document extends Document.Any = Document.Any>
    extends HandlebarsApplicationMixin.Configuration,
      DocumentSheetV2.Configuration<Document> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyDocumentOwnershipConfig extends DocumentOwnershipConfig<
  Document.Any,
  object,
  DocumentOwnershipConfig.Configuration<Document.Any>,
  DocumentOwnershipConfig.RenderOptions
> {
  constructor(...args: never);
}

export default DocumentOwnershipConfig;
