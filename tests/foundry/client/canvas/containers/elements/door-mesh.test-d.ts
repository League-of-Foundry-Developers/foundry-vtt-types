import { describe, expectTypeOf, test } from "vitest";

import DoorMesh = foundry.canvas.containers.DoorMesh;
import TokenRingSamplerShader = foundry.canvas.rendering.shaders.TokenRingSamplerShader;
import CanvasAnimation = foundry.canvas.animation.CanvasAnimation;

declare const someTex: PIXI.Texture;
declare const someWall: foundry.canvas.placeables.Wall.Implementation;

describe("DoorMesh tests", () => {
  test("Brands", () => {
    expectTypeOf(DoorMesh.DOOR_STYLES).toExtend<Readonly<Record<keyof DoorMesh.DoorStyles, DoorMesh.DoorStyle>>>();
  });
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
    style: "doubleR",
  } satisfies DoorMesh.ConstructorOptions;

  const constructorOptionsInexact = {
    texture: someTex,
    object: someWall,
    name: undefined,
    shaderClass: undefined,
    style: undefined,
  } satisfies DoorMesh.ConstructorOptions;
  test("Construction", () => {
    // @ts-expect-error must provide a texture and object
    new DoorMesh();
    new DoorMesh(constructorOptionsMinimal);
    new DoorMesh(constructorOptionsInexact);
    new DoorMesh(constructorOptions);
    // @ts-expect-error Animation options are passed to `#initialize`, not the constructor
    new DoorMesh({ ...constructorOptionsMinimal, direction: -1 });
  });

  const myDM = new DoorMesh(constructorOptions);

  test("Miscellaneous", () => {
    expectTypeOf(myDM["_closedPosition"]).toEqualTypeOf<DoorMesh.StateSnapshot>();
    expectTypeOf(myDM["_animatedPosition"]).toEqualTypeOf<DoorMesh.StateSnapshot>();

    expectTypeOf(myDM.texturePadding).toBeNumber();
    expectTypeOf(myDM.animationId).toBeString();
    expectTypeOf(myDM.animationConfig).toEqualTypeOf<DoorMesh.ResolvedAnimationConfiguration | undefined>();
    expectTypeOf(myDM.animationConfig!.config).toEqualTypeOf<CONFIG.Wall.DoorAnimationConfig>();
    expectTypeOf(myDM.doorStyle).toEqualTypeOf<DoorMesh.DoorStyle | undefined>();
    expectTypeOf(myDM.refresh()).toEqualTypeOf<typeof myDM>();

    // @ts-expect-error #initialize's options lacks a ={}, must pass at least an empty object
    myDM.initialize();
    expectTypeOf(myDM.initialize({}));
    expectTypeOf(myDM.initialize(animationConfiguration));
    expectTypeOf(myDM.initialize(animationConfigurationInexact));

    expectTypeOf(myDM.animate()).toEqualTypeOf<Promise<boolean>>();
    expectTypeOf(myDM.animate(true)).toEqualTypeOf<Promise<boolean>>();
    expectTypeOf(myDM.animate(false)).toEqualTypeOf<Promise<boolean>>();
  });

  test("Protected hooks", () => {
    class CustomDoorMesh extends DoorMesh {
      protected override _initializeAnimation(open: boolean): void {
        super._initializeAnimation(open);
      }

      protected override _getClosedPosition(config?: DoorMesh.AnimationConfiguration): DoorMesh.StateSnapshot {
        return super._getClosedPosition(config);
      }

      protected override _getRenderState(): DoorMesh.StateSnapshot {
        const state = super._getRenderState();
        state.y += 1;
        return state;
      }

      protected override _prepareAnimation(open: boolean): Promise<void> | void {
        return super._prepareAnimation(open);
      }

      protected override _getAnimationAttributes(open: boolean): CanvasAnimation.Attribute[] {
        return super._getAnimationAttributes(open);
      }

      protected override async _finalizeAnimation(open: boolean): Promise<void> {
        await super._finalizeAnimation(open);
      }
    }
    expectTypeOf(new CustomDoorMesh(constructorOptionsMinimal)).toExtend<DoorMesh>();
    expectTypeOf(CONFIG.Wall.doorMeshClass).toEqualTypeOf<typeof DoorMesh>();
  });

  test("DoorAnimationFunctions and Hooks", () => {
    expectTypeOf(DoorMesh.animateSwing.call(myDM, true)).toEqualTypeOf<CanvasAnimation.Attribute[]>();
    expectTypeOf(DoorMesh.animateAscend.call(myDM, false)).toEqualTypeOf<CanvasAnimation.Attribute[]>();
    expectTypeOf(DoorMesh.initializeDescend.call(myDM, true)).toEqualTypeOf<void>();
    expectTypeOf(DoorMesh.preAnimateDescend.call(myDM, false)).toEqualTypeOf<Promise<void>>();
    expectTypeOf(DoorMesh.animateDescend.call(myDM, true)).toEqualTypeOf<CanvasAnimation.Attribute[]>();
    expectTypeOf(DoorMesh.postAnimateDescend.call(myDM, false)).toEqualTypeOf<Promise<void>>();
    expectTypeOf(DoorMesh.animateSlide.call(myDM, true)).toEqualTypeOf<CanvasAnimation.Attribute[]>();
  });
});
