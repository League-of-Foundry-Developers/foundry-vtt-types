import { assertType, expectTypeOf } from "vitest";
import { BaseAmbientLight } from "../../../../src/foundry/common/documents.mjs/index.d.mts";

const app = new (class extends FormApplication<FormApplicationOptions, { foo: string }> {
  protected _updateObject(): Promise<unknown> {
    return Promise.resolve(undefined);
  }
})({ foo: "bar" });

assertType<Application>(app);
expectTypeOf(app.isEditable).toEqualTypeOf<boolean>();
expectTypeOf(app.object).toEqualTypeOf<{ foo: string }>();

const doc = new BaseAmbientLight();
const sheet = new (class extends DocumentSheet<DocumentSheetOptions<BaseAmbientLight>, BaseAmbientLight> {})(doc);

assertType<FormApplication<DocumentSheetOptions, BaseAmbientLight>>(sheet);
expectTypeOf(sheet.isEditable).toEqualTypeOf<boolean>();
expectTypeOf(sheet.document).toEqualTypeOf<BaseAmbientLight>();
