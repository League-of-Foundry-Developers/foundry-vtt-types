// tests for /types/utils/index.d.mts

import { assertType, expectTypeOf } from "vitest";
import type {
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
  // PrettifyTypeDeep,
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
  // IsObject,
  // SimpleMerge,
  RequiredProps,
  // Mixin,
  // GetDataReturnType,
  // HandleEmptyObject,
  // AnyObject,
  // AnyMutableObject,
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
  // MustBeValidUuid,
  // Quote,
  SplitString,
} from "fvtt-types/utils";

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

// @ts-expect-error - string doesn't conform
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

// An empty object should always be assignable to `DeepPartial`.
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
// TODO: MustBeValidUuid
// TODO: Quote

expectTypeOf<SplitString<"", ".">>().toEqualTypeOf<[]>();
expectTypeOf<SplitString<"abc", "">>().toEqualTypeOf<["a", "b", "c"]>();
expectTypeOf<SplitString<"lorem.ipusm", ".">>().toEqualTypeOf<["lorem", "ipusm"]>();
expectTypeOf<SplitString<"" | "a" | "b.c" | "d.e.f", ".">>().toEqualTypeOf<[] | ["a"] | ["b", "c"] | ["d", "e", "f"]>();
