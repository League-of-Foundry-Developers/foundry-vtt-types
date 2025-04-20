import { expectTypeOf } from "vitest";

declare const someToken: Token.Object;
declare const someRenderer: PIXI.Renderer;

const POOClass = PrimaryOccludableObjectMixin(PIXI.Container);
const myPOO = new POOClass();

expectTypeOf(myPOO.testOcclusion(someToken, { corners: true })).toEqualTypeOf<boolean>();
expectTypeOf(myPOO.occlusionMode).toEqualTypeOf<foundry.CONST.OCCLUSION_MODES>();
expectTypeOf(myPOO._restrictionState).toEqualTypeOf<number>();
expectTypeOf(myPOO.debounceSetOcclusion(false)).toEqualTypeOf<boolean>();

// deprecated until v13
expectTypeOf(myPOO.renderOcclusion(someRenderer)).toEqualTypeOf<void>();
// deprecated until v14
expectTypeOf(myPOO.containsPixel(500, 500, 0.5)).toEqualTypeOf<boolean>();
