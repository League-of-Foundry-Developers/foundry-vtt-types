import { expectTypeOf } from "vitest";
import { PulsePing } from "#client/canvas/interaction/_module.mjs";

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
