import { expectTypeOf } from "vitest";
import fields = foundry.data.fields;

import DataModel = foundry.abstract.DataModel;
import SchemaField = foundry.data.fields.SchemaField;
import LightData = foundry.data.LightData;
import PrototypeToken = foundry.data.PrototypeToken;
import Document = foundry.abstract.Document;
import type { DataField } from "#common/data/fields.mjs";
import type { AnyMutableObject } from "#utils";

declare const myItem: foundry.documents.BaseItem;

myItem.updateSource({ img: "newPath" });

// @ts-expect-error foo isn't a valid property
myItem.updateSource({ foo: "bar" });

// type SchemaWithIndexSignatures = {
//   genericProperty: fields.StringField;

//   [K: string | number | symbol]: fields.StringField | fields.NumberField;
// };

// class _GenericDataModel<Schema extends SchemaWithIndexSignatures> extends foundry.abstract.DataModel<Schema, null> {
//   method() {
//     expectTypeOf(this.genericProperty).toEqualTypeOf<string >();

//     // @ts-expect-error - string index signatures should be stripped so accessing an arbitrary string should fail.
//     this.arbitraryProperty;

//     // @ts-expect-error - number index signatures should be stripped so accessing an arbitrary number should fail.
//     this[0];

//     // @ts-expect-error - symbol index signatures should be stripped so accessing an arbitrary symbol should fail.
//     this[Symbol("symbol")];
//   }
// }

// foundry will choke on the reuse of schema objects, so reused schemas must be wrapped in a function
// and it doesn't hurt to make it your default pattern
const innerSchema = () => ({
  fizz: new fields.DocumentIdField(),
});

const mySchema = {
  foo: new fields.BooleanField(),
  // our model used to have a property named bar that was the same as foo
  // bar: new fields.BooleanField()
  baz: new fields.StringField(),
  // foobar used to be an array of innerSchemas and needs to be migrated
  foobar: new fields.TypedObjectField(new fields.SchemaField(innerSchema())),
};

// most models likely wont be using this param at all, but it's included in this example for completeness
interface MyExtraConstructorOptions {
  someECOProp?: string;
}

class ExampleModel<Parent extends DataModel.Any | null = DataModel.Any | null> extends DataModel<
  ExampleModel.Schema,
  Parent,
  MyExtraConstructorOptions
> {
  static override defineSchema() {
    return mySchema;
  }

  someECOProp = "";

  protected override _configure(options?: DataModel.ConfigureOptions & MyExtraConstructorOptions) {
    if (options?.someECOProp) options.someECOProp = options.someECOProp.capitalize();
  }

  protected override _initialize(options?: DataModel.InitializeOptions & MyExtraConstructorOptions) {
    this.someECOProp = options?.someECOProp ?? "foo";
  }

  static override fromSource<Parent extends DataModel.Any | null = DataModel.Any | null>(
    source: ExampleModel.CreateData,
    // remember to include your ExtraConstructionOptions, if any
    context?: DataModel.FromSourceOptions<Parent> & MyExtraConstructorOptions,
  ) {
    // have to cast to never to pass `source` to `DataModel.fromSource`
    return super.fromSource(source as never, context) as ExampleModel<Parent>;
  }

  static override migrateData(source: AnyMutableObject) {
    source = super.migrateData(source);
    if (Array.isArray(source.foobar)) {
      source.foo = source.bar;
      delete source.bar;
    }
    return source;
  }

  static override shimData(data: ExampleModel.SourceData, _options?: DataModel.ShimDataOptions) {
    // have to cast the output of DataModel.shimData
    data = super.shimData(data, _options) as ExampleModel.SourceData;
    Document["_addDataFieldShim"](data, "bar", "foo");
    return data; // as ExampleModel.ShimmedData;
  }
}

declare namespace ExampleModel {
  type Schema = typeof mySchema;

  interface CreateData extends SchemaField.CreateData<Schema> {}
  interface UpdateData extends SchemaField.UpdateData<Schema> {}
  interface SourceData extends SchemaField.SourceData<Schema> {}

  interface ShimmedData extends SourceData {
    bar?: DataField.InitializedTypeFor<Schema["foo"]>;
  }
}
declare const lightData: LightData;
declare const prototypeToken: PrototypeToken;

const fromSourceLightData = ExampleModel.fromSource({ foo: true }, { parent: lightData });
const fromSourcePrototypeToken = ExampleModel.fromSource({ foo: undefined }, { parent: prototypeToken });
// @ts-expect-error these have different parents
expectTypeOf(fromSourceLightData).toEqualTypeOf<typeof fromSourcePrototypeToken>();
expectTypeOf(fromSourceLightData.parent).toEqualTypeOf<LightData>();
expectTypeOf(fromSourcePrototypeToken.parent).toEqualTypeOf<PrototypeToken>();
