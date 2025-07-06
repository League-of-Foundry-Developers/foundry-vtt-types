import { expectTypeOf } from "vitest";
import type { AnyObject } from "#utils";

import CanvasAnimation = foundry.canvas.animation.CanvasAnimation;

expectTypeOf(CanvasAnimation.STATES).toExtend<Record<keyof CanvasAnimation.States, CanvasAnimation.STATES>>();
expectTypeOf(CanvasAnimation.ticker).toEqualTypeOf<PIXI.Ticker>();
expectTypeOf(CanvasAnimation.animations).toEqualTypeOf<Record<PropertyKey, CanvasAnimation.AnimationData>>();

declare function someEasing(pt: number): number;
declare const somePromise: Promise<void>;

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

// @ts-expect-error foo is not a key of animatedState
CanvasAnimation.animate([{ parent: animatedState, attribute: "foo", to: 10 }]);

declare const somePing: foundry.canvas.interaction.PulsePing;
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
    context: somePing,
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

// Animating more than one AnimationParent per call requires specifying the least-common-denominator type,
// often requiring something with a `string` index signature
CanvasAnimation.animate<AnyObject>(
  [
    {
      parent: animationParent1,
      attribute: "bar",
      to: 0,
    },
    {
      parent: animationParent2,
      attribute: "baz", // Because we're passing `AnyObject` we lose useful `keyof` and can't prevent this
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
      // we've lost specific knowledge of the possible values of `.attribute`
      console.warn(
        `We are ${dt}ms into animating the ${data.attributes.map((a) => a.attribute).join(", ")} attributes`,
      );
    },
  },
);

declare const animationSymbol: unique symbol;
expectTypeOf(CanvasAnimation.getAnimation("darknessShift")).toEqualTypeOf<CanvasAnimation.AnimationData | undefined>;
expectTypeOf(CanvasAnimation.getAnimation(animationSymbol)).toEqualTypeOf<CanvasAnimation.AnimationData | undefined>;

expectTypeOf(CanvasAnimation.terminateAnimation("foo")).toBeVoid();
expectTypeOf(CanvasAnimation.terminateAnimation(animationSymbol)).toBeVoid();
expectTypeOf(CanvasAnimation.terminateAll()).toEqualTypeOf<Promise<void>>();

expectTypeOf(CanvasAnimation.easeOutCircle(0.75)).toBeNumber();
expectTypeOf(CanvasAnimation.easeInCircle(0.333)).toBeNumber();
expectTypeOf(CanvasAnimation.easeInOutCosine(0.1)).toBeNumber();
