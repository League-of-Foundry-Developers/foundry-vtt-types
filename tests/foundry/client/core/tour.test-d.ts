import { expectTypeOf } from "vitest";

declare const tourConfig: Tour.Config;

const tour = new Tour(tourConfig);

expectTypeOf(tour.config).toEqualTypeOf<Tour.Config>();
expectTypeOf(tour.targetElement).toEqualTypeOf<HTMLElement | undefined>();
expectTypeOf(tour.fadeElement).toEqualTypeOf<HTMLElement | undefined>();
expectTypeOf(tour.overlayElement).toEqualTypeOf<HTMLElement | undefined>();
expectTypeOf(tour.id).toEqualTypeOf<string | undefined>();
expectTypeOf(tour.title).toEqualTypeOf<string>();
expectTypeOf(tour.description).toEqualTypeOf<string | undefined>();
expectTypeOf(tour.namespace).toEqualTypeOf<string | undefined>();
expectTypeOf(tour.key).toEqualTypeOf<string>();
expectTypeOf(tour.steps).toEqualTypeOf<Tour.Step[]>();
expectTypeOf(tour.currentStep).toEqualTypeOf<Tour.Step | null>();
expectTypeOf(tour.stepIndex).toEqualTypeOf<number | null>();
expectTypeOf(tour.hasNext).toEqualTypeOf<boolean>();
expectTypeOf(tour.hasPrevious).toEqualTypeOf<boolean>();
expectTypeOf(tour.canStart).toEqualTypeOf<boolean>();
expectTypeOf(tour.status).toEqualTypeOf<Tour.STATUS>();
expectTypeOf(tour.complete()).toEqualTypeOf<Promise<void>>();
expectTypeOf(tour.exit()).toEqualTypeOf<void>();
expectTypeOf(tour.reset()).toEqualTypeOf<Promise<void>>();
expectTypeOf(tour.start()).toEqualTypeOf<Promise<void>>();
expectTypeOf(tour.next()).toEqualTypeOf<Promise<void>>();
expectTypeOf(tour.previous()).toEqualTypeOf<Promise<void>>();
expectTypeOf(tour.progress(4)).toEqualTypeOf<Promise<void>>();

expectTypeOf(Tour.STATUS).toEqualTypeOf<
  Readonly<{
    UNSTARTED: "unstarted";
    IN_PROGRESS: "in-progress";
    COMPLETED: "completed";
  }>
>();
expectTypeOf(Tour.tourInProgress).toEqualTypeOf<boolean>();
expectTypeOf(Tour.activeTour).toEqualTypeOf<Tour | null>();
expectTypeOf(Tour.onMovementAction([])).toEqualTypeOf<boolean>();
expectTypeOf(Tour.HIGHLIGHT_PADDING).toEqualTypeOf<number>();
expectTypeOf(Tour.fromJSON("")).toEqualTypeOf<Promise<Tour>>();
