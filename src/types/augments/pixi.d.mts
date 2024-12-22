import * as _PIXI from "pixi.js";
import type { Brand } from "src/utils/index.d.mts";

// Note(LukeAbby): The `smooth.d.mts` and `smooth.d.mts` files exist to make it DRY to selectively tweak PIXI sub-namespaces.
// Each of them write `export * from "..."` and then selectively shadow or augment the exports.

// eslint-disable-next-line import/extensions
import * as _smooth from "./smooth.mjs";

// eslint-disable-next-line import/extensions
import * as _particles from "./particles.mjs";

export * from "pixi.js";

/**
 * Foundry exports PIXI into the global namespace
 */
export as namespace PIXI;

declare global {
  namespace PIXI {
    /*****************************
     * Enum to Brand conversions *
     *****************************/
    type ALPHA_MODES = Brand<number, "PIXI.ALPHA_MODES">;
    const ALPHA_MODES: Record<keyof typeof _PIXI.ALPHA_MODES, PIXI.ALPHA_MODES>;

    /** @privateRemarks Merges Foundry's extra keys */
    type BLEND_MODES = Brand<number, "PIXI.BLEND_MODES">;
    const BLEND_MODES: Record<keyof typeof _PIXI.BLEND_MODES | "MAX_COLOR" | "MIN_COLOR" | "MIN_ALL", PIXI.BLEND_MODES>;

    type BUFFER_BITS = Brand<number, "PIXI.BUFFER_BITS">;
    const BUFFER_BITS: Record<keyof typeof _PIXI.BUFFER_BITS, PIXI.BUFFER_BITS>;

    type BUFFER_TYPE = Brand<number, "PIXI.BUFFER_TYPE">;
    const BUFFER_TYPE: Record<keyof typeof _PIXI.BUFFER_TYPE, PIXI.BUFFER_TYPE>;

    type CLEAR_MODES = Brand<number, "PIXI.CLEAR_MODES">;
    const CLEAR_MODES: Record<keyof typeof _PIXI.CLEAR_MODES, PIXI.CLEAR_MODES>;

    type COLOR_MASK_BITS = Brand<number, "PIXI.COLOR_MASK_BITS">;
    const COLOR_MASK_BITS: Record<keyof typeof _PIXI.COLOR_MASK_BITS, PIXI.COLOR_MASK_BITS>;

    type DRAW_MODES = Brand<number, "PIXI.DRAW_MODES">;
    const DRAW_MODES: Record<keyof typeof _PIXI.DRAW_MODES, PIXI.DRAW_MODES>;

    type ENV = Brand<number, "PIXI.ENV">;
    const ENV: Record<keyof typeof _PIXI.ENV, PIXI.ENV>;

    type ExtensionType = Brand<string, "PIXI.ExtensionType">;
    const ExtensionType: Record<keyof typeof _PIXI.ExtensionType, PIXI.ExtensionType>;

    type FORMATS = Brand<number, "PIXI.FORMATS">;
    const FORMATS: Record<keyof typeof _PIXI.FORMATS, PIXI.FORMATS>;

    type GC_MODES = Brand<number, "PIXI.GC_MODES">;
    const GC_MODES: Record<keyof typeof _PIXI.GC_MODES, PIXI.GC_MODES>;

    type INTERNAL_FORMATS = Brand<number, "PIXI.INTERNAL_FORMATS">;
    const INTERNAL_FORMATS: Record<keyof typeof _PIXI.INTERNAL_FORMATS, PIXI.INTERNAL_FORMATS>;

    type LINE_CAP = Brand<string, "PIXI.LINE_CAP">;
    const LINE_CAP: Record<keyof typeof _PIXI.LINE_CAP, PIXI.LINE_CAP>;

    type LINE_JOIN = Brand<string, "PIXI.LINE_JOIN">;
    const LINE_JOIN: Record<keyof typeof _PIXI.LINE_JOIN, PIXI.LINE_JOIN>;

    type LoaderParserPriority = Brand<number, "PIXI.LoaderParserPriority">;
    const LoaderParserPriority: Record<keyof typeof _PIXI.LoaderParserPriority, PIXI.LoaderParserPriority>;

    type MASK_TYPES = Brand<number, "PIXI.MASK_TYPES">;
    const MASK_TYPES: Record<keyof typeof _PIXI.MASK_TYPES, PIXI.MASK_TYPES>;

    type MIPMAP_MODES = Brand<number, "PIXI.MIPMAP_MODES">;
    const MIPMAP_MODES: Record<keyof typeof _PIXI.MIPMAP_MODES, PIXI.MIPMAP_MODES>;

    type MSAA_QUALITY = Brand<number, "PIXI.MSAA_QUALITY">;
    const MSAA_QUALITY: Record<keyof typeof _PIXI.MSAA_QUALITY, PIXI.MSAA_QUALITY>;

    type PRECISION = Brand<string, "PIXI.PRECISION">;
    const PRECISION: Record<keyof typeof _PIXI.PRECISION, PIXI.PRECISION>;

    type RENDERER_TYPE = Brand<number, "PIXI.RENDERER_TYPE">;
    const RENDERER_TYPE: Record<keyof typeof _PIXI.RENDERER_TYPE, PIXI.RENDERER_TYPE>;

    type SAMPLER_TYPES = Brand<number, "PIXI.SAMPLER_TYPES">;
    const SAMPLER_TYPES: Record<keyof typeof _PIXI.SAMPLER_TYPES, PIXI.SAMPLER_TYPES>;

    type SCALE_MODES = Brand<number, "PIXI.SCALE_MODES">;
    const SCALE_MODES: Record<keyof typeof _PIXI.SCALE_MODES, PIXI.SCALE_MODES>;

    type SHAPES = Brand<number, "PIXI.SHAPES">;
    const SHAPES: Record<keyof typeof _PIXI.SHAPES, PIXI.SHAPES>;

    type TARGETS = Brand<number, "PIXI.TARGETS">;
    const TARGET: Record<keyof typeof _PIXI.TARGETS, PIXI.TARGETS>;

    type TEXT_GRADIENT = Brand<number, "PIXI.TEXT_GRADIENT">;
    const TEXT_GRADIENT: Record<keyof typeof _PIXI.TEXT_GRADIENT, PIXI.TEXT_GRADIENT>;

    type UPDATE_PRIORITY = Brand<number, "PIXI.UPDATE_PRIORITY">;
    const UPDATE_PRIORITY: Record<keyof typeof _PIXI.UPDATE_PRIORITY, PIXI.UPDATE_PRIORITY>;

    type WRAP_MODES = Brand<number, "PIXI.WRAP_MODES">;
    const WRAP_MODES: Record<keyof typeof _PIXI.WRAP_MODES, PIXI.WRAP_MODES>;

    export import smooth = _smooth;
    export import particles = _particles;

    export class Graphics extends PIXI.smooth.SmoothGraphics {}

    export import BatchGeometry = _PIXI.BatchGeometry;

    namespace BatchGeometry {
      type AnyConstructor = typeof AnyPIXIBatchGeometry;
    }

    export import BatchRenderer = _PIXI.BatchRenderer;

    namespace BatchRenderer {
      type AnyConstructor = typeof AnyPIXIBatchRenderer;
    }

    export import Container = _PIXI.Container;

    namespace Container {
      type AnyConstructor = typeof AnyPIXIContainer;
    }

    export import DisplayObject = _PIXI.DisplayObject;

    namespace DisplayObject {
      type AnyConstructor = typeof AnyDisplayObject;

      type DestroyOptions = _PIXI.IDestroyOptions | boolean;
    }

    export import Filter = _PIXI.Filter;

    namespace Filter {
      type AnyConstructor = typeof AnyPIXIFilter;
    }

    export import Shader = _PIXI.Shader;

    namespace Shader {
      type AnyConstructor = typeof AnyPIXIShader;
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

declare abstract class AnyPIXIBatchGeometry extends PIXI.BatchGeometry {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnyPIXIBatchRenderer extends PIXI.BatchRenderer {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnyPIXIContainer extends PIXI.Container {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnyDisplayObject extends PIXI.DisplayObject {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnyPIXIFilter extends PIXI.Filter {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnyPIXIShader extends PIXI.Shader {
  constructor(arg0: never, ...args: never[]);
}
