import { expectTypeOf } from "vitest";

// @ts-expect-error - requires a range.
new TableResult();

// @ts-expect-error - requires a range.
new TableResult({});

const result = new TableResult({ range: [2, 5] });

expectTypeOf(result.icon).toEqualTypeOf<string>();
expectTypeOf(result.getChatText()).toEqualTypeOf<string>();
