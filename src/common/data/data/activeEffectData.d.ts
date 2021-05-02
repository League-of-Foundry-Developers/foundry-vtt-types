import { DocumentSchemaToData, FieldReturnType } from '../../abstract/helperTypes';
import { DocumentData } from '../../abstract/module';
import { BaseActor, BaseItem } from '../../documents';
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
  // default: {}; // TODO: This is actually `{}` but that's not a valid instance of `EffectDurationData`, bug?
}

interface ActiveEffectDataSchema extends DocumentSchema {
  /**
   * The _id which uniquely identifies the ActiveEffect within a parent Actor or Item
   */
  _id: typeof fields.DOCUMENT_ID;

  /**
   * The array of EffectChangeData objects which the ActiveEffect applies
   */
  changes: ChangesField;

  /**
   * Is this ActiveEffect currently disabled?
   */
  disabled: typeof fields.BOOLEAN_FIELD;

  /**
   * An EffectDurationData object which describes the duration of the ActiveEffect
   */
  duration: DurationField;

  /**
   * An icon image path used to depict the ActiveEffect
   */
  icon: typeof fields.IMAGE_FIELD;

  /**
   * A text label which describes the name of the ActiveEffect
   */
  label: typeof fields.BLANK_STRING;

  /**
   * A UUID reference to the document from which this ActiveEffect originated
   */
  origin: typeof fields.STRING_FIELD;

  /**
   * A color string which applies a tint to the ActiveEffect icon
   */
  tint: typeof fields.COLOR_FIELD;

  /**
   * Does this ActiveEffect automatically transfer from an Item to an Actor?
   */
  transfer: FieldReturnType<typeof fields.BOOLEAN_FIELD, { default: true }>;

  /**
   * An object of optional key/value flags
   */
  flags: typeof fields.OBJECT_FIELD; // TODO: add more concrete object type
}

/**
 * The data schema for a ActiveEffect document.
 * @see BaseActiveEffect
 */
export declare class ActiveEffectData extends DocumentData<ActiveEffectDataSchema, BaseActor | BaseItem> {
  static defineSchema(): ActiveEffectDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface ActiveEffectData extends DocumentSchemaToData<ActiveEffectDataSchema> {}
