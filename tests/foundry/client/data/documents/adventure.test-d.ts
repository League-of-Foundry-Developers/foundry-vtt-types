import { expectTypeOf } from "vitest";

// @ts-expect-error - Adventure requires name.
new Adventure();

// @ts-expect-error - Adventure requires name.
new Adventure({});

const adventure = new Adventure({ name: "My adventure" });
expectTypeOf(adventure).toEqualTypeOf<Adventure>();

expectTypeOf(adventure.import()).toEqualTypeOf<Promise<AdventureImportResult>>();
expectTypeOf(adventure.prepareImport()).toEqualTypeOf<Promise<AdventureImportData>>();
expectTypeOf(adventure.importContent()).toEqualTypeOf<Promise<AdventureImportResult>>();

// TODO: Modify to Adventure | null once data can be grabbed from CONFIG
expectTypeOf(adventure.sheet).toEqualTypeOf<FormApplication | foundry.applications.api.ApplicationV2 | null>();
