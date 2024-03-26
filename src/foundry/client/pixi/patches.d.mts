// export {};

// // Foundry adjustments to PIXI for video
// // Temporary workaround until PIXI 7.3.0 (pixijs/pixijs#9441)
// declare module "pixi.js" {
//   interface BaseImageResource {
//     upload(
//       renderer: PIXI.Renderer,
//       baseTexture: PIXI.BaseTexture,
//       glTexture: PIXI.GLTexture,
//       source?: HTMLImageElement | HTMLVideoElement | ImageBitmap | PIXI.ICanvas,
//     ): boolean;
//   }

//   namespace utils {
//     function detectVideoAlphaMode(): Promise<PIXI.ALPHA_MODES>;
//   }

//   const loadVideo: {
//     name: "loadVideo";
//     extension: {
//       type: PIXI.ExtensionType;
//       priority: PIXI.LoaderParserPriority;
//     };
//     config: PIXI.LoadVideoConfig;
//     test(url: string): void;
//     load(url: string, asset: unknown, loader: unknown): Promise<PIXI.Texture>;
//     unload(texture: PIXI.Texture): Promise<void>;
//   };

//   interface VideoResource {
//     load(): Promise<void>;

//     _onSeeked(): void;
//   }
// }
