import { expectTypeOf } from "vitest";

const myPoint = new PIXI.Point(2, 2);
const myPing = new Ping(myPoint);

expectTypeOf(myPing.animate()).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(myPing._color).toEqualTypeOf<Color>();
