import type { EditorView } from "codemirror";

/** A CodeMirror EditorView that doesn't mount styles */
// @ts-expect-error EditorViewFVTT is not ever publicly exposed; it's only used in the hard-private `#view` property on HTMLCodeMirrorElement
// The error comes from `mountStyles` being marked private in EditorView, but since it's not hard private Foundry is nevertheless able to override
export default class EditorViewFVTT extends EditorView {
  override mountStyles(): void;
}
