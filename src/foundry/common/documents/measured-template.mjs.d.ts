import Document, { DocumentMetadata } from '../abstract/document.mjs';
import * as CONST from '../constants.mjs';
import * as documents from './module.mjs';
import * as fields from '../data/fields.mjs';
import DataModel, { DataSchema } from '../abstract/data.mjs';
import type { FlagsField } from '../data/flagsField.js';

interface BaseMeasuredTemplateSchema extends DataSchema {
  /**
   * The _id which uniquely identifies this BaseMeasuredTemplate embedded document
   */
  _id: fields.DocumentIdField<{}>;

  user: fields.ForeignDocumentField<typeof documents.BaseUser, { initial: () => string | null }>;

  /**
   * The value in CONST.MEASURED_TEMPLATE_TYPES which defines the geometry type of this template
   * (default: `CONST.MEASURED_TEMPLATE_TYPES.CIRCLE`)
   */
  t: fields.StringField<{
    required: true;
    choices: ValueOf<typeof CONST.MEASURED_TEMPLATE_TYPES>[];
    label: 'Type';
    initial: typeof CONST.MEASURED_TEMPLATE_TYPES.CIRCLE;
    validationError: 'must be a value in CONST.MEASURED_TEMPLATE_TYPES';
  }>;

  /**
   * The x-coordinate position of the origin of the template effect
   * (default: `0`)
   */
  x: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0; label: 'XCoord' }>;

  /**
   * The y-coordinate position of the origin of the template effect
   * (default: `0`)
   */
  y: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0; label: 'YCoord' }>;

  /**
   * The distance of the template effect
   */
  distance: fields.NumberField<{ required: true; positive: true; initial: 1; label: 'Distance' }>;

  /**
   * The angle of rotation for the measured template
   * (default: `0`)
   */
  direction: fields.AngleField<{ label: 'Direction' }>;

  /**
   * The angle of effect of the measured template, applies to cone types
   * (default: `360`)
   */
  angle: fields.AngleField<{ label: 'Angle' }>;

  /**
   * The width of the measured template, applies to ray types
   */
  width: fields.NumberField<{ integer: true; positive: true; label: 'Width' }>;

  /**
   * A color string used to tint the border of the template shape
   * (default: `'#000000'`)
   */
  borderColor: fields.ColorField<{ initial: '#000000' }>;

  /**
   * A color string used to tint the fill of the template shape
   * (default: `'#FF0000'`)
   */
  fillColor: fields.ColorField<{ initial: '#FF0000' }>;

  /**
   * A repeatable tiling texture used to add a texture fill to the template shape
   */
  texture: fields.FilePathField<{ categories: ['IMAGE', 'VIDEO'] }>;

  /**
   * An object of optional key/value flags
   */
  flags: FlagsField<'MeasuredTemplate', {}>;
}

type CanCreate = (user: documents.BaseUser, doc: BaseMeasuredTemplate) => boolean;
type CanModify = (
  user: documents.BaseUser,
  doc: BaseMeasuredTemplate,
  data: DeepPartial<DataModel.SchemaToSource<BaseMeasuredTemplate['schema']>>
) => boolean;

type BaseMeasuredTemplateMetadata = Merge<
  DocumentMetadata,
  {
    name: 'MeasuredTemplate';
    collection: 'templates';
    label: 'DOCUMENT.MeasuredTemplate';
    labelPlural: 'DOCUMENT.MeasuredTemplates';
    isEmbedded: true;
    permissions: {
      create: CanCreate;
      update: CanModify;
      delete: CanModify;
    };
  }
>;

/**
 * The Document definition for a MeasuredTemplate.
 * Defines the DataSchema and common behaviors for a MeasuredTemplate which are shared between both client and server.
 */
declare class BaseMeasuredTemplate extends Document<
  BaseMeasuredTemplateSchema,
  InstanceType<ConfiguredScene>,
  BaseMeasuredTemplateMetadata
> {
  /* -------------------------------------------- */
  /*  Model Configuration                         */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  static override readonly metadata: BaseMeasuredTemplateMetadata;

  /** {@inheritdoc} */
  static override defineSchema(): BaseMeasuredTemplateSchema;

  /** {@inheritdoc} */
  protected override _validateModel(data: DataModel.SchemaToData<this['schema']>): void;

  /* ---------------------------------------- */

  /**
   * Is a user able to create a new MeasuredTemplate?
   * @param user - The user attempting the creation operation.
   * @param doc - The MeasuredTemplate being created.
   */
  static override #canCreate: CanCreate;

  /* ---------------------------------------- */

  /**
   * Is a user able to modify an existing MeasuredTemplate?
   * @param user - The user attempting the modification.
   * @param doc - The MeasuredTemplate being modified.
   * @param data - Data being changed.
   */
  static override #canModify: CanModify;

  /* -------------------------------------------- */
  /*  Model Methods                               */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  override testUserPermission(
    user: foundry.documents.BaseUser,
    permission: keyof typeof foundry.CONST.DOCUMENT_PERMISSION_LEVELS | foundry.CONST.DOCUMENT_PERMISSION_LEVELS,
    { exact }?: { exact?: boolean }
  ): boolean;
}

export default BaseMeasuredTemplate;
