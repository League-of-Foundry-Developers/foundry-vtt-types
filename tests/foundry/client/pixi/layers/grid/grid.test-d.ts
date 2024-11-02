import { expectTypeOf } from "vitest";

const myGrid = new foundry.grid.BaseGrid({
  dimensions: {
    width: 1,
    height: 2,
    sceneHeight: 3,
    sceneRect: { x: 1, y: 2, width: 3, height: 4 },
    sceneWidth: 5,
    sceneX: 6,
    sceneY: 7,
    size: 8,
    rect: { x: 1, y: 2, width: 3, height: 4 },
    distance: 9,
    maxR: 10,
    ratio: 11,
  },
  color: "0x000000",
  alpha: 3,
});

expectTypeOf(myGrid.draw()).toEqualTypeOf<foundry.grid.BaseGrid>();
