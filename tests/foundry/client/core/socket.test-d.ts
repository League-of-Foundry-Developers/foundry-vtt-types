import { expectTypeOf } from "vitest";
import type { DocumentSocketRequest } from "../../../../src/foundry/common/abstract/_types.d.mts";

declare const request: DocumentSocketRequest<"get">;
declare const request2: ManageCompendiumRequest;

expectTypeOf(SocketInterface.dispatch("", request)).toEqualTypeOf<Promise<SocketResponse>>();
expectTypeOf(SocketInterface.dispatch("", request2)).toEqualTypeOf<Promise<SocketResponse>>();
