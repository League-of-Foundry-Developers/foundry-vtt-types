import { expectTypeOf } from "vitest";

import FormApplication = foundry.appv1.api.FormApplication;

// @ts-expect-error - A Playlist requires name.
new Playlist.implementation();

// @ts-expect-error - A Playlist requires name.
new Playlist.implementation({});

const playlist = new Playlist.implementation({ name: "Some Playlist" });
expectTypeOf(playlist).toEqualTypeOf<Playlist.Implementation>();

const playlistSound = new PlaylistSound.implementation({ name: "Some PlaylistSound" });

expectTypeOf(playlist.playbackOrder).toEqualTypeOf<string[]>();
expectTypeOf(playlist.visible).toEqualTypeOf<boolean>();
expectTypeOf(playlist.prepareDerivedData()).toEqualTypeOf<void>();
expectTypeOf(playlist.playAll()).toEqualTypeOf<Promise<Playlist.Implementation | undefined>>();
expectTypeOf(playlist.playNext()).toEqualTypeOf<Promise<Playlist.Implementation | undefined | null>>();
expectTypeOf(playlist.playSound(playlistSound)).toEqualTypeOf<Promise<Playlist.Implementation | undefined>>();
expectTypeOf(playlist.stopSound(playlistSound)).toEqualTypeOf<Promise<Playlist.Implementation | undefined>>();
expectTypeOf(playlist.stopAll()).toEqualTypeOf<Promise<Playlist.Implementation | undefined>>();
expectTypeOf(playlist.cycleMode()).toEqualTypeOf<Promise<Playlist.Implementation | undefined>>();
expectTypeOf(playlist.toAnchor()).toEqualTypeOf<HTMLAnchorElement>();

expectTypeOf(playlist.sheet).toEqualTypeOf<FormApplication.Any | foundry.applications.api.ApplicationV2.Any | null>();
