import type { FixedInstanceType, Mixin } from "fvtt-types/utils";
import type Document from "../../../common/abstract/document.d.mts";
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
  get object(): Document.ConfiguredObjectInstanceForName<PlaceableType> | null;

  /**
   * A reference to the PlaceableObject instance which represents this Embedded Document.
   * @internal
   * @defaultValue `null`
   */
  protected _object: Document.ConfiguredObjectInstanceForName<PlaceableType> | null;

  /**
   * Has this object been deliberately destroyed as part of the deletion workflow?
   * @internal
   * @defaultValue `false`
   */
  protected _destroyed: boolean;

  /**
   * A reference to the CanvasLayer which contains Document objects of this type.
   */
  get layer(): FixedInstanceType<PlaceablesLayer.ConfiguredClassForName<PlaceableType>>;

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
   * A specialized sub-class of the ClientDocumentMixin which is used for document types that are intended to be represented upon the game Canvas.
   */
  // TODO(LukeAbby): The constraint here should ideally be something like `Document<Document.PlaceableType, any, Scene.ConfiguredInstance | null>` but this causes circularities.
  function CanvasDocumentMixin<BaseClass extends Document.Internal.Constructor>(
    Base: BaseClass,
  ): typeof AnyDocument & Mixin<typeof CanvasDocument<FixedInstanceType<BaseClass>>, BaseClass>;
}

// This is yet another `AnyDocument` type.
// It exists specifically because the `Document.AnyConstructor` type is too safe to be merged in with a mixin.
// The `arg0: never, ...args: never[]` trick trips up the base constructor check and so this one with an actual `...args: any[]` one is used instead.
//
// `{}` is used to avoid merging `DataSchema` with the real schema.
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
declare class AnyDocument extends Document<any, {}, Document.Any | null> {
  constructor(...args: any[]);

  // Note(LukeAbby): Specifically adding the `DocumentBrand` should be redundant but in practice it seems to help tsc more efficiently deduce that it's actually inheriting from `Document`.
  // This is odd but probably is because it bails from looking up the parent class properties at times or something.
  static [Document.Internal.DocumentBrand]: true;

  flags?: unknown;

  getFlag(scope: never, key: never): any;
}
