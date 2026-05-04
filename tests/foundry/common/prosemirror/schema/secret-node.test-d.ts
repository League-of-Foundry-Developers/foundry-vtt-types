import { expectTypeOf } from "vitest";
import SecretNode from "../../../../../src/foundry/common/prosemirror/schema/secret-node.mts";
import SchemaDefinition from "../../../../../src/foundry/common/prosemirror/schema/schema-definition.mts";
import type { Attrs, AttributeSpec, Node, NodeSpec } from "prosemirror-model";
import type { Transaction } from "prosemirror-state";

import EditorState = foundry.prosemirror.EditorState;

expectTypeOf(SecretNode.tag).toEqualTypeOf<"section">();
expectTypeOf(SecretNode.attrs).toEqualTypeOf<Record<string, AttributeSpec>>();

declare const el: HTMLElement;
expectTypeOf(SecretNode.getAttrs(el)).toEqualTypeOf<SchemaDefinition.GetAttrsReturn>();

declare const node: Node;
expectTypeOf(SecretNode.toDOM(node)).toEqualTypeOf<[string, Attrs, number]>();
expectTypeOf(SecretNode.make()).toEqualTypeOf<NodeSpec>();

declare const state: EditorState;
declare const dispatch: (tr: Transaction) => void;
expectTypeOf(SecretNode.split(state, dispatch)).toEqualTypeOf<boolean>();
