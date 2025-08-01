import { describe, expectTypeOf, test } from "vitest";

import CanvasGroupMixin = foundry.canvas.groups.CanvasGroupMixin;
import Drawing = foundry.canvas.placeables.Drawing;
import InterfaceCanvasGroup = foundry.canvas.groups.InterfaceCanvasGroup;
import PreciseText = foundry.canvas.containers.PreciseText;
import layers = foundry.canvas.layers;

declare const someDrawing: Drawing.Implementation;

describe("InterfaceCanvasGroup Tests", () => {
  test("Group name", () => {
    expectTypeOf(InterfaceCanvasGroup.groupName).toEqualTypeOf<"interface">();
  });

  const myInterfaceGroup = new CONFIG.Canvas.groups.interface.groupClass();

  test("Uncategorized", () => {
    expectTypeOf(myInterfaceGroup.addDrawing(someDrawing)).toEqualTypeOf<PIXI.Graphics>();
    expectTypeOf(myInterfaceGroup.removeDrawing(someDrawing)).toEqualTypeOf<void>();

    expectTypeOf(myInterfaceGroup["_draw"]({})).toEqualTypeOf<Promise<void>>();

    expectTypeOf(myInterfaceGroup.createScrollingText({ x: 0, y: 0 }, "Scrolling! Text!")).toEqualTypeOf<
      Promise<PreciseText | undefined>
    >();
    expectTypeOf(
      myInterfaceGroup.createScrollingText({ x: 0, y: 0 }, "Scrolling! Text!", {
        distance: 256,
        anchor: CONST.TEXT_ANCHOR_POINTS.RIGHT,
        direction: CONST.TEXT_ANCHOR_POINTS.LEFT,
        jitter: 0.2,
        duration: 3000,
        // past this line are `PIXI.ITextStyle` props
        dropShadow: true,
        fontFamily: "serif",
        strokeThickness: 4,
      }),
    ).toEqualTypeOf<Promise<PreciseText | undefined>>();
  });

  test("Layers", () => {
    expectTypeOf(myInterfaceGroup.layers).toEqualTypeOf<CanvasGroupMixin.LayersFor<"interface">>();
    expectTypeOf(myInterfaceGroup.grid).toEqualTypeOf<layers.GridLayer.Any>();
    expectTypeOf(myInterfaceGroup.regions).toEqualTypeOf<layers.RegionLayer.Any>();
    expectTypeOf(myInterfaceGroup.drawings).toEqualTypeOf<layers.DrawingsLayer.Any>();
    expectTypeOf(myInterfaceGroup.templates).toEqualTypeOf<layers.TemplateLayer.Any>();
    expectTypeOf(myInterfaceGroup.tiles).toEqualTypeOf<layers.TilesLayer.Any>();
    expectTypeOf(myInterfaceGroup.walls).toEqualTypeOf<layers.WallsLayer.Any>();
    expectTypeOf(myInterfaceGroup.tokens).toEqualTypeOf<layers.TokenLayer.Any>();
    expectTypeOf(myInterfaceGroup.sounds).toEqualTypeOf<layers.SoundsLayer.Any>();
    expectTypeOf(myInterfaceGroup.lighting).toEqualTypeOf<layers.LightingLayer.Any>();
    expectTypeOf(myInterfaceGroup.notes).toEqualTypeOf<layers.NotesLayer.Any>();
    expectTypeOf(myInterfaceGroup.controls).toEqualTypeOf<layers.ControlsLayer.Any>();
  });

  test("Child groups", () => {
    // Core provides none
    // TODO: once group dynamic properties are typed, add and test a fake group with this as parent
  });

  test("Hooks", () => {
    Hooks.on("drawInterfaceCanvasGroup", (hiddenCanvas) => {
      expectTypeOf(hiddenCanvas).toEqualTypeOf<InterfaceCanvasGroup.Implementation>();
    });

    Hooks.on("tearDownInterfaceCanvasGroup", (hiddenCanvas) => {
      expectTypeOf(hiddenCanvas).toEqualTypeOf<InterfaceCanvasGroup.Implementation>();
    });
  });
});
