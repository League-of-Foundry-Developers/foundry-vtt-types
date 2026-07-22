import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type ApplicationV2 from "../api/application.d.mts";
import type { DeepPartial, Identity } from "#utils";

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
 */
declare class DocumentOwnershipConfig<
  Document extends Document.Any = Document.Any,
  RenderContext extends object = DocumentOwnershipConfig.RenderContext<Document>,
  Configuration extends DocumentOwnershipConfig.Configuration<Document> =
    DocumentOwnershipConfig.Configuration<Document>,
  RenderOptions extends DocumentOwnershipConfig.RenderOptions = DocumentOwnershipConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<Document, RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   classes: ["document-ownership"],
   *   template: "templates/apps/document-ownership.hbs",
   *   viewPermission: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER,
   *   window: {
   *     contentClasses: ["standard-form"],
   *     icon: "fa-solid fa-user-lock"
   *   },
   *   position: {width: 420},
   *   form: {
   *     handler: DocumentOwnershipConfig.#onSubmitForm,
   *     closeOnSubmit: true
   *   },
   *   sheetConfig: false,
   *   ownershipConfig: false
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  override get title(): string;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  /**
   * @privateRemarks Prevents duck typing
   */
  #DocumentOwnershipConfig: true;
}

declare namespace DocumentOwnershipConfig {
  interface Any extends AnyDocumentOwnershipConfig {}
  interface AnyConstructor extends Identity<typeof AnyDocumentOwnershipConfig> {}

  interface RenderContext<Document extends Document.Any = Document.Any>
    extends HandlebarsApplicationMixin.RenderContext, DocumentSheetV2.RenderContext<Document> {
    currentDefault: CONST.DOCUMENT_META_OWNERSHIP_LEVELS | CONST.DOCUMENT_OWNERSHIP_LEVELS;
    instructions: string;
    defaultLevels: DocumentOwnershipConfig.OwnershipLevelChoice[];
    playerLevels: DocumentOwnershipConfig.OwnershipLevelChoice[];
    isFolder: boolean;
    showGM: boolean;
    users: {
      user: User.Implementation;
      level: CONST.DOCUMENT_META_OWNERSHIP_LEVELS | CONST.DOCUMENT_OWNERSHIP_LEVELS;
      isAuthor: boolean;
    }[];
    buttons: ApplicationV2.FormFooterButton[];
  }

  interface OwnershipLevelChoice {
    level: CONST.DOCUMENT_META_OWNERSHIP_LEVELS | CONST.DOCUMENT_OWNERSHIP_LEVELS;
    label: string;
  }

  interface Configuration<Document extends Document.Any = Document.Any>
    extends HandlebarsApplicationMixin.Configuration, DocumentSheetV2.Configuration<Document> {}

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
