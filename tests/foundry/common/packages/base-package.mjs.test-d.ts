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

// TODO: Write tests for all of the sets
