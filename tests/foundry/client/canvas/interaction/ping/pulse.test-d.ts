import { expectTypeOf } from "vitest";

import PulsePing = foundry.canvas.interaction.PulsePing;
import CanvasAnimation = foundry.canvas.animation.CanvasAnimation;

new PulsePing({ x: 37, y: 42 });
new PulsePing(
  { x: 37, y: 42 },
  {
    // color, duration, and size can't be undefined because their defaults are applied via mergeObject
    // color: undefined,
    color2: undefined,
    // duration: undefined,
    name: undefined,
    rings: undefined,
    // size: undefined
  },
);
const myPulsePing = new PulsePing(
  { x: 50, y: 20000 },
  {
    color: "#FF00FF",
    color2: "#00FFFF",
    duration: 4000,
    rings: 5,
    size: 256,
    name: "PulsePing12345",
  },
);

expectTypeOf(myPulsePing.options).toEqualTypeOf<PulsePing.ConstructorOptions>();
expectTypeOf(myPulsePing.animate()).toEqualTypeOf<Promise<boolean>>();

declare const animData: CanvasAnimation.AnimationData<typeof myPulsePing>;
expectTypeOf(myPulsePing["_animateFrame"](20, animData)).toBeVoid();

declare const someGraphics: PIXI.Graphics;
expectTypeOf(myPulsePing["_drawShape"](someGraphics, Color.from(0xcfbdea), 0.333, 20));
