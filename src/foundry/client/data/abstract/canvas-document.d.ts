import type DataModel from '../../../common/abstract/data.mjs.js';
import { ContextType, DocumentModificationOptions } from '../../../common/abstract/document.mjs';
import { ClientDocumentMixin } from './client-document';

declare global {
  // TODO: Replace ConstructorOf<…> with DocumentConstructor once the problem with circular reference has been solved
  /**
   * A specialized sub-class of the ClientDocumentMixin which is used for document types that are intended to be represented upon the game Canvas.
   */

  const CanvasDocumentMixin: <T extends ConstructorOf<AnyDocument>>(Base: T) => CanvasDocumentConstructor<T>;
}

type CanvasDocumentConstructor<T extends ConstructorOf<AnyDocument>> = Pick<T, keyof T> &
  Pick<typeof ClientDocumentMixin, keyof typeof ClientDocumentMixin> & {
    new (...args: ConstructorParameters<T>): InstanceType<T> & CanvasDocumentMixin<InstanceType<T>>;
  };

declare class CanvasDocumentMixin<T extends AnyDocument> extends ClientDocumentMixin<T> {
  constructor(data?: DataModel.SchemaToSourceInput<T['schema']>, context?: ContextType<T>);

  /**
   * A reference to the PlaceableObject instance which represents this Embedded Document.
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
   * A lazily constructed PlaceableObject instance which can represent this Document on the game canvas.
   */
  get object(): PlaceableObject | null; // TODO: Replace with InstanceType<ObjectClass<T>> | null once the circular reference problem has been solved

  /**
   * A reference to the CanvasLayer which contains Document objects of this type.
   */
  get layer(): PlaceablesLayer<any>; // TODO: Replace with InstanceType<LayerClass<T>> | null once the circular reference problem has been solved

  /**
   * An indicator for whether this document is currently rendered on the game canvas.
   */
  get rendered(): boolean;

  /**
   * @see abstract.Document#_onCreate
   */
  protected _onCreate(data: T['_source'], options: DocumentModificationOptions, userId: string): void;

  /**
   * @see abstract.Document#_onUpdate
   */
  protected _onUpdate(data: DeepPartial<T['_source']>, options: DocumentModificationOptions, userId: string): void;

  /**
   * @see abstract.Document#_onDelete
   */
  protected _onDelete(options: DocumentModificationOptions, userId: string): void;
}
