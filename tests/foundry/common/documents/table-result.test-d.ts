import { expectTypeOf } from "vitest";

// This exists to make the class non-abstract.
class TestBaseTableResult extends foundry.documents.BaseTableResult {}

// @ts-expect-error range is a required field
new TestBaseTableResult();

// @ts-expect-error range is a required field
new TestBaseTableResult({});

const myTableResult = new TestBaseTableResult({ range: [0, 2] });

// deprecated since v13 until v15
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(myTableResult.documentId).toEqualTypeOf<string | null>();
