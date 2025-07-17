import { describe, expectTypeOf, test } from "vitest";

import AlertPing = foundry.canvas.interaction.AlertPing;

declare const color: Color;
declare const someSymbol: unique symbol;
declare const graphics: PIXI.Graphics;

describe("AlertPing Tests", () => {
  test("Construction", () => {
    // @ts-expect-error Must pass an origin
    new AlertPing();
    new AlertPing({ x: 23, y: 54 });
    new AlertPing(
      { x: 23, y: 54 },
      {
        color: 0x00ff00,
        color2: color,
        rings: 15,
        name: someSymbol,
        duration: 250,
        size: 512,
      },
    );
  });

  const myAlertPing = new AlertPing(
    { x: 23, y: 54 },
    {
      color: 0x00ff00,
      color2: color,
      rings: 15,
      name: someSymbol,
      duration: 250,
      size: 512,
    },
  );

  test("Shape Configuration", () => {
    expectTypeOf(myAlertPing["_drawShape"](graphics, Color.from(0xcfbdea), 0.333, 20));
  });
});
