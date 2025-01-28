import { expectTypeOf } from "vitest";

declare const formInput: foundry.applications.elements.AbstractFormInputElement<number>;

expectTypeOf(formInput.form).toEqualTypeOf<HTMLFormElement>();
expectTypeOf(formInput.name).toEqualTypeOf<string>();
expectTypeOf(formInput.value).toEqualTypeOf<number>();
expectTypeOf(formInput.disabled).toEqualTypeOf<boolean>();
expectTypeOf(formInput.editable).toEqualTypeOf<boolean>();
expectTypeOf(formInput.connectedCallback()).toEqualTypeOf<void>();

expectTypeOf(foundry.applications.elements.AbstractFormInputElement.tagName).toEqualTypeOf<string>();
expectTypeOf(foundry.applications.elements.AbstractFormInputElement.formAssociated).toEqualTypeOf<boolean>();
