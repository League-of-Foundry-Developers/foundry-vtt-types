import * as _PIXI from "pixi.js";
import * as pixiParticles from "@pixi/particle-emitter";
import * as graphicsSmooth from "@pixi/graphics-smooth";

export * from "pixi.js";

/**
 * Foundry exports PIXI into the global namespace
 */
export as namespace PIXI;

declare abstract class AnyPIXIShader extends PIXI.Shader {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnyPIXIFilter extends PIXI.Filter {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnyPIXIBatchGeometry extends PIXI.BatchGeometry {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnyPIXIBatchRenderer extends PIXI.BatchRenderer {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnyDisplayObject extends PIXI.DisplayObject {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace PIXI {
    export import smooth = graphicsSmooth;
    export import particles = pixiParticles;

    export class Graphics extends PIXI.smooth.SmoothGraphics {}

    export import Shader = _PIXI.Shader;

    namespace Shader {
      type AnyConstructor = typeof AnyPIXIShader;
    }

    export import Filter = _PIXI.Filter;

    namespace Filter {
      type AnyConstructor = typeof AnyPIXIFilter;
    }

    export import BatchGeometry = _PIXI.BatchGeometry;

    namespace BatchGeometry {
      type AnyConstructor = typeof AnyPIXIBatchGeometry;
    }

    export import BatchRenderer = _PIXI.BatchRenderer;

    namespace BatchRenderer {
      type AnyConstructor = typeof AnyPIXIBatchRenderer;
    }

    export import DisplayObject = _PIXI.DisplayObject;

    namespace DisplayObject {
      type AnyConstructor = typeof AnyDisplayObject;
    }
  }
}

declare module "pixi.js" {
  export import LegacyGraphics = _PIXI.Graphics;

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
