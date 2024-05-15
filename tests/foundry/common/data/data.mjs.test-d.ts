import { expectTypeOf } from "vitest";

const myLight = new foundry.data.LightData();

expectTypeOf(myLight.alpha).toEqualTypeOf<number>();

const myShape = new foundry.data.ShapeData();

expectTypeOf(myShape.type).toEqualTypeOf<string>();

const myProtoToken = new foundry.data.PrototypeToken();

expectTypeOf(myProtoToken).toEqualTypeOf<>();

const myTexture = new foundry.data.TextureData();

expectTypeOf(myTexture.src).toEqualTypeOf<string>();

const myTombstone = new foundry.data.TombstoneData();

expectTypeOf(myTombstone._tombstone).toEqualTypeOf<boolean>();
