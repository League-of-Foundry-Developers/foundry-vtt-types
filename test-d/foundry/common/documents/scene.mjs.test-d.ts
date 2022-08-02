import type EmbeddedCollection from '../../../../src/foundry/common/abstract/embedded-collection.mjs';

import { expectError, expectType } from 'tsd';

expectType<{
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
}>(foundry.documents.BaseScene.getDimensions());

expectType<{
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
}>(foundry.documents.BaseScene.getDimensions({}));

expectType<{
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
}>(
  foundry.documents.BaseScene.getDimensions({
    width: 100,
    height: 200,
    gridDistance: 100,
    padding: 10,
    shiftX: 0,
    shiftY: 0
  })
);

expectError(foundry.documents.BaseScene.create());

expectError(foundry.documents.BaseScene.create({}));

expectType<Promise<StoredDocument<Scene> | undefined>>(foundry.documents.BaseScene.create({ name: 'My scene' }));

const myScene = await foundry.documents.BaseScene.create({ name: 'My second scene' }, { temporary: true });
if (myScene) {
  expectType<foundry.documents.BaseScene>(myScene.data);
}

expectError(new foundry.documents.BaseScene({}));

const scene = new foundry.documents.BaseScene({ name: 'My third scene' });
expectType<foundry.documents.BaseScene>(scene);

expectType<EmbeddedCollection<typeof DrawingDocument, foundry.documents.BaseScene>>(scene.drawings);
expectType<EmbeddedCollection<typeof AmbientLightDocument, foundry.documents.BaseScene>>(scene.lights);
expectType<EmbeddedCollection<typeof NoteDocument, foundry.documents.BaseScene>>(scene.notes);
expectType<EmbeddedCollection<typeof AmbientSoundDocument, foundry.documents.BaseScene>>(scene.sounds);
expectType<EmbeddedCollection<typeof MeasuredTemplateDocument, foundry.documents.BaseScene>>(scene.templates);
expectType<EmbeddedCollection<typeof TokenDocument, foundry.documents.BaseScene>>(scene.tokens);
expectType<EmbeddedCollection<typeof TileDocument, foundry.documents.BaseScene>>(scene.tiles);
expectType<EmbeddedCollection<typeof WallDocument, foundry.documents.BaseScene>>(scene.walls);

expectError(new foundry.documents.BaseScene());
expectError(new foundry.documents.BaseScene({}));
expectType<foundry.documents.BaseScene>(new foundry.documents.BaseScene({ name: 'A long expected journey' }));
expectType<foundry.documents.BaseScene>(
  new foundry.documents.BaseScene({
    _id: undefined,
    name: 'A long expected journey',
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
    flags: undefined
  })
);
expectType<foundry.documents.BaseScene>(
  new foundry.documents.BaseScene({
    _id: null,
    name: 'A long expected journey',
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
    flags: null
  })
);
