import { expectTypeOf } from "vitest";

const app = new foundry.applications.apps.CombatTrackerConfig();

expectTypeOf(
  foundry.applications.apps.CombatTrackerConfig.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.apps.CombatTrackerConfig.DefaultOptions>();
expectTypeOf(foundry.applications.apps.CombatTrackerConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

expectTypeOf(app).toEqualTypeOf<foundry.applications.apps.CombatTrackerConfig>();
