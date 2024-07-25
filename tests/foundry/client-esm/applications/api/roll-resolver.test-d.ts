import { expectTypeOf } from "vitest";

const r = new foundry.applications.dice.RollResolver(new Roll("3d6"));

const t = new Die();

expectTypeOf(r.awaitFulfillment()).toEqualTypeOf<Promise<void>>();
expectTypeOf(r.registerResult("a", "a", 5)).toEqualTypeOf<boolean>();
expectTypeOf(await r.resolveResult(t, "a")).toEqualTypeOf<number | void>();
expectTypeOf(await r.resolveResult(t, "a", { reroll: true, explode: true })).toEqualTypeOf<number | void>();

expectTypeOf(
  await foundry.applications.dice.RollResolver._fulfillRoll(
    new SubmitEvent("a"),
    new HTMLFormElement(),
    new FormDataExtended(new HTMLFormElement()),
  ),
).toEqualTypeOf<void>();

expectTypeOf(await r.addTerm(t)).toEqualTypeOf<void>();
expectTypeOf(r._checkDone()).toEqualTypeOf<void>();
expectTypeOf(r._toggleSubmission(true)).toEqualTypeOf<void>();
