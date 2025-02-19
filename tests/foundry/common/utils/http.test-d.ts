import { expectTypeOf } from "vitest";

expectTypeOf(foundry.utils.fetchWithTimeout("/")).toEqualTypeOf<Promise<Response>>();
expectTypeOf(foundry.utils.fetchJsonWithTimeout("/")).toEqualTypeOf<Promise<unknown>>();

expectTypeOf(new foundry.utils.HttpError("", 4, "")).toEqualTypeOf<foundry.utils.HttpError>();
