import { describe, expectTypeOf, test } from "vitest";

import Playlists = foundry.documents.collections.Playlists;

declare const playlistCreateData: Playlist.CreateData;
declare const playlistSource: Playlist.Source;
declare const playlist: Playlist.Stored;
declare const playlistImpl: Playlist.Implementation;
declare const actor: Actor.Stored;
declare const scene: Scene.Stored;
declare const wallCreateData: WallDocument.CreateData;
declare const falseOrUndefined: false | undefined;
declare const trueOrUndefined: true | undefined;
declare const boolOrUndefined: boolean | undefined;

describe("Playlists Tests", () => {
  test("Construction", () => {
    new Playlists();
    new Playlists([playlistCreateData]);
    new Playlists([playlistSource]);

    // @ts-expect-error `WallDocument` data not assignable to `Scene` data
    new Playlists([wallCreateData]);
  });

  const playlists = new Playlists([playlistCreateData]);

  test("Miscellaneous", () => {
    expectTypeOf(Playlists.documentName).toEqualTypeOf<"Playlist">();
    expectTypeOf(Playlists.instance).toEqualTypeOf<Playlists.Implementation>();
    expectTypeOf(playlists.folders).toEqualTypeOf<Collection<Folder.Stored<"Playlist">>>();
    expectTypeOf(playlists.directory).toEqualTypeOf<typeof ui.playlists>();

    expectTypeOf(playlists.playing).toEqualTypeOf<Playlist.Stored[]>();
    expectTypeOf(playlists.initialize()).toEqualTypeOf<Promise<void>>();

    expectTypeOf(playlists._onChangeScene(scene, scene)).toEqualTypeOf<Promise<void>>();
    expectTypeOf(playlists._onChangeScene(null, scene)).toEqualTypeOf<Promise<void>>();
    expectTypeOf(playlists._onChangeScene(scene, null)).toEqualTypeOf<Promise<void>>();
    expectTypeOf(playlists._onChangeScene(null, null)).toEqualTypeOf<Promise<void>>();
  });

  test("Getting", () => {
    expectTypeOf(playlists.get("ID")).toEqualTypeOf<Playlist.Stored | undefined>();
    expectTypeOf(playlists.get("ID", {})).toEqualTypeOf<Playlist.Stored | undefined>();
    expectTypeOf(playlists.get("ID", { invalid: false, strict: false })).toEqualTypeOf<Playlist.Stored | undefined>();
    expectTypeOf(playlists.get("ID", { invalid: true, strict: true })).toEqualTypeOf<
      Playlist.Invalid | Playlist.Stored
    >();
    expectTypeOf(playlists.get("ID", { invalid: undefined, strict: undefined })).toEqualTypeOf<
      Playlist.Stored | undefined
    >();

    // testing `invalid` (defaults `false`, preventing `.Invalid`s)
    expectTypeOf(playlists.get("ID", { invalid: true, strict: true })).toEqualTypeOf<
      Playlist.Invalid | Playlist.Stored
    >();
    expectTypeOf(playlists.get("ID", { invalid: false, strict: true })).toEqualTypeOf<Playlist.Stored>();
    expectTypeOf(playlists.get("ID", { invalid: undefined, strict: true })).toEqualTypeOf<Playlist.Stored>();
    expectTypeOf(playlists.get("ID", { invalid: falseOrUndefined, strict: true })).toEqualTypeOf<Playlist.Stored>();
    expectTypeOf(playlists.get("ID", { invalid: boolOrUndefined, strict: true })).toEqualTypeOf<
      Playlist.Invalid | Playlist.Stored
    >();
    expectTypeOf(playlists.get("ID", { invalid: trueOrUndefined, strict: true })).toEqualTypeOf<
      Playlist.Invalid | Playlist.Stored
    >();

    // testing `strict` (defaults `false`, allowing `undefined`)
    expectTypeOf(playlists.get("ID", { invalid: false, strict: true })).toEqualTypeOf<Playlist.Stored>();
    expectTypeOf(playlists.get("ID", { invalid: false, strict: false })).toEqualTypeOf<Playlist.Stored | undefined>();
    expectTypeOf(playlists.get("ID", { invalid: false, strict: undefined })).toEqualTypeOf<
      Playlist.Stored | undefined
    >();
    expectTypeOf(playlists.get("ID", { invalid: false, strict: falseOrUndefined })).toEqualTypeOf<
      Playlist.Stored | undefined
    >();
    expectTypeOf(playlists.get("ID", { invalid: false, strict: boolOrUndefined })).toEqualTypeOf<
      Playlist.Stored | undefined
    >();
    expectTypeOf(playlists.get("ID", { invalid: false, strict: trueOrUndefined })).toEqualTypeOf<
      Playlist.Stored | undefined
    >();

    expectTypeOf(playlists.getInvalid("ID")).toEqualTypeOf<Playlist.Invalid>();
    expectTypeOf(playlists.getInvalid("ID", {})).toEqualTypeOf<Playlist.Invalid>();
    expectTypeOf(playlists.getInvalid("ID", { strict: false })).toEqualTypeOf<Playlist.Invalid | undefined>();
    expectTypeOf(playlists.getInvalid("ID", { strict: undefined })).toEqualTypeOf<Playlist.Invalid>();
    expectTypeOf(playlists.getInvalid("ID", { strict: trueOrUndefined })).toEqualTypeOf<Playlist.Invalid>();
    expectTypeOf(playlists.getInvalid("ID", { strict: falseOrUndefined })).toEqualTypeOf<
      Playlist.Invalid | undefined
    >();
    expectTypeOf(playlists.getInvalid("ID", { strict: boolOrUndefined })).toEqualTypeOf<Playlist.Invalid | undefined>();

    expectTypeOf(playlists.getName("name")).toEqualTypeOf<Playlist.Stored | undefined>();
    expectTypeOf(playlists.getName("name", {})).toEqualTypeOf<Playlist.Stored | undefined>();
    expectTypeOf(playlists.getName("name", { strict: true })).toEqualTypeOf<Playlist.Stored>();
    expectTypeOf(playlists.getName("name", { strict: undefined })).toEqualTypeOf<Playlist.Stored | undefined>();
    expectTypeOf(playlists.getName("name", { strict: trueOrUndefined })).toEqualTypeOf<Playlist.Stored | undefined>();
    expectTypeOf(playlists.getName("name", { strict: falseOrUndefined })).toEqualTypeOf<Playlist.Stored | undefined>();
    expectTypeOf(playlists.getName("name", { strict: boolOrUndefined })).toEqualTypeOf<Playlist.Stored | undefined>();
  });

  test("Setting and Deleting", () => {
    // @ts-expect-error `DocumentCollection`s only contain stored documents
    playlists.set("ID", playlistImpl);
    // @ts-expect-error `Actor`s are not `Playlist`s
    playlists.set("ID", actor);
    // returns void, for now (13.351): https://github.com/foundryvtt/foundryvtt/issues/13565
    expectTypeOf(playlists.set("ID", playlist)).toBeVoid();

    expectTypeOf(playlists.delete("ID")).toBeBoolean();
  });
});
