import { expectTypeOf } from "vitest";

import DoorMesh = foundry.canvas.containers.DoorMesh;
import TokenRingSamplerShader = foundry.canvas.rendering.shaders.TokenRingSamplerShader;
import CanvasAnimation = foundry.canvas.animation.CanvasAnimation;

expectTypeOf(DoorMesh.DOOR_STYLES).toExtend<Readonly<Record<keyof DoorMesh.DoorStyles, DoorMesh.DoorStyle>>>();

declare const someTex: PIXI.Texture;
declare const someWall: foundry.canvas.placeables.Wall.Implementation;

const animationConfiguration = {
  direction: -1,
  double: true,
  duration: 635,
  flip: true,
  strength: 1.72,
  style: "doubleR",
  type: "slide",
} satisfies DoorMesh.AnimationConfiguration;

const animationConfigurationInexact = {
  direction: undefined,
  double: undefined,
  duration: undefined,
  flip: undefined,
  strength: undefined,
  style: undefined,
  type: undefined,
} satisfies DoorMesh.AnimationConfiguration;

const constructorOptionsMinimal = {
  texture: someTex,
  object: someWall,
} satisfies DoorMesh.ConstructorOptions;

const constructorOptions = {
  texture: someTex,
  object: someWall,
  name: "Side Door",
  shaderClass: TokenRingSamplerShader,
  ...animationConfiguration,
} satisfies DoorMesh.ConstructorOptions;

const constructorOptionsInexact = {
  texture: someTex,
  object: someWall,
  name: undefined,
  shaderClass: undefined,
  ...animationConfigurationInexact,
} satisfies DoorMesh.ConstructorOptions;

// @ts-expect-error must provide a texture and object
new DoorMesh();
new DoorMesh(constructorOptionsMinimal);
new DoorMesh(constructorOptionsInexact);
const myDM = new DoorMesh(constructorOptions);

expectTypeOf(DoorMesh.animateSwing.call(myDM, true)).toEqualTypeOf<CanvasAnimation.Attribute[]>();
expectTypeOf(DoorMesh.animateAscend.call(myDM, false)).toEqualTypeOf<CanvasAnimation.Attribute[]>();
expectTypeOf(DoorMesh.initializeDescend.call(myDM, true)).toEqualTypeOf<void>();
expectTypeOf(DoorMesh.preAnimateDescend.call(myDM, false)).toEqualTypeOf<Promise<void>>();
expectTypeOf(DoorMesh.animateDescend.call(myDM, true)).toEqualTypeOf<CanvasAnimation.Attribute[]>();
expectTypeOf(DoorMesh.postAnimateDescend.call(myDM, false)).toEqualTypeOf<Promise<void>>();
expectTypeOf(DoorMesh.animateSlide.call(myDM, true)).toEqualTypeOf<CanvasAnimation.Attribute[]>();

expectTypeOf(myDM["_closedPosition"]).toEqualTypeOf<DoorMesh.StateSnapshot>();
expectTypeOf(myDM["_animatedPosition"]).toEqualTypeOf<DoorMesh.StateSnapshot>();

expectTypeOf(myDM.texturePadding).toBeNumber();
expectTypeOf(myDM.animationId).toBeString();

// @ts-expect-error #initialize's options lacks a ={}, must pass at least an empty object
myDM.initialize();
expectTypeOf(myDM.initialize({}));
expectTypeOf(myDM.initialize(animationConfiguration));
expectTypeOf(myDM.initialize(animationConfigurationInexact));

expectTypeOf(myDM.animate()).toEqualTypeOf<Promise<void>>();
expectTypeOf(myDM.animate(true)).toEqualTypeOf<Promise<void>>();
expectTypeOf(myDM.animate(false)).toEqualTypeOf<Promise<void>>();
