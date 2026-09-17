import type { Identity } from "#utils";

/**
 * A KTX2 PIXI loader parser using the official Khronos KTX module in a worker.
 */
declare class KTX2Parser {
  /**
   * The default path to the Khronos libktx WebAssembly module.
   * @defaultValue `"scripts/ktx2/libktx.wasm"`
   */
  static WASM_PATH: string;

  /**
   * A PIXI asset detection parser for KTX2 textures.
   */
  static detectKTX2: PIXI.FormatDetectionParser;

  /**
   * A PIXI asset resolver for KTX2 texture URLs.
   */
  static resolveKTX2TextureUrl: PIXI.ResolveURLParser;

  /**
   * A PIXI asset loader parser for KTX2 textures.
   */
  static loadKTX2: PIXI.LoaderParser<PIXI.Texture>;

  /**
   * The initialized Khronos KTX module.
   */
  static get module(): LibKTX.Module | null;

  /**
   * Has the Khronos KTX module been initialized?
   */
  static get initialized(): boolean;

  /**
   * Initialize the Khronos KTX module.
   * The main-thread module remains available to callers; texture loading uses a separate worker instance.
   * @param options - Initialization options. (default: `{}`)
   * @returns The initialized Khronos KTX module.
   * @remarks
   * @throws If the Khronos libktx script has not been loaded, or if it initializes an invalid
   * module.
   */
  static initialize(options?: KTX2Parser.InitOptions): Promise<LibKTX.Module>;

  /**
   * Load a KTX2 URL as a PIXI compressed texture resource.
   * @param url     - The texture URL.
   * @param options - Parser options.
   * @returns The compressed texture resource.
   * @remarks
   * @throws If the fetch response is not ok, or for any reason {@linkcode KTX2Parser.parse} throws.
   */
  static loadResource(url: string, options?: KTX2Parser.ParseOptions): Promise<PIXI.CompressedTextureResource>;

  /**
   * Parse KTX2 data in a worker and create a PIXI compressed texture resource.
   * The input remains available to the caller unless transfer is explicitly enabled.
   * @param data    - The KTX2 file data.
   * @param options - Parser options.
   * @returns The compressed texture resource.
   * @remarks
   * @throws If the data is not a valid KTX2 file, if the texture is not 2D, if it cannot be transcoded to a
   * supported target, if its GPU format is unsupported, or if the worker cannot be started.
   */
  static parse(
    data: ArrayBuffer | Uint8Array,
    options?: KTX2Parser.ParseOptions,
  ): Promise<PIXI.CompressedTextureResource>;

  static #KTX2Parser: true;
}

declare namespace KTX2Parser {
  interface Any extends AnyKTX2Parser {}
  interface AnyConstructor extends Identity<typeof AnyKTX2Parser> {}

  interface InitOptions {
    /** The URL of the libktx WebAssembly module. */
    wasmPath?: string | undefined;
  }

  interface ParseOptions {
    /** A Khronos transcode target name. */
    transcodeTarget?: string | undefined;

    /**
     * Transfer the input buffer to the worker, detaching it from the caller.
     * @defaultValue `false`
     */
    transfer?: boolean | undefined;
  }

  /**
   * @privateRemarks Returned only by `readKTX2Header` in the KTX2 transcoder worker script,
   * so nothing in the main-thread surface returns one.
   */
  interface Header {
    /** The KTX2 GPU format identifier. */
    gpuFormat: number;

    /** The base level width. */
    pixelWidth: number;

    /** The base level height. */
    pixelHeight: number;

    /** The base level depth. */
    pixelDepth: number;

    /** The array layer count. */
    layerCount: number;

    /** The face count. */
    faceCount: number;

    /** The embedded mip level count. */
    levelCount: number;

    /** The KTX2 supercompression scheme. */
    supercompressionScheme: number;
  }

  /**
   * @privateRemarks Returned only by `getKTX2TranscodeTarget` in the KTX2 transcoder worker script,
   * so nothing in the main-thread surface returns one.
   */
  interface TranscodeTarget {
    /** The Khronos transcode target name. */
    name: string;

    /** The Khronos transcode target enum value. */
    target: LibKTX.TranscodeTarget;
  }

  /**
   * @privateRemarks Returned by `transcodeKTX2` in the KTX2 transcoder worker script and read only by a private
   * static, so nothing in the main-thread surface returns one.
   */
  interface TranscodeResult {
    /** The transcoded KTX2 GPU format identifier. */
    gpuFormat: number;

    /** The base level width. */
    width: number;

    /** The base level height. */
    height: number;

    /** Whether the texture uses premultiplied alpha. */
    isPremultiplied: boolean;

    /** The transferred compressed mip levels. */
    levelBuffers: PIXI.CompressedLevelBuffer[];
  }
}

export default KTX2Parser;

declare abstract class AnyKTX2Parser extends KTX2Parser {
  constructor(...args: never);
}
