import { expectTypeOf } from "vitest";
import DataModel = foundry.abstract.DataModel;
import fields = foundry.data.fields;

declare const myItem: foundry.documents.BaseItem;

myItem.updateSource({ img: "newPath" });

// @ts-expect-error foo isn't a valid property
myItem.updateSource({ foo: "bar" });

type SchemaWithIndexSignatures = {
  genericProperty: fields.StringField;

  [K: string | number | symbol]: fields.StringField | fields.NumberField;
};

class _GenericDataModel<Schema extends SchemaWithIndexSignatures> extends foundry.abstract.DataModel<Schema, null> {
  method() {
    // @ts-expect-error While this shouldn't error it's a current known limitation of the current approach that a generic data model can't resolve properties fully.
    expectTypeOf(this.genericProperty).toEqualTypeOf<string | undefined>();

    // @ts-expect-error string index signatures should be stripped so accessing an arbitrary string should fail.
    this.arbitraryProperty;

    // @ts-expect-error number index signatures should be stripped so accessing an arbitrary number should fail.
    this[0];

    // @ts-expect-error symbol index signatures should be stripped so accessing an arbitrary symbol should fail.
    this[Symbol("symbol")];
  }
}

interface TestSchema extends fields.DataSchema {
  name: fields.StringField;
}

class _V14DataModelTest extends DataModel<TestSchema, null> {
  protected static override _preCleanData(
    data: object,
    options: fields.DataField.CleanOptions,
    _state: fields.DataField.UpdateState,
  ): void {
    super._preCleanData(data, options, _state);
  }

  protected static override _cleanData(
    data: object,
    options: fields.DataField.CleanOptions,
    _state: fields.DataField.UpdateState,
  ): void {
    super._cleanData(data, options, _state);
  }

  protected override _getInnerModel(
    field: fields.DataField.Any,
    element?: DataModel.GetInnerModelElement,
    options?: fields.DataField.CleanOptions,
  ): DataModel.Any | null {
    return super._getInnerModel(field, element, options);
  }

  protected override _initializationOrder(): Generator<[string, fields.DataField.Any], void, undefined> {
    return super._initializationOrder();
  }

  protected override _preUpdateSource(
    changes: fields.SchemaField.UpdateData<TestSchema>,
    options: DataModel.UpdateOptions,
    _state: fields.DataField.UpdateState,
  ): void {
    super._preUpdateSource(changes, options, _state);
  }

  protected override _updateDiff(
    copy: fields.SchemaField.SourceData<TestSchema>,
    changes: fields.SchemaField.UpdateData<TestSchema>,
    options: DataModel.UpdateOptions,
    _state: fields.DataField.UpdateState,
  ): fields.SchemaField.UpdateData<TestSchema> {
    return super._updateDiff(copy, changes, options, _state);
  }

  protected override _updateCommit(
    copy: fields.SchemaField.SourceData<TestSchema>,
    diff: fields.SchemaField.UpdateData<TestSchema>,
    options: DataModel.UpdateOptions,
    _state: fields.DataField.UpdateState,
  ): void {
    super._updateCommit(copy, diff, options, _state);
  }
}

declare const v14DataModel: _V14DataModelTest;

expectTypeOf(v14DataModel.getFieldForProperty("name")).toEqualTypeOf<fields.DataField.Unknown | undefined>();
expectTypeOf(v14DataModel.getFieldForProperty(["name"])).toEqualTypeOf<fields.DataField.Unknown | undefined>();
expectTypeOf(_V14DataModelTest.cleanData({}, {}, { creation: true })).toEqualTypeOf<object>();
