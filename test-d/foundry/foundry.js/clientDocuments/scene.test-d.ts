import { expectError, expectType } from 'tsd';

expectError(new Scene());
expectError(new Scene({}));

const scene = new Scene({ name: 'My scene' });
expectType<Scene>(scene);

expectType<Canvas.Dimensions | {}>(scene.dimensions);
expectType<boolean>(scene.active);
expectType<string | null | undefined>(scene.img);
expectType<boolean>(scene.isView);
expectType<JournalEntry | null>(scene.journal);
expectType<Playlist | null>(scene.playlist);
expectType<PlaylistSound | null>(scene.playlistSound);
expectType<Promise<Scene | undefined>>(scene.activate());
expectType<Promise<Scene | undefined>>(scene.view());
expectType<Scene | Promise<Scene | undefined>>(scene.clone());
expectType<void>(scene.prepareBaseData());
expectType<Promise<ImageHelper.ThumbnailReturn>>(scene.createThumbnail());
expectType<Promise<ImageHelper.ThumbnailReturn>>(scene.createThumbnail({}));
expectType<Promise<ImageHelper.ThumbnailReturn>>(scene.createThumbnail({ img: 'path/to/my/img.png' }));
expectType<Promise<ImageHelper.ThumbnailReturn>>(scene.createThumbnail({ width: 300 }));
expectType<Promise<ImageHelper.ThumbnailReturn>>(scene.createThumbnail({ height: 100 }));
