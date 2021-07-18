import { ConfiguredFlags, FieldReturnType, PropertiesToSource } from '../../../../types/helperTypes';
import DocumentData from '../../abstract/data.mjs';
import * as documents from '../../documents.mjs';
import { BaseAmbientSound } from '../../documents.mjs';
import * as fields from '../fields.mjs';
import { DarknessActivation, DarknessActivationConstructorData } from './darknessActivation';

interface AmbientSoundDataSchema extends DocumentSchema {
  _id: typeof fields.DOCUMENT_ID;
  type: DocumentField<string> & {
    type: typeof String;
    required: true;
    default: typeof BaseAmbientSound['metadata']['types'][0];
    validate: (t: unknown) => t is ValueOf<typeof BaseAmbientSound['metadata']['types']>;
    validationError: 'Invalid {name} {field} which must be a value in BaseAmbientSound.metadata.types';
  };
  x: typeof fields.REQUIRED_NUMBER;
  y: typeof fields.REQUIRED_NUMBER;
  radius: typeof fields.REQUIRED_NUMBER;
  path: typeof fields.AUDIO_FIELD;
  repeat: typeof fields.BOOLEAN_FIELD;
  volume: FieldReturnType<typeof fields.ALPHA_FIELD, { default: 0.5 }>;
  easing: FieldReturnType<typeof fields.BOOLEAN_FIELD, { default: true }>;
  hidden: typeof fields.BOOLEAN_FIELD;
  darkness: DocumentField<DarknessActivation> & {
    type: typeof DarknessActivation;
    required: true;
    default: {};
  };
  flags: typeof fields.OBJECT_FIELD;
}

interface AmbientSoundDataProperties {
  /**
   * The _id which uniquely identifies this AmbientSound document
   */
  _id: string | null;

  /**
   * @defaultValue `documents.BaseAmbientSound.metadata.types[0]`
   */
  type: ValueOf<typeof BaseAmbientSound['metadata']['types']>;

  /**
   * @defaultValue `0`
   */
  x: number;

  /**
   * @defaultValue `0`
   */
  y: number;

  /**
   * @defaultValue `0`
   */
  radius: number;

  /**
   * The audio file path that is played by this sound
   */
  path: string | null | undefined;

  /**
   * Does this sound loop?
   * @defaultValue `false`
   */
  repeat: boolean;

  /**
   * The audio volume of the sound, from 0 to 1
   * @defaultValue `0.5`
   */
  volume: number;

  /**
   * @defaultValue `true`
   */
  easing: boolean;

  /**
   * @defaultValue `false`
   */
  hidden: boolean;

  /**
   * @defaultValue `{}`
   */
  darkness: DarknessActivation;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: ConfiguredFlags<'AmbientSound'>;
}

interface AmbientSoundDataConstructorData {
  /**
   * The _id which uniquely identifies this AmbientSound document
   */
  _id?: string | null;

  /**
   * @defaultValue `documents.BaseAmbientSound.metadata.types[0]`
   */
  type?: ValueOf<typeof BaseAmbientSound['metadata']['types']> | null;

  /**
   * @defaultValue `0`
   */
  x?: number | null;

  /**
   * @defaultValue `0`
   */
  y?: number | null;

  /**
   * @defaultValue `0`
   */
  radius?: number | null;

  /**
   * The audio file path that is played by this sound
   */
  path?: string | null;

  /**
   * Does this sound loop?
   * @defaultValue `false`
   */
  repeat?: boolean | null;

  /**
   * The audio volume of the sound, from 0 to 1
   * @defaultValue `0.5`
   */
  volume?: number | null;

  /**
   * @defaultValue `true`
   */
  easing?: boolean | null;

  /**
   * @defaultValue `false`
   */
  hidden?: boolean | null;

  /**
   * @defaultValue `{}`
   */
  darkness?: DarknessActivationConstructorData | null;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags?: ConfiguredFlags<'AmbientSound'> | null;
}

/**
 * The data schema for a AmbientSound embedded document.
 * @see BaseAmbientSound
 */
export declare class AmbientSoundData extends DocumentData<
  AmbientSoundDataSchema,
  AmbientSoundDataProperties,
  PropertiesToSource<AmbientSoundDataProperties>,
  AmbientSoundDataConstructorData,
  documents.BaseAmbientSound
> {
  static defineSchema(): AmbientSoundDataSchema;

  /** @override */
  protected _initialize(): void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface AmbientSoundData extends AmbientSoundDataProperties {}
