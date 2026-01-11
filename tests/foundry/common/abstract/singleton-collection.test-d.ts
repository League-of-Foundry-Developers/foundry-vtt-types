import { afterAll, describe, expectTypeOf, test } from "vitest";

import SingletonEmbeddedCollection from "#common/abstract/singleton-collection.mjs";

describe("SingletonEmbeddedCollection Tests", async () => {
  const docsToCleanUp = new Set<foundry.abstract.Document.AnyStored>();

  const scene = await Scene.implementation.create({ name: "SingletonEmbeddedCollection Test Scene" });
  if (!scene) throw new Error("Failed to create test Scene");
  docsToCleanUp.add(scene);

  const actor = await Actor.implementation.create({
    name: "SingletonEmbeddedCollection Test Actor",
    type: "base",
  });
  if (!actor) throw new Error("Failed to create test Actor.");
  docsToCleanUp.add(actor);

  const tokenDoc = await TokenDocument.implementation.create(
    // @ts-expect-error `TokenDocument.create` will take a `TokenDocument` on the db-ops branch
    await actor.getTokenDocument({ x: 200, y: 200, actorLink: false }),
    {
      parent: scene,
    },
  );
  if (!tokenDoc) throw new Error("Failed to create test TokenDocument");
  // not added to cleanup as it will get tidied with its parent scene
  // docsToCleanUp.add(tokenDoc)

  // cast required because
  // a) could be `null`, but wont be at runtime given the above
  // b) the initialized type of the `EmbeddedDeltaCollectionField` is `.Implementation`, not `.Stored`
  const deltaStored = tokenDoc.delta as ActorDelta.Stored;
  // TODO: investigate why the `type` override is necessary to get this to behave. Possibly fixed on db-ops?
  const deltaSource: ActorDelta.Source = { ...deltaStored.toObject(), type: "base" };

  const falseOrUndefined: false | undefined = Math.random() > 0.5 ? false : undefined;
  const trueOrUndefined: true | undefined = Math.random() > 0.5 ? true : undefined;
  const boolOrUndefined: boolean | undefined = Math.random() > 0.66 ? true : Math.random() > 0.5 ? false : undefined;

  test("Construction", () => {
    new SingletonEmbeddedCollection<ActorDelta.Stored, TokenDocument.Stored>("delta", tokenDoc, [deltaSource]);
  });

  const sec = new SingletonEmbeddedCollection<ActorDelta.Stored, TokenDocument.Stored>("delta", tokenDoc, [
    deltaSource,
  ]);

  test("Getting", () => {
    expectTypeOf(sec.get("ID")).toEqualTypeOf<ActorDelta.Stored | undefined>();
    expectTypeOf(sec.get("ID", {})).toEqualTypeOf<ActorDelta.Stored | undefined>();
    expectTypeOf(sec.get("ID", { invalid: false, strict: false })).toEqualTypeOf<ActorDelta.Stored | undefined>();
    expectTypeOf(sec.get("ID", { invalid: true, strict: true })).toEqualTypeOf<
      ActorDelta.Invalid | ActorDelta.Stored
    >();
    expectTypeOf(sec.get("ID", { invalid: undefined, strict: undefined })).toEqualTypeOf<
      ActorDelta.Stored | undefined
    >();

    // testing `invalid` (defaults `false`, preventing `.Invalid`s)
    expectTypeOf(sec.get("ID", { invalid: true, strict: true })).toEqualTypeOf<
      ActorDelta.Invalid | ActorDelta.Stored
    >();
    expectTypeOf(sec.get("ID", { invalid: false, strict: true })).toEqualTypeOf<ActorDelta.Stored>();
    expectTypeOf(sec.get("ID", { invalid: undefined, strict: true })).toEqualTypeOf<ActorDelta.Stored>();
    expectTypeOf(sec.get("ID", { invalid: falseOrUndefined, strict: true })).toEqualTypeOf<ActorDelta.Stored>();
    expectTypeOf(sec.get("ID", { invalid: boolOrUndefined, strict: true })).toEqualTypeOf<
      ActorDelta.Invalid | ActorDelta.Stored
    >();
    expectTypeOf(sec.get("ID", { invalid: trueOrUndefined, strict: true })).toEqualTypeOf<
      ActorDelta.Invalid | ActorDelta.Stored
    >();

    // testing `strict` (defaults `false`, allowing `undefined`)
    expectTypeOf(sec.get("ID", { invalid: false, strict: true })).toEqualTypeOf<ActorDelta.Stored>();
    expectTypeOf(sec.get("ID", { invalid: false, strict: false })).toEqualTypeOf<ActorDelta.Stored | undefined>();
    expectTypeOf(sec.get("ID", { invalid: false, strict: undefined })).toEqualTypeOf<ActorDelta.Stored | undefined>();
    expectTypeOf(sec.get("ID", { invalid: false, strict: falseOrUndefined })).toEqualTypeOf<
      ActorDelta.Stored | undefined
    >();
    expectTypeOf(sec.get("ID", { invalid: false, strict: boolOrUndefined })).toEqualTypeOf<
      ActorDelta.Stored | undefined
    >();
    expectTypeOf(sec.get("ID", { invalid: false, strict: trueOrUndefined })).toEqualTypeOf<
      ActorDelta.Stored | undefined
    >();

    expectTypeOf(sec.getInvalid("ID")).toEqualTypeOf<ActorDelta.Invalid>();
    expectTypeOf(sec.getInvalid("ID", {})).toEqualTypeOf<ActorDelta.Invalid>();
    expectTypeOf(sec.getInvalid("ID", { strict: false })).toEqualTypeOf<ActorDelta.Invalid | undefined>();
    expectTypeOf(sec.getInvalid("ID", { strict: undefined })).toEqualTypeOf<ActorDelta.Invalid>();
    expectTypeOf(sec.getInvalid("ID", { strict: trueOrUndefined })).toEqualTypeOf<ActorDelta.Invalid>();
    expectTypeOf(sec.getInvalid("ID", { strict: falseOrUndefined })).toEqualTypeOf<ActorDelta.Invalid | undefined>();
    expectTypeOf(sec.getInvalid("ID", { strict: boolOrUndefined })).toEqualTypeOf<ActorDelta.Invalid | undefined>();
  });

  test("Setting", () => {
    expectTypeOf(sec.set("ID", deltaStored)).toEqualTypeOf<typeof sec>();
    expectTypeOf(sec.set("ID", deltaStored, {})).toEqualTypeOf<typeof sec>();
    expectTypeOf(sec.set("ID", deltaStored, { modifySource: false })).toEqualTypeOf<typeof sec>();
    expectTypeOf(sec.set("ID", deltaStored, { modifySource: undefined })).toEqualTypeOf<typeof sec>();

    expectTypeOf(sec["_set"]("ID", deltaStored)).toBeVoid();
  });

  test("Deleting", () => {
    expectTypeOf(sec["_delete"]("ID")).toBeVoid();
  });

  afterAll(async () => {
    for (const doc of docsToCleanUp) await doc.delete();
  });
});
