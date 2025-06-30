import type { AnyObject, Merge } from "#utils";
import type Document from "../abstract/document.d.mts";
import type { DataField, ObjectField } from "../data/fields.d.mts";

export type DocumentTypesConfiguration = Record<string, Record<string, AnyObject>>;

/**
 * A special {@linkcode ObjectField} available to packages which configures any additional Document subtypes
 * provided by the package.
 */
declare class AdditionalTypesField<
  Options extends DataField.Options<AnyObject> = AdditionalTypesField.DefaultOptions,
> extends ObjectField<
  Options,
  // Note(LukeAbby): `{}` is a valid initial so `| null | undefined` is added. Needs to respect overriden `initial` in the future.
  AdditionalTypesField.ServerTypeDeclarations | null | undefined,
  AdditionalTypesField.ServerTypeDeclarations,
  AdditionalTypesField.ServerTypeDeclarations
> {
  static get _defaults(): AdditionalTypesField.DefaultOptions;

  protected _validateType(
    value: AdditionalTypesField.ServerTypeDeclarations,
    options?: DataField.ValidateOptions<this>,
  ): boolean | void;
}

export default AdditionalTypesField;

declare namespace AdditionalTypesField {
  type DefaultOptions = Merge<
    ObjectField.DefaultOptions,
    {
      readonly: true;
      validationError: "is not a valid sub-types configuration";
    }
  >;

  type ServerTypeDeclarations = Record<Document.SystemType, Record<string, Record<string, unknown>>>;
}
