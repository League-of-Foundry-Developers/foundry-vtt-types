/* eslint-disable import/extensions */
import { expectTypeOf } from "vitest";
import SecretNode from "../../../../../src/foundry/common/prosemirror/schema/secret-node.mjs";
import type { MarkSpec, Node, NodeSpec } from "prosemirror-model";
import type { EditorState } from "../../../../../src/foundry/common/prosemirror/_module.d.mts";
import type { Transaction } from "prosemirror-state";

expectTypeOf(SecretNode.tag).toEqualTypeOf<"section">();
expectTypeOf(SecretNode.attrs).toEqualTypeOf<Record<string, unknown>>();

declare const el: HTMLElement;
expectTypeOf(SecretNode.getAttrs(el)).toEqualTypeOf<Record<string, unknown> | boolean>();

declare const node: Node;
expectTypeOf(SecretNode.toDOM(node)).toEqualTypeOf<[string, Record<string, unknown>, number]>();
expectTypeOf(SecretNode.make()).toEqualTypeOf<NodeSpec | MarkSpec>();

declare const state: EditorState;
declare const dispatch: (tr: Transaction) => void;
expectTypeOf(SecretNode.split(state, dispatch)).toEqualTypeOf<boolean>();
