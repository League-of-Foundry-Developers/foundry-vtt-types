import { expectTypeOf } from "vitest";

// Global export test
expectTypeOf(fetchWithTimeout).toEqualTypeOf(foundry.utils.fetchWithTimeout);
// ---

expectTypeOf(foundry.utils.fetchWithTimeout("/")).toEqualTypeOf<Promise<Response>>();
expectTypeOf(foundry.utils.fetchJsonWithTimeout("/")).toEqualTypeOf<Promise<unknown>>();
