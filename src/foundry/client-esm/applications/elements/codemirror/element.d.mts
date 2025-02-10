import type AbstractFormInputElement from "../form-element.d.mts";

declare namespace HTMLCodeMirrorElement {
  interface Options {
    /** The initial editor contents. */
    value?: string;
  }
}

/**
 * A custom HTML element responsible for displaying a CodeMirror rich text editor.
 * @remarks TODO: Stub
 */
declare class HTMLCodeMirrorElement extends AbstractFormInputElement<string> {}

export default HTMLCodeMirrorElement;
