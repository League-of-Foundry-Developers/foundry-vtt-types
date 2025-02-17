import { expectTypeOf } from "vitest";

expectTypeOf("foo".capitalize()).toEqualTypeOf<"Foo">();
expectTypeOf("FOO".capitalize()).toEqualTypeOf<"FOO">();
expectTypeOf("foo bar".capitalize()).toEqualTypeOf<"Foo bar">();
expectTypeOf("FOO BAR".capitalize()).toEqualTypeOf<"FOO BAR">();

expectTypeOf("FOO BAR".compare("")).toEqualTypeOf<number>();

expectTypeOf("foo".titleCase()).toEqualTypeOf<"Foo">();
expectTypeOf("FOO".titleCase()).toEqualTypeOf<"Foo">();
expectTypeOf("foo bar".titleCase()).toEqualTypeOf<"Foo Bar">();
expectTypeOf("FOO BAR".titleCase()).toEqualTypeOf<"Foo Bar">();

expectTypeOf("FOO BAR".stripScripts()).toEqualTypeOf<string>();
expectTypeOf("FOO BAR".slugify()).toEqualTypeOf<string>();
