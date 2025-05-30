import type { Identity } from "#utils";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

import Document = foundry.abstract.Document;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      DocumentSheetConfig: DocumentSheetConfig.Any;
    }
  }
}

/**
 * An Application for configuring Document sheet settings.
 * @remarks TODO: Stub
 */
declare class DocumentSheetConfig<
  Document extends Document.Any = Document.Any,
  RenderContext extends DocumentSheetConfig.RenderContext<Document> = DocumentSheetConfig.RenderContext<Document>,
  Configuration extends DocumentSheetConfig.Configuration<Document> = DocumentSheetConfig.Configuration<Document>,
  RenderOptions extends DocumentSheetConfig.RenderOptions = DocumentSheetConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<Document, RenderContext, Configuration, RenderOptions> {
  static registerSheet: () => unknown;

  static unregisterSheet: () => unknown;
}

declare namespace DocumentSheetConfig {
  interface Any extends AnyDocumentSheetConfig {}
  interface AnyConstructor extends Identity<typeof AnyDocumentSheetConfig> {}

  interface RenderContext<Document extends Document.Any>
    extends HandlebarsApplicationMixin.RenderContext,
      DocumentSheetV2.RenderContext<Document> {}

  interface Configuration<Document extends Document.Any>
    extends HandlebarsApplicationMixin.Configuration,
      DocumentSheetV2.Configuration<Document> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyDocumentSheetConfig extends DocumentSheetConfig<
  Document.Any,
  DocumentSheetConfig.RenderContext<Document.Any>,
  DocumentSheetConfig.Configuration<Document.Any>,
  DocumentSheetConfig.RenderOptions
> {
  constructor(...args: never);
}

export default DocumentSheetConfig;
