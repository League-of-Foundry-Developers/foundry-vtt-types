import { expectTypeOf, test } from "vitest";
import ImageNode from "../../../../../src/foundry/common/prosemirror/schema/image-node.mts";
import type { Attrs, AttributeSpec, Node, NodeSpec } from "prosemirror-model";
import type SchemaDefinition from "../../../../../src/foundry/common/prosemirror/schema/schema-definition.d.mts";

declare const el: HTMLImageElement;

declare const node: Node;

test("foundry/common/prosemirror/schema/image-node", () => {
  new ImageNode();

  expectTypeOf(ImageNode.tag).toEqualTypeOf<"img[src]">();
  expectTypeOf(ImageNode.attrs).toEqualTypeOf<Record<string, AttributeSpec>>();
  expectTypeOf(ImageNode.getAttrs(el)).toEqualTypeOf<SchemaDefinition.GetAttrsReturn>();
  expectTypeOf(ImageNode.toDOM(node)).toEqualTypeOf<[string, Attrs]>();
  expectTypeOf(ImageNode.make()).toEqualTypeOf<NodeSpec>();
});
