import type { AnyObject, InexactPartial, Merge } from "../../../types/utils.mts";
import type Document from "../abstract/document.mts";
import type { DocumentMetadata } from "../abstract/document.mts";
import type * as CONST from "../constants.mts";
import type * as fields from "../data/fields.d.mts";
import type { ShapeData } from "../data/module.mts";
import type * as documents from "./_module.mts";

declare global {
  type DrawingData = BaseDrawing.Properties;
}

/**
 * The Document definition for a Drawing.
 * Defines the DataSchema and common behaviors for a Drawing which are shared between both client and server.
 */
declare class BaseDrawing extends Document<BaseDrawing.Schema, BaseDrawing.Metadata, Scene.ConfiguredInstance | null> {
  /**
   * @param data    - Initial data from which to construct the Drawing
   * @param context - Construction context options
   */
  constructor(data?: BaseDrawing.ConstructorData, context?: DocumentConstructionContext);

  static override metadata: Readonly<BaseDrawing.Metadata>;

  static override defineSchema(): BaseDrawing.Schema;

  /**
   * Validate whether the drawing has some visible content (as required by validation).
   */
  static #validateVisibleContent(data: BaseDrawing.UpdateData): boolean;

  static override validateJoint(data: fields.SchemaField.InnerAssignmentType<documents.BaseDrawing.Schema>): void;

  /**
   * Is a user able to update or delete an existing Drawing document??
   * @internal
   */
  static #canModify(user: documents.BaseUser, doc: BaseDrawing, data: BaseDrawing.UpdateData): boolean;

  override testUserPermission(
    user: documents.BaseUser,
    permission: keyof typeof CONST.DOCUMENT_OWNERSHIP_LEVELS | CONST.DOCUMENT_OWNERSHIP_LEVELS,
    options?: InexactPartial<{
      /**
       * Require the exact permission level requested?
       * @defaultValue `false`
       */
      exact: boolean;
    }>,
  ): boolean;

  static override cleanData(source?: AnyObject, options?: fields.DataField.CleanOptions): AnyObject;

  static override migrateData(source: AnyObject): AnyObject;

  static override shimData(
    data: AnyObject,
    options?: {
      /**
       * Apply shims to embedded models?
       * @defaultValue `true`
       */
      embedded?: boolean;
    },
  ): AnyObject;
}
export default BaseDrawing;

declare namespace BaseDrawing {
  type Metadata = Merge<
    DocumentMetadata,
    {
      name: "Drawing";
      collection: "drawings";
      label: "DOCUMENT.Drawing";
      labelPlural: "DOCUMENT.Drawings";
      isEmbedded: true;
      permissions: {
        create: "DRAWING_CREATE";
        update: (user: documents.BaseUser, doc: Document.Any, data: UpdateData) => boolean;
        delete: (user: documents.BaseUser, doc: Document.Any, data: UpdateData) => boolean;
      };
      schemaVersion: "12.324";
    }
  >;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = fields.SchemaField.InnerConstructorType<Schema>;
  type UpdateData = fields.SchemaField.InnerAssignmentType<Schema>;
  type Properties = fields.SchemaField.InnerInitializedType<Schema>;
  type Source = fields.SchemaField.InnerPersistedType<Schema>;

  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this BaseDrawing embedded document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The _id of the user who created the drawing
     * @defaultValue `game.user?.id`
     */
    author: fields.ForeignDocumentField<documents.BaseUser, { nullable: false; initial: () => string }>;

    /**
     * The geometric shape of the drawing
     * @defaultValue see {@link ShapeData.Schema}
     */
    shape: fields.EmbeddedDataField<ShapeData>;

    /**
     * The x-coordinate position of the top-left corner of the drawn shape
     * @defaultValue `0`
     */
    x: fields.NumberField<{ required: true; nullable: false; initial: 0; label: "XCoord" }>;

    /**
     * The y-coordinate position of the top-left corner of the drawn shape
     * @defaultValue `0`
     */
    y: fields.NumberField<{ required: true; nullable: false; initial: 0; label: "YCoord" }>;

    /**
     * The z-index of this drawing relative to other siblings
     * @defaultValue `0`
     */
    z: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0; label: "DRAWING.ZIndex" }>;

    /**
     * The angle of rotation for the drawing figure
     * @defaultValue `0`
     */
    rotation: fields.AngleField<{ label: "DRAWING.Rotation" }>;

    /**
     * An amount of bezier smoothing applied, between 0 and 1
     * @defaultValue `0`
     */
    bezierFactor: fields.AlphaField<{
      initial: 0;
      label: "DRAWING.SmoothingFactor";
      max: 0.5;
      hint: "DRAWING.SmoothingFactorHint";
    }>;

    /**
     * The fill type of the drawing shape, a value from CONST.DRAWING_FILL_TYPES
     * @defaultValue `CONST.DRAWING_FILL_TYPES.NONE`
     */
    fillType: fields.NumberField<{
      required: true;
      initial: typeof CONST.DRAWING_FILL_TYPES.NONE;
      choices: CONST.DRAWING_FILL_TYPES[];
      label: "DRAWING.FillTypes";
      validationError: "must be a value in CONST.DRAWING_FILL_TYPES";
    }>;

    /**
     * An optional color string with which to fill the drawing geometry
     * @defaultValue `game.user?.color`
     */
    fillColor: fields.ColorField<{ initial: () => string; label: "DRAWING.FillColor" }>;

    /**
     * The opacity of the fill applied to the drawing geometry
     * @defaultValue `0.5`
     */
    fillAlpha: fields.AlphaField<{ initial: 0.5; label: "DRAWING.FillOpacity" }>;

    /**
     * The width in pixels of the boundary lines of the drawing geometry
     * @defaultValue `8`
     */
    strokeWidth: fields.NumberField<{ integer: true; initial: 8; min: 0; label: "DRAWING.LineWidth" }>;

    /**
     * The color of the boundary lines of the drawing geometry
     * @defaultValue `game.user?.color`
     */
    strokeColor: fields.ColorField<{ initial: () => string; label: "DRAWING.StrokeColor" }>;

    /**
     * The opacity of the boundary lines of the drawing geometry
     * @defaultValue `1`
     */
    strokeAlpha: fields.AlphaField<{ initial: 1; label: "DRAWING.LineOpacity" }>;

    /**
     * The path to a tiling image texture used to fill the drawing geometry
     * @defaultValue `null`
     */
    texture: fields.FilePathField<{ categories: ["IMAGE"]; label: "DRAWING.FillTexture" }>;

    /**
     * Optional text which is displayed overtop of the drawing
     * @defaultValue `""`
     */
    text: fields.StringField<{ label: "DRAWING.TextLabel" }>;

    /**
     * The font family used to display text within this drawing, defaults to CONFIG.defaultFontFamily
     * @defaultValue `globalThis.CONFIG?.defaultFontFamily || "Signika"`
     */
    fontFamily: fields.StringField<{ blank: false; label: "DRAWING.FontFamily"; initial: () => string }>;

    /**
     * The font size used to display text within this drawing
     * @defaultValue `48`
     */
    fontSize: fields.NumberField<{
      integer: true;
      min: 8;
      max: 256;
      initial: 48;
      label: "DRAWING.FontSize";
      validationError: "must be an integer between 8 and 256";
    }>;

    /**
     * The color of text displayed within this drawing
     * @defaultValue `#FFFFFF`
     */
    textColor: fields.ColorField<{ initial: "#FFFFFF"; label: "DRAWING.TextColor" }>;

    /**
     * The opacity of text displayed within this drawing
     * @defaultValue `1`
     */
    textAlpha: fields.AlphaField<{ label: "DRAWING.TextOpacity" }>;

    /**
     * Is the drawing currently hidden?
     * @defaultValue `false`
     */
    hidden: fields.BooleanField;

    /**
     * Is the drawing currently locked?
     * @defaultValue `false`
     */
    locked: fields.BooleanField;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.ObjectField.FlagsField<"Drawing">;
  }
}
