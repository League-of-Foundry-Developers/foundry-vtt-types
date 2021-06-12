import { FieldReturnType, PropertiesToSource } from '../../../../types/helperTypes';
import { DocumentData } from '../../abstract/module.mjs';
import * as documents from '../../documents.mjs';
import * as fields from '../fields.mjs';
import { EffectChangeData } from './effectChangeData';
import { EffectDurationData } from './effectDurationData';

interface ActiveEffectDataSchema extends DocumentSchema {
  _id: typeof fields.DOCUMENT_ID;
  changes: DocumentField<EffectChangeData[]> & {
    default: [];
    required: true;
    type: [typeof EffectChangeData];
  };
  disabled: typeof fields.BOOLEAN_FIELD;
  duration: DocumentField<EffectDurationData> & {
    default: {};
    required: true;
    type: typeof EffectDurationData;
  };
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
  duration: EffectDurationData;

  /**
   * An icon image path used to depict the ActiveEffect
   */
  icon?: string | null;

  /**
   * A text label which describes the name of the ActiveEffect
   * @defaultValue `''`
   */
  label: string;

  /**
   * A UUID reference to the document from which this ActiveEffect originated
   */
  origin?: string;

  /**
   * A color string which applies a tint to the ActiveEffect icon
   */
  tint?: string | null;

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

interface ActiveEffectDataConstructorData {
  _id?: string | null;
  changes?: EffectChangeData[] | null;
  disabled?: boolean | null;
  duration?: EffectDurationData[] | null;
  icon?: string | null;
  label?: string | null;
  origin?: string | null;
  tint?: string | null;
  transfer?: boolean | null;
  flags?: Record<string, unknown> | null;
}

/**
 * The data schema for a ActiveEffect document.
 * @see BaseActiveEffect
 */
export declare class ActiveEffectData extends DocumentData<
  ActiveEffectDataSchema,
  ActiveEffectDataProperties,
  PropertiesToSource<ActiveEffectDataProperties>,
  ActiveEffectDataConstructorData,
  documents.BaseActiveEffect
> {
  static defineSchema(): ActiveEffectDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface ActiveEffectData extends ActiveEffectDataProperties {}
