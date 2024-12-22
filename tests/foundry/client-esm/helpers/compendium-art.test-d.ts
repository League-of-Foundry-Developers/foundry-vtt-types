import { expectTypeOf } from "vitest";
import types = foundry.helpers;

const caInfo = { actor: "actorId", token: { randomImg: false }, credit: "Me" };
expectTypeOf(caInfo).toMatchTypeOf<types.CompendiumArtInfo>;

// @ts-expect-error Should reject object not matching prototype tokens schema
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const caError: types.CompendiumArtInfo = { token: { badKey: "1" } };

const compendiumArt = new foundry.helpers.CompendiumArt([
  ["test", caInfo],
  ["2", { token: "a/path" }],
]);
expectTypeOf(compendiumArt.FLAG).toEqualTypeOf<string>;
expectTypeOf(compendiumArt.SETTING).toEqualTypeOf<string>;
expectTypeOf(compendiumArt.enabled).toEqualTypeOf<boolean>;
expectTypeOf(compendiumArt.getPackages()).toEqualTypeOf<types.CompendiumArtDescriptor[]>;
