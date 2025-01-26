import type { FixedInstanceType, ToMethod } from "fvtt-types/utils";

declare global {
  /**
   * This class defines an interface which all shaders utilize
   */
  abstract class AbstractBaseShader extends BaseShaderMixin(PIXI.Shader) {
    /**
     * @param program  - The program to use with this shader.
     * @param uniforms - The current uniforms of the Shader
     */
    constructor(
      program: PIXI.Program,
      /** @defaultValue `{}` */
      uniforms?: AbstractBaseShader.Uniforms,
    );

    /**
     * The raw vertex shader used by this class.
     * A subclass of AbstractBaseShader must implement the vertexShader static field.
     * @defaultValue `""`
     */
    static vertexShader: string;

    /**
     * The raw fragment shader used by this class.
     * A subclass of AbstractBaseShader must implement the fragmentShader static field.
     * @defaultValue `""`
     */
    static fragmentShader: string | AbstractBaseShader.FragmentShaderFunction;

    /**
     * The default uniform values for the shader.
     * A subclass of AbstractBaseShader must implement the defaultUniforms static field.
     * @defaultValue `{}`
     */
    static defaultUniforms: AbstractBaseShader.Uniforms;

    /**
     * The initial values of the shader uniforms.
     * @remarks Set during construction
     */
    initialUniforms: AbstractBaseShader.Uniforms;

    /**
     * A factory method for creating the shader using its defined default values
     */
    static create<ThisType extends AbstractBaseShader.AnyConstructor>(
      this: ThisType,
      initialUniforms?: AbstractBaseShader.Uniforms,
    ): FixedInstanceType<ThisType>;

    /**
     * Reset the shader uniforms back to their initial values.
     */
    protected reset(): void;

    /**
     * A one time initialization performed on creation.
     * @remarks Does nothing without subclass implementation.
     */
    protected _configure(): void;

    /**
     * Perform operations which are required before binding the Shader to the Renderer.
     * @param mesh - The mesh display object linked to this shader.
     * @param renderer - The renderer
     * @privateRemarks Foundry marks this as protected despite it getting called from `QuadMesh#_render`
     */
    protected _preRender: AbstractBaseShader.PreRenderFunction;

    /**
     * The initial default values of shader uniforms
     * @deprecated since v12, until v14
     * @remarks AbstractBaseShader#_defaults is deprecated in favor of AbstractBaseShader#initialUniforms.
     */
    protected get _defaults(): AbstractBaseShader.Uniforms;
  }

  namespace AbstractBaseShader {
    type AnyConstructor = typeof AnyAbstractBaseShader;

    type Coordinates = { x: number; y: number; z?: number } | { x: number; y: number; z: number; w?: number };

    type UniformValue =
      | boolean
      | number
      | Int32List
      | Float32List
      | Coordinates
      | Coordinates[]
      | PIXI.Texture
      | Color.RGBColorVector
      | Color.RGVAColorVector;

    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    type Uniforms = {
      readonly [K: string]: AbstractBaseShader.UniformValue;
    };

    type FragmentShaderFunction = ToMethod<(arg0: never) => string>;

    type PreRenderFunction = ToMethod<(mesh: PIXI.DisplayObject, renderer: PIXI.Renderer) => void>;
  }
}

declare abstract class AnyAbstractBaseShader extends AbstractBaseShader {
  constructor(arg0: never, ...args: never[]);
}
