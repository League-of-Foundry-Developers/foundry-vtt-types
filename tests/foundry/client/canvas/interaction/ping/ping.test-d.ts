import { expectTypeOf } from "vitest";

import Ping = foundry.canvas.interaction.Ping;
import CanvasAnimation = foundry.canvas.animation.CanvasAnimation;

class MyPing extends Ping {
  protected override _animateFrame(dt: number, animation: CanvasAnimation.AnimationData<this>): void {
    console.warn(
      `We are ${dt}ms into animating the ${animation.attributes.map((a) => a.attribute).join(", ")} attributes`,
    );
  }
}

// @ts-expect-error ping requires an origin
new MyPing();
new MyPing({ x: 50, y: 70 });
new MyPing(
  { x: 50, y: 70 },
  {
    // color, duration, and size can't be undefined because their defaults are applied via mergeObject
    // color: undefined,
    // duration: undefined,
    name: undefined,
    // size: undefined,
  },
);
const myPing = new MyPing(
  { x: 50, y: 70 },
  {
    name: "MyPing",
    color: Color.from([0.2, 0.5, 0.7]),
    duration: 2000,
    size: 192,
  },
);

expectTypeOf(myPing["_color"]).toEqualTypeOf<Color>();

// @ts-expect-error Ping's destroy override requires the passed argument to be (or default to) an object
myPing.destroy(true);
expectTypeOf(myPing.destroy()).toBeVoid();
expectTypeOf(
  myPing.destroy({
    baseTexture: true,
    children: false, // irrelevant, forced true
    texture: true,
  }),
).toBeVoid();

expectTypeOf(myPing.animate()).toEqualTypeOf<Promise<boolean>>();

declare const animData: CanvasAnimation.AnimationData<typeof myPing>;

expectTypeOf(myPing["_animateFrame"](20, animData)).toBeVoid();
