import type EmbeddedCollection from "../../../../src/foundry/common/abstract/embedded-collection.mjs.js";
import { expectTypeOf } from "vitest";

declare class SomeLightLayer extends PlaceablesLayer<"AmbientLight", PlaceablesLayer.LayerOptions<"AmbientLight">> {}

expectTypeOf(SomeLightLayer.instance).toEqualTypeOf<CanvasLayer | undefined>();
expectTypeOf(SomeLightLayer.layerOptions).toEqualTypeOf<PlaceablesLayer.LayerOptions<any>>();
expectTypeOf(SomeLightLayer.layerOptions.objectClass).toEqualTypeOf<any>(); // TODO: Can this be typed to DocumentConstructor?
expectTypeOf(PlaceablesLayer.documentName).toEqualTypeOf<
  "AmbientLight" | "AmbientSound" | "Drawing" | "MeasuredTemplate" | "Note" | "Tile" | "Token" | "Wall"
>();
expectTypeOf(PlaceablesLayer.placeableClass).toEqualTypeOf<ConstructorOf<PlaceableObject>>();

const layer = new SomeLightLayer();
expectTypeOf(layer.options.objectClass).toEqualTypeOf<typeof AmbientLight>();
expectTypeOf(layer.objects).toEqualTypeOf<PIXI.Container | null>();
expectTypeOf(layer.preview).toEqualTypeOf<PIXI.Container | null>();
expectTypeOf(layer.history).toEqualTypeOf<
  Array<{ type: "create" | "update" | "delete"; data: Array<foundry.data.AmbientLightData["_source"]> }>
>();
expectTypeOf(layer.quadtree).toEqualTypeOf<Quadtree<AmbientLight> | null>();
expectTypeOf(layer.documentCollection).toEqualTypeOf<EmbeddedCollection<
  typeof AmbientLightDocument,
  foundry.data.SceneData
> | null>();
expectTypeOf(layer.gridPrecision).toEqualTypeOf<number>();
expectTypeOf(layer.hud).toEqualTypeOf<BasePlaceableHUD<AmbientLight> | null>();
expectTypeOf(layer.placeables).toEqualTypeOf<AmbientLight[]>();
expectTypeOf(layer.controlled).toEqualTypeOf<AmbientLight[]>();
expectTypeOf(layer.getDocuments()).toEqualTypeOf<
  EmbeddedCollection<typeof AmbientLightDocument, foundry.data.SceneData> | AmbientLightDocument[]
>();
expectTypeOf(layer.draw()).toEqualTypeOf<Promise<SomeLightLayer | undefined>>();
expectTypeOf(layer.createObject(new AmbientLightDocument())).toEqualTypeOf<AmbientLight | null>();

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
expectTypeOf(layer.rotateMany()).toEqualTypeOf<Promise<AmbientLight[]>>();
expectTypeOf(layer.rotateMany({})).toEqualTypeOf<Promise<AmbientLight[]>>();
expectTypeOf(layer.rotateMany({ angle: 10, delta: 20, snap: 20, ids: ["abc", "def"] })).toEqualTypeOf<
  Promise<AmbientLight[]>
>();
expectTypeOf(layer.moveMany()).toEqualTypeOf<Promise<AmbientLight[]> | undefined>();
expectTypeOf(layer.moveMany({})).toEqualTypeOf<Promise<AmbientLight[]> | undefined>();
expectTypeOf(layer.moveMany({ dx: 100, dy: 100, rotate: true, ids: ["abc", "def"] })).toEqualTypeOf<
  Promise<AmbientLight[]> | undefined
>();
expectTypeOf(layer.undoHistory()).toEqualTypeOf<Promise<AmbientLightDocument[]>>();
expectTypeOf(layer.deleteAll()).toEqualTypeOf<Promise<AmbientLightDocument[] | false | null>>();
expectTypeOf(layer.storeHistory("create", new AmbientLightDocument().data)).toEqualTypeOf<void>();
expectTypeOf(layer.storeHistory("update", new AmbientLightDocument().data)).toEqualTypeOf<void>();
expectTypeOf(layer.storeHistory("delete", new AmbientLightDocument().data)).toEqualTypeOf<void>();

// @ts-expect-error - "new" is not a valid history type.
layer.storeHistory("new", new AmbientLightDocument().data);

expectTypeOf(layer.copyObjects()).toEqualTypeOf<AmbientLight[]>();
expectTypeOf(layer.pasteObjects({ x: 10, y: 10 })).toEqualTypeOf<Promise<AmbientLightDocument[]>>();
expectTypeOf(layer.pasteObjects({ x: 10, y: 10 }, { hidden: true, snap: false })).toEqualTypeOf<
  Promise<AmbientLightDocument[]>
>();
expectTypeOf(layer.pasteObjects({ x: 10, y: 10 }, { hidden: false })).toEqualTypeOf<Promise<AmbientLightDocument[]>>();
expectTypeOf(layer.pasteObjects({ x: 10, y: 10 }, { snap: true })).toEqualTypeOf<Promise<AmbientLightDocument[]>>();
expectTypeOf(layer.selectObjects()).toEqualTypeOf<boolean>();
expectTypeOf(layer.selectObjects({})).toEqualTypeOf<boolean>();
expectTypeOf(
  layer.selectObjects({
    x: 10,
    y: 10,
    width: 100,
    height: 200,
    releaseOptions: { trigger: true },
    controlOptions: { releaseOthers: true },
  }),
).toEqualTypeOf<boolean>();

declare function transformer(doc: AmbientLight): Partial<foundry.data.AmbientLightData>;
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

// @ts-expect-error - An x and y coordinate is required
layer.updateAll({ no_light_data: 0 });
