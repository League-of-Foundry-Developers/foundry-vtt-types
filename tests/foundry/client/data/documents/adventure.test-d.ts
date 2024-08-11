import { expectTypeOf } from "vitest";
import type { DataModel } from "../../../../../src/foundry/common/abstract/module.d.mts";
import type { fields } from "../../../../../src/foundry/common/data/module.d.mts";

// @ts-expect-error - Adventure requires name.
new Adventure();

// @ts-expect-error - Adventure requires name.
new Adventure({});

const adventure = new Adventure({ name: "My adventure" });
expectTypeOf(adventure).toEqualTypeOf<Adventure>();

expectTypeOf(adventure.import()).toEqualTypeOf<Promise<AdventureImportResult>>();
expectTypeOf(adventure.prepareImport()).toEqualTypeOf<Promise<AdventureImportData>>();
expectTypeOf(adventure.importContent()).toEqualTypeOf<Promise<AdventureImportResult>>();

expectTypeOf(adventure.sheet).toEqualTypeOf<FormApplication | foundry.applications.api.ApplicationV2 | null>();

declare const source: fields.SchemaField.InnerAssignmentType<DataSchema>;

expectTypeOf(Adventure.fromSource(source)).toEqualTypeOf<DataModel<DataSchema, DataModel.Any | null>>();
