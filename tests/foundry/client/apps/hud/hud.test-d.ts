import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

// This exists to make the class non-abstract.
class TestPlaceableHUD extends BasePlaceableHUD {}

const placeableHUD = new TestPlaceableHUD();
expectTypeOf(placeableHUD.object).toEqualTypeOf<PlaceableObject | undefined>();
expectTypeOf(BasePlaceableHUD.defaultOptions).toEqualTypeOf<Application.Options>();
expectTypeOf(placeableHUD.options).toEqualTypeOf<Application.Options>();
expectTypeOf(placeableHUD.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(placeableHUD.render(true)).toEqualTypeOf<TestPlaceableHUD>();
expectTypeOf(placeableHUD.layer).toEqualTypeOf<PlaceableObject["layer"]>();
