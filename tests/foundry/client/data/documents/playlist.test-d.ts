import { expectTypeOf } from "vitest";

// @ts-expect-error - A Playlist requires name.
new Playlist();

// @ts-expect-error - A Playlist requires name.
new Playlist({});

const playlist = new Playlist({ name: "Some Playlist" });
expectTypeOf(playlist).toEqualTypeOf<Playlist>();

const playlistSound = new PlaylistSound({ name: "Some PlaylistSound" });

expectTypeOf(playlist.playbackOrder).toEqualTypeOf<string[]>();
expectTypeOf(playlist.visible).toEqualTypeOf<boolean>();
expectTypeOf(playlist.prepareDerivedData()).toEqualTypeOf<void>();
expectTypeOf(playlist.playAll()).toEqualTypeOf<Promise<Playlist | undefined>>();
expectTypeOf(playlist.playNext()).toEqualTypeOf<Promise<Playlist | undefined | null>>();
expectTypeOf(playlist.playSound(playlistSound)).toEqualTypeOf<Promise<Playlist | undefined>>();
expectTypeOf(playlist.stopSound(playlistSound)).toEqualTypeOf<Promise<Playlist | undefined>>();
expectTypeOf(playlist.stopAll()).toEqualTypeOf<Promise<Playlist | undefined>>();
expectTypeOf(playlist.cycleMode()).toEqualTypeOf<Promise<Playlist | undefined>>();
expectTypeOf(playlist.toAnchor()).toEqualTypeOf<HTMLAnchorElement>();

expectTypeOf(playlist.sheet).toEqualTypeOf<FormApplication.Any | foundry.applications.api.ApplicationV2.Any | null>();
