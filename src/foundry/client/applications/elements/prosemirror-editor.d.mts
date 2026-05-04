import type { InexactPartial } from "#utils";
import type { FormInputConfig } from "../forms/fields.d.mts";
import type AbstractFormInputElement from "./form-element.d.mts";
import type { Plugin } from "prosemirror-state";

/**
 * A custom HTML element responsible displaying a ProseMirror rich text editor.
 */
declare class HTMLProseMirrorElement extends AbstractFormInputElement<string> {
  /**
   * @remarks This constructor is protected because additional work must be done after creation for this element to be valid in the DOM.
   * Use {@linkcode HTMLProseMirrorElement.create} instead.
   */
  protected constructor(options?: HTMLProseMirrorElement.Options);

  /** @defaultValue `"prose-mirror"` */
  static override tagName: string;

  /** @defaultValue {@linkcode AbstractFormInputElement.observedAttributes | super.observedAttributes}`.concat("open")` */
  static override observedAttributes: string[];

  /**
   * Whether the editor is currently open. Always true for non-toggled editors.
   */
  get open(): boolean;

  set open(value);

  override attributeChangedCallback(attrName: string, oldValue: string | null, newValue: string | null): void;

  /**
   * Actions to take when the custom element is removed from the document.
   */
  override disconnectedCallback(): void;

  /**
   * @remarks Returns `[content: HTMLDivElement, button?: HTMLButtonElement]` in {@linkcode HTMLProseMirrorElement}.
   * @privateRemarks Return type left wide for ease of subclassing.
   */
  protected override _buildElements(): HTMLElement[];

  protected override _refresh(): void;

  protected override _activateListeners(): void;

  protected override _getValue(): string;

  /**
   * Configure ProseMirror editor plugins.
   */
  protected _configurePlugins(): Record<string, Plugin>;

  protected override _toggleDisabled(disabled: boolean): void;

  /**
   * Determine if the editor has unsaved changes.
   */
  isDirty(): boolean;

  /**
   * Create a {@linkcode HTMLProseMirrorElement} using provided configuration data.
   */
  static create(config: HTMLProseMirrorElement.Config): HTMLProseMirrorElement;

  #HTMLProseMirrorElement: true;
}

declare namespace HTMLProseMirrorElement {
  /** @internal */
  interface _Options {
    /**
     * Whether the editor's active state is toggled or always active.
     * @defaultValue `this.hasAttribute("toggled")`
     */
    toggled: boolean;

    /**
     * If the editor is toggled, provide enriched HTML which is displayed while the editor is not active.
     * @defaultValue `this.innerHTML`
     */
    enriched: string;

    /**
     * The raw value to edit.
     * @defaultValue `""`
     */
    value: string;
  }

  interface Options extends InexactPartial<_Options> {}

  /**
   * `enriched` has the same description and default as in Options
   * @internal
   */
  interface _Config extends Pick<_Options, "enriched"> {
    /**
     * Is this editor toggled (true) or always active (false)
     * @defaultValue `false`
     */
    toggled: boolean;

    /**
     * Does this editor instance support collaborative editing?
     * @defaultValue `false`
     */
    collaborate: boolean;

    /**
     * Should the editor be presented in compact mode?
     * @defaultValue `false`
     */
    compact: boolean;

    /**
     * A Document UUID. Required for collaborative editing
     * @remarks Gets put into the element's dataset as both `documentUuid` and `documentUUID` (`data-document-uuid` and
     * `data-document-u-u-i-d` respectively in markup). One of those is probably deprecated,
     */
    documentUUID: string;

    /** The height of the editor in pixels */
    height: number;
  }

  interface Config extends InexactPartial<_Config>, FormInputConfig<string> {}

  /**
   * @deprecated This interface has been renamed for consistency with other elements.
   * Use {@linkcode HTMLProseMirrorElement.Config} instead. This alias will be removed in v15.
   */
  type ProseMirrorInputConfig = Config;
}

// ProseMirrorPluginEvent is never exported or otherwise available publicly, so it has not been typed.

export default HTMLProseMirrorElement;
