import { expectTypeOf } from "vitest";
import type { AnyMutableObject } from "fvtt-types/utils";
import CompendiumArt = foundry.helpers.media.CompendiumArt;

const caInfo = { img: "some/path/art.webp", actor: "some/path/art.webp", token: { randomImg: false }, credit: "Me" };
expectTypeOf(caInfo).toExtend<CompendiumArt.Info>;

// @ts-expect-error Should reject object not matching prototype tokens schema
expectTypeOf({ token: { badKey: "1" } }).toExtend<CompendiumArt.Info>();

const compendiumArt = new foundry.helpers.media.CompendiumArt([
  ["test", caInfo],
  ["2", { token: "a/path" }],
]);
expectTypeOf(compendiumArt.FLAG).toEqualTypeOf<string>();
expectTypeOf(compendiumArt.SETTING).toEqualTypeOf<string>();
expectTypeOf(compendiumArt.enabled).toEqualTypeOf<boolean>();
expectTypeOf(
  compendiumArt.applyArt(Actor.implementation, { _id: "XXXXXSomeIDXXXXX" }),
).toEqualTypeOf<AnyMutableObject>();
expectTypeOf(
  compendiumArt.applyArt(Actor.implementation, { _id: "XXXXXSomeIDXXXXX" }, "some.pack"),
).toEqualTypeOf<AnyMutableObject>();
expectTypeOf(
  compendiumArt.applyArt(Actor.implementation, { _id: "XXXXXSomeIDXXXXX" }, undefined),
).toEqualTypeOf<AnyMutableObject>();

expectTypeOf(compendiumArt.getPackages()).toEqualTypeOf<CompendiumArt.Descriptor[]>();
expectTypeOf(compendiumArt["_registerArt"]()).toEqualTypeOf<Promise<void>>();
