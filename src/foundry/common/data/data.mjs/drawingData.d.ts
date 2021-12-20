import DocumentData from '../../abstract/data.mjs';
import { BaseUser } from '../../documents.mjs';
import { ForeignDocumentField } from '../fields.mjs';
import * as fields from '../fields.mjs';
import * as documents from '../../documents.mjs';
import {
  ConfiguredDocumentClass,
  ConfiguredFlags,
  FieldReturnType,
  PropertiesToSource
} from '../../../../types/helperTypes';

interface DrawingDataSchema extends DocumentSchema {
  _id: typeof fields.DOCUMENT_ID;
  author: ForeignDocumentField<{ type: typeof documents.BaseUser; required: true }>;
  type: DocumentField<foundry.CONST.MACRO_TYPES> & {
    type: typeof String;
    required: true;
    default: typeof CONST.DRAWING_TYPES.POLYGON;
    validate: (t: unknown) => t is foundry.CONST.MACRO_TYPES;
    validationError: 'Invalid {name} {field} which must be a value in CONST.DRAWING_TYPES';
  };
  x: typeof fields.REQUIRED_NUMBER;
  y: typeof fields.REQUIRED_NUMBER;
  width: typeof fields.REQUIRED_NUMBER;
  height: typeof fields.REQUIRED_NUMBER;
  rotation: FieldReturnType<typeof fields.ANGLE_FIELD, { default: 0 }>;
  z: typeof fields.REQUIRED_NUMBER;
  points: DocumentField<Array<[x: number, y: number]>> & {
    type: [typeof Array];
    required: true;
    default: [];
    validate: typeof _validateDrawingPoints;
    validationError: 'Invalid {name} {field} which must be an array of points [x,y]';
  };
  bezierFactor: FieldReturnType<typeof fields.ALPHA_FIELD, { default: 0 }>;
  fillType: FieldReturnType<
    typeof fields.REQUIRED_NUMBER,
    {
      default: typeof CONST.DRAWING_FILL_TYPES.NONE;
      validate: (v: unknown) => v is foundry.CONST.DRAWING_FILL_TYPES;
      validationError: 'Invalid {name} {field} which must be a value in CONST.DRAWING_FILL_TYPES';
    }
  >;
  fillColor: typeof fields.COLOR_FIELD;
  fillAlpha: FieldReturnType<typeof fields.ALPHA_FIELD, { default: 0.5 }>;
  strokeWidth: FieldReturnType<typeof fields.NONNEGATIVE_INTEGER_FIELD, { default: 8 }>;
  strokeColor: typeof fields.COLOR_FIELD;
  strokeAlpha: typeof fields.ALPHA_FIELD;
  texture: typeof fields.IMAGE_FIELD;
  text: typeof fields.STRING_FIELD;
  fontFamily: FieldReturnType<typeof fields.REQUIRED_STRING, { default: 'Signika' }>;
  fontSize: FieldReturnType<
    typeof fields.POSITIVE_INTEGER_FIELD,
    {
      default: 48;
      validate: (n: unknown) => boolean;
      validationError: 'Invalid {name} {field} which must be an integer between 8 and 256';
    }
  >;
  textColor: FieldReturnType<typeof fields.COLOR_FIELD, { default: '#FFFFFF' }>;
  textAlpha: typeof fields.ALPHA_FIELD;
  hidden: typeof fields.BOOLEAN_FIELD;
  locked: typeof fields.BOOLEAN_FIELD;
  flags: typeof fields.OBJECT_FIELD;
}

interface DrawingDataProperties {
  /**
   * The _id which uniquely identifies this BaseDrawing embedded document
   * @defaultValue `null`
   */
  _id: string | null;

  /**
   * The _id of the user who created the drawing
   * @defaultValue `null`
   */
  author: string | null;

  /**
   * The value in CONST.DRAWING_TYPES which defines the geometry type of this drawing
   * @defaultValue `CONST.DRAWING_TYPES.POLYGON`
   */
  type: foundry.CONST.MACRO_TYPES;

  /**
   * The x-coordinate position of the top-left corner of the drawn shape
   * @defaultValue `0`
   */
  x: number;

  /**
   * The y-coordinate position of the top-left corner of the drawn shape
   * @defaultValue `0`
   */
  y: number;

  /**
   * The pixel width of the drawing figure
   * @defaultValue `0`
   */
  width: number;

  /**
   * The pixel height of the drawing figure
   * @defaultValue `0`
   */
  height: number;

  /**
   * The angle of rotation for the drawing figure
   * @defaultValue `0`
   */
  rotation: number;

  /**
   * The z-index of this drawing relative to other siblings
   * @defaultValue `0`
   */
  z: number;

  /**
   * An array of points [x,y] which define polygon vertices
   * @defaultValue `[]`
   */
  points: Array<[x: number, y: number]>;

  /**
   * An amount of bezier smoothing applied, between 0 and 1
   * @defaultValue `0`
   */
  bezierFactor: number;

  /**
   * The fill type of the drawing shape, a value from CONST.DRAWING_FILL_TYPES
   * @defaultValue `CONST.DRAWING_FILL_TYPES.NONE`
   */
  fillType: foundry.CONST.DRAWING_FILL_TYPES;

  /**
   * An optional color string with which to fill the drawing geometry
   */
  fillColor: string | null | undefined;

  /**
   * The opacity of the fill applied to the drawing geometry
   * @defaultValue `0.5`
   */
  fillAlpha: number;

  /**
   * The width in pixels of the boundary lines of the drawing geometry
   * @defaultValue `8`
   */
  strokeWidth: number;

  /**
   * The color of the boundary lines of the drawing geometry
   */
  strokeColor: string | null | undefined;

  /**
   * The opacity of the boundary lines of the drawing geometry
   * @defaultValue `1`
   */
  strokeAlpha: number;

  /**
   * The path to a tiling image texture used to fill the drawing geometry
   */
  texture: string | null | undefined;

  /**
   * Optional text which is displayed overtop of the drawing
   */
  text: string | undefined;

  /**
   * The font family used to display text within this drawing
   * @defaultValue `'Signika'`
   */
  fontFamily: string;

  /**
   * The font size used to display text within this drawing
   * @defaultValue `48`
   */
  fontSize: number;

  /**
   * The color of text displayed within this drawing
   * @defaultValue `'#FFFFFF'`
   */
  textColor: string | null;

  /**
   * The opacity of text displayed within this drawing
   * @defaultValue `1`
   */
  textAlpha: number;

  /**
   * Is the drawing currently hidden?
   * @defaultValue `false`
   */
  hidden: boolean;

  /**
   * Is the drawing currently locked?
   * @defaultValue `false`
   */
  locked: boolean;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: ConfiguredFlags<'Drawing'>;
}

interface DrawingDataConstructorData {
  /**
   * The _id which uniquely identifies this BaseDrawing embedded document
   * @defaultValue `null`
   */
  _id?: string | null | undefined;

  /**
   * The _id of the user who created the drawing
   * @defaultValue `null`
   */
  author?: InstanceType<ConfiguredDocumentClass<typeof BaseUser>> | string | null | undefined;

  /**
   * The value in CONST.DRAWING_TYPES which defines the geometry type of this drawing
   * @defaultValue `CONST.DRAWING_TYPES.POLYGON`
   */
  type?: foundry.CONST.DRAWING_TYPES | null | undefined;

  /**
   * The x-coordinate position of the top-left corner of the drawn shape
   * @defaultValue `0`
   */
  x?: number | null | undefined;

  /**
   * The y-coordinate position of the top-left corner of the drawn shape
   * @defaultValue `0`
   */
  y?: number | null | undefined;

  /**
   * The pixel width of the drawing figure
   * @defaultValue `0`
   */
  width?: number | null | undefined;

  /**
   * The pixel height of the drawing figure
   * @defaultValue `0`
   */
  height?: number | null | undefined;

  /**
   * The angle of rotation for the drawing figure
   * @defaultValue `0`
   */
  rotation?: number | null | undefined;

  /**
   * The z-index of this drawing relative to other siblings
   * @defaultValue `0`
   */
  z?: number | null | undefined;

  /**
   * An array of points [x,y] which define polygon vertices
   * @defaultValue `[]`
   */
  points?: Array<[x: number, y: number]> | null | undefined;

  /**
   * An amount of bezier smoothing applied, between 0 and 1
   * @defaultValue `0`
   */
  bezierFactor?: number | null | undefined;

  /**
   * The fill type of the drawing shape, a value from CONST.DRAWING_FILL_TYPES
   * @defaultValue `CONST.DRAWING_FILL_TYPES.NONE`
   */
  fillType?: foundry.CONST.DRAWING_FILL_TYPES | null | undefined;

  /**
   * An optional color string with which to fill the drawing geometry
   */
  fillColor?: string | null | undefined;

  /**
   * The opacity of the fill applied to the drawing geometry
   * @defaultValue `0.5`
   */
  fillAlpha?: number | null | undefined;

  /**
   * The width in pixels of the boundary lines of the drawing geometry
   * @defaultValue `8`
   */
  strokeWidth?: number | null | undefined;

  /**
   * The color of the boundary lines of the drawing geometry
   */
  strokeColor?: string | null | undefined;

  /**
   * The opacity of the boundary lines of the drawing geometry
   * @defaultValue `1`
   */
  strokeAlpha?: number | null | undefined;

  /**
   * The path to a tiling image texture used to fill the drawing geometry
   */
  texture?: string | null | undefined;

  /**
   * Optional text which is displayed overtop of the drawing
   */
  text?: string | null | undefined;

  /**
   * The font family used to display text within this drawing
   * @defaultValue `'Signika'`
   */
  fontFamily?: string | null | undefined;

  /**
   * The font size used to display text within this drawing
   * @defaultValue `48`
   */
  fontSize?: number | null | undefined;

  /**
   * The color of text displayed within this drawing
   * @defaultValue `'#FFFFFF'`
   */
  textColor?: string | null | undefined;

  /**
   * The opacity of text displayed within this drawing
   * @defaultValue `1`
   */
  textAlpha?: number | null | undefined;

  /**
   * Is the drawing currently hidden?
   * @defaultValue `false`
   */
  hidden?: boolean | null | undefined;

  /**
   * Is the drawing currently locked?
   * @defaultValue `false`
   */
  locked?: boolean | null | undefined;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags?: ConfiguredFlags<'Drawing'> | null | undefined;
}

/**
 * The data schema for a Drawing embedded document.
 * @see BaseDrawing
 *
 * @param data     - Initial data used to construct the data object
 * @param document - The embedded document to which this data object belongs
 */
export declare class DrawingData extends DocumentData<
  DrawingDataSchema,
  DrawingDataProperties,
  PropertiesToSource<DrawingDataProperties>,
  DrawingDataConstructorData,
  documents.BaseFolder
> {
  static defineSchema(): DrawingDataSchema;

  /** @override */
  protected _initialize(): void;

  /** @override */
  protected _validateDocument(): void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface DrawingData extends DrawingDataProperties {}

/**
 * Validate the array of points which comprises a polygon drawing
 * @param points - The candidate points
 * @returns Is the array valid?
 */
declare function _validateDrawingPoints(points: number[][]): boolean;
