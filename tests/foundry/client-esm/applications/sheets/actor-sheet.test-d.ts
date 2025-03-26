import { expectTypeOf } from "vitest";

// Regression test for `error TS2339: Property 'type' does not exist on type 'this["object"]'.`
// Reported @acthy on Discord, see https://discord.com/channels/732325252788387980/803646399014109205/1290726809024856197.
const actorSheet = new foundry.applications.sheets.ActorSheetV2({ document: new Actor({ name: "Test Actor" }) });
expectTypeOf(actorSheet.actor.type).toEqualTypeOf<foundry.documents.BaseActor.TypeNames>();

expectTypeOf(actorSheet.actor).toEqualTypeOf<Actor>();
expectTypeOf(actorSheet.token).toEqualTypeOf<Actor["token"]>();
