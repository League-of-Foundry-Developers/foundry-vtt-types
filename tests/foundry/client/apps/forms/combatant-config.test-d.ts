import { expectTypeOf } from "vitest";

declare const combatant: Combatant;
declare const baseCombatant: foundry.documents.BaseCombatant;

expectTypeOf(CombatantConfig.defaultOptions).toEqualTypeOf<CombatantConfig.Options>();

// @ts-expect-error - a BaseCombatant is not a Combatant
new CombatantConfig(baseCombatant);

const sheet = new CombatantConfig(combatant);
expectTypeOf(sheet.document).toEqualTypeOf<Combatant>();
expectTypeOf(sheet.object).toEqualTypeOf<Combatant>();
expectTypeOf(sheet.title).toEqualTypeOf<string>();
expectTypeOf(sheet.options).toEqualTypeOf<CombatantConfig.Options>();
