import type { DocumentConstructor } from "../../../../types/helperTypes.d.mts";
import type { DeepPartial, Mixin } from "../../../../types/utils.d.mts";
import type { DocumentModificationOptions } from "../../../common/abstract/document.d.mts";
import type { ClientDocument } from "./client-document.d.mts";

declare class CanvasDocument<T extends foundry.abstract.Document<any, any, any>> extends ClientDocument<T> {
  /**
   * A lazily constructed PlaceableObject instance which can represent this Document on the game canvas.
   */
  get object(): PlaceableObject | null; // TODO: Replace with InstanceType<ObjectClass<T>> | null once the circular reference problem has been solved

  /**
   * A reference to the PlaceableObject instance which represents this Embedded Document.
   * @internal
   * @defaultValue `null`
   */
  protected _object: PlaceableObject | null; // TODO: Replace with InstanceType<ObjectClass<T>> | null once the circular reference problem has been solved

  /**
   * Has this object been deliberately destroyed as part of the deletion workflow?
   * @internal
   * @defaultValue `false`
   */
  protected _destroyed: boolean;

  /**
   * A reference to the CanvasLayer which contains Document objects of this type.
   */
  get layer(): PlaceablesLayer<any>; // TODO: Replace with InstanceType<LayerClass<T>> | null once the circular reference problem has been solved

  /**
   * An indicator for whether this document is currently rendered on the game canvas.
   */
  get rendered(): boolean;

  protected _onCreate(data: T["_source"], options: DocumentModificationOptions, userId: string): void;

  protected _onUpdate(changed: DeepPartial<T["_source"]>, options: DocumentModificationOptions, userId: string): void;

  protected _onDelete(options: DocumentModificationOptions, userId: string): void;
}

declare global {
  type CanvasDocument = ReturnType<typeof CanvasDocumentMixin>;

  /**
   * A specialized sub-class of the ClientDocumentMixin which is used for document types that are intended to be represented upon the game Canvas.
   */
  function CanvasDocumentMixin<BaseClass extends DocumentConstructor>(
    Base: BaseClass,
  ): Mixin<typeof CanvasDocument, BaseClass>;
}
