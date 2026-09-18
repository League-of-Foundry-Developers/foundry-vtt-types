import type { AnyMutableObject } from "fvtt-types/utils";
import { expectTypeOf, test } from "vitest";

import FormDataExtended = foundry.applications.ux.FormDataExtended;
// eslint-disable-next-line @typescript-eslint/no-deprecated
import FormApplication = foundry.appv1.api.FormApplication;

declare const htmlForm: HTMLFormElement;

test("foundry/client/applications/ux/form-data-extended", () => {
  const formData = new FormDataExtended(htmlForm);
  expectTypeOf(formData.dtypes).toEqualTypeOf<Record<string, string>>();
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  expectTypeOf(formData.editors).toEqualTypeOf<Record<string, FormApplication.FormApplicationEditor>>();
  expectTypeOf(formData.object).toEqualTypeOf<AnyMutableObject>();
  expectTypeOf(formData.process(htmlForm, {})).toEqualTypeOf<void>();
  expectTypeOf(formData.set("field", "value")).toEqualTypeOf<void>();
  expectTypeOf(formData.append("field", "value")).toEqualTypeOf<void>();
});
