import { expectTypeOf } from "vitest";
import type { ValueOf } from "../../../../../../src/utils/index.d.mts";

declare const someToken: Token.ConfiguredInstance;

const POOClass = PrimaryOccludableObjectMixin(PIXI.Container);
const myPOO = new POOClass();

expectTypeOf(myPOO.testOcclusion(someToken, { corners: true })).toEqualTypeOf<boolean>();
expectTypeOf(myPOO.occlusionMode).toEqualTypeOf<ValueOf<typeof foundry.CONST.OCCLUSION_MODES>>();
