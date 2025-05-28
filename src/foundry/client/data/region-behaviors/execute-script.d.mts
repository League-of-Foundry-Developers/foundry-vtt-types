import type RegionBehaviorType from "./base.d.mts";
import fields = foundry.data.fields;

declare namespace ExecuteScriptRegionBehaviorType {
  interface Schema extends foundry.data.fields.DataSchema {
    events: RegionBehaviorType.EventsField;

    /** The source code of the script */
    source: fields.JavaScriptField<{ async: true; gmOnly: true }>;
  }
}

/** The data model for a behavior that executes a script. */
declare class ExecuteScriptRegionBehaviorType extends RegionBehaviorType<ExecuteScriptRegionBehaviorType.Schema> {
  /** @defaultValue `["BEHAVIOR.TYPES.executeScript", "BEHAVIOR.TYPES.base"]` */
  static override LOCALIZATION_PREFIXES: string[];

  static override defineSchema(): ExecuteScriptRegionBehaviorType.Schema;

  protected override _handleRegionEvent(event: RegionDocument.RegionEvent): Promise<void>;
}

export default ExecuteScriptRegionBehaviorType;
