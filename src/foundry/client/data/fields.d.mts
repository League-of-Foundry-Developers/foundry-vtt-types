import type { SimpleMerge } from "#utils";
import type { fields } from "#common/data/_module.d.mts";
import type { AbstractBaseShader } from "#client/canvas/rendering/shaders/_module.d.mts";

declare class ShaderField<
  const Options extends ShaderField.Options = ShaderField.DefaultOptions,
  const AssignmentType = ShaderField.AssignmentType<Options>,
  const InitializedType = ShaderField.InitializedType<Options>,
  const PersistedType extends typeof AbstractBaseShader | null | undefined = ShaderField.InitializedType<Options>,
> extends fields.DataField<Options, AssignmentType, InitializedType, PersistedType> {
  /**
   * @defaultValue
   * ```typescript
   * const defaults = super._defaults;
   * defaults.nullable = true;
   * defaults.initial = undefined;
   * return defaults;
   * ```
   */
  static override get _defaults(): ShaderField.DefaultOptions;

  /**
   * @remarks
   * @throws If the value provided is not an {@linkcode AbstractBaseShader} subclass.
   */
  override _cast(value: unknown): AssignmentType; // typeof AbstractBaseShader;
}

declare namespace ShaderField {
  type Options = fields.DataField.Options<typeof AbstractBaseShader>;

  type DefaultOptions = SimpleMerge<
    fields.DataField.DefaultOptions,
    {
      nullable: true;
      initial: undefined;
    }
  >;

  /**
   * A helper type for the given options type merged into the default options of the BooleanField class.
   * @template Opts - the options that override the default options
   */
  type MergedOptions<Opts extends Options> = SimpleMerge<DefaultOptions, Opts>;

  /**
   * A shorthand for the assignment type of a BooleanField class.
   * @template Opts - the options that override the default options
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type AssignmentType<Opts extends Options> = fields.DataField.DerivedAssignmentType<
    typeof AbstractBaseShader,
    MergedOptions<Opts>
  >;

  /**
   * A shorthand for the initialized type of a BooleanField class.
   * @template Opts - the options that override the default options
   */
  type InitializedType<Opts extends Options> = fields.DataField.DerivedInitializedType<
    typeof AbstractBaseShader,
    MergedOptions<Opts>
  >;
}

export { ShaderField };

/**
 * @remarks The `export * as fields` in `./_module.mjs` overwrites the re-export of `common/data/_module.mjs`'s `fields`,
 * so the common fields are also re-exported here. This matches how Foundry's exports are handled.
 */
export * from "#common/data/fields.mjs";
