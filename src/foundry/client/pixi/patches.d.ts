import {
  ALPHA_MODES,
  BaseTexture,
  ExtensionType,
  GLTexture,
  ICanvas,
  LoadVideoConfig,
  LoaderParserPriority,
  Renderer,
  Texture,
} from "pixi.js";

export {};

// Foundry adjustments to PIXI for video
// Temporary workaround until PIXI 7.3.0 (pixijs/pixijs#9441)
declare global {
  namespace PIXI {
    interface BaseImageResource {
      upload(
        renderer: Renderer,
        baseTexture: BaseTexture,
        glTexture: GLTexture,
        source?: HTMLImageElement | HTMLVideoElement | ImageBitmap | ICanvas,
      ): boolean;
    }

    namespace utils {
      function detectVideoAlphaMode(): Promise<ALPHA_MODES>;
    }

    const loadVideo: {
      name: "loadVideo";
      extension: {
        type: ExtensionType;
        priority: LoaderParserPriority;
      };
      config: LoadVideoConfig;
      test(url: string): void;
      load(url: string, asset: unknown, loader: unknown): Promise<Texture>;
      unload(texture): Promise<void>;
    };

    interface VideoResource {
      load(): Promise<void>;

      _onSeeked(): void;
    }
  }
}
