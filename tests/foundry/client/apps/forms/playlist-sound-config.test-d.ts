import { expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "fvtt-types/utils";

declare const playlistSound: PlaylistSound.Implementation;
const playlistSoundConfig = new PlaylistSoundConfig(playlistSound);

expectTypeOf(playlistSoundConfig.object).toEqualTypeOf<PlaylistSound.Implementation>();
expectTypeOf(playlistSoundConfig.document).toEqualTypeOf<PlaylistSound.Implementation>();
expectTypeOf(PlaylistSoundConfig.defaultOptions).toEqualTypeOf<DocumentSheet.Options<PlaylistSound.Implementation>>();
expectTypeOf(playlistSoundConfig.options).toEqualTypeOf<DocumentSheet.Options<PlaylistSound.Implementation>>();
expectTypeOf(playlistSoundConfig.getData()).toEqualTypeOf<
  MaybePromise<GetDataReturnType<PlaylistSoundConfig.PlaylistSoundConfigData>>
>();
expectTypeOf(playlistSoundConfig.render(true)).toEqualTypeOf<PlaylistSoundConfig>();

expectTypeOf(playlistSoundConfig.title).toEqualTypeOf<string>();
