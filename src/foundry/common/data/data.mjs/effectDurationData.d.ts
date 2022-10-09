import { FieldReturnType, PropertiesToSource } from "../../../../types/helperTypes";
import { DocumentData } from "../../abstract/module.mjs";
import { BaseActiveEffect } from "../../documents.mjs";
import * as fields from "../fields.mjs";

interface EffectDurationDataSchema extends DocumentSchema {
  startTime: FieldReturnType<fields.NumericField, { default: null }>;
  seconds: fields.NonnegativeIntegerField;
  combat: fields.StringField;
  rounds: fields.NonnegativeIntegerField;
  turns: fields.NonnegativeIntegerField;
  startRound: fields.NonnegativeIntegerField;
  startTurn: fields.NonnegativeIntegerField;
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

interface EffectDurationDataConstructorData {
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

type EffectDurationDataSource = PropertiesToSource<EffectDurationDataProperties>;

/**
 * An embedded data structure which tracks the duration of an ActiveEffect.
 * @see ActiveEffectData
 */
export class EffectDurationData extends DocumentData<
  EffectDurationDataSchema,
  EffectDurationDataProperties,
  EffectDurationDataSource,
  EffectDurationDataConstructorData,
  BaseActiveEffect
> {
  static override defineSchema(): EffectDurationDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EffectDurationData extends EffectDurationDataProperties {}
