import type RegionBehaviorType from "./base.d.mts";
import fields = foundry.data.fields;

declare namespace ToggleBehaviorRegionBehaviorType {
  interface Source extends fields.SchemaField.SourceData<Schema> {}

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

  /** @throws If there's any overlap between the `data.enable` and `data.disable` sets */
  static override validateJoint(data: ToggleBehaviorRegionBehaviorType.Source): void;

  protected override _handleRegionEvent(event: RegionDocument.RegionEvent): Promise<void>;
}

export default ToggleBehaviorRegionBehaviorType;
