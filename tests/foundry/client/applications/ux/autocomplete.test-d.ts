import { expectTypeOf } from "vitest";

import Autocomplete = foundry.applications.ux.Autocomplete;

const autocomplete = new Autocomplete({
  onSelect: (identifier, label, options) => {
    expectTypeOf(identifier).toBeString();
    expectTypeOf(label).toBeString();
    expectTypeOf(options).toEqualTypeOf<Autocomplete.CallbackOptions | undefined>();
  },
});

expectTypeOf(autocomplete).toEqualTypeOf<Autocomplete>();
expectTypeOf(autocomplete.element).toEqualTypeOf<HTMLMenuElement | null>();
expectTypeOf(autocomplete.commit()).toBeVoid();
expectTypeOf(autocomplete.dismiss()).toBeVoid();
expectTypeOf(autocomplete.select()).toBeVoid();
expectTypeOf(autocomplete.select(-1)).toBeVoid();

declare const target: HTMLElement;
expectTypeOf(autocomplete.activate(target, [{ identifier: "a", label: "A" }])).toBeVoid();
expectTypeOf(
  autocomplete.activate(target, [{ identifier: "a", label: "A" }], { prefix: "a", position: { top: 0 } }),
).toBeVoid();

expectTypeOf(Autocomplete.activateListeners()).toBeVoid();
expectTypeOf(Autocomplete.implementation).toEqualTypeOf<Autocomplete.ImplementationClass>();
