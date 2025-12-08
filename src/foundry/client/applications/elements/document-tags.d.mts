import type { InexactPartial, MaybeArray } from "#utils";
import type { FormInputConfig } from "../forms/fields.d.mts";
import type AbstractFormInputElement from "./form-element.d.mts";

/**
 * A custom HTMLElement used to render a set of associated Documents referenced by UUID.'
 *
 * @remarks When creating via markup, values can be set either as attribute or as the `innerText` of the element; see
 * {@linkcode HTMLDocumentTagsElement._initializeTags | #_initializeTags} for examples.
 *
 * @privateRemarks This value type needs to cover all the weird edge cases in this element:
 * - {@linkcode HTMLDocumentTagsElement._value | #_value} is a `Record<string, string>` from UUIDs to labels
 * - {@linkcode HTMLDocumentTagsElement._value | #_getValue} (and therefore the `value` getter) returns the `Object.keys()` of `_value`, so
 * `string[]`, *unless* the element's been configured with {@linkcode HTMLDocumentTagsElement.single | single: true}, in which case it
 * returns `string | null`
 * - {@linkcode HTMLDocumentTagsElement._setValue | #_setValue} (and therefor the `value` setter) will take single `string`s, but tries to
 * iterate over all other truthy values, so `| Iterable<string>`.
 */
declare class HTMLDocumentTagsElement extends AbstractFormInputElement<
  Record<string, string> | string | Iterable<string> | null
> {
  protected constructor(options: HTMLDocumentTagsElement.Options);

  /** @defaultValue `"document-tags"` */
  static override tagName: string;

  /**
   * @remarks This is initialized to `{}` both in the class body *and* every time a new value is set, i.e, the object reference changes,
   * not just the keys/values.
   */
  protected override _value: Record<string, string>;

  override get value(): MaybeArray<string> | null;

  override set value(value: string | Iterable<string>);

  /**
   * Restrict this element to documents of a particular type.
   */
  get type(): CONST.ALL_DOCUMENT_TYPES | null;

  set type(value);

  /**
   * Restrict to only allow referencing a single Document instead of an array of documents.
   */
  get single(): boolean;

  set single(value);

  /**
   * Allow a maximum number of documents to be tagged to the element.
   * @remarks Returns `Infinity` if `max` isn't set; Passing the setter `Infinity`,
   * a non-integer, or any negative number removes the attribute.
   */
  get max(): number;

  set max(value);

  /**
   * Initialize innerText or an initial value attribute of the element as a serialized JSON array.
   * @remarks In practice this will always be passed a value by the constructor, which is why
   * {@linkcode HTMLDocumentTagsElement.Config.value} is required, but when instantiated by the DOM
   * it'll receive `undefined`, and for all  non-array values it falls back to the `value` attribute,
   * or `this.innerText` if there isn't one.
   *
   * @example
   * Attribute
   * ```html
   * <document-tags value="UUID1,UUID2,UUID3"></document-tags>
   * ```
   *
   * @example
   * `innerText`
   * ```html
   * <document-tags>UUID1,UUID2,UUID3</document-tags>
   * ```
   */
  protected _initializeTags(values?: string[]): void;

  /**
   * @remarks Returns `[tags: HTMLDivElement, input: HTMLInputElement, button: HTMLButtonElement]` in {@linkcode HTMLDocumentTagsElement}.
   * @privateRemarks Return type left wide for ease of subclassing.
   */
  protected override _buildElements(): HTMLElement[];

  protected override _refresh(): void;

  /**
   * Create an HTML string fragment for a single document tag.
   * @param uuid     - The document UUID
   * @param name     - The document name
   * @param editable - Is the tag editable? (default: `true`)
   */
  static renderTag(uuid: string, name: string, editable?: boolean): HTMLDivElement;

  protected override _activateListeners(): void;

  /**
   * @remarks Returns `string[]`, unless the element has {@linkcode HTMLDocumentTagsElement.single | single: true},
   * in which case it's `string | null`.
   */
  protected override _getValue(): MaybeArray<string> | null;

  protected override _setValue(value: string | Iterable<string>): void;

  protected override _toggleDisabled(disabled: boolean): void;

  /**
   * Create a {@linkcode HTMLDocumentTagsElement} using provided configuration data.
   */
  static create(config: HTMLDocumentTagsElement.Config): HTMLDocumentTagsElement;

  /** @deprecated Removed without replacement (functionality folded into `##add`) in v13. This warning will be removed in v14. */
  _validateDocument(document: never): never;

  #HTMLDocumentTagsElement: true;
}

declare namespace HTMLDocumentTagsElement {
  interface Options {
    /**
     * An array of Document UUIDs to initialize the element with.
     *
     * @remarks Foundry marks this optional, but that's only valid if it's being instantiated via tags in the dom, and can have its initial
     * value set by attributes/innerText. This isn't super relevant with the protected constructor, though.
     *
     * @privateRemarks This is much narrower than either the {@link HTMLDocumentTagsElement | class}'s type param or
     * {@link HTMLDocumentTagsElement.Config.value | the config's `value` type}, because it gets passed directly to
     * {@linkcode HTMLDocumentTagsElement._initializeTags | HTMLDocumentTagsElement#_initializeTags}.
     */
    values: string[];
  }

  /** @internal */
  interface _Config {
    /**
     * A specific document type in {@linkcode CONST.ALL_DOCUMENT_TYPES}
     * @remarks If not passed, UUIDs of any document type are allowed.
     */
    type: CONST.ALL_DOCUMENT_TYPES;

    /**
     * Only allow referencing a single document. In this case the submitted form value will
     * be a single UUID string rather than an array
     */
    single: boolean;

    /**
     * Only allow attaching a maximum number of documents
     */
    max: number;
  }

  interface Config extends InexactPartial<_Config>, Omit<FormInputConfig, "value"> {
    /**
     * The current value of the form element.
     *
     * @remarks {@linkcode HTMLDocumentTagsElement.create} will accept these types for `value`; `Set`s get `Array.from`ed, and naked strings
     * get wrapped in `[]` before being passed to the constructor. Use `[]` to indicate no value; Avoid `""` as it will be treated as an
     * invalid UUID.
     *
     * @privateRemarks This is omitted and redefined as required/non-nullish because allowing an `undefined` here leads to a value of
     * `["undefined"]` on the element, which is not a valid UUID.
     */
    value: Set<string> | string[] | string;
  }

  /**
   * @deprecated This interface has been renamed for consistency with other elements.
   * Use {@linkcode HTMLDocumentTagsElement.Config} instead. This alias will be removed in v15.
   */
  type DocumentTagsInputConfig = Config;
}

export default HTMLDocumentTagsElement;
