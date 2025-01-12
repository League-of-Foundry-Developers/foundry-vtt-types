import type { InexactPartial } from "../../../utils/index.d.mts";
import type Document from "../abstract/document.mts";
import type * as fields from "../data/fields.d.mts";
import type * as documents from "./_module.mts";

type DataSchema = foundry.data.fields.DataSchema;

/**
 * The Document definition for a MeasuredTemplate.
 * Defines the DataSchema and common behaviors for a MeasuredTemplate which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseMeasuredTemplate extends Document<"MeasuredTemplate", BaseMeasuredTemplate.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the MeasuredTemplate
   * @param context - Construction context options
   */
  // TODO(LukeAbby): This constructor is a symptom of a circular error.
  // constructor(
  //   data?: BaseMeasuredTemplate.ConstructorData,
  //   context?: Document.ConstructionContext<BaseMeasuredTemplate.Parent>,
  // );

  override parent: BaseMeasuredTemplate.Parent;

  static override metadata: BaseMeasuredTemplate.Metadata;

  static override defineSchema(): BaseMeasuredTemplate.Schema;

  /**
   * Is a user able to create a new MeasuredTemplate?
   * @param user - The user attempting the creation operation.
   * @param doc  - The MeasuredTemplate being created.
   * @internal
   */
  static #canCreate(user: User.ConfiguredInstance, doc: BaseMeasuredTemplate): boolean;

  /**
   * Is a user able to modify an existing MeasuredTemplate?
   * @param user - The user attempting the modification.
   * @param doc  - The MeasuredTemplate being modified.
   * @param data - Data being changed.
   * @internal
   */
  static #canModify(
    user: User.ConfiguredInstance,
    doc: BaseMeasuredTemplate,
    data?: BaseMeasuredTemplate.UpdateData,
  ): boolean;

  override testUserPermission(
    user: User.ConfiguredInstance,
    permission: keyof typeof CONST.DOCUMENT_OWNERSHIP_LEVELS | foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS,
    options?: InexactPartial<{
      /**
       * Require the exact permission level requested?
       * @defaultValue `false`
       */
      exact: boolean;
    }>,
  ): boolean;
}

export default BaseMeasuredTemplate;

declare namespace BaseMeasuredTemplate {
  type Parent = Scene.ConfiguredInstance | null;

  type Metadata = Document.MetadataFor<BaseMeasuredTemplate>;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = fields.SchemaField.CreateData<Schema>;
  type UpdateData = fields.SchemaField.AssignmentData<Schema>;
  type Properties = fields.SchemaField.InitializedData<Schema>;
  type Source = fields.SchemaField.PersistedData<Schema>;

  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this BaseMeasuredTemplate embedded document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The _id of the user who created this measured template
     * @defaultValue `game?.user?.id`
     */
    user: fields.ForeignDocumentField<typeof documents.BaseUser, { initial: () => string }>;

    /**
     * The value in CONST.MEASURED_TEMPLATE_TYPES which defines the geometry type of this template
     * @defaultValue `CONST.MEASURED_TEMPLATE_TYPES.CIRCLE`
     */
    t: fields.StringField<{
      required: true;
      choices: foundry.CONST.MEASURED_TEMPLATE_TYPES[];
      label: "Type";
      initial: typeof CONST.MEASURED_TEMPLATE_TYPES.CIRCLE;
      validationError: "must be a value in CONST.MEASURED_TEMPLATE_TYPES";
    }>;

    /**
     * The x-coordinate position of the origin of the template effect
     * @defaultValue `0`
     */
    x: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0; label: "XCoord" }>;

    /**
     * The y-coordinate position of the origin of the template effect
     * @defaultValue `0`
     */
    y: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0; label: "YCoord" }>;

    /**
     * The distance of the template effect
     * @defaultValue `1`
     */
    distance: fields.NumberField<{ required: true; positive: true; initial: 1; label: "Distance" }>;

    /**
     * The angle of rotation for the measured template
     * @defaultValue `0`
     */
    direction: fields.AngleField<{ label: "Direction" }>;

    /**
     * The angle of effect of the measured template, applies to cone types
     * @defaultValue `0`
     */
    angle: fields.AngleField<{ label: "Angle" }>;

    /**
     * The width of the measured template, applies to ray types
     * @defaultValue `null`
     */
    width: fields.NumberField<{ integer: true; positive: true; label: "Width" }>;

    /**
     * A color string used to tint the border of the template shape
     * @defaultValue `#000000`
     */
    borderColor: fields.ColorField<{ initial: "#000000" }>;

    /**
     * A color string used to tint the fill of the template shape
     * @defaultValue `#FF0000`
     */
    fillColor: fields.ColorField<{ initial: "#FF0000" }>;

    /**
     * A repeatable tiling texture used to add a texture fill to the template shape
     * @defaultValue `null`
     */
    texture: fields.FilePathField<{ categories: ["IMAGE", "VIDEO"] }>;

    /**
     * Is the template currently hidden?
     * @defaultValue `false`
     */
    hidden: fields.BooleanField<{ label: "Hidden" }>;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.ObjectField.FlagsField<"MeasuredTemplate">;
  }
}
