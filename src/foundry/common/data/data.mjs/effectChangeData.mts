import type { FieldReturnType, PropertiesToSource } from "../../../../types/helperTypes.d.ts";
import type { DocumentData } from "../../abstract/module.mts";
import type { BaseActiveEffect } from "../../documents.mjs/index.mts";
import type * as fields from "../fields.mts";

export interface EffectChangeDataSchema extends DocumentSchema {
  key: fields.BlankString;
  value: fields.BlankString;
  mode: FieldReturnType<fields.NonnegativeNumberField, { default: typeof foundry.CONST.ACTIVE_EFFECT_MODES.ADD }>;
  priority: fields.NumericField;
}

export interface EffectChangeDataProperties {
  /**
   * The attribute path in the Actor or Item data which the change modifies
   * @defaultValue `""`
   */
  key: string;

  /**
   * The value of the change effect
   * @defaultValue `""`
   */
  value: string;

  /**
   * The modification mode with which the change is applied
   * @defaultValue `CONST.ACTIVE_EFFECT_MODES.ADD`
   */
  mode: number;

  /**
   * The priority level with which this change is applied
   */
  priority: number | null | undefined;
}

export interface EffectChangeDataConstructorData {
  /**
   * The attribute path in the Actor or Item data which the change modifies
   * @defaultValue `""`
   */
  key?: string | null | undefined;

  /**
   * The value of the change effect
   * @defaultValue `""`
   */
  value?: string | null | undefined;

  /**
   * The modification mode with which the change is applied
   * @defaultValue `CONST.ACTIVE_EFFECT_MODES.ADD`
   */
  mode?: number | null | undefined;

  /**
   * The priority level with which this change is applied
   */
  priority?: number | null | undefined;
}

export type EffectChangeDataSource = PropertiesToSource<EffectChangeDataProperties>;

/**
 * An embedded data structure which defines the structure of a change applied by an ActiveEffect.
 * @see ActiveEffectData
 */
export declare class EffectChangeData extends DocumentData<
  EffectChangeDataSchema,
  EffectChangeDataProperties,
  EffectChangeDataSource,
  EffectChangeDataConstructorData,
  BaseActiveEffect
> {
  static override defineSchema(): EffectChangeDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EffectChangeData extends EffectChangeDataProperties {}
