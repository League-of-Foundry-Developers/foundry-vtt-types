import { expectTypeOf } from "vitest";
import { ALPHA_MODES } from "pixi.js";

const myImageSource = new HTMLImageElement();

const myBaseImage = new PIXI.BaseImageResource(myImageSource);
const myRenderer = new PIXI.Renderer();
const myTexture = new PIXI.BaseTexture();
const myGLTexture = new PIXI.GLTexture(myTexture);

expectTypeOf(myBaseImage.upload(myRenderer, myTexture, myGLTexture)).toEqualTypeOf<boolean>();

expectTypeOf(PIXI.utils.detectVideoAlphaMode()).toEqualTypeOf<Promise<ALPHA_MODES>>();

// Possibly a TODO, but this is low priority as it's unlikely to be used by end users
// and will automatically be resolved by Foundry updating its PIXI version
// expectTypeOf(PIXI.loadVideo.name).toEqualTypeOf<string>();

expectTypeOf(PIXI.VideoResource.prototype.load()).toEqualTypeOf<Promise<PIXI.VideoResource>>();
