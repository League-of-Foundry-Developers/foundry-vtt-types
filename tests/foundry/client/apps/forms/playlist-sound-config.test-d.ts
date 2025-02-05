import { expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "fvtt-types/utils";

declare const playlistSound: PlaylistSound.ConfiguredInstance;
const playlistSoundConfig = new PlaylistSoundConfig(playlistSound);

expectTypeOf(playlistSoundConfig.object).toEqualTypeOf<PlaylistSound>();
expectTypeOf(playlistSoundConfig.document).toEqualTypeOf<PlaylistSound>();
expectTypeOf(PlaylistSoundConfig.defaultOptions).toEqualTypeOf<DocumentSheetOptions<PlaylistSound.Implementation>>();
expectTypeOf(playlistSoundConfig.options).toEqualTypeOf<DocumentSheetOptions<PlaylistSound.Implementation>>();
expectTypeOf(playlistSoundConfig.getData()).toEqualTypeOf<
  MaybePromise<GetDataReturnType<PlaylistSoundConfig.PlaylistSoundConfigData>>
>();
expectTypeOf(playlistSoundConfig.render(true)).toEqualTypeOf<PlaylistSoundConfig>();

expectTypeOf(playlistSoundConfig.title).toEqualTypeOf<string>();
