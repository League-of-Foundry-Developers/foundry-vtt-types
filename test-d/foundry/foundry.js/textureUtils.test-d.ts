import { expectType } from 'tsd';

expectType<Promise<boolean>>(srcExists('path/to/texture'));

expectType<PIXI.Texture | null>(getTexture('path/to/texture'));

expectType<Promise<PIXI.Texture>>(loadTexture('path/to/texture'));
expectType<Promise<PIXI.Texture>>(loadTexture('path/to/texture', {}));
expectType<Promise<PIXI.Texture>>(loadTexture('path/to/texture', { fallback: 'path/to/another/texture' }));
