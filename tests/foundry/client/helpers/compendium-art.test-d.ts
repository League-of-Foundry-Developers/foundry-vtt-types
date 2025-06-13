import { expectTypeOf } from "vitest";
import CompendiumArt = foundry.helpers.media.CompendiumArt;

const caInfo = { actor: "actorId", token: { randomImg: false }, credit: "Me" };
expectTypeOf(caInfo).toExtend<CompendiumArt.Info>;

// @ts-expect-error Should reject object not matching prototype tokens schema
expectTypeOf({ token: { badKey: "1" } }).not.toExtend<CompendiumArt.Info>();

const compendiumArt = new foundry.helpers.media.CompendiumArt([
  ["test", caInfo],
  ["2", { token: "a/path" }],
]);
expectTypeOf(compendiumArt.FLAG).toEqualTypeOf<string>;
expectTypeOf(compendiumArt.SETTING).toEqualTypeOf<string>;
expectTypeOf(compendiumArt.enabled).toEqualTypeOf<boolean>;
expectTypeOf(compendiumArt.getPackages()).toEqualTypeOf<CompendiumArt.Descriptor[]>;
