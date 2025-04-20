import { expectTypeOf } from "vitest";

expectTypeOf(MeasuredTemplate.embeddedName).toEqualTypeOf<"MeasuredTemplate">();

const template = new MeasuredTemplate.implementation(new MeasuredTemplateDocument.implementation());
expectTypeOf(template.draw()).toEqualTypeOf<Promise<MeasuredTemplate.Implementation>>();
expectTypeOf(template.refresh()).toEqualTypeOf<MeasuredTemplate.Implementation>();

// TODO: Rework test to validate data post-data model

expectTypeOf(template.sheet).toEqualTypeOf<FormApplication.Any | foundry.applications.api.ApplicationV2.Any | null>();
