import { DocumentSchemaToData } from '../../abstract/helperTypes';
import { DocumentData } from '../../abstract/module';
import { BaseActiveEffect } from '../../documents';
import * as fields from '../fields';
import * as CONST from '../../constants';

interface ModeField extends DocumentField<number> {
  type: typeof Number;
  required: true;
  default: typeof CONST.ACTIVE_EFFECT_MODES.ADD;
  validate: (m: unknown) => boolean;
  validationError: 'Invalid mode specified for change in ActiveEffectData';
}

interface EffectChangeDataSchema extends DocumentSchema {
  /**
   * The attribute path in the Actor or Item data which the change modifies
   */
  key: typeof fields.BLANK_STRING;

  /**
   * The value of the change effect
   */
  value: typeof fields.BLANK_STRING;

  /**
   * The modification mode with which the change is applied
   */
  mode: ModeField;

  /**
   * The priority level with which this change is applied
   */
  priority: typeof fields.NUMERIC_FIELD;
}

/**
 * An embedded data structure which defines the structure of a change applied by an ActiveEffect.
 * @see ActiveEffectData
 */
export declare class EffectChangeData extends DocumentData<EffectChangeDataSchema, BaseActiveEffect> {
  static defineSchema(): EffectChangeDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface EffectChangeData extends DocumentSchemaToData<EffectChangeDataSchema> {}
