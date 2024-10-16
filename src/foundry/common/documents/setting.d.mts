import type { Merge } from "../../../types/utils.mts";
import type Document from "../abstract/document.mts";
import type * as fields from "../data/fields.d.mts";

declare global {
  type SettingData = BaseSetting.Properties;
}

/**
 * The Document definition for a Setting.
 * Defines the DataSchema and common behaviors for a Setting which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare class BaseSetting extends Document<BaseSetting.Schema, BaseSetting.Metadata, any> {
  /**
   * @param data    - Initial data from which to construct the Setting
   * @param context - Construction context options
   */
  // TODO(LukeAbby): This constructor is a symptom of a circular error.
  // constructor(data: BaseSetting.ConstructorData, context?: Document.ConstructionContext<BaseSetting.Parent>);

  override parent: BaseSetting.Parent;

  static override metadata: Readonly<BaseSetting.Metadata>;

  static override defineSchema(): BaseSetting.Schema;
}

export default BaseSetting;

declare namespace BaseSetting {
  type Parent = null;

  type Metadata = Merge<
    Document.Metadata.Default,
    {
      name: "Setting";
      collection: "settings";
      label: string;
      labelPlural: string;
      permissions: {
        create: "SETTINGS_MODIFY";
        update: "SETTINGS_MODIFY";
        delete: "SETTINGS_MODIFY";
      };
      schemaVersion: string;
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
