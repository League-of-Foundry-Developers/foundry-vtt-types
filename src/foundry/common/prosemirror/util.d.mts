import type { Node, Schema, Slice } from "prosemirror-model";
import type { StringNode } from "./string-serializer.d.mts";
import type { InexactPartial } from "#utils";

/**
 * Use the DOM and ProseMirror's DOMParser to construct a ProseMirror document state from an HTML string. This cannot be
 * used server-side.
 * @param htmlString - A string of HTML.
 * @param schema     - The ProseMirror schema to use instead of the default one.
 * @returns The document node.
 * @remarks Uses {@linkcode foundry.prosemirror.defaultSchema} if none is provided
 */
export declare function parseHTMLString(htmlString: string, schema?: Schema): Node;

/**
 * Use the StringSerializer to convert a ProseMirror document into an HTML string. This can be used server-side.
 * @param doc     - The ProseMirror document.
 * @param options - Additional options to configure serialization behavior.
 */
declare function serializeHTMLString(doc: Node, options?: serializeHTMLString.Options): string;

declare namespace serializeHTMLString {
  /**
   * Hack to make the link in Options["spaces"] work
   * @internal
   */
  type _StringNode = StringNode;

  /** @internal */
  type _Options = InexactPartial<{
    /**
     * The ProseMirror schema to use instead of the default one.
     * @defaultValue {@linkcode foundry.prosemirror.defaultSchema}
     */
    schema: Schema;

    /**
     * The number of spaces to use for indentation. See {@link _StringNode.toString | `StringNode#toString`} for details.
     * @defaultValue `0`
     */
    spaces: string | number;
  }>;

  interface Options extends _Options {}
}

/**
 * Apply a transformation to some nodes in a slice, and return the new slice.
 * @param slice       - The slice to transform.
 * @param transformer - The transformation function.
 * @returns Either the original slice if no changes were made, or the newly-transformed slice.
 */
declare function transformSlice(slice: Slice, transformer: transformSlice.SliceTransformer): Slice;

declare namespace transformSlice {
  /**
   * @param node - The candidate node.
   * @returns A new node to replace the candidate node, or nothing if a replacement should not be made.
   */
  type SliceTransformer = (node: Node) => Node | void;
}

export { serializeHTMLString, transformSlice };
