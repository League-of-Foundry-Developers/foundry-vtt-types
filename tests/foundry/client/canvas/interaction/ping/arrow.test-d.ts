import { describe, expectTypeOf, test } from "vitest";
import { ArrowPing } from "#client/canvas/interaction/_module.mjs";

declare const someGraphics: PIXI.Graphics;
describe("ArrowPing tests", () => {
  test("Construction", () => {
    // @ts-expect-error Must pass an origin
    new ArrowPing();
    new ArrowPing({ x: 400, y: 737 });
    new ArrowPing(
      { x: 828, y: 777 },
      {
        color: [0.2, 0.5, 0.6],
        color2: [0.3, 0, 0.2],
        name: "myArrowPing",
        rings: 2,
        rotation: Math.PI / 2,
        duration: 2000,
        size: 128,
      },
    );
  });

  const myArrowPing = new ArrowPing(
    { x: 828, y: 777 },
    {
      color: [0.2, 0.5, 0.6],
      color2: [0.3, 0, 0.2],
      name: "myArrowPing",
      rings: 2,
      rotation: Math.PI / 2,
      duration: 2000,
      size: 128,
    },
  );

  test("Shape Configuration", () => {
    expectTypeOf(myArrowPing["_drawShape"](someGraphics, Color.from(0xcfbdea), 0.333, 20));
  });
});
