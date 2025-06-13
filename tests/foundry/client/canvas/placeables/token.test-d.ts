import { test, expectTypeOf } from "vitest";
import { Token, Region } from "#client/canvas/placeables/_module.mjs";
import type { TokenRing } from "#client/canvas/placeables/tokens/_module.d.mts";

expectTypeOf(Token.embeddedName).toEqualTypeOf<"Token">();
expectTypeOf(Token.RENDER_FLAGS.redraw.propagate).toEqualTypeOf<
  | Array<
      | "redrawEffects"
      | "refresh"
      | "refreshState"
      | "refreshVisibility"
      | "refreshTransform"
      | "refreshPosition"
      | "refreshRotation"
      | "refreshSize"
      | "refreshElevation"
      | "refreshMesh"
      | "refreshShader"
      | "refreshShape"
      | "refreshBorder"
      | "refreshBars"
      | "refreshEffects"
      | "refreshNameplate"
      | "refreshTarget"
      | "refreshTooltip"
      | "refreshRingVisuals"
    >
  | undefined
>();

declare const doc: TokenDocument.Stored;
const token = new CONFIG.Token.objectClass(doc);

expectTypeOf(token.controlIcon).toBeNull();
expectTypeOf(token.shape).toEqualTypeOf<PIXI.Rectangle | PIXI.Polygon | undefined>();
expectTypeOf(token.detectionFilter).toEqualTypeOf<PIXI.Filter | null>();
expectTypeOf(token.border).toEqualTypeOf<PIXI.Graphics | undefined>();
expectTypeOf(token.bars).toEqualTypeOf<Token.Bars | undefined>();
expectTypeOf(token.tooltip).toEqualTypeOf<PreciseText | undefined>();
expectTypeOf(token.target).toEqualTypeOf<PIXI.Graphics | undefined>();
expectTypeOf(token.nameplate).toEqualTypeOf<PreciseText | undefined>();
expectTypeOf(token.targeted).toEqualTypeOf<Set<User.Stored>>();
expectTypeOf(token.mesh).toEqualTypeOf<PrimarySpriteMesh | undefined>();

expectTypeOf(token.voidMesh).toEqualTypeOf<PIXI.Container | undefined>();
expectTypeOf(token.detectionFilterMesh).toEqualTypeOf<PIXI.Container | undefined>();
expectTypeOf(token.texture).toEqualTypeOf<PIXI.Texture | undefined>();
expectTypeOf(token.vision).toEqualTypeOf<foundry.canvas.sources.PointVisionSource.ConfiguredInstance | undefined>();
expectTypeOf(token.light).toEqualTypeOf<
  | foundry.canvas.sources.PointLightSource.ConfiguredInstance
  | foundry.canvas.sources.PointDarknessSource.ConfiguredInstance
  | undefined
>();

expectTypeOf(token.animationContexts).toEqualTypeOf<Map<string, Token.AnimationContext>>();
expectTypeOf(token.ring).toEqualTypeOf<TokenRing.ConfiguredInstance | null | undefined>();
expectTypeOf(token.hasDynamicRing).toBeBoolean();
// TODO: see if we can fix the 'possibly infinite' here
expectTypeOf(token.actor).toEqualTypeOf<Actor.Implementation | null>();
expectTypeOf(token.observer).toBeBoolean();
expectTypeOf(token.name).toBeString();
expectTypeOf(token.bounds).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(token.w).toBeNumber();
expectTypeOf(token.h).toBeNumber();
expectTypeOf(token.center).toEqualTypeOf<PIXI.Point>();

expectTypeOf(token.getMovementAdjustedPoint({ x: 20, y: 30 })).toEqualTypeOf<Canvas.Point>();
expectTypeOf(token.getMovementAdjustedPoint({ x: 20, y: 30 }, {})).toEqualTypeOf<Canvas.Point>();
expectTypeOf(
  token.getMovementAdjustedPoint({ x: 20, y: 30 }, { offsetX: 50, offsetY: 50 }),
).toEqualTypeOf<Canvas.Point>();
expectTypeOf(
  token.getMovementAdjustedPoint({ x: 20, y: 30 }, { offsetX: null, offsetY: null }),
).toEqualTypeOf<Canvas.Point>();

expectTypeOf(token.sourceId).toBeString();
expectTypeOf(token.sourceElement).toEqualTypeOf<PIXI.ImageSource | undefined>();
expectTypeOf(token.isVideo).toBeBoolean();
expectTypeOf(token.inCombat).toBeBoolean();
// TODO: see if we can fix the 'possibly infinite' here
expectTypeOf(token.combatant).toEqualTypeOf<Combatant.Stored>();
expectTypeOf(token.isTargeted).toBeBoolean();
expectTypeOf(token.detectionModes).toEqualTypeOf<
  { id: string | undefined; enabled: boolean; range: number | null }[]
>();
expectTypeOf(token.isVisible).toBeBoolean();
expectTypeOf(token.animationName).toBeString();
expectTypeOf(token.hasSight).toBeBoolean();
expectTypeOf(token["_isLightSource"]()).toBeBoolean();
expectTypeOf(token.emitsLight).toBeBoolean();
expectTypeOf(token.emitsDarkness).toBeBoolean();
expectTypeOf(token.hasLimitedSourceAngle).toBeBoolean();
expectTypeOf(token.dimRadius).toBeNumber();
expectTypeOf(token.brightRadius).toBeNumber();
expectTypeOf(token.radius).toBeNumber();
expectTypeOf(token.lightPerceptionRange).toBeNumber();
expectTypeOf(token.sightRange).toBeNumber();
expectTypeOf(token.optimalSightRange).toBeNumber();

expectTypeOf(token.initializeSources()).toBeVoid();
expectTypeOf(token.initializeSources({})).toBeVoid();
expectTypeOf(token.initializeSources({ deleted: true })).toBeVoid();
expectTypeOf(token.initializeSources({ deleted: null })).toBeVoid();

expectTypeOf(token.initializeLightSource()).toBeVoid();
expectTypeOf(token.initializeLightSource({})).toBeVoid();
expectTypeOf(token.initializeLightSource({ deleted: true })).toBeVoid();
expectTypeOf(token.initializeLightSource({ deleted: null })).toBeVoid();
expectTypeOf(token["_getLightSourceData"]()).toEqualTypeOf<Token.LightSourceData>();

expectTypeOf(token.initializeVisionSource()).toBeVoid();
expectTypeOf(token.initializeVisionSource({})).toBeVoid();
expectTypeOf(token.initializeVisionSource({ deleted: true })).toBeVoid();
expectTypeOf(token.initializeVisionSource({ deleted: null })).toBeVoid();
expectTypeOf(token["_getVisionBlindedStates"]()).toEqualTypeOf<Token.BlindedStates>();
expectTypeOf(token["_getVisionSourceData"]()).toEqualTypeOf<Token.VisionSourceData>();
expectTypeOf(token["_isVisionSource"]()).toBeBoolean();
expectTypeOf(token["_renderDetectionFilter"](new PIXI.Renderer())).toBeVoid();

expectTypeOf(token.clear()).toBeVoid();

// @ts-expect-error _destroy always gets passed a value, even if that value is `undefined`
expectTypeOf(token["_destroy"]()).toBeVoid();
expectTypeOf(token["_destroy"]({})).toBeVoid();
expectTypeOf(token["_destroy"]({ baseTexture: true, children: true, texture: true })).toBeVoid();
expectTypeOf(token["_destroy"](true)).toBeVoid();
expectTypeOf(token["_destroy"](undefined)).toBeVoid();

// @ts-expect-error _draw always gets passed a value
expectTypeOf(token["_draw"]()).toEqualTypeOf<Promise<void>>();
expectTypeOf(token["_draw"]({})).toEqualTypeOf<Promise<void>>();

// @ts-expect-error an object must be passed
expectTypeOf(token["_applyRenderFlags"]()).toBeVoid();
expectTypeOf(token["_applyRenderFlags"]({})).toBeVoid();
// all falsey values have no effect
expectTypeOf(token["_applyRenderFlags"]({ refreshElevation: null, refreshPosition: undefined })).toBeVoid();
expectTypeOf(
  token["_applyRenderFlags"]({
    redraw: true,
    redrawEffects: true,
    refresh: true,
    refreshState: true,
    refreshVisibility: true,
    refreshTransform: true,
    refreshPosition: true,
    refreshRotation: true,
    refreshSize: true,
    refreshElevation: true,
    refreshMesh: true,
    refreshShader: true,
    refreshShape: true,
    refreshBorder: true,
    refreshBars: true,
    refreshEffects: true,
    refreshNameplate: true,
    refreshTarget: true,
    refreshTooltip: true,
    refreshRingVisuals: true,
  }),
).toBeVoid();

expectTypeOf(token["_refreshRingVisuals"]()).toBeVoid();
expectTypeOf(token["_refreshVisibility"]()).toBeVoid();
expectTypeOf(token["_refreshState"]()).toBeVoid();
expectTypeOf(token["_refreshSize"]()).toBeVoid();
expectTypeOf(token["_refreshShape"]()).toBeVoid();
expectTypeOf(token["_refreshRotation"]()).toBeVoid();
expectTypeOf(token["_refreshPosition"]()).toBeVoid();
expectTypeOf(token["_refreshElevation"]()).toBeVoid();
expectTypeOf(token["_refreshTooltip"]()).toBeVoid();
expectTypeOf(token["_refreshNameplate"]()).toBeVoid();
expectTypeOf(token["_refreshMesh"]()).toBeVoid();
expectTypeOf(token["_refreshShader"]()).toBeVoid();
expectTypeOf(token["_refreshBorder"]()).toBeVoid();
expectTypeOf(token["_getBorderColor"]()).toBeNumber();

expectTypeOf(token["_refreshTarget"]()).toBeVoid();
expectTypeOf(token["_refreshTarget"]({})).toBeVoid();
expectTypeOf(
  token["_refreshTarget"]({
    alpha: 0.5,
    border: {
      color: Color.from("#787878"),
      width: 4,
    },
    color: Color.from("#987654"),
    margin: 2,
    size: 0.23,
  }),
).toBeVoid();
expectTypeOf(
  token["_refreshTarget"]({
    alpha: undefined,
    border: { color: undefined, width: undefined },
    color: null,
    margin: null,
    size: undefined,
  }),
).toBeVoid();
expectTypeOf(token["_refreshTarget"]({ border: undefined })).toBeVoid();

expectTypeOf(token["_drawTarget"]()).toBeVoid();
expectTypeOf(token["_drawTarget"]({})).toBeVoid();
expectTypeOf(
  token["_drawTarget"]({
    alpha: 0.5,
    border: {
      color: Color.from("#787878"),
      width: 4,
    },
    color: Color.from("#987654"),
    margin: 2,
    size: 0.23,
  }),
).toBeVoid();
expectTypeOf(
  token["_drawTarget"]({
    alpha: undefined,
    border: { color: undefined, width: undefined },
    color: null,
    margin: null,
    size: undefined,
  }),
).toBeVoid();
expectTypeOf(token["_drawTarget"]({ border: undefined })).toBeVoid();

expectTypeOf(token.drawBars()).toBeVoid();
expectTypeOf(token["_drawBar"](1, token.bars!.bar1, doc.getBarAttribute("foo")!)).toBeBoolean();
expectTypeOf(token["_getTooltipText"]()).toBeString();
expectTypeOf(token["_getTextStyle"]()).toEqualTypeOf<PIXI.TextStyle>();

expectTypeOf(token.drawEffects()).toEqualTypeOf<Promise<Token.Implementation>>();
expectTypeOf(token["_drawEffects"]()).toEqualTypeOf<Promise<void>>();

expectTypeOf(token["_drawEffect"]("path/to/effect/texture.jpg")).toEqualTypeOf<Promise<PIXI.Sprite | undefined>>();
expectTypeOf(token["_drawEffect"]("path/to/effect/texture.jpg", Color.from("#149856"))).toEqualTypeOf<
  Promise<PIXI.Sprite | undefined>
>();
expectTypeOf(token["_drawEffect"]("path/to/effect/texture.jpg", 0)).toEqualTypeOf<Promise<PIXI.Sprite | undefined>>();
expectTypeOf(token["_drawEffect"]("path/to/effect/texture.jpg", null)).toEqualTypeOf<
  Promise<PIXI.Sprite | undefined>
>();

expectTypeOf(token["_drawOverlay"]("path/to/effect/texture.jpg")).toEqualTypeOf<Promise<PIXI.Sprite | undefined>>();
expectTypeOf(token["_drawOverlay"]("path/to/effect/texture.jpg", Color.from("#149856"))).toEqualTypeOf<
  Promise<PIXI.Sprite | undefined>
>();
expectTypeOf(token["_drawOverlay"]("path/to/effect/texture.jpg", 0)).toEqualTypeOf<Promise<PIXI.Sprite | undefined>>();
expectTypeOf(token["_drawOverlay"]("path/to/effect/texture.jpg", null)).toEqualTypeOf<
  Promise<PIXI.Sprite | undefined>
>();

expectTypeOf(token["_refreshEffects"]()).toBeVoid();
expectTypeOf(token["_canViewMode"](CONST.TOKEN_DISPLAY_MODES.OWNER)).toBeBoolean();

expectTypeOf(token.getRingColors()).toEqualTypeOf<Token.RingColors>();
expectTypeOf(token.getRingEffects()).toEqualTypeOf<TokenRing.EFFECTS[]>();
expectTypeOf(token["_getAnimationData"]()).toEqualTypeOf<Token.AnimationData>();

const fullAnimationData = {
  rotation: 90,
  alpha: 0.7,
  height: 2,
  width: 2,
  x: 90,
  y: 70,
  texture: {
    anchorX: 0.2,
    anchorY: -0.1,
    scaleX: 1.35,
    scaleY: 2.7,
    src: "path/to/tex.webp",
    tint: Color.from([0.2, 0.5, 0.872]),
  },
  ring: {
    subject: {
      scale: 2.4,
      texture: "path/to/other.png",
    },
  },
};
expectTypeOf(token.animate({ rotation: 90, alpha: 0.7 })).toEqualTypeOf<Promise<void>>();
expectTypeOf(token.animate({ rotation: 90, alpha: 0.7 }, {})).toEqualTypeOf<Promise<void>>();
expectTypeOf(
  token.animate(fullAnimationData, {
    duration: 5000,
    easing: "easeInCircle",
    movementSpeed: 10,
    name: token.animationName,
    transition: TextureTransitionFilter.TYPES.GLITCH,
    ontick: (dt: number, data: CanvasAnimation.AnimationData) => console.warn(dt, data),
  }),
).toEqualTypeOf<Promise<void>>();
expectTypeOf(
  token.animate(
    { rotation: 90, alpha: 0.7 },
    { duration: undefined, easing: null, movementSpeed: undefined, name: null, ontick: null, transition: null },
  ),
).toEqualTypeOf<Promise<void>>();

const fromForDuration = { x: 50, y: 60, rotation: 0 };
expectTypeOf(token["_getAnimationDuration"](fromForDuration, { x: 500 })).toBeNumber();
expectTypeOf(token["_getAnimationDuration"](fromForDuration, { x: 500, y: 700, rotation: 180 })).toBeNumber();
expectTypeOf(token["_getAnimationDuration"](fromForDuration, { x: 500, rotation: 180 }, {})).toBeNumber();
expectTypeOf(token["_getAnimationDuration"](fromForDuration, { rotation: 180 }, { movementSpeed: 10 })).toBeNumber();
expectTypeOf(
  token["_getAnimationDuration"](fromForDuration, { y: 700, rotation: 180 }, { movementSpeed: undefined }),
).toBeNumber();

const someAnimationContext = {
  duration: 750,
  name: "foo",
  onAnimate: [],
  postAnimate: [],
  preAnimate: [],
  time: 437,
  to: { x: 500 },
};
expectTypeOf(token["_onAnimationUpdate"]({}, someAnimationContext)).toBeVoid();
expectTypeOf(token["_onAnimationUpdate"]({ texture: { scaleX: 5 }, rotation: 84 }, someAnimationContext)).toBeVoid();
expectTypeOf(token["_onAnimationUpdate"](fullAnimationData, someAnimationContext)).toBeVoid();

expectTypeOf(token.stopAnimation()).toBeVoid();
expectTypeOf(token.stopAnimation({})).toBeVoid();
expectTypeOf(token.stopAnimation({ reset: true })).toBeVoid();
expectTypeOf(token.stopAnimation({ reset: null })).toBeVoid();

// only rotation required for `from`, `changes` is allowed to, but never would actually, be empty, no options required
expectTypeOf(token["_prepareAnimation"]({ rotation: 175 }, { rotation: 260 }, someAnimationContext)).toEqualTypeOf<
  CanvasAnimation.Attribute[]
>();
// `from`/`changes` are otherwise both PartialAnimationData
expectTypeOf(
  token["_prepareAnimation"](
    { rotation: 175, height: 3, alpha: 0.2 },
    { rotation: 190, height: 2, alpha: 0.1 },
    someAnimationContext,
  ),
).toEqualTypeOf<CanvasAnimation.Attribute[]>();
expectTypeOf(token["_prepareAnimation"](fullAnimationData, fullAnimationData, someAnimationContext, {})).toEqualTypeOf<
  CanvasAnimation.Attribute[]
>();
// only the one option, nullable
expectTypeOf(
  token["_prepareAnimation"](fullAnimationData, fullAnimationData, someAnimationContext, {
    transition: TextureTransitionFilter.TYPES.CROSSHATCH,
  }),
).toEqualTypeOf<CanvasAnimation.Attribute[]>();
expectTypeOf(
  token["_prepareAnimation"](fullAnimationData, fullAnimationData, someAnimationContext, { transition: null }),
).toEqualTypeOf<CanvasAnimation.Attribute[]>();

const p = { x: 40, y: 800 };
expectTypeOf(token.checkCollision(p)).toEqualTypeOf<PointSourcePolygon.TestCollision<"any">>();
expectTypeOf(token.checkCollision(p, {})).toEqualTypeOf<PointSourcePolygon.TestCollision<"any">>();
expectTypeOf(
  token.checkCollision(p, {
    type: "light",
    origin: { x: 9000, y: 4 },
  }),
).toEqualTypeOf<PointSourcePolygon.TestCollision<"any">>();
expectTypeOf(
  token.checkCollision(p, {
    type: undefined,
    origin: null,
    mode: undefined,
  }),
).toEqualTypeOf<PointSourcePolygon.TestCollision<"any">>();
expectTypeOf(
  token.checkCollision(p, {
    type: "move",
    origin: { x: 80, y: 27 },
    mode: "any",
  }),
).toEqualTypeOf<boolean>(); // actual return for '"any"'
expectTypeOf(
  token.checkCollision(p, {
    type: "move",
    origin: { x: 80, y: 27 },
    mode: "all",
  }),
).toEqualTypeOf<foundry.canvas.geometry.edges.PolygonVertex[]>(); // actual return for `"all"`
expectTypeOf(
  token.checkCollision(p, {
    type: "move",
    origin: { x: 80, y: 27 },
    mode: "closest",
  }),
).toEqualTypeOf<foundry.canvas.geometry.edges.PolygonVertex | null>(); // actual return for `"closest"

expectTypeOf(token.getSize()).toEqualTypeOf<{ width: number; height: number }>();
expectTypeOf(token.getShape()).toEqualTypeOf<PIXI.Rectangle | PIXI.Polygon>();

expectTypeOf(token.getCenterPoint()).toEqualTypeOf<Canvas.Point>();
expectTypeOf(token.getCenterPoint({ x: 5, y: 7 })).toEqualTypeOf<Canvas.Point>();
expectTypeOf(token.getCenterPoint(doc)).toEqualTypeOf<Canvas.Point>();
expectTypeOf(token.getCenterPoint(null)).toEqualTypeOf<Canvas.Point>();

expectTypeOf(token.getSnappedPosition()).toEqualTypeOf<Canvas.Point>();
expectTypeOf(token.getSnappedPosition({ x: 5, y: 7 })).toEqualTypeOf<Canvas.Point>();
expectTypeOf(token.getSnappedPosition(doc)).toEqualTypeOf<Canvas.Point>();
expectTypeOf(token.getSnappedPosition(null)).toEqualTypeOf<Canvas.Point>();

declare const someRegion: Region.Implementation;
expectTypeOf(token.testInsideRegion(someRegion)).toBeBoolean();
// @ts-expect-error If `position` is non-nullish, it must contain `{x, y}` data
expectTypeOf(token.testInsideRegion(someRegion), {}).toBeBoolean();
// @ts-expect-error If `position` is non-nullish, it must contain `{x, y}` data
expectTypeOf(token.testInsideRegion(someRegion), { elevation: 70 }).toBeBoolean();
expectTypeOf(token.testInsideRegion(someRegion, p)).toBeBoolean();
expectTypeOf(token.testInsideRegion(someRegion, { x: 40, y: 20, elevation: -60 })).toBeBoolean();
expectTypeOf(token.testInsideRegion(someRegion, null)).toBeBoolean();

const waypoints = [
  { x: 50, y: 50, elevation: 0 },
  { x: 70, y: 90, elevation: 60 },
];
expectTypeOf(token.segmentizeRegionMovement(someRegion, waypoints)).toEqualTypeOf<Region.MovementSegment[]>();
expectTypeOf(token.segmentizeRegionMovement(someRegion, waypoints, {})).toEqualTypeOf<Region.MovementSegment[]>();
expectTypeOf(token.segmentizeRegionMovement(someRegion, waypoints, { teleport: true })).toEqualTypeOf<
  Region.MovementSegment[]
>();
expectTypeOf(token.segmentizeRegionMovement(someRegion, waypoints, { teleport: null })).toEqualTypeOf<
  Region.MovementSegment[]
>();

declare const someUser: User.Stored;
expectTypeOf(token.setTarget()).toBeVoid();
expectTypeOf(token.setTarget(true)).toBeVoid();
expectTypeOf(token.setTarget(false, {})).toBeVoid();
expectTypeOf(token.setTarget(true, { user: someUser, groupSelection: true, releaseOthers: false })).toBeVoid();
expectTypeOf(token.setTarget(false, { user: null, groupSelection: null, releaseOthers: null })).toBeVoid();

expectTypeOf(token.externalRadius).toBeNumber();
expectTypeOf(token.getLightRadius(5)).toBeNumber();
expectTypeOf(token["_getShiftedPosition"](20, -10)).toEqualTypeOf<Canvas.Point>();

expectTypeOf(token["_updateRotation"]()).toBeNumber();
expectTypeOf(token["_updateRotation"]({})).toBeNumber();
// you would never actually pass `delta` if you're passing `angle` as it would get ignored
expectTypeOf(token["_updateRotation"]({ angle: 90, delta: 20, snap: 4 })).toBeNumber();
expectTypeOf(token["_updateRotation"]({ angle: null, delta: undefined, snap: undefined })).toBeNumber();

expectTypeOf(token["_onApplyStatusEffect"]("flying", true)).toBeVoid();
expectTypeOf(token["_configureFilterEffect"]("invisible", false)).toBeVoid();
expectTypeOf(token["_updateSpecialStatusFilterEffects"]()).toBeVoid();
expectTypeOf(token["_removeAllFilterEffects"]()).toBeVoid();

// TODO: see if we can fix the 'possibly infinite' here
expectTypeOf(
  token["_onCreate"](doc.toObject(), { modifiedTime: 7, render: true, renderSheet: false }, "XXXXXSomeIDXXXXX"),
).toBeVoid();

expectTypeOf(
  token["_onUpdate"](
    // partial source data
    {
      elevation: 30,
      displayBars: CONST.TOKEN_DISPLAY_MODES.OWNER,
      texture: { src: "path/to/new.jpg" },

      flags: { core: { sheetLock: true } },
    },
    { modifiedTime: 7, render: true, diff: true, recursive: true },
    "XXXXXSomeIDXXXXX",
  ),
).toBeVoid();

expectTypeOf(token["_onDelete"]({ modifiedTime: 7, render: true }, "XXXXXSomeIDXXXXX")).toBeVoid();

// @ts-expect-error _onControl is always passed a value
expectTypeOf(token["_onControl"]()).toBeVoid();
expectTypeOf(token["_onControl"]({})).toBeVoid();
expectTypeOf(token["_onControl"]({ releaseOthers: false })).toBeVoid();

// @ts-expect-error _onRelease always gets passed a value
expectTypeOf(token["_onRelease"]()).toBeVoid();
expectTypeOf(token["_onRelease"]({})).toBeVoid();

expectTypeOf(token["_overlapsSelection"](new PIXI.Rectangle())).toBeBoolean();

declare const someEvent: PIXI.FederatedEvent;
expectTypeOf(token["_canControl"](someUser, someEvent)).toBeBoolean();
expectTypeOf(token["_canHUD"](someUser, someEvent)).toBeBoolean();
expectTypeOf(token["_canConfigure"](someUser, someEvent)).toBeBoolean();
expectTypeOf(token["_canHover"](someUser, someEvent)).toBeBoolean();
expectTypeOf(token["_canView"](someUser, someEvent)).toBeBoolean();
expectTypeOf(token["_canDrag"](someUser, someEvent)).toBeBoolean();

expectTypeOf(token["_onHoverIn"](someEvent)).toBeVoid();
expectTypeOf(token["_onHoverIn"](someEvent, {})).toBeVoid();
expectTypeOf(token["_onHoverIn"](someEvent, { hoverOutOthers: true })).toBeVoid();
expectTypeOf(token["_onHoverIn"](someEvent, { hoverOutOthers: null })).toBeVoid();

expectTypeOf(token["_onHoverOut"](someEvent)).toBeVoid();
expectTypeOf(token["_onClickLeft"](someEvent)).toBeVoid();
expectTypeOf(token["_propagateLeftClick"](someEvent)).toBeBoolean();
expectTypeOf(token["_onClickLeft2"](someEvent)).toBeVoid();
expectTypeOf(token["_onClickRight2"](someEvent)).toBeVoid();
expectTypeOf(token["_onDragLeftStart"](someEvent)).toBeVoid();
expectTypeOf(token["_prepareDragLeftDropUpdates"](someEvent)).toEqualTypeOf<Token.DragLeftDropUpdate[]>();
expectTypeOf(token["_onDragLeftMove"](someEvent)).toBeVoid();
expectTypeOf(token["_onDragEnd"]()).toBeVoid();

// deprecated since v11, until v13
expectTypeOf(token.updatePosition()).toBeVoid();

expectTypeOf(token.refreshHUD()).toBeVoid();
expectTypeOf(token.refreshHUD({})).toBeVoid();
expectTypeOf(
  token.refreshHUD({ bars: true, border: true, effects: true, elevation: true, nameplate: true }),
).toBeVoid();
expectTypeOf(
  token.refreshHUD({ bars: null, border: null, effects: null, elevation: null, nameplate: null }),
).toBeVoid();

// deprecated since v12, until v14
expectTypeOf(token.updateSource()).toBeVoid();
expectTypeOf(token.updateSource({})).toBeVoid();
expectTypeOf(token.updateSource({ deleted: true })).toBeVoid();
expectTypeOf(token.updateSource({ deleted: null })).toBeVoid();

expectTypeOf(token.getCenter(50, 270)).toEqualTypeOf<Canvas.Point>();
expectTypeOf(token.owner).toBeBoolean();

declare const someCombat: Combat.Stored;
expectTypeOf(token.toggleCombat()).toEqualTypeOf<Promise<Combatant.Stored[]>>();
expectTypeOf(token.toggleCombat(someCombat)).toEqualTypeOf<Promise<Combatant.Stored[]>>();

expectTypeOf(token.toggleEffect(CONFIG.statusEffects[0]!)).toEqualTypeOf<
  Promise<ActiveEffect.Stored | boolean | undefined>
>();
expectTypeOf(token.toggleEffect(CONFIG.statusEffects[0]!, {})).toEqualTypeOf<
  Promise<ActiveEffect.Stored | boolean | undefined>
>();
expectTypeOf(token.toggleEffect(CONFIG.statusEffects[0]!, { active: true, overlay: false })).toEqualTypeOf<
  Promise<ActiveEffect.Stored | boolean | undefined>
>();
expectTypeOf(token.toggleEffect(CONFIG.statusEffects[0]!, { active: null, overlay: null })).toEqualTypeOf<
  Promise<ActiveEffect.Stored | boolean | undefined>
>();

expectTypeOf(token.toggleVisibility()).toEqualTypeOf<Promise<TokenDocument.Stored[]>>();
expectTypeOf(token["_recoverFromPreview"]()).toBeVoid();

// Reported by emily3k on Discord, see https://discord.com/channels/732325252788387980/803646399014109205/1375296418478030930
test("Ensure that PIXI.Texture.from can accept PIXI.Resource", () => {
  PIXI.Texture.from(token.mesh!.texture!.baseTexture.resource);
});
