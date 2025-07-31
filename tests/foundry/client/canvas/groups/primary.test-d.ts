import { expectTypeOf } from "vitest";

import Drawing = foundry.canvas.placeables.Drawing;
import Tile = foundry.canvas.placeables.Tile;
import Token = foundry.canvas.placeables.Token;

import CanvasGroupMixin = foundry.canvas.groups.CanvasGroupMixin;
import PrimaryCanvasGroupAmbienceFilter = foundry.canvas.rendering.filters.PrimaryCanvasGroupAmbienceFilter;
import PrimaryGraphics = foundry.canvas.primary.PrimaryGraphics;
import PrimarySpriteMesh = foundry.canvas.primary.PrimarySpriteMesh;
import SpriteMesh = foundry.canvas.containers.SpriteMesh;

import PrimaryCanvasGroup = foundry.canvas.groups.PrimaryCanvasGroup;

expectTypeOf(PrimaryCanvasGroup.groupName).toExtend<keyof CONFIG.Canvas.Groups>();
expectTypeOf(PrimaryCanvasGroup.tearDownChildren).toEqualTypeOf<boolean>();
expectTypeOf(PrimaryCanvasGroup.BACKGROUND_ELEVATION).toEqualTypeOf<number>();

declare const someMesh: SpriteMesh;
declare const someToken: Token.Implementation;
declare const someTile: Tile.Implementation;
declare const someDrawing: Drawing.Implementation;
const myPrimaryGroup = new PrimaryCanvasGroup(someMesh);

expectTypeOf(myPrimaryGroup.layers).toEqualTypeOf<CanvasGroupMixin.LayersFor<"primary">>();

expectTypeOf(myPrimaryGroup["_ambienceFilter"]).toEqualTypeOf<PrimaryCanvasGroupAmbienceFilter | undefined>();

expectTypeOf(myPrimaryGroup.addToken(someToken)).toEqualTypeOf<PrimarySpriteMesh>();
expectTypeOf(myPrimaryGroup.addTile(someTile)).toEqualTypeOf<PrimarySpriteMesh>();
expectTypeOf(myPrimaryGroup.addDrawing(someDrawing)).toEqualTypeOf<PrimaryGraphics>();

// deprecated since v12, until v14
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(myPrimaryGroup.mapElevationToDepth(20)).toEqualTypeOf<number>();
