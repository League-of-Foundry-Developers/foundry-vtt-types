import type { Node, NodeSpec, AttributeSpec, Attrs } from "prosemirror-model";
import type { EditorState, Transaction } from "prosemirror-state";
import type SchemaDefinition from "./schema-definition.d.mts";

/**
 * A class responsible for encapsulating logic around secret nodes in the ProseMirror schema.
 */
declare class SecretNode extends SchemaDefinition {
  static override tag: "section";

  static override get attrs(): Record<string, AttributeSpec>;

  static override getAttrs(el: HTMLElement): SchemaDefinition.GetAttrsReturn;

  static override toDOM(node: Node): [string, Attrs, number];

  static override make(): NodeSpec;

  /**
   * Handle slitting a secret block in two, making sure the new block gets a unique ID.
   * @param state    - The ProseMirror editor state.
   * @param dispatch - The editor dispatch function.
   */
  static split(state: EditorState, dispatch: (tr: Transaction) => void): boolean;
}

export default SecretNode;
