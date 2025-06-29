import { expectTypeOf } from "vitest";
import LinkMark from "#common/prosemirror/schema/link-mark.mjs";
import type { Attrs, AttributeSpec, Node, Mark, MarkSpec } from "prosemirror-model";
import type { EditorView } from "prosemirror-view";
import type SchemaDefinition from "#common/prosemirror/schema/schema-definition.mjs";

new LinkMark();

expectTypeOf(LinkMark.tag).toEqualTypeOf<"a">();
expectTypeOf(LinkMark.attrs).toEqualTypeOf<Record<string, AttributeSpec>>();

declare const el: HTMLLinkElement;
expectTypeOf(LinkMark.getAttrs(el)).toEqualTypeOf<SchemaDefinition.GetAttrsReturn>();

declare const node: Node;
expectTypeOf(LinkMark.toDOM(node)).toEqualTypeOf<[string, Attrs]>();
expectTypeOf(LinkMark.make()).toEqualTypeOf<MarkSpec>();

declare const view: EditorView;
declare const event: PointerEvent;
declare const mark: Mark;
expectTypeOf(LinkMark.onClick(view, 3, event, mark)).toEqualTypeOf<boolean | void>();
