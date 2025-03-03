import { expectTypeOf } from "vitest";

declare const someRegion: Region.ConfiguredInstance;

const myRM = new foundry.canvas.regions.RegionMesh(someRegion, RegionShader);

expectTypeOf(myRM.region).toEqualTypeOf<Region.ConfiguredInstance>();
expectTypeOf(myRM.shader).toEqualTypeOf<AbstractBaseShader>();

expectTypeOf(myRM.blendMode).toMatchTypeOf<PIXI.BLEND_MODES>();
expectTypeOf((myRM.blendMode = PIXI.BLEND_MODES.DST_ATOP)).toMatchTypeOf<PIXI.BLEND_MODES>();

expectTypeOf(myRM.tint).toBeNumber();
expectTypeOf((myRM.tint = 0xabcedf)).toBeNumber();

expectTypeOf(myRM["_tintColor"]).toEqualTypeOf<PIXI.Color>();
expectTypeOf(myRM["_cachedTint"]).toEqualTypeOf<Color.RGBAColorVector>();
expectTypeOf(myRM["_tintAlphaDirty"]).toBeBoolean();

expectTypeOf(myRM.setShaderClass(PulseColorationShader)).toBeVoid();
expectTypeOf(myRM.updateTransform()).toBeVoid();

declare const someRenderer: PIXI.Renderer;
expectTypeOf(myRM["_render"](someRenderer)).toBeVoid();
expectTypeOf(myRM["_calculateBounds"]()).toBeVoid();

expectTypeOf(myRM.containsPoint({ x: 50, y: 50 })).toBeBoolean();
