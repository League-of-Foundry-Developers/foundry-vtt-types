import type { Brand } from "fvtt-types/utils";
import * as _PIXI from "pixi.js";

// Note(LukeAbby): The `smooth.d.mts` and `smooth.d.mts` files exist to make it DRY to selectively tweak PIXI sub-namespaces.
// Each of them write `export * from "..."` and then selectively shadow or augment the exports.

// eslint-disable-next-line import-x/extensions
import * as _smooth from "./smooth.mjs";

// eslint-disable-next-line import-x/extensions
import * as _particles from "./particles.mjs";

export * from "pixi.js";

/**
 * Foundry exports PIXI into the global namespace
 */
export as namespace PIXI;

declare global {
  namespace PIXI {
    type ALPHA_MODES = Brand<number, "PIXI.ALPHA_MODES">;

    /** How to treat textures with premultiplied alpha */
    const ALPHA_MODES: {
      /**  Alias for NO_PREMULTIPLIED_ALPHA. */
      NPM: 0 & ALPHA_MODES;

      /** Default option, alias for PREMULTIPLY_ON_UPLOAD. */
      UNPACK: 1 & ALPHA_MODES;

      /** Alias for PREMULTIPLIED_ALPHA. */
      PMA: 2 & ALPHA_MODES;

      /**
       * Source is not premultiplied, leave it like that.
       * Option for compressed and data textures that are created from typed arrays.
       */
      NO_PREMULTIPLIED_ALPHA: 0 & ALPHA_MODES;

      /**
       * Source is not premultiplied, premultiply on upload.
       * Default option, used for all loaded images.
       */
      PREMULTIPLY_ON_UPLOAD: 1 & ALPHA_MODES;

      /** Source is already premultiplied. Example: spine atlases with `_pma` suffix. */
      PREMULTIPLIED_ALPHA: 2 & ALPHA_MODES;
    };

    type BLEND_MODES = Brand<number, "PIXI.BLEND_MODES">;

    /**
     * Various blend modes supported by PIXI.
     *
     * IMPORTANT - The WebGL renderer only supports the NORMAL, ADD, MULTIPLY and SCREEN blend modes.
     * Anything else will silently act like NORMAL.
     * @remarks Includes Foundry's extra keys `MAX_COLOR`, `MIN_COLOR`, and `MIN_ALL`
     */
    const BLEND_MODES: {
      NORMAL: 0 & BLEND_MODES;
      ADD: 1 & BLEND_MODES;

      /**
       * The pixels of the top layer are multiplied with the corresponding pixel of the bottom layer.
       * A darker picture is the result.
       */
      MULTIPLY: 2 & BLEND_MODES;

      /** The pixels are inverted, multiplied, and inverted again. A lighter picture is the result (opposite of multiply) */
      SCREEN: 3 & BLEND_MODES;

      /**
       * A combination of multiply and screen. Dark parts on the base layer become darker, and light parts become lighter.
       *
       * Canvas Renderer only.
       */
      OVERLAY: 4 & BLEND_MODES;

      /**
       * Retains the darkest pixels of both layers.
       *
       * Canvas Renderer only.
       */
      DARKEN: 5 & BLEND_MODES;

      /**
       * Retains the lightest pixels of both layers.
       *
       * Canvas Renderer only.
       */
      LIGHTEN: 6 & BLEND_MODES;

      /**
       * Divides the bottom layer by the inverted top layer.
       *
       * Canvas Renderer only.
       */
      COLOR_DODGE: 7 & BLEND_MODES;

      /**
       * Divides the inverted bottom layer by the top layer, and then inverts the result.
       *
       * Canvas Renderer only.
       */
      COLOR_BURN: 8 & BLEND_MODES;

      /**
       * A combination of multiply and screen like overlay, but with top and bottom layer swapped.
       *
       * Canvas Renderer only.
       */
      HARD_LIGHT: 9 & BLEND_MODES;

      /**
       * A softer version of hard-light. Pure black or white does not result in pure black or white.
       *
       * Canvas Renderer only.
       */
      SOFT_LIGHT: 10 & BLEND_MODES;

      /**
       * Subtracts the bottom layer from the top layer or the other way round to always get a positive value.
       *
       * Canvas Renderer only.
       */
      DIFFERENCE: 11 & BLEND_MODES;

      /**
       * Like difference, but with lower contrast.
       *
       * Canvas Renderer only.
       */
      EXCLUSION: 12 & BLEND_MODES;

      /**
       * Preserves the luma and chroma of the bottom layer, while adopting the hue of the top layer.
       *
       * Canvas Renderer only.
       */
      HUE: 13 & BLEND_MODES;

      /**
       * Preserves the luma and hue of the bottom layer, while adopting the chroma of the top layer.
       *
       * Canvas Renderer only.
       */
      SATURATION: 14 & BLEND_MODES;

      /**
       * Preserves the luma of the bottom layer, while adopting the hue and chroma of the top layer.
       *
       * Canvas Renderer only.
       */
      COLOR: 15 & BLEND_MODES;

      /**
       * Preserves the hue and chroma of the bottom layer, while adopting the luma of the top layer.
       *
       * Canvas Renderer only.
       */
      LUMINOSITY: 16 & BLEND_MODES;

      NORMAL_NPM: 17 & BLEND_MODES;
      ADD_NPM: 18 & BLEND_MODES;
      SCREEN_NPM: 19 & BLEND_MODES;
      NONE: 20 & BLEND_MODES;

      /** Draws new shapes on top of the existing canvas content. */
      SRC_OVER: 0 & BLEND_MODES;

      /**
       * The new shape is drawn only where both the new shape and the destination canvas overlap.
       * Everything else is made transparent.
       */
      SRC_IN: 21 & BLEND_MODES;

      /** The new shape is drawn where it doesn't overlap the existing canvas content. */
      SRC_OUT: 22 & BLEND_MODES;

      /** The new shape is only drawn where it overlaps the existing canvas content. */
      SRC_ATOP: 23 & BLEND_MODES;

      /**  New shapes are drawn behind the existing canvas content. */
      DST_OVER: 24 & BLEND_MODES;

      /**
       * The existing canvas content is kept where both the new shape and existing canvas content overlap.
       * Everything else is made transparent.
       */
      DST_IN: 25 & BLEND_MODES;

      /** The existing content is kept where it doesn't overlap the new shape. */
      DST_OUT: 26 & BLEND_MODES;

      /** The existing canvas is only kept where it overlaps the new shape. The new shape is drawn behind the canvas content. */
      DST_ATOP: 27 & BLEND_MODES;

      ERASE: 26 & BLEND_MODES;
      SUBTRACT: 28 & BLEND_MODES;

      /** Shapes are made transparent where both overlap and drawn normal everywhere else. */
      XOR: 29 & BLEND_MODES;

      /**
       * A custom blend mode equation which chooses the maximum color from each channel within the stack.
       * @remarks Foundry addition
       */
      MAX_COLOR: 30 & BLEND_MODES;

      /**
       * A custom blend mode equation which chooses the minimum color from each channel within the stack.
       * @remarks Foundry addition
       */
      MIN_COLOR: 31 & BLEND_MODES;

      /**
       * A custom blend mode equation which chooses the minimum color for color channels and min alpha from alpha channel.
       * @remarks Foundry addition
       */
      MIN_ALL: 32 & BLEND_MODES;
    };

    type BUFFER_BITS = Brand<number, "PIXI.BUFFER_BITS">;

    /** Bitwise OR of masks that indicate the buffers to be cleared. */
    const BUFFER_BITS: {
      /**
       * Indicates the buffers currently enabled for color writing.
       * @defaultValue `0x4000`
       */
      COLOR: 16384 & PIXI.BUFFER_BITS;

      /**
       * Indicates the depth buffer.
       * @defaultValue `0x100`
       */
      DEPTH: 256 & PIXI.BUFFER_BITS;

      /**
       * Indicates the stencil buffer.
       * @defaultValue `0x400`
       */
      STENCIL: 1024 & PIXI.BUFFER_BITS;
    };

    type BUFFER_TYPE = Brand<number, "PIXI.BUFFER_TYPE">;

    /** Constants for various buffer types in Pixi */
    const BUFFER_TYPE: {
      /**
       * buffer type for using as an index buffer
       * @defaultValue `0x8893`
       */
      ELEMENT_ARRAY_BUFFER: 34963 & BUFFER_TYPE;

      /**
       * buffer type for using attribute data
       * @defaultValue `0x8892`
       */
      ARRAY_BUFFER: 34962 & BUFFER_TYPE;

      /**
       * the buffer type is for uniform buffer objects
       * @defaultValue `0x8A11`
       */
      UNIFORM_BUFFER: 35345 & BUFFER_TYPE;
    };

    type CLEAR_MODES = Brand<number, "PIXI.CLEAR_MODES">;

    /**
     * Configure whether filter textures are cleared after binding.
     *
     * Filter textures need not be cleared if the filter does not use pixel blending. {@link PIXI.CLEAR_MODES.BLIT} will detect
     * this and skip clearing as an optimization.
     */
    const CLEAR_MODES: {
      /** Alias for BLEND, same as `false` in earlier versions */
      NO: 0 & CLEAR_MODES;

      /** Alias for CLEAR, same as `true` in earlier versions  */
      YES: 1 & CLEAR_MODES;

      /** Alias for BLIT */
      AUTO: 2 & CLEAR_MODES;

      /** Do not clear the filter texture. The filter's output will blend on top of the output texture. */
      BLEND: 0 & CLEAR_MODES;

      /** Always clear the filter texture. */
      CLEAR: 1 & CLEAR_MODES;

      /** Clear only if {@link PIXI.FilterSystem.forceClear} is set or if the filter uses pixel blending. */
      BLIT: 2 & CLEAR_MODES;
    };

    type COLOR_MASK_BITS = Brand<number, "PIXI.COLOR_MASK_BITS">;

    /** Bitwise OR of masks that indicate the color channels that are rendered to. */
    const COLOR_MASK_BITS: {
      /** Red channel. */
      RED: 1 & COLOR_MASK_BITS;

      /** Green channel */
      GREEN: 2 & COLOR_MASK_BITS;

      /** Blue channel. */
      BLUE: 4 & COLOR_MASK_BITS;

      /** Alpha channel. */
      ALPHA: 8 & COLOR_MASK_BITS;
    };

    type DRAW_MODES = Brand<number, "PIXI.DRAW_MODES">;

    /**
     * Various webgl draw modes. These can be used to specify which GL drawMode to use
     * under certain situations and renderers.
     */
    const DRAW_MODES: {
      /** To draw a series of points. */
      POINTS: 0 & DRAW_MODES;

      /** To draw a series of unconnected line segments (individual lines). */
      LINES: 1 & DRAW_MODES;

      /** To draw a series of connected line segments. It also joins the first and last vertices to form a loop. */
      LINE_LOOP: 2 & DRAW_MODES;

      /** To draw a series of connected line segments. */
      LINE_STRIP: 3 & DRAW_MODES;

      /** To draw a series of separate triangles. */
      TRIANGLES: 4 & DRAW_MODES;

      /** To draw a series of connected triangles in strip fashion. */
      TRIANGLE_STRIP: 5 & DRAW_MODES;

      /** To draw a series of connected triangles sharing the first vertex in a fan-like fashion. */
      TRIANGLE_FAN: 6 & DRAW_MODES;
    };

    type ENV = Brand<number, "PIXI.ENV">;

    /** Different types of environments for WebGL. */
    const ENV: {
      /**
       * Used for older v1 WebGL devices. PixiJS will aim to ensure compatibility
       * with older / less advanced devices. If you experience unexplained flickering prefer this environment.
       */
      WEBGL_LEGACY: 0 & ENV;

      /** Version 1 of WebGL */
      WEBGL: 1 & ENV;

      /** Version 2 of WebGL */
      WEBGL2: 2 & ENV;
    };

    type ExtensionType = Brand<string, "PIXI.ExtensionType">;

    /** Collection of valid extension types. */
    const ExtensionType: {
      Renderer: "renderer" & ExtensionType;

      /** Application plugins */
      Application: "application" & ExtensionType;

      RendererSystem: "renderer-webgl-system" & ExtensionType;

      /** Plugins for Renderer */
      RendererPlugin: "renderer-webgl-plugin" & ExtensionType;

      CanvasRendererSystem: "renderer-canvas-system" & ExtensionType;

      /** Plugins for CanvasRenderer */
      CanvasRendererPlugin: "renderer-canvas-plugin" & ExtensionType;

      Asset: "asset" & ExtensionType;

      /** Parsers for Assets loader. */
      LoadParser: "load-parser" & ExtensionType;

      /** Parsers for Assets resolvers. */
      ResolveParser: "resolve-parser" & ExtensionType;

      /** Parsers for Assets cache. */
      CacheParser: "cache-parser" & ExtensionType;

      DetectionParser: "detection-parser" & ExtensionType;
    };

    type FORMATS = Brand<number, "PIXI.FORMATS">;

    /** Various GL texture/resources formats. */
    const FORMATS: {
      /** @defaultValue `0x1908` */
      RGBA: 6408 & FORMATS;

      /** @defaultValue `0x1907` */
      RGB: 6407 & FORMATS;

      /** @defaultValue `0x8227` */
      RG: 33319 & FORMATS;

      /** @defaultValue `0x1903` */
      RED: 6403 & FORMATS;

      /** @defaultValue `0x8D99` */
      RGBA_INTEGER: 36249 & FORMATS;

      /** @defaultValue `0x8D98` */
      RGB_INTEGER: 36248 & FORMATS;

      /** @defaultValue `0x8228` */
      RG_INTEGER: 33320 & FORMATS;

      /** @defaultValue `0x8D94` */
      RED_INTEGER: 36244 & FORMATS;

      /** @defaultValue `0x1906` */
      ALPHA: 6406 & FORMATS;

      /** @defaultValue `0x1909` */
      LUMINANCE: 6409 & FORMATS;

      /** @defaultValue `0x190A` */
      LUMINANCE_ALPHA: 6410 & FORMATS;

      /** @defaultValue `0x1902` */
      DEPTH_COMPONENT: 6402 & FORMATS;

      /** @defaultValue `0x84F9` */
      DEPTH_STENCIL: 34041 & FORMATS;
    };

    type GC_MODES = Brand<number, "PIXI.GC_MODES">;

    /**
     * The gc modes that are supported by pixi.
     *
     * The {@link PIXI.TextureGCSystem.defaultMode} Garbage Collection mode for PixiJS textures is AUTO
     * If set to GC_MODE, the renderer will occasionally check textures usage. If they are not
     * used for a specified period of time they will be removed from the GPU. They will of course
     * be uploaded again when they are required. This is a silent behind the scenes process that
     * should ensure that the GPU does not get filled up.
     *
     * Handy for mobile devices!
     * This property only affects WebGL.
     */
    const GC_MODES: {
      /** Garbage collection will happen periodically automatically */
      AUTO: 0 & GC_MODES;

      /** Garbage collection will need to be called manually */
      MANUAL: 1 & GC_MODES;
    };

    type INTERNAL_FORMATS = Brand<number, "PIXI.INTERNAL_FORMATS">;

    /** WebGL internal formats, including compressed texture formats provided by extensions */
    const INTERNAL_FORMATS: {
      /** @defaultValue `0x83F0` */
      COMPRESSED_RGB_S3TC_DXT1_EXT: 33776 & INTERNAL_FORMATS;

      /** @defaultValue `0x83F1` */
      COMPRESSED_RGBA_S3TC_DXT1_EXT: 33777 & INTERNAL_FORMATS;

      /** @defaultValue `0x83F2` */
      COMPRESSED_RGBA_S3TC_DXT3_EXT: 33778 & INTERNAL_FORMATS;

      /** @defaultValue `0x83F3` */
      COMPRESSED_RGBA_S3TC_DXT5_EXT: 33779 & INTERNAL_FORMATS;

      /** @defaultValue `0x8C4D` */
      COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT: 35917 & INTERNAL_FORMATS;

      /** @defaultValue `0x8C4E` */
      COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT: 35918 & INTERNAL_FORMATS;

      /** @defaultValue `0x8C4F` */
      COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT: 35919 & INTERNAL_FORMATS;

      /** @defaultValue `0x8C4C` */
      COMPRESSED_SRGB_S3TC_DXT1_EXT: 35916 & INTERNAL_FORMATS;

      /** @defaultValue `0x9270` */
      COMPRESSED_R11_EAC: 37488 & INTERNAL_FORMATS;

      /** @defaultValue `0x9271` */
      COMPRESSED_SIGNED_R11_EAC: 37489 & INTERNAL_FORMATS;

      /** @defaultValue `0x9272` */
      COMPRESSED_RG11_EAC: 37490 & INTERNAL_FORMATS;

      /** @defaultValue `0x9273` */
      COMPRESSED_SIGNED_RG11_EAC: 37491 & INTERNAL_FORMATS;

      /** @defaultValue `0x9274` */
      COMPRESSED_RGB8_ETC2: 37492 & INTERNAL_FORMATS;

      /** @defaultValue `0x9278` */
      COMPRESSED_RGBA8_ETC2_EAC: 37496 & INTERNAL_FORMATS;

      /** @defaultValue `0x9275` */
      COMPRESSED_SRGB8_ETC2: 37493 & INTERNAL_FORMATS;

      /** @defaultValue `0x9279` */
      COMPRESSED_SRGB8_ALPHA8_ETC2_EAC: 37497 & INTERNAL_FORMATS;

      /** @defaultValue `0x9276` */
      COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2: 37494 & INTERNAL_FORMATS;

      /** @defaultValue `0x9277` */
      COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2: 37495 & INTERNAL_FORMATS;

      /** @defaultValue `0x8C00` */
      COMPRESSED_RGB_PVRTC_4BPPV1_IMG: 35840 & INTERNAL_FORMATS;

      /** @defaultValue `0x8C02` */
      COMPRESSED_RGBA_PVRTC_4BPPV1_IMG: 35842 & INTERNAL_FORMATS;

      /** @defaultValue `0x8C01` */
      COMPRESSED_RGB_PVRTC_2BPPV1_IMG: 35841 & INTERNAL_FORMATS;

      /** @defaultValue `0x8C03` */
      COMPRESSED_RGBA_PVRTC_2BPPV1_IMG: 35843 & INTERNAL_FORMATS;

      /** @defaultValue `0x8D64` */
      COMPRESSED_RGB_ETC1_WEBGL: 36196 & INTERNAL_FORMATS;

      /** @defaultValue `0x8C92` */
      COMPRESSED_RGB_ATC_WEBGL: 35986 & INTERNAL_FORMATS;

      /** @defaultValue `0x8C93` */
      COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL: 35987 & INTERNAL_FORMATS;

      /** @defaultValue `0x87EE` */
      COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL: 34798 & INTERNAL_FORMATS;

      /** @defaultValue `0x93B0` */
      COMPRESSED_RGBA_ASTC_4x4_KHR: 37808 & INTERNAL_FORMATS;

      /** @defaultValue `0x8E8C` */
      COMPRESSED_RGBA_BPTC_UNORM_EXT: 36492 & INTERNAL_FORMATS;

      /** @defaultValue `0x8E8D` */
      COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT: 36493 & INTERNAL_FORMATS;

      /** @defaultValue `0x8E8E` */
      COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT: 36494 & INTERNAL_FORMATS;

      /** @defaultValue `0x8E8F` */
      COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT: 36495 & INTERNAL_FORMATS;
    };

    type LINE_CAP = Brand<string, "PIXI.LINE_CAP">;

    /** Support line caps in `PIXI.LineStyle` for graphics. */
    const LINE_CAP: {
      /** 'butt': don't add any cap at line ends (leaves orthogonal edges) */
      BUTT: "butt" & LINE_CAP;

      /** 'round': add semicircle at ends */
      ROUND: "round" & LINE_CAP;

      /** 'square': add square at end (like `BUTT` except more length at end) */
      SQUARE: "square" & LINE_CAP;
    };

    type LINE_JOIN = Brand<string, "PIXI.LINE_JOIN">;

    /**
     * Supported line joints in `PIXI.LineStyle` for graphics.
     * @see PIXI.Graphics#lineStyle
     * @see https://graphicdesign.stackexchange.com/questions/59018/what-is-a-bevel-join-of-two-lines-exactly-illustrator
     */
    const LINE_JOIN: {
      /** 'miter': make a sharp corner where outer part of lines meet */
      MITER: "miter" & LINE_JOIN;

      /** 'bevel': add a square butt at each end of line segment and fill the triangle at turn */
      BEVEL: "bevel" & LINE_JOIN;

      /** 'round': add an arc at the joint */
      ROUND: "round" & LINE_JOIN;
    };

    type LoaderParserPriority = Brand<number, "PIXI.LoaderParserPriority">;

    /**
     * The extension priority for loader parsers.
     * Helpful when managing multiple parsers that share the same extension test.
     * The higher priority parsers will be checked first.
     */
    const LoaderParserPriority: {
      /** Generic parsers: txt, json, webfonts */
      Low: 0 & LoaderParserPriority;

      /** PixiJS assets with generic extensions: spritesheets, bitmapfonts  */
      Normal: 1 & LoaderParserPriority;

      /** Specific texture types: svg, png, ktx, dds, basis */
      High: 2 & LoaderParserPriority;
    };

    type MASK_TYPES = Brand<number, "PIXI.MASK_TYPES">;

    /**
     * Constants for mask implementations.
     * We use `type` suffix because it leads to very different behaviours
     */
    const MASK_TYPES: {
      /** Mask is ignored */
      NONE: 0 & MASK_TYPES;

      /** Scissor mask, rectangle on screen, cheap */
      SCISSOR: 1 & MASK_TYPES;

      /** Stencil mask, 1-bit, medium, works only if renderer supports stencil */
      STENCIL: 2 & MASK_TYPES;

      /** Mask that uses SpriteMaskFilter, uses temporary RenderTexture */
      SPRITE: 3 & MASK_TYPES;

      /** Color mask (RGBA) */
      COLOR: 4 & MASK_TYPES;
    };

    type MIPMAP_MODES = Brand<number, "PIXI.MIPMAP_MODES">;

    /**
     * Mipmap filtering modes that are supported by pixi.
     *
     * The {@link PIXI.BaseTexture.defaultOptions.mipmap} affects default texture filtering.
     * Mipmaps are generated for a baseTexture if its `mipmap` field is `ON`,
     * or its `POW2` and texture dimensions are powers of 2.
     * Since WebGL 1 don't support mipmap for non-power-of-two textures,
     * `ON` option will work like `POW2` for WebGL 1.
     *
     * This property only affects WebGL.
     */
    const MIPMAP_MODES: {
      /** No mipmaps. */
      OFF: 0 & MIPMAP_MODES;

      /** Generate mipmaps if texture dimensions are powers of 2. */
      POW2: 1 & MIPMAP_MODES;

      /** Always generate mipmaps. */
      ON: 2 & MIPMAP_MODES;

      /**
       * Use mipmaps, but do not auto-generate them.
       * this is used with a resource that supports buffering each level-of-detail.
       */
      ON_MANUAL: 3 & MIPMAP_MODES;
    };

    type MSAA_QUALITY = Brand<number, "PIXI.MSAA_QUALITY">;

    /** Constants for multi-sampling antialiasing. */
    const MSAA_QUALITY: {
      /** No multisampling for this renderTexture */
      NONE: 0 & MSAA_QUALITY;

      /** Try 2 samples */
      LOW: 2 & MSAA_QUALITY;

      /** Try 4 samples */
      MEDIUM: 4 & MSAA_QUALITY;

      /** Try 8 samples */
      HIGH: 8 & MSAA_QUALITY;
    };

    type PRECISION = Brand<string, "PIXI.PRECISION">;

    /** Constants that specify float precision in shaders. */
    const PRECISION: {
      /**
       * lowp is at least an 9 bit value.
       * For floating point values they can range from: -2 to +2,
       * for integer values they are similar to Uint8Array or Int8Array
       */
      LOW: "lowp" & PRECISION;

      /**
       * mediump is at least a 16 bit value.
       * For floating point values they can range from: -2^14 to +2^14,
       * for integer values they are similar to Uint16Array or Int16Array
       */
      MEDIUM: "mediump" & PRECISION;

      /**
       * highp is at least a 32 bit value.
       * For floating point values they can range from: -2^62 to +2^62,
       * for integer values they are similar to Uint32Array or Int32Array
       */
      HIGH: "highp" & PRECISION;
    };

    type RENDERER_TYPE = Brand<number, "PIXI.RENDERER_TYPE">;

    /**
     * Constant to identify the Renderer Type.
     */
    const RENDERER_TYPE: {
      /** Unknown render type. */
      UNKNOWN: 0 & RENDERER_TYPE;

      /** WebGL render type. */
      WEBGL: 1 & RENDERER_TYPE;

      /** Canvas render type. */
      CANVAS: 2 & RENDERER_TYPE;
    };

    type SAMPLER_TYPES = Brand<number, "PIXI.SAMPLER_TYPES">;

    /**
     * Various sampler types. Correspond to `sampler`, `isampler`, `usampler` GLSL types respectively.
     * WebGL1 works only with FLOAT.
     */
    const SAMPLER_TYPES: {
      FLOAT: 0 & SAMPLER_TYPES;

      INT: 1 & SAMPLER_TYPES;

      UINT: 2 & SAMPLER_TYPES;
    };

    type SCALE_MODES = Brand<number, "PIXI.SCALE_MODES">;

    /**
     * The scale modes that are supported by pixi.
     *
     * The {@link PIXI.BaseTexture.defaultOptions.scaleMode} scale mode affects the default scaling mode of future operations.
     * It can be re-assigned to either LINEAR or NEAREST, depending upon suitability.
     */
    const SCALE_MODES: {
      /** Pixelating scaling */
      NEAREST: 0 & SCALE_MODES;

      /** Smooth scaling */
      LINEAR: 1 & SCALE_MODES;
    };

    type SHAPES = Brand<number, "PIXI.SHAPES">;

    /** Constants that identify shapes, mainly to prevent `instanceof` calls. */
    const SHAPES: {
      POLY: 0 & SHAPES;
      RECT: 1 & SHAPES;
      CIRC: 2 & SHAPES;
      ELIP: 3 & SHAPES;
      RREC: 4 & SHAPES;
    };

    type TARGETS = Brand<number, "PIXI.TARGETS">;

    /** Various GL target types. */
    const TARGETS: {
      /**
       * A two-dimensional texture
       * @defaultValue `0xDE1`
       */
      TEXTURE_2D: 3553 & TARGETS;

      /**
       * A cube-mapped texture. When using a WebGL 2 context, the following values are available additionally:
       * - gl.TEXTURE_3D: A three-dimensional texture.
       * - gl.TEXTURE_2D_ARRAY: A two-dimensional array texture.
       * @defaultValue `0x8513`
       */
      TEXTURE_CUBE_MAP: 34067 & TARGETS;

      /**
       * A two-dimensional array texture.
       * @defaultValue `0x8C1A`
       */
      TEXTURE_2D_ARRAY: 35866 & TARGETS;

      /**
       * Positive X face for a cube-mapped texture.
       * @defaultValue `0x8515`
       */
      TEXTURE_CUBE_MAP_POSITIVE_X: 34069 & TARGETS;

      /**
       * Negative X face for a cube-mapped texture.
       * @defaultValue `0x8516`
       */
      TEXTURE_CUBE_MAP_NEGATIVE_X: 34070 & TARGETS;

      /**
       * Positive Y face for a cube-mapped texture.
       * @defaultValue `0x8517`
       */
      TEXTURE_CUBE_MAP_POSITIVE_Y: 34071 & TARGETS;

      /**
       * Negative Y face for a cube-mapped texture.
       * @defaultValue `0x8518`
       */
      TEXTURE_CUBE_MAP_NEGATIVE_Y: 34072 & TARGETS;

      /**
       * Positive Z face for a cube-mapped texture.
       * @defaultValue `0x9519`
       */
      TEXTURE_CUBE_MAP_POSITIVE_Z: 34073 & TARGETS;

      /**
       * Negative Z face for a cube-mapped texture.
       * @defaultValue `0x851A`
       */
      TEXTURE_CUBE_MAP_NEGATIVE_Z: 34074 & TARGETS;
    };

    type TEXT_GRADIENT = Brand<number, "PIXI.TEXT_GRADIENT">;

    /** Constants that define the type of gradient on text. */
    const TEXT_GRADIENT: {
      /** Vertical gradient */
      LINEAR_VERTICAL: 0 & TEXT_GRADIENT;

      /**
       * Linear gradient
       * @privateRemarks [sic]
       */
      LINEAR_HORIZONTAL: 1 & TEXT_GRADIENT;
    };

    type TYPES = Brand<number, "PIXI.TYPES">;

    /** Various GL data format types. */
    const TYPES: {
      /**
       * 8 bits per channel for gl.RGBA
       * @defaultValue `0x1401`
       */
      UNSIGNED_BYTE: 5121 & TYPES;

      /** @defaultValue `0x1403` */
      UNSIGNED_SHORT: 5123 & TYPES;

      /**
       * 5 red bits, 6 green bits, 5 blue bits.
       * @defaultValue `0x8363`
       */
      UNSIGNED_SHORT_5_6_5: 33635 & TYPES;

      /**
       * 4 red bits, 4 green bits, 4 blue bits, 4 alpha bits.
       * @defaultValue `0x8033`
       */
      UNSIGNED_SHORT_4_4_4_4: 32819 & TYPES;

      /**
       * 5 red bits, 5 green bits, 5 blue bits, 1 alpha bit.
       * @defaultValue `0x8034`
       */
      UNSIGNED_SHORT_5_5_5_1: 32820 & TYPES;

      /** @defaultValue `0x1405` */
      UNSIGNED_INT: 5125 & TYPES;

      /** @defaultValue `0x8C3B` */
      UNSIGNED_INT_10F_11F_11F_REV: 35899 & TYPES;

      /** @defaultValue `0x8368` */
      UNSIGNED_INT_2_10_10_10_REV: 33640 & TYPES;

      /** @defaultValue `0x84FA` */
      UNSIGNED_INT_24_8: 34042 & TYPES;

      /** @defaultValue `0x8C3E` */
      UNSIGNED_INT_5_9_9_9_REV: 35902 & TYPES;

      /** @defaultValue `0x1400` */
      BYTE: 5120 & TYPES;

      /** @defaultValue `0x1402` */
      SHORT: 5122 & TYPES;

      /** @defaultValue `0x1404` */
      INT: 5124 & TYPES;

      /** @defaultValue `0x1406` */
      FLOAT: 5126 & TYPES;

      /** @defaultValue `0x8DAD` */
      FLOAT_32_UNSIGNED_INT_24_8_REV: 36269 & TYPES;

      /** @defaultValue `0x8D61` */
      HALF_FLOAT: 36193 & TYPES;
    };

    type UPDATE_PRIORITY = Brand<number, "PIXI.UPDATE_PRIORITY">;

    /**
     * Represents the update priorities used by internal PIXI classes when registered with
     * the {@link PIXI.Ticker} object. Higher priority items are updated first and lower
     * priority items, such as render, should go later.
     * @remarks Includes Foundry's additions of `OBJECTS`, `PRIMARY`, and `PERCEPTION`
     */
    const UPDATE_PRIORITY: {
      /** Highest priority used for interaction events in {@link PIXI.EventSystem} */
      INTERACTION: 50 & UPDATE_PRIORITY;

      /** High priority updating, used by {@link PIXI.AnimatedSprite} */
      HIGH: 25 & UPDATE_PRIORITY;

      /** Default priority for ticker events, see {@link PIXI.Ticker#add}. */
      NORMAL: 0 & UPDATE_PRIORITY;

      /** Low priority used for {@link PIXI.Application} rendering. */
      LOW: 25 & UPDATE_PRIORITY;

      /** Lowest priority used for {@link PIXI.BasePrepare} utility. */
      UTILITY: 50 & UPDATE_PRIORITY;

      /** @remarks Foundry addition, defined as `HIGH - 2` */
      OBJECTS: 23 & UPDATE_PRIORITY;

      /** @remarks Foundry addition, defined as `NORMAL + 3` */
      PRIMARY: 3 & UPDATE_PRIORITY;

      /** @remarks Foundry addition, defined as `NORMAL + 2` */
      PERCEPTION: 2 & UPDATE_PRIORITY;
    };

    type WRAP_MODES = Brand<number, "PIXI.WRAP_MODES">;

    /**
     * The wrap modes that are supported by pixi.
     *
     * The wrap mode affects the default wrapping mode of future operations.
     * It can be re-assigned to either CLAMP or REPEAT, depending upon suitability.
     * If the texture is non power of two then clamp will be used regardless as WebGL can
     * only use REPEAT if the texture is po2.
     *
     * This property only affects WebGL.
     */
    const WRAP_MODES: {
      /**
       * The textures uvs are clamped
       * @defaultValue `0x812F`
       */
      CLAMP: 33071 & WRAP_MODES;

      /**
       * The texture uvs tile and repeat
       * @defaultValue `0x2901`
       */
      REPEAT: 10497 & WRAP_MODES;

      /**
       * The texture uvs tile and repeat with mirroring
       * @defaultValue `0x8370`
       */
      MIRRORED_REPEAT: 33648 & WRAP_MODES;
    };

    export import smooth = _smooth;
    export import particles = _particles;

    export class Graphics extends PIXI.smooth.SmoothGraphics {}

    export import BatchGeometry = _PIXI.BatchGeometry;

    namespace BatchGeometry {
      interface Any extends AnyPIXIBatchGeometry {}
      type AnyConstructor = typeof AnyPIXIBatchGeometry;
    }

    export import BatchRenderer = _PIXI.BatchRenderer;

    namespace BatchRenderer {
      interface Any extends AnyPIXIBatchRenderer {}
      type AnyConstructor = typeof AnyPIXIBatchRenderer;
    }

    export import Container = _PIXI.Container;

    namespace Container {
      interface Any extends AnyPIXIContainer {}
      type AnyConstructor = typeof AnyPIXIContainer;
    }

    export import DisplayObject = _PIXI.DisplayObject;

    namespace DisplayObject {
      interface Any extends AnyPIXIDisplayObject {}
      type AnyConstructor = typeof AnyPIXIDisplayObject;

      type DestroyOptions = _PIXI.IDestroyOptions | boolean;
    }

    export import Filter = _PIXI.Filter;

    namespace Filter {
      interface Any extends AnyPIXIFilter {}
      type AnyConstructor = typeof AnyPIXIFilter;
    }

    export import Shader = _PIXI.Shader;

    namespace Shader {
      interface Any extends AnyPIXIShader {}
      type AnyConstructor = typeof AnyPIXIShader;
    }
  }
}

declare module "@pixi/events" {
  interface FederatedPointerEvent {
    /**
     * The angle in radians of a pointer or stylus measuring the vertical angle between
     * the device's surface to the pointer or stylus.
     * A stylus at 0 degrees would be directly parallel whereas at π/2 degrees it would be perpendicular.
     * @see https://developer.mozilla.org/docs/Web/API/PointerEvent/altitudeAngle)
     */
    altitudeAngle: number;

    /**
     * The angle in radians of a pointer or stylus measuring an arc from the X axis of the device to
     * the pointer or stylus projected onto the screen's plane.
     * A stylus at 0 degrees would be pointing to the "0 o'clock" whereas at π/2 degrees it would be pointing at "6 o'clock".
     * @see https://developer.mozilla.org/docs/Web/API/PointerEvent/azimuthAngle)
     */
    azimuthAngle: number;
  }
}

declare module "pixi.js" {
  export import LegacyGraphics = _PIXI.Graphics;

  export enum BLEND_MODES {
    /**
     * A custom blend mode equation which chooses the maximum color from each channel within the stack.
     * @remarks Foundry addition, value is technically dynamic as it's the last PIXI entry at the time + 1, but effectively static
     */
    MAX_COLOR = 30,

    /**
     * A custom blend mode equation which chooses the minimum color from each channel within the stack.
     * @remarks Foundry addition, value is technically dynamic as it's the last PIXI entry at the time + 1, but effectively static
     */
    MIN_COLOR = 31,

    /**
     * A custom blend mode equation which chooses the minimum color for color channels and min alpha from alpha channel.
     * @remarks Foundry addition, value is technically dynamic as it's the last PIXI entry at the time + 1, but effectively static
     */
    MIN_ALL = 32,
  }

  export enum UPDATE_PRIORITY {
    /**
     * @remarks Foundry defined custom ticker priority
     * Handled in Canvas##activateTicker, defined as `HIGH - 2`
     */
    OBJECTS = 23,

    /**
     * @remarks Foundry defined custom ticker priority
     * Handled in Canvas##activateTicker, defined as `NORMAL + 3`
     */
    PRIMARY = 3,

    /**
     * @remarks Foundry defined custom ticker priority
     * Handled in Canvas##activateTicker, defined as `NORMAL + 2`
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

declare abstract class AnyPIXIDisplayObject extends PIXI.DisplayObject {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnyPIXIFilter extends PIXI.Filter {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnyPIXIShader extends PIXI.Shader {
  constructor(arg0: never, ...args: never[]);
}
