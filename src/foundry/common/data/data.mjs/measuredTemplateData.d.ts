import {
  ConfiguredDocumentClass,
  ConfiguredFlags,
  FieldReturnType,
  PropertiesToSource
} from '../../../../types/helperTypes';
import { DocumentData } from '../../abstract/module.mjs';
import * as fields from '../fields.mjs';
import * as documents from '../../documents.mjs';

interface MeasuredTemplateDataSchema extends DocumentSchema {
  _id: typeof fields.DOCUMENT_ID;
  user: fields.ForeignDocumentField<{ type: typeof documents.BaseUser; required: true }>;
  t: {
    type: typeof String;
    required: true;
    default: typeof CONST.MEASURED_TEMPLATE_TYPES.CIRCLE;
    validate: (t: unknown) => boolean;
    validationError: 'Invalid {name} {field} which must be a value in CONST.MEASURED_TEMPLATE_TYPES';
  };
  x: typeof fields.REQUIRED_NUMBER;
  y: typeof fields.REQUIRED_NUMBER;
  distance: FieldReturnType<typeof fields.REQUIRED_POSITIVE_NUMBER, { default: 1 }>;
  direction: FieldReturnType<typeof fields.ANGLE_FIELD, { default: 0 }>;
  angle: typeof fields.ANGLE_FIELD;
  width: FieldReturnType<typeof fields.REQUIRED_POSITIVE_NUMBER, { default: 1 }>;
  borderColor: FieldReturnType<typeof fields.COLOR_FIELD, { required: true; default: '#000000' }>;
  fillColor: FieldReturnType<typeof fields.COLOR_FIELD, { required: true; default: '#FF0000' }>;
  texture: typeof fields.VIDEO_FIELD;
  flags: typeof fields.OBJECT_FIELD;
}

interface MeasuredTemplateDataProperties {
  /**
   The _id which uniquely identifies this BaseMeasuredTemplate embedded document
   */
  _id: string | null;

  user: string | null;

  /**
   * The value in CONST.MEASURED_TEMPLATE_TYPES which defines the geometry type of this template
   * @defaultValue `'circle'`
   */
  t: foundry.CONST.MEASURED_TEMPLATE_TYPES;

  /**
   * The x-coordinate position of the origin of the template effect
   * @defaultValue `0`
   */
  x: number;

  /**
   * The y-coordinate position of the origin of the template effect
   * @defaultValue `0`
   */
  y: number;

  /**
   * The distance of the template effect
   * @defaultValue `1`
   */
  distance: number;

  /**
   * The angle of rotation for the measured template
   * @defaultValue `0`
   */
  direction: number;

  /**
   * The angle of effect of the measured template, applies to cone types
   * @defaultValue `0`
   */
  angle: number;

  /**
   * The width of the measured template, applies to ray types
   * @defaultValue `1`
   */
  width: number;

  /**
   * A color string used to tint the border of the template shape
   * @defaultValue `'#000000'`
   */
  borderColor: string | null;

  /**
   * A color string used to tint the fill of the template shape
   * @defaultValue `'#FF0000'`
   */
  fillColor: string | null;

  /**
   * A repeatable tiling texture used to add a texture fill to the template shape
   */
  texture: string | undefined | null;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: ConfiguredFlags<'MeasuredTemplate'>;
}

interface MeasuredTemplateDataConstructorData {
  /**
   The _id which uniquely identifies this BaseMeasuredTemplate embedded document
   */
  _id?: string | null | undefined;

  user?: string | null | undefined;

  /**
   * The value in CONST.MEASURED_TEMPLATE_TYPES which defines the geometry type of this template
   * @defaultValue `'circle'`
   */
  t?: ValueOf<foundry.CONST.MEASURED_TEMPLATE_TYPES> | null | undefined;

  /**
   * The x-coordinate position of the origin of the template effect
   * @defaultValue `0`
   */
  x?: number | null | undefined;

  /**
   * The y-coordinate position of the origin of the template effect
   * @defaultValue `0`
   */
  y?: number | null | undefined;

  /**
   * The distance of the template effect
   * @defaultValue `1`
   */
  distance?: number | null | undefined;

  /**
   * The angle of rotation for the measured template
   * @defaultValue `0`
   */
  direction?: number | null | undefined;

  /**
   * The angle of effect of the measured template, applies to cone types
   * @defaultValue `0`
   */
  angle?: number | null | undefined;

  /**
   * The width of the measured template, applies to ray types
   * @defaultValue `1`
   */
  width?: number | null | undefined;

  /**
   * A color string used to tint the border of the template shape
   * @defaultValue `'#000000'`
   */
  borderColor?: string | null | undefined;

  /**
   * A color string used to tint the fill of the template shape
   * @defaultValue `'#FF0000'`
   */
  fillColor?: string | null | undefined;

  /**
   * A repeatable tiling texture used to add a texture fill to the template shape
   */
  texture?: string | null | undefined;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags?: ConfiguredFlags<'MeasuredTemplate'> | null | undefined;
}

/**
 * The data schema for a MeasuredTemplate embedded document.
 * @see BaseMeasuredTemplate
 */
export declare class MeasuredTemplateData extends DocumentData<
  MeasuredTemplateDataSchema,
  MeasuredTemplateDataProperties,
  PropertiesToSource<MeasuredTemplateDataProperties>,
  MeasuredTemplateDataConstructorData,
  documents.BaseMeasuredTemplate
> {
  /**
   * @remarks This override does not exist in foundry but is added here to prepend runtime errors.
   */
  constructor(
    data: MeasuredTemplateDataConstructorData | undefined,
    document: InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseScene>>
  );

  static defineSchema(): MeasuredTemplateDataSchema;

  /** @override */
  protected _initialize(): void;

  /** @override */
  protected _validateDocument(): void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface MeasuredTemplateData extends MeasuredTemplateDataProperties {}
