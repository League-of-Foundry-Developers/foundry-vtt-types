import { assertType, expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "fvtt-types/utils";

declare const formApplication: FormApplication<FormApplicationOptions, Actor>;

expectTypeOf(formApplication.object).toEqualTypeOf<X>();
expectTypeOf(FormApplication.defaultOptions).toEqualTypeOf<FormApplicationOptions>();
expectTypeOf(formApplication.options).toEqualTypeOf<FormApplicationOptions>();
expectTypeOf(formApplication.getData()).toEqualTypeOf<
  MaybePromise<GetDataReturnType<FormApplication.FormApplicationData<FormApplicationOptions, Actor>>>
>();
expectTypeOf(formApplication.render(true)).toEqualTypeOf<FormApplication<FormApplicationOptions, Actor>>();

expectTypeOf(formApplication.form).toEqualTypeOf<HTMLElement | null>();
expectTypeOf(formApplication.editors).toEqualTypeOf<Record<string, FormApplication.FormApplicationEditor>>();

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
  DocumentSheetOptions<AmbientLightDocument.ConfiguredInstance>,
  AmbientLightDocument.ConfiguredInstance
> {})(doc);

assertType<FormApplication<DocumentSheetOptions, AmbientLightDocument>>(sheet);
expectTypeOf(sheet.isEditable).toEqualTypeOf<boolean>();
expectTypeOf(sheet.document).toEqualTypeOf<AmbientLightDocument>();
