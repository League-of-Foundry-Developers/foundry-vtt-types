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
  /** @defaultValue `["BEHAVIOR.TYPES.teleportToken", "BEHAVIOR.TYPES.base"]` */
  static override LOCALIZATION_PREFIXES: string[];

  static override defineSchema(): TeleportTokenRegionBehaviorType.Schema;

  /** Teleport the Token if it moves into the Region. */
  static #onTokenMoveIn(this: TeleportTokenRegionBehaviorType, event: RegionDocument.RegionEvent): Promise<void>;

  /** Stop movement after a Token enters the Region. */
  static #onTokenPreMove(this: TeleportTokenRegionBehaviorType, event: RegionDocument.RegionEvent): Promise<void>;

  static override events: Record<string, RegionBehaviorType.EventBehaviorStaticHandler>;

  /**
   * Should the current user teleport the token?
   * @param token           - The token that is teleported.
   * @param destination     - The destination region.
   * @param user            - The user that moved the token.
   * @returns               - Should the current user teleport the token?
   */
  static #shouldTeleport(
    token: TokenDocument.ConfiguredInstance,
    destination: RegionDocument.ConfiguredInstance,
    user: User.ConfiguredInstance,
  ): boolean;

  /**
   * Get a destination for the Token within the Region that places the token and its center point inside it.
   * @param region      - The region that is the destination of the teleportation.
   * @param token       - The token that is teleported.
   * @returns           - The destination.
   */
  static #getDestinatino(
    region: RegionDocument.ConfiguredInstance,
    token: TokenDocument.ConfiguredInstance,
  ): { x: number; y: number; elevation: number };

  /**
   * Activate the Socket event listeners.
   * @param socket      - The active game socket
   * @internal
   */
  static _activateSocketListeners(socket: WebSocket): void;

  /**
   * Handle the socket event that handles teleporation confirmation.
   * @param data                      - The socket data.
   * @param ack                       - The acknowledgement function to return the result of the confirmation to the server.
   */
  static #onSocketEvent(
    {
      behaviorUuid,
      tokenUuid,
    }: {
      /** The UUID of the Token that is teleported. */
      behaviorUuid: string;
      /** The UUID of the Region that is the destination of the teleportation. */
      tokenUuid: string;
    },
    ack: (continued: boolean) => void,
  ): Promise<void>;

  /**
   * Display a dialog to confirm the teleportation?
   * @param token           - The token that is teleported.
   * @param destination     - The destination region.
   * @returns               - The result of the dialog.
   */
  static #confirmDialog(
    token: TokenDocument.ConfiguredInstance,
    destination: RegionDocument.ConfiguredInstance,
  ): Promise<boolean>;
}

export default TeleportTokenRegionBehaviorType;
