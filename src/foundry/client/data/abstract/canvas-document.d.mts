import type {
  ConfiguredLayerClassForName,
  ConfiguredObjectClassForName,
  DocumentConstructor,
} from "../../../../types/helperTypes.d.mts";
import type { Mixin } from "../../../../types/utils.d.mts";
import type { ClientDocument } from "./client-document.d.mts";

declare class CanvasDocument<
  BaseDocument extends foundry.abstract.Document<any, any, Scene.ConfiguredInstance | null>,
> extends ClientDocument<BaseDocument> {
  /** @privateRemarks All mixin classses should accept anything for its constructor. */
  constructor(...args: any[]);

  /**
   * A lazily constructed PlaceableObject instance which can represent this Document on the game canvas.
   */
  get object(): InstanceType<ConfiguredObjectClassForName<BaseDocument["documentName"]>> | null;

  /**
   * A reference to the PlaceableObject instance which represents this Embedded Document.
   * @internal
   * @defaultValue `null`
   */
  protected _object: InstanceType<ConfiguredObjectClassForName<BaseDocument["documentName"]>> | null;

  /**
   * Has this object been deliberately destroyed as part of the deletion workflow?
   * @internal
   * @defaultValue `false`
   */
  protected _destroyed: boolean;

  /**
   * A reference to the CanvasLayer which contains Document objects of this type.
   */
  get layer(): InstanceType<ConfiguredLayerClassForName<BaseDocument["documentName"]>>; // PlaceablesLayer<any>; // TODO: Replace once the circular reference problem has been solved

  /**
   * An indicator for whether this document is currently rendered on the game canvas.
   */
  get rendered(): boolean;

  // _preCreate, _onCreate, _onUpdate, _onDelete intentionally omitted for type compilation complexity
  // None of these overrides modify the function signature and so can be safely ignored
}

declare global {
  type CanvasDocument = ReturnType<typeof CanvasDocumentMixin>;

  /**
   * A specialized sub-class of the ClientDocumentMixin which is used for document types that are intended to be represented upon the game Canvas.
   */
  function CanvasDocumentMixin<BaseClass extends DocumentConstructor>(
    Base: BaseClass,
  ): Mixin<typeof CanvasDocument<InstanceType<BaseClass>>, BaseClass>;
}
