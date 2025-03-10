import { expectTypeOf } from "vitest";
import DataModel = foundry.abstract.DataModel;
import fields = foundry.data.fields;
import type { ValueOf } from "fvtt-types/utils";

const myLight = new foundry.data.LightData();

expectTypeOf(myLight.alpha).toEqualTypeOf<number>();

const myShape = new foundry.data.ShapeData();

expectTypeOf(myShape.type).toEqualTypeOf<"c" | "r" | "e" | "p">();

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

// TextureData
const textureDataTestSchema = {
  fpf1: new fields.FilePathField({ initial: () => "bob" }),
  textureData: new foundry.data.TextureData({}, { categories: ["IMAGE", "VIDEO"], initial: { src: "path/to/thing" } }),
};
type TextureTestSchema = typeof textureDataTestSchema;

class TextureDataTestModel extends DataModel<TextureTestSchema> {
  static override defineSchema(): TextureTestSchema {
    return textureDataTestSchema;
  }
}
const testModel = new TextureDataTestModel();
expectTypeOf(testModel.textureData.src).toEqualTypeOf<string | undefined | null>();
expectTypeOf(testModel.textureData.anchorX).toEqualTypeOf<number | undefined>();
expectTypeOf(testModel.textureData.anchorY).toEqualTypeOf<number | undefined>();
expectTypeOf(testModel.textureData.offsetX).toEqualTypeOf<number | undefined>();
expectTypeOf(testModel.textureData.offsetY).toEqualTypeOf<number | undefined>();
expectTypeOf(testModel.textureData.fit).toEqualTypeOf<ValueOf<typeof CONST.TEXTURE_DATA_FIT_MODES>>();
expectTypeOf(testModel.textureData.scaleX).toEqualTypeOf<number | undefined>();
expectTypeOf(testModel.textureData.scaleY).toEqualTypeOf<number | undefined>();
expectTypeOf(testModel.textureData.rotation).toEqualTypeOf<number>();
expectTypeOf(testModel.textureData.tint).toEqualTypeOf<Color | undefined>();
expectTypeOf(testModel.textureData.alphaThreshold).toEqualTypeOf<number>();

// TombstoneData
const myTombstone = new foundry.data.TombstoneData();

expectTypeOf(myTombstone._tombstone).toEqualTypeOf<boolean>();
