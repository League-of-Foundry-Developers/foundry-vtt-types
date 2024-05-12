import type { FieldReturnType, PropertiesToSource } from "../../../../types/helperTypes.d.mts";
import type { DocumentData } from "../../abstract/module.d.mts";
import type * as documents from "../../documents.mjs/module.d.mts";
import type * as fields from "../fields.d.mts";

export interface SettingDataSchema extends DocumentSchema {
  _id: fields.DocumentId;
  key: DocumentField<string> & {
    type: typeof String;
    required: true;
    validate: typeof _validateKeyFormat;
    validationError: "Invalid setting key format which should be {scope}.{field}";
  };
  value: FieldReturnType<fields.JsonField, { required: true }>;
}

export interface SettingDataProperties {
  /**
   * The _id which uniquely identifies this Setting document
   * @defaultValue `null`
   */
  _id: string | null;

  /**
   * The setting key, a composite of \{scope\}.\{name\}
   */
  key: `${string}.${string}`;

  /**
   * The setting value, which may be any type of data
   * @remarks This is the stringified data
   */
  value: string;
}

export interface SettingDataConstructorData {
  /**
   * The _id which uniquely identifies this Setting document
   * @defaultValue `null`
   */
  _id?: string | null | undefined;

  /**
   * The setting key, a composite of \{scope\}.\{name\}
   */
  key: `${string}.${string}`;

  /**
   * The setting value, which may be any type of data
   * @remarks This is the stringified data
   */
  value: string | object;
}

export type SettingDataSource = PropertiesToSource<SettingDataProperties>;

/**
 * The data schema for a Setting document.
 * @see BaseSetting
 */
export declare class SettingData extends DocumentData<
  SettingDataSchema,
  SettingDataProperties,
  SettingDataSource,
  SettingDataConstructorData,
  documents.BaseSetting
> {
  /**
   * @remarks
   * This constructor is only typed to be overridden to make the first parameter
   * required. It isn't actually overridden at runtime.
   */
  constructor(data: SettingDataConstructorData, document?: documents.BaseSetting | null);

  static override defineSchema(): SettingDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SettingData extends SettingDataProperties {}

/**
 * Validate that each setting key matches the expected format
 * @param key - The key to test
 * @returns Is the key valid?
 */
export declare function _validateKeyFormat(key: string): boolean;
