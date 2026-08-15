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
  Brand,
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
  IsObject,
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
  ParseUUID,
  ParseUuid2,
  UnionToIntersection,
  // GetProperty,
  // PartialUntilInitialized,
  // Mutable,
} from "fvtt-types/utils";
import type { Document } from "#common/abstract/_module.d.mts";
import {
  actorUUID,
  compendiumActorUUID,
  tokenUUID,
  greatGreatGrandchildUUID,
  compendiumGreatGreatGrandchildUUID,
  relativeItemUUID,
} from "#tests/client/utils/helpers.test-d.ts";

import collections = foundry.documents.collections;

expectTypeOf<GetKey<{ abc: string }, "foo">>().toEqualTypeOf<never>();

expectTypeOf<GetKey<{ abc: string }, "abc">>().toEqualTypeOf<string>();

expectTypeOf<GetKey<{ abc: number }, "abc">>().toEqualTypeOf<number>();

expectTypeOf<GetKey<object, "abc", "default">>().toEqualTypeOf<"default">();

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
expectTypeOf<GetKey<{}, "abc", "default">>().toEqualTypeOf<"default">();

expectTypeOf<GetKey<Record<string, unknown>, "abc", "default">>().toEqualTypeOf<unknown>();
expectTypeOf<GetKey<any, "abc", "default">>().toEqualTypeOf<any>();

// It would be better if `K` was covariant like `T[K]` is but this seems difficult to achieve.
interface _GetKeyVariance<out T, K extends PropertyKey, out D> {
  x: GetKey<T, K, D>;
}

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

expectTypeOf<IsObject<string>>().toEqualTypeOf<false>();

// A more naive type would count a branded string as an object because `string & { brand: 123 }` extends `object`.
expectTypeOf<IsObject<Brand<string, "foo">>>().toEqualTypeOf<false>();
expectTypeOf<IsObject<Brand<{ foo: 123 }, "foo">>>().toEqualTypeOf<true>();

// eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
expectTypeOf<IsObject<String>>().toEqualTypeOf<true>();

declare class Class {
  static foo: number;
  bar: string;
}

expectTypeOf<IsObject<typeof Class>>().toEqualTypeOf<false>();

// interface style classes.
expectTypeOf<IsObject<typeof URL>>().toEqualTypeOf<false>();

// AddEventListenerOptions really is just an object at runtime.
expectTypeOf<IsObject<AddEventListenerOptions>>().toEqualTypeOf<true>();

// Unfortunately a class instance is completely indistinguishable from an interface. Permissively
// returns `true`
expectTypeOf<IsObject<Class>>().toEqualTypeOf<true>();

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

mustBeValidUuid(actorUUID, "Actor");
// @ts-expect-error `Actor`s aren't `Token`s
mustBeValidUuid(actorUUID, "Token");

mustBeValidUuid(compendiumActorUUID, "Actor");
// @ts-expect-error `Actor`s aren't `Token`s
mustBeValidUuid(compendiumActorUUID, "Token");

mustBeValidUuid(tokenUUID, "Token");
// @ts-expect-error `Token`s aren't `User`s
mustBeValidUuid(tokenUUID, "User");

mustBeValidUuid(greatGreatGrandchildUUID, "ActiveEffect");
// @ts-expect-error `ActiveEffect`s aren't `FogExploration`s
mustBeValidUuid(greatGreatGrandchildUUID, "FogExploration");

mustBeValidUuid(compendiumGreatGreatGrandchildUUID, "ActiveEffect");
// @ts-expect-error `ActiveEffect`s aren't `Macro`s
mustBeValidUuid(compendiumGreatGreatGrandchildUUID, "Macro");

mustBeValidUuid(relativeItemUUID, "Item");
type _p = ParseUuid2<"Actor.foo.Item.bar", Macro.Stored>;
type _y = _p["collection"];

// @ts-expect-error `Item`s aren't `RollTable`s
mustBeValidUuid(relativeItemUUID, "RollTable");

// GetNameFromUuid:

expectTypeOf<GetNameFromUuid<string>>().toBeNever();
expectTypeOf<GetNameFromUuid<typeof actorUUID>>().toEqualTypeOf<"Actor">();
expectTypeOf<GetNameFromUuid<typeof compendiumActorUUID>>().toEqualTypeOf<"Actor">();
expectTypeOf<GetNameFromUuid<typeof tokenUUID>>().toEqualTypeOf<"Token">();
expectTypeOf<GetNameFromUuid<typeof greatGreatGrandchildUUID>>().toEqualTypeOf<"ActiveEffect">();
expectTypeOf<GetNameFromUuid<typeof relativeItemUUID>>().toEqualTypeOf<"Item">();
expectTypeOf<GetNameFromUuid<typeof relativeItemUUID | typeof tokenUUID>>().toEqualTypeOf<"Item" | "Token">();

// ParseUuid:

const _worldActorUUID = "Actor.foo";
declare const pActorUuid: ParseUuid2<typeof _worldActorUUID>;
expectTypeOf(pActorUuid.originalUuid).toEqualTypeOf<"Actor.foo">();
expectTypeOf(pActorUuid.error).toEqualTypeOf<null>();
expectTypeOf(pActorUuid.valid).toEqualTypeOf<true>();
expectTypeOf(pActorUuid.type).toEqualTypeOf<"Actor">();
expectTypeOf(pActorUuid.collection).toEqualTypeOf<foundry.documents.collections.Actors.Implementation>();
expectTypeOf(pActorUuid.embedded).toEqualTypeOf<[]>();
expectTypeOf(pActorUuid.primaryType).toEqualTypeOf<undefined>();
expectTypeOf(pActorUuid.primaryId).toEqualTypeOf<undefined>();
expectTypeOf(pActorUuid.documentType).toEqualTypeOf<"Actor">();
expectTypeOf(pActorUuid.isCompendium).toEqualTypeOf<false>();
expectTypeOf(pActorUuid.isEmbedded).toEqualTypeOf<false>();
expectTypeOf(pActorUuid.relative).toEqualTypeOf<[]>();

declare const pActorUuidWrongExpected: ParseUuid2<typeof _worldActorUUID, Macro.Stored>;
expectTypeOf(pActorUuidWrongExpected.originalUuid).toEqualTypeOf<"Actor.foo">();
expectTypeOf(
  pActorUuidWrongExpected.error,
).toEqualTypeOf<"Provided expected document type `Macro` does not match parsed type `Actor` for UUID 'Actor.foo'">();
expectTypeOf(pActorUuidWrongExpected.valid).toEqualTypeOf<false>();
expectTypeOf(pActorUuidWrongExpected.type).toEqualTypeOf<"Actor">();
expectTypeOf(pActorUuidWrongExpected.collection).toEqualTypeOf<foundry.documents.collections.Actors.Implementation>();
expectTypeOf(pActorUuidWrongExpected.embedded).toEqualTypeOf<[]>();
expectTypeOf(pActorUuidWrongExpected.primaryType).toEqualTypeOf<undefined>();
expectTypeOf(pActorUuidWrongExpected.primaryId).toEqualTypeOf<undefined>();
expectTypeOf(pActorUuidWrongExpected.documentType).toEqualTypeOf<"Actor">();
expectTypeOf(pActorUuidWrongExpected.isCompendium).toEqualTypeOf<false>();
expectTypeOf(pActorUuidWrongExpected.isEmbedded).toEqualTypeOf<false>();
expectTypeOf(pActorUuidWrongExpected.relative).toEqualTypeOf<[]>();

const _malformedUuid = "Actor.foo.bar";
declare const pMalformedUuid: ParseUuid2<typeof _malformedUuid>;
// TODO

const _compendiumActorUuid = "Compendium.world.a.Actor.foo";
declare const pCompendiumActorUuid: ParseUuid2<typeof _compendiumActorUuid>;
expectTypeOf(pCompendiumActorUuid.originalUuid).toEqualTypeOf<typeof _compendiumActorUuid>();
expectTypeOf(pCompendiumActorUuid.error).toEqualTypeOf<null>();
expectTypeOf(pCompendiumActorUuid.valid).toEqualTypeOf<true>();
expectTypeOf(pCompendiumActorUuid.type).toEqualTypeOf<"Actor">();
expectTypeOf(pCompendiumActorUuid.collection).toEqualTypeOf<
  collections.CompendiumCollection<"Actor"> | collections.CompendiumCollection<"Scene">
>();
expectTypeOf(pCompendiumActorUuid.embedded).toEqualTypeOf<[]>();
expectTypeOf(pCompendiumActorUuid.primaryType).toEqualTypeOf<undefined>();
expectTypeOf(pCompendiumActorUuid.primaryId).toEqualTypeOf<undefined>();
expectTypeOf(pCompendiumActorUuid.documentType).toEqualTypeOf<"Actor">();
expectTypeOf(pCompendiumActorUuid.isCompendium).toEqualTypeOf<true>();
expectTypeOf(pCompendiumActorUuid.isEmbedded).toEqualTypeOf<false>();
expectTypeOf(pCompendiumActorUuid.relative).toEqualTypeOf<[]>();

const _playlistSoundUuid = "Playlist.foo.PlaylistSound.Bar";
declare const pPlaylistSoundUuid: ParseUuid2<typeof _playlistSoundUuid>;
expectTypeOf(pPlaylistSoundUuid.originalUuid).toEqualTypeOf<typeof _playlistSoundUuid>();
expectTypeOf(pPlaylistSoundUuid.error).toEqualTypeOf<null>();
expectTypeOf(pPlaylistSoundUuid.valid).toEqualTypeOf<true>();
expectTypeOf(pPlaylistSoundUuid.type).toEqualTypeOf<"PlaylistSound">();
expectTypeOf(pPlaylistSoundUuid.collection).toEqualTypeOf<collections.Playlists.Implementation>();
expectTypeOf(pPlaylistSoundUuid.embedded).toEqualTypeOf<["PlaylistSound", string]>();
expectTypeOf(pPlaylistSoundUuid.primaryType).toEqualTypeOf<"Playlist">();
expectTypeOf(pPlaylistSoundUuid.primaryId).toEqualTypeOf<string>();
expectTypeOf(pPlaylistSoundUuid.documentType).toEqualTypeOf<"Playlist">();
expectTypeOf(pPlaylistSoundUuid.isCompendium).toEqualTypeOf<false>();
expectTypeOf(pPlaylistSoundUuid.isEmbedded).toEqualTypeOf<true>();
expectTypeOf(pPlaylistSoundUuid.relative).toEqualTypeOf<[]>();

const _greatGreatGrandChildAEUuid = "Scene.foo.Token.bar.Actor.baz.Item.fizz.ActiveEffect.buzz";
declare const pGreatGreatGrandChildAEUuid: ParseUuid2<typeof _greatGreatGrandChildAEUuid>;
expectTypeOf(pGreatGreatGrandChildAEUuid.originalUuid).toEqualTypeOf<typeof _greatGreatGrandChildAEUuid>();
expectTypeOf(pGreatGreatGrandChildAEUuid.error).toEqualTypeOf<null>();
expectTypeOf(pGreatGreatGrandChildAEUuid.valid).toEqualTypeOf<true>();
expectTypeOf(pGreatGreatGrandChildAEUuid.type).toEqualTypeOf<"ActiveEffect">();
expectTypeOf(pGreatGreatGrandChildAEUuid.collection).toEqualTypeOf<
  collections.Actors.Implementation | collections.Items.Implementation
>();
expectTypeOf(pGreatGreatGrandChildAEUuid.embedded).toEqualTypeOf<
  ["Token", string, "Actor", string, "Item", string, "ActiveEffect", string]
>();
expectTypeOf(pGreatGreatGrandChildAEUuid.primaryType).toEqualTypeOf<"Scene">();
expectTypeOf(pGreatGreatGrandChildAEUuid.primaryId).toEqualTypeOf<string>();
expectTypeOf(pGreatGreatGrandChildAEUuid.documentType).toEqualTypeOf<"Scene">();
expectTypeOf(pGreatGreatGrandChildAEUuid.isCompendium).toEqualTypeOf<false>();
expectTypeOf(pGreatGreatGrandChildAEUuid.isEmbedded).toEqualTypeOf<true>();
expectTypeOf(pGreatGreatGrandChildAEUuid.relative).toEqualTypeOf<[]>();

declare const pStringUuidNoExpected: ParseUuid2<string>;
expectTypeOf(pStringUuidNoExpected.originalUuid).toEqualTypeOf<string>();
expectTypeOf(
  pStringUuidNoExpected.error,
).toEqualTypeOf<"A document type to be expected must be provided with unknown (`string`-typed) UUIDs.">();
expectTypeOf(pStringUuidNoExpected.valid).toEqualTypeOf<false>();
expectTypeOf(pStringUuidNoExpected.type).toEqualTypeOf<Document.Type>();
expectTypeOf(pStringUuidNoExpected.collection).toEqualTypeOf<undefined>();
expectTypeOf(pStringUuidNoExpected.embedded).toEqualTypeOf<[]>();
expectTypeOf(pStringUuidNoExpected.primaryType).toEqualTypeOf<undefined>();
expectTypeOf(pStringUuidNoExpected.primaryId).toEqualTypeOf<undefined>();
expectTypeOf(pStringUuidNoExpected.documentType).toEqualTypeOf<Document.Type>();
expectTypeOf(pStringUuidNoExpected.isCompendium).toEqualTypeOf<boolean>();
expectTypeOf(pStringUuidNoExpected.isEmbedded).toEqualTypeOf<boolean>();
expectTypeOf(pStringUuidNoExpected.relative).toEqualTypeOf<[]>();

declare const pStringUuidWithExpectedActor: ParseUuid2<string, Actor.Stored>;
expectTypeOf(pStringUuidWithExpectedActor.originalUuid).toEqualTypeOf<string>();
expectTypeOf(pStringUuidWithExpectedActor.error).toEqualTypeOf<null>();
expectTypeOf(pStringUuidWithExpectedActor.valid).toEqualTypeOf<true>();
expectTypeOf(pStringUuidWithExpectedActor.type).toEqualTypeOf<"Actor">();
expectTypeOf(pStringUuidWithExpectedActor.collection).toEqualTypeOf<
  | collections.Actors.Implementation
  | collections.CompendiumCollection<"Actor">
  | collections.CompendiumCollection<"Scene">
  | undefined
>();
expectTypeOf(pStringUuidWithExpectedActor.embedded).toEqualTypeOf<string[]>();
expectTypeOf(pStringUuidWithExpectedActor.primaryType).toEqualTypeOf<"Scene" | undefined>();
expectTypeOf(pStringUuidWithExpectedActor.primaryId).toEqualTypeOf<undefined>();
expectTypeOf(pStringUuidWithExpectedActor.documentType).toEqualTypeOf<"Actor">();
expectTypeOf(pStringUuidWithExpectedActor.isCompendium).toEqualTypeOf<boolean>();
expectTypeOf(pStringUuidWithExpectedActor.isEmbedded).toEqualTypeOf<boolean>();
expectTypeOf(pStringUuidWithExpectedActor.relative).toEqualTypeOf<[]>();

declare const pStringUuidWithExpectedActorRelatedScene: ParseUuid2<string, Actor.Stored, Scene.Stored>;
expectTypeOf(pStringUuidWithExpectedActorRelatedScene.originalUuid).toEqualTypeOf<string>();
expectTypeOf(pStringUuidWithExpectedActorRelatedScene.error).toEqualTypeOf<null>();
expectTypeOf(pStringUuidWithExpectedActorRelatedScene.valid).toEqualTypeOf<true>();
expectTypeOf(pStringUuidWithExpectedActorRelatedScene.type).toEqualTypeOf<"Actor">();
expectTypeOf(pStringUuidWithExpectedActorRelatedScene.collection).toEqualTypeOf<
  collections.Scenes.Implementation | collections.CompendiumCollection<"Scene">
>();
expectTypeOf(pStringUuidWithExpectedActorRelatedScene.embedded).toEqualTypeOf<string[]>();
expectTypeOf(pStringUuidWithExpectedActorRelatedScene.primaryType).toEqualTypeOf<"Scene">();
expectTypeOf(pStringUuidWithExpectedActorRelatedScene.primaryId).toEqualTypeOf<string>();
expectTypeOf(pStringUuidWithExpectedActorRelatedScene.documentType).toEqualTypeOf<"Scene">();
expectTypeOf(pStringUuidWithExpectedActorRelatedScene.isCompendium).toEqualTypeOf<boolean>();
expectTypeOf(pStringUuidWithExpectedActorRelatedScene.isEmbedded).toEqualTypeOf<true>();
expectTypeOf(pStringUuidWithExpectedActorRelatedScene.relative).toEqualTypeOf<[]>();

declare const pStringUuidWithExpectedActorRelatedMacro: ParseUuid2<string, Actor.Stored, Macro.Stored>;
expectTypeOf(pStringUuidWithExpectedActorRelatedMacro.originalUuid).toEqualTypeOf<string>();
expectTypeOf(
  pStringUuidWithExpectedActorRelatedMacro.error,
).toEqualTypeOf<"The provided Relative document is of type `Macro`, which is neither identical to nor an ancestor of the provided Expected document's type `Actor`.">();
expectTypeOf(pStringUuidWithExpectedActorRelatedMacro.valid).toEqualTypeOf<false>();
expectTypeOf(pStringUuidWithExpectedActorRelatedMacro.type).toEqualTypeOf<"Actor">();
expectTypeOf(pStringUuidWithExpectedActorRelatedMacro.collection).toEqualTypeOf<undefined>();
expectTypeOf(pStringUuidWithExpectedActorRelatedMacro.embedded).toEqualTypeOf<string[]>();
expectTypeOf(pStringUuidWithExpectedActorRelatedMacro.primaryType).toEqualTypeOf<undefined>();
expectTypeOf(pStringUuidWithExpectedActorRelatedMacro.primaryId).toEqualTypeOf<undefined>();
expectTypeOf(pStringUuidWithExpectedActorRelatedMacro.documentType).toEqualTypeOf<Document.Type>();
expectTypeOf(pStringUuidWithExpectedActorRelatedMacro.isCompendium).toEqualTypeOf<boolean>();
expectTypeOf(pStringUuidWithExpectedActorRelatedMacro.isEmbedded).toEqualTypeOf<boolean>();
expectTypeOf(pStringUuidWithExpectedActorRelatedMacro.relative).toEqualTypeOf<[]>();

// TODO: Quote

expectTypeOf<SplitString<"", ".">>().toEqualTypeOf<[]>();
expectTypeOf<SplitString<"abc", "">>().toEqualTypeOf<["a", "b", "c"]>();
expectTypeOf<SplitString<"lorem.ipusm", ".">>().toEqualTypeOf<["lorem", "ipusm"]>();
expectTypeOf<SplitString<"" | "a" | "b.c" | "d.e.f", ".">>().toEqualTypeOf<[] | ["a"] | ["b", "c"] | ["d", "e", "f"]>();

// TODO: DeepReadonly

type CycleA = { a: { b: { c: CycleX } } };
type CycleX = { x: { y: { z: CycleA } } };

expectTypeOf<DotKeys<CycleA>>().toEqualTypeOf<"a" | "a.b" | "a.b.c" | "a.b.c.x" | "a.b.c.x.y" | "a.b.c.x.y.z">();
