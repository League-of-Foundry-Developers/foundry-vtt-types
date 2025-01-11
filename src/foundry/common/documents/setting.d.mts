import type Document from "../abstract/document.mts";
import type * as fields from "../data/fields.d.mts";

type DataSchema = foundry.data.fields.DataSchema;

/**
 * The Setting Document.
 * Defines the DataSchema and common behaviors for a Setting which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare class BaseSetting extends Document<"Setting", BaseSetting.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the Setting
   * @param context - Construction context options
   */
  // TODO(LukeAbby): This constructor is a symptom of a circular error.
  // constructor(data: BaseSetting.ConstructorData, context?: Document.ConstructionContext<BaseSetting.Parent>);

  override parent: BaseSetting.Parent;

  static override metadata: BaseSetting.Metadata;

  static override defineSchema(): BaseSetting.Schema;

  static canUserCreate(user: User): boolean;
}

export default BaseSetting;

declare namespace BaseSetting {
  type Parent = null;

  type Metadata = Document.MetadataFor<BaseSetting>;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = fields.SchemaField.CreateData<Schema>;
  type UpdateData = fields.SchemaField.AssignmentData<Schema>;
  type Properties = fields.SchemaField.InitializedData<Schema>;
  type Source = fields.SchemaField.PersistedData<Schema>;

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
      initial: null;
    }>;

    /**
     * An object of creation and access information
     * @defaultValue see {@link fields.DocumentStatsField}
     */
    _stats: fields.DocumentStatsField;
  }
}
