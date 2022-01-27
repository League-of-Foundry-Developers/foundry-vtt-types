import { ConfiguredFlags, FieldReturnType, PropertiesToSource } from '../../../../types/helperTypes';
import DocumentData from '../../abstract/data.mjs';
import * as documents from '../../documents.mjs';
import * as fields from '../fields.mjs';
import { DarknessActivation, DarknessActivationConstructorData } from './darknessActivation';

interface AmbientSoundDataSchema extends DocumentSchema {
  _id: fields.DocumentId;
  x: fields.RequiredNumber;
  y: fields.RequiredNumber;
  radius: fields.NonnegativeNumberField;
  path: fields.AudioField;
  repeat: fields.BooleanField;
  volume: FieldReturnType<fields.AlphaField, { default: 0.5 }>;
  walls: FieldReturnType<fields.BooleanField, { default: true }>;
  easing: FieldReturnType<fields.BooleanField, { default: true }>;
  hidden: fields.BooleanField;
  darkness: DocumentField<DarknessActivation> & {
    type: typeof DarknessActivation;
    required: true;
    default: Record<string, never>;
  };
  flags: fields.ObjectField;
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
  walls: boolean;

  /** @defaultValue `true` */
  easing: boolean;

  /** @defaultValue `false` */
  hidden: boolean;

  /** @defaultValue `new DarknessActivation({})` */
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
  walls?: boolean | null | undefined;

  /** @defaultValue `true` */
  easing?: boolean | null | undefined;

  /** @defaultValue `false` */
  hidden?: boolean | null | undefined;

  /** @defaultValue `new DarknessActivation({})` */
  darkness?: DarknessActivationConstructorData | null | undefined;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags?: ConfiguredFlags<'AmbientSound'> | null | undefined;
}

type AmbientSoundDataSource = PropertiesToSource<AmbientSoundDataProperties>;

/**
 * The data schema for a AmbientSound embedded document.
 * @see BaseAmbientSound
 */
export class AmbientSoundData extends DocumentData<
  AmbientSoundDataSchema,
  AmbientSoundDataProperties,
  AmbientSoundDataSource,
  AmbientSoundDataConstructorData,
  documents.BaseAmbientSound
> {
  /** @override */
  static defineSchema(): AmbientSoundDataSchema;

  /** @override */
  _initializeSource(data: AmbientSoundDataConstructorData): AmbientSoundDataSource;

  /** @override */
  protected _initialize(): void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AmbientSoundData extends AmbientSoundDataProperties {}
