import { expectTypeOf } from "vitest";

expectTypeOf(SocketInterface.dispatch("", "")).toEqualTypeOf<Promise<SocketInterface.Response>>();
