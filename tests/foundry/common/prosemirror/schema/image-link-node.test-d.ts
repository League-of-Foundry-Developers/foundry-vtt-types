/* eslint-disable import-x/extensions */
import { expectTypeOf } from "vitest";
import ImageLinkNode from "../../../../../src/foundry/common/prosemirror/schema/image-link-node.mjs";
import type { AttributeSpec, Node, NodeSpec } from "prosemirror-model";
import type { EditorView } from "prosemirror-view";
import type SchemaDefinition from "#common/prosemirror/schema/schema-definition.mjs";

new ImageLinkNode();

expectTypeOf(ImageLinkNode.tag).toEqualTypeOf<"a">();
expectTypeOf(ImageLinkNode.attrs).toEqualTypeOf<Record<string, AttributeSpec>>();

declare const el: HTMLLinkElement;
expectTypeOf(ImageLinkNode.getAttrs(el)).toEqualTypeOf<SchemaDefinition.GetAttrsReturn>();

declare const node: Node;
expectTypeOf(ImageLinkNode.toDOM(node)).toEqualTypeOf<ImageLinkNode.ToDOMReturn>();
expectTypeOf(ImageLinkNode.make()).toEqualTypeOf<NodeSpec>();

declare const view: EditorView;
declare const event: PointerEvent;
expectTypeOf(ImageLinkNode.onClick(view, 3, event, node)).toEqualTypeOf<boolean>();
