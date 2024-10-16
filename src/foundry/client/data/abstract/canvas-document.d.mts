import type { Mixin } from "../../../../types/utils.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { ClientDocument } from "./client-document.d.mts";

declare class CanvasDocument<
  // TODO(LukeAbby): Setting this to `Scene.ConfiguredInstance` causes a lot of circular errors.
  BaseDocument extends Document<any, any, Scene | null>,
> extends ClientDocument<BaseDocument> {
  /** @privateRemarks All mixin classses should accept anything for its constructor. */
  constructor(...args: any[]);

  /**
   * A lazily constructed PlaceableObject instance which can represent this Document on the game canvas.
   */
  get object(): InstanceType<Document.ConfiguredObjectClassForName<BaseDocument["documentName"]>> | null;

  /**
   * A reference to the PlaceableObject instance which represents this Embedded Document.
   * @internal
   * @defaultValue `null`
   */
  protected _object: InstanceType<Document.ConfiguredObjectClassForName<BaseDocument["documentName"]>> | null;

  /**
   * Has this object been deliberately destroyed as part of the deletion workflow?
   * @internal
   * @defaultValue `false`
   */
  protected _destroyed: boolean;

  /**
   * A reference to the CanvasLayer which contains Document objects of this type.
   */
  get layer(): InstanceType<PlaceablesLayer.ConfiguredClassForName<BaseDocument["documentName"]>>;

  /**
   * An indicator for whether this document is currently rendered on the game canvas.
   */
  get rendered(): boolean;

  /**
   * @privateRemarks _preCreate, _onCreate, _onUpdate, and _onDelete are all overridden but with no signature changes.
   * For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.
   */
}

declare namespace CanvasDocument {
  type Any = CanvasDocument<any>;
}

declare global {
  /**
   * @deprecated {@link CanvasDocument.Any | `CanvasDocument.Any`}
   */
  type CanvasDocument = ReturnType<typeof CanvasDocumentMixin>;

  /**
   * A specialized sub-class of the ClientDocumentMixin which is used for document types that are intended to be represented upon the game Canvas.
   */
  function CanvasDocumentMixin<BaseClass extends Document.Internal.Constructor>(
    Base: BaseClass,
  ): Mixin<typeof CanvasDocument<InstanceType<BaseClass>>, BaseClass>;
}
