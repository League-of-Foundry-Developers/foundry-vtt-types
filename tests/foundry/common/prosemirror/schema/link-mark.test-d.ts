/* eslint-disable import-x/extensions */
import { expectTypeOf } from "vitest";
import LinkMark from "../../../../../src/foundry/common/prosemirror/schema/link-mark.mjs";
import type { Mark, MarkSpec, Node, NodeSpec } from "prosemirror-model";
import type { EditorView } from "prosemirror-view";

new LinkMark();

expectTypeOf(LinkMark.tag).toEqualTypeOf<"a">();
expectTypeOf(LinkMark.attrs).toEqualTypeOf<Record<string, unknown>>();

declare const el: HTMLLinkElement;
expectTypeOf(LinkMark.getAttrs(el)).toEqualTypeOf<boolean | Record<string, unknown>>();

declare const node: Node;
expectTypeOf(LinkMark.toDOM(node)).toEqualTypeOf<[string, unknown]>();
expectTypeOf(LinkMark.make()).toEqualTypeOf<NodeSpec | MarkSpec>();

declare const view: EditorView;
declare const event: JQuery.ClickEvent;
declare const mark: Mark;
expectTypeOf(LinkMark.onClick(view, 3, event, mark)).toEqualTypeOf<boolean | void>();
