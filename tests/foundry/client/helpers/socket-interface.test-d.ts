import { expectTypeOf } from "vitest";

import SocketInterface = foundry.helpers.SocketInterface;
import Document = foundry.abstract.Document;

declare const request: Document.SocketRequest<"get">;
declare const request2: foundry.documents.collections.CompendiumCollection.ManageCompendiumRequest;

expectTypeOf(SocketInterface.dispatch("", request)).toEqualTypeOf<Promise<SocketInterface.SocketResponse>>();
expectTypeOf(SocketInterface.dispatch("", request2)).toEqualTypeOf<Promise<SocketInterface.SocketResponse>>();
