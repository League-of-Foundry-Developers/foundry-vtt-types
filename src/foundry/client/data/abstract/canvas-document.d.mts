import type { FixedInstanceType, Mixin } from "fvtt-types/utils";
import type Document from "#common/abstract/document.d.mts";
import type { InternalClientDocument } from "./client-document.d.mts";

declare class CanvasDocument<
  BaseDocument extends Document.Internal.Instance.Any,
  PlaceableType extends Document.PlaceableType = Extract<
    Document.Internal.DocumentNameFor<BaseDocument>,
    Document.PlaceableType
  >,
> extends InternalClientDocument<BaseDocument> {
  /** @privateRemarks All mixin classses should accept anything for its constructor. */
  constructor(...args: any[]);

  /**
   * A lazily constructed PlaceableObject instance which can represent this Document on the game canvas.
   */
  get object(): Document.ObjectFor<PlaceableType> | null;

  /**
   * A reference to the PlaceableObject instance which represents this Embedded Document.
   * @internal
   * @defaultValue `null`
   */
  protected _object: Document.ObjectFor<PlaceableType> | null;

  /**
   * Has this object been deliberately destroyed as part of the deletion workflow?
   * @internal
   * @defaultValue `false`
   */
  protected _destroyed: boolean;

  /**
   * A reference to the CanvasLayer which contains Document objects of this type.
   */
  get layer(): PlaceablesLayer.ImplementationFor<PlaceableType>;

  /**
   * An indicator for whether this document is currently rendered on the game canvas.
   */
  get rendered(): boolean;

  // _preCreate, _onCreate, _onUpdate, and _onDelete are all overridden but with no signature changes.
  // For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.
}

declare global {
  /**
   * A specialized sub-class of the ClientDocumentMixin which is used for document types that are intended to be represented upon the game Canvas.
   */
  // TODO(LukeAbby): The constraint here should ideally be something like `Document<Document.PlaceableType, any, Scene.Implementation | null>` but this causes circularities.
  function CanvasDocumentMixin<BaseClass extends CanvasDocumentMixin.BaseClass>(
    Base: BaseClass,
  ): Mixin<typeof CanvasDocument<FixedInstanceType<BaseClass>>, BaseClass>;

  namespace CanvasDocumentMixin {
    interface AnyMixedConstructor extends ReturnType<typeof ClientDocumentMixin<BaseClass>> {}
    interface AnyMixed extends FixedInstanceType<AnyMixedConstructor> {}

    type BaseClass = Document.Internal.Constructor;
  }
}
