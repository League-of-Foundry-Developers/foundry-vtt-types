import { expectError, expectType } from 'tsd';
import EmbeddedCollection from '../../../../src/foundry/common/abstract/embedded-collection.mjs';

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

expectType<Promise<Scene | undefined>>(foundry.documents.BaseScene.create({ name: 'My scene' }));

const myScene = await foundry.documents.BaseScene.create({ name: 'My second scene' });
if (myScene) {
  expectType<foundry.data.SceneData>(myScene.data);
}

expectError(new foundry.documents.BaseScene({}));

const scene = new foundry.documents.BaseScene({ name: 'My third scene' });
expectType<foundry.documents.BaseScene>(scene);

expectType<EmbeddedCollection<typeof DrawingDocument, foundry.data.SceneData>>(scene.drawings);
expectType<EmbeddedCollection<typeof AmbientLightDocument, foundry.data.SceneData>>(scene.lights);
// TODO: Replace with NoteDocument
expectType<EmbeddedCollection<typeof foundry.documents.BaseNote, foundry.data.SceneData>>(scene.notes);
// TODO: Replace with AmbientSoundDocument
expectType<EmbeddedCollection<typeof foundry.documents.BaseAmbientSound, foundry.data.SceneData>>(scene.sounds);
expectType<EmbeddedCollection<typeof MeasuredTemplateDocument, foundry.data.SceneData>>(scene.templates);
expectType<EmbeddedCollection<typeof TokenDocument, foundry.data.SceneData>>(scene.tokens);
// TODO: Replace with TileDocument
expectType<EmbeddedCollection<typeof foundry.documents.BaseTile, foundry.data.SceneData>>(scene.tiles);
// TODO: Replace with WallDocument
expectType<EmbeddedCollection<typeof foundry.documents.BaseWall, foundry.data.SceneData>>(scene.walls);
