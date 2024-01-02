import type { DisplayObject } from "pixi.js";

export {};

type ClientDocument = unknown;

declare class PrimaryCanvasObject {
  constructor(
    placeableObjectOrData: Document | PrimaryCanvasObject.Data,
    ...args: ConstructorParameters<typeof PIXI.DisplayObject>
  );

  /**
   * The PlaceableObject which is rendered to the PrimaryCanvasGroup (or undefined if no object is associated)
   */
  object: PlaceableObject;

  /**
   * Universal data object for this mesh.
   */
  data: PrimaryCanvasObject.Data;

  /**
   * @defaultValue
   * ```js
   * {
   *    x: 0,
   *    y: 0,
   *    z: 0,
   *    width: 0,
   *    height: 0,
   *    alpha: 1,
   *    rotation: 0,
   *    hidden: false,
   *    elevation: undefined,
   *    sort: 0,
   *    texture: {
   *        scaleX: 1,
   *        scaleY: 1,
   *        src: null,
   *        tint: null
   *    }
   * };
   * ```
   */
  static defaultData: PrimaryCanvasObject.Data;

  /**
   * An elevation in distance units which defines how this Object is sorted relative to its siblings.
   */
  get elevation(): number;

  /**
   * A sort key which resolves ties amongst objects at the same elevation.
   */
  get sort(): number;

  /**
   * A convenient reference to a Document associated with this display object, if any.
   */
  get document(): ClientDocument | null;

  /**
   * Initialize data using an explicitly provided data object or a canvas document.
   * @param data - Provided data or canvas document.
   */
  initialize(data?: PrimaryCanvasObject.Data | Document): void;

  /**
   * Map the document data to an object and process some properties.
   * @param data - The document data.
   * @returns The updated data object.
   */
  protected _getCanvasDocumentData(data: Document): unknown;

  /**
   * Initialize sorting of this PCO. Perform checks and call the primary group sorting if necessary.
   * @param sort - The sort value. Must be a finite number or undefined (in this case, it is ignored)
   */
  protected _initializeSorting(sort: number): void;

  destroy(...args: any[]): void;

  /**
   * Synchronize the appearance of this ObjectMesh with the properties of its represented Document.
   * @remarks Marked as abstract
   */
  refresh(): void;

  /**
   * Synchronize the position of the ObjectMesh using the position of its represented Document.
   * @remarks Marked as abstract
   */
  setPosition(...args: any[]): void;

  /**
   * Synchronize the bounds of the ObjectMesh into the primary group quadtree.
   */
  updateBounds(): void;
}

declare global {
  namespace PrimaryCanvasObject {
    type Data = {
      /** The x-coordinate of the PCO location */
      x: number;

      /** The y-coordinate of the PCO location */
      y: number;

      /** The z-index of the PCO */
      z: number;

      /** The width of the PCO */
      width: number;

      /** The height of the PCO */
      height: number;

      /** The alpha of this PCO */
      alpha: number;

      /** The rotation of this PCO */
      rotation: number;

      /** The PCO is hidden? */
      hidden: boolean;

      /** The elevation of the PCO */
      elevation: number;

      /** The sort key that resolves ties among the same elevation */
      sort: number;

      /** The data texture values */
      texture: PIXI.RenderTexture;
    };
  }
  /**
   * A mixin which decorates a DisplayObject with additional properties expected for rendering in the PrimaryCanvasGroup.
   * @param DisplayObject - The parent DisplayObject class being mixed
   * @returns A DisplayObject subclass mixed with PrimaryCanvasObject features
   */
  function PrimaryCanvasObjectMixin<BaseClass extends AnyConstructor<typeof PIXI.DisplayObject>>(
    DisplayObject: BaseClass,
  ): Mixin<typeof PrimaryCanvasObject, BaseClass>;
}
