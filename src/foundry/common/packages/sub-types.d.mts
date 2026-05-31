import type { AnyObject, InexactPartial, SimpleMerge } from "#utils";
import type { Document } from "#common/abstract/_module.d.mts";
import type { DataField, ObjectField } from "#common/data/fields.d.mts";

/**
 * @deprecated Use {@linkcode foundry.packages.AdditionalTypesField.DocumentTypesConfiguration} instead. This warning will be removed in v14.
 */
export type DocumentTypesConfiguration = Record<string, Record<string, AnyObject>>;

/**
 * A special {@linkcode ObjectField} available to packages which configures any additional Document subtypes
 * provided by the package.
 */
declare class AdditionalTypesField<
  Options extends DataField.Options<AnyObject> = AdditionalTypesField.DefaultOptions,
> extends ObjectField<
  Options,
  // Note(LukeAbby): `{}` is a valid initial so `| null | undefined` is added. Needs to respect overridden `initial` in the future.
  AdditionalTypesField.DocumentTypesConfiguration | null | undefined,
  AdditionalTypesField.DocumentTypesConfiguration,
  AdditionalTypesField.DocumentTypesConfiguration
> {
  static get _defaults(): DataField.Options<AnyObject>;

  protected _validateType(
    value: AdditionalTypesField.DocumentTypesConfiguration,
    options?: DataField.ValidateOptions<this>,
  ): boolean | void;
}

export default AdditionalTypesField;

declare namespace AdditionalTypesField {
  type DefaultOptions = SimpleMerge<
    ObjectField.DefaultOptions,
    {
      readonly: true;
      validationError: "is not a valid sub-types configuration";
    }
  >;

  /**
   * Document subtype registration information for systems and modules.
   * The first layer of keys are document types, e.g. "Actor" or "Item".
   * The second layer of keys are document subtypes, e.g. "character" or "feature".
   */
  type DocumentTypesConfiguration = Record<Document.SystemType, Record<string, ServerSanitizationFields>>;

  /** @deprecated Internal type will be removed in v14. */
  type ServerTypeDeclarations = DocumentTypesConfiguration;

  /** @deprecated Use {@linkcode ServerSanitizationFields} instead. This warning will be removed in v14. */
  type ServerSanitationFields = ServerSanitizationFields;

  /** @internal */
  interface _ServerSanitizationFields {
    /**
     * HTML fields that must be cleaned by the server, e.g. `"description.value"`
     */
    htmlFields: string[];

    /**
     * File path fields that must be cleaned by the server.
     * Each key is a field path and the values are an array of keys in {@linkcode CONST.FILE_CATEGORIES}.
     */
    filePathFields: Record<string, CONST.FILE_CATEGORIES>;

    /**
     * Fields that can only be updated by a GM user.
     */
    gmOnlyFields: string[];
  }

  /**
   * Fields that need dedicated server-side handling. Paths are automatically relative to `system`.
   */
  interface ServerSanitizationFields extends InexactPartial<_ServerSanitizationFields> {}
}
