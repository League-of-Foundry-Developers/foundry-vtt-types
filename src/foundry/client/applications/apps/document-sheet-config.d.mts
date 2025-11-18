import type { Identity } from "#utils";
import type DocumentSheet from "#client/appv1/api/document-sheet-v1.mjs";
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
  static registerSheet(
    documentClass: Document.AnyConstructor,
    scope: string,
    sheetClass: DocumentSheet.AnyConstructor | DocumentSheetV2.AnyConstructor,
    options?: DocumentSheetConfig.SheetRegistrationOptions,
  ): void;

  static unregisterSheet(
    documentClass: Document.AnyConstructor,
    scope: string,
    sheetClass: DocumentSheet.AnyConstructor | DocumentSheetV2.AnyConstructor,
    options?: DocumentSheetConfig.UnregisterSheetOptions,
  ): void;
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

  interface SheetRegistrationOptions {
    /**
     * A human-readable label for the sheet name, or a function that returns one. Will be localized.
     */
    label?: string | (() => string) | undefined;

    /**
     * An array of Document sub-types to register the sheet for.
     */
    types?: string[] | undefined;

    /**
     * An object of theme keys to labels that the sheet supports. If this
     * option is not supplied, the sheet is assumed to support both light
     * and dark themes. If null is supplied, it indicates that the sheet
     * does not support theming.
     */
    themes?: Record<string, string> | null | undefined;

    /**
     * Whether to make this sheet the default for the provided sub-types.
     * @defaultValue `false`
     */
    makeDefault?: boolean | undefined;

    /**
     * Whether this sheet is available to be selected as a default sheet for all Documents of that type.
     * @defaultValue `true`
     */
    canBeDefault?: boolean | undefined;

    /**
     * Whether this sheet appears in the sheet configuration UI for users.
     * @defaultValue `true`
     */
    canConfigure?: boolean | undefined;
  }

  interface UnregisterSheetOptions {
    types?: string[] | undefined;
  }

  /** @deprecated Renamed to SheetRegistrationOptions to match core */
  interface RegisterSheetOptions extends SheetRegistrationOptions {}
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
