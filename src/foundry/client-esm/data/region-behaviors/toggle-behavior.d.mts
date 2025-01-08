import type RegionBehaviorType from "./base.d.mts";
import fields = foundry.data.fields;

declare namespace ToggleBehaviorRegionBehaviorType {
  interface Schema extends foundry.data.fields.DataSchema {
    events: RegionBehaviorType.EventsField;

    /** The Region Behavior UUIDs that are enabled. */
    enable: fields.SetField<fields.DocumentUUIDField<{ type: "RegionBehavior" }>>;

    /** The Region Behavior UUIDs that are disabled. */
    disable: fields.SetField<fields.DocumentUUIDField<{ type: "RegionBehavior" }>>;
  }
}

/** The data model for a behavior that toggles Region Behaviors when one of the subscribed events occurs. */
declare class ToggleBehaviorRegionBehaviorType extends RegionBehaviorType<ToggleBehaviorRegionBehaviorType.Schema> {
  /** @defaultValue `["BEHAVIOR.TYPES.toggleBehavior", "BEHAVIOR.TYPES.base"]` */
  static override LOCALIZATION_PREFIXES: string[];

  static override defineSchema(): ToggleBehaviorRegionBehaviorType.Schema;

  /**
   * @privateRemarks validateJoint is overridden but without signature changes.
   * For type simplicity it is left off. Methods like this historically have been the source of a large amount of computation from tsc.
   */

  protected override _handleRegionEvent(event: RegionDocument.RegionEvent): Promise<void>;
}

export default ToggleBehaviorRegionBehaviorType;
