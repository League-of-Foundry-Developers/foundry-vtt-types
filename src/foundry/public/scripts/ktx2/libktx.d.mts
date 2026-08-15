import type { Brand } from "#utils";

declare global {
  /**
   * @remarks The factory for the Khronos KTX-Software `libktx` WebAssembly module, `v4.4.2`. Foundry
   * bundles it at `scripts/ktx2/libktx.js` and its KTX2 parser calls it with a `locateFile` that
   * resolves `libktx.wasm`.
   * @see {@link https://github.com/KhronosGroup/KTX-Software/blob/v4.4.2/interface/js_binding/ktx_wrapper.cpp}
   */
  var createKtxModule: LibKTX.ModuleFactory;

  /** @remarks An alias of {@linkcode createKtxModule} retained for backwards compatibility. */
  var LIBKTX: LibKTX.ModuleFactory;

  namespace LibKTX {
    type ModuleFactory = (options?: ModuleOptions) => Promise<Module>;

    interface ModuleOptions {
      /** @remarks Resolves files requested by the module, most importantly `libktx.wasm`. */
      locateFile?: ((path: string, scriptDirectory: string) => string) | undefined;

      preRun?: RuntimeCallback | RuntimeCallback[] | undefined;

      noFSInit?: boolean | undefined;

      postRun?: RuntimeCallback | RuntimeCallback[] | undefined;

      onAbort?: ((reason: unknown) => void) | undefined;

      instantiateWasm?:
        | ((
            imports: WebAssembly.Imports,
            successCallback: (instance: WebAssembly.Instance, module?: WebAssembly.Module) => void,
          ) => WebAssembly.Exports | void)
        | undefined;

      monitorRunDependencies?: ((remainingDependencies: number) => void) | undefined;

      logReadFiles?: boolean | undefined;

      stdin?: (() => number | null) | undefined;

      stdout?: ((character: number) => void) | undefined;

      stderr?: ((character: number) => void) | undefined;

      preinitializedWebGLContext?: WebGLRenderingContext | undefined;

      onExit?: ((status: number) => void) | undefined;

      noExitRuntime?: boolean | undefined;

      preloadPlugins?: PreloadPlugin[] | undefined;

      print?: ((message: string) => void) | undefined;

      printErr?: ((message: string) => void) | undefined;

      /** @remarks Pre-fetched contents of `libktx.wasm`, used in place of fetching it. */
      wasmBinary?: ArrayBuffer | undefined;

      arguments?: string[] | undefined;

      thisProgram?: string | undefined;

      preInit?: (() => void) | Array<() => void> | undefined;

      setStatus?: ((status: string) => void) | undefined;
    }

    type RuntimeCallback = (module: Module) => void;

    interface PreloadPlugin {
      canHandle(path: string): boolean;

      handle(data: Uint8Array, path: string): Uint8Array | Promise<Uint8Array>;
    }

    /**
     * @remarks The initialized module. The object passed to the factory *is* the module, so the
     * overrides given there are carried through onto the result.
     */
    interface Module extends ModuleOptions {
      /** @remarks The KTX texture class. */
      texture: TextureConstructor;

      /** @remarks An alias of {@linkcode LibKTX.Module.texture}, assigned once the runtime is initialized. */
      ktxTexture: TextureConstructor;

      error_code: ErrorCodes;

      /** @remarks An alias of {@linkcode LibKTX.Module.error_code}, assigned once the runtime is initialized. */
      ErrorCode: ErrorCodes;

      transcode_fmt: TranscodeTargets;

      /** @remarks An alias of {@linkcode LibKTX.Module.transcode_fmt}, assigned once the runtime is initialized. */
      TranscodeTarget: TranscodeTargets;

      transcode_flag_bits: TranscodeFlags;

      /**
       * @remarks An alias of {@linkcode LibKTX.Module.transcode_flag_bits}, assigned once the runtime is
       * initialized.
       */
      TranscodeFlags: TranscodeFlags;

      SupercmpScheme: SupercompressionSchemes;

      OrientationX: OrientationXValues;

      OrientationY: OrientationYValues;

      OrientationZ: OrientationZValues;

      khr_df_primaries: PrimariesValues;

      khr_df_transfer: TransferFunctionValues;

      TextureCreateStorageEnum: TextureCreateStorageValues;

      VkFormat: VkFormats;

      textureCreateInfo: TextureCreateInfoConstructor;

      pack_astc_quality_levels: AstcQualityValues;

      pack_astc_block_dimension: AstcBlockDimensionValues;

      pack_astc_encoder_mode: AstcEncoderModeValues;

      astcParams: AstcParamsConstructor;

      pack_uastc_flag_bits: UastcFlagValues;

      basisParams: BasisParamsConstructor;

      ANIMDATA_KEY: "KTXanimData";

      ORIENTATION_KEY: "KTXorientation";

      SWIZZLE_KEY: "KTXswizzle";

      WRITER_KEY: "KTXwriter";

      WRITER_SCPARAMS_KEY: "KTXwriterScParams";

      /** @remarks The lowercase `l` in `lEVEL` reproduces the upstream libktx binding name. */
      FACESLICE_WHOLE_lEVEL: number;

      ETC1S_DEFAULT_COMPRESSION_LEVEL: number;
    }

    /** @remarks A member of an `embind` enum; the underlying integer is on `value`. */
    interface ErrorCode {
      value: Brand<number, "LibKTX.ErrorCode">;
    }

    interface ErrorCodes {
      SUCCESS: ErrorCode;
      FILE_DATA_ERROR: ErrorCode;
      FILE_ISPIPE: ErrorCode;
      FILE_OPEN_FAILED: ErrorCode;
      FILE_OVERFLOW: ErrorCode;
      FILE_READ_ERROR: ErrorCode;
      FILE_SEEK_ERROR: ErrorCode;
      FILE_UNEXPECTED_ERROR: ErrorCode;
      FILE_WRITE_ERROR: ErrorCode;
      GL_ERROR: ErrorCode;
      INVALID_OPERATION: ErrorCode;
      INVALID_VALUE: ErrorCode;
      NOT_FOUND: ErrorCode;
      OUT_OF_MEMORY: ErrorCode;
      TRANSCODE_FAILED: ErrorCode;
      UNKNOWN_FILE_FORMAT: ErrorCode;
      UNSUPPORTED_TEXTURE_TYPE: ErrorCode;
      UNSUPPORTED_FEATURE: ErrorCode;
      LIBRARY_NOT_LINKED: ErrorCode;
      DECOMPRESS_LENGTH_ERROR: ErrorCode;
      DECOMPRESS_CHECKSUM_ERROR: ErrorCode;
    }

    /** @remarks A member of an `embind` enum; the underlying integer is on `value`. */
    interface TranscodeTarget {
      value: Brand<number, "LibKTX.TranscodeTarget">;
    }

    interface TranscodeTargets {
      ETC1_RGB: TranscodeTarget;
      ETC2_RGBA: TranscodeTarget;
      BC1_RGB: TranscodeTarget;
      BC3_RGBA: TranscodeTarget;
      /** @remarks Transcodes to `BC1_RGB` when the texture is opaque and `BC3_RGBA` when it has alpha. */
      BC1_OR_3: TranscodeTarget;
      BC4_R: TranscodeTarget;
      BC5_RG: TranscodeTarget;
      BC7_RGBA: TranscodeTarget;
      PVRTC1_4_RGB: TranscodeTarget;
      PVRTC1_4_RGBA: TranscodeTarget;
      ASTC_4x4_RGBA: TranscodeTarget;
      PVRTC2_4_RGB: TranscodeTarget;
      PVRTC2_4_RGBA: TranscodeTarget;
      ETC: TranscodeTarget;
      EAC_R11: TranscodeTarget;
      EAC_RG11: TranscodeTarget;
      RGBA32: TranscodeTarget;
      /** @remarks An upstream alias of {@linkcode LibKTX.TranscodeTargets.RGBA32}. */
      RGBA8888: TranscodeTarget;
      RGB565: TranscodeTarget;
      BGR565: TranscodeTarget;
      RGBA4444: TranscodeTarget;
    }

    /** @remarks A member of an `embind` enum; the underlying integer is on `value`. */
    interface TranscodeFlag {
      value: Brand<number, "LibKTX.TranscodeFlag">;
    }

    interface TranscodeFlags {
      TRANSCODE_ALPHA_DATA_TO_OPAQUE_FORMATS: TranscodeFlag;
    }

    /** @remarks A member of an `embind` enum; the underlying integer is on `value`. */
    interface SupercompressionScheme {
      value: Brand<number, "LibKTX.SupercompressionScheme">;
    }

    interface SupercompressionSchemes {
      NONE: SupercompressionScheme;
      BASIS_LZ: SupercompressionScheme;
      ZSTD: SupercompressionScheme;
      ZLIB: SupercompressionScheme;
    }

    /** @remarks A member of an `embind` enum; the underlying integer is on `value`. */
    interface OrientationX {
      value: Brand<number, "LibKTX.OrientationX">;
    }

    /** @remarks A member of an `embind` enum; the underlying integer is on `value`. */
    interface OrientationY {
      value: Brand<number, "LibKTX.OrientationY">;
    }

    /** @remarks A member of an `embind` enum; the underlying integer is on `value`. */
    interface OrientationZ {
      value: Brand<number, "LibKTX.OrientationZ">;
    }

    interface OrientationXValues {
      LEFT: OrientationX;
      RIGHT: OrientationX;
    }

    interface OrientationYValues {
      UP: OrientationY;
      DOWN: OrientationY;
    }

    interface OrientationZValues {
      IN: OrientationZ;
      OUT: OrientationZ;
    }

    interface Orientation {
      x: OrientationX;
      y: OrientationY;
      z: OrientationZ;
    }

    /** @remarks A member of an `embind` enum; the underlying integer is on `value`. */
    interface Primaries {
      value: Brand<number, "LibKTX.Primaries">;
    }

    interface PrimariesValues {
      UNSPECIFIED: Primaries;
      BT709: Primaries;
      SRGB: Primaries;
      DISPLAYP3: Primaries;
    }

    /** @remarks A member of an `embind` enum; the underlying integer is on `value`. */
    interface TransferFunction {
      value: Brand<number, "LibKTX.TransferFunction">;
    }

    interface TransferFunctionValues {
      UNSPECIFIED: TransferFunction;
      LINEAR: TransferFunction;
      SRGB: TransferFunction;
    }

    /** @remarks A member of an `embind` enum; the underlying integer is on `value`. */
    interface TextureCreateStorage {
      value: Brand<number, "LibKTX.TextureCreateStorage">;
    }

    interface TextureCreateStorageValues {
      NO_STORAGE: TextureCreateStorage;
      ALLOC_STORAGE: TextureCreateStorage;
    }

    /** @remarks A member of an `embind` enum; the underlying integer is on `value`. */
    interface VkFormat {
      value: Brand<number, "LibKTX.VkFormat">;
    }

    interface VkFormats {
      R8G8B8A8_SRGB: VkFormat;
      R8G8B8A8_UNORM: VkFormat;

      [name: string]: VkFormat;
    }

    interface TextureCreateInfoConstructor {
      readonly prototype: TextureCreateInfo;

      new (): TextureCreateInfo;
    }

    interface TextureCreateInfo {
      get vkFormat(): number;
      set vkFormat(value: VkFormat);

      baseWidth: number;
      baseHeight: number;
      baseDepth: number;
      numDimensions: number;
      numLevels: number;
      numLayers: number;
      numFaces: number;
      isArray: boolean;
      generateMipmaps: boolean;

      delete(): void;
    }

    /** @remarks A member of an `embind` enum; the underlying integer is on `value`. */
    interface AstcQuality {
      value: Brand<number, "LibKTX.AstcQuality">;
    }

    interface AstcQualityValues {
      FASTEST: AstcQuality;
      FAST: AstcQuality;
      MEDIUM: AstcQuality;
      THOROUGH: AstcQuality;
      EXHAUSTIVE: AstcQuality;
    }

    /** @remarks A member of an `embind` enum; the underlying integer is on `value`. */
    interface AstcBlockDimension {
      value: Brand<number, "LibKTX.AstcBlockDimension">;
    }

    interface AstcBlockDimensionValues {
      D4x4: AstcBlockDimension;
      D5x4: AstcBlockDimension;
      D5x5: AstcBlockDimension;
      D6x5: AstcBlockDimension;
      D6x6: AstcBlockDimension;
      D8x5: AstcBlockDimension;
      D8x6: AstcBlockDimension;
      D10x5: AstcBlockDimension;
      D10x6: AstcBlockDimension;
      D8x8: AstcBlockDimension;
      D10x8: AstcBlockDimension;
      D10x10: AstcBlockDimension;
      D12x10: AstcBlockDimension;
      D12x12: AstcBlockDimension;
      D3x3x3: AstcBlockDimension;
      D4x3x3: AstcBlockDimension;
      D4x4x3: AstcBlockDimension;
      D4x4x4: AstcBlockDimension;
      D5x4x4: AstcBlockDimension;
      D5x5x4: AstcBlockDimension;
      D5x5x5: AstcBlockDimension;
      D6x5x5: AstcBlockDimension;
      D6x6x5: AstcBlockDimension;
      D6x6x6: AstcBlockDimension;
    }

    /** @remarks A member of an `embind` enum; the underlying integer is on `value`. */
    interface AstcEncoderMode {
      value: Brand<number, "LibKTX.AstcEncoderMode">;
    }

    interface AstcEncoderModeValues {
      DEFAULT: AstcEncoderMode;
      LDR: AstcEncoderMode;
      HDR: AstcEncoderMode;
    }

    interface AstcParamsConstructor {
      readonly prototype: AstcParams;

      new (): AstcParams;
    }

    interface AstcParams {
      structSize: number;
      verbose: boolean;
      threadCount: number;

      get blockDimension(): number;
      set blockDimension(value: AstcBlockDimension);

      get mode(): number;
      set mode(value: AstcEncoderMode);

      get qualityLevel(): number;
      set qualityLevel(value: AstcQuality);

      normalMap: boolean;
      inputSwizzle: string;

      delete(): void;
    }

    /** @remarks A member of an `embind` enum; the underlying integer is on `value`. */
    interface UastcFlag {
      value: Brand<number, "LibKTX.UastcFlag">;
    }

    interface UastcFlagValues {
      LEVEL_FASTEST: UastcFlag;
      LEVEL_FASTER: UastcFlag;
      LEVEL_DEFAULT: UastcFlag;
      LEVEL_SLOWER: UastcFlag;
      LEVEL_VERYSLOW: UastcFlag;
    }

    interface BasisParamsConstructor {
      readonly prototype: BasisParams;

      new (): BasisParams;
    }

    interface BasisParams {
      structSize: number;
      uastc: boolean;
      verbose: boolean;
      noSSE: boolean;
      threadCount: number;
      inputSwizzle: string;
      preSwizzle: boolean;
      compressionLevel: number;
      qualityLevel: number;
      maxEndpoints: number;
      endpointRDOThreshold: number;
      maxSelectors: number;
      selectorRDOThreshold: number;
      normalMap: boolean;
      noEndpointRDO: boolean;
      noSelectorRDO: boolean;
      get uastcFlags(): number;

      set uastcFlags(value: UastcFlag);

      uastcRDO: boolean;
      uastcRDOQualityScalar: number;
      uastcRDODictSize: number;
      uastcRDOMaxSmoothBlockErrorScale: number;
      uastcRDOMaxSmoothBlockStdDev: number;
      uastcRDODontFavorSimplerModes: boolean;
      uastcRDONoMultithreading: boolean;

      delete(): void;
    }

    interface UploadResult {
      object: WebGLTexture | null | undefined;
      target: number;
      error: number;
    }

    type TypedArray =
      | Int8Array
      | Uint8Array
      | Uint8ClampedArray
      | Int16Array
      | Uint16Array
      | Int32Array
      | Uint32Array
      | Float16Array
      | Float32Array
      | Float64Array
      | BigInt64Array
      | BigUint64Array;

    /**
     * @remarks Constructs a texture from the bytes of a KTX or KTX2 file. Reachable only as
     * {@linkcode LibKTX.Module.texture}, since `embind` registers the class on the module when the
     * wasm loads rather than as a global.
     */
    interface TextureConstructor {
      readonly prototype: Texture;

      new (data: TypedArray): Texture;
      new (createInfo: TextureCreateInfo, storage: TextureCreateStorage): Texture;
    }

    interface Texture {
      createCopy(): Texture;

      readonly dataSize: number;

      readonly baseWidth: number;

      readonly baseHeight: number;

      oetf: TransferFunction;

      primaries: Primaries;

      readonly isSrgb: boolean;

      readonly isPremultiplied: boolean;

      /** @remarks Whether the texture is Basis Universal encoded and must be transcoded before upload. */
      readonly needsTranscoding: boolean;

      /** @remarks KTX2 textures only; `0` for a KTX texture. */
      readonly numComponents: number;

      readonly orientation: Orientation;

      readonly supercompressScheme: SupercompressionScheme;

      /** @remarks The Vulkan format identifier. KTX2 textures only; `0` for a KTX texture. */
      readonly vkFormat: number;

      findKeyValue(key: string): Uint8Array | null;

      getImage(level: number, layer: number, faceSlice: number): Uint8Array | null;

      glUpload(): UploadResult;

      decodeAstc(): ErrorCode;

      /** @returns `SUCCESS` if the texture was transcoded, otherwise the code describing the failure. */
      transcodeBasis(target: TranscodeTarget, transcodeFlags: number): ErrorCode;

      compressAstc(params: AstcParams): ErrorCode;

      compressBasis(params: BasisParams): ErrorCode;

      deflateZstd(compressionLevel: number): ErrorCode;

      deflateZLIB(compressionLevel: number): ErrorCode;

      addKVPairString(key: string, value: string): ErrorCode;

      addKVPairByte(key: string, value: TypedArray): ErrorCode;

      deleteKVPair(key: string): ErrorCode;

      setImageFromMemory(level: number, layer: number, faceSlice: number, image: TypedArray): ErrorCode;

      writeToMemory(): Uint8Array | null;

      /** @remarks Frees the underlying C++ object. Every texture must be deleted to avoid leaking memory. */
      delete(): void;
    }
  }
}
