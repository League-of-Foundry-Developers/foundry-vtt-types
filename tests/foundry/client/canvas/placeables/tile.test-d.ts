import { expectTypeOf } from "vitest";

import Tile = foundry.canvas.placeables.Tile;
import PrimarySpriteMesh = foundry.canvas.primary.PrimarySpriteMesh;
import TileShapeControls from "#client/canvas/placeables/tiles/shape-controls.mjs";

declare const doc: TileDocument.Stored;
declare const scene: Scene.Stored;

expectTypeOf(Tile.implementation).toEqualTypeOf<Tile.ImplementationClass>();
expectTypeOf(Tile.embeddedName).toEqualTypeOf<"Tile">();
expectTypeOf(Tile.RENDER_FLAGS.redraw.propagate).toEqualTypeOf<
  | Array<
      | "refresh"
      | "refreshState"
      | "refreshVisibility"
      | "refreshTransform"
      | "refreshPosition"
      | "refreshRotation"
      | "refreshSize"
      | "refreshMesh"
      | "refreshFrame"
      | "refreshElevation"
      | "refreshPerception"
      | "refreshVideo"
    >
  | undefined
>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(Tile.createPreview(doc.toObject())).toEqualTypeOf<Tile.Implementation>();

const tile = new CONFIG.Tile.objectClass(doc);

expectTypeOf(tile.controlIcon).toBeNull();
expectTypeOf(tile.frame).toEqualTypeOf<Tile.FrameContainer | undefined>();
expectTypeOf(tile.texture).toEqualTypeOf<PIXI.Texture | null>();
expectTypeOf(tile.bg).toEqualTypeOf<PIXI.Graphics | null>();
expectTypeOf(tile.mesh).toEqualTypeOf<PrimarySpriteMesh | null>();
expectTypeOf(tile.aspectRatio).toEqualTypeOf<number>();
expectTypeOf(tile.bounds).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(tile.sourceElement).toEqualTypeOf<PIXI.ImageSource | null>();
expectTypeOf(tile.isVideo).toBeBoolean();
expectTypeOf(tile.isVisible).toBeBoolean();
expectTypeOf(tile.controls).toEqualTypeOf<TileShapeControls | undefined>();
expectTypeOf(tile.occluded).toBeBoolean();
expectTypeOf(tile.playing).toBeBoolean();
expectTypeOf(tile.volume).toBeNumber();

// @ts-expect-error _draw always gets passed a value
expectTypeOf(tile["_draw"]()).toEqualTypeOf<Promise<void>>();
expectTypeOf(tile["_draw"]({})).toEqualTypeOf<Promise<void>>();

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
expectTypeOf(tile["_applyRenderFlags"]({ refreshElevation: false, refreshPosition: undefined })).toBeVoid();
expectTypeOf(
  tile["_applyRenderFlags"]({
    redraw: true,
    refresh: true,
    refreshState: true,
    refreshTransform: true,
    refreshPosition: true,
    refreshRotation: true,
    refreshSize: true,
    refreshMesh: true,
    refreshFrame: true,
    refreshElevation: true,
    refreshPerception: true,
    refreshVideo: true,
  }),
).toBeVoid();

expectTypeOf(tile["_refreshPosition"]()).toBeVoid();
expectTypeOf(tile["_refreshRotation"]()).toBeVoid();
expectTypeOf(tile["_refreshSize"]()).toBeVoid();
expectTypeOf(tile["_refreshState"]()).toBeVoid();
expectTypeOf(tile["_refreshMesh"]()).toBeVoid();
expectTypeOf(tile["_refreshElevation"]()).toBeVoid();
expectTypeOf(tile["_refreshVideo"]()).toBeVoid();
expectTypeOf(tile["_refreshVisibility"]()).toBeVoid();
expectTypeOf(tile["_clear"]()).toBeVoid();
expectTypeOf(tile._hasShapeChanged({ rotation: 45 })).toBeBoolean();

expectTypeOf(
  tile["_onCreate"](
    doc.toObject(),
    { action: "create", parent: scene, modifiedTime: 7, render: true, renderSheet: false },
    "XXXXXSomeIDXXXXX",
  ),
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
    { action: "update", parent: scene, modifiedTime: 7, render: true, diff: true, recursive: true },
    "XXXXXSomeIDXXXXX",
  ),
).toBeVoid();

expectTypeOf(
  tile["_onDelete"]({ action: "delete", parent: scene, modifiedTime: 7, render: true }, "XXXXXSomeIDXXXXX"),
).toBeVoid();
