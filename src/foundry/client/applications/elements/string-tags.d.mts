import type { FormInputConfig } from "../forms/fields.d.mts";
import type AbstractFormInputElement from "./form-element.d.mts";

/**
 * A custom HTML element which allows for arbitrary assignment of a set of string tags.
 * This element may be used directly or subclassed to impose additional validation or functionality.
 */
declare class HTMLStringTagsElement extends AbstractFormInputElement<Set<string> | string[]> {
  constructor();

  static override tagName: "string-tags";

  static icons: {
    add: string;
    remove: string;
  };

  static labels: {
    add: string;
    remove: string;
    placeholder: string;
  };

  _value: Set<string>;

  /**
   * Initialize innerText or an initial value attribute of the element as a comma-separated list of currently assigned
   * string tags.
   */
  protected _initializeTags(): void;

  /**
   * Subclasses may impose more strict validation on what tags are allowed.
   * @param tag - A candidate tag
   * @throws An error if the candidate tag is not allowed
   */
  protected _validateTag(tag: string): void;

  protected override _buildElements(): (HTMLButtonElement | HTMLDivElement)[];

  protected override _refresh(): void;

  /**
   * Render the tagged string as an HTML element.
   * @param tag      - The raw tag value
   * @param label    - An optional tag label
   * @param editable - Is the tag editable?
   * @returns A rendered HTML element for the tag
   */
  static renderTag(tag: string, label?: string, editable?: boolean): HTMLDivElement;

  protected override _activateListeners(): void;

  protected override _getValue(): string[];

  protected override _setValue(value: string[] | Set<string>): void;

  protected override _toggleDisabled(disabled: boolean): void;

  /**
   * Create a HTMLStringTagsElement using provided configuration data.
   */
  static create(config: HTMLStringTagsElement.StringTagsInputConfig): HTMLStringTagsElement;
}

declare namespace HTMLStringTagsElement {
  interface StringTagsInputConfig extends FormInputConfig<Set<string> | string[]> {
    /** Automatically slugify provided strings? */
    slug: boolean;
  }
}

export default HTMLStringTagsElement;
