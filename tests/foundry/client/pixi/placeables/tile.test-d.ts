import { expectTypeOf } from "vitest";

declare const doc: TileDocument.Stored;

expectTypeOf(Tile.embeddedName).toEqualTypeOf<"Tile">();
expectTypeOf(Tile.RENDER_FLAGS.redraw.propagate).toEqualTypeOf<
  | Array<
      | "refresh"
      | "refreshState"
      | "refreshTransform"
      | "refreshPosition"
      | "refreshRotation"
      | "refreshMesh"
      | "refreshFrame"
      | "refreshElevation"
      | "refreshPerception"
      | "refreshVideo"
      | "refreshShape"
    >
  | undefined
>();
expectTypeOf(Tile.createPreview(doc.toObject())).toEqualTypeOf<Tile.Implementation>();

const tile = new CONFIG.Tile.objectClass(doc);

expectTypeOf(tile.controlIcon).toBeNull();
expectTypeOf(tile.frame).toEqualTypeOf<Tile.FrameContainer | undefined>();
expectTypeOf(tile.texture).toEqualTypeOf<PIXI.Texture | null | undefined>();
expectTypeOf(tile.bg).toEqualTypeOf<PIXI.Graphics | undefined>();
expectTypeOf(tile.mesh).toEqualTypeOf<PrimarySpriteMesh | null | undefined>();
expectTypeOf(tile.aspectRatio).toEqualTypeOf<number>();
expectTypeOf(tile.bounds).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(tile.sourceElement).toEqualTypeOf<PIXI.ImageSource | undefined>();
expectTypeOf(tile.isVideo).toBeBoolean();
expectTypeOf(tile.isVisible).toBeBoolean();
expectTypeOf(tile.occluded).toBeBoolean();
expectTypeOf(tile.playing).toBeBoolean();
expectTypeOf(tile.volume).toBeNumber();

// @ts-expect-error _draw always gets passed a value
expectTypeOf(tile["_draw"]()).toEqualTypeOf<Promise<void>>();
expectTypeOf(tile["_draw"]({})).toEqualTypeOf<Promise<void>>();

expectTypeOf(tile.clear()).toBeVoid();

// @ts-expect-error _destroy always gets passed a value, even if that value is `undefined`
expectTypeOf(tile["_destroy"]()).toBeVoid();
expectTypeOf(tile["_destroy"]({})).toBeVoid();
expectTypeOf(tile["_destroy"]({ baseTexture: true, children: true, texture: true })).toBeVoid();
expectTypeOf(tile["_destroy"](true)).toBeVoid();
expectTypeOf(tile["_destroy"](undefined)).toBeVoid();

// @ts-expect-error an object must be passed
expectTypeOf(tile["_applyRenderFlags"]()).toBeVoid();
expectTypeOf(tile["_applyRenderFlags"]({})).toBeVoid();
// all falsey values have no effect
expectTypeOf(tile["_applyRenderFlags"]({ refreshElevation: null, refreshPosition: undefined })).toBeVoid();
expectTypeOf(
  tile["_applyRenderFlags"]({
    redraw: true,
    refresh: true,
    refreshState: true,
    refreshTransform: true,
    refreshPosition: true,
    refreshRotation: true,
    refreshMesh: true,
    refreshFrame: true,
    refreshElevation: true,
    refreshPerception: true,
    refreshVideo: true,
    refreshShape: true,
  }),
).toBeVoid();

expectTypeOf(tile["_refreshPosition"]()).toBeVoid();
expectTypeOf(tile["_refreshRotation"]()).toBeVoid();
expectTypeOf(tile["_refreshSize"]()).toBeVoid();
expectTypeOf(tile["_refreshState"]()).toBeVoid();
expectTypeOf(tile["_refreshMesh"]()).toBeVoid();
expectTypeOf(tile["_refreshElevation"]()).toBeVoid();
expectTypeOf(tile["_refreshFrame"]()).toBeVoid();
expectTypeOf(tile["_refreshVideo"]()).toBeVoid();

expectTypeOf(tile.activateListeners()).toBeVoid();

expectTypeOf(
  tile["_onCreate"](doc.toObject(), { modifiedTime: 7, render: true, renderSheet: false }, "XXXXXSomeIDXXXXX"),
).toBeVoid();

expectTypeOf(
  tile["_onUpdate"](
    // partial source data
    {
      elevation: 30,
      texture: { src: "new/path/to/tex.png" },
      restrictions: { weather: false },
      flags: { core: { sheetLock: true } },
    },
    { modifiedTime: 7, render: true, diff: true, recursive: true },
    "XXXXXSomeIDXXXXX",
  ),
).toBeVoid();

expectTypeOf(tile["_onDelete"]({ modifiedTime: 7, render: true }, "XXXXXSomeIDXXXXX")).toBeVoid();

declare const someEvent: PIXI.FederatedEvent;

expectTypeOf(tile["_onHoverIn"](someEvent)).toBeVoid();
expectTypeOf(tile["_onHoverIn"](someEvent, {})).toBeVoid();
expectTypeOf(tile["_onHoverIn"](someEvent, { hoverOutOthers: true })).toBeVoid();
expectTypeOf(tile["_onHoverIn"](someEvent, { hoverOutOthers: null })).toBeVoid();

expectTypeOf(tile["_onClickLeft"](someEvent)).toBeVoid();
expectTypeOf(tile["_onDragLeftStart"](someEvent)).toBeVoid();
expectTypeOf(tile["_onDragLeftMove"](someEvent)).toBeVoid();
expectTypeOf(tile["_onDragLeftDrop"](someEvent)).toBeVoid();
expectTypeOf(tile["_onDragLeftCancel"](someEvent)).toBeVoid();

expectTypeOf(tile["_onHandleHoverIn"](someEvent)).toBeVoid();
expectTypeOf(tile["_onHandleHoverOut"](someEvent)).toBeVoid();
expectTypeOf(tile["_onHandleDragStart"](someEvent)).toBeVoid();
expectTypeOf(tile["_onHandleDragMove"](someEvent)).toBeVoid();
expectTypeOf(tile["_onHandleDragDrop"](someEvent)).toEqualTypeOf<Promise<Tile.Implementation>>();
expectTypeOf(tile["_onHandleDragCancel"](someEvent)).toBeVoid();

expectTypeOf(tile["_prepareDragLeftDropUpdates"](someEvent)).toEqualTypeOf<PlaceableObject.DragLeftDropUpdate[]>();

// deprecated since v12, until v14
expectTypeOf(tile.isRoof).toEqualTypeOf<boolean>();
declare const someToken: Token.Implementation;
expectTypeOf(tile.testOcclusion(someToken)).toBeBoolean();
expectTypeOf(tile.testOcclusion(someToken, {})).toBeBoolean();
expectTypeOf(tile.testOcclusion(someToken, { corners: true })).toBeBoolean();
expectTypeOf(tile.testOcclusion(someToken, { corners: null })).toBeBoolean();

expectTypeOf(tile.containsPixel(50, 50)).toBeBoolean();
expectTypeOf(tile.containsPixel(50, 50, 0.3)).toBeBoolean();

expectTypeOf(tile.getPixelAlpha(50, 50)).toBeNumber();
expectTypeOf(tile._getAlphaBounds()).toEqualTypeOf<PIXI.Rectangle | undefined>;
