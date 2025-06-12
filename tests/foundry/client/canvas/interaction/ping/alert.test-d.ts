import { expectTypeOf } from "vitest";
import { AlertPing } from "#client/canvas/interaction/_module.mjs";

const myPoint = new PIXI.Point(2, 2);
declare const someColor: Color;
declare const someSymbol: unique symbol;

const myAlertPing = new AlertPing(myPoint, {
  color: 0x00ff00,
  color2: someColor,
  rings: 15,
  name: someSymbol,
  duration: 250,
  size: 512,
});

expectTypeOf(myAlertPing.animate()).toEqualTypeOf<Promise<boolean>>();
