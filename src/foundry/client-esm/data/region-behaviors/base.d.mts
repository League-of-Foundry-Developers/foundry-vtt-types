import type TypeDataModel from "../../../common/abstract/type-data.d.mts";
import type { AnyObject, EmptyObject } from "../../../../utils/index.d.mts";

import fields = foundry.data.fields;

declare namespace RegionBehaviorType {
  type EventBehaviorStaticHandler = (event: RegionDocument.RegionEvent) => Promise<void>;

  type EventsField = fields.SetField<fields.StringField<{ required: true, choices: Record<CONST.REGION_EVENTS, string> }>, { label: string, hint: string }>;
}

/** The data model for a behavior that receives Region events. */
declare class RegionBehaviorType<
  Schema extends foundry.data.fields.DataSchema,
  Parent extends RegionBehavior.ConfiguredInstance = RegionBehavior.ConfiguredInstance,
  BaseData extends AnyObject = EmptyObject,
  DerivedData extends AnyObject = EmptyObject,
> extends TypeDataModel<Schema, Parent, BaseData, DerivedData> {
  /** Create the events field. */
  protected static _createEventsField(options?: {
    /** The event names to restrict to. */
    events?: string[],
    /** The initial set of events that should be default for the field */
    initial?: string[]
  }): RegionBehaviorType.EventsField;

  /**
   * A RegionBehaviorType may register to always receive certain events by providing a record of handler functions.
   * These handlers are called with the behavior instance as its bound scope.
   */
  static events: Record<string, RegionBehaviorType.EventBehaviorStaticHandler>;

  /**
   * The events that are handled by this behavior
   * @defaultValue `new Set()`
   */
  events: Set<string>;

  /** A convenience reference to the RegionBehavior which contains this behavior sub-type */
  get behavior(): RegionBehavior.ConfiguredInstance | null

  /** A convenience reference to the RegionDocument which contains this behavior sub-type.*/
  get region(): RegionDocument.ConfiguredInstance | null;

  /* ---------------------------------------- */

  /** A convenience reference to the Scene which contains this behavior sub-type. */
  get scene(): Scene.ConfiguredInstance | null;

  /* ---------------------------------------- */

  /**
   * Handle the Region event.
   * @param event     - The Region event
   * @internal
   */
  protected _handleRegionEvent(event: RegionDocument.RegionEvent): Promise<void>;
}

export default RegionBehaviorType;