import { expectTypeOf, test } from "vitest";

const actorSheet = new foundry.applications.sheets.ActorSheetV2({
  document: new Actor.implementation({ name: "Test Actor" }),
});

// Regression test for `error TS2339: Property 'type' does not exist on type 'this["object"]'.`
// Reported @acthy on Discord, see https://discord.com/channels/732325252788387980/803646399014109205/1290726809024856197.
test("ActorSheet#actor regression test", () => {
  expectTypeOf(actorSheet.actor.type).toEqualTypeOf<Actor.SubType>();
});

expectTypeOf(actorSheet.actor).toEqualTypeOf<Actor.Implementation>();
expectTypeOf(actorSheet.token).toEqualTypeOf<Actor.Implementation["token"]>();
