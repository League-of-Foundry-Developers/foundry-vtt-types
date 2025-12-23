import { describe, expectTypeOf, test } from "vitest";

import CanvasTour = foundry.nue.tours.CanvasTour;
import Tour = foundry.nue.Tour;

declare const tourConfig: Tour.Config;
const canvasTourConfig = {
  ...tourConfig,
  steps: [
    {
      id: "sidebarStep1",
      content: "blah blah",
      title: "Sidebar Step One",
      layer: "walls",
      tool: "ethereal",
    },
  ],
} satisfies CanvasTour.Config;

describe("CanvasTour Tests", () => {
  test("Construction", () => {
    new CanvasTour(tourConfig);
    new CanvasTour(canvasTourConfig);

    expectTypeOf(CanvasTour.fromJSON("path/to/config.whatever")).toEqualTypeOf<Promise<CanvasTour.Any>>();
  });

  const canvasTour = new CanvasTour(canvasTourConfig);

  test("Miscellaneous", () => {
    expectTypeOf(canvasTour.config).toEqualTypeOf<CanvasTour.Config>();

    expectTypeOf(canvasTour["_preStep"]()).toEqualTypeOf<Promise<void>>();
  });

  test("State", () => {
    expectTypeOf(canvasTour.canStart).toBeBoolean();
  });

  test("Actions", () => {
    expectTypeOf(canvasTour.start()).toEqualTypeOf<Promise<void>>();
  });
});
