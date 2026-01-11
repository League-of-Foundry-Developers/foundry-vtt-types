import { expectTypeOf } from "vitest";
import EmbeddedCollection = foundry.abstract.EmbeddedCollection;

// @ts-expect-error A BaseScene requires data.
foundry.documents.BaseScene.create();

// @ts-expect-error A BaseScene requires a name.
new foundry.documents.BaseScene({});

expectTypeOf(foundry.documents.BaseScene.create({ name: "My scene" })).toEqualTypeOf<
  Promise<Scene.Stored | undefined>
>();

const myScene = await foundry.documents.BaseScene.create({ name: "My second scene" }, { temporary: true });
if (myScene) {
  expectTypeOf(myScene).toEqualTypeOf<Scene.Implementation>();
}

// Subclass `BaseScene` to avoid it being abstract.
class BaseScene extends foundry.documents.BaseScene {}

// @ts-expect-error A BaseScene requires a name.
new BaseScene({});

const scene = new BaseScene({ name: "My third scene" });
expectTypeOf(scene).toEqualTypeOf<BaseScene>();

expectTypeOf(scene.drawings).toEqualTypeOf<EmbeddedCollection<DrawingDocument.Stored, Scene.Implementation>>();
expectTypeOf(scene.lights).toEqualTypeOf<EmbeddedCollection<AmbientLightDocument.Stored, Scene.Implementation>>();
expectTypeOf(scene.notes).toEqualTypeOf<EmbeddedCollection<NoteDocument.Stored, Scene.Implementation>>();
expectTypeOf(scene.sounds).toEqualTypeOf<EmbeddedCollection<AmbientSoundDocument.Stored, Scene.Implementation>>();
expectTypeOf(scene.templates).toEqualTypeOf<
  EmbeddedCollection<MeasuredTemplateDocument.Stored, Scene.Implementation>
>();
expectTypeOf(scene.tokens).toEqualTypeOf<EmbeddedCollection<TokenDocument.Stored, Scene.Implementation>>();
expectTypeOf(scene.tiles).toEqualTypeOf<EmbeddedCollection<TileDocument.Stored, Scene.Implementation>>();
expectTypeOf(scene.walls).toEqualTypeOf<EmbeddedCollection<WallDocument.Stored, Scene.Implementation>>();

// @ts-expect-error A SceneData requires data.
new foundry.documents.BaseScene();

// @ts-expect-error A SceneData requires a name.
new foundry.documents.BaseScene({});

expectTypeOf(new BaseScene({ name: "A long expected journey" })).toEqualTypeOf<BaseScene>();
expectTypeOf(
  new BaseScene({
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
    fog: null,
    environment: null,
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
).toEqualTypeOf<BaseScene>();
expectTypeOf(
  new BaseScene({
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
    fog: null,
    environment: null,
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
).toEqualTypeOf<BaseScene>();
