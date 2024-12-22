import { expectTypeOf } from "vitest";
import CompendiumOwnershipField = foundry.common.packages.CompendiumOwnershipField;

const myPackage = new foundry.packages.BasePackage({
  id: "foobar",
});

const packageCompendia: foundry.data.fields.SchemaField.InnerInitializedType<{ ownership: CompendiumOwnershipField }> =
  {
    ownership: {
      ASSISTANT: "OBSERVER",
      // @ts-expect-error Foobar is not a valid value
      PLAYER: "foobar",
    },
  };

expectTypeOf(packageCompendia.ownership.ASSISTANT).toEqualTypeOf<
  keyof typeof foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS | undefined
>;

expectTypeOf(myPackage.id).toEqualTypeOf<string>();
expectTypeOf(myPackage.changelog).toEqualTypeOf<string | undefined>();

// Checking the sets
expectTypeOf(myPackage._source.packs[0].banner).toEqualTypeOf<string | undefined>();
expectTypeOf(myPackage._source.authors[0].discord).toEqualTypeOf<string | undefined>();
expectTypeOf(myPackage.languages.first()!.lang).toEqualTypeOf<string>();

// Checking packFolders
expectTypeOf(myPackage.packFolders.first()!.name).toEqualTypeOf<string>();
expectTypeOf(
  myPackage.packFolders.first()!.folders.first()!.folders.first()!.folders.first()!.name,
).toEqualTypeOf<string>();
// @ts-expect-error Folders property does not exist this deep
myPackage.packFolders.first()!.folders.first()!.folders.first()!.folders.first()!.folders;
