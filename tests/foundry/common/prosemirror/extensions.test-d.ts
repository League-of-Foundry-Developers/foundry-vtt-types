import { expectTypeOf } from "vitest";
import type { NodeType, ResolvedPos } from "prosemirror-model";

declare const pos: ResolvedPos;

declare const other: NodeType;
expectTypeOf(pos.hasAncestor(other)).toEqualTypeOf<boolean>();
