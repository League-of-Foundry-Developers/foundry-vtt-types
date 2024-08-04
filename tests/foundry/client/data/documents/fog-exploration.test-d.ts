import { expectTypeOf } from "vitest";

new FogExploration();
new FogExploration({});

declare const scene: string;
declare const user: string;

expectTypeOf(FogExploration.load()).toEqualTypeOf<Promise<FogExploration | null>>();
expectTypeOf(FogExploration.load({})).toEqualTypeOf<Promise<FogExploration | null>>();
expectTypeOf(FogExploration.load({ user })).toEqualTypeOf<Promise<FogExploration | null>>();
expectTypeOf(FogExploration.load({ scene })).toEqualTypeOf<Promise<FogExploration | null>>();
expectTypeOf(FogExploration.load({ scene, user }, {})).toEqualTypeOf<Promise<FogExploration | null>>();

const fogExploration = new FogExploration();
expectTypeOf(fogExploration).toEqualTypeOf<FogExploration>();

expectTypeOf(fogExploration.getTexture()).toEqualTypeOf<PIXI.Texture | null>();
