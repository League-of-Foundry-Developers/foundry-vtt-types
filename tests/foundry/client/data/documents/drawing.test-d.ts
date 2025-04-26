import { expectTypeOf } from "vitest";

new DrawingDocument.implementation();
new DrawingDocument.implementation({});

const doc = new DrawingDocument.implementation();
expectTypeOf(doc).toEqualTypeOf<DrawingDocument.Implementation>();

expectTypeOf(doc.isAuthor).toEqualTypeOf<boolean>();
