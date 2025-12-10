import type RegionBehaviorType from "./base.d.mts";
import type { Brand } from "#utils";
import fields = foundry.data.fields;
import type { InvertObject } from "#common/utils/helpers.d.mts";

declare namespace AdjustDarknessLevelRegionBehaviorType {
  type MODES = Brand<number, "AdjustDarknessLevelRegionBehaviorType.MODES">;

  interface Modes extends Readonly<{
    /**
     * Override the darkness level with the modifier.
     */
    OVERRIDE: 0 & MODES;

    /**
     * Brighten the darkness level: `darknessLevel * (1 - modifier)`
     */
    BRIGHTEN: 1 & MODES;

    /**
     * Darken the darkness level: `1 - (1 - darknessLevel) * (1 - modifier)`.
     */
    DARKEN: 2 & MODES;
  }> {}

  interface Schema extends foundry.data.fields.DataSchema {
    mode: fields.NumberField<{
      required: true;
      choices: InvertObject<Modes>;
      initial: typeof AdjustDarknessLevelRegionBehaviorType.MODES.OVERRIDE;
      validationError: string;
    }>;
    modifier: fields.AlphaField<{ initial: number; step: number }>;
  }
}

/** The data model for a behavior that allows to suppress weather effects within the Region */
declare class AdjustDarknessLevelRegionBehaviorType extends RegionBehaviorType<AdjustDarknessLevelRegionBehaviorType.Schema> {
  #adjustDarknessLevelRegionBehaviorType: true;

  /** @defaultValue `["BEHAVIOR.TYPES.adjustDarknessLevel", "BEHAVIOR.TYPES.base"]` */
  static override LOCALIZATION_PREFIXES: string[];

  /** Darkness level behavior modes. */
  static get MODES(): AdjustDarknessLevelRegionBehaviorType.Modes;

  static override defineSchema(): AdjustDarknessLevelRegionBehaviorType.Schema;

  static override events: Record<string, RegionBehaviorType.EventBehaviorStaticHandler>;

  // _onUpdate is overridden but without signature changes.
  // For type simplicity it is left off. Methods like this historically have been the source of a large amount of computation from tsc.
}

export default AdjustDarknessLevelRegionBehaviorType;
