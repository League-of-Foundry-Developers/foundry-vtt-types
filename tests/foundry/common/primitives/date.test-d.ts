import { expectTypeOf } from "vitest";

declare const date: Date;

expectTypeOf(date.isValid()).toEqualTypeOf<boolean>();
expectTypeOf(date.toDateInputString()).toEqualTypeOf<string>();
expectTypeOf(date.toTimeInputString()).toEqualTypeOf<string>();
