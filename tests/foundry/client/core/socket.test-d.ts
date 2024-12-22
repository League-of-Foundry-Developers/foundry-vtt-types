import { expectTypeOf } from "vitest";

import Document = foundry.abstract.Document;

declare const request: Document.SocketRequest<"get">;
declare const request2: ManageCompendiumRequest;

expectTypeOf(SocketInterface.dispatch("", request)).toEqualTypeOf<Promise<SocketResponse>>();
expectTypeOf(SocketInterface.dispatch("", request2)).toEqualTypeOf<Promise<SocketResponse>>();
