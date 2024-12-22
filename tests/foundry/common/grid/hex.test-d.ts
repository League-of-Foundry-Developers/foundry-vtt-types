import type HexagonalGrid from "src/foundry/common/grid/hexagonal.d.mts";
import { expectTypeOf } from "vitest";

const hexGrid = new foundry.grid.HexagonalGrid({
  columns: false,
  even: true,
  size: 200,
});

expectTypeOf(hexGrid.getOffset({ q: 50, r: 200, s: 500 })).toEqualTypeOf<HexagonalGrid.Offset>();
