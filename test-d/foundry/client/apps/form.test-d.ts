import { expectAssignable, expectType } from "tsd";
import { BaseAmbientLight } from "../../../../src/foundry/common/documents.mjs";

const app = new (class extends FormApplication<FormApplicationOptions, FormApplication.Data<{ foo: string }>> {
  protected _updateObject(): Promise<unknown> {
    return Promise.resolve(undefined);
  }
})({ foo: "bar" });

expectAssignable<Application>(app);
expectType<boolean>(app.isEditable);
expectType<{ foo: string }>(app.object);
expectType<FormApplication.Data<{ foo: string }> | Promise<FormApplication.Data<{ foo: string }>>>(app.getData());

const doc = new BaseAmbientLight();
const sheet = new (class extends DocumentSheet<DocumentSheetOptions, DocumentSheet.Data<BaseAmbientLight>> {})(doc);

expectAssignable<FormApplication<DocumentSheetOptions, DocumentSheet.Data<BaseAmbientLight>>>(sheet);
expectType<boolean>(sheet.isEditable);
expectType<BaseAmbientLight>(sheet.document);
