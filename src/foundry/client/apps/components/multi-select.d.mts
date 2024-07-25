export {};

declare global {
  /**
   * An abstract base class designed to standardize the behavior for a multi-select UI component.
   * Multi-select components return an array of values as part of form submission.
   * Different implementations may provide different experiences around how inputs are presented to the user.
   * @internal
   */
  abstract class AbstractMultiSelectElement extends HTMLElement {
    /**
     * The "change" event is emitted when the values of the multi-select element are changed.
     * @param event     - A "change" event passed to event listeners.
     */
    static onChange: (event: Event) => void;

    /**
     * Predefined <option> and <optgroup> elements which were defined in the original HTML.
     */
    protected _options: (HTMLOptionElement | HTMLOptGroupElement)[];

    /**
     * An object which maps option values to displayed labels.
     * @defaultValue `{}`
     */
    protected _choices: Record<string, string>;

    /**
     * An array of identifiers which have been chosen.
     * @defaultValue `new Set()`
     */
    protected _chosen: Set<string>;

    /**
     * The form this custom element belongs to, if any.
     * @defaultValue `null`
     */
    form: HTMLFormElement | null;

    /**
     * Preserve existing <option> and <optgroup> elements which are defined in the original HTML.
     */
    protected _initializeOptions(): void;

    /**
     * The name of the multi-select input element.
     */
    get name(): string;
    set name(value: string);

    /**
     * The values of the multi-select input are expressed as an array of strings.
     */
    get value(): string[];
    set value(values: string[]);

    /**
     * Activate the custom element when it is attached to the DOM.
     */
    connectedCallback(): void;

    /**
     * Deactivate the custom element when it is detached from the DOM.
     */
    disconnectedCallback(): void;

    /**
     * Mark a choice as selected.
     * @param  value      - The value to add to the chosen set
     */
    select(value: string): void;

    /**
     * Mark a choice as un-selected.
     * @param  value      - The value to delete from the chosen set
     */
    unselect(value: string): void;

    /**
     * Create the HTML elements that should be included in this custom element.
     * Elements are returned as an array of ordered children.
     */
    protected _buildElements(): HTMLElement[];

    /**
     * Refresh the active state of the custom element by reflecting changes to the _chosen set.
     */
    protected _refresh(): void;

    /**
     * Activate event listeners which add dynamic behavior to the custom element.
     */
    protected _activateListeners(): void;
  }

  /**
   * Provide a multi-select workflow using a select element as the input mechanism.
   * @internal
   *
   * @example Multi-Select HTML Markup
   * ```html
   * <multi-select name="select-many-things">
   *   <optgroup label="Basic Options">
   *     <option value="foo">Foo</option>
   *     <option value="bar">Bar</option>
   *     <option value="baz">Baz</option>
   *   </optgroup>
   *   <optgroup label="Advanced Options">
   *    <option value="fizz">Fizz</option>
   *     <option value="buzz">Buzz</option>
   *   </optgroup>
   * </multi-select>
   * ```
   */
  class HTMLMultiSelectElement extends AbstractMultiSelectElement {
    protected override _buildElements(): HTMLElement[];

    protected override _refresh(): void;

    protected override _activateListeners(): void;
  }

  /**
   * Provide a multi-select workflow as a grid of input checkbox elements.
   * @internal
   *
   * @example Multi-Checkbox HTML Markup
   * ```html
   * <multi-checkbox name="check-many-boxes">
   *   <optgroup label="Basic Options">
   *     <option value="foo">Foo</option>
   *     <option value="bar">Bar</option>
   *     <option value="baz">Baz</option>
   *   </optgroup>
   *   <optgroup label="Advanced Options">
   *    <option value="fizz">Fizz</option>
   *     <option value="buzz">Buzz</option>
   *   </optgroup>
   * </multi-checkbox>
   * ```
   */
  class HTMLMultiCheckboxElement extends AbstractMultiSelectElement {
    protected override _buildElements(): HTMLElement[];

    protected override _refresh(): void;

    protected override _activateListeners(): void;
  }
}
