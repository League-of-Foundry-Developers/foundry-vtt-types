import { expectTypeOf } from "vitest";

declare const combatant: Combatant;
declare const baseCombatant: foundry.documents.BaseCombatant;

expectTypeOf(CombatantConfig.defaultOptions).toEqualTypeOf<CombatantConfig.Options>();

// @ts-expect-error - a BaseCombatant is not a Combatant
new CombatantConfig(baseCombatant);

const combatantConfig = new CombatantConfig(combatant);
expectTypeOf(combatantConfig.document).toEqualTypeOf<Combatant>();
expectTypeOf(combatantConfig.object).toEqualTypeOf<Combatant>();
expectTypeOf(CombatantConfig.defaultOptions).toEqualTypeOf<CombatantConfig.Options>();
expectTypeOf(combatantConfig.options).toEqualTypeOf<CombatantConfig.Options>();
expectTypeOf(combatantConfig.options).toEqualTypeOf<CombatantConfig.Options>();

expectTypeOf(combatantConfig.title).toEqualTypeOf<string>();
