import { expectTypeOf } from "vitest";

new FogExploration.implementation();
new FogExploration.implementation({});

declare const scene: string;
declare const user: string;

expectTypeOf(FogExploration.load()).toEqualTypeOf<Promise<FogExploration.Implementation | null>>();
expectTypeOf(FogExploration.load({})).toEqualTypeOf<Promise<FogExploration.Implementation | null>>();
expectTypeOf(FogExploration.load({ user })).toEqualTypeOf<Promise<FogExploration.Implementation | null>>();
expectTypeOf(FogExploration.load({ scene })).toEqualTypeOf<Promise<FogExploration.Implementation | null>>();
expectTypeOf(FogExploration.load({ scene, user }, {})).toEqualTypeOf<Promise<FogExploration.Implementation | null>>();

const fogExploration = new FogExploration.implementation();
expectTypeOf(fogExploration).toEqualTypeOf<FogExploration.Implementation>();

expectTypeOf(fogExploration.getTexture()).toEqualTypeOf<PIXI.Texture | null>();
