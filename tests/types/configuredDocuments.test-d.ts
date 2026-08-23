import { expectTypeOf } from "vitest";

// This is a regression test for the error:
// "'Item' is referenced directly or indirectly in its own type annotation."
// See https://gist.github.com/LukeAbby/f9561689e5cad8a4b1e9cb92a8c63982 for more information.
declare class CustomItemClass<SubType extends Item.SubType> extends Item<SubType> {
  configured: true;
}

declare module "fvtt-types/configuration" {
  interface DocumentClassConfig {
    Item: typeof CustomItemClass;
  }

  interface ConfiguredItem<SubType extends Item.SubType> {
    document: CustomItemClass<SubType>;
  }
}

expectTypeOf(CONFIG.Item.documentClass).toEqualTypeOf<typeof CustomItemClass>();

// This is a regression test for the error:
// "Type 'CustomCombatantClass<SubType>' recursively references itself as a base type."
// See https://github.com/League-of-Foundry-Developers/foundry-vtt-types/issues/3744.
// Note: This only errors on TS 5.7.
declare class CustomCombatantClass<SubType extends Combatant.SubType> extends Combatant<SubType> {
  configured: true;
}

declare module "fvtt-types/configuration" {
  interface DocumentClassConfig {
    Combatant: typeof CustomCombatantClass;
  }

  interface ConfiguredCombatant<SubType extends Combatant.SubType> {
    document: CustomCombatantClass<SubType>;
  }
}

expectTypeOf(CONFIG.Combatant.documentClass).toEqualTypeOf<typeof CustomCombatantClass>();
expectTypeOf<Combatant.Implementation>().toEqualTypeOf<CustomCombatantClass<Combatant.SubType>>();
