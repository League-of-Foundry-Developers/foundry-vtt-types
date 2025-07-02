// import { expectTypeOf } from "vitest";
import type { TokenRuler } from "#client/canvas/placeables/tokens/_module.mjs";
import type { DeepReadonly } from "#utils";

/**
 * Draw Steel implementation of the core token ruler
 */
class DrawSteelTokenRuler extends foundry.canvas.placeables.tokens.TokenRuler {
  static override WAYPOINT_LABEL_TEMPLATE = "templates/hud/waypoint-label.hbs";

  /* -------------------------------------------------- */

  /**
   * Helper function called in `init` hook
   * @internal
   */
  static applyDSMovementConfig() {
    // Adjusting `Blink (Teleport)` to just be Teleport and maintain its use elsewhere
    const teleport = { ...CONFIG.Token.movement.actions.blink, label: "TOKEN.MOVEMENT.ACTIONS.teleport.label" };
    foundry.utils.mergeObject(
      CONFIG.Token.movement.actions,
      {
        "-=blink": null,
        teleport,
        burrow: {
          getCostFunction: (
            _token: TokenDocument.Implementation,
            _options: foundry.canvas.placeables.Token.MeasureMovementPathOptions,
          ) => {
            return (cost: number) => cost * 3;
          },
        },
        climb: {
          canSelect: (token: TokenDocument.Implementation | foundry.data.PrototypeToken) =>
            // eslint-disable-next-line no-restricted-syntax
            !(token instanceof TokenDocument) || !token.hasStatusEffect("prone"),
          getCostFunction: (
            _token: TokenDocument.Implementation,
            _options: foundry.canvas.placeables.Token.MeasureMovementPathOptions,
          ) => {
            return (cost: number) => cost * 2;
          },
        },
        crawl: {
          canSelect: (token: TokenDocument.Implementation | foundry.data.PrototypeToken) =>
            // eslint-disable-next-line no-restricted-syntax
            token instanceof TokenDocument && token.hasStatusEffect("prone"),
        },
        fly: {
          canSelect: (token: TokenDocument.Implementation | foundry.data.PrototypeToken) =>
            // eslint-disable-next-line no-restricted-syntax
            !(token instanceof TokenDocument) || !token.hasStatusEffect("prone"),
        },
        jump: {
          canSelect: (token: TokenDocument.Implementation | foundry.data.PrototypeToken) =>
            // eslint-disable-next-line no-restricted-syntax
            !(token instanceof TokenDocument) || !token.hasStatusEffect("prone"),
          // default for jump is cost * 2
          getCostFunction: () => (cost: number) => cost,
        },
        swim: {
          canSelect: (token: TokenDocument.Implementation | foundry.data.PrototypeToken) =>
            // eslint-disable-next-line no-restricted-syntax
            !(token instanceof TokenDocument) || !token.hasStatusEffect("prone"),
          getCostFunction: (
            _token: TokenDocument.Implementation,
            _options: foundry.canvas.placeables.Token.MeasureMovementPathOptions,
          ) => {
            return (cost: number) => cost * 2;
          },
        },
        walk: {
          canSelect: (token: TokenDocument.Implementation | foundry.data.PrototypeToken) =>
            // eslint-disable-next-line no-restricted-syntax
            !(token instanceof TokenDocument) || !token.hasStatusEffect("prone"),
        },
      },
      { performDeletions: true },
    );
  }

  override _getWaypointLabelContext(
    waypoint: TokenRuler.Waypoint,
    state: DrawSteelTokenRuler.State,
  ): DrawSteelTokenRuler.WaypointContext | void {
    const context = super._getWaypointLabelContext(waypoint, state) as DrawSteelTokenRuler.WaypointContext | void;

    if (!this.token.inCombat) return context;

    state.segmentWaypoints ??= [];
    state.segmentWaypoints.push(waypoint);

    if (!context) return;

    const _points = this.token.document.getCompleteMovementPath(state.segmentWaypoints);

    const startedNear = state.endPointEnemies ?? new Set();
    // Actual code has some Token Document methods to fetch relevant info, not included in test to reduce scope
    const endPointEnemies = new Set<TokenDocument.Implementation>();
    const passedBy = new Set<TokenDocument.Implementation>().union(startedNear);
    const delta = waypoint.actionConfig.teleport ? 0 : passedBy.difference(endPointEnemies).size;
    const strikes = {
      delta,
      total: delta + (state.strikes?.total ?? 0),
    };

    state.endPointEnemies = endPointEnemies;
    state.strikes = strikes;
    state.segmentWaypoints = [waypoint];
    context.strikes = strikes;

    return context;
  }

  override _getSegmentStyle(waypoint: TokenRuler.Waypoint) {
    const style = super._getSegmentStyle(waypoint);
    this.#speedValueStyle(style, waypoint);
    return style;
  }

  override _getGridHighlightStyle(waypoint: TokenRuler.Waypoint, offset: DeepReadonly<foundry.grid.BaseGrid.Offset3D>) {
    const style = super._getGridHighlightStyle(waypoint, offset);
    this.#speedValueStyle(style, waypoint);
    return style;
  }

  /**
   * Adjusts the grid or segment style based on the token's movement characteristics
   * @param style    - The calculated style properties from the parent class
   * @param waypoint - The waypoint being adjusted
   */
  #speedValueStyle(style: TokenRuler.SegmentStyle | TokenRuler.GridHighlightStyle, waypoint: TokenRuler.Waypoint) {
    // color order
    const colors = [0x33bc4e, 0xf1d836, 0xe72124] as const;

    if (waypoint.actionConfig.teleport) {
      // actual code calls a token document getter
      const movementTypes = new Set(["strings"]);
      if (!movementTypes.has("teleport")) return style;
      const value = (foundry.utils.getProperty(this, "token.document.actor.system.movement.teleport") as number) ?? 0;
      const index = waypoint.cost > value ? 2 : 0;
      style.color = colors[index];
    } else {
      const value =
        (foundry.utils.getProperty(this, "token.document.actor.system.movement.value") as number) ?? Infinity;
      // Total cost, up to 1x is green, up to 2x is yellow, over that is red
      const index = Math.clamp(Math.floor((waypoint.measurement.cost - 1) / value), 0, 2) as 0 | 2;
      style.color = colors[index];
    }
  }
}

declare namespace DrawSteelTokenRuler {
  interface Strikes {
    delta: number;
    total: number;
  }

  interface State extends TokenRuler.State {
    segmentWaypoints: TokenRuler.Waypoint[];
    endPointEnemies: Set<TokenDocument.Implementation>;
    strikes: Strikes;
  }

  interface WaypointContext extends TokenRuler.WaypointContext {
    strikes?: Strikes;
  }
}

declare const _testRuler: DrawSteelTokenRuler;
