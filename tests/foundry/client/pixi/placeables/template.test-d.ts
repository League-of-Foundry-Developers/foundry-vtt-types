import { expectTypeOf } from "vitest";

expectTypeOf(MeasuredTemplate.embeddedName).toEqualTypeOf<"MeasuredTemplate">();

const template = new MeasuredTemplate(new MeasuredTemplateDocument());
expectTypeOf(template.draw()).toEqualTypeOf<Promise<MeasuredTemplate>>();
expectTypeOf(template.refresh()).toEqualTypeOf<MeasuredTemplate>();

// TODO: Rework test to validate data post-data model

// TODO: Modify to the configured document sheet once the data can be grabbed from config
expectTypeOf(template.sheet).toEqualTypeOf<FormApplication | null>();
