import { expectType } from 'tsd';
import '../../../../index';

expectType<Promise<DrawingDocument | undefined>>(foundry.documents.BaseDrawing.create({}));
expectType<Promise<DrawingDocument[]>>(foundry.documents.BaseDrawing.createDocuments([]));
expectType<Promise<DrawingDocument[]>>(foundry.documents.BaseDrawing.updateDocuments([]));
expectType<Promise<DrawingDocument[]>>(foundry.documents.BaseDrawing.deleteDocuments([]));

const drawing = await foundry.documents.BaseDrawing.create({});
if (drawing) {
  expectType<foundry.data.DrawingData>(drawing.data);
}
