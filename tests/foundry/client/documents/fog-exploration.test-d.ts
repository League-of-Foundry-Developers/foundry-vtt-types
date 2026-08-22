import { expectTypeOf } from "vitest";

new FogExploration.implementation();
new FogExploration.implementation({});

declare const scene: string;
declare const user: string;

expectTypeOf(FogExploration.load()).toEqualTypeOf<Promise<FogExploration.Stored | null>>();
expectTypeOf(FogExploration.load({})).toEqualTypeOf<Promise<FogExploration.Stored | null>>();
expectTypeOf(FogExploration.load({ user })).toEqualTypeOf<Promise<FogExploration.Stored | null>>();
expectTypeOf(FogExploration.load({ scene })).toEqualTypeOf<Promise<FogExploration.Stored | null>>();
expectTypeOf(FogExploration.load({ scene, user }, {})).toEqualTypeOf<Promise<FogExploration.Stored | null>>();

const fogExploration = new FogExploration.implementation();
expectTypeOf(fogExploration).toEqualTypeOf<FogExploration.Implementation>();

expectTypeOf(fogExploration.getTexture()).toEqualTypeOf<PIXI.Texture | null>();

declare const someScene: Scene.Stored;
declare const someUser: User.Stored;

expectTypeOf(FogExploration.load({ scene: someScene, user: someUser })).toEqualTypeOf<
  Promise<FogExploration.Stored | null>
>();
expectTypeOf(FogExploration.load({ scene: "aSceneId", user: "aUserId" })).toEqualTypeOf<
  Promise<FogExploration.Stored | null>
>();
