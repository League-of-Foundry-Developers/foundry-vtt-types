import { expectTypeOf } from "vitest";

expectTypeOf(foundry.documents.BaseDrawing.create({})).toEqualTypeOf<
  Promise<StoredDocument<DrawingDocument> | undefined>
>();
expectTypeOf(foundry.documents.BaseDrawing.createDocuments([])).toEqualTypeOf<
  Promise<StoredDocument<DrawingDocument>[]>
>();
expectTypeOf(foundry.documents.BaseDrawing.updateDocuments([])).toEqualTypeOf<Promise<DrawingDocument[]>>();
expectTypeOf(foundry.documents.BaseDrawing.deleteDocuments([])).toEqualTypeOf<Promise<DrawingDocument[]>>();

const drawing = await foundry.documents.BaseDrawing.create({}, { temporary: true });
if (drawing) {
  expectTypeOf(drawing.data).toEqualTypeOf<foundry.data.DrawingData>();
}
