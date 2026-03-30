import { expectTypeOf } from "vitest";
import ImageNode from "../../../../../src/foundry/common/prosemirror/schema/image-node.mts";
import type { Attrs, AttributeSpec, Node, NodeSpec } from "prosemirror-model";
import type SchemaDefinition from "../../../../../src/foundry/common/prosemirror/schema/schema-definition.d.mts";

new ImageNode();

expectTypeOf(ImageNode.tag).toEqualTypeOf<"img[src]">();
expectTypeOf(ImageNode.attrs).toEqualTypeOf<Record<string, AttributeSpec>>();

declare const el: HTMLImageElement;
expectTypeOf(ImageNode.getAttrs(el)).toEqualTypeOf<SchemaDefinition.GetAttrsReturn>();

declare const node: Node;
expectTypeOf(ImageNode.toDOM(node)).toEqualTypeOf<[string, Attrs]>();
expectTypeOf(ImageNode.make()).toEqualTypeOf<NodeSpec>();
