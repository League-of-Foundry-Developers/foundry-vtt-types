import { DocumentSchemaToData } from '../../abstract/helperTypes';
import { DocumentData } from '../../abstract/module';
import { BaseActiveEffect } from '../../documents';
import * as fields from '../fields';

interface EffectDurationDataSchema extends DocumentSchema {
  /**
   * The world time when the active effect first started
   */
  startTime: typeof fields.TIMESTAMP_FIELD;

  /**
   * The maximum duration of the effect, in seconds
   */
  seconds: typeof fields.NONNEGATIVE_INTEGER_FIELD;

  /**
   * The _id of the CombatEncounter in which the effect first started
   */
  combat: typeof fields.STRING_FIELD;

  /**
   * The maximum duration of the effect, in combat rounds
   */
  rounds: typeof fields.NONNEGATIVE_INTEGER_FIELD;

  /**
   * The maximum duration of the effect, in combat turns
   */
  turns: typeof fields.NONNEGATIVE_INTEGER_FIELD;

  /**
   * The round of the CombatEncounter in which the effect first started
   */
  startRound: typeof fields.NONNEGATIVE_INTEGER_FIELD;

  /**
   * The turn of the CombatEncounter in which the effect first started
   */
  startTurn: typeof fields.NONNEGATIVE_INTEGER_FIELD;
}

/**
 * An embedded data structure which tracks the duration of an ActiveEffect.
 * @see ActiveEffectData
 */
export declare class EffectDurationData extends DocumentData<EffectDurationDataSchema, BaseActiveEffect> {
  static defineSchema(): EffectDurationDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface EffectDurationData extends DocumentSchemaToData<EffectDurationDataSchema> {}
