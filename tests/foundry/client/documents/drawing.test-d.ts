import { expectTypeOf } from "vitest";

// `validateJoint` requires that the drawing be visible.

// Valid calls:

// Each type has their own required shape props.
new DrawingDocument.implementation({ shape: { type: "r", width: 9, height: 9 } });
new DrawingDocument.implementation({ shape: { type: "e", width: 9, height: 9 } });
new DrawingDocument.implementation({ shape: { type: "p", width: 1, height: 1, points: [0, 0, 0, 0] } });
new DrawingDocument.implementation({ shape: { type: "c", radius: 5 } });

// Default type is `"r"`
new DrawingDocument.implementation({ shape: { width: 9, height: 9 } });

// Passes validation but is still invisible.
new DrawingDocument.implementation({
  shape: { width: 0, height: 0 },
  strokeWidth: 0,
});

// Invalid calls:

// @ts-expect-error - `CreateData` is required.
new DrawingDocument.implementation();

// @ts-expect-error - Shape must be visible. Essentially `shape.width` and `shape.height` are required.
new DrawingDocument.implementation({});

// @ts-expect-error - Shape must be visible. Essentially `shape.width` and `shape.height` are required.
new DrawingDocument.implementation({ shape: { type: "r" } });

// These calls are in principle invalid but unlikely to ever become errors:

// Errors because `width`/`height` being less than `strokeWidth`
new DrawingDocument.implementation({ shape: { type: "r", width: 0, height: 0 } });
new DrawingDocument.implementation({ shape: { type: "r", width: 100, height: 100 }, strokeWidth: 100 });

// Errors because `text`, `fillType`, and `strokeWidth` are all effectively disabled
new DrawingDocument.implementation({
  shape: { width: 9, height: 9 },
  text: "",
  fillType: CONST.DRAWING_FILL_TYPES.NONE,
  strokeWidth: 0,
});

// Errors because nothing is visible.
new DrawingDocument.implementation({ shape: { width: 9, height: 9 }, textAlpha: 0, fillAlpha: 0, strokeAlpha: 0 });

const doc = new DrawingDocument.implementation({ shape: { width: 9, height: 9 } });
expectTypeOf(doc).toEqualTypeOf<DrawingDocument.Implementation>();

expectTypeOf(doc.isAuthor).toEqualTypeOf<boolean>();
