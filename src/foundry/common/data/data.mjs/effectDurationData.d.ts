import { FieldReturnType, PropertiesToSource } from '../../../../types/helperTypes';
import { DocumentData } from '../../abstract/module.mjs';
import { BaseActiveEffect } from '../../documents.mjs';
import * as fields from '../fields.mjs';

interface EffectDurationDataSchema extends DocumentSchema {
  startTime: FieldReturnType<typeof fields.NUMERIC_FIELD, { default: null }>;
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
   * @defaultValue `null`
   */
  startTime: number | null;

  /**
   * The maximum duration of the effect, in seconds
   */
  seconds: number | undefined;

  /**
   * The _id of the CombatEncounter in which the effect first started
   */
  combat: string | undefined;

  /**
   * The maximum duration of the effect, in combat rounds
   */
  rounds: number | undefined;

  /**
   * The maximum duration of the effect, in combat turns
   */
  turns: number | undefined;

  /**
   * The round of the CombatEncounter in which the effect first started
   */
  startRound: number | undefined;

  /**
   * The turn of the CombatEncounter in which the effect first started
   */
  startTurn: number | undefined;
}

export interface EffectDurationDataConstructorData {
  /**
   * The world time when the active effect first started
   * @defaultValue `null`
   */
  startTime?: number | null | undefined;

  /**
   * The maximum duration of the effect, in seconds
   */
  seconds?: number | null | undefined;

  /**
   * The _id of the CombatEncounter in which the effect first started
   */
  combat?: string | null | undefined;

  /**
   * The maximum duration of the effect, in combat rounds
   */
  rounds?: number | null | undefined;

  /**
   * The maximum duration of the effect, in combat turns
   */
  turns?: number | null | undefined;

  /**
   * The round of the CombatEncounter in which the effect first started
   */
  startRound?: number | null | undefined;

  /**
   * The turn of the CombatEncounter in which the effect first started
   */
  startTurn?: number | null | undefined;
}

/**
 * An embedded data structure which tracks the duration of an ActiveEffect.
 * @see ActiveEffectData
 */
export declare class EffectDurationData extends DocumentData<
  EffectDurationDataSchema,
  EffectDurationDataProperties,
  PropertiesToSource<EffectDurationDataProperties>,
  EffectDurationDataConstructorData,
  BaseActiveEffect
> {
  static defineSchema(): EffectDurationDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface EffectDurationData extends EffectDurationDataProperties {}
