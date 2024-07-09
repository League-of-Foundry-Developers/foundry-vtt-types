import { expectTypeOf } from "vitest";
import type { CompendiumArtDescriptor } from "../../../../src/foundry/client-esm/helpers/_types.d.mts";

// should be able to constructed from iterable
const compendiumArt = new foundry.helpers.CompendiumArt([
  ["test", { actor: "actorId", token: "/a/path/to/image", credit: "Me" }],
]);

expectTypeOf(compendiumArt.FLAG).toEqualTypeOf<string>;
expectTypeOf(compendiumArt.SETTING).toEqualTypeOf<string>;
expectTypeOf(compendiumArt.enabled).toEqualTypeOf<boolean>;
expectTypeOf(compendiumArt.getPackages()).toEqualTypeOf<CompendiumArtDescriptor[]>;
