import { expectTypeOf } from "vitest";

const doc = new DrawingDocument();

expectTypeOf(doc.isAuthor).toEqualTypeOf<boolean>();
