import { expectTypeOf } from "vitest";

expectTypeOf(MeasuredTemplate.embeddedName).toEqualTypeOf<"MeasuredTemplate">();

const template = new MeasuredTemplate(new MeasuredTemplateDocument());
expectTypeOf(template.draw()).toEqualTypeOf<Promise<MeasuredTemplate>>();
expectTypeOf(template.refresh()).toEqualTypeOf<MeasuredTemplate>();

// TODO: Rework test to validate data post-data model

expectTypeOf(template.sheet).toEqualTypeOf<FormApplication.Any | foundry.applications.api.ApplicationV2.Any | null>();
