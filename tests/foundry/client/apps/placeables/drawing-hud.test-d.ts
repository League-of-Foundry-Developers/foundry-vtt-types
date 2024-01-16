import { expectTypeOf } from "vitest";
import type { MaybePromise } from "../../../../../src/types/utils.d.mts";

declare const drawing: Drawing;

const hud = new DrawingHUD();
expectTypeOf(hud.layer).toEqualTypeOf<PlaceablesLayer<any> | undefined>();
expectTypeOf(hud.object).toEqualTypeOf<Drawing | undefined>();
hud.bind(drawing);
expectTypeOf(hud.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(hud.setPosition()).toEqualTypeOf<void>();
