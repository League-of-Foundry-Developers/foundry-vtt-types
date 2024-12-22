import type { AnyObject, Merge } from "../../../utils/index.d.mts";
import type Document from "../abstract/document.d.mts";
import type { DataField, ObjectField } from "../data/fields.d.mts";

export type DocumentTypesConfiguration = Record<string, Record<string, AnyObject>>;

/**
 * A special [ObjectField]{@link ObjectField} available to packages which configures any additional Document subtypes
 * provided by the package.
 */
declare class AdditionalTypesField<
  Options extends AdditionalTypesField.DefaultOptions = AdditionalTypesField.DefaultOptions,
> extends ObjectField<
  Options,
  AdditionalTypesField.ServerTypeDeclarations,
  AdditionalTypesField.ServerTypeDeclarations,
  AdditionalTypesField.ServerTypeDeclarations
> {
  static get _defaults(): AdditionalTypesField.DefaultOptions;

  protected _validateType(
    value: ObjectField.InitializedType<Options>,
    options?: DataField.ValidationOptions<DataField.Any>,
  ): boolean | void;
}

export default AdditionalTypesField;

declare namespace AdditionalTypesField {
  type DefaultOptions = Merge<
    ObjectField.DefaultOptions,
    {
      // Required is set as false BUT this doesn't work correctly in v11
      // TODO: Re-enable in v12
      // required: false;
      readonly: true;
      validationError: "is not a valid sub-types configuration";
    }
  >;

  type ServerTypeDeclarations = Record<Document.SystemType, Record<string, Record<string, unknown>>>;
}
