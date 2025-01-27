import { expectTypeOf } from "vitest";

const rollResolver = new foundry.applications.dice.RollResolver(new Roll("3d6"));

expectTypeOf(rollResolver.fulfillable).toEqualTypeOf<
  Map<string, foundry.applications.dice.RollResolver.DiceTermFulfillmentDescriptor>
>();
expectTypeOf(rollResolver.roll).toEqualTypeOf<Roll>();
expectTypeOf(rollResolver.awaitFulfillment()).toEqualTypeOf<Promise<void>>();
expectTypeOf(rollResolver.registerResult("a", "a", 5)).toEqualTypeOf<boolean>();

declare const term: foundry.dice.terms.DiceTerm;
expectTypeOf(rollResolver.resolveResult(term, "a")).toEqualTypeOf<Promise<number | void>>();
expectTypeOf(rollResolver.resolveResult(term, "a", { reroll: true, explode: true })).toEqualTypeOf<
  Promise<number | void>
>();
expectTypeOf(rollResolver.addTerm(term)).toEqualTypeOf<Promise<void>>();
expectTypeOf(rollResolver._checkDone()).toEqualTypeOf<void>();
expectTypeOf(rollResolver._toggleSubmission(true)).toEqualTypeOf<void>();

declare const event: SubmitEvent;
declare const form: HTMLFormElement;
declare const formData: FormDataExtended;
expectTypeOf(foundry.applications.dice.RollResolver._fulfillRoll(event, form, formData)).toEqualTypeOf<Promise<void>>();
