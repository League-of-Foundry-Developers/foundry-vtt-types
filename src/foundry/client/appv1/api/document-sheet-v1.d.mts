import type { EditorView } from "prosemirror-view";
import type { Editor } from "tinymce";
import type { GetDataReturnType, MaybePromise, Identity } from "#utils";
import type Document from "#common/abstract/document.d.mts";
import type Application from "./application-v1.mjs";
import type FormApplication from "./form-application-v1.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationConfig {
      DocumentSheet: DocumentSheet.Any;
    }
  }
}

/**
 * Extend the FormApplication pattern to incorporate specific logic for viewing or editing Document instances.
 * See the FormApplication documentation for more complete description of this interface.
 *
 * @template Options          - the type of the options object
 * @template ConcreteDocument - the type of the Document which should be managed by this form sheet
 */
declare abstract class DocumentSheet<
  ConcreteDocument extends foundry.abstract.Document.Any = foundry.abstract.Document.Any,
  Options extends DocumentSheet.Options<ConcreteDocument> = DocumentSheet.Options<ConcreteDocument>,
> extends FormApplication<ConcreteDocument, Options> {
  /**
   * @param object  - A Document instance which should be managed by this form.
   * @param options - Optional configuration parameters for how the form behaves.
   *                  (default: `{}`)
   */
  constructor(object: ConcreteDocument, options?: Partial<Options>);

  /** The list of handlers for secret block functionality. */
  protected _secrets: HTMLSecret<ConcreteDocument>[];

  /**
   * @defaultValue
   * ```typescript
   * foundry.utils.mergeObject(super.defaultOptions, {
   *   classes: ["sheet"],
   *   template: `templates/sheets/${this.name.toLowerCase()}.html`,
   *   viewPermission: CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED,
   *   sheetConfig: true,
   *   secrets: []
   * });
   * ```
   */
  static get defaultOptions(): DocumentSheet.Options;

  /**
   * A semantic convenience reference to the Document instance which is the target object for this form.
   */
  get document(): ConcreteDocument;

  override get id(): string;

  override get isEditable(): boolean;

  override get title(): string;

  override close(options?: FormApplication.CloseOptions): Promise<void>;

  override getData(
    options?: Partial<Options>,
  ): MaybePromise<GetDataReturnType<DocumentSheet.DocumentSheetData<Options, ConcreteDocument>>>;

  protected override _activateCoreListeners(html: JQuery<HTMLElement>): void;

  override activateEditor(
    name: string,
    options?: TextEditor.Options,
    initialContent?: string,
  ): Promise<Editor | EditorView>;

  protected override _render(force?: boolean, options?: Application.RenderOptions<Options>): Promise<void>;

  protected override _renderOuter(): Promise<JQuery<HTMLElement>>;

  /**
   * Create an ID link button in the document sheet header which displays the document ID and copies to clipboard
   */
  protected _createDocumentIdLink(html: JQuery<HTMLElement>): void;

  /**
   * Test whether a certain User has permission to view this Document Sheet.
   * @param user - The user requesting to render the sheet
   * @returns Does the User have permission to view this sheet?
   */
  protected _canUserView(user: User.Implementation): boolean;

  /**
   * Create objects for managing the functionality of secret blocks within this Document's content.
   */
  protected _createSecretHandlers(): HTMLSecret[];

  protected override _getHeaderButtons(): Application.HeaderButton[];

  /**
   * Get the HTML content that a given secret block is embedded in.
   * @param secret - The secret block.
   */
  protected _getSecretContent(secret: HTMLElement): string;

  /**
   * Update the HTML content that a given secret block is embedded in.
   * @param secret  - The secret block.
   * @param content - The new content.
   * @returns The updated Document.
   */
  protected _updateSecret(secret: HTMLElement, content: string): Promise<ConcreteDocument | void>;

  /**
   * Handle requests to configure the default sheet used by this Document
   * @internal
   */
  protected _onConfigureSheet(event: JQuery.ClickEvent): void;

  /**
   * Handle changing a Document's image.
   * @param event - The click event.
   */
  protected _onEditImage(event: MouseEvent): Promise<void>;

  protected override _updateObject(event: Event, formData: object): Promise<unknown>;
}

declare namespace DocumentSheet {
  interface Any extends AnyDocumentSheet {}
  interface AnyConstructor extends Identity<typeof AnyDocumentSheet> {}

  interface DocumentSheetData<
    Options extends DocumentSheet.Options<ConcreteDocument>,
    ConcreteDocument extends foundry.abstract.Document.Any = foundry.abstract.Document.Any,
  > extends FormApplication.FormApplicationData {
    cssClass: string;
    editable: boolean;
    data: ReturnType<ConcreteDocument["toObject"]>;
    limited: boolean;
    options: DocumentSheet<ConcreteDocument, Options>["options"];
    owner: boolean;
    title: DocumentSheet<ConcreteDocument, Options>["title"];
    document: DocumentSheet<ConcreteDocument, Options>["document"];
  }

  interface Options<ConcreteDocument extends Document.Internal.Instance.Any = Document.Internal.Instance.Any>
    extends FormApplication.Options {
    /**
     * The default permissions required to view this Document sheet.
     * @defaultValue {@linkcode CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED}
     */
    viewPermission: foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS;

    /** An array of {@linkcode HTMLSecret} configuration objects. */
    secrets: HTMLSecret.Configuration<ConcreteDocument>[];
  }
}

declare abstract class AnyDocumentSheet extends DocumentSheet<
  foundry.abstract.Document.Any,
  DocumentSheet.Options<foundry.abstract.Document.Any>
> {
  constructor(...args: never);
}

export default DocumentSheet;
