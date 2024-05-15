import { expectTypeOf } from "vitest";
import type { CompendiumOwnershipField } from "../../../../src/foundry/common/packages/base-package.d.mts";

const myPackage = new foundry.packages.BasePackage({
  id: "foobar",
});

const packageCompendia: foundry.data.fields.SchemaField.InnerInitializedType<{ ownership: CompendiumOwnershipField }> =
  {
    ownership: {
      ASSISTANT: "OBSERVER",
      //@ts-expect-error Foobar is not a valid value
      PLAYER: "foobar",
    },
  };

expectTypeOf(packageCompendia.ownership.ASSISTANT).toEqualTypeOf<
  keyof typeof foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS | undefined
>;

expectTypeOf(myPackage.id).toEqualTypeOf<string>();
expectTypeOf(myPackage.changelog).toEqualTypeOf<string | undefined>();

// TODO: Figure out if it's just a bad test or if there's underlying issues
expectTypeOf(myPackage._source.packs[0].banner).toEqualTypeOf<string | undefined>();
expectTypeOf(myPackage._source.authors).toEqualTypeOf<Array<PackageAuthorData> | undefined>();
expectTypeOf(myPackage.languages).toEqualTypeOf<Set<PackageLanguageData> | undefined>();
