import type { Identity } from "#utils";
import type { DataField } from "#common/data/fields.d.mts";
import type VFXReferenceObjectField from "./vfx-reference-object-field.d.mts";
import type VFXPointField from "./vfx-point-field.d.mts";

/**
 * A specialized subclass of VFXReferenceObjectField that specifically deals with points.
 * Wraps a VFXPointField and allows resolving references with delta offsets.
 *
 * @example Resolve a relative point into an absolute coordinate.
 * ```js
 * const point = new VFXReferencePointField();
 * const unresolvedValue = {reference: "target", deltas: {x: -50, y: 50}};
 * const references = {target: tokenDocument}; // tokenDocument.x=1000, tokenDocument.y=2000
 * const resolvedObject = point.resolve(unresolvedValue, references); // {x: 950, y: 2050}
 * ```
 *
 * @template Options - Options for this field instance
 */
declare class VFXReferencePointField<
  Options extends VFXReferencePointField.Options = VFXReferencePointField.DefaultOptions,
  AssignmentType = VFXReferenceObjectField.AssignmentType<VFXPointField, Options>,
  InitializedType = VFXReferenceObjectField.InitializedType<VFXPointField, Options>,
  PersistedType = VFXReferenceObjectField.PersistedType<VFXPointField, Options>,
> extends VFXReferenceObjectField<VFXPointField, Options, AssignmentType, InitializedType, PersistedType> {
  /**
   * @param options - Options which configure the behavior of the field
   * @param context - Additional context which describes the field
   */
  constructor(options?: Options, context?: DataField.ConstructionContext);

  #VFXReferencePointField: true;
}

declare namespace VFXReferencePointField {
  interface Any extends AnyVFXReferencePointField {}
  interface AnyConstructor extends Identity<typeof AnyVFXReferencePointField> {}

  interface Options extends VFXReferenceObjectField.Options {}

  type DefaultOptions = VFXReferenceObjectField.DefaultOptions;
}

export default VFXReferencePointField;

declare abstract class AnyVFXReferencePointField extends VFXReferencePointField {
  constructor(...args: never);
}
