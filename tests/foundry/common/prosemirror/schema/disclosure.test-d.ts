import { expectTypeOf, test } from "vitest";
import type { NodeSpec } from "prosemirror-model";
import DisclosureWidget from "../../../../../src/foundry/common/prosemirror/schema/disclosure.mts";

test("foundry/common/prosemirror/schema/disclosure", () => {
  expectTypeOf(DisclosureWidget.nodes).toEqualTypeOf<DisclosureWidget.Nodes>();
  expectTypeOf(DisclosureWidget.nodes.details).toEqualTypeOf<NodeSpec>();
});
