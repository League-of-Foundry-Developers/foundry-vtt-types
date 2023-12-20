import { expectTypeOf } from "vitest";

const doc = new MeasuredTemplateDocument();

expectTypeOf(doc.author).toEqualTypeOf<User | undefined>();
// TODO: Modify to TemplateLayer | null once data can be grabbed from CONFIG
expectTypeOf(doc.layer).toEqualTypeOf<PlaceablesLayer<any>>();

// TODO: Modify to MeasuredTemplateConfig | null once data can be grabbed from CONFIG
expectTypeOf(doc.sheet).toEqualTypeOf<FormApplication | null>();
