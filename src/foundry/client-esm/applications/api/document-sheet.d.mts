import type { AnyObject, Brand, DeepPartial, EmptyObject, Identity } from "fvtt-types/utils";
import type ApplicationV2 from "./application.d.mts";

declare namespace DocumentSheetV2 {
  interface Any extends AnyDocumentSheetV2 {}
  interface AnyConstructor extends Identity<typeof AnyDocumentSheetV2> {}

  type UnsetDocument = Brand<string, "DocumentSheetV2.UnsetDocument">;

  interface Configuration<Document extends foundry.abstract.Document.Any | UnsetDocument = UnsetDocument>
    extends ApplicationV2.Configuration {
    /**
     * The Document instance associated with this sheet
     */
    document: Document extends foundry.abstract.Document.Any ? Document : foundry.abstract.Document.Any;

    /**
     * A permission level in CONST.DOCUMENT_OWNERSHIP_LEVELS
     */
    viewPermission: typeof foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS;

    /**
     * A permission level in CONST.DOCUMENT_OWNERSHIP_LEVELS
     */
    editPermission: typeof foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS;

    /**
     * Allow sheet configuration as a header button
     */
    sheetConfig: boolean;
  }

  type PartialConfiguration<
    Configuration extends DocumentSheetV2.Configuration<foundry.abstract.Document.Any | UnsetDocument>,
  > = DeepPartial<Omit<Configuration, "document">> &
    (Configuration extends DocumentSheetV2.Configuration<infer _ extends foundry.abstract.Document.Any>
      ? // If a document is already specified in the config, don't allow it to be set in subclasses
        // because `Object.apply(new Item(...), new Actor(...))` is clearly nonsensical
        {
          /** @deprecated Document is not an allowed property in this DocumentSheetV2 subclass */
          document?: never;
        }
      : { document?: foundry.abstract.Document.Any | undefined });

  interface RenderOptions extends ApplicationV2.RenderOptions {
    /** A string with the format "\{operation\}\{documentName\}" providing context */
    renderContext: string;

    /** Data describing the document modification that occurred */
    renderData: object;
  }
}

/**
 * The Application class is responsible for rendering an HTMLElement into the Foundry Virtual Tabletop user interface.
 */
declare class DocumentSheetV2<
  Document extends foundry.abstract.Document.Any | DocumentSheetV2.UnsetDocument,
  RenderContext extends AnyObject = EmptyObject,
  Configuration extends DocumentSheetV2.Configuration<Document> = DocumentSheetV2.Configuration<Document>,
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
> extends ApplicationV2<RenderContext, Configuration, RenderOptions> {
  // Note(LukeAbby): This is a fix for https://github.com/microsoft/TypeScript/issues/60927
  constructor(options: DocumentSheetV2.PartialConfiguration<Configuration>);

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  static DEFAULT_OPTIONS: DocumentSheetV2.PartialConfiguration<DocumentSheetV2.Configuration> & object;

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

  protected _initializeApplicationOptions(options: DocumentSheetV2.PartialConfiguration<Configuration>): Configuration;

  protected override _headerControlsButtons(): Generator<ApplicationV2.HeaderControlsEntry>;

  protected override _renderFrame(options: DeepPartial<RenderOptions>): Promise<HTMLElement>;

  protected override _canRender(options: DeepPartial<RenderOptions>): false | void;

  protected override _onFirstRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): void;

  protected override _onClose(options: DeepPartial<RenderOptions>): void;

  /**
   * Prepare data used to update the Item upon form submission.
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
  _processFormData(event: SubmitEvent, form: HTMLFormElement, formData: FormDataExtended): object;

  /**
   * Submit a document update based on the processed form data.
   * @param event    - The originating form submission event
   * @param form     - The form element that was submitted
   * @param formData - Processed and validated form data to be used for a document update
   */
  _processSubmitData(event: SubmitEvent, form: HTMLFormElement, formData: FormDataExtended): Promise<void>;

  /**
   * Programmatically submit a DocumentSheetV2 instance, providing additional data to be merged with form data.
   */
  submit(options?: {
    /** Additional data merged with processed form data */
    updateData: object;
  }): Promise<void>;
}

export default DocumentSheetV2;

declare abstract class AnyDocumentSheetV2 extends DocumentSheetV2<any, any, any, any> {
  constructor(...args: never);
}
