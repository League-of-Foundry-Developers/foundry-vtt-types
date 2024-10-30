import * as _PIXI from "pixi.js";
import * as pixiParticles from "@pixi/particle-emitter";
import * as graphicsSmooth from "@pixi/graphics-smooth";

export * from "pixi.js";

/**
 * Foundry exports PIXI into the global namespace
 */
export as namespace PIXI;

declare global {
  namespace PIXI {
    export import smooth = graphicsSmooth;
    export import particles = pixiParticles;

    export class Graphics extends PIXI.smooth.SmoothGraphics {}

    export import DisplayObject = _PIXI.DisplayObject;

    namespace DisplayObject {
      type AnyConstructor = typeof AnyDisplayObject;
    }
  }
}

declare abstract class AnyDisplayObject extends DisplayObject {
  constructor(arg0: never, ...args: never[]);
}

declare module "pixi.js" {
  export const LegacyGraphics: typeof _PIXI.Graphics;
  export type LegacyGraphics = _PIXI.Graphics;

  export enum UPDATE_PRIORITY {
    /**
     * @remarks Foundry defined custom ticker priority
     * Handled in Canvas##activateTicker
     */
    OBJECTS = 23,

    /**
     * @remarks Foundry defined custom ticker priority
     * Handled in Canvas##activateTicker
     */
    PERCEPTION = 2,
  }
}
