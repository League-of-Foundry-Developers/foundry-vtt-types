import { MarkSpec, Node, NodeSpec } from "prosemirror-model";
import type SchemaDefinition from "./schema-definition.d.mts";
import { EditorState, Transaction } from "prosemirror-state";

export default SecretNode;

/**
 * A class responsible for encapsulating logic around secret nodes in the ProseMirror schema.
 */
declare class SecretNode extends SchemaDefinition {
  static override tag: "section";

  static override get attrs(): Record<string, unknown>;

  static override getAttrs(el: HTMLElement): boolean | Record<string, unknown>;

  static override toDOM(node: Node): [string, Record<string, unknown>, number];

  static override make(): NodeSpec | MarkSpec;

  /**
   * Handle slitting a secret block in two, making sure the new block gets a unique ID.
   * @param state    - The ProseMirror editor state.
   * @param dispatch - The editor dispatch function.
   */
  static split(state: EditorState, dispatch: (tr: Transaction) => void): boolean;
}
