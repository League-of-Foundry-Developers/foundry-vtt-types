import type RegionBehaviorType from "./base.d.mts";
import fields = foundry.data.fields;

declare namespace TeleportTokenRegionBehaviorType {
  interface Schema extends foundry.data.fields.DataSchema {
    /** The destination Region the Token is teleported to. */
    destination: fields.DocumentUUIDField<{ type: "Region" }>;

    choice: fields.BooleanField;
  }
}

/** The data model for a behavior that teleports Token that enter the Region to a preset destination Region. */
declare class TeleportTokenRegionBehaviorType extends RegionBehaviorType<TeleportTokenRegionBehaviorType.Schema> {
  #teleportTokenRegionBehavior: true;

  /** @defaultValue `["BEHAVIOR.TYPES.teleportToken", "BEHAVIOR.TYPES.base"]` */
  static override LOCALIZATION_PREFIXES: string[];

  static override defineSchema(): TeleportTokenRegionBehaviorType.Schema;

  static override events: Record<string, RegionBehaviorType.EventBehaviorStaticHandler>;

  /**
   * Activate the Socket event listeners.
   * @param socket      - The active game socket
   * @internal
   */
  protected static _activateSocketListeners(socket: WebSocket): void;
}

export default TeleportTokenRegionBehaviorType;
