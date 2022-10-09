import { FieldReturnType, PropertiesToSource } from "../../../../types/helperTypes";
import { DocumentData } from "../../abstract/module.mjs";
import { BaseAmbientLight } from "../../documents.mjs";
import * as fields from "../fields.mjs";

interface DarknessActivationSchema extends DocumentSchema {
  min: FieldReturnType<fields.AlphaField, { default: 0 }>;
  max: fields.AlphaField;
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

interface DarknessActivationConstructorData {
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

type DarknessActivationSource = PropertiesToSource<DarknessActivationProperties>;

/**
 * An embedded data object which defines the darkness range during which some attribute is active
 */
export class DarknessActivation extends DocumentData<
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
