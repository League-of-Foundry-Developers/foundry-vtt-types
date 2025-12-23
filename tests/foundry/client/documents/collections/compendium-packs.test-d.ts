import { describe, expectTypeOf, test } from "vitest";

import CompendiumPacks = foundry.documents.collections.CompendiumPacks;
import CompendiumCollection = foundry.documents.collections.CompendiumCollection;

declare const packsData: [string, CompendiumCollection.Any][];
declare const pack: CompendiumCollection.Any;
declare const hasMetadata: { metadata: { label: string } };
declare const hasName: { name: string };
declare const hasNeither: { foo: "bar " };

describe("CompendiumPacks Tests", () => {
  const falseOrUndefined: false | undefined = Math.random() > 0.5 ? false : undefined;
  const trueOrUndefined: true | undefined = Math.random() > 0.5 ? true : undefined;
  const boolOrUndefined: boolean | undefined = Math.random() > 0.66 ? true : Math.random() > 0.5 ? false : undefined;

  test("Construction", () => {
    new CompendiumPacks();
    new CompendiumPacks(packsData);
  });

  const packs = new CompendiumPacks(packsData);

  test("Miscellaneous", () => {
    expectTypeOf(packs.name).toBeString();
    expectTypeOf(packs.folders).toEqualTypeOf<Collection<Folder.Stored<"Compendium">>>();
    expectTypeOf(packs["_getVisibleTreeContents"]()).toEqualTypeOf<CompendiumCollection.Any[]>();
  });

  test("Sorting", () => {
    expectTypeOf(CompendiumPacks["_sortAlphabetical"](hasMetadata, hasMetadata)).toBeNumber();
    expectTypeOf(CompendiumPacks["_sortAlphabetical"](hasName, hasName)).toBeNumber();
    // @ts-expect-error `a` and `b` must be the same of the two valid types
    CompendiumPacks["_sortAlphabetical"](hasMetadata, hasName);
    // @ts-expect-error `a` and `b` must be the same of the two valid types
    CompendiumPacks["_sortAlphabetical"](hasName, hasMetadata);
    // @ts-expect-error sortables must have either `metadata.label` or `name`
    CompendiumPacks["_sortAlphabetical"](hasNeither, hasNeither);
  });

  test("Getting/Contents", () => {
    expectTypeOf(packs.contents).toEqualTypeOf<CompendiumCollection.Any[]>();

    expectTypeOf(packs.get("package-name.pack-id")).toEqualTypeOf<CompendiumCollection.Any | undefined>();
    expectTypeOf(packs.get("package-name.pack-id", {})).toEqualTypeOf<CompendiumCollection.Any | undefined>();
    expectTypeOf(packs.get("package-name.pack-id", { strict: false })).toEqualTypeOf<
      CompendiumCollection.Any | undefined
    >();
    expectTypeOf(packs.get("package-name.pack-id", { strict: true })).toEqualTypeOf<CompendiumCollection.Any>();
    expectTypeOf(packs.get("package-name.pack-id", { strict: boolOrUndefined })).toEqualTypeOf<
      CompendiumCollection.Any | undefined
    >();
    expectTypeOf(packs.get("package-name.pack-id", { strict: trueOrUndefined })).toEqualTypeOf<
      CompendiumCollection.Any | undefined
    >();
    expectTypeOf(packs.get("package-name.pack-id", { strict: falseOrUndefined })).toEqualTypeOf<
      CompendiumCollection.Any | undefined
    >();

    // Because `CompendiumCollection#name` is always `CompendiumCollection`, at runtime the only call that *might* return something is
    // `game.packs.getName("CompendiumCollection")`, which will just return `game.packs.contents[0]` if it exists.
    expectTypeOf(packs.getName("name")).toEqualTypeOf<CompendiumCollection.Any | undefined>();
    expectTypeOf(packs.getName("name", {})).toEqualTypeOf<CompendiumCollection.Any | undefined>();
    expectTypeOf(packs.getName("name", { strict: false })).toEqualTypeOf<CompendiumCollection.Any | undefined>();
    expectTypeOf(packs.getName("name", { strict: true })).toEqualTypeOf<CompendiumCollection.Any>();
  });

  test("Setting and Deleting", () => {
    expectTypeOf(packs.set("package-name.pack-id", pack)).toEqualTypeOf<typeof packs>();

    expectTypeOf(packs.delete("package-name.pack-id")).toBeBoolean();
  });
});
