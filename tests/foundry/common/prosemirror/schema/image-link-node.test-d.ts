import { expectTypeOf, test } from "vitest";
import type { AttributeSpec, Node, NodeSpec } from "prosemirror-model";
import type { EditorView } from "prosemirror-view";
import type SchemaDefinition from "../../../../../src/foundry/common/prosemirror/schema/schema-definition.d.mts";

import ImageLinkNode from "../../../../../src/foundry/common/prosemirror/schema/image-link-node.mjs";

declare const el: HTMLLinkElement;

declare const node: Node;

declare const view: EditorView;
declare const event: PointerEvent;

test("foundry/common/prosemirror/schema/image-link-node", () => {
  new ImageLinkNode();

  expectTypeOf(ImageLinkNode.tag).toEqualTypeOf<"a">();
  expectTypeOf(ImageLinkNode.attrs).toEqualTypeOf<Record<string, AttributeSpec>>();
  expectTypeOf(ImageLinkNode.getAttrs(el)).toEqualTypeOf<SchemaDefinition.GetAttrsReturn>();
  expectTypeOf(ImageLinkNode.toDOM(node)).toEqualTypeOf<ImageLinkNode.ToDOMReturn>();
  expectTypeOf(ImageLinkNode.make()).toEqualTypeOf<NodeSpec>();
  expectTypeOf(ImageLinkNode.onClick(view, 3, event, node)).toEqualTypeOf<boolean | void>();
});
