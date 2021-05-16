import { FieldReturnType, PropertiesToSource } from '../../abstract/helperTypes';
import { DocumentData } from '../../abstract/module';
import * as documents from '../../documents';
import * as fields from '../fields';
import { EffectChangeData } from './effectChangeData';
import { EffectDurationData } from './effectDurationData';

interface ChangesField extends DocumentField<EffectChangeData[]> {
  type: [typeof EffectChangeData];
  required: true;
  default: [];
}

interface DurationField extends DocumentField<EffectDurationData> {
  type: typeof EffectDurationData;
  required: true;
  // default: {}; // TODO: This is actually `{}`, make it work so that the default values are default values for source
}

interface ActiveEffectDataSchema extends DocumentSchema {
  _id: typeof fields.DOCUMENT_ID;
  changes: ChangesField;
  disabled: typeof fields.BOOLEAN_FIELD;
  duration: DurationField;
  icon: typeof fields.IMAGE_FIELD;
  label: typeof fields.BLANK_STRING;
  origin: typeof fields.STRING_FIELD;
  tint: typeof fields.COLOR_FIELD;
  transfer: FieldReturnType<typeof fields.BOOLEAN_FIELD, { default: true }>;
  flags: typeof fields.OBJECT_FIELD; // TODO: add more concrete object type
}

interface ActiveEffectDataProperties {
  /**
   * The _id which uniquely identifies the ActiveEffect within a parent Actor or Item
   */
  _id: string | null;

  /**
   * The array of EffectChangeData objects which the ActiveEffect applies
   */
  changes: EffectChangeData[];

  /**
   * Is this ActiveEffect currently disabled?
   * @defaultValue `false`
   */
  disabled: boolean;

  /**
   * An EffectDurationData object which describes the duration of the ActiveEffect
   */
  duration?: EffectDurationData;

  /**
   * An icon image path used to depict the ActiveEffect
   */
  icon?: string;

  /**
   * A text label which describes the name of the ActiveEffect
   */
  label: string;

  /**
   * A UUID reference to the document from which this ActiveEffect originated
   */
  origin?: string;

  /**
   * A color string which applies a tint to the ActiveEffect icon
   * @defaultValue `null`
   */
  tint: string | null;

  /**
   * Does this ActiveEffect automatically transfer from an Item to an Actor?
   * @defaultValue `true`
   */
  transfer: boolean;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: Record<string, unknown>;
}

type ActiveEffectDataSource = PropertiesToSource<ActiveEffectDataProperties>;

/**
 * The data schema for a ActiveEffect document.
 * @see BaseActiveEffect
 */
export declare class ActiveEffectData extends DocumentData<
  ActiveEffectDataSchema,
  ActiveEffectDataSource,
  documents.BaseActiveEffect
> {
  static defineSchema(): ActiveEffectDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface ActiveEffectData extends ActiveEffectDataProperties {}
