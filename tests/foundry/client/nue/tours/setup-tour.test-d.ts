import { describe, expectTypeOf, test } from "vitest";

import SetupTour = foundry.nue.tours.SetupTour;
import Tour = foundry.nue.Tour;
import Application = foundry.appv1.api.Application;
import ApplicationV2 = foundry.applications.api.ApplicationV2;

declare const tourConfig: Tour.Config;
const setupTourConfig = {
  ...tourConfig,
  closeWindows: false,
} satisfies SetupTour.Config;

describe("SetupTour Tests", () => {
  test("Construction", () => {
    new SetupTour(tourConfig);
    new SetupTour(setupTourConfig);

    expectTypeOf(SetupTour.fromJSON("path/to/config.whatever")).toEqualTypeOf<Promise<SetupTour.Any>>();
  });

  const setupTour = new SetupTour(setupTourConfig);

  test("Miscellaneous", () => {
    expectTypeOf(setupTour.config).toEqualTypeOf<SetupTour.Config>();
    expectTypeOf(setupTour.steps).toEqualTypeOf<Tour.Step[]>();
    expectTypeOf(setupTour.focusedApp).toEqualTypeOf<Application.Any | ApplicationV2.Any>();

    expectTypeOf(setupTour["_preStep"]()).toEqualTypeOf<Promise<void>>();
  });

  test("State", () => {
    expectTypeOf(setupTour.canStart).toBeBoolean();
  });

  test("Actions", () => {
    expectTypeOf(setupTour.start()).toEqualTypeOf<Promise<void>>();
  });
});
