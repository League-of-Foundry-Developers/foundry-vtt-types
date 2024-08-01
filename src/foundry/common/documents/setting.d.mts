import type { Merge } from "../../../types/utils.mts";
import type Document from "../abstract/document.mts";
import type { DocumentMetadata } from "../abstract/document.mts";
import type * as fields from "../data/fields.d.mts";

declare global {
  type SettingData = BaseSetting.Properties;
}

/**
 * The Document definition for a Setting.
 * Defines the DataSchema and common behaviors for a Setting which are shared between both client and server.
 */
declare class BaseSetting extends Document<BaseSetting.Schema, BaseSetting.Metadata> {
  /**
   * @param data    - Initial data from which to construct the Setting
   * @param context - Construction context options
   */
  constructor(data: BaseSetting.ConstructorData, context?: DocumentConstructionContext);

  static override metadata: Readonly<BaseSetting.Metadata>;

  static override defineSchema(): BaseSetting.Schema;
}

export default BaseSetting;

declare namespace BaseSetting {
  type Metadata = Merge<
    DocumentMetadata,
    {
      name: "Setting";
      collection: "settings";
      label: "DOCUMENT.Setting";
      labelPlural: "DOCUMENT.Settings";
      permissions: {
        create: "SETTINGS_MODIFY";
        update: "SETTINGS_MODIFY";
        delete: "SETTINGS_MODIFY";
      };
    }
  >;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = fields.SchemaField.InnerConstructorType<Schema>;
  type UpdateData = fields.SchemaField.InnerAssignmentType<Schema>;
  type Properties = fields.SchemaField.InnerInitializedType<Schema>;
  type Source = fields.SchemaField.InnerPersistedType<Schema>;

  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this Setting document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The setting key, a composite of \{scope\}.\{name\}
     * @defaultValue `""`
     */
    key: fields.StringField<{
      required: true;
      nullable: false;
      blank: false;
      validate: (k: string) => boolean;
      validationError: "must have the format {scope}.{field}";
    }>;

    /**
     * The setting value, which is serialized to JSON
     * @defaultValue `undefined`
     */
    value: fields.JSONField<{
      required: true;
      nullable: true;
    }>;

    /**
     * An object of creation and access information
     * @defaultValue see {@link fields.DocumentStatsField}
     */
    _stats: fields.DocumentStatsField;
  }
}
