import { expectTypeOf } from "vitest";

const doc = new DrawingDocument();

expectTypeOf(doc.author).toEqualTypeOf<User>();
