/* eslint-disable import/extensions */
import { expectTypeOf } from "vitest";
import ImageLinkNode from "../../../../../src/foundry/common/prosemirror/schema/image-link-node.mjs";
import type { MarkSpec, Node, NodeSpec } from "prosemirror-model";
import type { EditorView } from "prosemirror-view";

new ImageLinkNode();

expectTypeOf(ImageLinkNode.tag).toEqualTypeOf<"a">();
expectTypeOf(ImageLinkNode.attrs).toEqualTypeOf<Record<string, unknown>>();

declare const el: HTMLLinkElement;
expectTypeOf(ImageLinkNode.getAttrs(el)).toEqualTypeOf<boolean | Record<string, unknown>>();

declare const node: Node;
expectTypeOf(ImageLinkNode.toDOM(node)).toEqualTypeOf<[string, unknown]>();
expectTypeOf(ImageLinkNode.make()).toEqualTypeOf<NodeSpec | MarkSpec>();

declare const view: EditorView;
declare const event: JQuery.ClickEvent;
expectTypeOf(ImageLinkNode.onClick(view, 3, event, node)).toEqualTypeOf<boolean>();
