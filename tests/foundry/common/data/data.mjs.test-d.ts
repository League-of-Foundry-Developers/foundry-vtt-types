import { expectTypeOf } from "vitest";

const myLight = new foundry.data.LightData();

expectTypeOf(myLight.alpha).toEqualTypeOf<number>();

const myShape = new foundry.data.ShapeData();

expectTypeOf(myShape.type).toEqualTypeOf<string>();

// Using token here for comparison
declare const baseToken: foundry.documents.BaseToken;
expectTypeOf(baseToken.displayName).toEqualTypeOf<foundry.CONST.TOKEN_DISPLAY_MODES>();
expectTypeOf(baseToken.light.alpha).toEqualTypeOf<number>();

const myProtoToken = new foundry.data.PrototypeToken();
expectTypeOf(myProtoToken.name).toEqualTypeOf<string>();
expectTypeOf(myProtoToken.displayName).toEqualTypeOf<foundry.CONST.TOKEN_DISPLAY_MODES>();
expectTypeOf(myProtoToken.light.alpha).toEqualTypeOf<number>();
expectTypeOf(myProtoToken.isOwner).toEqualTypeOf<boolean>();
expectTypeOf(myProtoToken.getBarAttribute("foo")?.attribute).toEqualTypeOf<string | undefined>();

const myTexture = new foundry.data.TextureData();

expectTypeOf(myTexture.src).toEqualTypeOf<string | undefined | null>();

const myTombstone = new foundry.data.TombstoneData();

expectTypeOf(myTombstone._tombstone).toEqualTypeOf<boolean>();
