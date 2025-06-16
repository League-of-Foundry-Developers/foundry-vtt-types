import type { AnyMutableObject } from "#utils";
import { expectTypeOf } from "vitest";

import FormDataExtended = foundry.applications.ux.FormDataExtended;
import FormApplication = foundry.appv1.api.FormApplication;

declare const htmlForm: HTMLFormElement;

const formData = new FormDataExtended(htmlForm);
expectTypeOf(formData.dtypes).toEqualTypeOf<Record<string, string>>();
expectTypeOf(formData.editors).toEqualTypeOf<Record<string, FormApplication.FormApplicationEditor>>();
expectTypeOf(formData.object).toEqualTypeOf<AnyMutableObject>();
expectTypeOf(formData.process(htmlForm, {})).toEqualTypeOf<void>();
expectTypeOf(formData.set("field", "value")).toEqualTypeOf<void>();
expectTypeOf(formData.append("field", "value")).toEqualTypeOf<void>();
