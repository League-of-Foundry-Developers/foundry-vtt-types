import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

declare const drawing: Drawing;

const hud = new DrawingHUD();
// TODO: "Type Instantiation is nxcessively deep and possibly infinite"
// expectTypeOf(hud.layer).toEqualTypeOf<PlaceablesLayer<any> | undefined>();
expectTypeOf(hud.object).toEqualTypeOf<Drawing | undefined>();
hud.bind(drawing);
expectTypeOf(hud.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(hud.setPosition()).toEqualTypeOf<void>();
