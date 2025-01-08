import type RegionBehaviorType from "./base.d.mts";
import fields = foundry.data.fields;

declare namespace PauseGameRegionBehaviorType {
  interface Schema extends foundry.data.fields.DataSchema {
    /** Disable the behavior once a player-controlled Token enters the region? */
    once: fields.BooleanField;
  }
}

/** The data model for a behavior that pauses the game when a player-controlled Token enters the Region. */
declare class PauseGameRegionBehaviorType extends RegionBehaviorType<PauseGameRegionBehaviorType.Schema> {
  /** @defaultValue `["BEHAVIOR.TYPES.pauseGame", "BEHAVIOR.TYPES.base"]` */
  static override LOCALIZATION_PREFIXES: string[];

  static override defineSchema(): PauseGameRegionBehaviorType.Schema;

  /** Pause the game if a player-controlled Token moves into the Region. */
  static #onTokenMoveIn(this: PauseGameRegionBehaviorType, event: RegionDocument.RegionEvent): Promise<void>;

  /** Stop movement after a player-controlled Token enters the Region. */
  static #onTokenPreMove(this: PauseGameRegionBehaviorType, event: RegionDocument.RegionEvent): Promise<void>;

  static override events: Record<string, RegionBehaviorType.EventBehaviorStaticHandler>;
}

export default PauseGameRegionBehaviorType;