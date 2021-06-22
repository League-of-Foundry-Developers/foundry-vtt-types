import { expectAssignable, expectType } from 'tsd';
import { BaseAmbientLight } from '../../../src/foundry/common/documents.mjs';

const doc = new BaseAmbientLight();
const sheet = new (class extends DocumentSheet<DocumentSheet.Options, DocumentSheet.Data<BaseAmbientLight>> {})(doc);

expectAssignable<FormApplication<DocumentSheet.Options, DocumentSheet.Data<BaseAmbientLight>>>(sheet);
expectType<boolean>(sheet.isEditable);
expectType<BaseAmbientLight>(sheet.document);
