import type { FormInputConfig } from "../forms/fields.d.mts";
import type AbstractFormInputElement from "./form-element.d.mts";

/**
 * A custom HTMLElement used to render a set of associated Documents referenced by UUID.
 */
declare class HTMLDocumentTagsElement extends AbstractFormInputElement<Record<string, string> | string | string[]> {
  constructor();

  protected _value: Record<string, string>;

  set type(value: string);

  /**
   * Restrict this element to documents of a particular type.
   */
  get type(): string | null;

  /**
   * Restrict to only allow referencing a single Document instead of an array of documents.
   */
  get single(): boolean;
  set single(value: boolean);

  set max(value: number);

  /**
   * Allow a maximum number of documents to be tagged to the element.
   */
  get max(): number;

  /**
   * Initialize innerText or an initial value attribute of the element as a serialized JSON array.
   */
  protected _initializeTags(): void;

  protected override _buildElements(): (HTMLButtonElement | HTMLDivElement)[];

  protected override _refresh(): void;

  /**
   * Create an HTML string fragment for a single document tag.
   * @param uuid     - The document UUID
   * @param name     - The document name
   * @param editable - Is the tag editable?
   *                   (default: `true`)
   */
  static renderTag(uuid: string, name: string, editable?: boolean): HTMLDivElement;

  /**
   * Validate that the tagged document is allowed to be added to this field.
   * Subclasses may impose more strict validation as to which types of documents are allowed.
   * @param document - A candidate document or compendium index entry to tag
   * @throws An error if the candidate document is not allowed
   */
  _validateDocument(document: foundry.abstract.Document.Any | Record<string, unknown>): void;

  protected override _getValue(): string | string[];

  protected override _setValue(value: string | string[]): void;

  protected override _toggleDisabled(disabled: boolean): void;

  /**
   * Create a HTMLDocumentTagsElement using provided configuration data.
   */
  static create(config: HTMLDocumentTagsElement.DocumentTagsInputConfig): HTMLDocumentTagsElement;
}

declare namespace HTMLDocumentTagsElement {
  interface DocumentTagsInputConfig extends FormInputConfig<unknown> {
    /**
     * A specific document type in CONST.ALL_DOCUMENT_TYPES
     */
    type?: foundry.CONST.ALL_DOCUMENT_TYPES;

    /**
     * Only allow referencing a single document. In this case the submitted form value will
     *    be a single UUID string rather than an array
     */
    single?: boolean;

    /**
     * Only allow attaching a maximum number of documents
     */
    max?: number;
  }
}

export default HTMLDocumentTagsElement;
