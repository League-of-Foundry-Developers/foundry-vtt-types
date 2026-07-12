import { describe, expectTypeOf, test } from "vitest";

import VFXComponent = foundry.canvas.vfx.VFXComponent;

declare const sprite: PIXI.Sprite;

describe("VFXComponent", () => {
  const myComponentData = { type: "test" } satisfies VFXComponent.CreateData;
  const mySoundComponentData = { type: "mySound" } satisfies VFXComponent.CreateData;

  test("TYPE is a string", () => {
    expectTypeOf(VFXComponent.TYPE).toEqualTypeOf<string>();
  });

  test("public getters have correct types", () => {
    // Use a subclass to avoid instantiating the abstract base via DataModel
    class MyComponent extends VFXComponent {
      static override TYPE = "test";
    }
    const comp = new MyComponent(myComponentData);
    expectTypeOf(comp.timeline).toEqualTypeOf<VFXComponent.Timeline>();
    expectTypeOf(comp.loaded).toEqualTypeOf<boolean>();
    expectTypeOf(comp.playing).toEqualTypeOf<boolean>();
    expectTypeOf(comp.assetPaths).toEqualTypeOf<Set<string>>();
    expectTypeOf(comp.managedDisplayObjects).toEqualTypeOf<Record<string, PIXI.DisplayObject[]>>();
  });

  test("addManagedDisplayObject preserves the input type", () => {
    class MyComponent extends VFXComponent {
      static override TYPE = "test";
    }
    const comp = new MyComponent(myComponentData);
    const result = comp.addManagedDisplayObject(sprite);
    expectTypeOf(result).toEqualTypeOf<PIXI.Sprite>();
  });

  test("load / draw / attach / stop / cancel return Promise<void>", () => {
    class MyComponent extends VFXComponent {
      static override TYPE = "test";
    }
    const comp = new MyComponent(myComponentData);
    expectTypeOf(comp.load()).toEqualTypeOf<Promise<void>>();
    expectTypeOf(comp.draw()).toEqualTypeOf<Promise<void>>();
    expectTypeOf(comp.stop()).toEqualTypeOf<Promise<void>>();
    expectTypeOf(comp.cancel()).toEqualTypeOf<Promise<void>>();
    comp.attach();
  });

  test("Animation interface shape", () => {
    const anim: VFXComponent.Animation = {
      animate: (_t, _state, _params) => {},
    };
    expectTypeOf(anim.animate).toBeFunction();
    expectTypeOf(anim.setup).toEqualTypeOf<((state: object, params: object) => void) | undefined>();
  });

  test("protected hooks are overridable in subclasses", () => {
    class MySoundComponent extends VFXComponent {
      static override TYPE = "mySound";
      protected override async _load(): Promise<void> {
        await super._load();
      }
      protected override async _draw(): Promise<void> {}
      protected override _attach(): void {}
      protected override async _stop(): Promise<void> {}
      protected override _destroy(): void {}
    }
    const comp = new MySoundComponent(mySoundComponentData);
    expectTypeOf(comp).toExtend<VFXComponent>();
  });
});
