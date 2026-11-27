import type { AnyObject, Identity } from "#utils";
import type { DataField } from "#common/data/fields.d.mts";
import type VFXReferenceObjectField from "./vfx-reference-object-field.d.mts";
import type VFXPositionField from "./vfx-position-field.d.mts";

/**
 * A specialized subclass of VFXReferenceObjectField that specifically deals with positions.
 * A referenced object supplies the point, elevation, and draw order only: a document's rotation is in degrees and its
 * scale has another meaning, so rotation and scale come only from a literal position.
 *
 * @example Resolve a position just above a Token, ignoring its rotation.
 * ```js
 * const position = new VFXReferencePositionField();
 * const unresolvedValue = {reference: "token", deltas: {elevation: 1}};
 * const references = {token: tokenDocument}; // Suppose x=1000, y=2000, elevation=5, sort=3, rotation=90
 * const resolvedObject = position.resolve(unresolvedValue, references);
 * // {x: 1000, y: 2000, elevation: 6, sort: 3, sortLayer: undefined}
 * ```
 */
declare class VFXReferencePositionField<
  Options extends VFXReferencePositionField.Options = VFXReferencePositionField.DefaultOptions,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  AssignmentType = VFXReferencePositionField.AssignmentType<Options>,
  InitializedType = VFXReferencePositionField.InitializedType<Options>,
  PersistedType = VFXReferencePositionField.PersistedType<Options>,
> extends VFXReferenceObjectField<VFXPositionField, Options, AssignmentType, InitializedType, PersistedType> {
  constructor(options?: Options, context?: DataField.ConstructionContext);

  /**
   * @remarks Deletes `rotation` and `scale` from the result when `value` is a reference.
   */
  override resolve(value: AssignmentType, references: AnyObject): InitializedType;
}

declare namespace VFXReferencePositionField {
  interface Any extends AnyVFXReferencePositionField {}
  interface AnyConstructor extends Identity<typeof AnyVFXReferencePositionField> {}

  interface Options extends VFXReferenceObjectField.Options {}

  type DefaultOptions = VFXReferenceObjectField.DefaultOptions<VFXPositionField>;

  /**
   * @deprecated AssignmentData is being phased out. See {@linkcode foundry.data.fields.SchemaField.AssignmentData}
   * for more details.
   */
  type AssignmentType<Opts extends VFXReferencePositionField.Options = VFXReferencePositionField.DefaultOptions> =
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    VFXReferenceObjectField.AssignmentType<VFXPositionField, Opts>;

  type InitializedType<Opts extends VFXReferencePositionField.Options = VFXReferencePositionField.DefaultOptions> =
    VFXReferenceObjectField.InitializedType<VFXPositionField, Opts>;

  type PersistedType<Opts extends VFXReferencePositionField.Options = VFXReferencePositionField.DefaultOptions> =
    VFXReferenceObjectField.PersistedType<VFXPositionField, Opts>;
}

export default VFXReferencePositionField;

declare abstract class AnyVFXReferencePositionField extends VFXReferencePositionField {
  constructor(...args: never);
}
