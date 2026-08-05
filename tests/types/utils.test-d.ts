// tests for /types/utils/index.d.mts

import { assertType, expectTypeOf } from "vitest";
import type {
  // FixedInstanceType,
  // LoggingLevels,
  GetKey,
  IntentionalPartial,
  OverlapsWith,
  ArrayOverlaps,
  MakeConform,
  MustConform,
  InterfaceToObject,
  ConformRecord,
  // ToMethod,
  // MaybeEmpty,
  // PropertiesOfType,
  // Brand,
  // PrettifyType,
  // UnionToIntersection,
  DeepPartial,
  AllKeysOf,
  // InexactPartial,
  // NullishProps,
  Expanded,
  // ValueOf,
  // ConcreteKeys,
  // RemoveIndexSignatures,
  Titlecase,
  // Merge,
  Override,
  // IsObject,
  // SimpleMerge,
  RequiredProps,
  // Mixin,
  // GetDataReturnType,
  // HandleEmptyObject,
  // AnyObject,
  // AnyMutableObject,
  // MaybeArray,
  // AnyArray,
  // MutableArray,
  // AnyFunction,
  // AnyConstructor,
  // AnyConcreteConstructor,
  // MustBePromise,
  MaybePromise,
  // NonNullish,
  // EmptyObject,
  // ShapeWithIndexSignature,
  // Quote,
  MustBeValidUuid,
  GetNameFromUuid,
  // ParseUUID,
  // Coalesce,
  // NullishCoalesce,
  // CoalesceNever,
  // EarlierHook,
  // InitializationHook,
  // HooksRan,
  // InitializedOn,
  // Identity,
  // DiscriminatedUnion,
  // PickValue,
  // JSONValue,
  // PhantomConstructor,
  SplitString,
  // DeepReadonly,
  // MutableDotKeys,
  // DeletableDotKeys,
  DotKeys,
  // GetProperty,
  // PartialUntilInitialized,
  // Mutable,
} from "fvtt-types/utils";
import type { Document } from "#common/abstract/_module.d.mts";

expectTypeOf<GetKey<{ abc: string }, "foo">>().toEqualTypeOf<never>();

expectTypeOf<GetKey<{ abc: string }, "abc">>().toEqualTypeOf<string>();

expectTypeOf<GetKey<{ abc: number }, "abc">>().toEqualTypeOf<number>();

expectTypeOf<IntentionalPartial<{ abc: number }>>().toEqualTypeOf<{ abc?: number }>();

expectTypeOf<OverlapsWith<7, number>>().toEqualTypeOf<7>();
expectTypeOf<OverlapsWith<"abc", number>>().toEqualTypeOf<number>();
expectTypeOf<OverlapsWith<string | number, string>>().toEqualTypeOf<string | number>();

expectTypeOf<ArrayOverlaps<number[], number>>().toEqualTypeOf<number[]>();
expectTypeOf<ArrayOverlaps<number[], string>>().toEqualTypeOf<readonly string[]>();

expectTypeOf<MakeConform<string, { abc: number }, { abc: number; def: string }>>().toEqualTypeOf<{
  abc: number;
  def: string;
}>();
expectTypeOf<MakeConform<string, { abc: number }>>().toEqualTypeOf<{ abc: number }>();
expectTypeOf<MakeConform<{ abc: number; def: number }, { abc: number }>>().toEqualTypeOf<{
  abc: number;
  def: number;
}>();

// @ts-expect-error string doesn't conform
expectTypeOf<MustConform<string, { abc: number }>>().toEqualTypeOf<{ abc: number; def: string }>();
expectTypeOf<MustConform<{ abc: number; def: number }, { abc: number }>>().toEqualTypeOf<{
  abc: number;
  def: number;
}>();

class TestClass {
  #abc: number;
  def: string;

  constructor() {
    this.#abc = 0;
    this.def = "";
  }
}

expectTypeOf<TestClass>().not.toEqualTypeOf<{ def: string }>();
expectTypeOf<InterfaceToObject<TestClass>>().toEqualTypeOf<{ def: string }>();

expectTypeOf<ConformRecord<{ abc: { ghi: number } }, { def: string }>>().toEqualTypeOf<{ abc: { def: string } }>();
expectTypeOf<ConformRecord<{ abc: { def: string; ghi: number } }, { def: string }>>().toEqualTypeOf<{
  abc: { def: string; ghi: number };
}>();

// TODO: ToMethod
// TODO: MaybeEmpty

// TODO: PropertiesOfType
// TODO: Brand
// TODO: PrettifyType
// TODO: PrettifyTypeDeep
// TODO: UnionToIntersection

// @ts-expect-error Ideally an empty object should always be assignable to `DeepPartial` but currently it isn't.
function _emptyMustBeAssignable<T extends object>(_partial: DeepPartial<T> = {}): void {}

expectTypeOf<DeepPartial<{ a: string }>>().toEqualTypeOf<{ a?: string }>();
expectTypeOf<DeepPartial<{ a: { b: string } }>>().toEqualTypeOf<{ a?: { b?: string } }>();

expectTypeOf<AllKeysOf<{ a: string }>>().toEqualTypeOf<"a">();
expectTypeOf<AllKeysOf<{ a: string; b: number }>>().toEqualTypeOf<"a" | "b">();
expectTypeOf<AllKeysOf<{ a: string } | { b: string }>>().toEqualTypeOf<"a" | "b">();

// TODO: InexactPartial
// TODO: NullishProps

expectTypeOf<Expanded<{ foo: string }>>().toEqualTypeOf<{ foo: string }>();
expectTypeOf<Expanded<{ "foo.bar": string }>>().toEqualTypeOf<{ foo: { bar: string } }>();
expectTypeOf<Expanded<{ "foo.bar": string[] }>>().toEqualTypeOf<{ foo: { bar: string[] } }>();
expectTypeOf<Expanded<{ foo: { "bar.baz": string } }>>().toEqualTypeOf<{ foo: { bar: { baz: string } } }>();
expectTypeOf<Expanded<{ "foo.bar": string; "baz.qux": string }>>().toEqualTypeOf<{
  foo: { bar: string };
  baz: { qux: string };
}>();
expectTypeOf<Expanded<{ "foo.bar": string; baz: { qux: string } }>>().toEqualTypeOf<{
  foo: { bar: string };
  baz: { qux: string };
}>();
expectTypeOf<Expanded<{ "foo.bar": string | number }>>().toEqualTypeOf<{ foo: { bar: string | number } }>();
expectTypeOf<Expanded<{ foo: { bar: string } | { baz: number } }>>().toEqualTypeOf<{
  foo: { bar: string } | { baz: number };
}>();
expectTypeOf<Expanded<{ "foo.bar"?: string }>>().toEqualTypeOf<{ foo?: { bar: string | undefined } }>();

// TODO: ValueOf
// TODO: ConcreteKeys
// TODO: RemoveIndexSignatures

expectTypeOf<Titlecase<"">>().toEqualTypeOf<"">();
expectTypeOf<Titlecase<" ">>().toEqualTypeOf<" ">();
expectTypeOf<Titlecase<"42">>().toEqualTypeOf<"42">();
expectTypeOf<Titlecase<"foobar">>().toEqualTypeOf<"Foobar">();
expectTypeOf<Titlecase<"FOOBAR">>().toEqualTypeOf<"Foobar">();
expectTypeOf<Titlecase<"foo bar">>().toEqualTypeOf<"Foo Bar">();
expectTypeOf<Titlecase<"foo  bar">>().toEqualTypeOf<"Foo  Bar">();
expectTypeOf<Titlecase<"foo bar baz">>().toEqualTypeOf<"Foo Bar Baz">();

type Override1 = Override<{ foo: number; bar: string }, { foo: string }>;

const _overridden1: Override1 = { foo: "foo", bar: "bar" };

// @ts-expect-error - `overridden` should be essentially equivalent to `{ foo: string; bar: string }`
const _a: Override1 = { foo: 123, bar: "bar" };

type Override2 = Override<{ foo: boolean[]; bar: string }, { foo: string }>;

const _overridden2: Override2 = { foo: "foo", bar: "bar" };

// @ts-expect-error - In principle this should work but the variance of `Override` is overly
// conservative. We could force `Override` to have a structural comparison but I simply don't see
// the point right now.
const _b: Override1 = _overridden2;

// @ts-expect-error - See above.
const _c: Override2 = _overridden1;

type Override3 = Override<{ foo: 123; bar: "bar" }, { foo: "foo" }>;

const _overridden3: Override3 = { foo: "foo", bar: "bar" };

const _d: Override1 = _overridden3;

// @ts-expect-error - `_overridden1` is wider than `_overridden3`.
// This is essentially trying to assign `{ foo: string; bar: string }` to `{ foo: "foo"; bar: "bar" }`.
const _e: Override3 = _overridden1;

// TODO: Merge
// TODO: IsObject
// TODO: SimpleMerge

// we need to test with `assertType` because the types are not considered equal, even though they are structurally the same
type A = { foo?: string; bar?: number; baz: boolean };
type B = { foo: string; bar?: number; baz: boolean };
declare const someVariable: RequiredProps<A, "foo">;
declare const someOtherVariable: B;
assertType<B>(someVariable);
assertType<RequiredProps<A, "foo">>(someOtherVariable);

// TODO: Mixin
// TODO: GetDataReturnType
// TODO: HandleEmptyObject
// TODO: AnyObject
// TODO: AnyMutableObject
// TODO: AnyArray
// TODO: MutableArray
// TODO: AnyFunction
// TODO: AnyConstructor
// TODO: AnyConcreteConstructor
// TODO: MustBePromise

const numberMaybePromise = 0 as MaybePromise<number>;
expectTypeOf(await numberMaybePromise).toEqualTypeOf<number>();

// TODO: NonNullish
// TODO: EmptyObject
// TODO: ShapeWithIndexSignature

// MustBeValidUuid:

declare const actorUuid: "Actor.ARandomIDToTest";
declare const tokenUuid: "Scene.ARandomIDToTest.Token.ARandomIDToTest";
declare const compendiumActorUuid: "Compendium.world.a.Actor.ARandomIDToTest";
declare const greatGreatGrandchildUuid: "Scene.ARandomIDToTest.Token.ARandomIDToTest.Actor.ARandomIDToTest.Item.ARandomIDToTest.ActiveEffect.ARandomIDToTest";
declare const compendiumGreatGreatGrandchildUuid: "Compendium.world.pack-name.Scene.ARandomIDToTest.Token.ARandomIDToTest.Actor.ARandomIDToTest.Item.ARandomIDToTest.ActiveEffect.ARandomIDToTest";

// fallback to 'any of the provided type, if any' if the provided UUID is untestable
expectTypeOf<MustBeValidUuid<string>>().toEqualTypeOf<
  | `${string}.${string}.${Document.EmbeddedType | "Actor"}.${string}`
  | `${Document.WorldType}.${string}`
  | `Compendium.${string}.${string}.${Exclude<Document.Type, Document.NeverCompendiumType>}.${string}`
>();

// `Actor`s can have World, Compendium, or Embedded UUIDs
expectTypeOf<MustBeValidUuid<string, "Actor">>().toEqualTypeOf<
  `${string}.${string}.Actor.${string}` | `Actor.${string}` | `Compendium.${string}.${string}.Actor.${string}`
>();

// `Setting`s cannot have Compendium or Embedded UUIDs, only World
expectTypeOf<MustBeValidUuid<string, "Setting">>().toEqualTypeOf<`Setting.${string}`>();

// `PlaylistSounds` cannot have World UUIDs, only Embedded or Compendium
expectTypeOf<MustBeValidUuid<string, "PlaylistSound">>().toEqualTypeOf<
  `${string}.${string}.PlaylistSound.${string}` | `Compendium.${string}.${string}.PlaylistSound.${string}`
>();

// `Adventure`s cannot have Compendium or Embedded UUIDs, only Compendium
expectTypeOf<
  MustBeValidUuid<string, "Adventure">
>().toEqualTypeOf<`Compendium.${string}.${string}.Adventure.${string}`>();

declare function mustBeValidUuid<Uuid extends string, Name extends Document.Type = Document.Type>(
  uuid: MustBeValidUuid<Uuid, NoInfer<Name>>,
  docName?: Name,
): void;

mustBeValidUuid(actorUuid, "Actor");
// @ts-expect-error `Actor`s aren't `Token`s
mustBeValidUuid(actorUuid, "Token");

mustBeValidUuid(compendiumActorUuid, "Actor");
// @ts-expect-error `Actor`s aren't `Token`s
mustBeValidUuid(compendiumActorUuid, "Token");

mustBeValidUuid(tokenUuid, "Token");
// @ts-expect-error `Token`s aren't `User`s
mustBeValidUuid(tokenUuid, "User");

mustBeValidUuid(greatGreatGrandchildUuid, "ActiveEffect");
// @ts-expect-error `ActiveEffect`s aren't `FogExploration`s
mustBeValidUuid(greatGreatGrandchildUuid, "FogExploration");

mustBeValidUuid(compendiumGreatGreatGrandchildUuid, "ActiveEffect");
// @ts-expect-error `ActiveEffect`s aren't `Macro`s
mustBeValidUuid(compendiumGreatGreatGrandchildUuid, "Macro");

// GetNameFromUuid:

expectTypeOf<GetNameFromUuid<string>>().toBeNever();
expectTypeOf<GetNameFromUuid<typeof actorUuid>>().toEqualTypeOf<"Actor">();
expectTypeOf<GetNameFromUuid<typeof compendiumActorUuid>>().toEqualTypeOf<"Actor">();
expectTypeOf<GetNameFromUuid<typeof tokenUuid>>().toEqualTypeOf<"Token">();
expectTypeOf<GetNameFromUuid<typeof greatGreatGrandchildUuid>>().toEqualTypeOf<"ActiveEffect">();

// TODO: Quote

expectTypeOf<SplitString<"", ".">>().toEqualTypeOf<[]>();
expectTypeOf<SplitString<"abc", "">>().toEqualTypeOf<["a", "b", "c"]>();
expectTypeOf<SplitString<"lorem.ipusm", ".">>().toEqualTypeOf<["lorem", "ipusm"]>();
expectTypeOf<SplitString<"" | "a" | "b.c" | "d.e.f", ".">>().toEqualTypeOf<[] | ["a"] | ["b", "c"] | ["d", "e", "f"]>();

// TODO: DeepReadonly

type CycleA = { a: { b: { c: CycleX } } };
type CycleX = { x: { y: { z: CycleA } } };

expectTypeOf<DotKeys<CycleA>>().toEqualTypeOf<"a" | "a.b" | "a.b.c" | "a.b.c.x" | "a.b.c.x.y" | "a.b.c.x.y.z">();
