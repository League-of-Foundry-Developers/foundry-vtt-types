import { expectTypeOf } from "vitest";

// @ts-expect-error The `types` file is not actually exported as an object into the foundry namespace
foundry.types;

declare const form: HTMLFormElement;
expectTypeOf(form.submitNoEvent()).toBeVoid();

declare const button: HTMLButtonElement;
expectTypeOf(form.submit()).toBeVoid();
expectTypeOf(form.submit(button)).toBeVoid();
expectTypeOf(form.submit(null)).toBeVoid();
