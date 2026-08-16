import { expectTypeOf, test } from "vitest";
import DataModel = foundry.abstract.DataModel;
import type { ValueOf } from "fvtt-types/utils";

const myLight = new foundry.data.LightData();

expectTypeOf(myLight.negative).toBeBoolean();
expectTypeOf(myLight.priority).toBeNumber();
expectTypeOf(myLight.alpha).toBeNumber();
expectTypeOf(myLight.angle).toBeNumber();
expectTypeOf(myLight.bright).toBeNumber();
expectTypeOf(myLight.color).toEqualTypeOf<Color | null>();
expectTypeOf(myLight.coloration).toEqualTypeOf<number | null>();
expectTypeOf(myLight.dim).toBeNumber();
expectTypeOf(myLight.attenuation).toBeNumber();
expectTypeOf(myLight.luminosity).toBeNumber();
expectTypeOf(myLight.saturation).toBeNumber();
expectTypeOf(myLight.contrast).toBeNumber();
expectTypeOf(myLight.shadows).toBeNumber();
expectTypeOf(myLight.animation.intensity).toBeNumber();
expectTypeOf(myLight.animation.reverse).toBeBoolean();
expectTypeOf(myLight.animation.speed).toBeNumber();
expectTypeOf(myLight.animation.type).toEqualTypeOf<string | null>();
expectTypeOf(myLight.darkness.min).toBeNumber();
expectTypeOf(myLight.darkness.max).toBeNumber();

/******************************************************************/

const myShape = new foundry.data.ShapeData();

expectTypeOf(myShape.type).toEqualTypeOf<"c" | "r" | "e" | "p">();
expectTypeOf(myShape.width).toEqualTypeOf<number | null>();
expectTypeOf(myShape.height).toEqualTypeOf<number | null>();
expectTypeOf(myShape.radius).toEqualTypeOf<number | null>();
expectTypeOf(myShape.points).toEqualTypeOf<number[]>();

/******************************************************************/

// BaseShapeData, RectangleShapeData, CircleShapeData, EllipseShapeData, and PolygonShapeData
// are tested in `tests/foundry/client/canvas/regions/shape.test-d.ts`

/******************************************************************/

declare const myCircle: foundry.data.CircleShapeData;
expectTypeOf(myCircle.rotation).toBeNumber();
expectTypeOf(myCircle.gridBased).toBeBoolean();

declare const myRectangle: foundry.data.RectangleShapeData;
expectTypeOf(myRectangle.anchorX).toBeNumber();
expectTypeOf(myRectangle.anchorY).toBeNumber();
expectTypeOf(myRectangle.gridBased).toBeBoolean();

declare const myEllipse: foundry.data.EllipseShapeData;
expectTypeOf(myEllipse.gridBased).toBeBoolean();

declare const myPolygon: foundry.data.PolygonShapeData;
expectTypeOf(myPolygon.origin).toEqualTypeOf<{ x: number; y: number } | null>();

declare const myEmanation: foundry.data.EmanationShapeData;
expectTypeOf(myEmanation.type).toEqualTypeOf<"emanation">();
expectTypeOf(myEmanation.radius).toEqualTypeOf<number>();
expectTypeOf(myEmanation.gridBased).toBeBoolean();

declare const myCone: foundry.data.ConeShapeData;
expectTypeOf(myCone.type).toEqualTypeOf<"cone">();
expectTypeOf(myCone.angle).toBeNumber();
expectTypeOf(myCone.rotation).toBeNumber();
expectTypeOf(myCone.curvature).toEqualTypeOf<"round" | "flat" | "semicircle">();

declare const myRing: foundry.data.RingShapeData;
expectTypeOf(myRing.type).toEqualTypeOf<"ring">();
expectTypeOf(myRing.innerWidth).toEqualTypeOf<number>();
expectTypeOf(myRing.outerWidth).toEqualTypeOf<number>();

declare const myLine: foundry.data.LineShapeData;
expectTypeOf(myLine.type).toEqualTypeOf<"line">();
expectTypeOf(myLine.length).toEqualTypeOf<number>();
expectTypeOf(myLine.width).toEqualTypeOf<number>();

declare const myTokenShape: foundry.data.TokenShapeData;
expectTypeOf(myTokenShape.type).toEqualTypeOf<"token">();
expectTypeOf(myTokenShape.shape).toBeNumber();

declare const myGridShape: foundry.data.GridShapeData;
expectTypeOf(myGridShape.type).toEqualTypeOf<"grid">();
expectTypeOf(myGridShape.origin).toEqualTypeOf<{ x: number; y: number } | null>();

// Every `BaseShapeData` subclass takes a `Schema` parameter so a system can extend one with its own
// fields and still have the instance side see them. Without it the subclass would be stuck with the
// core schema.
declare namespace MyEllipseShapeData {
  interface Schema extends foundry.data.EllipseShapeData.Schema {
    glow: foundry.data.fields.BooleanField;
  }
}

declare class MyEllipseShapeData extends foundry.data.EllipseShapeData<MyEllipseShapeData.Schema> {}

declare const myCustomEllipse: MyEllipseShapeData;

// The added field is visible...
expectTypeOf(myCustomEllipse.glow).toBeBoolean();

// ...and so are the ones inherited from `EllipseShapeData` and `BaseShapeData`.
expectTypeOf(myCustomEllipse.gridBased).toBeBoolean();
expectTypeOf(myCustomEllipse.type).toEqualTypeOf<"ellipse">();
expectTypeOf(myCustomEllipse.hole).toBeBoolean();

/******************************************************************/

type TextureDataTestSchema = DataModel.SchemaOfClass<typeof TextureDataTestModel>;

class TextureDataTestModel extends DataModel<TextureDataTestSchema> {
  static override defineSchema() {
    return {
      textureData: new foundry.data.TextureData(
        {},
        { categories: ["IMAGE", "AUDIO"], initial: { src: "path/to/thing.png" } },
      ),
      textureWithoutInitial: new foundry.data.TextureData({}, { wildcard: true }),
    };
  }
}
const testModel = new TextureDataTestModel();
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
expectTypeOf(testModel.textureData.src).toEqualTypeOf<string | null>();
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
expectTypeOf(testModel.textureData.anchorX).toEqualTypeOf<number>();
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
expectTypeOf(testModel.textureData.anchorY).toEqualTypeOf<number>();
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
expectTypeOf(testModel.textureData.fit).toEqualTypeOf<ValueOf<typeof CONST.TEXTURE_DATA_FIT_MODES>>();
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
expectTypeOf(testModel.textureData.scaleX).toEqualTypeOf<number>();
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
expectTypeOf(testModel.textureData.scaleY).toEqualTypeOf<number>();
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
expectTypeOf(testModel.textureData.tint).toEqualTypeOf<Color>();
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
expectTypeOf(testModel.textureData.alphaThreshold).toEqualTypeOf<number>();

/******************************************************************/

expectTypeOf(foundry.data.PrototypeToken.database).toEqualTypeOf<CONFIG["DatabaseBackend"]>();

const myProtoToken = new foundry.data.PrototypeToken();

// only the fields specific to the prototype token are tested here, the rest of the
// schema is tested in `tests/foundry/common/documents/token.test-d.ts`
expectTypeOf(myProtoToken.name).toEqualTypeOf<string>();
expectTypeOf(myProtoToken.randomImg).toBeBoolean();
expectTypeOf(myProtoToken.depth).toBeNumber();

expectTypeOf(myProtoToken.actor).toEqualTypeOf<Actor.Implementation | null>();
// @ts-expect-error V14 no longer adds actorId to serialized PrototypeToken data.
myProtoToken.toObject().actorId;
expectTypeOf(myProtoToken.getBarAttribute("foo")).toEqualTypeOf<
  TokenDocument.SingleAttributeBar | TokenDocument.ObjectAttributeBar | null
>();
expectTypeOf(myProtoToken.getBarAttribute("foo")?.attribute).toEqualTypeOf<string | undefined>();

/******************************************************************/

const myTombstone = new foundry.data.TombstoneData();

expectTypeOf(myTombstone._id).toEqualTypeOf<string | null>();
expectTypeOf(myTombstone._tombstone).toEqualTypeOf<boolean>();

expectTypeOf(
  foundry.data.PrototypeTokenOverrides.fromJSON,
).returns.toEqualTypeOf<foundry.data.PrototypeTokenOverrides>();

// `TextureData.Schema` is generated based upon some options and so is important to test.
// This could be fleshed out a fair bit.
test("Test TextureData.Schema", () => {
  expectTypeOf<foundry.data.TextureData.Schema["src"]>().toEqualTypeOf<
    foundry.data.fields.FilePathField<{
      required: true;
      categories: ["IMAGE", "VIDEO"];
      // Note(LukeAbby): The `initial` here in particular was broken for a while due to a usage of `EmptyObject`.
      initial: null;
      wildcard: false;
      virtual: true;
      label: "";
    }>
  >();
});
