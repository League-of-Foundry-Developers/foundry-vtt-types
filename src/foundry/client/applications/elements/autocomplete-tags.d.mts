import type { MultiSelectInputConfig } from "../forms/fields.d.mts";
import type { AbstractMultiSelectElement } from "./multi-select.d.mts";

/**
 * Provide a multi-select workflow as a text input which offers autocompletion over the available options. Chosen
 * options are displayed as a list of tags which may be individually removed.
 *
 * @example
 * Autocomplete Tags HTML Markup
 * ```html
 * <autocomplete-tags name="select-many-things">
 *   <option value="foo">Foo</option>
 *   <option value="bar">Bar</option>
 *   <option value="baz">Baz</option>
 * </autocomplete-tags>
 * ```
 */
declare class HTMLAutocompleteTagsElement extends AbstractMultiSelectElement {
  /**
   * @remarks This constructor is protected because additional work must be done after creation for this element to be valid in the DOM.
   * Use {@linkcode HTMLAutocompleteTagsElement.create} or {@linkcode foundry.applications.fields.createMultiSelectInput}
   * with `type: "autocomplete"` in the config instead.
   */
  protected constructor();

  /** @defaultValue `"autocomplete-tags"` */
  static override tagName: string;

  protected override _activateListeners(): void;

  /**
   * @remarks Returns `[tags: HTMLDivElement, input: HTMLInputElement]` in {@linkcode HTMLAutocompleteTagsElement}
   * @privateRemarks Return type left wide for ease of subclassing
   */
  protected override _buildElements(): HTMLElement[];

  protected override _disconnect(): void;

  protected override _initialize(): void;

  protected override _refresh(): void;

  protected override _toggleDisabled(disabled: boolean): void;

  /**
   * Create a HTMLAutocompleteTagsElement using provided configuration data.
   * @remarks Just forwards to {@linkcode foundry.applications.fields.createMultiSelectInput}, overriding
   * {@linkcode MultiSelectInputConfig.type | config.type} with `"autocomplete"`, hence its omission here.
   */
  static create(config: HTMLAutocompleteTagsElement.Config): HTMLAutocompleteTagsElement;

  #HTMLAutocompleteTagsElement: true;
  static #HTMLAutocompleteTagsElementStatic: true;
}

declare namespace HTMLAutocompleteTagsElement {
  /**
   * @remarks {@linkcode MultiSelectInputConfig.type | type} is omitted because
   * {@linkcode HTMLAutocompleteTagsElement.create} sets it itself.
   */
  interface Config extends Omit<MultiSelectInputConfig, "type"> {}
}

export default HTMLAutocompleteTagsElement;
