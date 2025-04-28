import type { DeepPartial, Identity } from "fvtt-types/utils";
import type ApplicationV2 from "./application.d.mts";

import Document = foundry.abstract.Document;

declare namespace DocumentSheetV2 {
  interface Any extends AnyDocumentSheetV2 {}
  interface AnyConstructor extends Identity<typeof AnyDocumentSheetV2> {}

  interface RenderContext<ConcreteDocument extends Document.Any = Document.Any> extends ApplicationV2.RenderContext {
    document: ConcreteDocument;
    source: ConcreteDocument["_source"];
    fields: ConcreteDocument["schema"]["fields"];
    editable: boolean;
    rootId: string;
  }

  interface Configuration<ConcreteDocument extends Document.Any> extends ApplicationV2.Configuration, _Configuration {
    /**
     * The Document instance associated with this sheet
     */
    document: ConcreteDocument;
  }

  /** @internal */
  interface _Configuration {
    /**
     * A permission level in CONST.DOCUMENT_OWNERSHIP_LEVELS
     */
    viewPermission: typeof foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS;

    /**
     * A permission level in CONST.DOCUMENT_OWNERSHIP_LEVELS
     */
    editPermission: typeof foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS;

    /**
     * Can this sheet class be used to create a new Document?
     */
    canCreate: boolean;

    /**
     * Allow sheet configuration as a header button
     */
    sheetConfig: boolean;
  }

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  interface DefaultOptions extends _Configuration, Identity<object> {
    /**
     * @deprecated Setting `document` in `DocumentSheetV2.DEFAULT_OPTIONS` is not supported. If you
     * have a need for this, please file an issue.
     */
    document: never;
  }

  interface RenderOptions extends ApplicationV2.RenderOptions {
    /** A string with the format "\{operation\}\{documentName\}" providing context */
    renderContext: string;

    /** Data describing the document modification that occurred */
    renderData: object;
  }

  interface SubmitOptions {
    /** Additional data passed in if this form is submitted manually which should be merged with prepared formData. */
    updateData: object;
  }
}

/**
 * The Application class is responsible for rendering an HTMLElement into the Foundry Virtual Tabletop user interface.
 */
declare class DocumentSheetV2<
  Document extends Document.Any,
  RenderContext extends object = DocumentSheetV2.RenderContext<Document>,
  Configuration extends DocumentSheetV2.Configuration<Document> = DocumentSheetV2.Configuration<Document>,
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
> extends ApplicationV2<RenderContext, Configuration, RenderOptions> {
  constructor(options?: DeepPartial<Configuration>);

  static DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

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

  protected override _configureRenderOptions(options: DeepPartial<RenderOptions>): void;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _renderFrame(options: DeepPartial<RenderOptions>): Promise<HTMLElement>;

  /**
   * Disable or reenable all form fields in this application
   * @param disabled - Should the fields be disabled?
   */
  protected _toggleDisabled(disabled: boolean): void;

  protected override _canRender(options: DeepPartial<RenderOptions>): false | void;

  protected override _onFirstRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _onClose(options: DeepPartial<RenderOptions>): void;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  /**
   * Handle toggling the revealed state of a secret embedded in some content.
   */
  protected _onRevealSecret(event: Event): void;

  /**
   * Prepare data used to update the Item upon form submission.
   * This data is cleaned and validated before being returned for further processing.
   * @param event      - The originating form submission event
   * @param form       - The form element that was submitted
   * @param formData   - Processed data for the submitted form
   * @param updateData - Additional data passed in if this form is submitted manually which should be merged with prepared formData
   * @returns Prepared submission data as an object
   * @throws Subclasses may throw validation errors here to prevent form submission
   * @privateRemarks TODO: Improve typing for updateData & return
   */
  protected _prepareSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    formData: FormDataExtended,
    updateData?: unknown,
  ): object;

  /**
   * Customize how form data is extracted into an expanded object.
   * @param event    - The originating form submission event
   * @param form     - The form element that was submitted
   * @param formData - Processed data for the submitted form
   * @returns An expanded object of processed form data
   * @throws Subclasses may throw validation errors here to prevent form submission
   */
  protected _processFormData(event: SubmitEvent | null, form: HTMLFormElement, formData: FormDataExtended): object;

  /**
   * Submit a document update or creation request based on the processed form data.
   * @param event    - The originating form submission event
   * @param form     - The form element that was submitted
   * @param formData - Processed and validated form data to be used for a document update
   * @param options  - Additional options altering the request
   * @privateRemarks TODO: Improve options to capture the Create and/or Update options available to the Document
   */
  _processSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    formData: FormDataExtended,
    options?: unknown,
  ): Promise<void>;

  /**
   * Provide a deprecation path for converted V1 document sheets.
   * @param first - The first parameter received by this class's constructor
   * @param rest  - Any additional parameters received
   * @privateRemarks - This *is* possible to type more precisely but the reward/benefit is pretty minor
   */
  static _migrateConstructorParams(first: unknown, rest: unknown[]): DocumentSheetV2.Configuration<Document.Any>;
}

export default DocumentSheetV2;

declare abstract class AnyDocumentSheetV2 extends DocumentSheetV2<any, any, any, any> {
  constructor(...args: never);
}
