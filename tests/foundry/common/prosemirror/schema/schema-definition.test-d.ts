/* eslint-disable import/extensions */
import { expectTypeOf } from "vitest";
import SchemaDefinition from "../../../../../src/foundry/common/prosemirror/schema/schema-definition.mjs";
import type { MarkSpec, Node, NodeSpec } from "prosemirror-model";

expectTypeOf(SchemaDefinition.tag).toEqualTypeOf<string>();
expectTypeOf(SchemaDefinition.attrs).toEqualTypeOf<Record<string, unknown>>();

declare const el: HTMLElement;
expectTypeOf(SchemaDefinition.getAttrs(el)).toEqualTypeOf<Record<string, unknown> | boolean>();

declare const node: Node;
expectTypeOf(SchemaDefinition.toDOM(node)).toEqualTypeOf<unknown[]>();
expectTypeOf(SchemaDefinition.make()).toEqualTypeOf<NodeSpec | MarkSpec>();
