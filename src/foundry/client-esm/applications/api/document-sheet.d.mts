import type { AnyObject, DeepPartial, SimpleMerge } from "fvtt-types/utils";
import type ApplicationV2 from "./application.d.mts";

declare namespace DocumentSheetV2 {
  type Any = DocumentSheetV2<any, any, any, any>;

  type AnyConstructor = typeof AnyDocumentSheetV2;

  interface RenderContext<Document extends foundry.abstract.Document.Any = foundry.abstract.Document.Any>
    extends ApplicationV2.RenderContext {
    document: Document;
    source: Document["_source"];
    fields: Document["schema"]["fields"];
    editable: boolean;
    rootId: string;
  }

  interface Configuration<Document extends foundry.abstract.Document.Any = foundry.abstract.Document.Any>
    extends ApplicationV2.Configuration {
    /**
     * The Document instance associated with this sheet
     */
    document: Document;

    /**
     * A permission level in CONST.DOCUMENT_OWNERSHIP_LEVELS
     */
    viewPermission: typeof foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS;

    /**
     * A permission level in CONST.DOCUMENT_OWNERSHIP_LEVELS
     */
    editPermission: typeof foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS;

    /**
     * Can this sheet be used to create a new Document?
     */
    canCreate: boolean;

    /**
     * Allow sheet configuration as a header button
     */
    sheetConfig: boolean;
  }

  interface RenderOptions extends ApplicationV2.RenderOptions {
    /** A string with the format "\{operation\}\{documentName\}" providing context */
    renderContext: string;

    /** Data describing the document modification that occurred */
    renderData: object;
  }

  interface SubmitOptions {
    /**
     * Additional data merged with processed form data
     * @defaultValue `{}`
     */
    updateData?: AnyObject | undefined;

    /**
     * Options altering the create or update request
     * @defaultValue `{}`
     * // TODO: Update options to use the database operations in documentsV2 branch
     */
    operation?: unknown;
  }
}

/**
 * The Application class is responsible for rendering an HTMLElement into the Foundry Virtual Tabletop user interface.
 */
declare class DocumentSheetV2<
  Document extends foundry.abstract.Document.Any,
  RenderContext extends object = DocumentSheetV2.RenderContext<Document>,
  Configuration extends DocumentSheetV2.Configuration<Document> = DocumentSheetV2.Configuration<Document>,
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
> extends ApplicationV2<RenderContext, Configuration, RenderOptions> {
  // Note(LukeAbby): This is a fix for https://github.com/microsoft/TypeScript/issues/60927
  constructor(options: SimpleMerge<DeepPartial<Configuration>, { document: Document }>);

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  static DEFAULT_OPTIONS: DeepPartial<DocumentSheetV2.Configuration> & object;

  get document(): Document;

  override get title(): string;

  /**
   * Is this Document sheet visible to the current User?
   * This is governed by the viewPermission threshold configured for the class.
   */
  get isVisible(): boolean;

  /**
   * Is this Document sheet editable by the current User?
   * This is governed by the editPermission threshold configured for the class.
   */
  get isEditable(): boolean;

  protected _initializeApplicationOptions(options: DeepPartial<Configuration>): Configuration;

  protected override _headerControlsButtons(): Generator<ApplicationV2.HeaderControlsEntry>;

  protected override _renderFrame(options: DeepPartial<RenderOptions>): Promise<HTMLElement>;

  /**
   * Disable or renable all form fields in this application.
   * @param disabled - Should the fields be disabled?
   */
  protected _toggleDisabled(disabled: boolean): void;

  protected override _canRender(options: DeepPartial<RenderOptions>): false | void;

  protected override _onFirstRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): void;

  protected override _onClose(options: DeepPartial<RenderOptions>): void;

  override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  /**
   * Handle toggling the revealed state of a secret embedded in some content.
   * @param event - The triggering event.
   */
  protected _onRevealSecret(event: Event): void;

  /**
   * Prepare data used to update the Document upon form submission.
   * This data is cleaned and validated before being returned for further processing.
   * @param event    - The originating form submission event
   * @param form     - The form element that was submitted
   * @param formData - Processed data for the submitted form
   * @returns Prepared submission data as an object
   * @throws Subclasses may throw validation errors here to prevent form submission
   */
  // TODO: Improve typing?
  protected _prepareSubmitData(event: SubmitEvent, form: HTMLFormElement, formData: FormDataExtended): object;

  /**
   * Customize how form data is extracted into an expanded object.
   * @param event    - The originating form submission event
   * @param form     - The form element that was submitted
   * @param formData - Processed data for the submitted form
   * @returns An expanded object of processed form data
   * @throws Subclasses may throw validation errors here to prevent form submission
   */
  _processFormData(event: SubmitEvent | null, form: HTMLFormElement, formData: FormDataExtended): object;

  /**
   * Submit a document update or creation request based on the processed form data.
   * @param event    - The originating form submission event
   * @param form     - The form element that was submitted
   * @param formData - Processed and validated form data to be used for a document update
   * @param options  - Additional options altering the request
   * // TODO: Update options to use the database operations in documentsV2 branch
   */
  _processSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    formData: FormDataExtended,
    options?: unknown,
  ): Promise<void>;

  /**
   * Programmatically submit a DocumentSheetV2 instance, providing additional data to be merged with form data.
   */
  submit(options?: DocumentSheetV2.SubmitOptions): Promise<void>;

  /**
   * Provide a deprecation path for converted V1 document sheets
   * @param first - The first parameter received by this class's constructor
   * @param rest  - Any additional parameters received
   */
  static _migrateConstructorParams(first: unknown, rest: unknown[]): DeepPartial<DocumentSheetV2.Configuration>;
}

export default DocumentSheetV2;

declare abstract class AnyDocumentSheetV2 extends DocumentSheetV2<any, any, any, any> {
  constructor(arg0: never, ...args: never[]);
}
