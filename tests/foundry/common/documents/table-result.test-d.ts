import { expectTypeOf } from "vitest";

// @ts-expect-error name is a required field
new foundry.documents.BaseTableResult();
// @ts-expect-error name is a required field
new foundry.documents.BaseTableResult({});

const myTableResult = new foundry.documents.BaseTableResult({ range: [0, 2] });

expectTypeOf(myTableResult.documentId).toEqualTypeOf<string | null>();
