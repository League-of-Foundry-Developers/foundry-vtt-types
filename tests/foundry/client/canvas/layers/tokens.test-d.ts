import { describe, expectTypeOf, test } from "vitest";

import TokenLayer = foundry.canvas.layers.TokenLayer;
import PlaceablesLayer = foundry.canvas.layers.PlaceablesLayer;
import Token = foundry.canvas.placeables.Token;
import Canvas = foundry.canvas.Canvas;
import TokenHUD = foundry.applications.hud.TokenHUD;
import SceneControls = foundry.applications.ui.SceneControls;

declare const token: Token.Implementation;
declare const user: User.Implementation;
declare const pointerEvent: foundry.canvas.Canvas.Event.Pointer;
declare const wheelEvent: WheelEvent;
declare const dragEvent: DragEvent;
declare const combat: Combat.Implementation;
declare const keyboardEvent: KeyboardEvent;
declare const plannedMovement: TokenDocument.PlannedMovement;

describe("TokenLayer Tests", () => {
  test("Construction", () => {
    new TokenLayer();
  });

  const layer = new TokenLayer();

  test("Miscellaneous", () => {
    expectTypeOf(layer._rulerPaths).toEqualTypeOf<PIXI.Container>();
    expectTypeOf(layer._tabIndex).toEqualTypeOf<number | null>();
    expectTypeOf(layer._draggedToken).toEqualTypeOf<Token.Implementation | null>();
    expectTypeOf(layer._dragMovementAction).toEqualTypeOf<string | null>();

    expectTypeOf(layer.occlusionMode).toExtend<CONST.TOKEN_OCCLUSION_MODES>();
    layer.occlusionMode = CONST.TOKEN_OCCLUSION_MODES.OWNED; // Setter

    expectTypeOf(layer.hud).toEqualTypeOf<TokenHUD>();
    expectTypeOf(layer.ownedTokens).toEqualTypeOf<Token.Implementation[]>();
    expectTypeOf(layer.turnMarkers).toEqualTypeOf<Set<Token.Implementation>>();

    expectTypeOf(layer["_draw"]({})).toEqualTypeOf<Promise<void>>();
    expectTypeOf(layer["_tearDown"]({})).toEqualTypeOf<Promise<void>>();
    expectTypeOf(layer["_activate"]()).toBeVoid();
    expectTypeOf(layer["_deactivate"]()).toBeVoid();

    expectTypeOf(layer.cycleTokens()).toEqualTypeOf<Token.Implementation | null>();
    expectTypeOf(layer.cycleTokens(true, false)).toEqualTypeOf<Token.Implementation | null>();
    expectTypeOf(layer.cycleTokens(undefined, undefined)).toEqualTypeOf<Token.Implementation | null>();

    expectTypeOf(layer.concludeAnimation()).toBeVoid();

    expectTypeOf(layer["_getOccludableTokens"]()).toEqualTypeOf<Token.Implementation[]>();

    expectTypeOf(layer["_getMovableObjects"]()).toEqualTypeOf<Token.Implementation[]>();
    expectTypeOf(layer["_getMovableObjects"](["TTTTTSomeIDTTTTTT"])).toEqualTypeOf<Token.Implementation[]>();
    expectTypeOf(layer["_getMovableObjects"](["TTTTTSomeIDTTTTTT"], true)).toEqualTypeOf<Token.Implementation[]>();

    expectTypeOf(layer["_getOccludableTokens"]()).toEqualTypeOf<Token.Implementation[]>();

    expectTypeOf(layer.storeHistory("create", [{ _id: "TTTTTSomeIDTTTTT" }])).toBeVoid();
    expectTypeOf(
      layer.storeHistory("update", [{ _id: "TTTTTSomeIDTTTTT" }], {
        movement: {
          TTTTTSomeIDTTTTT: {
            method: "dragging",
            constrainOptions: { ignoreCost: true, ignoreWalls: false },
            waypoints: [],
          },
        },
      }),
    ).toBeVoid();

    expectTypeOf(layer["_onCycleViewKey"](keyboardEvent)).toBeBoolean();

    expectTypeOf(layer["_confirmDeleteKey"]([token.document])).toEqualTypeOf<Promise<boolean | null>>();

    expectTypeOf(TokenLayer.prepareSceneControls()).toEqualTypeOf<SceneControls.Control>();

    expectTypeOf(layer["_highlightObjects"](true)).toBeVoid();
  });

  test("Coordinates and movement", () => {
    expectTypeOf(layer.getSnappedPoint({ x: 4, y: 5 })).toEqualTypeOf<Canvas.Point>();

    expectTypeOf(layer["_prepareKeyboardMovementUpdates"]([token], -1, 0, 1)).toEqualTypeOf<
      PlaceablesLayer.PreparedUpdates<"Token">
    >();

    expectTypeOf(layer.recalculatePlannedMovementPaths()).toBeVoid();

    expectTypeOf(layer._updatePlannedMovements(user, null)).toBeVoid();
    expectTypeOf(
      layer._updatePlannedMovements(user, {
        TTTTTSomeIDTTTTT: plannedMovement,
      }),
    ).toBeVoid();
  });

  test("Necessary type overrides", () => {
    expectTypeOf(TokenLayer.documentName).toEqualTypeOf<"Token">();
    expectTypeOf(TokenLayer.instance).toEqualTypeOf<TokenLayer.Implementation | undefined>();

    expectTypeOf(TokenLayer.layerOptions).toEqualTypeOf<TokenLayer.LayerOptions>();
    expectTypeOf(TokenLayer.layerOptions.name).toEqualTypeOf<"tokens">();
    expectTypeOf(TokenLayer.layerOptions.objectClass).toEqualTypeOf<Token.ImplementationClass>();

    expectTypeOf(layer.options.objectClass).toEqualTypeOf<Token.ImplementationClass>();
    expectTypeOf(layer.options).toEqualTypeOf<TokenLayer.LayerOptions>();
    expectTypeOf(layer.options.name).toEqualTypeOf<"tokens">();

    expectTypeOf(layer.hookName).toEqualTypeOf<"TokenLayer">();
  });

  test("Targeting", () => {
    expectTypeOf(layer.targetObjects({ x: 0, y: 0, width: 500, height: 500 })).toBeNumber();
    expectTypeOf(
      layer.targetObjects({ x: 0, y: 0, width: 500, height: 500 }, { releaseOthers: undefined }),
    ).toBeNumber();
    expectTypeOf(layer.targetObjects({ x: 0, y: 0, width: 500, height: 500 }, { releaseOthers: true })).toBeNumber();

    expectTypeOf(layer.setTargets(["TTTTTSomeIDTTTTT"])).toBeVoid();
    expectTypeOf(layer.setTargets(["TTTTTSomeIDTTTTT"], { mode: "acquire" })).toBeVoid();
  });

  test("Event handlers", () => {
    expectTypeOf(
      layer["_onDropActorData"](dragEvent, {
        type: "Actor",
        uuid: "SomeUUID",
        x: 20,
        y: 30000,
        elevation: 20,
      }),
    ).toEqualTypeOf<
      Promise<foundry.applications.ui.Notifications.Notification<"warning"> | false | TokenDocument.Implementation>
    >();

    expectTypeOf(layer["_onClickLeft"](pointerEvent)).toBeVoid();
    expectTypeOf(layer["_onClickLeft2"](pointerEvent)).toBeVoid();
    expectTypeOf(layer["_onClickRight"](pointerEvent)).toBeVoid();
    expectTypeOf(layer["_onClickRight2"](pointerEvent)).toBeVoid();

    expectTypeOf(layer["_onDragLeftCancel"](pointerEvent)).toBeVoid();

    expectTypeOf(layer["_onMouseWheel"](wheelEvent)).toEqualTypeOf<Promise<Token.Implementation[]> | void>();
  });

  test("Deprecated", () => {
    // Deprecated since v12, until v14
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(layer.gridPrecision).toEqualTypeOf<1>();
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(layer.toggleCombat()).toEqualTypeOf<Promise<Combatant.Implementation[]>>();
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(layer.toggleCombat(false, null, { token: null })).toEqualTypeOf<Promise<Combatant.Implementation[]>>();
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(layer.toggleCombat(true, combat, { token: token })).toEqualTypeOf<
      Promise<Combatant.Implementation[]>
    >();
  });
});
