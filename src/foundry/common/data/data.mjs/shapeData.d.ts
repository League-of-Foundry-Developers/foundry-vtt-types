import { AnyDataModel, DataModel } from "../../abstract/module.mjs";
import * as fields from "../fields.mjs";

interface ShapeDataSchema extends DataSchema {
  /**
   * The type of shape, a value in ShapeData.TYPES.
   * For rectangles, the x/y coordinates are the top-left corner.
   * For circles, the x/y coordinates are the center of the circle.
   * For polygons, the x/y coordinates are the first point of the polygon.
   * @defaultValue `"r"`
   */
  type: fields.StringField<
    { required: true; blank: false; choices: ShapeData.Types[]; initial: "r" },
    ShapeData.Types | null | undefined,
    ShapeData.Types,
    ShapeData.Types
  >;

  /**
   * For rectangles, the pixel width of the shape.
   * @defaultValue `null`
   */
  width: fields.NumberField<{ required: false; integer: true; min: 0 }>;

  /**
   * For rectangles, the pixel width of the shape.
   * @defaultValue `null`
   */
  height: fields.NumberField<{ required: false; integer: true; min: 0 }>;

  /**
   * For circles, the pixel radius of the shape.
   * @defaultValue `null`
   */
  radius: fields.NumberField<{ required: false; integer: true; positive: true }>;

  /**
   * For polygons, the array of polygon coordinates which comprise the shape.
   * @defaultValue `[]`
   */
  points: fields.ArrayField<
    fields.NumberField<
      { nullable: false },
      Exclude<fields.NumberField.DefaultAssignmentType, null | undefined>,
      Exclude<fields.NumberField.DefaultInitializedType, null>,
      Exclude<fields.NumberField.DefaultPersistedType, null>
    >
  >;
}

/**
 * A data model intended to be used as an inner EmbeddedDataField which defines a geometric shape.
 */
export class ShapeData extends DataModel<
  fields.SchemaField<ShapeDataSchema>,
  fields.SchemaField.PersistedType<ShapeDataSchema>,
  fields.SchemaField.AssignmentType<ShapeDataSchema>,
  AnyDataModel
> {
  static override defineSchema(): ShapeDataSchema;

  /**
   * The primitive shape types which are supported
   */
  static TYPES: {
    RECTANGLE: "r";
    CIRCLE: "c";
    ELLIPSE: "e";
    POLYGON: "p";
  };
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ShapeData extends fields.SchemaField.InitializedType<ShapeDataSchema> {}

declare namespace ShapeData {
  type Types = ValueOf<typeof ShapeData.TYPES>;
}
