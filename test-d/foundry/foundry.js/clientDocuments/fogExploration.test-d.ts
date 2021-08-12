import { expectType } from 'tsd';

declare const pointSource: PointSource;
declare const scene: Scene;
declare const user: User;

expectType<Promise<StoredDocument<FogExploration> | null>>(FogExploration.get());
expectType<Promise<StoredDocument<FogExploration> | null>>(FogExploration.get({}));
expectType<Promise<StoredDocument<FogExploration> | null>>(FogExploration.get({ user }));
expectType<Promise<StoredDocument<FogExploration> | null>>(FogExploration.get({ scene }));
expectType<Promise<StoredDocument<FogExploration> | null>>(FogExploration.get({ scene, user }));
expectType<Promise<StoredDocument<FogExploration> | null>>(FogExploration.get({}, { temporary: true }));

const fogExploration = new FogExploration();

expectType<boolean>(fogExploration.explore(pointSource));
expectType<boolean>(fogExploration.explore(pointSource, true));

expectType<PIXI.Texture | null>(fogExploration.getTexture());
