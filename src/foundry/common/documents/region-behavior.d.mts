import type Document from "../abstract/document.mts";
import type { fields } from "../data/module.d.mts";
import type * as documents from "./_module.d.mts";

type DataSchema = foundry.data.fields.DataSchema;

/**
 * The RegionBehavior Document.
 * Defines the DataSchema and common behaviors for a RegionBehavior which are shared between both client and server.
 */
declare class BaseRegionBehavior extends Document<"RegionBehavior", BaseRegionBehavior.Schema, any> {
  #baseRegionBehavior: true;

  /**
   * @privateRemarks Manual override of the return due to TS limitations with static `this`
   */
  static get TYPES(): BaseRegionBehavior.TypeNames[];

  /**
   * Construct a Region document using provided data and context.
   * @param data        - Initial data from which to construct the Region
   * @param context     - Construction context options
   */
  // TODO(LukeAbby): This constructor is causing a circular error.
  // constructor(data: Partial<BaseRegionBehavior.ConstructorData>, context?: Document.ConstructionContext<BaseRegionBehavior.Parent>);

  static override metadata: BaseRegionBehavior.Metadata;

  static override defineSchema(): BaseRegionBehavior.Schema;

  static override canUserCreate(user: foundry.documents.BaseUser): boolean;
}

export default BaseRegionBehavior;

declare namespace BaseRegionBehavior {
  type Parent = RegionDocument.ConfiguredInstance | null;

  type TypeNames = Game.Model.TypeNames<"RegionBehavior">;

  type Metadata = Document.MetadataFor<BaseRegionBehavior>;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = fields.SchemaField.InnerConstructorType<Schema>;
  type UpdateData = fields.SchemaField.InnerAssignmentType<Schema>;
  type Properties = fields.SchemaField.InnerInitializedType<Schema>;
  type Source = fields.SchemaField.InnerPersistedType<Schema>;

  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this RegionBehavior document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The name used to describe the RegionBehavior
     * @defaultValue `""`
     */
    name: fields.StringField<{ required: true; blank: true; label: string; textSearch: true }>;

    /**
     * An RegionBehavior subtype which configures the system data model applied
     */
    type: fields.DocumentTypeField<typeof BaseRegionBehavior>;

    /**
     * The system data object which is defined by the system template.json model
     */
    system: fields.TypeDataField<typeof BaseRegionBehavior>;

    /**
     * Is the RegionBehavior currently disabled?
     * @defaultValue `false`
     */
    disabled: fields.BooleanField<{ label: string; hint: string }>;

    /**
     * An object of optional key/value flags
     */
    flags: fields.ObjectField.FlagsField<"RegionBehavior">;

    /**
     * An object of creation and access information
     * @defaultValue see {@link fields.DocumentStatsField}
     */
    _stats: fields.DocumentStatsField;
  }
}
