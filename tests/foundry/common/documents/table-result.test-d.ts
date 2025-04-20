import { expectTypeOf } from "vitest";

// This exists to make the class non-abstract.
class TestBaseTableResult extends foundry.documents.BaseTableResult {}

// @ts-expect-error name is a required field
new TestBaseTableResult();

// @ts-expect-error name is a required field
new TestBaseTableResult({});

const myTableResult = new TestBaseTableResult({ range: [0, 2] });

expectTypeOf(myTableResult.documentId).toEqualTypeOf<string | null>();
