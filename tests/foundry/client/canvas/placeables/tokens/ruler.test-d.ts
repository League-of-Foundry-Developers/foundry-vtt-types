import { describe, expectTypeOf, test } from "vitest";
import type { DeepReadonly } from "fvtt-types/utils";

import TokenRuler = foundry.canvas.placeables.tokens.TokenRuler;
import Ruler = foundry.canvas.interaction.Ruler;
import Token = foundry.canvas.placeables.Token;

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
    const teleport = { ...CONFIG.Token.movement.actions["blink"], label: "TOKEN.MOVEMENT.ACTIONS.teleport.label" };
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
    const context: DrawSteelTokenRuler.WaypointContext | void = super._getWaypointLabelContext(waypoint, state);

    if (!this.token.inCombat) return context;

    state.segmentWaypoints.push(waypoint);

    if (!context) return;

    const _points = this.token.document.getCompleteMovementPath(state.segmentWaypoints);

    const startedNear = state.endPointEnemies;
    // Actual code has some Token Document methods to fetch relevant info, not included in test to reduce scope
    const endPointEnemies = new Set<TokenDocument.Implementation>();
    const passedBy = new Set<TokenDocument.Implementation>().union(startedNear);
    const delta = waypoint.actionConfig.teleport ? 0 : passedBy.difference(endPointEnemies).size;
    const strikes = {
      delta,
      total: delta + state.strikes.total,
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
  #speedValueStyle(style: Ruler.SegmentStyle | TokenRuler.GridHighlightStyle, waypoint: TokenRuler.Waypoint) {
    // color order
    const colors = [0x33bc4e, 0xf1d836, 0xe72124] as const;

    if (waypoint.actionConfig.teleport) {
      // actual code calls a token document getter
      const movementTypes = new Set(["strings"]);
      if (!movementTypes.has("teleport")) return style;
      const value =
        (foundry.utils.getProperty(this, "token.document.actor.system.movement.teleport") as number | null) ?? 0;
      const index = waypoint.cost > value ? 2 : 0;
      style.color = colors[index];
    } else {
      const value =
        (foundry.utils.getProperty(this, "token.document.actor.system.movement.value") as number | null) ?? Infinity;
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
declare const token: Token.Implementation;
declare const mmw: TokenDocument.MeasuredMovementWaypoint;
declare const pm: TokenDocument.PlannedMovement;

const rulerWaypoint = {
  action: "displace",
  actionConfig: { label: "foo" },
  center: new PIXI.Point(50, 50),
  checkpoint: true,
  cost: 1,
  elevation: 0,
  explicit: true,
  height: 1,
  hidden: false,
  index: 1,
  intermediate: false,
  measurement: { backward: null, forward: null, cost: 1, diagonals: 0, distance: 1, euclidean: 1, spaces: 1 },
  movementId: "ARandomIDForTest",
  next: null,
  previous: null,
  ray: new foundry.canvas.geometry.Ray({ x: 50, y: 50 }, { x: 100, y: 50 }),
  shape: CONST.TOKEN_SHAPES.RECTANGLE_1,
  size: { width: 100, height: 100 },
  snapped: true,
  stage: "planned",
  terrain: null,
  unreachable: false,
  userId: "ARandomIDForTest",
  width: 1,
  x: 0,
  y: 0,
} satisfies TokenRuler.Waypoint;

describe("TokenRuler Tests", async () => {
  test("Construction", () => {
    expectTypeOf(new TokenRuler(token)).toEqualTypeOf<TokenRuler>();
  });

  const tr = new TokenRuler(token);

  test("BaseTokenRuler getters", () => {
    expectTypeOf(tr.token).toEqualTypeOf<Token.Implementation>();
    expectTypeOf(tr.visible).toBeBoolean();
    tr.visible = true; // Setter
    expectTypeOf(tr.isVisible).toBeBoolean();
  });

  test("BaseTokenRuler abstract methods", async () => {
    expectTypeOf(tr["_onVisibleChange"]()).toBeVoid();
    expectTypeOf(await tr.draw()).toBeVoid();
    expectTypeOf(tr.clear()).toBeVoid();
    expectTypeOf(tr.destroy()).toBeVoid();
    expectTypeOf(
      tr.refresh({
        passedWaypoints: [mmw],
        pendingWaypoints: [mmw],
        plannedMovement: { ARandomIDForTest: pm },
      }),
    ).toBeVoid();
  });

  test("Context and Style", () => {
    expectTypeOf(tr["_getWaypointLabelContext"](rulerWaypoint, {})).toEqualTypeOf<TokenRuler.WaypointContext | void>();
    expectTypeOf(
      tr["_getWaypointLabelContext"](rulerWaypoint, { hasElevation: true, initialized: true, previousElevation: 0 }),
    ).toEqualTypeOf<TokenRuler.WaypointContext | void>();

    expectTypeOf(tr["_getWaypointStyle"](rulerWaypoint)).toEqualTypeOf<Ruler.WaypointStyle>();
    expectTypeOf(tr["_getSegmentStyle"](rulerWaypoint)).toEqualTypeOf<Ruler.SegmentStyle>();
    expectTypeOf(
      tr["_getGridHighlightStyle"](rulerWaypoint, { i: 0, j: 1, k: 0 }),
    ).toEqualTypeOf<TokenRuler.GridHighlightStyle>();
  });
});
