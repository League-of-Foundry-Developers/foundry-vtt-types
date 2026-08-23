import { expectTypeOf } from "vitest";
import type { AnyObject } from "#utils";
import type { DatabaseBackend } from "#common/abstract/_module.d.mts";

import DocumentSocketResponse = foundry.abstract.DocumentSocketResponse;

declare const response: DocumentSocketResponse<"update">;

expectTypeOf(response.type).toEqualTypeOf<foundry.abstract.Document.Type | undefined>();
expectTypeOf(response.action).toEqualTypeOf<"update" | undefined>();
expectTypeOf(response.timestamp).toEqualTypeOf<number | undefined>();
expectTypeOf(response.broadcast).toEqualTypeOf<boolean | undefined>();
expectTypeOf(response.operation).toEqualTypeOf<DatabaseBackend.DatabaseOperation | undefined>();
expectTypeOf(response.userId).toEqualTypeOf<string | undefined>();
expectTypeOf(response.result).toEqualTypeOf<AnyObject[] | readonly string[] | undefined>();
expectTypeOf(response.error).toEqualTypeOf<Error | undefined>();

// The class body initializes this to `false`, so unlike every other property it is never `undefined`.
expectTypeOf(response.sideEffect).toEqualTypeOf<boolean>();
