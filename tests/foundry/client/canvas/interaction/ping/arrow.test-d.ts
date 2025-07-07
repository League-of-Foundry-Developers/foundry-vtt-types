import { expectTypeOf } from "vitest";
import { ArrowPing } from "#client/canvas/interaction/_module.mjs";

new ArrowPing({ x: 400, y: 737 });
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

declare const someGraphics: PIXI.Graphics;
expectTypeOf(myArrowPing["_drawShape"](someGraphics, Color.from(0xcfbdea), 0.333, 20));
