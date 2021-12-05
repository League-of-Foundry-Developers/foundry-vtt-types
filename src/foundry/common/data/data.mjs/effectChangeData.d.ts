import { DocumentData } from '../../abstract/module.mjs';
import { BaseActiveEffect } from '../../documents.mjs';
import * as fields from '../fields.mjs';
import * as CONST from '../../constants.mjs';
import { PropertiesToSource } from '../../../../types/helperTypes';

interface EffectChangeDataSchema extends DocumentSchema {
  key: typeof fields.BLANK_STRING;
  value: typeof fields.BLANK_STRING;
  mode: DocumentField<number> & {
    type: typeof Number;
    required: true;
    default: typeof CONST.ACTIVE_EFFECT_MODES.ADD;
    validate: (m: unknown) => boolean;
    validationError: 'Invalid mode specified for change in ActiveEffectData';
  };
  priority: typeof fields.NUMERIC_FIELD;
}

interface EffectChangeDataProperties {
  /**
   * The attribute path in the Actor or Item data which the change modifies
   * @defaultValue `''`
   */
  key: string;

  /**
   * The value of the change effect
   * @defaultValue `''`
   */
  value: string;

  /**
   * The modification mode with which the change is applied
   */
  mode: CONST.ACTIVE_EFFECT_MODES;

  /**
   * The priority level with which this change is applied
   */
  priority: number | null | undefined;
}

export interface EffectChangeDataConstructorData {
  /**
   * The attribute path in the Actor or Item data which the change modifies
   * @defaultValue `''`
   */
  key?: string | null | undefined;

  /**
   * The value of the change effect
   * @defaultValue `''`
   */
  value?: string | null | undefined;

  /**
   * The modification mode with which the change is applied
   */
  mode?: CONST.ACTIVE_EFFECT_MODES | null | undefined;

  /**
   * The priority level with which this change is applied
   */
  priority?: number | null | undefined;
}

/**
 * An embedded data structure which defines the structure of a change applied by an ActiveEffect.
 * @see ActiveEffectData
 */
export declare class EffectChangeData extends DocumentData<
  EffectChangeDataSchema,
  EffectChangeDataProperties,
  PropertiesToSource<EffectChangeDataProperties>,
  EffectChangeDataConstructorData,
  BaseActiveEffect
> {
  static defineSchema(): EffectChangeDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface EffectChangeData extends EffectChangeDataProperties {}
