import { expectTypeOf } from "vitest";
import TransitionContainer = foundry.canvas.TransitionContainer;
import UnboundContainer = foundry.canvas.containers.UnboundContainer;

const container = new TransitionContainer();

expectTypeOf(container).toExtend<UnboundContainer>();

expectTypeOf(container.defaultTransitionType).toBeString();
expectTypeOf(container.defaultDuration).toBeNumber();
expectTypeOf(container.isLocked).toBeBoolean();
expectTypeOf(container.isRunning).toBeBoolean();
expectTypeOf(container.promise).toEqualTypeOf<Promise<void> | null>();

declare const someScene: Scene.Implementation;

expectTypeOf(container.run()).toEqualTypeOf<Promise<void>>();
expectTypeOf(
  container.run({
    operation: async () => {},
    nextScene: someScene,
    activate: true,
    clearColor: [0, 0, 0, 1],
    fromBlack: false,
    duration: 800,
    transitionType: "swirl",
    easing: (t) => t,
  }),
).toEqualTypeOf<Promise<void>>();

// `operation` is awaited and its resolved value discarded.
expectTypeOf(container.run({ operation: async () => {} })).toEqualTypeOf<Promise<void>>();

expectTypeOf(container.cancel()).toEqualTypeOf<Promise<void>>();

expectTypeOf(container._captureCurrentScene()).toEqualTypeOf<PIXI.RenderTexture | null>();
expectTypeOf(
  container._captureCurrentScene({ clearColor: [0, 0, 0, 0], black: true }),
).toEqualTypeOf<PIXI.RenderTexture | null>();

expectTypeOf(container._captureNextScene()).toEqualTypeOf<Promise<PIXI.RenderTexture>>();
expectTypeOf(container._captureNextScene({ clearColor: undefined, transitionType: "fade" })).toEqualTypeOf<
  Promise<PIXI.RenderTexture>
>();

expectTypeOf(container._play()).toEqualTypeOf<Promise<void>>();
expectTypeOf(container._play({ duration: 500, easing: (t) => t * t })).toEqualTypeOf<Promise<void>>();

expectTypeOf(container._reset()).toBeVoid();
