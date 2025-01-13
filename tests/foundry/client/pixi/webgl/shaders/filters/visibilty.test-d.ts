import { expectTypeOf } from "vitest";

let myVF;
declare const someFilterSystem: PIXI.FilterSystem;

expectTypeOf(VisibilityFilter.fragmentShader({ persistentVision: true })).toEqualTypeOf<string>();
expectTypeOf(VisibilityFilter.vertexShader).toEqualTypeOf<string>();
expectTypeOf((myVF = VisibilityFilter.create())).toEqualTypeOf<VisibilityFilter>();

expectTypeOf(myVF.calculateMatrix(someFilterSystem)).toEqualTypeOf<void>();
expectTypeOf(myVF.blur).toEqualTypeOf<number>();
