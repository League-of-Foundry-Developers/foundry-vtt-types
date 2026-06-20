import { describe, expectTypeOf, test } from "vitest";

import CanvasGroupMixin = foundry.canvas.groups.CanvasGroupMixin;
import Drawing = foundry.canvas.placeables.Drawing;
import InterfaceCanvasGroup = foundry.canvas.groups.InterfaceCanvasGroup;
import PreciseText = foundry.canvas.containers.PreciseText;
import layers = foundry.canvas.layers;

declare const someDrawing: Drawing.Implementation;

describe("InterfaceCanvasGroup tests", () => {
  test("Group name", () => {
    expectTypeOf(InterfaceCanvasGroup.groupName).toEqualTypeOf<"interface">();
  });

  test("Construction", () => {
    new InterfaceCanvasGroup();
    new CONFIG.Canvas.groups.interface.groupClass();
  });

  const myInterfaceGroup = new CONFIG.Canvas.groups.interface.groupClass();

  test("Miscellaneous", () => {
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
    expectTypeOf(myInterfaceGroup.grid).toEqualTypeOf<layers.GridLayer.Implementation>();
    expectTypeOf(myInterfaceGroup.regions).toEqualTypeOf<layers.RegionLayer.Implementation>();
    expectTypeOf(myInterfaceGroup.drawings).toEqualTypeOf<layers.DrawingsLayer.Implementation>();
    expectTypeOf(myInterfaceGroup.templates).toEqualTypeOf<layers.TemplateLayer.Implementation>();
    expectTypeOf(myInterfaceGroup.tiles).toEqualTypeOf<layers.TilesLayer.Implementation>();
    expectTypeOf(myInterfaceGroup.walls).toEqualTypeOf<layers.WallsLayer.Implementation>();
    expectTypeOf(myInterfaceGroup.tokens).toEqualTypeOf<layers.TokenLayer.Implementation>();
    expectTypeOf(myInterfaceGroup.sounds).toEqualTypeOf<layers.SoundsLayer.Implementation>();
    expectTypeOf(myInterfaceGroup.lighting).toEqualTypeOf<layers.LightingLayer.Implementation>();
    expectTypeOf(myInterfaceGroup.notes).toEqualTypeOf<layers.NotesLayer.Implementation>();
    expectTypeOf(myInterfaceGroup.controls).toEqualTypeOf<layers.ControlsLayer.Implementation>();
  });

  test("Child groups", () => {
    // Core provides no groups that have this as parent
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
