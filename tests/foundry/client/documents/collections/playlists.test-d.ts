import { afterAll, describe, expectTypeOf, test } from "vitest";

import Playlists = foundry.documents.collections.Playlists;

describe("Playlists Tests", async () => {
  const docsToCleanUp = new Set<foundry.abstract.Document.AnyStored>();

  const actor = await Actor.implementation.create({
    name: "Playlists Collection Test Actor",
    type: "base",
  });
  if (!actor) throw new Error("Failed to create test Actor.");
  docsToCleanUp.add(actor);

  const actorSource = actor.toObject();

  const scene = await Scene.implementation.create({ name: "Playlists Collection Test Scene" });
  if (!scene) throw new Error("Failed to create test Scene.");
  docsToCleanUp.add(scene);

  const playlist = await Playlist.implementation.create({ name: "Playlists Collection Test Playlist" });
  if (!playlist) throw new Error("Failed to create test Playlist.");
  docsToCleanUp.add(playlist);

  const playlistImpl = new Playlist.implementation({ name: "Playlists Collection Test Playlist" });
  const playlistSource = playlist.toObject();

  const falseOrUndefined: false | undefined = Math.random() > 0.5 ? false : undefined;
  const trueOrUndefined: true | undefined = Math.random() > 0.5 ? true : undefined;
  const boolOrUndefined: boolean | undefined = Math.random() > 0.66 ? true : Math.random() > 0.5 ? false : undefined;

  test("Construction", () => {
    new Playlists();
    new Playlists([playlistSource]);

    // @ts-expect-error `Actor` data not assignable to `Scene` data
    new Playlists([actorSource]);
  });

  const playlists = new Playlists([playlistSource]);

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

  afterAll(async () => {
    for (const doc of docsToCleanUp) await doc.delete();
  });
});
