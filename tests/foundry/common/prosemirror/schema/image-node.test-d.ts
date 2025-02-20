/* eslint-disable import-x/extensions */
import { expectTypeOf } from "vitest";
import ImageNode from "../../../../../src/foundry/common/prosemirror/schema/image-node.mjs";
import type { MarkSpec, Node, NodeSpec } from "prosemirror-model";

new ImageNode();

expectTypeOf(ImageNode.tag).toEqualTypeOf<"img[src]">();
expectTypeOf(ImageNode.attrs).toEqualTypeOf<Record<string, unknown>>();

declare const el: HTMLImageElement;
expectTypeOf(ImageNode.getAttrs(el)).toEqualTypeOf<boolean | Record<string, unknown>>();

declare const node: Node;
expectTypeOf(ImageNode.toDOM(node)).toEqualTypeOf<[string, unknown]>();
expectTypeOf(ImageNode.make()).toEqualTypeOf<NodeSpec | MarkSpec>();
