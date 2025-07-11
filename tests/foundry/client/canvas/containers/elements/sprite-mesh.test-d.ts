import { expectTypeOf } from "vitest";

import FogSamplerShader = foundry.canvas.rendering.shaders.FogSamplerShader;
import OccludableSamplerShader = foundry.canvas.rendering.shaders.OccludableSamplerShader;
import SpriteMesh = foundry.canvas.containers.SpriteMesh;

declare const someTex: PIXI.Texture;

expectTypeOf(SpriteMesh.from(someTex)).toEqualTypeOf<SpriteMesh>();
expectTypeOf(
  SpriteMesh.from(someTex, {
    alphaMode: PIXI.ALPHA_MODES.PMA,
    scaleMode: PIXI.SCALE_MODES.LINEAR,
    // not doing an extensive test of PIXI.IBaseTextureOptions here
  }),
).toEqualTypeOf<SpriteMesh>();
expectTypeOf(
  SpriteMesh.from(
    someTex,
    {
      alphaMode: PIXI.ALPHA_MODES.PMA,
      scaleMode: PIXI.SCALE_MODES.LINEAR,
    },
    FogSamplerShader,
  ),
).toEqualTypeOf<SpriteMesh>();

const mySpriteMesh = new SpriteMesh();
declare const someRect: PIXI.Rectangle;

expectTypeOf(mySpriteMesh.isSprite).toBeBoolean();
expectTypeOf(mySpriteMesh["_batchData"]).toEqualTypeOf<SpriteMesh.BatchData>();
expectTypeOf(mySpriteMesh.indices).toEqualTypeOf<Uint16Array>();
expectTypeOf(mySpriteMesh["_width"]).toBeNumber();
expectTypeOf(mySpriteMesh["_height"]).toBeNumber();
expectTypeOf(mySpriteMesh["_texture"]).toEqualTypeOf<PIXI.Texture | null>();
expectTypeOf(mySpriteMesh["_textureID"]).toBeNumber();
expectTypeOf(mySpriteMesh["_cachedTint"]).toEqualTypeOf<Color.RGBAColorVector>();
expectTypeOf(mySpriteMesh["_textureTrimmedID"]).toBeNumber();
expectTypeOf(mySpriteMesh["uvs"]).toEqualTypeOf<Float32Array>();
expectTypeOf(mySpriteMesh["_anchor"]).toEqualTypeOf<PIXI.ObservablePoint<SpriteMesh>>();
expectTypeOf(mySpriteMesh["vertexData"]).toEqualTypeOf<Float32Array>();
expectTypeOf(mySpriteMesh["vertexTrimmedData"]).toEqualTypeOf<Float32Array | null>();
expectTypeOf(mySpriteMesh["_transformID"]).toBeNumber();
expectTypeOf(mySpriteMesh["_transformTrimmedID"]).toBeNumber();
expectTypeOf(mySpriteMesh["_tintColor"]).toEqualTypeOf<PIXI.Color>();
expectTypeOf(mySpriteMesh["_tintRGB"]).toBeNumber();
expectTypeOf(mySpriteMesh["_textureUvs"]).toEqualTypeOf<PIXI.TextureUvs | null>();
expectTypeOf(mySpriteMesh["_tintAlphaDirty"]).toEqualTypeOf<boolean>();
expectTypeOf(mySpriteMesh["_shader"]).toEqualTypeOf<foundry.canvas.rendering.shaders.BaseSamplerShader>();

expectTypeOf(mySpriteMesh.paddingX).toBeNumber();
mySpriteMesh.paddingX = 5; // Setter

expectTypeOf(mySpriteMesh.paddingY).toBeNumber();
mySpriteMesh.paddingY = 5; // Setter

expectTypeOf(mySpriteMesh.padding).toBeNumber();
mySpriteMesh.padding = 5; // Setter

expectTypeOf(mySpriteMesh["_paddingX"]).toBeNumber();
expectTypeOf(mySpriteMesh["_paddingY"]).toBeNumber();

expectTypeOf(mySpriteMesh.blendMode).toEqualTypeOf<PIXI.BLEND_MODES>();
mySpriteMesh.blendMode = PIXI.BLEND_MODES.DST_ATOP; // Setter

expectTypeOf(mySpriteMesh.roundPixels).toBeBoolean();
mySpriteMesh.roundPixels = true; // Setter

expectTypeOf(mySpriteMesh.alphaMode).toEqualTypeOf<PIXI.ALPHA_MODES>();
mySpriteMesh.alphaMode = PIXI.ALPHA_MODES.NO_PREMULTIPLIED_ALPHA; // Setter

expectTypeOf(mySpriteMesh.pluginName).toEqualTypeOf<string | null>();
mySpriteMesh.pluginName = "plugin!"; // Setter

expectTypeOf(mySpriteMesh.width).toBeNumber();
mySpriteMesh.width = 5; // Setter

expectTypeOf(mySpriteMesh.texture).toEqualTypeOf<PIXI.Texture | null>();
mySpriteMesh.texture = someTex; // Setter

expectTypeOf(mySpriteMesh.anchor).toEqualTypeOf<PIXI.ObservablePoint<SpriteMesh>>();
mySpriteMesh.anchor = new PIXI.ObservablePoint(function () {
  expectTypeOf(this._batchData).toEqualTypeOf<SpriteMesh.BatchData>();
}, mySpriteMesh); // Setter

expectTypeOf(mySpriteMesh.tint).toBeNumber();
mySpriteMesh.tint = 0x4f8cd2; // Setter

expectTypeOf(mySpriteMesh.sourceElement).toEqualTypeOf<PIXI.ImageSource | null>();
expectTypeOf(mySpriteMesh.isVideo).toBeBoolean();
expectTypeOf(mySpriteMesh["_onTextureUpdate"]()).toBeVoid();
expectTypeOf(mySpriteMesh["_onAnchorUpdate"]()).toBeVoid();
expectTypeOf(mySpriteMesh.updateUvs()).toBeVoid();
expectTypeOf(mySpriteMesh.setShaderClass(OccludableSamplerShader)).toBeVoid();
expectTypeOf(mySpriteMesh.updateTransform()).toBeVoid();
expectTypeOf(mySpriteMesh.calculateVertices()).toBeVoid();
expectTypeOf(mySpriteMesh.calculateTrimmedVertices()).toBeVoid();

declare const someRenderer: PIXI.Renderer;
expectTypeOf(mySpriteMesh["_render"](someRenderer)).toBeVoid();
expectTypeOf(mySpriteMesh["_updateBatchData"]()).toBeVoid();
expectTypeOf(mySpriteMesh["_calculateBounds"]()).toBeVoid();
expectTypeOf(mySpriteMesh.getLocalBounds(someRect)).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(mySpriteMesh.containsPoint({ x: 1, y: 2 })).toEqualTypeOf<boolean>();
expectTypeOf(mySpriteMesh.destroy()).toBeVoid();
