import { expectTypeOf } from "vitest";

declare const regExpConstructor: RegExpConstructor;

expectTypeOf(regExpConstructor.escape("3")).toEqualTypeOf<string>();
