import { expectTypeOf } from "vitest";

import TemplateLayer = foundry.canvas.layers.TemplateLayer;
import FormApplication = foundry.appv1.api.FormApplication;

const doc = new MeasuredTemplateDocument.implementation();

expectTypeOf(doc.isAuthor).toEqualTypeOf<boolean>();
expectTypeOf(doc.layer).toEqualTypeOf<TemplateLayer>();
expectTypeOf(doc.rotation).toEqualTypeOf<MeasuredTemplateDocument.Implementation["direction"]>();

expectTypeOf(doc.sheet).toEqualTypeOf<FormApplication.Any | foundry.applications.api.ApplicationV2.Any | null>();
