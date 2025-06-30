import type { Identity } from "#utils";

/**
 * The ruler of a Token visualizes
 *   - the movement history of the Token,
 *   - the movement path the Token currently animating along, and
 *   - the planned movement path while the Token is being dragged.
 */
declare abstract class BaseTokenRuler {
  #BaseTokenRuler: true;

  /**
   *
   * @param token - The Token that this ruler belongs to
   */
  constructor(token: foundry.canvas.placeables.Token.Implementation);

  /**
   * The reference to the Token this ruler belongs to.
   */
  get token(): foundry.canvas.placeables.Token.Implementation;

  /**
   * Is the ruler visible?
   * @defaultValue `false`
   */
  get visible(): boolean;

  set visible(value);

  /**
   * Called when the ruler becomes visible or invisible.
   */
  protected abstract _onVisibleChange(): void;

  /**
   * Is the ruler supposed to be visible?
   * {@link BaseTokenRuler#visible} is set to {@link BaseTokenRuler#isVisible} in
   * {@link foundry.canvas.placeables.Token#_refreshState}.
   */
  get isVisible(): boolean;

  /**
   * Draw the ruler.
   * Called in {@link foundry.canvas.placeables.Token#_draw}.
   */
  abstract draw(): Promise<void>;

  /**
   * Clear the ruler.
   * Called in {@link foundry.canvas.placeables.Token#clear}.
   */
  abstract clear(): void;

  /**
   * Destroy the ruler.
   * Called in {@link foundry.canvas.placeables.Token#_destroy}.
   */
  abstract destroy(): void;

  /**
   * Refresh the ruler.
   * Called in {@link foundry.canvas.placeables.Token#_refreshRuler}.
   */
  abstract refresh(rulerData: unknown): void;
}

declare namespace BaseTokenRuler {
  interface Any extends AnyBaseTokenRuler {}
  interface AnyConstructor extends Identity<typeof AnyBaseTokenRuler> {}
}

export default BaseTokenRuler;

declare abstract class AnyBaseTokenRuler extends BaseTokenRuler {
  constructor(...args: never);
}
