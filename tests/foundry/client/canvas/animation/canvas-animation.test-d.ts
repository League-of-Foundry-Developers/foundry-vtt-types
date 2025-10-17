import { describe, expectTypeOf, test } from "vitest";

import CanvasAnimation = foundry.canvas.animation.CanvasAnimation;

expectTypeOf(CanvasAnimation.STATES).toExtend<Record<keyof CanvasAnimation.States, CanvasAnimation.STATES>>();
expectTypeOf(CanvasAnimation.ticker).toEqualTypeOf<PIXI.Ticker>();
expectTypeOf(CanvasAnimation.animations).toEqualTypeOf<Record<PropertyKey, CanvasAnimation.AnimationData>>();

declare function someEasing(pt: number): number;
declare const somePromise: Promise<void>;
declare const animationSymbol: unique symbol;
declare const ping: foundry.canvas.interaction.PulsePing;

describe("CanvasAnimation tests", () => {
  const animatedState = {
    darkness: 0,
    color: Color.from(0x123345),
  };

  const attributes = [
    {
      parent: animatedState,
      attribute: "darkness",
      to: 5,
    },
    {
      parent: animatedState,
      attribute: "color",
      to: Color.from(0x543321),
    },
  ] satisfies CanvasAnimation.Attribute<typeof animatedState>[];

  test(".animate", () => {
    // @ts-expect-error foo is not a key of animatedState
    CanvasAnimation.animate([{ parent: animatedState, attribute: "foo", to: 10 }]);

    expectTypeOf(CanvasAnimation.animate(attributes)).toEqualTypeOf<CanvasAnimation.AnimateReturn>();
    expectTypeOf(
      CanvasAnimation.animate(attributes, {
        context: undefined,
        duration: undefined,
        easing: undefined,
        name: undefined,
        ontick: undefined,
        priority: undefined,
        wait: undefined,
      }),
    ).toEqualTypeOf<CanvasAnimation.AnimateReturn>();
    expectTypeOf(
      CanvasAnimation.animate(attributes, {
        context: ping,
        duration: 2000,
        priority: 27 as PIXI.UPDATE_PRIORITY,
        easing: someEasing,
        name: "darknessShift",
        wait: somePromise,
        ontick: (dt, data) => {
          const firstAttribute = data.attributes?.[0];
          if (firstAttribute && firstAttribute.attribute !== "color") {
            expectTypeOf(firstAttribute.attribute).toEqualTypeOf<"darkness">();
          }
          console.warn(
            `We are ${dt}ms into animating the ${data.attributes.map((a) => a.attribute).join(", ")} attributes`,
          );
        },
      }),
    ).toEqualTypeOf<CanvasAnimation.AnimateReturn>();
    const animationParent1 = { foo: 7, bar: 10 };
    const animationParent2 = { fizz: new Color(0), buzz: 33 };

    CanvasAnimation.animate(
      [
        {
          parent: animationParent1,
          attribute: "bar",
          to: 0,
        },
        {
          parent: animationParent2,
          // @ts-expect-error baz is not a property of animationParent2
          attribute: "baz",
          to: 0,
        },
        {
          parent: animationParent2,
          attribute: "fizz",
          to: new Color(0x505050),
        },
      ],
      {
        ontick: (dt, data) => {
          const firstAttribute = data.attributes[0]!;
          if (/** firstAttribute.parent === animationParent2 && */ firstAttribute?.attribute !== "fizz") {
            // @ts-expect-error we currently do not have a way to narrow by parent
            expectTypeOf(firstAttribute.attribute).toEqualTypeOf<"buzz">();
            expectTypeOf(firstAttribute.attribute).toEqualTypeOf<"foo" | "bar" | "buzz">();
          }
          console.warn(
            `We are ${dt}ms into animating the ${data.attributes.map((a) => a.attribute).join(", ")} attributes`,
          );
        },
      },
    );
  });

  test("Miscellaneous", () => {
    expectTypeOf(CanvasAnimation.getAnimation("darknessShift")).toEqualTypeOf<
      CanvasAnimation.AnimationData | undefined
    >;
    expectTypeOf(CanvasAnimation.getAnimation(animationSymbol)).toEqualTypeOf<
      CanvasAnimation.AnimationData | undefined
    >;

    expectTypeOf(CanvasAnimation.terminateAnimation("foo")).toBeVoid();
    expectTypeOf(CanvasAnimation.terminateAnimation(animationSymbol)).toBeVoid();
    expectTypeOf(CanvasAnimation.terminateAll()).toEqualTypeOf<Promise<void>>();
  });

  test("Easing Functions", () => {
    expectTypeOf(CanvasAnimation.easeOutCircle(0.75)).toBeNumber();
    expectTypeOf(CanvasAnimation.easeInCircle(0.333)).toBeNumber();
    expectTypeOf(CanvasAnimation.easeInOutCosine(0.1)).toBeNumber();
  });
});
