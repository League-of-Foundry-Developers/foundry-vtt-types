import { expectTypeOf, test } from "vitest";

declare const form: HTMLFormElement;
declare const button: HTMLButtonElement;

test("foundry/client/client", () => {
  // @ts-expect-error The `types` file is not actually exported as an object into the foundry namespace
  foundry.types;

  expectTypeOf(form.submitNoEvent()).toBeVoid();
  expectTypeOf(form.submit()).toBeVoid();
  expectTypeOf(form.submit(button)).toBeVoid();
  expectTypeOf(form.submit(null)).toBeVoid();
});
