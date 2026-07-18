import type { InexactPartial } from "#utils";
import type { FormInputConfig } from "../forms/fields.d.mts";
import type FormulaEditor from "../apps/formula-editor.d.mts";
import type AbstractFormInputElement from "./form-element.d.mts";

/**
 * A form input element custom tailored to formula expressions.
 * @remarks Fires edit - An "edit" event when the formula editor has been requested.
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
 */
declare class HTMLFormulaInputElement extends AbstractFormInputElement<string> {
  /** @defaultValue `"formula-input"` */
  static override tagName: string;

  /**
   * A button to open the formula editor interface.
   */
  button: HTMLButtonElement;

  /**
   * The formula input.
   */
  input: HTMLInputElement;

  /**
   * A reference to the formula editor application instance spawned by this element.
   */
  editor: FormulaEditor | undefined;

  /**
   * An identifier to distinguish contexts a formula might be in, which may control which auto-complete suggestions
   * are available, or other behavior. Context configuration is available in `CONFIG.formulaEditor`.
   */
  get context(): string | null;

  set context(value: string);

  protected override _activateListeners(): void;

  protected override _buildElements(): HTMLElement[];

  protected override _refresh(): void;

  protected override _toggleDisabled(disabled: boolean): void;

  /**
   * Create an HTMLFormulaInputElement using provided configuration data.
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

  interface Config extends FormInputConfig<string>, InexactPartial<_Config> {}
}

export default HTMLFormulaInputElement;
