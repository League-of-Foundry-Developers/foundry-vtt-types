import { describe, expectTypeOf, test } from "vitest";

import SidebarTour = foundry.nue.tours.SidebarTour;
import Tour = foundry.nue.Tour;

declare const tourConfig: Tour.Config;
const sidebarTourConfig = {
  ...tourConfig,
  steps: [
    {
      id: "sidebarStep1",
      content: "blah blah",
      title: "Sidebar Step One",
      sidebarTab: "actors",
    },
  ],
} satisfies SidebarTour.Config;

describe("SidebarTour Tests", () => {
  test("Construction", () => {
    new SidebarTour(tourConfig);
    new SidebarTour(sidebarTourConfig);

    expectTypeOf(SidebarTour.fromJSON("path/to/config.whatever")).toEqualTypeOf<Promise<SidebarTour.Any>>();
  });

  const sidebarTour = new SidebarTour(sidebarTourConfig);

  test("Miscellaneous", () => {
    expectTypeOf(sidebarTour.config).toEqualTypeOf<SidebarTour.Config>();

    expectTypeOf(sidebarTour["_preStep"]()).toEqualTypeOf<Promise<void>>();
  });

  test("Actions", () => {
    expectTypeOf(sidebarTour.start()).toEqualTypeOf<Promise<void>>();
  });
});
