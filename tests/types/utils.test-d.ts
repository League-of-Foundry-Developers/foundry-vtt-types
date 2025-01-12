import { assertType, expectTypeOf } from "vitest";
import type { DeepPartial, Expanded, MaybePromise, RequiredProps, Titlecase } from "fvtt-types/utils";
import Document = foundry.abstract.Document;

// An empty object should always be assignable to `DeepPartial`.
function _emptyMustBeAssignable<T extends object>(_partial: DeepPartial<T> = {}): void {}

declare const membersBecomeOptional: DeepPartial<{ a: string }>;
expectTypeOf(membersBecomeOptional).toEqualTypeOf<{ a?: string }>();

declare const nestedMembersBecomeOptional: DeepPartial<{ a: { b: string } }>;
expectTypeOf(nestedMembersBecomeOptional).toEqualTypeOf<{ a?: { b?: string } }>();

declare const expanded1: Expanded<{ foo: string }>;
expectTypeOf(expanded1).toEqualTypeOf<{ foo: string }>();

declare const expanded2: Expanded<{ "foo.bar": string }>;
expectTypeOf(expanded2).toEqualTypeOf<{ foo: { bar: string } }>();

declare const expanded3: Expanded<{ "foo.bar": string[] }>;
expectTypeOf(expanded3).toEqualTypeOf<{ foo: { bar: string[] } }>();

declare const expanded4: Expanded<{ foo: { "bar.baz": string } }>;
expectTypeOf(expanded4).toEqualTypeOf<{ foo: { bar: { baz: string } } }>();

declare const expanded5: Expanded<{ "foo.bar": string; "baz.qux": string }>;
expectTypeOf(expanded5).toEqualTypeOf<{ foo: { bar: string }; baz: { qux: string } }>();

declare const expanded6: Expanded<{ "foo.bar": string; baz: { qux: string } }>;
expectTypeOf(expanded6).toEqualTypeOf<{ foo: { bar: string }; baz: { qux: string } }>();

declare const expanded7: Expanded<{ "foo.bar": string | number }>;
expectTypeOf(expanded7).toEqualTypeOf<{ foo: { bar: string | number } }>();

declare const expanded8: Expanded<{ foo: { bar: string } | { baz: number } }>;
expectTypeOf(expanded8).toEqualTypeOf<{ foo: { bar: string } | { baz: number } }>();

declare const expanded9: Expanded<{ "foo.bar"?: string }>;
expectTypeOf(expanded9).toEqualTypeOf<{ foo?: { bar: string | undefined } }>();

declare const titlecaseEmpty: Titlecase<"">;
expectTypeOf(titlecaseEmpty).toEqualTypeOf<"">();
declare const titlecaseBlank: Titlecase<" ">;
expectTypeOf(titlecaseBlank).toEqualTypeOf<" ">();
declare const titlecaseNumber: Titlecase<"42">;
expectTypeOf(titlecaseNumber).toEqualTypeOf<"42">();
declare const titlecaseFromLower: Titlecase<"foobar">;
expectTypeOf(titlecaseFromLower).toEqualTypeOf<"Foobar">();
declare const titlecaseFromUpper: Titlecase<"FOOBAR">;
expectTypeOf(titlecaseFromUpper).toEqualTypeOf<"Foobar">();
declare const titlecaseWithSpace: Titlecase<"foo bar">;
expectTypeOf(titlecaseWithSpace).toEqualTypeOf<"Foo Bar">();
declare const titlecaseWithSpaces: Titlecase<"foo  bar">;
expectTypeOf(titlecaseWithSpaces).toEqualTypeOf<"Foo  Bar">();
declare const titlecaseWithThreeWords: Titlecase<"foo bar baz">;
expectTypeOf(titlecaseWithThreeWords).toEqualTypeOf<"Foo Bar Baz">();

const numberMaybePromise: MaybePromise<number> = 0;
expectTypeOf(await numberMaybePromise).toEqualTypeOf<number>();

declare const user: User.ConfiguredInstance;
expectTypeOf(user.id).toEqualTypeOf<string | null>();
expectTypeOf(user._id).toEqualTypeOf<string | null>();
expectTypeOf(user._source._id).toEqualTypeOf<string | null>();
expectTypeOf(user.toJSON()._id).toEqualTypeOf<string | null>();
expectTypeOf(user.toJSON()._id).toEqualTypeOf<string | null>();
expectTypeOf(user.toObject()._id).toEqualTypeOf<string | null>();
expectTypeOf(user.toObject()._id).toEqualTypeOf<string | null>();
expectTypeOf(user.toObject(false)._id).toEqualTypeOf<string | null>();
expectTypeOf(user.toObject(false)._id).toEqualTypeOf<string | null>();
expectTypeOf(user.clone()).toEqualTypeOf<User.ConfiguredInstance>();
expectTypeOf(user.clone({}, { save: true })).toEqualTypeOf<Promise<User.ConfiguredInstance>>();

declare const storedUser: Document.Stored<User.ConfiguredInstance>;
expectTypeOf(storedUser.id).toEqualTypeOf<string>();
expectTypeOf(storedUser._id).toEqualTypeOf<string>();
expectTypeOf(storedUser._source._id).toEqualTypeOf<string>();
expectTypeOf(storedUser.toJSON()._id).toEqualTypeOf<string>();
expectTypeOf(storedUser.toJSON()._id).toEqualTypeOf<string>();
// expectTypeOf(storedUser.toObject()._id).toEqualTypeOf<string>();
// expectTypeOf(storedUser.toObject()._id).toEqualTypeOf<string>();
// expectTypeOf(storedUser.toObject(false)._id).toEqualTypeOf<string>();
// expectTypeOf(storedUser.toObject(false)._id).toEqualTypeOf<string>();
expectTypeOf(storedUser.clone()).toEqualTypeOf<Document.Stored<User.ConfiguredInstance>>();

declare const actor: Document.Stored<Actor>;
expectTypeOf(actor.id).toEqualTypeOf<string>();
expectTypeOf(actor._id).toEqualTypeOf<string>();
expectTypeOf(actor._source._id).toEqualTypeOf<string>();
expectTypeOf(actor.toJSON()._id).toEqualTypeOf<string>();
expectTypeOf(actor.toJSON()._id).toEqualTypeOf<string>();
// expectTypeOf(actor.toObject()._id).toEqualTypeOf<string>();
// expectTypeOf(actor.toObject()._id).toEqualTypeOf<string>();
// expectTypeOf(actor.toObject(false)._id).toEqualTypeOf<string>();
// expectTypeOf(actor.toObject(false)._id).toEqualTypeOf<string>();
expectTypeOf(actor.clone()).toEqualTypeOf<Document.Stored<Actor>>();

// we need to test with `assertType` because the types are not considered equal, even though they are structurally the same
type A = { foo?: string; bar?: number; baz: boolean };
type B = { foo: string; bar?: number; baz: boolean };
declare const someVariable: RequiredProps<A, "foo">;
declare const someOtherVariable: B;
assertType<B>(someVariable);
assertType<RequiredProps<A, "foo">>(someOtherVariable);
