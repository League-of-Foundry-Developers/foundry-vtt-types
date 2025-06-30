import { expectTypeOf } from "vitest";

import ImageHelper = foundry.helpers.media.ImageHelper;

// @ts-expect-error - A Scene requires name.
new Scene.implementation();

// @ts-expect-error - A Scene requires name.
new Scene.implementation({});
const scene = new Scene.implementation({ name: "My scene" });

expectTypeOf(scene).toEqualTypeOf<Scene.Implementation>();
expectTypeOf(scene.grid).toEqualTypeOf<foundry.grid.BaseGrid>();
expectTypeOf(scene.dimensions).toEqualTypeOf<Scene.Dimensions>();
expectTypeOf(scene.active).toEqualTypeOf<boolean>();
expectTypeOf(scene.background.src).toEqualTypeOf<string | null | undefined>();
expectTypeOf(scene.isView).toEqualTypeOf<boolean>();
expectTypeOf(scene.journal).toEqualTypeOf<JournalEntry.Implementation | null>();
expectTypeOf(scene.playlist).toEqualTypeOf<Playlist.Implementation | null>();
expectTypeOf(scene.playlistSound).toEqualTypeOf<string | null>();
expectTypeOf(scene.activate()).toEqualTypeOf<Promise<Scene.Implementation | undefined>>();
expectTypeOf(scene.view()).toEqualTypeOf<Promise<typeof scene | number>>();
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
          expectTypeOf(d.name).toEqualTypeOf<string | null | undefined>();
        }
        break;
      // @ts-expect-error "foobar" is not a valid collection
      case "foobar":
        break;
    }
  }
}

declare const _myScene: MySceneDocumentSubclass;
