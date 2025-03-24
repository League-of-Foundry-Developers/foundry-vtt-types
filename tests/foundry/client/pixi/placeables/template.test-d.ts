import { expectTypeOf } from "vitest";

expectTypeOf(MeasuredTemplate.embeddedName).toEqualTypeOf<"MeasuredTemplate">();
expectTypeOf(MeasuredTemplate.RENDER_FLAGS.redraw?.propagate).toEqualTypeOf<
  // undefined only from the optional chain, not underlying type
  | Array<
      | "redraw"
      | "refresh"
      | "refreshState"
      | "refreshPosition"
      | "refreshShape"
      | "refreshTemplate"
      | "refreshGrid"
      | "refreshText"
      | "refreshElevation"
    >
  | undefined
>();
expectTypeOf(MeasuredTemplate.getCircleShape(5)).toEqualTypeOf<PIXI.Circle | PIXI.Polygon>();
expectTypeOf(MeasuredTemplate.getConeShape(5, 270, 60)).toEqualTypeOf<PIXI.Polygon>();
expectTypeOf(MeasuredTemplate.getRectShape(5, 90)).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(MeasuredTemplate.getRayShape(5, 180, 2)).toEqualTypeOf<PIXI.Polygon>();

declare const doc: MeasuredTemplateDocument.Stored;
const template = new CONFIG.MeasuredTemplate.objectClass(doc);

expectTypeOf(template.controlIcon).toEqualTypeOf<ControlIcon | null>();
expectTypeOf(template.shape).toEqualTypeOf<PIXI.Circle | PIXI.Polygon | PIXI.Rectangle | undefined>();
expectTypeOf(template.texture).toEqualTypeOf<PIXI.Texture | null | undefined>();
expectTypeOf(template.template).toEqualTypeOf<PIXI.Graphics | undefined>();
expectTypeOf(template.ruler).toEqualTypeOf<PreciseText | undefined>();
expectTypeOf(template["_borderThickness"]).toBeNumber();
expectTypeOf(template.isAuthor).toBeBoolean();
expectTypeOf(template.bounds).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(template.isVisible).toBeBoolean();
expectTypeOf(template.highlightId).toBeString();

// @ts-expect-error _draw always gets passed a value
expectTypeOf(template["_draw"]()).toEqualTypeOf<Promise<void>>();
expectTypeOf(template["_draw"]({})).toEqualTypeOf<Promise<void>>();

// @ts-expect-error _destroy always gets passed a value, even if that value is `undefined`
expectTypeOf(template["_destroy"]()).toBeVoid();
expectTypeOf(template["_destroy"]({})).toBeVoid();
expectTypeOf(template["_destroy"]({ baseTexture: true, children: true, texture: true })).toBeVoid();
expectTypeOf(template["_destroy"](true)).toBeVoid();
expectTypeOf(template["_destroy"](undefined)).toBeVoid();

expectTypeOf(template.clear()).toEqualTypeOf<MeasuredTemplate.Object>();

// @ts-expect-error an object must be passed
expectTypeOf(template["_applyRenderFlags"]()).toBeVoid();
expectTypeOf(template["_applyRenderFlags"]({})).toBeVoid();
// all falsey values have no effect
expectTypeOf(template["_applyRenderFlags"]({ refreshElevation: null, refreshPosition: undefined })).toBeVoid();
expectTypeOf(
  template["_applyRenderFlags"]({
    redraw: true,
    refresh: true,
    refreshState: true,
    refreshPosition: true,
    refreshShape: true,
    refreshTemplate: true,
    refreshGrid: true,
    refreshText: true,
    refreshElevation: true,
  }),
).toBeVoid();

expectTypeOf(template["_refreshState"]()).toBeVoid();
expectTypeOf(template["_refreshElevation"]()).toBeVoid();
expectTypeOf(template["_getTargetAlpha"]()).toBeNumber();
expectTypeOf(template["_refreshPosition"]()).toBeVoid();
expectTypeOf(template["_refreshShape"]()).toBeVoid();
expectTypeOf(template["_computeShape"]()).toEqualTypeOf<PIXI.Circle | PIXI.Rectangle | PIXI.Polygon>();
expectTypeOf(template["_refreshTemplate"]()).toBeVoid();
expectTypeOf(template["_refreshRulerText"]()).toBeVoid();

expectTypeOf(template.highlightGrid()).toBeVoid();
expectTypeOf(template["_getGridHighlightShape"]()).toEqualTypeOf<PIXI.Circle | PIXI.Rectangle | PIXI.Polygon>();
expectTypeOf(template["_getGridHighlightPositions"]()).toEqualTypeOf<Canvas.Point[]>();

expectTypeOf(template.rotate(52, 3)).toEqualTypeOf<Promise<MeasuredTemplate.Object>>();

expectTypeOf(
  template["_onCreate"](doc.toObject(), { modifiedTime: 7, render: true, renderSheet: false }, "XXXXXSomeIDXXXXX"),
).toBeVoid();

expectTypeOf(
  template["_onUpdate"](
    // partial source data
    { elevation: 30, texture: "path/to/tex.webp", direction: 234, flags: { core: { sheetLock: true } } },
    { modifiedTime: 7, render: true, diff: true, recursive: true },
    "XXXXXSomeIDXXXXX",
  ),
).toBeVoid();

expectTypeOf(template["_onDelete"]({ modifiedTime: 7, render: true }, "XXXXXSomeIDXXXXX")).toBeVoid();

declare const someUser: User.Implementation;
declare const someEvent: PIXI.FederatedEvent;
expectTypeOf(template["_canControl"](someUser, someEvent)).toBeBoolean();
expectTypeOf(template["_canHUD"](someUser, someEvent)).toBeBoolean();
expectTypeOf(template["_canConfigure"](someUser, someEvent)).toBeBoolean();
expectTypeOf(template["_canView"](someUser, someEvent)).toBeBoolean();

expectTypeOf(template["_onHoverIn"](someEvent)).toBeVoid();
expectTypeOf(template["_onHoverIn"](someEvent, {})).toBeVoid();
expectTypeOf(template["_onHoverIn"](someEvent, { hoverOutOthers: true })).toBeVoid();
expectTypeOf(template["_onHoverIn"](someEvent, { hoverOutOthers: null })).toBeVoid();

expectTypeOf(template["_onClickRight"](someEvent)).toBeVoid();
expectTypeOf(template["_prepareDragLeftDropUpdates"](someEvent)).toEqualTypeOf<PlaceableObject.DragLeftDropUpdate[]>();

// deprecated since v12, until v14
expectTypeOf(template.borderColor).toBeNumber();
expectTypeOf(template.fillColor).toBeNumber();
expectTypeOf(template.owner).toBeBoolean();
