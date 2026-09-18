import { expectTypeOf, test } from "vitest";
import SecretNode from "../../../../../src/foundry/common/prosemirror/schema/secret-node.mts";
import SchemaDefinition from "../../../../../src/foundry/common/prosemirror/schema/schema-definition.mts";
import type { Attrs, AttributeSpec, Node, NodeSpec } from "prosemirror-model";
import type { Transaction } from "prosemirror-state";

import EditorState = foundry.prosemirror.EditorState;

declare const el: HTMLElement;

declare const node: Node;

declare const state: EditorState;
declare const dispatch: (tr: Transaction) => void;

test("foundry/common/prosemirror/schema/secret-node", () => {
  expectTypeOf(SecretNode.tag).toEqualTypeOf<"section">();
  expectTypeOf(SecretNode.attrs).toEqualTypeOf<Record<string, AttributeSpec>>();
  expectTypeOf(SecretNode.getAttrs(el)).toEqualTypeOf<SchemaDefinition.GetAttrsReturn>();
  expectTypeOf(SecretNode.toDOM(node)).toEqualTypeOf<[string, Attrs, number]>();
  expectTypeOf(SecretNode.make()).toEqualTypeOf<NodeSpec>();
  expectTypeOf(SecretNode.split(state, dispatch)).toEqualTypeOf<boolean>();
});
