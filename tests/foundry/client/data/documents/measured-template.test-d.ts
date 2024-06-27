import { expectTypeOf } from "vitest";

const doc = new MeasuredTemplateDocument();

expectTypeOf(doc.author).toEqualTypeOf<User | undefined>();
expectTypeOf(doc.layer).toEqualTypeOf<TemplateLayer>();

// TODO: Modify to MeasuredTemplateConfig | null once data can be grabbed from CONFIG
expectTypeOf(doc.sheet).toEqualTypeOf<FormApplication | null>();
