import type { ValueOf } from "src/utils/index.d.mts";
import { expectTypeOf } from "vitest";

declare const someToken: Token.ConfiguredInstance;

const POOClass = PrimaryOccludableObjectMixin(PIXI.Container);
const myPOO = new POOClass();

expectTypeOf(myPOO.testOcclusion(someToken, { corners: true })).toEqualTypeOf<boolean>();
expectTypeOf(myPOO.occlusionMode).toEqualTypeOf<ValueOf<typeof foundry.CONST.OCCLUSION_MODES>>();
