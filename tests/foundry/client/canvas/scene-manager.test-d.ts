import { expectTypeOf } from "vitest";
import SceneManager = foundry.canvas.SceneManager;
import Canvas = foundry.canvas.Canvas;

declare const someScene: Scene.Implementation;
declare const someLevels: Set<Level.Implementation>;
declare const someTextures: Canvas.SceneTextures;

const mySM = new SceneManager(someScene);

expectTypeOf(mySM.scene).toEqualTypeOf<Scene.Implementation>();
expectTypeOf(mySM["_determineInitialLevel"]()).toEqualTypeOf<string | void>();
expectTypeOf(mySM["_getAvailableLevels"](someLevels)).toEqualTypeOf<Set<Level.Implementation> | void>();
expectTypeOf(mySM["_onInit"]()).toEqualTypeOf<Promise<void>>();
expectTypeOf(mySM["_loadTextures"](someTextures, ["foo.webp"], someLevels.values().next().value!)).toBeVoid();
expectTypeOf(mySM["_onDraw"]()).toEqualTypeOf<Promise<void>>();
expectTypeOf(mySM["_onReady"]()).toEqualTypeOf<Promise<void>>();
expectTypeOf(mySM["_onTearDown"]({})).toEqualTypeOf<Promise<void>>();
expectTypeOf(mySM["_onTearDown"]({ nextScene: someScene, nextLevel: null })).toEqualTypeOf<Promise<void>>();
expectTypeOf(mySM["_registerHooks"]()).toBeVoid();
expectTypeOf(mySM["_deactivateHooks"]()).toBeVoid();

expectTypeOf(mySM.registerHook("foo", () => "foo!")).toBeVoid();
expectTypeOf(mySM.registerHook("foo", (pt: number) => pt * 2)).toBeVoid();
expectTypeOf(mySM.registerHook("foo", (name: string) => name.length > 4)).toBeVoid();

// A subclass overriding the protected life-cycle hooks.
class MySceneManager extends SceneManager {
  protected override _determineInitialLevel(): string | void {
    return this.scene.id ?? undefined;
  }

  protected override async _onTearDown(options: Canvas.TearDownOptions): Promise<void> {
    expectTypeOf(options.nextScene).toEqualTypeOf<Scene.Implementation | null | undefined>();
    expectTypeOf(options.nextLevel).toEqualTypeOf<Level.Implementation | null | undefined>();
  }
}

expectTypeOf(new MySceneManager(someScene)).toExtend<SceneManager>();
