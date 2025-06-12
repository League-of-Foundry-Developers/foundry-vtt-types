import { expectTypeOf } from "vitest";
import { Ping } from "#client/canvas/interaction/_module.mjs";

const myPoint = new PIXI.Point(2, 2);
const myPing = new Ping(myPoint);

expectTypeOf(myPing.animate()).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(myPing._color).toEqualTypeOf<Color>();
