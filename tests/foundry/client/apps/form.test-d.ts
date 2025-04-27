import { assertType, expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "fvtt-types/utils";

declare const formApplication: FormApplication<Actor.Implementation, FormApplication.Options>;

expectTypeOf(formApplication.object).toEqualTypeOf<Actor.Implementation>();
expectTypeOf(FormApplication.defaultOptions).toEqualTypeOf<FormApplication.Options>();
expectTypeOf(formApplication.options).toEqualTypeOf<FormApplication.Options>();
expectTypeOf(formApplication.getData()).toEqualTypeOf<
  MaybePromise<GetDataReturnType<FormApplication.FormApplicationData<FormApplication.Options, Actor.Implementation>>>
>();
expectTypeOf(formApplication.render(true)).toEqualTypeOf<
  FormApplication<Actor.Implementation, FormApplication.Options>
>();

expectTypeOf(formApplication.form).toEqualTypeOf<HTMLElement | null>();
expectTypeOf(formApplication.editors).toEqualTypeOf<Record<string, FormApplication.FormApplicationEditor>>();

const app = new (class extends FormApplication<{ foo: string }, FormApplication.Options> {
  protected _updateObject(): Promise<unknown> {
    return Promise.resolve(undefined);
  }
})({ foo: "bar" });

assertType<Application>(app);
expectTypeOf(app.isEditable).toEqualTypeOf<boolean>();
expectTypeOf(app.object).toEqualTypeOf<{ foo: string }>();

const doc = new AmbientLightDocument.implementation();
const sheet = new (class extends DocumentSheet<
  AmbientLightDocument.Implementation,
  DocumentSheet.Options<AmbientLightDocument.Implementation>
> {})(doc);

assertType<FormApplication<AmbientLightDocument.Implementation, DocumentSheet.Options>>(sheet);
expectTypeOf(sheet.isEditable).toEqualTypeOf<boolean>();
expectTypeOf(sheet.document).toEqualTypeOf<AmbientLightDocument.Implementation>();
