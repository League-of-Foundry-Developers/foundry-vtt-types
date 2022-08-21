import type { Plugin } from "prosemirror-state";
import type { Schema, Slice } from "prosemirror-model";
import ProseMirrorPlugin from "./plugin.mjs";
import type { EditorView } from "prosemirror-view";

/**
 * A class responsible for handle drag-and-drop and pasting of image content. Ensuring no base64 data is injected
 * directly into the journal content and it is instead uploaded to the user's data directory.
 */
export default class ProseMirrorImagePlugin extends ProseMirrorPlugin {
  /** {@inheritdoc} */
  static build(schema: Schema, options?: Record<string, never>): Plugin;

  /**
   * Handle a drop onto the editor.
   * @param view  - The ProseMirror editor view.
   * @param event - The drop event.
   * @param slice - A slice of editor content.
   * @param moved - Whether the slice has been moved from a different part of the editor.
   */
  protected _onDrop(view: EditorView, event: DragEvent, slice: Slice, moved: boolean): void | true;

  /**
   * Handle a paste into the editor.
   * @param view  - The ProseMirror editor view.
   * @param event - The paste event.
   */
  protected _onPaste(view: EditorView, event: ClipboardEvent): void | true;

  /**
   * Upload any image files encountered in the drop.
   * @param view  - The ProseMirror editor view.
   * @param files - The files to upload.
   * @param pos   - The position in the document to insert at. If not provided, the current
   *                selection will be replaced instead.
   */
  protected _uploadImages(view: EditorView, files: FileList, pos?: number): Promise<void>;

  /**
   * Capture any base64-encoded images embedded in the rich text paste and upload them.
   * @param view - The ProseMirror editor view.
   * @param html - The HTML data as a string.
   */
  protected _replaceBase64Images(view: EditorView, html: string): Promise<void>;

  /**
   * Convert a base64 string into a File object.
   * @param data     - Base64 encoded data.
   * @param filename - The filename.
   * @param mimetype - The file's mimetype.
   */
  static base64ToFile(data: string, filename: string, mimetype: string): File;
}
