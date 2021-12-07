import { FieldReturnType, PropertiesToSource } from '../../../../types/helperTypes';
import { DocumentData } from '../../abstract/module.mjs';
import { BaseAmbientLight } from '../../documents.mjs';
import * as fields from '../fields.mjs';

interface DarknessActivationSchema extends DocumentSchema {
  min: FieldReturnType<typeof fields.ALPHA_FIELD, { default: 0 }>;
  max: typeof fields.ALPHA_FIELD;
}

interface DarknessActivationProperties {
  /**
   * The minimum darkness level for which activation occurs
   * @defaultValue `0`
   */
  min: number;

  /**
   * The maximum darkness level for which activation occurs
   * @defaultValue `1`
   */
  max: number;
}

export interface DarknessActivationConstructorData {
  /**
   * The minimum darkness level for which activation occurs
   * @defaultValue `0`
   */
  min?: number | null | undefined;

  /**
   * The maximum darkness level for which activation occurs
   * @defaultValue `1`
   */
  max?: number | null | undefined;
}

/**
 * An embedded data object which defines the darkness range during which some attribute is active
 */
export declare class DarknessActivation extends DocumentData<
  DarknessActivationSchema,
  DarknessActivationProperties,
  PropertiesToSource<DarknessActivationProperties>,
  DarknessActivationConstructorData,
  BaseAmbientLight
> {
  static defineSchema(): DarknessActivationSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface DarknessActivation extends DarknessActivationProperties {}
