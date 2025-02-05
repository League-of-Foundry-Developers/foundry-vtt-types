/**
 * @remarks Class imported from codemirror, TODO: Remove when codemirror added to dependencies
 */
declare class EditorView {
  mountStyles(): void;
}

/** A CodeMirror EditorView that doesn't mount styles */
export default class EditorViewFVTT extends EditorView {
  override mountStyles(): void;
}
