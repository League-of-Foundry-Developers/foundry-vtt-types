import { expectTypeOf } from "vitest";

declare const pointSource: PointSource;
declare const scene: Scene;
declare const user: User;

expectTypeOf(FogExploration.get()).toEqualTypeOf<Promise<StoredDocument<FogExploration> | null>>();
expectTypeOf(FogExploration.get({})).toEqualTypeOf<Promise<StoredDocument<FogExploration> | null>>();
expectTypeOf(FogExploration.get({ user })).toEqualTypeOf<Promise<StoredDocument<FogExploration> | null>>();
expectTypeOf(FogExploration.get({ scene })).toEqualTypeOf<Promise<StoredDocument<FogExploration> | null>>();
expectTypeOf(FogExploration.get({ scene, user })).toEqualTypeOf<Promise<StoredDocument<FogExploration> | null>>();
expectTypeOf(FogExploration.get({}, { temporary: true })).toEqualTypeOf<
  Promise<StoredDocument<FogExploration> | null>
>();

const fogExploration = new FogExploration();

expectTypeOf(fogExploration.explore(pointSource)).toEqualTypeOf<boolean>();
expectTypeOf(fogExploration.explore(pointSource, true)).toEqualTypeOf<boolean>();

expectTypeOf(fogExploration.getTexture()).toEqualTypeOf<PIXI.Texture | null>();
