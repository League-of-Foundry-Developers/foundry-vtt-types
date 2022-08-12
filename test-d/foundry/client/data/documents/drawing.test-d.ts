import { expectType } from 'tsd';

const doc = new DrawingDocument();

expectType<foundry.documents.BaseUser>(doc.author);
