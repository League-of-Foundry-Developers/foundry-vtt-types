import {
  ConfiguredDocumentClass,
  ConfiguredFlags,
  FieldReturnType,
  PropertiesToSource
} from "../../../../types/helperTypes";
import { DocumentData } from "../../abstract/module.mjs";
import * as documents from "../../documents.mjs";
import * as fields from "../fields.mjs";

interface MeasuredTemplateDataSchema extends DocumentSchema {
  _id: fields.DocumentId;
  user: fields.ForeignDocumentField<{ type: typeof documents.BaseUser; required: true }>;
  t: DocumentField<typeof foundry.CONST.MEASURED_TEMPLATE_TYPES> & {
    type: typeof String;
    required: true;
    default: typeof foundry.CONST.MEASURED_TEMPLATE_TYPES.CIRCLE;
    validate: (t: unknown) => t is typeof foundry.CONST.MEASURED_TEMPLATE_TYPES;
    validationError: "Invalid {name} {field} which must be a value in CONST.MEASURED_TEMPLATE_TYPES";
  };
  x: fields.RequiredNumber;
  y: fields.RequiredNumber;
  distance: FieldReturnType<fields.RequiredPositiveNumber, { default: 1; validate: (n: number) => boolean }>;
  direction: FieldReturnType<fields.AngleField, { default: 0 }>;
  angle: fields.AngleField;
  width: FieldReturnType<fields.RequiredPositiveNumber, { default: 1 }>;
  borderColor: FieldReturnType<fields.ColorField, { required: true; default: "#000000" }>;
  fillColor: FieldReturnType<fields.ColorField, { required: true; default: "#FF0000" }>;
  texture: fields.VideoField;
  flags: fields.ObjectField;
}

interface MeasuredTemplateDataProperties {
  /**
   * The _id which uniquely identifies this BaseMeasuredTemplate embedded document
   * @defaultValue `null`
   */
  _id: string | null;

  user: string | null;

  /**
   * The value in CONST.MEASURED_TEMPLATE_TYPES which defines the geometry type of this template
   * @defaultValue `foundry.CONST.MEASURED_TEMPLATE_TYPES.CIRCLE`
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
   * @defaultValue `360`
   */
  angle: number;

  /**
   * The width of the measured template, applies to ray types
   * @defaultValue `1`
   */
  width: number;

  /**
   * A color string used to tint the border of the template shape
   * @defaultValue `"#000000"`
   */
  borderColor: string | null;

  /**
   * A color string used to tint the fill of the template shape
   * @defaultValue `"#FF0000"`
   */
  fillColor: string | null;

  /**
   * A repeatable tiling texture used to add a texture fill to the template shape
   */
  texture: string | null | undefined;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: ConfiguredFlags<"MeasuredTemplate">;
}

interface MeasuredTemplateDataConstructorData {
  /**
   * The _id which uniquely identifies this BaseMeasuredTemplate embedded document
   * @defaultValue `null`
   */
  _id?: string | null | undefined;

  user?: InstanceType<ConfiguredDocumentClass<typeof documents.BaseUser>> | string | null | undefined;

  /**
   * The value in CONST.MEASURED_TEMPLATE_TYPES which defines the geometry type of this template
   * @defaultValue `foundry.CONST.MEASURED_TEMPLATE_TYPES.CIRCLE`
   */
  t?: foundry.CONST.MEASURED_TEMPLATE_TYPES | null | undefined;

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
   * @defaultValue `360`
   */
  angle?: number | null | undefined;

  /**
   * The width of the measured template, applies to ray types
   * @defaultValue `1`
   */
  width?: number | null | undefined;

  /**
   * A color string used to tint the border of the template shape
   * @defaultValue `"#000000"`
   */
  borderColor?: string | null | undefined;

  /**
   * A color string used to tint the fill of the template shape
   * @defaultValue `"#FF0000"`
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
  flags?: ConfiguredFlags<"MeasuredTemplate"> | null | undefined;
}

type MeasuredTemplateDataSource = PropertiesToSource<MeasuredTemplateDataProperties>;

/**
 * The data schema for a MeasuredTemplate embedded document.
 * @see BaseMeasuredTemplate
 */
export class MeasuredTemplateData extends DocumentData<
  MeasuredTemplateDataSchema,
  MeasuredTemplateDataProperties,
  MeasuredTemplateDataSource,
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

  static override defineSchema(): MeasuredTemplateDataSchema;

  protected override _initialize(): void;

  protected override _validateDocument(): void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MeasuredTemplateData extends MeasuredTemplateDataProperties {}
