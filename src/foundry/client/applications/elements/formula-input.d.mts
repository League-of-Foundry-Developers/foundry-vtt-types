import type { InexactPartial } from "#utils";
import type { FormInputConfig } from "../forms/fields.d.mts";
import type FormulaEditor from "../apps/formula-editor.d.mts";
import type AbstractFormInputElement from "./form-element.d.mts";

/**
 * A form input element custom tailored to formula expressions.
 * @remarks Fires edit - An "edit" event when the formula editor has been requested. The event is cancelable; calling
 * `preventDefault()` on it prevents the {@linkcode FormulaEditor} from being spawned.
 *
 * @example Using the custom element in markup
 * ```html
 * <formula-input context="default">8 + @prof + @abilities.cha.mod</formula-input>
 * ```
 *
 * @example Creating the element programmatically
 * ```js
 * HTMLFormulaInputElement.create({ value: "8 + @prof + @abilities.cha.mod" });
 * ```
 *
 * @privateRemarks This element's value type has `| undefined` in it because it has no constructor implementation (where it might have set a
 * fallback), and {@linkcode HTMLFormulaInputElement.create | .create} only forwards `value` via `setAttribute`; `_value` is not populated
 * until {@linkcode HTMLFormulaInputElement._buildElements | #_buildElements} runs, so until the element is in the DOM its value will be
 * `undefined`. It has been exposed in case user subclasses want to improve this situation.
 */
declare class HTMLFormulaInputElement<
  FormInputValueType extends string | undefined = string | undefined,
> extends AbstractFormInputElement<FormInputValueType> {
  /**
   * @remarks This constructor is protected because additional work must be done after creation for this element to be valid in the DOM.
   * Use {@linkcode HTMLFormulaInputElement.create} instead.
   */
  protected constructor();

  /** @defaultValue `"formula-input"` */
  static override tagName: string;

  /**
   * A button to open the formula editor interface.
   * @remarks `undefined` only prior to entering the DOM.
   */
  button: HTMLButtonElement | undefined;

  /**
   * The formula input.
   * @remarks `undefined` only prior to entering the DOM.
   */
  input: HTMLInputElement | undefined;

  /**
   * A reference to the formula editor application instance spawned by this element.
   * @remarks `undefined` until the {@linkcode HTMLFormulaInputElement.button | #button} is clicked, and again once the spawned editor closes.
   */
  editor: FormulaEditor | undefined;

  /**
   * An identifier to distinguish contexts a formula might be in, which may control which auto-complete suggestions are
   * available, or other behavior. Context configuration is available in `CONFIG.formulaEditor`.
   */
  get context(): string | null;

  set context(value: string);

  protected override _activateListeners(): void;

  /**
   * @remarks Returns `[input: HTMLInputElement, button: HTMLButtonElement]` in {@linkcode HTMLFormulaInputElement}.
   */
  protected override _buildElements(): HTMLElement[];

  protected override _refresh(): void;

  protected override _toggleDisabled(disabled: boolean): void;

  /**
   * Create an {@linkcode HTMLFormulaInputElement} using provided configuration data.
   * @param config - The configuration.
   */
  static create(config: HTMLFormulaInputElement.Config): HTMLFormulaInputElement;

  #HTMLFormulaInputElement: true;
}

declare namespace HTMLFormulaInputElement {
  /** @internal */
  interface _Config {
    /**
     * The formula editor context.
     * @defaultValue `"default"`
     */
    context: string;
  }

  interface Config extends InexactPartial<_Config>, FormInputConfig<string> {}
}

export default HTMLFormulaInputElement;
