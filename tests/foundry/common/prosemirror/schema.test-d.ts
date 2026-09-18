import { expectTypeOf, test } from "vitest";
import type { MarkSpec, Schema } from "prosemirror-model";
import { marks, nodes, schema } from "../../../../src/foundry/common/prosemirror/schema.mts";

test("foundry/common/prosemirror/schema", () => {
  expectTypeOf(nodes.doc.content).toBeString();
  expectTypeOf(nodes.text.group).toBeString();
  expectTypeOf(marks.link).toEqualTypeOf<MarkSpec>();
  expectTypeOf(schema).toEqualTypeOf<Schema<keyof typeof nodes, keyof typeof marks>>();
});
