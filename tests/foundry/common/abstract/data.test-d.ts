import { expectTypeOf } from "vitest";
import type { AnyMutableObject, InterfaceToObject } from "#utils";

import fields = foundry.data.fields;
import DataModel = foundry.abstract.DataModel;
import SchemaField = foundry.data.fields.SchemaField;
import LightData = foundry.data.LightData;
import PrototypeToken = foundry.data.PrototypeToken;
import Document = foundry.abstract.Document;
import DataField = foundry.data.fields.DataField;

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
  id: new fields.DocumentIdField(),
  bob: new fields.NumberField(),
});

const mySchema = {
  foo: new fields.BooleanField(),
  // our model used to have a property named bar that was the same as foo
  // bar: new fields.BooleanField()
  baz: new fields.StringField(),
  // foobar used to be an array of innerSchemas and needs to be migrated
  foobar: new fields.TypedObjectField(new fields.SchemaField(innerSchema())),
};

const simpleSchema = {
  foo: new fields.BooleanField(),
};

/**
 * The simplest possible `DataModel` subclass
 */
class _SimpleModel extends DataModel<SimpleModel.Schema> {
  static override defineSchema() {
    return simpleSchema;
  }
}

declare namespace SimpleModel {
  type Schema = typeof simpleSchema;
}

/**
 * A DataModel subclass containing recommendations, notes, and examples for overriding various methods.
 *
 * @remarks For example purposes, this model takes and passes along a `Parent` type param to show
 * passing it through via subclass overrides. If your model is expected to never have parents, it, as
 * well as the type param on {@linkcode ExampleModel.fromSource}, is unnecessary, and you can simply
 * extend `DataModel<Schema, null, ExtraConstructorOptions>`. Additionally many, perhaps most models
 * will not require any `ExtraConstructorOptions`, and in such cases it can be omitted everywhere it
 * appears below.
 */
class ExampleModel<Parent extends ExampleModel.Parent = ExampleModel.Parent> extends DataModel<
  ExampleModel.Schema,
  Parent,
  ExampleModel.ECO
> {
  someExtraConstructorOption = "";

  static override defineSchema() {
    return mySchema;
  }

  // Necessary type override
  static override get schema() {
    return super.schema as SchemaField<ExampleModel.Schema>;
  }

  // Type override only *required* if you're typing your shims. If you are actually implementing more than calling super,
  // typing `data` as `this | CreateData` without the `| LazyUnknown` will be accurate for almost all real-world usage.
  protected override _initializeSource(
    data: this | ExampleModel.CreateData,
    // Remember to include your ExtraConstructionOptions, if any
    options: DataModel.InitializeOptions & ExampleModel.ECO = {},
  ) {
    // This return only requires a cast if you are typing your shims
    return super._initializeSource(data, options) as ExampleModel.SourceData;
  }

  // Necessary type override
  static override cleanData(source?: ExampleModel.CreateData, options: DataField.CleanOptions = {}) {
    // Since this is called after `migrateData` but before `shimData`, the cast should be to un-shimmed SourceData
    return super.cleanData(source as AnyMutableObject, options) as ExampleModel.UnshimmedSourceData;
  }

  // Because `DataModel#clone` returns `this`, an override cannot sufficiently cast its return from the inside,
  // so if a different parent is being set, the cast is forced to be the responsibility of the caller, e.g:
  // const clone = exampleModel.clone({}, {parent: someOtherModel}) as ExampleModel<typeof someOtherModel>

  // If your model does not allow parents, remove the type param from this method signature, `FromSourceOptions`, and the cast
  static override fromSource<Parent extends DataModel.Any | null = DataModel.Any | null>(
    source: ExampleModel.CreateData,

    // remember to include your ExtraConstructionOptions, if any
    context: DataModel.FromSourceOptions<Parent> & ExampleModel.ECO = {},
  ) {
    // Have to cast to never to pass `source` to `DataModel.fromSource` to get around direct-calling protection
    // im addition to the return cast
    return super.fromSource(source as never, context) as ExampleModel<Parent>;
  }

  static override migrateData(source: AnyMutableObject) {
    // migrate a formerly ArrayField to a TypedObjectField
    if (Array.isArray(source["foobar"])) {
      source["foobar"] = source["foobar"].reduce(
        (obj, foobar) => (obj?.id ? Object.assign(foobar, { [obj.id]: obj }) : foobar),
        {},
      );
    }
    source = super.migrateData(source) ?? source;
    return source as InterfaceToObject<ExampleModel.SourceData>;
  }

  // static override shimData(data: ExampleModel.SourceData, _options?: DataModel.ShimDataOptions) {
  //   // have to cast the output of DataModel.shimData
  //   data = super.shimData(data, _options) as ExampleModel.UnshimmedSourceData;
  //   // protected static so need index access syntax
  //   Document["_addDataFieldShim"](data as AnyMutableObject, "bar", "foo");
  //   // our SourceData includes our shims
  //   return data as ExampleModel.SourceData;
  // }

  // This is a a no-op in `DataModel`,
  static override validateJoint(data: ExampleModel.SourceData) {
    if (data.foobar?.["someID"] && data.foo) throw new Error("Must not have `foo: true` with a `someID` foobar!");
  }

  // Not a necessary type override, but if you do override remember to include your ExtraConstructionOptions, if any
  protected override _configure(options: DataModel.ConfigureOptions & ExampleModel.ECO = {}) {
    if (options?.someExtraConstructionOption)
      options.someExtraConstructionOption = options.someExtraConstructionOption.capitalize();
  }

  // Not a necessary type override, but if you do override remember to include your ExtraConstructionOptions, if any
  protected override _initialize(options: DataModel.InitializeOptions & ExampleModel.ECO = {}) {
    this.someExtraConstructorOption = options?.someExtraConstructionOption ?? "foo";
  }

  /**
   * `ExampleModel#bar` is deprecated in favour of {@linkcode ExampleModel.foo | ExampleModel#foo}
   */
  get bar() {
    Document["_logDataFieldMigration"]("bar", "foo", { once: false, since: 13, until: 25 });
    return this.foo;
  }
}

declare namespace ExampleModel {
  type Schema = typeof mySchema;
  type Parent = DataModel.Any | null;

  interface CreateData extends SchemaField.CreateData<Schema> {
    /**
     * @deprecated `ExampleModel#bar` is deprecated in favour of {@linkcode ExampleModel.foo | ExampleModel#foo} (since v13, until v25)
     */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    bar?: DataField.AssignmentTypeFor<Schema["foo"]>;
  }

  interface UpdateData extends SchemaField.UpdateData<Schema> {
    /**
     * @deprecated `ExampleModel#bar` is deprecated in favour of {@linkcode ExampleModel.foo | ExampleModel#foo} (since v13, until v25)
     */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    bar?: DataField.AssignmentTypeFor<Schema["foo"]>;
  }

  interface UnshimmedSourceData extends SchemaField.SourceData<Schema> {}

  interface SourceData extends SchemaField.SourceData<Schema> {
    /**
     * @deprecated `ExampleModel#bar` is deprecated in favour of {@linkcode ExampleModel.foo | ExampleModel#foo} (since v13, until v25)
     */
    bar?: DataField.PersistedTypeFor<Schema["foo"]>;
  }

  // most models likely wont be using this param at all, but it's included in this example for completeness
  interface ECO {
    someExtraConstructionOption?: string;
  }
}
declare const lightData: LightData;
declare const prototypeToken: PrototypeToken;
// declare const createData: ExampleModel.CreateData;
// declare const updateData: ExampleModel.UpdateData;
// declare const sourceData: ExampleModel.SourceData;

const fromSourceLightData = ExampleModel.fromSource({ foo: true }, { parent: lightData });
const fromSourcePrototypeToken = ExampleModel.fromSource({ foo: undefined }, { parent: prototypeToken });
// @ts-expect-error these have different parents
expectTypeOf(fromSourceLightData).toEqualTypeOf<typeof fromSourcePrototypeToken>();
expectTypeOf(fromSourceLightData.parent).toEqualTypeOf<LightData>();
expectTypeOf(fromSourcePrototypeToken.parent).toEqualTypeOf<PrototypeToken>();
