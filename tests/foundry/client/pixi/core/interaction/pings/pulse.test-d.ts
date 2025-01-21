import { expectTypeOf } from "vitest";

const myPoint = new PIXI.Point(2, 2);

const myPulsePing = new PulsePing(myPoint, {
  color: "#FF00FF",
  color2: "#00FFFF",
  duration: 4000,
  rings: 5,
  size: 256,
  name: null,
});

expectTypeOf(myPulsePing.animate()).toEqualTypeOf<Promise<boolean>>();

const myArrowPing = new ArrowPing(myPoint, {
  color: [0.2, 0.5, 0.6],
  color2: [0.3, 0, 0.2],
  name: "myArrowPing",
  rings: 2,
  rotation: Math.PI / 2,
  duration: 2000,
  size: 128,
});

expectTypeOf(myArrowPing.animate()).toEqualTypeOf<Promise<boolean>>();

declare const someColor: Color;
declare const someSymbol: unique symbol;

const myAlertPing = new AlertPing(myPoint, {
  color: undefined,
  color2: someColor,
  rings: 15,
  name: someSymbol,
  duration: 250,
  size: 512,
});

expectTypeOf(myAlertPing.animate()).toEqualTypeOf<Promise<boolean>>();
