import Document, { DocumentMetadata } from '../abstract/document.mjs';
import * as fields from '../data/fields.mjs';
import type { DataSchema } from '../abstract/data.mjs';
import { FlagsField } from '../data/flagsField';

interface BaseAmbientSoundSchema extends DataSchema {
  /**
   * The _id which uniquely identifies this AmbientSound document
   */
  _id: fields.DocumentIdField<{}>;

  /**
   * The x-coordinate position of the origin of the sound.
   * (default: `0`)
   */
  x: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0; label: 'XCoord' }>;

  /**
   * The y-coordinate position of the origin of the sound.
   * (default: `0`)
   */

  y: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0; label: 'YCoord' }>;

  /**
   * The radius of the emitted sound.
   * (default: `0`)
   */
  radius: fields.NumberField<{
    required: true;
    nullable: false;
    initial: 0;
    min: 0;
    step: 0.01;
    label: 'SOUND.Radius';
  }>;

  /**
   * The audio file path that is played by this sound
   */
  path: fields.FilePathField<{ categories: ['AUDIO']; label: 'SOUND.SourcePath' }>;

  /**
   * Does this sound loop?
   * (default: `false`)
   */
  repeat: fields.BooleanField<{}>;

  /**
   * The audio volume of the sound, from 0 to 1
   * (default: `0.5`)
   */
  volume: fields.AlphaField<{ initial: 0.5; step: 0.01; label: 'SOUND.MaxVol'; hint: 'SOUND.MaxVolHint' }>;

  /**
   * Whether or not this sound source is constrained by Walls.
   * (default: `true`)
   */
  walls: fields.BooleanField<{ initial: true; label: 'SOUND.Walls'; hint: 'SOUND.WallsHint' }>;

  /**
   * Whether to adjust the volume of the sound heard by the listener based on how close the listener is to the center of the sound source.
   * (default: `true`)
   */
  easing: fields.BooleanField<{ initial: true; label: 'SOUND.Easing'; hint: 'SOUND.EasingHint' }>;

  /**
   * Is the sound source currently hidden?
   * (default: `false`)
   */
  hidden: fields.BooleanField<{ label: 'Hidden' }>;

  /**
   * A darkness range (min and max) for which the source should be active
   */
  darkness: fields.SchemaField<
    {
      min: fields.AlphaField<{ initial: 0 }>;
      max: fields.AlphaField<{ initial: 1 }>;
    },
    { label: 'SOUND.DarknessRange'; hint: 'SOUND.DarknessRangeHint' }
  >;

  /**
   * An object of optional key/value flags
   */
  flags: FlagsField<'AmbientSound', {}>;
}

type BaseAmbientSoundMetadata = Merge<
  DocumentMetadata,
  {
    name: 'AmbientSound';
    collection: 'sounds';
    label: 'DOCUMENT.AmbientSound';
    labelPlural: 'DOCUMENT.AmbientSounds';
    isEmbedded: true;
  }
>;

/**
 * The Document definition for an AmbientSound.
 * Defines the DataSchema and common behaviors for an AmbientSound which are shared between both client and server.
 */
declare class BaseAmbientSound extends Document<
  BaseAmbientSoundSchema,
  InstanceType<ConfiguredBaseScene>,
  BaseAmbientSoundMetadata
> {
  /* -------------------------------------------- */
  /*  Model Configuration                         */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  static override readonly metadata: BaseAmbientSoundMetadata;

  /** {@inheritdoc} */
  static override defineSchema(): BaseAmbientSoundSchema;

  /* -------------------------------------------- */
  /*  Deprecations and Compatibility              */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  static migrateData(data: Record<string, unknown>): Record<string, unknown>;
}

export default BaseAmbientSound;
