import { expectTypeOf } from "vitest";

import Application = foundry.appv1.api.Application;
import DocumentSheetV2 = foundry.applications.api.DocumentSheetV2;

// @ts-expect-error Adventure requires name.
new Adventure.implementation();

// @ts-expect-error Adventure requires name.
new Adventure.implementation({});

const adventure = new Adventure.implementation({ name: "My adventure" });
expectTypeOf(adventure).toEqualTypeOf<Adventure.Implementation>();

expectTypeOf(adventure.import()).toEqualTypeOf<Promise<Adventure.ImportResult>>();
expectTypeOf(adventure.prepareImport()).toEqualTypeOf<Promise<Adventure.ImportData>>();
expectTypeOf(adventure.importContent({ toCreate: {}, toUpdate: {}, documentCount: 10 })).toEqualTypeOf<
  Promise<Adventure.ImportResult>
>();

expectTypeOf(adventure.sheet).toEqualTypeOf<Application.Any | DocumentSheetV2.Any | null>();

expectTypeOf(Adventure.fromSource({ name: "My adventure" })).toEqualTypeOf<Adventure.Implementation>();
