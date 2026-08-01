import type { Identity } from "#utils";
import type { DataField } from "#common/data/fields.d.mts";
import type VFXReferenceObjectField from "./vfx-reference-object-field.d.mts";
import type VFXPointField from "./vfx-point-field.d.mts";

/**
 * A specialized subclass of VFXReferenceObjectField that specifically deals with points.
 *
 * @example Resolve a relative point into an absolute coordinate.
 * ```js
 * const point = new VFXReferencePointField();
 * const unresolvedValue = {reference: "target", deltas: {x: -50, y: 50}};
 * const references = {target: tokenDocument}; // Suppose tokenDocument.x is 1000 and tokenDocument.y is 2000
 * const resolvedObject = point.resolve(unresolvedValue, references); // {x: 950, y: 2050}
 * ```
 */
declare class VFXReferencePointField<
  Options extends VFXReferencePointField.Options = VFXReferencePointField.DefaultOptions,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  AssignmentType = VFXReferencePointField.AssignmentType<Options>,
  InitializedType = VFXReferencePointField.InitializedType<Options>,
  PersistedType = VFXReferencePointField.PersistedType<Options>,
> extends VFXReferenceObjectField<VFXPointField, Options, AssignmentType, InitializedType, PersistedType> {
  constructor(options?: Options, context?: DataField.ConstructionContext);

  #VFXReferencePointField: true;
}

declare namespace VFXReferencePointField {
  interface Any extends AnyVFXReferencePointField {}
  interface AnyConstructor extends Identity<typeof AnyVFXReferencePointField> {}

  interface Options extends VFXReferenceObjectField.Options {}

  type DefaultOptions = VFXReferenceObjectField.DefaultOptions<VFXPointField>;

  /**
   * @deprecated AssignmentData is being phased out. See {@linkcode foundry.data.fields.SchemaField.AssignmentData}
   * for more details.
   */
  type AssignmentType<Opts extends VFXReferencePointField.Options = VFXReferencePointField.DefaultOptions> =
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    VFXReferenceObjectField.AssignmentType<VFXPointField, Opts>;

  type InitializedType<Opts extends VFXReferencePointField.Options = VFXReferencePointField.DefaultOptions> =
    VFXReferenceObjectField.InitializedType<VFXPointField, Opts>;

  type PersistedType<Opts extends VFXReferencePointField.Options = VFXReferencePointField.DefaultOptions> =
    VFXReferenceObjectField.PersistedType<VFXPointField, Opts>;
}

export default VFXReferencePointField;

declare abstract class AnyVFXReferencePointField extends VFXReferencePointField {
  constructor(...args: never);
}
