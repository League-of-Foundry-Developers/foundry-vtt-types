import { ConfiguredFlags, FieldReturnType, PropertiesToSource } from "../../../../types/helperTypes";
import { DocumentData } from "../../abstract/module.mjs";
import { BaseAmbientLight } from "../../documents.mjs";
import * as fields from "../fields.mjs";
import type { LightData, LightDataConstructorData } from "./lightData";

interface AmbientLightDataSchema extends DocumentSchema {
  _id: fields.DocumentId;
  x: fields.RequiredNumber;
  y: fields.RequiredNumber;
  rotation: FieldReturnType<fields.AngleField, { default: 0 }>;
  walls: FieldReturnType<fields.BooleanField, { default: true }>;
  vision: fields.BooleanField;
  config: DocumentField<LightData> & {
    type: typeof LightData;
    required: true;
    default: Record<string, never>;
  };
  hidden: fields.BooleanField;
  flags: fields.ObjectField;
}

interface AmbientLightDataProperties {
  /**
   * The _id which uniquely identifies this BaseAmbientLight embedded document
   */
  _id: string | null;

  /**
   * The x-coordinate position of the origin of the light
   * @defaultValue `0`
   */
  x: number;

  /**
   * The y-coordinate position of the origin of the light
   * @defaultValue `0`
   */
  y: number;

  /**
   * The angle of rotation for the tile between 0 and 360
   * @defaultValue `0`
   */
  rotation: number;

  /**
   * Whether or not this light source is constrained by Walls
   * @defaultValue `true`
   */
  walls: boolean;

  /**
   * Whether or not this light source provides a source of vision
   * @defaultValue `false`
   */
  vision: boolean;

  /**
   * Light configuration data
   * @defaultValue `new LightData({})`
   */
  config: LightData;

  /**
   * Is the light source currently hidden?
   * @defaultValue `false`
   */
  hidden: boolean;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: ConfiguredFlags<"AmbientLight">;
}

interface AmbientLightDataConstructorData {
  /**
   * The _id which uniquely identifies this BaseAmbientLight embedded document
   */
  _id?: string | null | undefined;

  /**
   * The x-coordinate position of the origin of the light
   * @defaultValue `0`
   */
  x?: number | null | undefined;

  /**
   * The y-coordinate position of the origin of the light
   * @defaultValue `0`
   */
  y?: number | null | undefined;

  /**
   * The angle of rotation for the tile between 0 and 360
   * @defaultValue `0`
   */
  rotation?: number | null | undefined;

  /**
   * Whether or not this light source is constrained by Walls
   * @defaultValue `true`
   */
  walls?: boolean | null | undefined;

  /**
   * Whether or not this light source provides a source of vision
   * @defaultValue `false`
   */
  vision?: boolean | null | undefined;

  /**
   * Light configuration data
   * @defaultValue `new LightData({})`
   */
  config?: LightDataConstructorData | null | undefined;

  /**
   * Is the light source currently hidden?
   * @defaultValue `false`
   */
  hidden?: boolean | null | undefined;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags?: ConfiguredFlags<"AmbientLight"> | null | undefined;
}

type AmbientLightDataSource = PropertiesToSource<AmbientLightDataProperties>;

/**
 * The data schema for a AmbientLight embedded document.
 * @see BaseAmbientLight
 */
export class AmbientLightData extends DocumentData<
  AmbientLightDataSchema,
  AmbientLightDataProperties,
  AmbientLightDataSource,
  AmbientLightDataConstructorData,
  BaseAmbientLight
> {
  static override defineSchema(): AmbientLightDataSchema;

  override _initializeSource(data: AmbientLightDataConstructorData): AmbientLightDataSource;

  protected override _initialize(): void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AmbientLightData extends AmbientLightDataProperties {}
