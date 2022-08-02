import { expectType } from 'tsd';

const doc = new DrawingDocument();

expectType<foundry.documents.BaseUser | undefined>(doc.author);
