import Document, { DocumentMetadata } from '../abstract/document.mjs';
import * as fields from '../data/fields.mjs';
import * as documents from './module.mjs';
import * as CONST from '../constants.mjs';
import { ShapeData } from '../data/data.mjs';
import { ConfiguredDocumentClass, JSOr } from '../../../types/helperTypes.js';
import { DataModel, DataSchema } from '../abstract/data.mjs';
import type { FlagsField } from '../data/flagsField.js';

interface BaseDrawingSchema extends DataSchema {
  /**
   * The _id which uniquely identifies this BaseDrawing embedded document
   */
  _id: fields.DocumentIdField<{}>;

  // TODO, causes circular reference on DrawingDocument
  /**
   * The _id of the user who created the drawing
   */
  //   author: fields.ForeignDocumentField<
  //     typeof documents.BaseUser,
  //     { nullable: false; initial: () => OptionalChaining<OptionalChaining<typeof game, 'user'>, 'id'> }
  //   >;

  /**
   * The geometric shape of the drawing
   */
  shape: fields.EmbeddedDataField<typeof ShapeData, {}>;

  /**
   * The x-coordinate position of the top-left corner of the drawn shape
   */
  x: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0; label: 'DRAWING.PosX' }>;

  /**
   * The y-coordinate position of the top-left corner of the drawn shape
   */
  y: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0; label: 'DRAWING.PosY' }>;

  /**
   * The z-index of this drawing relative to other siblings
   * (default: `0`)
   */
  z: fields.NumberField<{
    required: true;
    integer: true;
    nullable: false;
    initial: 0;
    label: 'DRAWING.ZIndex';
  }>;

  /**
   * The angle of rotation for the drawing figure
   * (default: `0`)
   */
  rotation: fields.AngleField<{ label: 'DRAWING.Rotation' }>;

  /**
   * An amount of bezier smoothing applied, between 0 and 1
   * (default: `0`)
   */
  bezierFactor: fields.AlphaField<{
    initial: 0;
    label: 'DRAWING.SmoothingFactor';
    hint: 'DRAWING.SmoothingFactorHint';
  }>;

  /**
   * The fill type of the drawing shape, a value from CONST.DRAWING_FILL_TYPES
   * (default: `0`)
   */
  fillType: fields.NumberField<{
    required: true;
    initial: typeof CONST.DRAWING_FILL_TYPES.NONE;
    choices: Array<ValueOf<typeof CONST.DRAWING_FILL_TYPES>>;
    label: 'DRAWING.FillTypes';
    validationError: 'must be a value in CONST.DRAWING_FILL_TYPES';
  }>;

  /**
   * An optional color string with which to fill the drawing geometry
   */
  fillColor: fields.ColorField<{
    initial: () => OptionalChaining<OptionalChaining<typeof game, 'user'>, 'color'>;
    label: 'DRAWING.FillColor';
  }>;

  /**
   * The opacity of the fill applied to the drawing geometry
   * (default: `0.5`)
   */
  fillAlpha: fields.AlphaField<{ initial: 0.5; label: 'DRAWING.FillOpacity' }>;

  /**
   * The width in pixels of the boundary lines of the drawing geometry
   * (default: `8`)
   */
  strokeWidth: fields.NumberField<{ integer: true; initial: 8; min: 0; label: 'DRAWING.Lidth' }>;

  /**
   * The color of the boundary lines of the drawing geometry
   */
  strokeColor: fields.ColorField<{
    initial: () => OptionalChaining<OptionalChaining<typeof game, 'user'>, 'color'>;
    label: 'DRAWING.StrokeColor';
  }>;

  /**
   * The opacity of the boundary lines of the drawing geometry
   * (default: `1`)
   */
  strokeAlpha: fields.AlphaField<{ initial: 1; label: 'DRAWING.LineOpacity' }>;

  /**
   * The path to a tiling image texture used to fill the drawing geometry
   */
  texture: fields.FilePathField<{ categories: ['IMAGE']; label: 'DRAWING.FillTexture' }>;

  /**
   * Optional text which is displayed overtop of the drawing
   */
  text: fields.StringField<{ label: 'DRAWING.TextLabel' }>;

  /**
   * The font family used to display text within this drawing, defaults to CONFIG.defaultFontFamily
   */
  fontFamily: fields.StringField<{
    blank: false;
    label: 'DRAWING.FontFamily';
    initial: () => JSOr<typeof CONFIG['defaultFontFamily'], 'Signika'>;
  }>;

  /**
   * The font size used to display text within this drawing
   * (default: `48`)
   */
  fontSize: fields.NumberField<{
    integer: true;
    min: 8;
    max: 256;
    initial: 48;
    label: 'DRAWING.FontSize';
    validationError: 'must be an integer between 8 and 256';
  }>;

  /**
   * The color of text displayed within this drawing
   * (default: `'#FFFFFF'`)
   */
  textColor: fields.ColorField<{ initial: '#FFFFFF'; label: 'DRAWING.TextColor' }>;

  /**
   * The opacity of text displayed within this drawing
   * (default: `1`)
   */
  textAlpha: fields.AlphaField<{ label: 'DRAWING.TextOpacity' }>;

  /**
   * Is the drawing currently hidden?
   * (default: `false`)
   */
  hidden: fields.BooleanField<{}>;

  /**
   * Is the drawing currently locked?
   * (default: `false`)
   */
  locked: fields.BooleanField<{}>;

  /**
   * An object of optional key/value flags
   */
  flags: FlagsField<'Drawing', {}>;
}

type CanModify = (
  user: documents.BaseUser,
  doc: BaseDrawing,
  data: DeepPartial<DataModel.SchemaToSource<BaseDrawing['schema']>>
) => boolean;

type BaseDrawingMetadata = Merge<
  DocumentMetadata,
  {
    name: 'Drawing';
    collection: 'drawings';
    label: 'DOCUMENT.Drawing';
    labelPlural: 'DOCUMENT.Drawings';
    isEmbedded: true;
    permissions: {
      create: 'DRAWING_CREATE';
      update: CanModify;
      delete: CanModify;
    };
  }
>;

type BaseDrawingShims = {
  /**
   * V10 migration to ShapeData model
   * @deprecated since v10
   */
  type: BaseDrawing['shape']['type'];

  /**
   * V10 migration to ShapeData model
   * @deprecated since v10
   */
  width: BaseDrawing['shape']['width'];

  /**
   * V10 migration to ShapeData model
   * @deprecated since v10
   */
  height: BaseDrawing['shape']['height'];

  /**
   * V10 migration to ShapeData model
   * @deprecated since v10
   */
  points: BaseDrawing['shape']['points'];
};

/**
 * The Document definition for a Drawing.
 * Defines the DataSchema and common behaviors for a Drawing which are shared between both client and server.
 */
declare class BaseDrawing extends Document<
  BaseDrawingSchema,
  InstanceType<ConfiguredDocumentClass<typeof documents.BaseScene>>,
  BaseDrawingMetadata,
  BaseDrawingShims
> {
  /* ---------------------------------------- */
  /*  Model Configuration                     */
  /* ---------------------------------------- */

  /** {@inheritdoc} */
  static override readonly metadata: BaseDrawingMetadata;

  /** {@inheritDoc} */
  static override defineSchema(): BaseDrawingSchema;

  /** {@inheritdoc} */
  protected _validateModel(data: DataModel.SchemaToData<this['schema']>): void;

  /**
   * Is a user able to update or delete an existing Drawing document??
   */
  static #canModify: CanModify;

  /* ---------------------------------------- */
  /*  Model Methods                           */
  /* ---------------------------------------- */

  /** {@inheritdoc} */
  override testUserPermission(
    user: foundry.documents.BaseUser,
    permission: keyof typeof foundry.CONST.DOCUMENT_PERMISSION_LEVELS | foundry.CONST.DOCUMENT_PERMISSION_LEVELS,
    { exact }?: { exact?: boolean }
  ): boolean;

  /* ---------------------------------------- */
  /*  Deprecations and Compatibility          */
  /* ---------------------------------------- */

  /** {@inheritdoc} */
  static override migrateData(data: Record<string, unknown>): Record<string, unknown>;

  /* ---------------------------------------- */

  /** {@inheritdoc} */
  static override shimData(data: Record<string, unknown>, options: DataModel.ShimDataOptions): Record<string, unknown>;
}

export default BaseDrawing;
