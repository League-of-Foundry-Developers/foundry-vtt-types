import { assertType, expectTypeOf } from "vitest";
import "../../index.mts";

const membersBecomeOptional: DeepPartial<{ a: string }> = {};
expectTypeOf(membersBecomeOptional).toEqualTypeOf<{ a?: string }>();

const nestedMembersBecomeOptional: DeepPartial<{ a: { b: string } }> = { a: {} };
expectTypeOf(nestedMembersBecomeOptional).toEqualTypeOf<{ a?: { b?: string } }>();

const expanded1: Expanded<{ foo: string }> = { foo: "" };
expectTypeOf(expanded1).toEqualTypeOf<{ foo: string }>();
const expanded2: Expanded<{ "foo.bar": string }> = { foo: { bar: "" } };
expectTypeOf(expanded2).toEqualTypeOf<{ foo: { bar: string } }>();
const expanded3: Expanded<{ "foo.bar": string[] }> = { foo: { bar: [""] } };
expectTypeOf(expanded3).toEqualTypeOf<{ foo: { bar: string[] } }>();
const expanded4: Expanded<{ foo: { "bar.baz": string } }> = { foo: { bar: { baz: "" } } };
expectTypeOf(expanded4).toEqualTypeOf<{ foo: { bar: { baz: string } } }>();
const expanded5: Expanded<{ "foo.bar": string; "baz.qux": string }> = { foo: { bar: "" }, baz: { qux: "" } };
expectTypeOf(expanded5).toEqualTypeOf<{ foo: { bar: string }; baz: { qux: string } }>();
const expanded6: Expanded<{ "foo.bar": string; baz: { qux: string } }> = { foo: { bar: "" }, baz: { qux: "" } };
expectTypeOf(expanded6).toEqualTypeOf<{ foo: { bar: string }; baz: { qux: string } }>();
const expanded7: Expanded<{ "foo.bar": string | number }> = { foo: { bar: 0 } };
expectTypeOf(expanded7).toEqualTypeOf<{ foo: { bar: string | number } }>();
const expanded8: Expanded<{ foo: { bar: string } | { baz: number } }> = { foo: { bar: "" } };
expectTypeOf(expanded8).toEqualTypeOf<{ foo: { bar: string } | { baz: number } }>();
const expanded9: Expanded<{ "foo.bar"?: string }> = {};
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

declare const user: User;
expectTypeOf(user.id).toEqualTypeOf<string | null>();
expectTypeOf(user.data._id).toEqualTypeOf<string | null>();
expectTypeOf(user.data._source._id).toEqualTypeOf<string | null>();
expectTypeOf(user.toJSON()._id).toEqualTypeOf<string | null>();
expectTypeOf(user.data.toJSON()._id).toEqualTypeOf<string | null>();
expectTypeOf(user.toObject()._id).toEqualTypeOf<string | null>();
expectTypeOf(user.data.toObject()._id).toEqualTypeOf<string | null>();
expectTypeOf(user.toObject(false)._id).toEqualTypeOf<string | null>();
expectTypeOf(user.data.toObject(false)._id).toEqualTypeOf<string | null>();
expectTypeOf(user.clone()).toEqualTypeOf<User | Promise<User | undefined>>();

declare const storedUser: StoredDocument<User>;
expectTypeOf(storedUser.id).toEqualTypeOf<string>();
expectTypeOf(storedUser.data._id).toEqualTypeOf<string>();
expectTypeOf(storedUser.data._source._id).toEqualTypeOf<string>();
expectTypeOf(storedUser.toJSON()._id).toEqualTypeOf<string>();
expectTypeOf(storedUser.data.toJSON()._id).toEqualTypeOf<string>();
expectTypeOf(storedUser.toObject()._id).toEqualTypeOf<string>();
expectTypeOf(storedUser.data.toObject()._id).toEqualTypeOf<string>();
expectTypeOf(storedUser.toObject(false)._id).toEqualTypeOf<string>();
expectTypeOf(storedUser.data.toObject(false)._id).toEqualTypeOf<string>();
expectTypeOf(storedUser.clone()).toEqualTypeOf<User | Promise<User | undefined>>();

declare const actor: StoredDocument<Actor>;
expectTypeOf(actor.id).toEqualTypeOf<string>();
expectTypeOf(actor.data._id).toEqualTypeOf<string>();
expectTypeOf(actor.data._source._id).toEqualTypeOf<string>();
expectTypeOf(actor.toJSON()._id).toEqualTypeOf<string>();
expectTypeOf(actor.data.toJSON()._id).toEqualTypeOf<string>();
expectTypeOf(actor.toObject()._id).toEqualTypeOf<string>();
expectTypeOf(actor.data.toObject()._id).toEqualTypeOf<string>();
expectTypeOf(actor.toObject(false)._id).toEqualTypeOf<string>();
expectTypeOf(actor.data.toObject(false)._id).toEqualTypeOf<string>();
expectTypeOf(actor.clone()).toEqualTypeOf<Actor | Promise<Actor | undefined>>();

if (actor.data.type === "character") {
  expectTypeOf(actor.data.data.health).toEqualTypeOf<number>();
  expectTypeOf(actor.data.data.movement).toEqualTypeOf<number>();
} else {
  expectTypeOf(actor.data.data.faction).toEqualTypeOf<string>();
  expectTypeOf(actor.data.data.challenge).toEqualTypeOf<number>();
  expectTypeOf(actor.data.data.damage).toEqualTypeOf<number>();
}

// we need to test with `assertType` because the types are not considered equal, even though they are structurally the same
type A = { foo?: string; bar?: number; baz: boolean };
type B = { foo: string; bar?: number; baz: boolean };
declare const someVariable: RequiredProps<A, "foo">;
declare const someOtherVariable: B;
assertType<B>(someVariable);
assertType<RequiredProps<A, "foo">>(someOtherVariable);
