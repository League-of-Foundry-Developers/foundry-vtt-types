import { expectTypeOf } from "vitest";
import { VisibilityFilter } from "#client/canvas/rendering/filters/_module.mjs";

const myVF = VisibilityFilter.create();
expectTypeOf(myVF).toEqualTypeOf<VisibilityFilter>();

declare const someFilterSystem: PIXI.FilterSystem;

expectTypeOf(VisibilityFilter.fragmentShader({ persistentVision: true })).toEqualTypeOf<string>();
expectTypeOf(VisibilityFilter.vertexShader).toEqualTypeOf<string>();

expectTypeOf(myVF.calculateMatrix(someFilterSystem)).toEqualTypeOf<void>();
expectTypeOf(myVF.blur).toEqualTypeOf<number>();
