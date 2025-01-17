import type { AnyObject } from "../../../utils/index.d.mts";
import type Document from "../abstract/document.mts";
import type * as fields from "../data/fields.d.mts";

type DataSchema = foundry.data.fields.DataSchema;

/**
 * The Document definition for an AmbientSound.
 * Defines the DataSchema and common behaviors for an AmbientSound which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseAmbientSound extends Document<"AmbientSound", BaseAmbientSound.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the AmbientSound
   * @param context - Construction context options
   */
  // TODO(LukeAbby): This constructor is a symptom of a circular error.
  // constructor(data?: BaseAmbientSound.ConstructorData, context?: Document.ConstructionContext<BaseAmbientSound.Parent>);

  override parent: BaseAmbientSound.Parent;

  static override metadata: BaseAmbientSound.Metadata;

  static override defineSchema(): BaseAmbientSound.Schema;

  static override migrateData(source: AnyObject): AnyObject;

  static " __fvtt_types_internal_document_name_static": "AmbientSound";
}

export default BaseAmbientSound;

declare namespace BaseAmbientSound {
  type Parent = Scene.ConfiguredInstance | null;

  type Metadata = Document.MetadataFor<"AmbientSound">;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = fields.SchemaField.CreateData<Schema>;
  type UpdateData = fields.SchemaField.AssignmentData<Schema>;
  type Properties = fields.SchemaField.InitializedData<Schema>;
  type Source = fields.SchemaField.PersistedData<Schema>;

  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this AmbientSound document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The x-coordinate position of the origin of the sound.
     * @defaultValue `0`
     */
    x: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0; label: "XCoord" }>;

    /**
     * The y-coordinate position of the origin of the sound.
     * @defaultValue `0`
     */
    y: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0; label: "YCoord" }>;

    /**
     * The radius of the emitted sound.
     * @defaultValue `0`
     */
    radius: fields.NumberField<{
      required: true;
      nullable: false;
      initial: 0;
      min: 0;
      step: 0.01;
      label: "SOUND.Radius";
    }>;

    /**
     * The audio file path that is played by this sound
     * @defaultValue `null`
     */
    path: fields.FilePathField<{ categories: ["AUDIO"]; label: "SOUND.SourcePath" }>;

    /**
     * Does this sound loop?
     * @defaultValue `false`
     */
    repeat: fields.BooleanField;

    /**
     * The audio volume of the sound, from 0 to 1
     * @defaultValue `0.5`
     */
    volume: fields.AlphaField<{ initial: 0.5; step: 0.01; label: "SOUND.MaxVol"; hint: "SOUND.MaxVolHint" }>;

    /**
     * Whether or not this sound source is constrained by Walls.
     * @defaultValue `true`
     */
    walls: fields.BooleanField<{ initial: true; label: "SOUND.Walls"; hint: "SOUND.WallsHint" }>;

    /**
     * Whether to adjust the volume of the sound heard by the listener based on how
     * close the listener is to the center of the sound source.
     * @defaultValue `true`
     */
    easing: fields.BooleanField<{ initial: true; label: "SOUND.Easing"; hint: "SOUND.EasingHint" }>;

    /**
     * Is the sound source currently hidden?
     * @defaultValue `false`
     */
    hidden: fields.BooleanField<{ label: "Hidden" }>;

    /**
     * A darkness range (min and max) for which the source should be active
     * @defaultValue see properties
     */
    darkness: fields.SchemaField<
      {
        /** @defaultValue `0` */
        min: fields.AlphaField<{ initial: 0 }>;

        /** @defaultValue `1` */
        max: fields.AlphaField<{ initial: 1 }>;
      },
      { label: "SOUND.DarknessRange"; hint: "SOUND.DarknessRangeHint" }
    >;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.ObjectField.FlagsField<"AmbientSound">;
  }
}
