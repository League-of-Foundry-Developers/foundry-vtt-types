import { expectTypeOf } from "vitest";

// @ts-expect-error - A Scene requires data.
new Scene();

// @ts-expect-error - A Scene requires a name.
new Scene({});

const scene = new Scene({ name: "My scene" });
expectTypeOf(scene).toEqualTypeOf<Scene>();

expectTypeOf(scene.dimensions).toEqualTypeOf<SceneDimensions | Record<string, never>>();
expectTypeOf(scene.active).toEqualTypeOf<boolean>();
expectTypeOf(scene.img).toEqualTypeOf<string | null | undefined>();
expectTypeOf(scene.isView).toEqualTypeOf<boolean>();
expectTypeOf(scene.journal).toEqualTypeOf<JournalEntry | null>();
expectTypeOf(scene.playlist).toEqualTypeOf<Playlist | null>();
expectTypeOf(scene.playlistSound).toEqualTypeOf<PlaylistSound | null>();
expectTypeOf(scene.activate()).toEqualTypeOf<Promise<Scene | undefined>>();
expectTypeOf(scene.view()).toEqualTypeOf<Promise<Scene | undefined>>();
expectTypeOf(scene.clone()).toEqualTypeOf<Scene | Promise<Scene | undefined>>();
expectTypeOf(scene.prepareBaseData()).toEqualTypeOf<void>();
expectTypeOf(scene.createThumbnail()).toEqualTypeOf<Promise<ImageHelper.ThumbnailReturn>>();
expectTypeOf(scene.createThumbnail({})).toEqualTypeOf<Promise<ImageHelper.ThumbnailReturn>>();
expectTypeOf(scene.createThumbnail({ img: "path/to/my/img.png" })).toEqualTypeOf<
  Promise<ImageHelper.ThumbnailReturn>
>();
expectTypeOf(scene.createThumbnail({ width: 300 })).toEqualTypeOf<Promise<ImageHelper.ThumbnailReturn>>();
expectTypeOf(scene.createThumbnail({ height: 100 })).toEqualTypeOf<Promise<ImageHelper.ThumbnailReturn>>();
