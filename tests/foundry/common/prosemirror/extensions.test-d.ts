import { expectTypeOf } from "vitest";
import type { NodeType, ResolvedPos } from "prosemirror-model";

declare const pos: ResolvedPos;

declare const other: NodeType;
expectTypeOf(pos.hasAncestor(other)).toEqualTypeOf<boolean>();
// Attrs is Record<string, any>
expectTypeOf(
  pos.hasAncestor(other, { href: { default: null }, foo: new PIXI.Matrix(), bar: NaN }),
).toEqualTypeOf<boolean>();
