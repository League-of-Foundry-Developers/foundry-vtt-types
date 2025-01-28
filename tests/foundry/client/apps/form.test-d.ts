import { assertType, expectTypeOf } from "vitest";

const app = new (class extends FormApplication<FormApplicationOptions, { foo: string }> {
  protected _updateObject(): Promise<unknown> {
    return Promise.resolve(undefined);
  }
})({ foo: "bar" });

assertType<Application>(app);
expectTypeOf(app.isEditable).toEqualTypeOf<boolean>();
expectTypeOf(app.object).toEqualTypeOf<{ foo: string }>();

const doc = new AmbientLightDocument();
const sheet = new (class extends DocumentSheet<
  DocumentSheetOptions<AmbientLightDocument.Implementation>,
  AmbientLightDocument.Implementation
> {})(doc);

assertType<FormApplication<DocumentSheetOptions, AmbientLightDocument>>(sheet);
expectTypeOf(sheet.isEditable).toEqualTypeOf<boolean>();
expectTypeOf(sheet.document).toEqualTypeOf<AmbientLightDocument>();
