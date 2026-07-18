import { expectTypeOf } from "vitest";

declare const doc: Actor.Implementation;
const ownershipConfig = new foundry.applications.apps.DocumentOwnershipConfig<Actor.Implementation>({ document: doc });

expectTypeOf(ownershipConfig.document).toEqualTypeOf<Actor.Implementation>();
expectTypeOf(ownershipConfig.title).toEqualTypeOf<string>();

expectTypeOf(
  foundry.applications.apps.DocumentOwnershipConfig.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.api.DocumentSheetV2.DefaultOptions>();
expectTypeOf(foundry.applications.apps.DocumentOwnershipConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
