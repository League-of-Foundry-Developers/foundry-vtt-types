import { expectTypeOf, test } from "vitest";
import type { NodeType, ResolvedPos } from "prosemirror-model";

declare const pos: ResolvedPos;

declare const other: NodeType;

test("foundry/common/prosemirror/extensions", () => {
  expectTypeOf(pos.hasAncestor(other)).toEqualTypeOf<boolean>();
  // Attrs is Record<string, any>
  expectTypeOf(
    pos.hasAncestor(other, { href: { default: null }, foo: new PIXI.Matrix(), bar: NaN }),
  ).toEqualTypeOf<boolean>();
  expectTypeOf(pos.isFirstNode).toEqualTypeOf<boolean>();
  expectTypeOf(pos.isLastNode).toEqualTypeOf<boolean>();
});
