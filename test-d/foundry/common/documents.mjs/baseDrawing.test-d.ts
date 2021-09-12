import { expectType } from 'tsd';

expectType<Promise<StoredDocument<DrawingDocument> | undefined>>(foundry.documents.BaseDrawing.create({}));
expectType<Promise<StoredDocument<DrawingDocument>[]>>(foundry.documents.BaseDrawing.createDocuments([]));
expectType<Promise<DrawingDocument[]>>(foundry.documents.BaseDrawing.updateDocuments([]));
expectType<Promise<DrawingDocument[]>>(foundry.documents.BaseDrawing.deleteDocuments([]));

const drawing = await foundry.documents.BaseDrawing.create({}, { temporary: true });
if (drawing) {
  expectType<foundry.data.DrawingData>(drawing.data);
}
