import { expectTypeOf } from "vitest";

import CanvasOcclusionMask = foundry.canvas.layers.CanvasOcclusionMask;
import CachedContainer = foundry.canvas.containers.CachedContainer;
import PrimaryCanvasObjectMixin = foundry.canvas.primary.PrimaryCanvasObjectMixin;
import SpriteMesh = foundry.canvas.containers.SpriteMesh;
import Token = foundry.canvas.placeables.Token;

expectTypeOf(CanvasOcclusionMask.textureConfiguration).toEqualTypeOf<CachedContainer.TextureConfiguration>();

const mySprite = new SpriteMesh();
const myOcclusionMask = new CanvasOcclusionMask(mySprite);

expectTypeOf(myOcclusionMask.tokens).toEqualTypeOf<PIXI.LegacyGraphics>();
expectTypeOf(myOcclusionMask.clearColor).toEqualTypeOf<Color.RGBAColorVector>();
expectTypeOf(myOcclusionMask.autoRender).toBeBoolean();
expectTypeOf(myOcclusionMask.vision).toBeBoolean();
// @ts-expect-error No setter is provided for `vision`
myOcclusionMask.vision = false;
expectTypeOf(myOcclusionMask.clear()).toBeVoid();
expectTypeOf(myOcclusionMask.mapElevation(20)).toBeNumber();
expectTypeOf(myOcclusionMask.updateOcclusion()).toBeVoid();
expectTypeOf(myOcclusionMask["_updateOcclusionMask"]()).toBeVoid();
expectTypeOf(myOcclusionMask["_updateOcclusionStates"]()).toBeVoid();
declare const someTokens: Token.Implementation[];
expectTypeOf(myOcclusionMask["_identifyOccludedObjects"](someTokens));

// deprecated since v11 until v13
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(myOcclusionMask._identifyOccludedTiles()).toEqualTypeOf<Set<PrimaryCanvasObjectMixin.AnyMixed>>();
