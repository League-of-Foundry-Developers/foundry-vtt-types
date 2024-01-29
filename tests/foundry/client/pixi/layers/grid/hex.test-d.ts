import { expectTypeOf } from "vitest";

HexagonalGrid.pixelsToOffset({ x: 3, y: 2 }, { columns: true, even: false, size: 4 }, "floor");

const myGrid = new HexagonalGrid({ columns: true, even: false, size: 4 });

expectTypeOf(myGrid.draw()).toEqualTypeOf<HexagonalGrid>();
