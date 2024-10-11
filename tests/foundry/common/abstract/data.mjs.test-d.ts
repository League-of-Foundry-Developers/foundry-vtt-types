import { expectTypeOf } from "vitest";
import fields = foundry.data.fields;

declare const myItem: foundry.documents.BaseItem;

myItem.updateSource({ img: "newPath" });
//@ts-expect-error foo isn't a valid path
myItem.updateSource({ foo: "bar" });

type SchemaWithIndexSignatures = {
  genericProperty: fields.StringField<{}>;

  [K: string | number | symbol]: fields.StringField<{}> | fields.NumberField;
};

class _GenericDataModel<Schema extends SchemaWithIndexSignatures> extends foundry.abstract.DataModel<Schema, null> {
  method() {
    expectTypeOf(this.genericProperty).toEqualTypeOf<string | undefined>();

    // @ts-expect-error - string index signatures should be stripped so accessing an arbitrary string should fail.
    this.arbitraryProperty;

    // @ts-expect-error - number index signatures should be stripped so accessing an arbitrary number should fail.
    this[0];

    // @ts-expect-error - symbol index signatures should be stripped so accessing an arbitrary symbol should fail.
    this[Symbol("symbol")];
  }
}
