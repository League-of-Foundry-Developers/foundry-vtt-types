import Document, { DocumentMetadata } from '../abstract/document.mjs';
import * as fields from '../data/fields.mjs';
import { DataSchema } from '../abstract/data.mjs';
import { ConfiguredDocumentClass } from '../../../types/helperTypes.js';
import type { LightData } from '../data/data.mjs';
import { FlagsField } from '../data/flagsField';

interface BaseAmbientLightSchema extends DataSchema {
  /**
   * The _id which uniquely identifies this BaseAmbientLight embedded document
   */
  _id: fields.DocumentIdField<{}>;

  /**
   * The x-coordinate position of the origin of the light
   * (default: `0`)
   */
  x: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0; label: 'XCoord' }>;

  /**
   * The y-coordinate position of the origin of the light
   * (default: `0`)
   */
  y: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0; label: 'YCoord' }>;

  /**
   * The angle of rotation for the tile between 0 and 360
   * (default: `0`)
   */
  rotation: fields.AngleField<{ label: 'LIGHT.Rotation' }>;

  /**
   * Whether or not this light source is constrained by Walls
   * (default: `true`)
   */
  walls: fields.BooleanField<{ initial: true; label: 'LIGHT.Walls'; hint: 'LIGHT.WallsHint' }>;

  /**
   * Whether or not this light source provides a source of vision
   * (default: `false`)
   */
  vision: fields.BooleanField<{ label: 'LIGHT.Vision'; hint: 'LIGHT.VisionHint' }>;

  /**
   * Light configuration data
   */
  config: fields.EmbeddedDataField<typeof LightData, {}>;

  /**
   * Is the light source currently hidden?
   * (default: `false`)
   */
  hidden: fields.BooleanField<{ label: 'Hidden' }>;

  /**
   * An object of optional key/value flags
   */
  flags: FlagsField<'AmbientLight', {}>;
}

type BaseAmbientLightMetadata = Merge<
  DocumentMetadata,
  {
    name: 'AmbientLight';
    collection: 'lights';
    label: 'DOCUMENT.AmbientLight';
    labelPlural: 'DOCUMENT.AmbientLights';
  }
>;

type Foo = ConfiguredDocumentClass<typeof Scene>;

/**
 * The Document definition for an AmbientLight.
 * Defines the DataSchema and common behaviors for an AmbientLight which are shared between both client and server.
 */
declare class BaseAmbientLight extends Document<
  BaseAmbientLightSchema,
  InstanceType<ConfiguredDocumentClass<typeof Scene>>,
  BaseAmbientLightMetadata
> {
  /* -------------------------------------------- */
  /*  Model Configuration                         */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  static override readonly metadata: BaseAmbientLightMetadata;

  /** {@inheritdoc} */
  static override defineSchema(): BaseAmbientLightSchema;

  /* -------------------------------------------- */
  /*  Deprecations and Compatibility              */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  static override migrateData(data: Record<string, unknown>): Record<string, unknown>;
}

export default BaseAmbientLight;
