import { expectTypeOf } from "vitest";
import type EmbeddedCollection from "../../../../src/foundry/common/abstract/embedded-collection.d.mts";
import type { StoredDocument } from "../../../../src/types/utils.d.mts";

expectTypeOf(foundry.documents.BaseScene.getDimensions()).toEqualTypeOf<{
  distance: number;
  height: number;
  paddingX: number;
  paddingY: number;
  ratio: number;
  sceneHeight: number;
  sceneWidth: number;
  shiftX: number;
  shiftY: number;
  size: number;
  width: number;
}>();

expectTypeOf(foundry.documents.BaseScene.getDimensions({})).toEqualTypeOf<{
  distance: number;
  height: number;
  paddingX: number;
  paddingY: number;
  ratio: number;
  sceneHeight: number;
  sceneWidth: number;
  shiftX: number;
  shiftY: number;
  size: number;
  width: number;
}>();

expectTypeOf(
  foundry.documents.BaseScene.getDimensions({
    width: 100,
    height: 200,
    gridDistance: 100,
    padding: 10,
    shiftX: 0,
    shiftY: 0,
  }),
).toEqualTypeOf<{
  distance: number;
  height: number;
  paddingX: number;
  paddingY: number;
  ratio: number;
  sceneHeight: number;
  sceneWidth: number;
  shiftX: number;
  shiftY: number;
  size: number;
  width: number;
}>();

// @ts-expect-error - A BaseScene requires data.
foundry.documents.BaseScene.create();

// @ts-expect-error - A BaseScene requires a name.
foundry.documents.BaseScene.create({});

expectTypeOf(foundry.documents.BaseScene.create({ name: "My scene" })).toEqualTypeOf<
  Promise<StoredDocument<Scene> | undefined>
>();

const myScene = await foundry.documents.BaseScene.create({ name: "My second scene" }, { temporary: true });
if (myScene) {
  expectTypeOf(myScene).toEqualTypeOf<foundry.SceneData>();
}

// @ts-expect-error - A BaseScene requires a name.
new foundry.documents.BaseScene({});

const scene = new foundry.documents.BaseScene({ name: "My third scene" });
expectTypeOf(scene).toEqualTypeOf<foundry.documents.BaseScene>();

expectTypeOf(scene.drawings).toEqualTypeOf<EmbeddedCollection<typeof DrawingDocument, foundry.SceneData>>();
expectTypeOf(scene.lights).toEqualTypeOf<EmbeddedCollection<typeof AmbientLightDocument, foundry.SceneData>>();
expectTypeOf(scene.notes).toEqualTypeOf<EmbeddedCollection<typeof NoteDocument, foundry.SceneData>>();
expectTypeOf(scene.sounds).toEqualTypeOf<EmbeddedCollection<typeof AmbientSoundDocument, foundry.SceneData>>();
expectTypeOf(scene.templates).toEqualTypeOf<EmbeddedCollection<typeof MeasuredTemplateDocument, foundry.SceneData>>();
expectTypeOf(scene.tokens).toEqualTypeOf<EmbeddedCollection<typeof TokenDocument, foundry.SceneData>>();
expectTypeOf(scene.tiles).toEqualTypeOf<EmbeddedCollection<typeof TileDocument, foundry.SceneData>>();
expectTypeOf(scene.walls).toEqualTypeOf<EmbeddedCollection<typeof WallDocument, foundry.SceneData>>();
