import { expectTypeOf, test } from "vitest";
import LinkMark from "../../../../../src/foundry/common/prosemirror/schema/link-mark.mts";
import type { Attrs, AttributeSpec, Node, Mark, MarkSpec } from "prosemirror-model";
import type { EditorView } from "prosemirror-view";
import type SchemaDefinition from "../../../../../src/foundry/common/prosemirror/schema/schema-definition.d.mts";

declare const el: HTMLLinkElement;

declare const node: Node;

declare const view: EditorView;
declare const event: PointerEvent;
declare const mark: Mark;

test("foundry/common/prosemirror/schema/link-mark", () => {
  new LinkMark();

  expectTypeOf(LinkMark.tag).toEqualTypeOf<"a">();
  expectTypeOf(LinkMark.attrs).toEqualTypeOf<Record<string, AttributeSpec>>();
  expectTypeOf(LinkMark.getAttrs(el)).toEqualTypeOf<SchemaDefinition.GetAttrsReturn>();
  expectTypeOf(LinkMark.toDOM(node)).toEqualTypeOf<[string, Attrs]>();
  expectTypeOf(LinkMark.make()).toEqualTypeOf<MarkSpec>();
  expectTypeOf(LinkMark.onClick(view, 3, event, mark)).toEqualTypeOf<boolean | void>();
});
