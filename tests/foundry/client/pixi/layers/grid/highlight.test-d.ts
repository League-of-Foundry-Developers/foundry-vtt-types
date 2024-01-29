import { expectTypeOf } from "vitest";

expectTypeOf(new GridHighlight("")).toEqualTypeOf<GridHighlight>();

const grid = new GridHighlight("");
expectTypeOf(grid.name).toEqualTypeOf<string>();
expectTypeOf(grid.positions).toEqualTypeOf<Set<string>>();
expectTypeOf(grid.highlight(100, 100)).toEqualTypeOf<boolean>();
expectTypeOf(grid.clear()).toEqualTypeOf<GridHighlight>();
expectTypeOf(grid.destroy()).toEqualTypeOf<void>();
expectTypeOf(grid.destroy({ children: true, texture: true, baseTexture: true })).toEqualTypeOf<void>();
