import { expectAssignable, expectType } from "tsd";
import { BaseAmbientLight } from "../../../../src/foundry/common/documents.mjs";

const app = new (class extends FormApplication<FormApplicationOptions, { foo: string }> {
  protected _updateObject(): Promise<unknown> {
    return Promise.resolve(undefined);
  }
})({ foo: "bar" });

expectAssignable<Application>(app);
expectType<boolean>(app.isEditable);
expectType<{ foo: string }>(app.object);

const doc = new BaseAmbientLight();
const sheet = new (class extends DocumentSheet<DocumentSheetOptions<BaseAmbientLight>, BaseAmbientLight> {})(doc);

expectAssignable<FormApplication<DocumentSheetOptions, BaseAmbientLight>>(sheet);
expectType<boolean>(sheet.isEditable);
expectType<BaseAmbientLight>(sheet.document);
