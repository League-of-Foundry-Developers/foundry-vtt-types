import type RegionBehaviorType from "./base.d.mts";
import type { DeepPartial } from "#utils";
import type { Document, TypeDataModel } from "#common/abstract/_module.d.mts";
import fields = foundry.data.fields;

declare namespace DefineSurfaceRegionBehaviorType {
  interface Schema extends foundry.data.fields.DataSchema {
    /**
     * Is the surface at the bottom or top of the elevation range?
     * Or are there surfaces at both the bottom and the top?
     */
    placement: fields.StringField<{
      required: true;
      blank: false;
      initial: "bottom";
      choices: {
        bottom: "BEHAVIOR.TYPES.defineSurface.PLACEMENTS.bottom.label";
        top: "BEHAVIOR.TYPES.defineSurface.PLACEMENTS.top.label";
        both: "BEHAVIOR.TYPES.defineSurface.PLACEMENTS.both.label";
      };
    }>;

    /** Does the surface restrict light? */
    light: fields.BooleanField<{ initial: true }>;

    /** Does the surface restrict movement? */
    move: fields.BooleanField<{ initial: true }>;

    /** Does the surface restrict sight? */
    sight: fields.BooleanField<{ initial: true }>;

    /** Does the surface restrict sound? */
    sound: fields.BooleanField<{ initial: true }>;

    /** Does the surface cause occlusion? */
    occlusion: fields.BooleanField<{ initial: true }>;

    /** Does the surface cause exposure? */
    exposure: fields.BooleanField;

    /** Does the surface cause culling? */
    culling: fields.BooleanField;
  }

  interface OnUpdateData extends DeepPartial<
    TypeDataModel.ParentAssignmentType<Schema, RegionBehavior.Implementation>
  > {}
}

/**
 * The data model for a behavior that defines surface(s) that can restrict light, movement, sight, and sound.
 */
declare class DefineSurfaceRegionBehaviorType extends RegionBehaviorType<DefineSurfaceRegionBehaviorType.Schema> {
  /** @defaultValue `["BEHAVIOR.TYPES.defineSurface", "BEHAVIOR.TYPES.base"]` */
  static override LOCALIZATION_PREFIXES: string[];

  static override defineSchema(): DefineSurfaceRegionBehaviorType.Schema;

  /**
   * @defaultValue
   * ```js
   * {
   *   [REGION_EVENTS.BEHAVIOR_ACTIVATED]: DefineSurfaceRegionBehaviorType.#onBehaviorActivated,
   *   [REGION_EVENTS.BEHAVIOR_DEACTIVATED]: DefineSurfaceRegionBehaviorType.#onBehaviorDeactivated,
   *   [REGION_EVENTS.BEHAVIOR_VIEWED]: DefineSurfaceRegionBehaviorType.#onBehaviorViewed,
   *   [REGION_EVENTS.BEHAVIOR_UNVIEWED]: DefineSurfaceRegionBehaviorType.#onBehaviorUnviewed,
   *   [REGION_EVENTS.REGION_BOUNDARY]: DefineSurfaceRegionBehaviorType.#onRegionBoundary
   * }
   * ```
   */
  static override events: Record<string, RegionBehaviorType.EventBehaviorStaticHandler>;

  /**
   * @remarks Invalidates the surfaces of the Scene and refreshes perception, planned movement paths, and culling as
   * necessary when the behavior is active and `system` changed.
   */
  protected override _onUpdate(
    changed: DefineSurfaceRegionBehaviorType.OnUpdateData,
    options: Document.Database.OnUpdateOptionsForName<"RegionBehavior">,
    userId: string,
  ): void;

  /**
   * Restricts darkness? Darkness is restricted if and only if light is restricted.
   */
  get darkness(): boolean;

  #DefineSurfaceRegionBehaviorType: true;
  static #DefineSurfaceRegionBehaviorTypeStatic: true;
}

export default DefineSurfaceRegionBehaviorType;
