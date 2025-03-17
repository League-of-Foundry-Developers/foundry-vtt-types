import { expectTypeOf } from "vitest";
import SceneManager = foundry.canvas.SceneManager;

declare const someScene: Scene.ConfiguredInstance;
const mySM = new SceneManager(someScene);

expectTypeOf(mySM.scene).toEqualTypeOf<Scene.ConfiguredInstance>();
expectTypeOf(mySM["_onInit"]()).toEqualTypeOf<Promise<void>>();
expectTypeOf(mySM["_onDraw"]()).toEqualTypeOf<Promise<void>>();
expectTypeOf(mySM["_onReady"]()).toEqualTypeOf<Promise<void>>();
expectTypeOf(mySM["_onTearDown"]()).toEqualTypeOf<Promise<void>>();
expectTypeOf(mySM["_registerHooks"]()).toBeVoid();
expectTypeOf(mySM["_deactivateHooks"]()).toBeVoid();

expectTypeOf(mySM.registerHooks("foo", () => "foo!")).toBeVoid();
expectTypeOf(mySM.registerHooks("foo", (pt: number) => pt * 2)).toBeVoid();
expectTypeOf(mySM.registerHooks("foo", (name: string) => name.length > 4)).toBeVoid();
