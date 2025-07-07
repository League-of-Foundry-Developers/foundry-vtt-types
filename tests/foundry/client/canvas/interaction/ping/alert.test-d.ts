import { expectTypeOf } from "vitest";

import AlertPing = foundry.canvas.interaction.AlertPing;

declare const someColor: Color;
declare const someSymbol: unique symbol;

new AlertPing({ x: 23, y: 54 });
const myAlertPing = new AlertPing(
  { x: 23, y: 54 },
  {
    color: 0x00ff00,
    color2: someColor,
    rings: 15,
    name: someSymbol,
    duration: 250,
    size: 512,
  },
);

declare const someGraphics: PIXI.Graphics;
expectTypeOf(myAlertPing["_drawShape"](someGraphics, Color.from(0xcfbdea), 0.333, 20));
