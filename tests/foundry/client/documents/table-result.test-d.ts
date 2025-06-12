import { expectTypeOf } from "vitest";

// @ts-expect-error - requires a range.
new TableResult.implementation();

// @ts-expect-error - requires a range.
new TableResult.implementation({});

const result = new TableResult.implementation({ range: [2, 5] });

expectTypeOf(result.icon).toEqualTypeOf<string>();
expectTypeOf(result.getChatText()).toEqualTypeOf<string>();
