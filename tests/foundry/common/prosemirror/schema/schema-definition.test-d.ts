import { expectTypeOf, test } from "vitest";
import SchemaDefinition from "../../../../../src/foundry/common/prosemirror/schema/schema-definition.mts";
import type { AttributeSpec, Node, MarkSpec, NodeSpec } from "prosemirror-model";

declare const el: HTMLElement;

declare const node: Node;

test("foundry/common/prosemirror/schema/schema-definition", () => {
  expectTypeOf(SchemaDefinition.tag).toEqualTypeOf<string>();
  expectTypeOf(SchemaDefinition.attrs).toEqualTypeOf<Record<string, AttributeSpec>>();
  expectTypeOf(SchemaDefinition.getAttrs(el)).toEqualTypeOf<SchemaDefinition.GetAttrsReturn>();
  expectTypeOf(SchemaDefinition.toDOM(node)).toEqualTypeOf<SchemaDefinition.DOMOutputSpecUnion>();
  expectTypeOf(SchemaDefinition.make()).toEqualTypeOf<NodeSpec | MarkSpec>();
});
