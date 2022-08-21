import { expectError, expectType } from "tsd";

declare const combatant: Combatant;
declare const baseCombatant: foundry.documents.BaseCombatant;

expectType<CombatantConfig.Options>(CombatantConfig.defaultOptions);

expectError(new CombatantConfig());
expectError(new CombatantConfig(undefined));
expectError(new CombatantConfig(baseCombatant));

const sheet = new CombatantConfig(combatant);
expectType<Combatant>(sheet.document);
expectType<Combatant>(sheet.object);
expectType<string>(sheet.title);
expectType<CombatantConfig.Options>(sheet.options);
