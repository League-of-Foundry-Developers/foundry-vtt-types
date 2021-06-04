import { DocumentData } from '../../abstract/module.mjs';
import { BaseActiveEffect } from '../../documents.mjs';
import * as fields from '../fields.mjs';

interface EffectDurationDataSchema extends DocumentSchema {
  startTime: typeof fields.TIMESTAMP_FIELD;
  seconds: typeof fields.NONNEGATIVE_INTEGER_FIELD;
  combat: typeof fields.STRING_FIELD;
  rounds: typeof fields.NONNEGATIVE_INTEGER_FIELD;
  turns: typeof fields.NONNEGATIVE_INTEGER_FIELD;
  startRound: typeof fields.NONNEGATIVE_INTEGER_FIELD;
  startTurn: typeof fields.NONNEGATIVE_INTEGER_FIELD;
}

interface EffectDurationDataProperties {
  /**
   * The world time when the active effect first started
   */
  startTime: number;

  /**
   * The maximum duration of the effect, in seconds
   */
  seconds?: number;

  /**
   * The _id of the CombatEncounter in which the effect first started
   */
  combat?: string;

  /**
   * The maximum duration of the effect, in combat rounds
   */
  rounds?: number;

  /**
   * The maximum duration of the effect, in combat turns
   */
  turns?: number;

  /**
   * The round of the CombatEncounter in which the effect first started
   */
  startRound?: number;

  /**
   * The turn of the CombatEncounter in which the effect first started
   */
  startTurn?: number;
}

/**
 * An embedded data structure which tracks the duration of an ActiveEffect.
 * @see ActiveEffectData
 */
export declare class EffectDurationData extends DocumentData<
  EffectDurationDataSchema,
  EffectDurationDataProperties,
  BaseActiveEffect
> {
  static defineSchema(): EffectDurationDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface EffectDurationData extends EffectDurationDataProperties {}
