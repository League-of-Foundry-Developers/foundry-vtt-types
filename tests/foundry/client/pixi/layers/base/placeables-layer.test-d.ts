import { expectTypeOf } from "vitest";
import type { Container, DisplayObject } from "pixi.js";
import type Document from "../../../../../../src/foundry/common/abstract/document.d.mts";

import EmbeddedCollection = foundry.abstract.EmbeddedCollection;

class SomeLightLayer extends PlaceablesLayer<"AmbientLight"> {
  static override get layerOptions() {
    return foundry.utils.mergeObject(super.layerOptions, {
      name: "myLighting",
    });
  }

  override options: PlaceablesLayer.LayerOptions<"AmbientLight"> = SomeLightLayer.layerOptions;
}

expectTypeOf(SomeLightLayer.instance).toEqualTypeOf<CanvasLayer | Container<DisplayObject> | undefined>();
// FIXME: I think data model related error?
// expectTypeOf(SomeLightLayer.layerOptions).toEqualTypeOf<PlaceablesLayer.LayerOptions<"AmbientLight">>();
expectTypeOf(SomeLightLayer.layerOptions.objectClass).toEqualTypeOf<any>(); // TODO: Can this be typed to Document.AnyConstructor?
expectTypeOf(PlaceablesLayer.documentName).toEqualTypeOf<
  | "AmbientLight"
  | "AmbientSound"
  | "Drawing"
  | "MeasuredTemplate"
  | "Note"
  | "Region"
  | "Tile"
  | "Token"
  | "Wall"
  | undefined
>();
expectTypeOf(PlaceablesLayer.placeableClass).toEqualTypeOf<PlaceableObject.AnyConstructor>();

const layer = new SomeLightLayer();

if (layer.history.length) {
  const firstHistoryEntry = layer.history[0];
  if (firstHistoryEntry.type === "create") {
    expectTypeOf(firstHistoryEntry.data).toEqualTypeOf<Array<{ _id: string }>>();
  } else if (firstHistoryEntry.type === "update") {
    expectTypeOf(firstHistoryEntry.data).toEqualTypeOf<
      Array<Document.UpdateDataFor<Document.ConfiguredClassForName<"AmbientLight">> & { _id: string }>
    >();
  } else {
    expectTypeOf(firstHistoryEntry.data).toEqualTypeOf<
      Array<Document.ConstructorDataFor<Document.ConfiguredClassForName<"AmbientLight">> & { _id: string }>
    >();
  }
}

expectTypeOf(layer.options.objectClass).toEqualTypeOf<typeof AmbientLight>();
expectTypeOf(layer.objects).toEqualTypeOf<PIXI.Container | null>();
expectTypeOf(layer.preview).toEqualTypeOf<PIXI.Container | null>();
expectTypeOf(layer.quadtree).toMatchTypeOf<CanvasQuadtree<PlaceableObject.Any> | null>();
expectTypeOf(layer.documentCollection).toEqualTypeOf<EmbeddedCollection<AmbientLightDocument, Scene> | null>();
expectTypeOf(layer.gridPrecision).toEqualTypeOf<number>();
expectTypeOf(layer.hud).toEqualTypeOf<BasePlaceableHUD<AmbientLight> | null>();
expectTypeOf(layer.placeables).toEqualTypeOf<AmbientLight[]>();
expectTypeOf(layer.controlled).toEqualTypeOf<AmbientLight[]>();
expectTypeOf(layer.getDocuments()).toEqualTypeOf<
  EmbeddedCollection<AmbientLightDocument.ConfiguredInstance, Scene.ConfiguredInstance> | []
>();

expectTypeOf(layer.draw()).toEqualTypeOf<Promise<SomeLightLayer>>();
declare const someLight: AmbientLightDocument.ConfiguredInstance;
expectTypeOf(layer.createObject(someLight)).toEqualTypeOf<AmbientLight.ConfiguredInstance>();

// @ts-expect-error - A LightLayer needs an AmbientLightDocument.
layer.createObject({});

// @ts-expect-error - A LightLayer needs an AmbientLightDocument.
layer.createObject();

expectTypeOf(layer.tearDown()).toEqualTypeOf<Promise<SomeLightLayer>>();
expectTypeOf(layer.activate()).toEqualTypeOf<SomeLightLayer>();
expectTypeOf(layer.deactivate()).toEqualTypeOf<SomeLightLayer>();

expectTypeOf(layer.get("id")).toEqualTypeOf<AmbientLight | undefined>();

expectTypeOf(layer.controlAll()).toEqualTypeOf<AmbientLight[]>();
expectTypeOf(layer.controlAll({})).toEqualTypeOf<AmbientLight[]>();
expectTypeOf(layer.controlAll({ releaseOthers: true })).toEqualTypeOf<AmbientLight[]>();

expectTypeOf(layer.releaseAll()).toEqualTypeOf<number>();
expectTypeOf(layer.releaseAll({})).toEqualTypeOf<number>();
expectTypeOf(layer.releaseAll({ trigger: true })).toEqualTypeOf<number>();

expectTypeOf(
  layer.rotateMany({
    angle: 270,
  }),
).toEqualTypeOf<Promise<AmbientLight[]>>();
expectTypeOf(
  layer.rotateMany({
    delta: -30,
  }),
).toEqualTypeOf<Promise<AmbientLight[]>>();
expectTypeOf(
  layer.rotateMany({ angle: 10, delta: 20, snap: 20, ids: ["abc", "def"], includeLocked: undefined }),
).toEqualTypeOf<Promise<AmbientLight[]>>();

expectTypeOf(layer.moveMany()).toEqualTypeOf<Promise<AmbientLight[]> | undefined>();
expectTypeOf(layer.moveMany({})).toEqualTypeOf<Promise<AmbientLight[]> | undefined>();
expectTypeOf(
  layer.moveMany({ dx: undefined, dy: -1, rotate: true, ids: ["abc", "def"], includeLocked: null }),
).toEqualTypeOf<Promise<AmbientLight[]> | undefined>();

expectTypeOf(layer.undoHistory()).toEqualTypeOf<Promise<AmbientLightDocument[]>>();
expectTypeOf(layer.deleteAll()).toEqualTypeOf<Promise<undefined | false | null>>();

expectTypeOf(layer.storeHistory("create", { _id: someLight.id ?? "XXXXXSomeIDXXXXX" })).toEqualTypeOf<void>();
expectTypeOf(
  layer.storeHistory("update", {
    _id: someLight.id ?? "XXXXXSomeIDXXXXX",
    ...someLight.toObject(), // TODO: make this a subset of known properties of the schema after docs v2
  }),
).toEqualTypeOf<void>();
expectTypeOf(
  layer.storeHistory("delete", {
    _id: someLight.id ?? "XXXXXSomeIDXXXXX",
    ...someLight.toObject(), // TODO: make this a subset of known properties of the schema after docs v2
  }),
).toEqualTypeOf<void>();

// @ts-expect-error - "new" is not a valid history type.
layer.storeHistory("new", new AmbientLightDocument());

expectTypeOf(layer.copyObjects()).toEqualTypeOf<AmbientLight[]>();
expectTypeOf(layer.pasteObjects({ x: 10, y: 10 })).toEqualTypeOf<Promise<AmbientLightDocument[]>>();
expectTypeOf(layer.pasteObjects({ x: 10, y: 10 }, { hidden: true, snap: false })).toEqualTypeOf<
  Promise<AmbientLightDocument[]>
>();
expectTypeOf(layer.pasteObjects({ x: 10, y: 10 }, { hidden: false })).toEqualTypeOf<Promise<AmbientLightDocument[]>>();
expectTypeOf(layer.pasteObjects({ x: 10, y: 10 }, { snap: true })).toEqualTypeOf<Promise<AmbientLightDocument[]>>();

expectTypeOf(layer.selectObjects({ width: 200, height: 500 })).toEqualTypeOf<boolean>();
expectTypeOf(
  layer.selectObjects(
    {
      x: 10,
      y: 10,
      width: 100,
      height: 200,
      releaseOptions: { trigger: true },
      controlOptions: { releaseOthers: false },
    },
    { releaseOthers: false }, // yes this is the same key as above
  ),
).toEqualTypeOf<boolean>();

declare function transformer(doc: AmbientLight): Partial<AmbientLightDocument>;
declare function filter(doc: AmbientLight): boolean;
expectTypeOf(layer.updateAll({ x: 10, y: 20 })).toEqualTypeOf<Promise<AmbientLightDocument[]>>();
expectTypeOf(layer.updateAll({ x: 10, y: 20 }, null, {})).toEqualTypeOf<Promise<AmbientLightDocument[]>>();
expectTypeOf(layer.updateAll({ x: 10, y: 20 }, filter)).toEqualTypeOf<Promise<AmbientLightDocument[]>>();
expectTypeOf(layer.updateAll({ x: 10, y: 20 }, filter, { diff: false, noHook: false })).toEqualTypeOf<
  Promise<AmbientLightDocument[]>
>();
expectTypeOf(layer.updateAll(transformer)).toEqualTypeOf<Promise<AmbientLightDocument[]>>();
expectTypeOf(layer.updateAll(transformer, null, {})).toEqualTypeOf<Promise<AmbientLightDocument[]>>();
expectTypeOf(layer.updateAll(transformer, filter)).toEqualTypeOf<Promise<AmbientLightDocument[]>>();
expectTypeOf(layer.updateAll(transformer, filter, { diff: true, noHook: true })).toEqualTypeOf<
  Promise<AmbientLightDocument[]>
>();

// TODO: revisit after docs v2
// // @ts-expect-error - An x and y coordinate is required
layer.updateAll({ no_light_data: 0 });
