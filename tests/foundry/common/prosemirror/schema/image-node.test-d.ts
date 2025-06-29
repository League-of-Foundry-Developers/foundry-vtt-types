import { expectTypeOf } from "vitest";
import ImageNode from "#common/prosemirror/schema/image-node.mjs";
import type { Attrs, AttributeSpec, Node, NodeSpec } from "prosemirror-model";
import type SchemaDefinition from "#common/prosemirror/schema/schema-definition.mjs";

new ImageNode();

expectTypeOf(ImageNode.tag).toEqualTypeOf<"img[src]">();
expectTypeOf(ImageNode.attrs).toEqualTypeOf<Record<string, AttributeSpec>>();

declare const el: HTMLImageElement;
expectTypeOf(ImageNode.getAttrs(el)).toEqualTypeOf<SchemaDefinition.GetAttrsReturn>();

declare const node: Node;
expectTypeOf(ImageNode.toDOM(node)).toEqualTypeOf<[string, Attrs]>();
expectTypeOf(ImageNode.make()).toEqualTypeOf<NodeSpec>();
