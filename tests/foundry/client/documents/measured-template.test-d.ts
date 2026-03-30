import { expectTypeOf } from "vitest";

import TemplateLayer = foundry.canvas.layers.TemplateLayer;
import Application = foundry.appv1.api.Application;
import DocumentSheetV2 = foundry.applications.api.DocumentSheetV2;

const doc = new MeasuredTemplateDocument.implementation();

expectTypeOf(doc.isAuthor).toEqualTypeOf<boolean>();
expectTypeOf(doc.layer).toEqualTypeOf<TemplateLayer>();
expectTypeOf(doc.rotation).toEqualTypeOf<MeasuredTemplateDocument.Implementation["direction"]>();

expectTypeOf(doc.sheet).toEqualTypeOf<Application.Any | DocumentSheetV2.Any | null>();
