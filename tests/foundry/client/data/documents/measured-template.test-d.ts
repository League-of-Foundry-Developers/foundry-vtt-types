import { expectTypeOf } from "vitest";

const doc = new MeasuredTemplateDocument();

expectTypeOf(doc.isAuthor).toEqualTypeOf<boolean>();
expectTypeOf(doc.layer).toEqualTypeOf<TemplateLayer>();
expectTypeOf(doc.rotation).toEqualTypeOf<MeasuredTemplateDocument["direction"]>();

expectTypeOf(doc.sheet).toEqualTypeOf<FormApplication.Any | foundry.applications.api.ApplicationV2.Any | null>();
