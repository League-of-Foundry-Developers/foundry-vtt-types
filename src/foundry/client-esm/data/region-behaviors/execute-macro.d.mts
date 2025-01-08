import type RegionBehaviorType from "./base.d.mts";
import fields = foundry.data.fields;

declare namespace ExecuteMacroRegionBehaviorType {
  interface Schema extends foundry.data.fields.DataSchema {
    events: RegionBehaviorType.EventsField;
    /** The Macro UUID */
    uuid: fields.DocumentUUIDField<{type: "Macro"}>;
    everyone: fields.BooleanField;
  }
}

/** The data model for a behavior that executes a Macro. */
declare class ExecuteMacroRegionBehaviorType extends RegionBehaviorType<ExecuteMacroRegionBehaviorType.Schema> {
  /** @defaultValue `["BEHAVIOR.TYPES.executeMacro", "BEHAVIOR.TYPES.base"]` */
  static override LOCALIZATION_PREFIXES: string[];

  static override defineSchema(): ExecuteMacroRegionBehaviorType.Schema;

  protected override _handleRegionEvent(event: RegionDocument.RegionEvent): Promise<void>;

  /**
   * Should the client execute the macro?
   * @param macro     - The macro.
   * @param user      - The user that triggered the event.
   * @returns         - Should the client execute the macro?
   */
  #shouldExecute(macro: Macro.ConfiguredInstance, user: User.ConfiguredInstance): boolean;
}

export default ExecuteMacroRegionBehaviorType;