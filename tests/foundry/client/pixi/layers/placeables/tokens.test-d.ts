import { expectTypeOf } from "vitest";
import type Document from "../../../../../../src/foundry/common/abstract/document.d.mts";

expectTypeOf(TokenLayer.documentName).toEqualTypeOf<"Token">();
expectTypeOf(TokenLayer.instance).toEqualTypeOf<TokenLayer | undefined>();
expectTypeOf(TokenLayer.layerOptions).toEqualTypeOf<TokenLayer.LayerOptions>();
expectTypeOf(TokenLayer.layerOptions.name).toEqualTypeOf<"tokens">();
expectTypeOf(TokenLayer.layerOptions.objectClass).toEqualTypeOf<typeof Token>();

const layer = new TokenLayer();

expectTypeOf(layer.options.objectClass).toEqualTypeOf<typeof Token>();
expectTypeOf(layer.options).toEqualTypeOf<TokenLayer.LayerOptions>();
expectTypeOf(layer.options.name).toEqualTypeOf<"tokens">();

expectTypeOf(layer["_tabIndex"]).toEqualTypeOf<number | null>();
expectTypeOf(layer.occlusionMode).toMatchTypeOf<foundry.CONST.OCCLUSION_MODES>();
layer.occlusionMode = CONST.OCCLUSION_MODES.RADIAL;
expectTypeOf(layer.hookName).toEqualTypeOf<"TokenLayer">();
expectTypeOf(layer.hud).toEqualTypeOf<TokenHUD>();
expectTypeOf(layer.ownedTokens).toEqualTypeOf<Token.Object[]>();
expectTypeOf(layer.getSnappedPoint({ x: 4, y: 5 })).toEqualTypeOf<Canvas.Point>();

expectTypeOf(layer["_draw"]({})).toEqualTypeOf<Promise<void>>();
expectTypeOf(layer["_tearDown"]({})).toEqualTypeOf<Promise<void>>();
expectTypeOf(layer["_activate"]()).toBeVoid();
expectTypeOf(layer["_deactivate"]()).toBeVoid();

declare const someToken: Token.Object;
declare const somePoint: PIXI.Point;
expectTypeOf(layer["_pasteObject"](someToken, somePoint)).toEqualTypeOf<Document.ConfiguredSourceForName<"Token">>();
expectTypeOf(layer["_pasteObject"](someToken, somePoint, { hidden: true, snap: false })).toEqualTypeOf<
  Document.ConfiguredSourceForName<"Token">
>();
expectTypeOf(layer["_pasteObject"](someToken, somePoint, { hidden: undefined, snap: null })).toEqualTypeOf<
  Document.ConfiguredSourceForName<"Token">
>();

expectTypeOf(layer["_getMovableObjects"]()).toEqualTypeOf<Token.Object[]>();
expectTypeOf(layer["_getMovableObjects"](null, null)).toEqualTypeOf<Token.Object[]>();
expectTypeOf(layer["_getMovableObjects"](["id1", "id2"], false)).toEqualTypeOf<Token.Object[]>();

expectTypeOf(layer.targetObjects({ x: 0, y: 0, width: 500, height: 500 })).toBeNumber();
expectTypeOf(layer.targetObjects({ x: 0, y: 0, width: 500, height: 500 }, { releaseOthers: null })).toBeNumber();
expectTypeOf(layer.targetObjects({ x: 0, y: 0, width: 500, height: 500 }, { releaseOthers: true })).toBeNumber();

expectTypeOf(layer.cycleTokens()).toEqualTypeOf<Token.Object | null>();
expectTypeOf(layer.cycleTokens(true, false)).toEqualTypeOf<Token.Object | null>();
expectTypeOf(layer.cycleTokens(undefined, null)).toEqualTypeOf<Token.Object | null>();

expectTypeOf(layer["_getCycleOrder"]()).toEqualTypeOf<Token.Object[]>();
expectTypeOf(layer.concludeAnimation()).toBeVoid();
expectTypeOf(layer["_getOccludableTokens"]()).toEqualTypeOf<Token.Object[]>();

// `storeHistory` tests omitted due to current breakage of document `.toObject()` typing
// The override does not change the signature, so they'd be redundant over the `PlaceablesLayer` tests in any case

declare const someEvent: PIXI.FederatedEvent;
declare const someWheelEvent: WheelEvent;
declare const someDragEvent: DragEvent;
expectTypeOf(
  layer["_onDropActorData"](someDragEvent, {
    type: "Actor",
    uuid: "SomeUUID",
    x: 20,
    y: 30000,
  }),
).toEqualTypeOf<Promise<number | false | TokenDocument.Implementation>>();
expectTypeOf(layer["_onClickLeft"](someEvent)).toBeVoid();
expectTypeOf(layer["_onMouseWheel"](someWheelEvent)).toEqualTypeOf<Promise<Token.Object[] | void>>();

//deprecated since v12, until v14
expectTypeOf(layer.gridPrecision).toEqualTypeOf<1>();
declare const someCombat: Combat.ConfiguredInstance;
expectTypeOf(layer.toggleCombat()).toEqualTypeOf<Promise<Combatant.ConfiguredInstance[]>>();
expectTypeOf(layer.toggleCombat(null, null, { token: null })).toEqualTypeOf<Promise<Combatant.ConfiguredInstance[]>>();
expectTypeOf(layer.toggleCombat(true, someCombat, { token: someToken })).toEqualTypeOf<
  Promise<Combatant.ConfiguredInstance[]>
>();
