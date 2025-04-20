import { expectTypeOf } from "vitest";

import DataModel = foundry.abstract.DataModel;
import fields = foundry.data.fields;

// @ts-expect-error - Adventure requires name.
new Adventure.implementation();

// @ts-expect-error - Adventure requires name.
new Adventure.implementation({});

const adventure = new Adventure.implementation({ name: "My adventure" });
expectTypeOf(adventure).toEqualTypeOf<Adventure.Implementation>();

expectTypeOf(adventure.import()).toEqualTypeOf<Promise<AdventureImportResult>>();
expectTypeOf(adventure.prepareImport()).toEqualTypeOf<Promise<AdventureImportData>>();
expectTypeOf(adventure.importContent()).toEqualTypeOf<Promise<AdventureImportResult>>();

expectTypeOf(adventure.sheet).toEqualTypeOf<FormApplication.Any | foundry.applications.api.ApplicationV2.Any | null>();

declare const source: fields.SchemaField.AssignmentData<fields.DataSchema>;

expectTypeOf(Adventure.fromSource(source)).toEqualTypeOf<DataModel<fields.DataSchema, DataModel.Any | null>>();
