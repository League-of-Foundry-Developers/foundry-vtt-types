import type { Mixin } from "../../../../types/utils.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { DocumentModificationOptions } from "../../../common/abstract/document.d.mts";
import type { ClientDocument } from "./client-document.d.mts";

declare class CanvasDocument<
  BaseDocument extends foundry.abstract.Document<any, any, Scene.ConfiguredInstance | null>,
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

  protected _onCreate(
    data: foundry.data.fields.SchemaField.InnerAssignmentType<BaseDocument["schema"]["fields"]>,
    options: DocumentModificationOptions,
    userId: string,
  ): void;

  protected _onUpdate(
    changed: foundry.data.fields.SchemaField.InnerAssignmentType<BaseDocument["schema"]["fields"]>,
    options: DocumentModificationOptions,
    userId: string,
  ): void;

  protected _onDelete(options: DocumentModificationOptions, userId: string): void;
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
  function CanvasDocumentMixin<BaseClass extends Document.AnyConstructor>(
    Base: BaseClass,
  ): Mixin<typeof CanvasDocument<InstanceType<BaseClass>>, BaseClass>;
}
