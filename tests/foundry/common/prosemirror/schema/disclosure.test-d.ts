import { expectTypeOf } from "vitest";
import type { NodeSpec } from "prosemirror-model";
import DisclosureWidget from "../../../../../src/foundry/common/prosemirror/schema/disclosure.mts";

expectTypeOf(DisclosureWidget.nodes).toEqualTypeOf<DisclosureWidget.Nodes>();
expectTypeOf(DisclosureWidget.nodes.details).toEqualTypeOf<NodeSpec>();
