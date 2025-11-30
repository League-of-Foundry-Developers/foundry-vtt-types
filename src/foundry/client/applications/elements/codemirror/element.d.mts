import type AbstractFormInputElement from "../form-element.d.mts";
import type { InexactPartial } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { FormInputConfig } from "#client/applications/forms/fields.mjs";

/**
 * A custom HTML element responsible for displaying a CodeMirror rich text editor.
 */
declare class HTMLCodeMirrorElement extends AbstractFormInputElement<string> {
  constructor(options?: HTMLCodeMirrorElement.Options);

  /** @defaultValue `"code-mirror"` */
  static override tagName: string;

  /** @defaultValue `["disabled", "language", "indent", "nowrap"]` */
  static override observedAttributes: string[];

  /** @privateRemarks Fake type override. See {@linkcode HTMLCodeMirrorElement._getValue | HTMLCodeMirrorElement#_getValue}'s remarks. */
  protected override _value: string;

  /** @privateRemarks Fake type override. See {@linkcode HTMLCodeMirrorElement._getValue | HTMLCodeMirrorElement#_getValue}'s remarks. */
  override get value(): string;

  /**
   * The position of the cursor.
   * @remarks Only `null` when not in the DOM
   */
  get cursor(): number | null;

  /**
   * This element's language attribute or its default if no value is set
   * @defaultValue `""`
   */
  get language(): HTMLCodeMirrorElement.Language;

  set language(value);

  /**
   * This element's indent attribute, which determines the number of spaces added upon pressing the TAB key.
   * A value of 0 disables this feature entirely.
   * @defaultValue `2`
   * @remarks Non-number attribute values in HTML are replaced with `0`.
   */
  get indent(): number;

  set indent(value);

  /**
   * Whether the editor is externally managed by some other process that takes responsibility for its contents and for
   * firing events. If not set, the editor will fire its own events.
   */
  get managed(): boolean;

  set managed(value);

  /**
   * The element's nowrap attribute, which if present disables line-wrapping
   */
  get nowrap(): boolean;

  protected override _toggleDisabled(disabled: boolean): void;

  /**
   * @remarks No `| undefined` here as {@linkcode _value} gets set to {@linkcode HTMLElement.innerText | this.innerText}
   *  during construction, which appears to always be at least an empty string, even if not in the DOM.
   */
  protected override _getValue(): string;

  protected override _setValue(value: string): void;

  /**
   * Given screen co-ordinates, returns the position in the editor's text content at those co-ordinates.
   * @param coords - The screen co-ordinates.
   */
  posAtCoords(coords: Canvas.Point): number;

  /**
   * @remarks This override only cares about `y`, or {@linkcode ScrollToOptions.top | x?.top} in the `options` overload case.
   */
  override scrollTo(x: number, y: number): void;
  override scrollTo(options?: ScrollToOptions): void;

  override connectedCallback(): void;

  protected override _buildElements(): HTMLElement[];

  override attributeChangedCallback(attrName: string, oldValue: string | null, newValue: string | null): void;

  override disconnectedCallback(): void;

  /**
   * @remarks `config` lacks a parameter default, but has no required properties per our types.
   * Foundry types {@linkcode FormInputConfig.name} as required, but the element construction
   * works without one, as useless as that is generally.
   */
  static create(config: HTMLCodeMirrorElement.Config): HTMLCodeMirrorElement;

  #HTMLCodeMirrorElement: true;
}

declare namespace HTMLCodeMirrorElement {
  /** @internal */
  interface _Options {
    /** The initial editor contents. */
    value: string;
  }

  interface Options extends InexactPartial<_Options> {}

  type Language = "javascript" | "json" | "html" | "markdown" | "" | "plain";

  /** @internal */
  interface _Config {
    /**
     * The value's language
     * @defaultValue `""`
     */
    language: Language;

    /**
     * The number of spaces per level of indentation
     * @defaultValue `2`
     */
    indent: number;
  }

  /**
   * @remarks {@linkcode HTMLCodeMirrorElement.create} only makes use of only the `value` and `name` properties of `FormInputConfig`, plus
   * what {@linkcode foundry.applications.fields.setInputAttributes | setInputAttributes} uses.
   */
  interface Config extends FormInputConfig<string>, InexactPartial<_Config> {}
}

export default HTMLCodeMirrorElement;
