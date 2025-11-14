import { describe, expectTypeOf, test } from "vitest";

import CombatEncounters = foundry.documents.collections.CombatEncounters;

declare const combatCreateData: Combat.CreateData;
declare const combatSource: Combat.Source;
declare const combat: Combat.Stored;
declare const combatImpl: Combat.Implementation;
declare const actorCreateData: Actor.CreateData;
declare const actor: Actor.Stored;
declare const falseOrUndefined: false | undefined;
declare const trueOrUndefined: true | undefined;
declare const boolOrUndefined: boolean | undefined;

describe("CombatEncounters Tests", () => {
  test("Construction", () => {
    new CombatEncounters();
    new CombatEncounters([combatCreateData]);
    new CombatEncounters([combatSource]);

    // @ts-expect-error `Actor` data not assignable to `Combat` data
    new CombatEncounters([actorCreateData]);
  });

  const encounters = new CombatEncounters([combatCreateData]);

  test("Miscellaneous", () => {
    expectTypeOf(CombatEncounters.documentName).toEqualTypeOf<"Combat">();
    expectTypeOf(CombatEncounters.instance).toEqualTypeOf<CombatEncounters.Implementation>();
    expectTypeOf(encounters.folders).toEqualTypeOf<Collection<never>>();
    expectTypeOf(encounters.directory).toEqualTypeOf<typeof ui.combat>();
    expectTypeOf(encounters.name).toEqualTypeOf<"CombatEncounters">();

    expectTypeOf(CombatEncounters.settings).toEqualTypeOf<foundry.data.CombatConfiguration.SettingData>();

    expectTypeOf(encounters.combats).toEqualTypeOf<Combat.Stored[]>();
    expectTypeOf(encounters.active).toEqualTypeOf<Combat.Stored | undefined>();
    expectTypeOf(encounters.viewed).toEqualTypeOf<Combat.Stored | null>();
  });

  test("Getting", () => {
    expectTypeOf(encounters.get("ID")).toEqualTypeOf<Combat.Stored | undefined>();
    expectTypeOf(encounters.get("ID", {})).toEqualTypeOf<Combat.Stored | undefined>();
    expectTypeOf(encounters.get("ID", { invalid: false, strict: false })).toEqualTypeOf<Combat.Stored | undefined>();
    expectTypeOf(encounters.get("ID", { invalid: true, strict: true })).toEqualTypeOf<Combat.Invalid | Combat.Stored>();
    expectTypeOf(encounters.get("ID", { invalid: undefined, strict: undefined })).toEqualTypeOf<
      Combat.Stored | undefined
    >();

    // testing `invalid` (defaults `false`, preventing `.Invalid`s)
    expectTypeOf(encounters.get("ID", { invalid: true, strict: true })).toEqualTypeOf<Combat.Invalid | Combat.Stored>();
    expectTypeOf(encounters.get("ID", { invalid: false, strict: true })).toEqualTypeOf<Combat.Stored>();
    expectTypeOf(encounters.get("ID", { invalid: undefined, strict: true })).toEqualTypeOf<Combat.Stored>();
    expectTypeOf(encounters.get("ID", { invalid: falseOrUndefined, strict: true })).toEqualTypeOf<Combat.Stored>();
    expectTypeOf(encounters.get("ID", { invalid: boolOrUndefined, strict: true })).toEqualTypeOf<
      Combat.Invalid | Combat.Stored
    >();
    expectTypeOf(encounters.get("ID", { invalid: trueOrUndefined, strict: true })).toEqualTypeOf<
      Combat.Invalid | Combat.Stored
    >();

    // testing `strict` (defaults `false`, allowing `undefined`)
    expectTypeOf(encounters.get("ID", { invalid: false, strict: true })).toEqualTypeOf<Combat.Stored>();
    expectTypeOf(encounters.get("ID", { invalid: false, strict: false })).toEqualTypeOf<Combat.Stored | undefined>();
    expectTypeOf(encounters.get("ID", { invalid: false, strict: undefined })).toEqualTypeOf<
      Combat.Stored | undefined
    >();
    expectTypeOf(encounters.get("ID", { invalid: false, strict: falseOrUndefined })).toEqualTypeOf<
      Combat.Stored | undefined
    >();
    expectTypeOf(encounters.get("ID", { invalid: false, strict: boolOrUndefined })).toEqualTypeOf<
      Combat.Stored | undefined
    >();
    expectTypeOf(encounters.get("ID", { invalid: false, strict: trueOrUndefined })).toEqualTypeOf<
      Combat.Stored | undefined
    >();

    expectTypeOf(encounters.getInvalid("ID")).toEqualTypeOf<Combat.Invalid>();
    expectTypeOf(encounters.getInvalid("ID", {})).toEqualTypeOf<Combat.Invalid>();
    expectTypeOf(encounters.getInvalid("ID", { strict: false })).toEqualTypeOf<Combat.Invalid | undefined>();
    expectTypeOf(encounters.getInvalid("ID", { strict: undefined })).toEqualTypeOf<Combat.Invalid>();
    expectTypeOf(encounters.getInvalid("ID", { strict: trueOrUndefined })).toEqualTypeOf<Combat.Invalid>();
    expectTypeOf(encounters.getInvalid("ID", { strict: falseOrUndefined })).toEqualTypeOf<Combat.Invalid | undefined>();
    expectTypeOf(encounters.getInvalid("ID", { strict: boolOrUndefined })).toEqualTypeOf<Combat.Invalid | undefined>();

    expectTypeOf(encounters.getName("name")).toEqualTypeOf<Combat.Stored | undefined>();
    expectTypeOf(encounters.getName("name", {})).toEqualTypeOf<Combat.Stored | undefined>();
    expectTypeOf(encounters.getName("name", { strict: true })).toEqualTypeOf<Combat.Stored>();
    expectTypeOf(encounters.getName("name", { strict: undefined })).toEqualTypeOf<Combat.Stored | undefined>();
    expectTypeOf(encounters.getName("name", { strict: trueOrUndefined })).toEqualTypeOf<Combat.Stored | undefined>();
    expectTypeOf(encounters.getName("name", { strict: falseOrUndefined })).toEqualTypeOf<Combat.Stored | undefined>();
    expectTypeOf(encounters.getName("name", { strict: boolOrUndefined })).toEqualTypeOf<Combat.Stored | undefined>();
  });

  test("Setting and Deleting", () => {
    // @ts-expect-error `DocumentCollection`s only contain stored documents
    encounters.set("ID", combatImpl);
    // @ts-expect-error `Actor`s are not `Combat`s
    encounters.set("ID", actor);
    // returns void, for now (13.350): https://github.com/foundryvtt/foundryvtt/issues/13565
    expectTypeOf(encounters.set("ID", combat)).toBeVoid();

    expectTypeOf(encounters.delete("ID")).toBeBoolean();
  });
});
