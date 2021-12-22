import { ConfiguredFlags, FieldReturnType, PropertiesToSource } from '../../../../types/helperTypes';
import DocumentData from '../../abstract/data.mjs';
import * as documents from '../../documents.mjs';
import * as fields from '../fields.mjs';
import { DarknessActivation, DarknessActivationConstructorData } from './darknessActivation';

interface AmbientSoundDataSchema extends DocumentSchema {
  _id: typeof fields.DOCUMENT_ID;
  x: typeof fields.REQUIRED_NUMBER;
  y: typeof fields.REQUIRED_NUMBER;
  radius: typeof fields.NONNEGATIVE_NUMBER_FIELD;
  path: typeof fields.AUDIO_FIELD;
  repeat: typeof fields.BOOLEAN_FIELD;
  volume: FieldReturnType<typeof fields.ALPHA_FIELD, { default: 0.5 }>;
  walls: FieldReturnType<typeof fields.BOOLEAN_FIELD, { default: true }>;
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
   * @defaultValue `null`
   */
  _id: string | null;

  /** @defaultValue `0` */
  x: number;

  /** @defaultValue `0` */
  y: number;

  /** @defaultValue `0` */
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

  /** @defaultValue `true` */
  easing: boolean;

  /** @defaultValue `false` */
  hidden: boolean;

  /** @defaultValue `{}` */
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
   * @defaultValue `null`
   */
  _id?: string | null | undefined;

  /** @defaultValue `0` */
  x?: number | null | undefined;

  /** @defaultValue `0` */
  y?: number | null | undefined;

  /** @defaultValue `0` */
  radius?: number | null | undefined;

  /**
   * The audio file path that is played by this sound
   */
  path?: string | null | undefined;

  /**
   * Does this sound loop?
   * @defaultValue `false`
   */
  repeat?: boolean | null | undefined;

  /**
   * The audio volume of the sound, from 0 to 1
   * @defaultValue `0.5`
   */
  volume?: number | null | undefined;

  /** @defaultValue `true` */
  easing?: boolean | null | undefined;

  /** @defaultValue `false` */
  hidden?: boolean | null | undefined;

  /** @defaultValue `{}` */
  darkness?: DarknessActivationConstructorData | null | undefined;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags?: ConfiguredFlags<'AmbientSound'> | null | undefined;
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

  _initializeSource(data: AmbientSoundDataConstructorData): PropertiesToSource<AmbientSoundDataProperties>;

  /** @override */
  protected _initialize(): void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface AmbientSoundData extends AmbientSoundDataProperties {}
