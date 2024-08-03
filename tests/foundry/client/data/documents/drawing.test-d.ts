import { expectTypeOf } from "vitest";

new DrawingDocument();
new DrawingDocument({});

const doc = new DrawingDocument();
expectTypeOf(doc).toEqualTypeOf<DrawingDocument>();

expectTypeOf(doc.isAuthor).toEqualTypeOf<boolean>();
