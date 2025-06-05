import type { AnyMutableObject } from "#utils";
import { expectTypeOf } from "vitest";

declare const htmlForm: HTMLFormElement;

const formData = new FormDataExtended(htmlForm);
expectTypeOf(formData.dtypes).toEqualTypeOf<Partial<Record<string, string>>>();
expectTypeOf(formData.editors).toEqualTypeOf<Partial<Record<string, FormApplication.FormApplicationEditor>>>();
expectTypeOf(formData.object).toEqualTypeOf<AnyMutableObject>();
expectTypeOf(formData.process(htmlForm, {})).toEqualTypeOf<void>();
expectTypeOf(formData.set("field", "value")).toEqualTypeOf<void>();
expectTypeOf(formData.append("field", "value")).toEqualTypeOf<void>();
