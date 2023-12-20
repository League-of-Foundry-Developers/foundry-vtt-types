import { expectTypeOf } from "vitest";

expectTypeOf(foundry.utils.fetchWithTimeout("/")).toEqualTypeOf<Promise<Response>>();
expectTypeOf(foundry.utils.fetchJsonWithTimeout("/")).toEqualTypeOf<Promise<unknown>>();
