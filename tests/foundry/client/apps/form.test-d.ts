import { assertType, expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "fvtt-types/utils";

declare const formApplication: FormApplication<FormApplication.Options, Actor.Implementation>;

expectTypeOf(formApplication.object).toEqualTypeOf<Actor.Implementation>();
expectTypeOf(FormApplication.defaultOptions).toEqualTypeOf<FormApplication.Options>();
expectTypeOf(formApplication.options).toEqualTypeOf<FormApplication.Options>();
expectTypeOf(formApplication.getData()).toEqualTypeOf<
  MaybePromise<GetDataReturnType<FormApplication.FormApplicationData<FormApplication.Options, Actor>>>
>();
expectTypeOf(formApplication.render(true)).toEqualTypeOf<FormApplication<FormApplication.Options, Actor>>();

expectTypeOf(formApplication.form).toEqualTypeOf<HTMLElement | null>();
expectTypeOf(formApplication.editors).toEqualTypeOf<Record<string, FormApplication.FormApplicationEditor>>();

const app = new (class extends FormApplication<FormApplication.Options, { foo: string }> {
  protected _updateObject(): Promise<unknown> {
    return Promise.resolve(undefined);
  }
})({ foo: "bar" });

assertType<Application>(app);
expectTypeOf(app.isEditable).toEqualTypeOf<boolean>();
expectTypeOf(app.object).toEqualTypeOf<{ foo: string }>();

const doc = new AmbientLightDocument();
const sheet = new (class extends DocumentSheet<
  DocumentSheet.Options<AmbientLightDocument.Implementation>,
  AmbientLightDocument.Implementation
> {})(doc);

assertType<FormApplication<DocumentSheet.Options, AmbientLightDocument>>(sheet);
expectTypeOf(sheet.isEditable).toEqualTypeOf<boolean>();
expectTypeOf(sheet.document).toEqualTypeOf<AmbientLightDocument>();
