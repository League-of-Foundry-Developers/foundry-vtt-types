import type { AnyObject } from "../../../utils/index.d.mts";
import type Document from "../abstract/document.mts";
import type { LightData } from "../data/data.mts";
import type * as fields from "../data/fields.d.mts";

type DataSchema = foundry.data.fields.DataSchema;

/**
 * The Document definition for an AmbientLight.
 * Defines the DataSchema and common behaviors for an AmbientLight which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseAmbientLight extends Document<"AmbientLight", BaseAmbientLight.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the AmbientLight
   * @param context - Construction context options
   */
  // TODO(LukeAbby): This constructor is a symptom of a circular error.
  // constructor(data?: BaseAmbientLight.ConstructorData, context?: Document.ConstructionContext<BaseAmbientLight.Parent>);

  override parent: BaseAmbientLight.Parent;

  static override metadata: BaseAmbientLight.Metadata;

  static override defineSchema(): BaseAmbientLight.Schema;

  static override migrateData(source: AnyObject): AnyObject;

  static [Document.Internal.DocumentName]: "AmbientLight";
}

export default BaseAmbientLight;

declare namespace BaseAmbientLight {
  type Parent = Scene.ConfiguredInstance | null;

  type Metadata = Document.MetadataFor<"AmbientLight">;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = fields.SchemaField.CreateData<Schema>;
  type UpdateData = fields.SchemaField.AssignmentData<Schema>;
  type Properties = fields.SchemaField.InitializedData<Schema>;
  type Source = fields.SchemaField.PersistedData<Schema>;

  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this BaseAmbientLight embedded document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The x-coordinate position of the origin of the light
     * @defaultValue `0`
     */
    x: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0; label: "XCoord" }>;

    /**
     * The y-coordinate position of the origin of the light
     * @defaultValue `0`
     */
    y: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0; label: "YCoord" }>;

    /**
     * The angle of rotation for the tile between 0 and 360
     * @defaultValue `0`
     */
    rotation: fields.AngleField<{ label: "LIGHT.Rotation" }>;

    /**
     * Whether or not this light source is constrained by Walls
     * @defaultValue `true`
     */
    walls: fields.BooleanField<{ initial: true; label: "LIGHT.Walls"; hint: "LIGHT.WallsHint" }>;

    /**
     * Whether or not this light source provides a source of vision
     * @defaultValue `false`
     */
    vision: fields.BooleanField<{ label: "LIGHT.Vision"; hint: "LIGHT.VisionHint" }>;

    /**
     * Light configuration data
     * @defaultValue see {@link LightData}
     */
    config: fields.EmbeddedDataField<typeof LightData>;

    /**
     * Is the light source currently hidden?
     * @defaultValue `false`
     */
    hidden: fields.BooleanField<{ label: "Hidden" }>;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.ObjectField.FlagsField<"AmbientLight">;
  }
}
