import type { Identity } from "#utils";
import type { Token } from "#client/canvas/placeables/_module.d.mts";
import type { SpriteMesh } from "#client/canvas/containers/_module.d.mts";
import type { TurnMarkerData } from "#client/canvas/placeables/tokens/_module.d.mts";

declare class TokenTurnMarker extends PIXI.Container<SpriteMesh> {
  constructor(token: Token.Implementation);

  /**
   * The Token who this Turn Marker belongs to.
   */
  get token(): Token.Implementation;

  /**
   * The sprite of the Turn Marker.
   * @remarks Only `undefined` prior to first draw.
   */
  mesh: SpriteMesh | undefined;

  /**
   * The animation configuration of the Turn Marker.
   * @defaultValue
   * ```js
   * {
   *   spin: 0,
   *   pulse: {
   *     speed: 0,
   *     min: 1,
   *     max: 1
   *   }
   * }
   * ```
   * @remarks The default only differs from the schema defaults in `pulse.min` being `1` instead of `0.8`.
   * @privateRemarks Technically `ConfigData` has `shader` as a required prop, but `| undefined`; close enough.
   */
  animation: TurnMarkerData.ConfigData;

  /**
   * Draw the Turn Marker.
   */
  draw(): Promise<void>;

  /**
   * Animate the Turn Marker.
   * @param deltaTime -The delta time
   * @remarks Ultimately called every canvas tick via `TokenLayer##animate` -\> `TokenLayer##animateTurnMarkers`
   */
  animate(deltaTime: number): void;

  #TokenTurnMarker: true;
}

declare namespace TokenTurnMarker {
  interface Any extends AnyTokenTurnMarker {}
  interface AnyConstructor extends Identity<typeof AnyTokenTurnMarker> {}
}

export default TokenTurnMarker;

declare abstract class AnyTokenTurnMarker extends TokenTurnMarker {
  constructor(...args: never);
}
