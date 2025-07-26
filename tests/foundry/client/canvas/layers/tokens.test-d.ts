import { expectTypeOf } from "vitest";
import { TokenLayer } from "#client/canvas/layers/_module.mjs";
import type { Token } from "#client/canvas/placeables/_module.d.mts";

import Canvas = foundry.canvas.Canvas;
import TokenHUD = foundry.applications.hud.TokenHUD;

expectTypeOf(TokenLayer.documentName).toEqualTypeOf<"Token">();
expectTypeOf(TokenLayer.instance).toEqualTypeOf<TokenLayer | undefined>();
expectTypeOf(TokenLayer.layerOptions).toEqualTypeOf<TokenLayer.LayerOptions>();
expectTypeOf(TokenLayer.layerOptions.name).toEqualTypeOf<"tokens">();
expectTypeOf(TokenLayer.layerOptions.objectClass).toEqualTypeOf<Token.ImplementationClass>();

const layer = new TokenLayer();

expectTypeOf(layer.options.objectClass).toEqualTypeOf<Token.ImplementationClass>();
expectTypeOf(layer.options).toEqualTypeOf<TokenLayer.LayerOptions>();
expectTypeOf(layer.options.name).toEqualTypeOf<"tokens">();

expectTypeOf(layer["_tabIndex"]).toEqualTypeOf<number | null>();
expectTypeOf(layer.occlusionMode).toExtend<foundry.CONST.OCCLUSION_MODES>();
layer.occlusionMode = CONST.OCCLUSION_MODES.RADIAL;
expectTypeOf(layer.hookName).toEqualTypeOf<"TokenLayer">();
expectTypeOf(layer.hud).toEqualTypeOf<TokenHUD>();
expectTypeOf(layer.ownedTokens).toEqualTypeOf<Token.Implementation[]>();
expectTypeOf(layer.getSnappedPoint({ x: 4, y: 5 })).toEqualTypeOf<Canvas.Point>();

expectTypeOf(layer["_draw"]({})).toEqualTypeOf<Promise<void>>();
expectTypeOf(layer["_tearDown"]({})).toEqualTypeOf<Promise<void>>();
expectTypeOf(layer["_activate"]()).toBeVoid();
expectTypeOf(layer["_deactivate"]()).toBeVoid();

declare const someToken: Token.Implementation;

expectTypeOf(layer["_getMovableObjects"]()).toEqualTypeOf<Token.Implementation[]>();
expectTypeOf(layer["_getMovableObjects"](null, null)).toEqualTypeOf<Token.Implementation[]>();
expectTypeOf(layer["_getMovableObjects"](["id1", "id2"], false)).toEqualTypeOf<Token.Implementation[]>();

expectTypeOf(layer.targetObjects({ x: 0, y: 0, width: 500, height: 500 })).toBeNumber();
expectTypeOf(layer.targetObjects({ x: 0, y: 0, width: 500, height: 500 }, { releaseOthers: null })).toBeNumber();
expectTypeOf(layer.targetObjects({ x: 0, y: 0, width: 500, height: 500 }, { releaseOthers: true })).toBeNumber();

expectTypeOf(layer.cycleTokens()).toEqualTypeOf<Token.Implementation | null>();
expectTypeOf(layer.cycleTokens(true, false)).toEqualTypeOf<Token.Implementation | null>();
expectTypeOf(layer.cycleTokens(undefined, null)).toEqualTypeOf<Token.Implementation | null>();

expectTypeOf(layer["_getCycleOrder"]()).toEqualTypeOf<Token.Implementation[]>();
expectTypeOf(layer.concludeAnimation()).toBeVoid();
expectTypeOf(layer["_getOccludableTokens"]()).toEqualTypeOf<Token.Implementation[]>();

// `storeHistory` tests omitted due to current breakage of document `.toObject()` typing
// The override does not change the signature, so they'd be redundant over the `PlaceablesLayer` tests in any case

declare const pointerEvent: foundry.canvas.Canvas.Event.Pointer;
declare const someWheelEvent: WheelEvent;
declare const someDragEvent: DragEvent;
expectTypeOf(
  layer["_onDropActorData"](someDragEvent, {
    type: "Actor",
    uuid: "SomeUUID",
    x: 20,
    y: 30000,
  }),
).toEqualTypeOf<
  Promise<foundry.applications.ui.Notifications.Notification<"warning"> | false | TokenDocument.Implementation>
>();
expectTypeOf(layer["_onClickLeft"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_onMouseWheel"](someWheelEvent)).toEqualTypeOf<Promise<Token.Implementation[] | void>>();

// deprecated since v12, until v14
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(layer.gridPrecision).toEqualTypeOf<1>();
declare const someCombat: Combat.Implementation;
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(layer.toggleCombat()).toEqualTypeOf<Promise<Combatant.Implementation[]>>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(layer.toggleCombat(null, null, { token: null })).toEqualTypeOf<Promise<Combatant.Implementation[]>>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(layer.toggleCombat(true, someCombat, { token: someToken })).toEqualTypeOf<
  Promise<Combatant.Implementation[]>
>();
