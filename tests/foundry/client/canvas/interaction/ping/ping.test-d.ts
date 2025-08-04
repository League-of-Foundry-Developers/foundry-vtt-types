import { describe, expectTypeOf, test } from "vitest";

import Ping = foundry.canvas.interaction.Ping;
import CanvasAnimation = foundry.canvas.animation.CanvasAnimation;

class MyPing extends Ping {
  protected override _animateFrame(dt: number, animation: CanvasAnimation.AnimationData<this>): void {
    console.warn(
      `We are ${dt}ms into animating the ${animation.attributes.map((a) => a.attribute).join(", ")} attributes`,
    );
  }
}

declare const animData: CanvasAnimation.AnimationData<MyPing>;

describe("Ping tests", () => {
  describe("Construction", () => {
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
    new MyPing(
      { x: 50, y: 70 },
      {
        name: "MyPing",
        color: Color.from([0.2, 0.5, 0.7]),
        duration: 2000,
        size: 192,
      },
    );
  });

  const myPing = new MyPing(
    { x: 50, y: 70 },
    {
      name: "MyPing",
      color: Color.from([0.2, 0.5, 0.7]),
      duration: 2000,
      size: 192,
    },
  );

  test("Miscellaneous", () => {
    expectTypeOf(myPing["_color"]).toEqualTypeOf<Color>();
  });

  test("PIXI Override(s)", () => {
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
  });

  test("Animation", () => {
    expectTypeOf(myPing.animate()).toEqualTypeOf<Promise<boolean>>();
    expectTypeOf(myPing["_animateFrame"](20, animData)).toBeVoid();
  });
});
