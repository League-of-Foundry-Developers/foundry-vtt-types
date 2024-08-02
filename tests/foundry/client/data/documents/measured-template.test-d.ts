import { expectTypeOf } from "vitest";

const doc = new MeasuredTemplateDocument();

expectTypeOf(doc.isAuthor).toEqualTypeOf<boolean>();
expectTypeOf(doc.layer).toEqualTypeOf<TemplateLayer>();
expectTypeOf(doc.rotation).toEqualTypeOf<MeasuredTemplateDocument["direction"]>();

// TODO: Modify to MeasuredTemplateConfig | null once data can be grabbed from CONFIG
expectTypeOf(doc.sheet).toEqualTypeOf<FormApplication | null>();
