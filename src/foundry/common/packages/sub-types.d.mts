import type { Merge } from "../../../types/utils.d.mts";
import type { DataField, ObjectField } from "../data/fields.d.mts";

/**
 * A special [ObjectField]{@link ObjectField} available to packages which configures any additional Document sub-types
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
    options?: DataField.ValidationOptions<DataField.Any> | undefined,
  ): boolean | void;
}

export default AdditionalTypesField;

declare namespace AdditionalTypesField {
  type DefaultOptions = Merge<
    ObjectField.DefaultOptions,
    {
      // Required is set as false BUT this doesn't do anything.
      // TODO: Re-enable when ObjectField is updated
      // required: false;
      readonly: true;
      validationError: "is not a valid sub-types configuration";
    }
  >;

  // TODO: Replace the first key with type-eligible fields and second with the types in the game
  type ServerTypeDeclarations = Record<foundry.CONST.DOCUMENT_TYPES, Record<string, Record<string, unknown>>>;
}
