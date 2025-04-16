import { expectTypeOf } from "vitest";
import Document = foundry.abstract.Document;

// @ts-expect-error - A Scene requires name.
new Scene();

// @ts-expect-error - A Scene requires name.
new Scene({});

const scene = new Scene({ name: "My scene" });
expectTypeOf(scene).toEqualTypeOf<Scene>();

expectTypeOf(scene.dimensions).toEqualTypeOf<SceneDimensions>();
expectTypeOf(scene.active).toEqualTypeOf<boolean>();
expectTypeOf(scene.background.src).toEqualTypeOf<string | null | undefined>();
expectTypeOf(scene.isView).toEqualTypeOf<boolean>();
expectTypeOf(scene.journal).toEqualTypeOf<JournalEntry.Implementation | null>();
expectTypeOf(scene.playlist).toEqualTypeOf<Playlist.Implementation | null>();
expectTypeOf(scene.playlistSound).toEqualTypeOf<string | null>();
expectTypeOf(scene.activate()).toEqualTypeOf<Promise<Scene | undefined>>();
expectTypeOf(scene.view()).toEqualTypeOf<Promise<Scene | undefined>>();
expectTypeOf(scene.clone()).toEqualTypeOf<Scene>();
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

// TODO(@LukeAbby): More advanced version
class MySceneDocumentSubclass extends Scene {
  protected override _onUpdateDescendantDocuments<
    DescendantDocumentType extends Scene.DescendantClass,
    Parent extends Scene.DescendantParent,
    UpdateData extends Document.UpdateDataFor<DescendantDocumentType>,
    Operation extends foundry.abstract.types.DatabaseUpdateOperation<UpdateData, Parent>,
  >(
    parent: Parent,
    collection: DescendantDocumentType["metadata"]["collection"],
    documents: InstanceType<DescendantDocumentType>,
    changes: UpdateData[],
    options: Document.Database.UpdateOptions<Operation>,
    userId: string,
  ): void {
    super._onUpdateDescendantDocuments(parent, collection, documents, changes, options, userId);

    expectTypeOf(options.recursive).toEqualTypeOf<boolean>();

    switch (collection) {
      case "tokens":
        expectTypeOf(options.animate).toEqualTypeOf<boolean | undefined>();
        for (const d of changes) {
          expectTypeOf(d.name).toEqualTypeOf<string | undefined>();
        }
        break;
      // @ts-expect-error "foobar" is not a valid collection
      case "foobar":
        break;
    }
  }
}

declare const _myScene: MySceneDocumentSubclass;
