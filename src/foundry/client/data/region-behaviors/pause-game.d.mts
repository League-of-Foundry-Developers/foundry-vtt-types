import type RegionBehaviorType from "./base.d.mts";
import fields = foundry.data.fields;

declare namespace PauseGameRegionBehaviorType {
  interface Schema extends foundry.data.fields.DataSchema {
    /** Disable the behavior once a player-controlled Token enters the region? */
    once: fields.BooleanField;
  }
}

/**
 * The data model for a behavior that pauses the game when a player-controlled Token enters the Region.
 */
declare class PauseGameRegionBehaviorType extends RegionBehaviorType<PauseGameRegionBehaviorType.Schema> {
  /** @defaultValue `["BEHAVIOR.TYPES.pauseGame", "BEHAVIOR.TYPES.base"]` */
  static override LOCALIZATION_PREFIXES: string[];

  static override defineSchema(): PauseGameRegionBehaviorType.Schema;

  /**
   * @defaultValue
   * ```js
   * {
   *   [REGION_EVENTS.TOKEN_MOVE_IN]: PauseGameRegionBehaviorType.#onTokenMoveIn
   * }
   * ```
   */
  static override events: Record<string, RegionBehaviorType.EventBehaviorStaticHandler>;

  static #PauseGameRegionBehaviorType: true;
}

export default PauseGameRegionBehaviorType;
