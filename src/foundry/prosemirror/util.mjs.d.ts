import type { Node, Schema } from "prosemirror-model";
// Fixes VSC not finding it for the @link TSDoc directive.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { StringNode } from "./string-serializer.mjs";

/**
 * Use the DOM and ProseMirror's DOMParser to construct a ProseMirror document state from an HTML string. This cannot be
 * used server-side.
 * @param htmlString - A string of HTML.
 * @param schema     - The ProseMirror schema to use instead of the default one.
 * @returns The document node.
 */
export function parseHTMLString(htmlString: string, schema?: Schema): Node;

/**
 * Use the StringSerializer to convert a ProseMirror document into an HTML string. This can be used server-side.
 * @param doc     - The ProseMirror document.
 * @param options - Additional options to configure serialization behavior.
 * @returns
 */
export function serializeHTMLString(
  doc: Node,
  options?: {
    /** The ProseMirror schema to use instead of the default one. */
    schema?: Schema;
    /** The number of spaces to use for indentation. See {@link StringNode#toString} for details. */
    spaces?: string | number;
  }
): string;
