import { expectTypeOf } from "vitest";
// TODO: FogExploration in v11 breaks inheritance, correctly annotating that breaks other things

// declare const scene: Scene;
// declare const user: User;

// expectTypeOf(FogExploration.get()).toEqualTypeOf<Promise<Document.Stored<FogExploration> | null>>();
// expectTypeOf(FogExploration.get({})).toEqualTypeOf<Promise<Document.Stored<FogExploration> | null>>();
// expectTypeOf(FogExploration.get({ user })).toEqualTypeOf<Promise<Document.Stored<FogExploration> | null>>();
// expectTypeOf(FogExploration.get({ scene })).toEqualTypeOf<Promise<Document.Stored<FogExploration> | null>>();
// expectTypeOf(FogExploration.get({ scene, user })).toEqualTypeOf<Promise<Document.Stored<FogExploration> | null>>();
// expectTypeOf(FogExploration.get({}, { temporary: true })).toEqualTypeOf<
//   Promise<Document.Stored<FogExploration> | null>
// >();

const fogExploration = new FogExploration();

expectTypeOf(fogExploration.getTexture()).toEqualTypeOf<PIXI.Texture | null>();
