import { expectTypeOf } from "vitest";

expectTypeOf(createKtxModule).toEqualTypeOf<LibKTX.ModuleFactory>();
expectTypeOf(LIBKTX).toEqualTypeOf<LibKTX.ModuleFactory>();

expectTypeOf(createKtxModule()).toEqualTypeOf<Promise<LibKTX.Module>>();
expectTypeOf(
  createKtxModule({ locateFile: (path) => (path === "libktx.wasm" ? "scripts/ktx2/libktx.wasm" : path) }),
).toEqualTypeOf<Promise<LibKTX.Module>>();

declare const ktx: LibKTX.Module;

expectTypeOf(ktx.ktxTexture).toEqualTypeOf<LibKTX.TextureConstructor>();
expectTypeOf(ktx.texture).toEqualTypeOf<LibKTX.TextureConstructor>();
expectTypeOf(ktx.ErrorCode).toEqualTypeOf<LibKTX.ErrorCodes>();
expectTypeOf(ktx.TranscodeTarget).toEqualTypeOf<LibKTX.TranscodeTargets>();
expectTypeOf(ktx.TranscodeFlags).toEqualTypeOf<LibKTX.TranscodeFlags>();

declare const bytes: Uint8Array;
declare const dataView: DataView;

const texture = new ktx.texture(bytes);

// @ts-expect-error Embind requires a typed array and rejects DataView at runtime.
new ktx.texture(dataView);

expectTypeOf(texture).toEqualTypeOf<LibKTX.Texture>();

expectTypeOf(texture.needsTranscoding).toEqualTypeOf<boolean>();
expectTypeOf(texture.isPremultiplied).toEqualTypeOf<boolean>();
expectTypeOf(texture.baseWidth).toEqualTypeOf<number>();
expectTypeOf(texture.vkFormat).toEqualTypeOf<number>();
expectTypeOf(texture.transcodeBasis(ktx.TranscodeTarget.ASTC_4x4_RGBA, 0)).toEqualTypeOf<LibKTX.ErrorCode>();
expectTypeOf(texture.transcodeBasis(ktx.TranscodeTarget.RGBA32, 0)).toEqualTypeOf<LibKTX.ErrorCode>();
expectTypeOf(texture.transcodeBasis(ktx.TranscodeTarget.RGBA8888, 0)).toEqualTypeOf<LibKTX.ErrorCode>();
expectTypeOf(texture.getImage(0, 0, 0)).toEqualTypeOf<Uint8Array | null>();
expectTypeOf(texture.getImage(0, 0, ktx.FACESLICE_WHOLE_lEVEL)).toEqualTypeOf<Uint8Array | null>();
expectTypeOf(texture.findKeyValue("KTXorientation")).toEqualTypeOf<Uint8Array | null>();
expectTypeOf(texture.orientation).toEqualTypeOf<LibKTX.Orientation>();
expectTypeOf(texture.supercompressScheme).toEqualTypeOf<LibKTX.SupercompressionScheme>();
expectTypeOf(texture.glUpload()).toEqualTypeOf<LibKTX.UploadResult>();
expectTypeOf<LibKTX.UploadResult["object"]>().toEqualTypeOf<WebGLTexture | null | undefined>();
expectTypeOf(texture.decodeAstc()).toEqualTypeOf<LibKTX.ErrorCode>();
expectTypeOf(texture.writeToMemory()).toEqualTypeOf<Uint8Array | null>();
expectTypeOf(texture.delete()).toEqualTypeOf<void>();

// @ts-expect-error Embind requires a typed array and rejects DataView at runtime.
texture.addKVPairByte("key", dataView);

const createInfo = new ktx.textureCreateInfo();
createInfo.vkFormat = ktx.VkFormat.R8G8B8A8_SRGB;
expectTypeOf(createInfo.vkFormat).toEqualTypeOf<number>();
expectTypeOf(createInfo.delete()).toEqualTypeOf<void>();
const createdTexture = new ktx.texture(createInfo, ktx.TextureCreateStorageEnum.ALLOC_STORAGE);
expectTypeOf(createdTexture).toEqualTypeOf<LibKTX.Texture>();

const astcParams = new ktx.astcParams();
astcParams.blockDimension = ktx.pack_astc_block_dimension.D4x4;
expectTypeOf(astcParams.blockDimension).toEqualTypeOf<number>();
astcParams.mode = ktx.pack_astc_encoder_mode.DEFAULT;
expectTypeOf(astcParams.mode).toEqualTypeOf<number>();
astcParams.qualityLevel = ktx.pack_astc_quality_levels.FAST;
expectTypeOf(astcParams.qualityLevel).toEqualTypeOf<number>();
expectTypeOf(astcParams.delete()).toEqualTypeOf<void>();
expectTypeOf(texture.compressAstc(astcParams)).toEqualTypeOf<LibKTX.ErrorCode>();

const basisParams = new ktx.basisParams();
basisParams.uastcFlags = ktx.pack_uastc_flag_bits.LEVEL_DEFAULT;
expectTypeOf(basisParams.uastcFlags).toEqualTypeOf<number>();
expectTypeOf(basisParams.delete()).toEqualTypeOf<void>();
expectTypeOf(texture.compressBasis(basisParams)).toEqualTypeOf<LibKTX.ErrorCode>();

// A transcode result is compared against `SUCCESS` by its underlying integer.
expectTypeOf(
  texture.transcodeBasis(ktx.TranscodeTarget.BC1_OR_3, 0).value !== ktx.ErrorCode.SUCCESS.value,
).toEqualTypeOf<boolean>();

expectTypeOf<LibKTX.ModuleOptions["locateFile"]>().toEqualTypeOf<
  ((url: string, scriptDirectory: string) => string) | undefined
>();
expectTypeOf<LibKTX.ModuleOptions["wasmBinary"]>().toEqualTypeOf<ArrayBuffer | undefined>();
expectTypeOf<LibKTX.ModuleOptions["instantiateWasm"]>().not.toBeNever();
expectTypeOf(createKtxModule({ preInit: () => {}, preRun: () => {}, postRun: [() => {}] })).toEqualTypeOf<
  Promise<LibKTX.Module>
>();

expectTypeOf<LibKTX.Module["locateFile"]>().toEqualTypeOf<LibKTX.ModuleOptions["locateFile"]>();
