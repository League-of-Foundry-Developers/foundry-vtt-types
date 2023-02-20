import type { DataModel } from "../../abstract/module.mjs";
import type * as fields from "../fields.mjs";

/**
 * A data model intended to be used as an inner EmbeddedDataField which defines a geometric shape.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ShapeData extends ShapeData.Properties {}
export class ShapeData extends DataModel<ShapeData.SchemaField, DataModel.Any> {
  static override defineSchema(): ShapeData.Schema;

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

declare namespace ShapeData {
  type TYPES = ValueOf<typeof ShapeData.TYPES>;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = fields.SchemaField.InnerAssignmentType<Schema>;
  type Properties = fields.SchemaField.InnerInitializedType<Schema>;
  type Source = fields.SchemaField.InnerPersistedType<Schema>;

  interface Schema extends DataSchema {
    /**
     * The type of shape, a value in ShapeData.TYPES.
     * For rectangles, the x/y coordinates are the top-left corner.
     * For circles, the x/y coordinates are the center of the circle.
     * For polygons, the x/y coordinates are the first point of the polygon.
     * @defaultValue `"r"`
     */
    type: fields.StringField<
      { required: true; blank: false; choices: TYPES[]; initial: typeof ShapeData.TYPES.RECTANGLE },
      TYPES | null | undefined,
      TYPES,
      TYPES
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
    points: fields.ArrayField<fields.NumberField<{ nullable: false }>>;
  }
}
