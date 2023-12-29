export {};

// Foundry adjustments to PIXI for video
// Temporary workaround until PIXI 7.3.0 (pixijs/pixijs#9441)
declare global {
  namespace PIXI {
    interface BaseImageResource {
      upload(renderer: unknown, baseTexture: unknown, glTexture: unknown, source: unknown): unknown;
    }

    namespace utils {
      function detectVideoAlphaMode(): unknown;
    }

    const loadVideo: unknown;

    interface VideoResource {
      load(): unknown;

      _onSeeked(): unknown;
    }
  }
}
