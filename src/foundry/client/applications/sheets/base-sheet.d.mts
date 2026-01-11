import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type { Identity } from "#utils";

import Document = foundry.abstract.Document;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      BaseSheet: BaseSheet.Any;
    }
  }
}

/**
 * The Application responsible for displaying a basic sheet for any Document sub-types that do not have a sheet registered.
 * @remarks TODO: Stub
 */
declare class BaseSheet<
  Document extends Document.Any = Document.Any,
  RenderContext extends BaseSheet.RenderContext<Document> = BaseSheet.RenderContext<Document>,
  Configuration extends BaseSheet.Configuration<Document> = BaseSheet.Configuration<Document>,
  RenderOptions extends BaseSheet.RenderOptions = BaseSheet.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<Document, RenderContext, Configuration, RenderOptions> {}

declare namespace BaseSheet {
  interface Any extends AnyBaseSheet {}
  interface AnyConstructor extends Identity<typeof AnyBaseSheet> {}

  interface RenderContext<Document extends Document.Any>
    extends HandlebarsApplicationMixin.RenderContext, DocumentSheetV2.RenderContext<Document> {
    descriptionHTML?: string;
    hasNothing: boolean;
  }

  interface Configuration<Document extends Document.Any>
    extends HandlebarsApplicationMixin.Configuration, DocumentSheetV2.Configuration<Document> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyBaseSheet extends BaseSheet<
  Document.Any,
  BaseSheet.RenderContext<Document.Any>,
  BaseSheet.Configuration<Document.Any>,
  BaseSheet.RenderOptions
> {
  constructor(...args: never);
}

export default BaseSheet;
