import { FieldReturnType, PropertiesToSource } from "../../../../types/helperTypes";
import { DocumentData } from "../../abstract/module.mjs";
import { BaseActiveEffect } from "../../documents.mjs";
import * as fields from "../fields.mjs";

interface EffectChangeDataSchema extends DocumentSchema {
  key: fields.BlankString;
  value: fields.BlankString;
  mode: FieldReturnType<fields.NonnegativeNumberField, { default: typeof foundry.CONST.ACTIVE_EFFECT_MODES.ADD }>;
  priority: fields.NumericField;
}

interface EffectChangeDataProperties {
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

interface EffectChangeDataConstructorData {
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

type EffectChangeDataSource = PropertiesToSource<EffectChangeDataProperties>;

/**
 * An embedded data structure which defines the structure of a change applied by an ActiveEffect.
 * @see ActiveEffectData
 */
export class EffectChangeData extends DocumentData<
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
