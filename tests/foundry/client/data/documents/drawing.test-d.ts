import { expectTypeOf } from "vitest";

new DrawingDocument();
new DrawingDocument({});

const doc = new DrawingDocument();
expectTypeOf(doc).toEqualTypeOf<DrawingDocument.Implementation>();

expectTypeOf(doc.isAuthor).toEqualTypeOf<boolean>();
