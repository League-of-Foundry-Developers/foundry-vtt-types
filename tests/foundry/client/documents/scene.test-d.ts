import { expectTypeOf } from "vitest";
import type { DeepReadonly } from "fvtt-types/utils";

import ImageHelper = foundry.helpers.media.ImageHelper;
import Notifications = foundry.applications.ui.Notifications;

// @ts-expect-error A Scene requires name.
new Scene.implementation();

// @ts-expect-error A Scene requires name.
new Scene.implementation({});
const scene = new Scene.implementation({ name: "My scene" });

expectTypeOf(scene).toEqualTypeOf<Scene.Implementation>();
expectTypeOf(scene.grid).toEqualTypeOf<foundry.grid.BaseGrid>();
expectTypeOf(scene.dimensions).toEqualTypeOf<Scene.Dimensions>();
expectTypeOf(scene.active).toEqualTypeOf<boolean>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(scene.background.src).toEqualTypeOf<string | null | undefined>();
expectTypeOf(scene.initializedEdges).toBeBoolean();
expectTypeOf(scene.availableLevels).toEqualTypeOf<Set<Level.Implementation>>();
expectTypeOf(scene.gridlessGrid).toEqualTypeOf<foundry.grid.GridlessGrid>();
expectTypeOf(scene.initializeEdges()).toEqualTypeOf<void>();
expectTypeOf(scene.cycleLevel(1)).toEqualTypeOf<Promise<void>>();
expectTypeOf(scene.getSurfaces()).toEqualTypeOf<DeepReadonly<RegionDocument.Surface[]>>();
expectTypeOf(scene.isView).toEqualTypeOf<boolean>();
expectTypeOf(scene.journal).toEqualTypeOf<JournalEntry.Stored | null>();
expectTypeOf(scene.playlist).toEqualTypeOf<Playlist.Stored | null>();
expectTypeOf(scene.playlistSound).toEqualTypeOf<string | null>();
expectTypeOf(scene.activate()).toEqualTypeOf<Promise<typeof scene>>();
expectTypeOf(scene.view()).toEqualTypeOf<Promise<typeof scene | Notifications.Notification<"warning">>>();
expectTypeOf(scene.clone()).toEqualTypeOf<Scene.Implementation>();
expectTypeOf(scene.prepareBaseData()).toEqualTypeOf<void>();
expectTypeOf(scene.createThumbnail()).toEqualTypeOf<Promise<ImageHelper.ThumbnailReturn>>();
expectTypeOf(scene.createThumbnail({})).toEqualTypeOf<Promise<ImageHelper.ThumbnailReturn>>();
expectTypeOf(scene.createThumbnail({ img: "path/to/my/img.png" })).toEqualTypeOf<
  Promise<ImageHelper.ThumbnailReturn>
>();
expectTypeOf(scene.createThumbnail({ width: 300 })).toEqualTypeOf<Promise<ImageHelper.ThumbnailReturn>>();
expectTypeOf(scene.createThumbnail({ height: 100 })).toEqualTypeOf<Promise<ImageHelper.ThumbnailReturn>>();
expectTypeOf(scene.toCompendium(null, { keepId: true })._id).toEqualTypeOf<string | null>();
// @ts-expect-error _id does not exist if keepId isn't true
scene.toCompendium(null)._id;

class MySceneDocumentSubclass extends Scene {
  method() {
    super._onUpdateDescendantDocuments;
  }

  // callback: () => {
  //   super._onUpdateDescendantDocuments
  // }

  protected override _onUpdateDescendantDocuments(...args: Scene.OnUpdateDescendantDocumentsArgs) {
    super._onUpdateDescendantDocuments(...args);

    const [_parent, collection, _documents, changes, options, _userId] = args;

    expectTypeOf(options.recursive).toEqualTypeOf<boolean>();

    switch (collection) {
      case "tokens":
        expectTypeOf(options.animate).toEqualTypeOf<boolean | undefined>();
        for (const d of changes) {
          expectTypeOf(d.name).toEqualTypeOf<
            | foundry.data.operators.ForcedDeletion
            | foundry.data.operators.ForcedReplacement.CreateReturn<string | null | undefined>
            | string
            | null
            | undefined
          >();
        }
        break;
      // @ts-expect-error "foobar" is not a valid collection
      case "foobar":
        break;
    }
  }
}

declare const _myScene: MySceneDocumentSubclass;

expectTypeOf(scene.shiftX).toEqualTypeOf<number | null>();
expectTypeOf(scene.shiftY).toEqualTypeOf<number | null>();
expectTypeOf(scene.initialLevel).toEqualTypeOf<Level.Implementation>();
expectTypeOf(scene.fog.mode).toEqualTypeOf<CONST.FOG_EXPLORATION_MODES>();
expectTypeOf(scene.transition.type).toEqualTypeOf<string | null>();
expectTypeOf(scene.transition.duration).toBeNumber();
expectTypeOf(scene.transition.activeOnly).toBeBoolean();
expectTypeOf(scene.levels).toEqualTypeOf<foundry.abstract.EmbeddedCollection<Level.Stored, Scene.Implementation>>();
expectTypeOf(scene.updateRegionShapeConstraints()).toEqualTypeOf<void>();
expectTypeOf(
  scene.testSurfaceCollision(
    { x: 0, y: 0, elevation: 0 },
    { x: 5, y: 5, elevation: 5 },
    {
      level: "aLevelId",
    },
  ),
).toBeBoolean();
expectTypeOf(
  scene.testSurfaceCollision(
    { x: 0, y: 0, elevation: 0 },
    { x: 5, y: 5, elevation: 5 },
    {
      level: "aLevelId",
      mode: "closest",
    },
  ),
).toEqualTypeOf<foundry.canvas.Canvas.ElevatedPoint | null>();
expectTypeOf(
  scene.testSurfaceCollision(
    { x: 0, y: 0, elevation: 0 },
    { x: 5, y: 5, elevation: 5 },
    {
      level: "aLevelId",
      mode: "all",
    },
  ),
).toEqualTypeOf<foundry.canvas.Canvas.ElevatedPoint[]>();
expectTypeOf(scene._configureLevelTextures()).toEqualTypeOf<Scene.LevelTexture[]>();
