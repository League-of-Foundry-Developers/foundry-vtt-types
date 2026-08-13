import { describe, expectTypeOf, test } from "vitest";

import PrimaryCanvasParticleContainer = foundry.canvas.primary.PrimaryCanvasParticleContainer;

describe("PrimaryCanvasParticleContainer tests", () => {
  const container = new PrimaryCanvasParticleContainer();

  test("Particle container behavior", () => {
    expectTypeOf(container).toExtend<foundry.canvas.primary.PrimaryCanvasContainer>();
    expectTypeOf(container.eventMode).toEqualTypeOf<PIXI.EventMode>();
    expectTypeOf(container.interactiveChildren).toBeBoolean();
    expectTypeOf(container.sortableChildren).toBeBoolean();
    expectTypeOf(container["_onAddedPrimary"]()).toBeVoid();
    expectTypeOf(container["_onRemovedPrimary"]()).toBeVoid();
    expectTypeOf(container["_onElevationChange"]()).toBeVoid();
    expectTypeOf(container["_shouldRenderDepth"]()).toEqualTypeOf<false>();
  });
});
