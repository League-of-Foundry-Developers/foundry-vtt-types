import type { ValueOf } from "fvtt-types/utils";
import type Document from "../abstract/document.mts";
import type { BaseShapeData, fields } from "../data/module.d.mts";
import type * as documents from "./_module.d.mts";

type DataSchema = foundry.data.fields.DataSchema;

/**
 * The Region Document.
 * Defines the DataSchema and common behaviors for a Region which are shared between both client and server.
 */
declare class BaseRegion extends Document<"Region", BaseRegion.Schema, any> {
  /**
   * Construct a Region document using provided data and context.
   * @param data        - Initial data from which to construct the Region
   * @param context     - Construction context options
   */
  // TODO(LukeAbby): This constructor is causing a circular error.
  // constructor(data: Partial<BaseRegion.ConstructorData>, context?: Document.ConstructionContext<BaseRegion.Parent>);

  static override metadata: BaseRegion.Metadata;

  static override defineSchema(): BaseRegion.Schema;
}

export default BaseRegion;

declare namespace BaseRegion {
  type Parent = Scene.ConfiguredInstance | null;

  type Metadata = Document.MetadataFor<BaseRegion>;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = fields.SchemaField.InnerConstructorType<Schema>;
  type UpdateData = fields.SchemaField.InnerAssignmentType<Schema>;
  type Properties = fields.SchemaField.InnerInitializedType<Schema>;
  type Source = fields.SchemaField.InnerPersistedType<Schema>;

  interface Schema extends DataSchema {
    /**
     * The Region _id which uniquely identifies it within its parent Scene
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    // TODO(Eon): Should label here be string or "Name"?
    /**
     * The name used to describe the Region
     */
    name: fields.StringField<{ required: true; blank: false; label: string; textSearch: true }>;

    /**
     * The color used to highlight the Region
     */
    color: fields.ColorField<{ required: true; nullable: false; initial: () => string; label: string; hint: string }>;

    /**
     * The shapes that make up the Region
     */
    shapes: fields.ArrayField<fields.TypedSchemaField<BaseShapeData.Types>>;

    /**
     * A RegionElevation object which defines the elevation levels where the Region takes effect
     * @defaultValue see properties
     */
    elevation: fields.SchemaField<
      {
        /**
         * The bottom elevation level where the Region begins to take effect
         * @remarks if bottom is `null`, it is treated as `-Infinity`
         * @defaultValue `null`
         */
        bottom: fields.NumberField<{ required: true; label: string; hint: string }>;
        /**
         * The top elevation level where the Region's effect ends
         * @remarks if top is `null`, it is treated as `Infinity`
         * @defaultValue `null`
         */
        top: fields.NumberField<{ required: true; label: string; hint: string }>;
      },
      { label: string; hint: string; validate: (d: any) => boolean; validationError: string }
    >;

    /**
     * A collection of embedded RegionBehavior objects
     */
    behaviors: fields.EmbeddedCollectionField<
      typeof documents.BaseRegionBehavior,
      RegionDocument.ConfiguredInstance,
      { label: string; hint: string }
    >;

    visibility: fields.NumberField<{
      required: true;
      initial: typeof CONST.REGION_VISIBILITY.LAYER;
      choices: ValueOf<typeof CONST.REGION_VISIBILITY>[];
      label: string;
      hint: string;
    }>;

    locked: fields.BooleanField;

    /**
     * An object of optional key/value flags
     */
    flags: fields.ObjectField.FlagsField<"Region">;
  }
}
