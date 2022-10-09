import { FieldReturnType, PropertiesToSource } from "../../../../types/helperTypes";
import { DocumentData } from "../../abstract/module.mjs";
import * as documents from "../../documents.mjs";
import * as fields from "../fields.mjs";

interface SettingDataSchema extends DocumentSchema {
  _id: fields.DocumentId;
  key: DocumentField<string> & {
    type: typeof String;
    required: true;
    validate: typeof _validateKeyFormat;
    validationError: "Invalid setting key format which should be {scope}.{field}";
  };
  value: FieldReturnType<fields.JsonField, { required: true }>;
}

interface SettingDataProperties {
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

interface SettingDataConstructorData {
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

type SettingDataSource = PropertiesToSource<SettingDataProperties>;

/**
 * The data schema for a Setting document.
 * @see BaseSetting
 */
export class SettingData extends DocumentData<
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
declare function _validateKeyFormat(key: string): boolean;
