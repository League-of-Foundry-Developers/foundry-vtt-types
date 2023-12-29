import { expectTypeOf } from "vitest";

expectTypeOf("foo".capitalize()).toEqualTypeOf<"Foo">();
expectTypeOf("FOO".capitalize()).toEqualTypeOf<"FOO">();
expectTypeOf("foo bar".capitalize()).toEqualTypeOf<"Foo bar">();
expectTypeOf("FOO BAR".capitalize()).toEqualTypeOf<"FOO BAR">();

expectTypeOf("foo".titleCase()).toEqualTypeOf<"Foo">();
expectTypeOf("FOO".titleCase()).toEqualTypeOf<"Foo">();
expectTypeOf("foo bar".titleCase()).toEqualTypeOf<"Foo Bar">();
expectTypeOf("FOO BAR".titleCase()).toEqualTypeOf<"Foo Bar">();
