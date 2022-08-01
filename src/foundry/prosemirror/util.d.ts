import type { Node, Schema } from 'prosemirror-model';

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
 * @param doc    - The ProseMirror document.
 * @param schema - The ProseMirror schema to use instead of the default one.
 * @returns
 */
export function serializeHTMLString(doc: Node, schema?: Schema): string;
