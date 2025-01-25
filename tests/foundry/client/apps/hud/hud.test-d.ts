import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

// abstract class, so have to inherit
class MyPlaceableHUD extends BasePlaceableHUD {}

const myPlaceableHUD = new MyPlaceableHUD();
expectTypeOf(myPlaceableHUD.object).toEqualTypeOf<PlaceableObject | undefined>();
expectTypeOf(BasePlaceableHUD.defaultOptions).toEqualTypeOf<ApplicationOptions>();
expectTypeOf(myPlaceableHUD.options).toEqualTypeOf<ApplicationOptions>();
expectTypeOf(myPlaceableHUD.getData()).toEqualTypeOf<MaybePromise<object>>();
// expectTypeOf(myPlaceableHUD.render(true)).toEqualTypeOf<BasePlaceableHUD>();

expectTypeOf(myPlaceableHUD.layer).toEqualTypeOf<PlaceableObject["layer"] | undefined>();
