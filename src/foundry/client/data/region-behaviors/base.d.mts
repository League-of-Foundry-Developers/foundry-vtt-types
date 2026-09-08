import type TypeDataModel from "#common/abstract/type-data.d.mts";
import type { AnyObject, EmptyObject, MaybePromise } from "#utils";
import type { BaseTerrainData } from "../terrain-data.d.mts";
import type { Token } from "#client/canvas/placeables/_module.d.mts";

import fields = foundry.data.fields;

declare namespace RegionBehaviorType {
  type EventBehaviorStaticHandler = (event: RegionDocument.RegionEvent) => Promise<void>;

  type EventsField = fields.SetField<
    fields.StringField<{ required: true; choices: Record<CONST.REGION_EVENTS, string> }>,
    { label: string; hint: string }
  >;

  /** Options which configure how the events field is declared */
  interface CreateEventsFieldOptions {
    /** The event names to restrict to. */
    events?: string[] | undefined;

    /** The initial set of events that should be default for the field */
    initial?: string[] | undefined;
  }

  /** The segment data of a token's movement, as passed to {@linkcode RegionBehaviorType._getTerrainEffects}. */
  interface MovementSegment extends Pick<
    TokenDocument.MovementWaypoint,
    "width" | "height" | "shape" | "level" | "action"
  > {
    preview: boolean;
  }

  interface GetTerrainEffectsOptions extends Omit<Token.CreateTerrainMovementPathOptions, "preview"> {}
}

/**
 * The data model for a behavior that receives Region events.
 */
declare class RegionBehaviorType<
  Schema extends foundry.data.fields.DataSchema,
  Parent extends RegionBehavior.Implementation = RegionBehavior.Implementation,
  BaseData extends AnyObject = EmptyObject,
  DerivedData extends AnyObject = EmptyObject,
> extends TypeDataModel<Schema, Parent, BaseData, DerivedData> {
  /**
   * Create the events field.
   * @param options - Options which configure how the events field is declared
   */
  protected static _createEventsField(
    options?: RegionBehaviorType.CreateEventsFieldOptions,
  ): RegionBehaviorType.EventsField;

  /**
   * A RegionBehaviorType may register to always receive certain events by providing a record of handler functions.
   * These handlers are called with the behavior instance as its bound scope.
   * @defaultValue `{}`
   */
  static events: Record<string, RegionBehaviorType.EventBehaviorStaticHandler>;

  /**
   * The events that are handled by the behavior.
   * @defaultValue `new Set()`
   */
  events: Set<CONST.REGION_EVENTS>;

  /**
   * A convenience reference to the RegionBehavior which contains this behavior sub-type.
   */
  get behavior(): RegionBehavior.Implementation | null;

  /**
   * A convenience reference to the RegionDocument which contains this behavior sub-type.
   */
  get region(): RegionDocument.Implementation | null;

  /**
   * A convenience reference to the Scene which contains this behavior sub-type.
   */
  get scene(): Scene.Implementation | null;

  /**
   * Handle the Region event.
   * @param event - The Region event
   * @privateRemarks Asynchronous at runtime, but widened to {@linkcode MaybePromise}`<void>` because
   * {@linkcode foundry.data.regionBehaviors.TeleportTokenRegionBehaviorType._handleRegionEvent} is synchronous.
   * The result is awaited and discarded, so the widening is safe.
   */
  protected _handleRegionEvent(event: RegionDocument.RegionEvent): MaybePromise<void>;

  /**
   * Get the terrain effects of this behavior for the movement of the given token.
   * This function is called only for behaviors that are not disabled.
   * The terrain data is created from the terrain effects
   * ({@linkcode foundry.data.BaseTerrainData.resolveTerrainEffects | CONFIG.Token.movement.TerrainData.resolveTerrainEffects}).
   * Returns an empty array by default.
   * @param token   - The token being or about to be moved within the region of this behavior
   * @param segment - The segment data of the token's movement
   * @param options - Additional options
   * @returns The terrain effects that apply to this token's movement
   * @privateRemarks Foundry declares this `@template TerrainEffect`; the effect type is system-defined and
   * flows into {@linkcode foundry.data.BaseTerrainData.resolveTerrainEffects}, so it is typed as that
   * method's parameter element instead.
   */
  protected _getTerrainEffects(
    token: TokenDocument.Implementation,
    segment: RegionBehaviorType.MovementSegment,
    options?: RegionBehaviorType.GetTerrainEffectsOptions,
  ): BaseTerrainData.TerrainEffect[];
}

export default RegionBehaviorType;
