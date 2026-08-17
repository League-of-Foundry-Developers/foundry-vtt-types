import type { Identity } from "#utils";

/**
 * A KTX2 PIXI loader parser using the official Khronos KTX module.
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
   */
  static loadResource(url: string, options?: KTX2Parser.ParseOptions): Promise<PIXI.CompressedTextureResource>;

  /**
   * Parse KTX2 data as a PIXI compressed texture resource.
   * @param data    - The KTX2 file data.
   * @param options - Parser options.
   * @returns The compressed texture resource.
   * @remarks
   * @throws If the data is not a valid KTX2 file, if the texture is not 2D, or if its GPU format
   * is unsupported.
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
  }
}

export default KTX2Parser;

declare abstract class AnyKTX2Parser extends KTX2Parser {
  constructor(...args: never);
}
