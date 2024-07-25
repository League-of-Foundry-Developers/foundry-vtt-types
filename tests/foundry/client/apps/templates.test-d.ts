import { expectTypeOf } from "vitest";

expectTypeOf(HandlebarsHelpers.editor("foo", { hash: { target: "foo" } }));
