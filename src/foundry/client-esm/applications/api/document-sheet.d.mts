import type { DeepPartial } from "../../../../types/utils.d.mts";
import type {
  ApplicationConfiguration,
  ApplicationHeaderControlsEntry,
  ApplicationRenderContext,
  ApplicationRenderOptions,
} from "../_types.d.mts";
import type ApplicationV2 from "./application.d.mts";

interface DocumentSheetConfiguration extends ApplicationConfiguration {
  /**
   * The Document instance associated with this sheet
   */
  document: foundry.abstract.Document<any, any, any>;
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

interface DocumentSheetRenderOptions extends ApplicationRenderOptions {
  renderContext: string;
  renderData: object;
}

/**
 * The Application class is responsible for rendering an HTMLElement into the Foundry Virtual Tabletop user interface.
 */
export default class DocumentSheetV2 extends ApplicationV2 {
  constructor(options: DeepPartial<DocumentSheetConfiguration>);

  static DEFAULT_OPTIONS: DeepPartial<DocumentSheetConfiguration>;

  get Document(): ClientDocument;

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

  protected _initializeApplicationOptions(
    options: DeepPartial<DocumentSheetConfiguration>,
  ): DeepPartial<DocumentSheetConfiguration> & Record<string, unknown>;

  protected override _headerControlsButtons(): Generator<ApplicationHeaderControlsEntry>;

  protected override _renderFrame(options: DeepPartial<DocumentSheetRenderOptions>): Promise<HTMLElement>;

  protected override _canRender(options: DeepPartial<DocumentSheetRenderOptions>): false | void;

  protected override _onFirstRender(
    context: DeepPartial<ApplicationRenderContext>,
    options: DeepPartial<DocumentSheetRenderOptions>,
  ): void;

  protected override _onClose(options: DeepPartial<DocumentSheetRenderOptions>): void;

  /**
   * Prepare data used to update the Item upon form submission.
   * @param event    - The originating form submission event
   * @param form     - The form element that was submitted
   * @param formData - Processed data for the submitted form
   * @returns Prepared submission data as an object
   * @throws Subclasses may throw validation errors here to prevent form submission
   */
  // TODO: Improve typing?
  protected _prepareSubmitData(event: SubmitEvent, form: HTMLFormElement, formData: FormDataExtended): object;
}
