import type ProseMirrorPlugin from "../../../common/prosemirror/plugin.d.mts";
import type { FormInputConfig } from "../forms/fields.d.mts";
import type AbstractFormInputElement from "./form-element.d.mts";

/**
 * A custom HTML element responsible displaying a ProseMirror rich text editor.
 */
declare class HTMLProseMirrorElement extends AbstractFormInputElement<string> {
  constructor();

  static override tagName: "prose-mirror";

  /**
   * Actions to take when the custom element is removed from the document.
   */
  disconnectedCallback(): void;

  override _buildElements(): (HTMLButtonElement | HTMLDivElement)[];

  override _getValue(): string;
  /**
   * Configure ProseMirror editor plugins.
   */
  protected _configurePlugins(): Record<string, ProseMirrorPlugin>;

  override _toggleDisabled(disabled: boolean): void;

  /**
   * Create a HTMLProseMirrorElement using provided configuration data.
   */
  static create(config: HTMLProseMirrorElement.ProseMirrorInputConfig): HTMLProseMirrorElement;
}

declare namespace HTMLProseMirrorElement {
  interface ProseMirrorInputConfig extends FormInputConfig<string> {
    /** Is this editor toggled (true) or always active (false) */
    toggled: boolean;

    /** If the editor is toggled, provide the enrichedHTML which is displayed while the editor is not active. */
    enriched: string;

    /** Does this editor instance support collaborative editing? */
    collaborate: boolean;

    /** Should the editor be presented in compact mode? */
    compact: boolean;

    /** A Document UUID. Required for collaborative editing */
    documentUUID: string;
  }
}

export default HTMLProseMirrorElement;
