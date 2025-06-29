import { expectTypeOf } from "vitest";
import SchemaDefinition from "#common/prosemirror/schema/schema-definition.mjs";
import type { AttributeSpec, Node, MarkSpec, NodeSpec } from "prosemirror-model";

expectTypeOf(SchemaDefinition.tag).toEqualTypeOf<string>();
expectTypeOf(SchemaDefinition.attrs).toEqualTypeOf<Record<string, AttributeSpec>>();

declare const el: HTMLElement;
expectTypeOf(SchemaDefinition.getAttrs(el)).toEqualTypeOf<SchemaDefinition.GetAttrsReturn>();

declare const node: Node;
expectTypeOf(SchemaDefinition.toDOM(node)).toEqualTypeOf<SchemaDefinition.DOMOutputSpecTuple>();
expectTypeOf(SchemaDefinition.make()).toEqualTypeOf<NodeSpec | MarkSpec>();
