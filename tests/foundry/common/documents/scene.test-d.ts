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

// @ts-expect-error A SceneData requires data.
new foundry.documents.BaseScene();

// @ts-expect-error A SceneData requires a name.
new foundry.documents.BaseScene({});

expectTypeOf(
  new foundry.documents.BaseScene({ name: "A long expected journey" }),
).toEqualTypeOf<foundry.documents.BaseScene>();
expectTypeOf(
  new foundry.documents.BaseScene({
    _id: undefined,
    name: "A long expected journey",
    active: undefined,
    navigation: undefined,
    navOrder: undefined,
    navName: undefined,
    img: undefined,
    foreground: undefined,
    thumb: undefined,
    width: undefined,
    height: undefined,
    padding: undefined,
    initial: undefined,
    backgroundColor: undefined,
    gridType: undefined,
    grid: undefined,
    shiftX: undefined,
    shiftY: undefined,
    gridColor: undefined,
    gridAlpha: undefined,
    gridDistance: undefined,
    gridUnits: undefined,
    tokenVision: undefined,
    fogExploration: undefined,
    fogReset: undefined,
    globalLight: undefined,
    globalLightThreshold: undefined,
    darkness: undefined,
    drawings: undefined,
    tokens: undefined,
    lights: undefined,
    notes: undefined,
    sounds: undefined,
    templates: undefined,
    tiles: undefined,
    walls: undefined,
    playlist: undefined,
    playlistSound: undefined,
    journal: undefined,
    weather: undefined,
    folder: undefined,
    sort: undefined,
    permission: undefined,
    flags: undefined,
  }),
).toEqualTypeOf<foundry.documents.BaseScene>();
expectTypeOf(
  new foundry.documents.BaseScene({
    _id: null,
    name: "A long expected journey",
    active: null,
    navigation: null,
    navOrder: null,
    navName: null,
    img: null,
    foreground: null,
    thumb: null,
    width: null,
    height: null,
    padding: null,
    initial: null,
    backgroundColor: null,
    gridType: null,
    grid: null,
    shiftX: null,
    shiftY: null,
    gridColor: null,
    gridAlpha: null,
    gridDistance: null,
    gridUnits: null,
    tokenVision: null,
    fogExploration: null,
    fogReset: null,
    globalLight: null,
    globalLightThreshold: null,
    darkness: null,
    drawings: null,
    tokens: null,
    lights: null,
    notes: null,
    sounds: null,
    templates: null,
    tiles: null,
    walls: null,
    playlist: null,
    playlistSound: null,
    journal: null,
    weather: null,
    folder: null,
    sort: null,
    permission: null,
    flags: null,
  }),
).toEqualTypeOf<foundry.documents.BaseScene>();
