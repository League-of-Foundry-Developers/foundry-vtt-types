import { expectTypeOf } from "vitest";

import fields = foundry.data.fields;

// @ts-expect-error - Adventure requires name.
new Adventure.implementation();

// @ts-expect-error - Adventure requires name.
new Adventure.implementation({});

const adventure = new Adventure.implementation({ name: "My adventure" });
expectTypeOf(adventure).toEqualTypeOf<Adventure.Implementation>();

expectTypeOf(adventure.import()).toEqualTypeOf<Promise<Adventure.ImportResult>>();
expectTypeOf(adventure.prepareImport()).toEqualTypeOf<Promise<Adventure.ImportData>>();
expectTypeOf(adventure.importContent()).toEqualTypeOf<Promise<Adventure.ImportResult>>();

expectTypeOf(adventure.sheet).toEqualTypeOf<FormApplication.Any | foundry.applications.api.ApplicationV2.Any | null>();

declare const source: fields.SchemaField.AssignmentData<fields.DataSchema>;

expectTypeOf(Adventure.fromSource(source)).toEqualTypeOf<Adventure.Implementation>();
