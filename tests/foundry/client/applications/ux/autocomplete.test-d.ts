import { expectTypeOf, test } from "vitest";
import type { FixedInstanceType } from "fvtt-types/utils";

import Autocomplete = foundry.applications.ux.Autocomplete;

declare const target: HTMLElement;

declare const entry: Autocomplete.Entry;

test("foundry/client/applications/ux/autocomplete", () => {
  const autocomplete = new Autocomplete({
    onSelect: (identifier, label, options) => {
      expectTypeOf(identifier).toBeString();
      expectTypeOf(label).toBeString();
      expectTypeOf(options).toEqualTypeOf<Autocomplete.CallbackOptions>();
      expectTypeOf(options.prefix).toBeString();
    },
  });

  expectTypeOf(autocomplete).toEqualTypeOf<Autocomplete>();
  expectTypeOf(autocomplete.element).toEqualTypeOf<HTMLMenuElement | null>();
  expectTypeOf(autocomplete.commit()).toBeVoid();
  expectTypeOf(autocomplete.dismiss()).toBeVoid();
  expectTypeOf(autocomplete.select()).toBeVoid();
  expectTypeOf(autocomplete.select(-1)).toBeVoid();
  expectTypeOf(autocomplete.activate(target, [{ identifier: "a", label: "A" }])).toBeVoid();
  expectTypeOf(
    autocomplete.activate(target, [{ identifier: "a", label: "A", disabled: true }], {
      prefix: "a",
      position: { top: 0 },
    }),
  ).toBeVoid();
  expectTypeOf(entry.disabled).toEqualTypeOf<boolean | undefined>();

  expectTypeOf(Autocomplete.activateListeners()).toBeVoid();
  expectTypeOf(Autocomplete.implementation).toEqualTypeOf<Autocomplete.ImplementationClass>();
  expectTypeOf<Autocomplete.Implementation>().toEqualTypeOf<FixedInstanceType<Autocomplete.ImplementationClass>>();
});
