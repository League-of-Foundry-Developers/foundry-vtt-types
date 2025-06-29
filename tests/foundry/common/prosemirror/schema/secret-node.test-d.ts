import { expectTypeOf } from "vitest";
import SecretNode from "#common/prosemirror/schema/secret-node.mjs";
import SchemaDefinition from "#common/prosemirror/schema/schema-definition.mjs";
import type { Attrs, AttributeSpec, Node, NodeSpec } from "prosemirror-model";
import type { EditorState } from "#common/prosemirror/_module.d.mts";
import type { Transaction } from "prosemirror-state";

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
