import { expectTypeOf } from "vitest";

declare const combatant: Combatant.Implementation;
declare const baseCombatant: foundry.documents.BaseCombatant;

expectTypeOf(CombatantConfig.defaultOptions).toEqualTypeOf<CombatantConfig.Options>();

// @ts-expect-error - a BaseCombatant is not a Combatant
new CombatantConfig(baseCombatant);

const combatantConfig = new CombatantConfig(combatant);
expectTypeOf(combatantConfig.document).toEqualTypeOf<Combatant.Implementation>();
expectTypeOf(combatantConfig.object).toEqualTypeOf<Combatant.Implementation>();
expectTypeOf(CombatantConfig.defaultOptions).toEqualTypeOf<CombatantConfig.Options>();
expectTypeOf(combatantConfig.options).toEqualTypeOf<CombatantConfig.Options>();
expectTypeOf(combatantConfig.options).toEqualTypeOf<CombatantConfig.Options>();

expectTypeOf(combatantConfig.title).toEqualTypeOf<string>();
