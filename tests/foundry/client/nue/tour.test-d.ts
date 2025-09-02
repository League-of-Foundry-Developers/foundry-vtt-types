import { describe, expectTypeOf, test } from "vitest";

import Tour = foundry.nue.Tour;
import TooltipManager = foundry.helpers.interaction.TooltipManager;

const minimalTourConfig = {
  namespace: "fvtt-tests",
  id: "minimalTour",
  steps: [
    {
      id: "hello-world",
      title: "Hi!",
      content: "Hello world",
    },
  ],
  title: "Minimal Tour Config",
} satisfies Tour.Config;

const fullTourConfig = {
  namespace: "fvtt-tests",
  id: "fullTour",
  steps: [
    {
      id: "hello-world",
      title: "Hi!",
      content: "Hello world",
      restricted: false,
      selector: "button.fvtt-tests-full-tour",
      tooltipDirection: TooltipManager.TOOLTIP_DIRECTIONS.CENTER,
    },
  ],
  title: "Full Tour Config",
  canBeResumed: true,
  description: "An example of each property of a tour config",
  display: true,
  localization: {
    "TOURS.fvtt-tests.fullTour.one": "One",
    "TOURS.fvtt-tests.fullTour.two": "Two",
    "TOURS.fvtt-tests.fullTour.Three": "Three",
  },
  restricted: true,
  suggestedNextTours: ["core.welcome"],
} satisfies Tour.Config;

describe("Tour Tests", () => {
  test("Construction", () => {
    // @ts-expect-error Must pass a config
    new Tour();
    new Tour(minimalTourConfig);
    new Tour(fullTourConfig);

    expectTypeOf(Tour.fromJSON("path/to/config.json.extensionNotEnforced")).toEqualTypeOf<Promise<Tour.Any>>();
  });

  const tour = new Tour(fullTourConfig);

  test("Miscellaneous", () => {
    expectTypeOf(tour.config).toEqualTypeOf<Tour.Config>();
    expectTypeOf(Tour.HIGHLIGHT_PADDING).toBeNumber();
    expectTypeOf(tour.title).toEqualTypeOf<string>();
    expectTypeOf(tour.description).toEqualTypeOf<string | undefined>();
    expectTypeOf(tour.steps).toEqualTypeOf<Tour.Step[]>();

    expectTypeOf(tour["_preStep"]()).toEqualTypeOf<Promise<void>>();
    expectTypeOf(tour["_postStep"]()).toEqualTypeOf<Promise<void>>();
    expectTypeOf(tour["_renderStep"]()).toEqualTypeOf<Promise<void>>();

    expectTypeOf(tour._reloadProgress()).toBeVoid();

    expectTypeOf(Tour.onMovementAction([])).toEqualTypeOf<true | void>();
  });

  test("State", () => {
    expectTypeOf(Tour.STATUS).toEqualTypeOf<
      Readonly<{
        UNSTARTED: "unstarted";
        IN_PROGRESS: "in-progress";
        COMPLETED: "completed";
      }>
    >();
    expectTypeOf(Tour.tourInProgress).toEqualTypeOf<boolean>();
    expectTypeOf(Tour.activeTour).toEqualTypeOf<Tour.Any | null>();

    expectTypeOf(tour.currentStep).toEqualTypeOf<Tour.Step | null>();
    expectTypeOf(tour.stepIndex).toEqualTypeOf<number | null>();
    expectTypeOf(tour.hasNext).toBeBoolean();
    expectTypeOf(tour.hasPrevious).toBeBoolean();
    expectTypeOf(tour.canStart).toBeBoolean();
    expectTypeOf(tour.status).toEqualTypeOf<Tour.STATUS>();
  });

  test("Actions", () => {
    expectTypeOf(tour.complete()).toEqualTypeOf<Promise<void>>();
    expectTypeOf(tour.exit()).toEqualTypeOf<void>();
    expectTypeOf(tour.reset()).toEqualTypeOf<Promise<void>>();
    expectTypeOf(tour.start()).toEqualTypeOf<Promise<void>>();
    expectTypeOf(tour.next()).toEqualTypeOf<Promise<void>>();
    expectTypeOf(tour.previous()).toEqualTypeOf<Promise<void>>();
    expectTypeOf(tour.progress(4)).toEqualTypeOf<Promise<void>>();
  });

  test("HTMLElements", () => {
    expectTypeOf(tour.targetElement).toEqualTypeOf<HTMLElement | null | undefined>();
    expectTypeOf(tour.fadeElement).toEqualTypeOf<HTMLElement | undefined>();
    expectTypeOf(tour.overlayElement).toEqualTypeOf<HTMLElement | undefined>();
  });

  test("Identity", () => {
    expectTypeOf(tour.id).toBeString();
    tour.id = "core"; // Setter

    expectTypeOf(tour.namespace).toBeString();
    tour.namespace = "welcome"; // Setter

    expectTypeOf(tour.key).toBeString();
  });
});
