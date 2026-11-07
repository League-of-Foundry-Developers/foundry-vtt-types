import { expectTypeOf, test } from "vitest";
import type { MarkSpec, NodeSpec, Schema } from "prosemirror-model";
import { marks, nodes, schema } from "../../../../src/foundry/common/prosemirror/schema.mts";

test("foundry/common/prosemirror/schema", () => {
  expectTypeOf(nodes.doc.content).toBeString();
  expectTypeOf(nodes.text.group).toBeString();
  expectTypeOf(marks.link).toEqualTypeOf<MarkSpec>();
  expectTypeOf(nodes.selection_inline).toEqualTypeOf<NodeSpec>();
  expectTypeOf(schema).toEqualTypeOf<Schema<keyof typeof nodes, keyof typeof marks>>();
});
