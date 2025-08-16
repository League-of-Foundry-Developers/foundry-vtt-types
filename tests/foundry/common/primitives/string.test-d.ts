import { describe, expectTypeOf, test } from "vitest";

describe("String Tests", () => {
  test("Case", () => {
    expectTypeOf("foo".capitalize()).toEqualTypeOf<"Foo">();
    expectTypeOf("FOO".capitalize()).toEqualTypeOf<"FOO">();
    expectTypeOf("foo bar".capitalize()).toEqualTypeOf<"Foo bar">();
    expectTypeOf("FOO BAR".capitalize()).toEqualTypeOf<"FOO BAR">();

    expectTypeOf("foo".titleCase()).toEqualTypeOf<"Foo">();
    expectTypeOf("FOO".titleCase()).toEqualTypeOf<"Foo">();
    expectTypeOf("foo bar".titleCase()).toEqualTypeOf<"Foo Bar">();
    expectTypeOf("FOO BAR".titleCase()).toEqualTypeOf<"Foo Bar">();
  });

  test("Transforms", () => {
    expectTypeOf("FOO BAR".stripScripts()).toEqualTypeOf<string>();

    expectTypeOf("FOO BAR".slugify()).toEqualTypeOf<string>();
    expectTypeOf("FOO BAR".slugify({ replacement: "$", lowercase: false, strict: true })).toEqualTypeOf<string>();
    expectTypeOf(
      "FOO BAR".slugify({ replacement: undefined, lowercase: undefined, strict: undefined }),
    ).toEqualTypeOf<string>();
  });

  test("Miscellaneous", () => {
    expectTypeOf("FOO BAR".compare("")).toEqualTypeOf<-1 | 0 | 1>();
  });
});
