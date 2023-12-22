import type { FieldReturnType, PropertiesToSource } from "../../../../types/helperTypes.mts";
import type { DocumentData } from "../../abstract/module.mts";
import type { BaseAmbientLight } from "../../documents.mjs/index.mts";
import type * as fields from "../fields.mts";

export interface DarknessActivationSchema extends DocumentSchema {
  min: FieldReturnType<fields.AlphaField, { default: 0 }>;
  max: fields.AlphaField;
}

export interface DarknessActivationProperties {
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

export type DarknessActivationSource = PropertiesToSource<DarknessActivationProperties>;

/**
 * An embedded data object which defines the darkness range during which some attribute is active
 */
export declare class DarknessActivation extends DocumentData<
  DarknessActivationSchema,
  DarknessActivationProperties,
  DarknessActivationSource,
  DarknessActivationConstructorData,
  BaseAmbientLight
> {
  static override defineSchema(): DarknessActivationSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DarknessActivation extends DarknessActivationProperties {}
