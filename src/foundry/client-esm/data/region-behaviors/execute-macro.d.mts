import type RegionBehaviorType from "./base.d.mts";
import fields = foundry.data.fields;

declare namespace ExecuteMacroRegionBehaviorType {
  interface Schema extends foundry.data.fields.DataSchema {
    events: RegionBehaviorType.EventsField;

    /** The Macro UUID */
    uuid: fields.DocumentUUIDField<{ type: "Macro" }>;

    everyone: fields.BooleanField;
  }
}

/** The data model for a behavior that executes a Macro. */
declare class ExecuteMacroRegionBehaviorType extends RegionBehaviorType<ExecuteMacroRegionBehaviorType.Schema> {
  #executeMacroRegionBehaviorType: true;

  /** @defaultValue `["BEHAVIOR.TYPES.executeMacro", "BEHAVIOR.TYPES.base"]` */
  static override LOCALIZATION_PREFIXES: string[];

  static override defineSchema(): ExecuteMacroRegionBehaviorType.Schema;

  protected override _handleRegionEvent(event: RegionDocument.RegionEvent): Promise<void>;
}

export default ExecuteMacroRegionBehaviorType;
