import { expectTypeOf } from "vitest";
import type EmbeddedCollection from "../../../../src/foundry/common/abstract/embedded-collection.d.mts";
import type Document from "../../../../src/foundry/common/abstract/document.d.mts";

// @ts-expect-error - A BaseScene requires data.
foundry.documents.BaseScene.create();

// @ts-expect-error - A BaseScene requires a name.
new foundry.documents.BaseScene({});

expectTypeOf(foundry.documents.BaseScene.create({ name: "My scene" })).toEqualTypeOf<
  Promise<Document.Stored<Scene> | undefined>
>();

const myScene = await foundry.documents.BaseScene.create({ name: "My second scene" }, { temporary: true });
if (myScene) {
  expectTypeOf(myScene).toEqualTypeOf<Scene>();
}

// @ts-expect-error - A BaseScene requires a name.
new foundry.documents.BaseScene({});

const scene = new foundry.documents.BaseScene({ name: "My third scene" });
expectTypeOf(scene).toEqualTypeOf<foundry.documents.BaseScene>();

expectTypeOf(scene.drawings).toEqualTypeOf<EmbeddedCollection<DrawingDocument, Scene>>();
expectTypeOf(scene.lights).toEqualTypeOf<EmbeddedCollection<AmbientLightDocument, Scene>>();
expectTypeOf(scene.notes).toEqualTypeOf<EmbeddedCollection<NoteDocument, Scene>>();
expectTypeOf(scene.sounds).toEqualTypeOf<EmbeddedCollection<AmbientSoundDocument, Scene>>();
expectTypeOf(scene.templates).toEqualTypeOf<EmbeddedCollection<MeasuredTemplateDocument, Scene>>();
expectTypeOf(scene.tokens).toEqualTypeOf<EmbeddedCollection<TokenDocument, Scene>>();
expectTypeOf(scene.tiles).toEqualTypeOf<EmbeddedCollection<TileDocument, Scene>>();
expectTypeOf(scene.walls).toEqualTypeOf<EmbeddedCollection<WallDocument, Scene>>();

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
    background: undefined,
    foreground: undefined,
    thumb: undefined,
    width: undefined,
    height: undefined,
    padding: undefined,
    initial: undefined,
    backgroundColor: undefined,
    grid: undefined,
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
    ownership: undefined,
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
    background: null,
    foreground: null,
    thumb: null,
    width: null,
    height: null,
    padding: null,
    initial: null,
    backgroundColor: null,
    grid: null,
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
    ownership: null,
    flags: null,
  }),
).toEqualTypeOf<foundry.documents.BaseScene>();
