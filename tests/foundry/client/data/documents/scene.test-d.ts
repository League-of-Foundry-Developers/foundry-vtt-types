import { expectTypeOf } from "vitest";

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
