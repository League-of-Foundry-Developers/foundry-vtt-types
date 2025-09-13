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
  AdditionalTypesField.DocumentTypesConfiguration | null | undefined,
  AdditionalTypesField.DocumentTypesConfiguration,
  AdditionalTypesField.DocumentTypesConfiguration
> {
  static get _defaults(): AdditionalTypesField.DefaultOptions;

  protected _validateType(
    value: AdditionalTypesField.DocumentTypesConfiguration,
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

  /**
   * Document subtype registration information for systems and modules.
   * The first layer of keys are document types, e.g. "Actor" or "Item".
   * The second layer of keys are document subtypes, e.g. "character" or "feature".
   */
  type DocumentTypesConfiguration = Record<Document.SystemType, Record<string, ServerSanitizationFields>>;

  /** @deprecated Internal type will be removed */
  type ServerTypeDeclarations = DocumentTypesConfiguration;

  /** @deprecated Use {@linkcode ServerSanitizationFields} instead. This warning will be removed in v14. */
  type ServerSanitationFields = ServerSanitizationFields;

  /**
   * Fields that need dedicated server-side handling. Paths are automatically relative to `system`.
   */
  interface ServerSanitizationFields {
    /**
     * HTML fields that must be cleaned by the server, e.g. `"description.value"`
     */
    htmlFields?: string[] | undefined;

    /**
     * File path fields that must be cleaned by the server.
     * Each key is a field path and the values are an array of keys in {@linkcode CONST.FILE_CATEGORIES}.
     */
    filePathFields?: Record<string, CONST.FILE_CATEGORIES> | undefined;

    /**
     * Fields that can only be updated by a GM user.
     */
    gmOnlyFields?: string[] | undefined;
  }
}
