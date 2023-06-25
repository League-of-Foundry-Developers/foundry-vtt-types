// FOUNDRY_VERSION: 10.291

import type { DocumentModificationOptions } from "../../../common/abstract/document.mjs";
import type { fields } from "../../../common/data/module.mjs";
import type BaseDrawing from "../../../common/documents/drawing.mjs";
import type BaseMeasuredTemplate from "../../../common/documents/measured-template.mjs";
import type BaseNote from "../../../common/documents/note.mjs";
import type BaseScene from "../../../common/documents/scene.mjs";
import type BaseToken from "../../../common/documents/token.mjs";
import type BaseUser from "../../../common/documents/user.mjs";
import type BaseAmbientLight from "../../../common/documents/ambient-light.mjs";
import type BaseAmbientSound from "../../../common/documents/ambient-sound.mjs";
import type BaseTile from "../../../common/documents/tile.mjs";
import type BaseWall from "../../../common/documents/wall.mjs";
import type { ConfiguredDocumentClass } from "../../../../types/helperTypes";
import type { NoteDocument } from "./note";

declare global {
  /**
   * The client-side Scene document which extends the common BaseScene model.
   *
   * @see {@link Scenes}            The world-level collection of Scene documents
   * @see {@link SceneConfig}       The Scene configuration application
   */
  class Scene extends ClientDocumentMixin(BaseScene) {
    /**
     * Track the viewed position of each scene (while in memory only, not persisted)
     * When switching back to a previously viewed scene, we can automatically pan to the previous position.
     * @internal
     */
    protected _viewPosition: CanvasViewPosition;

    /**
     * Track whether the scene is the active view
     * @internal
     */
    protected _view: boolean;

    /**
     * Determine the canvas dimensions this Scene would occupy, if rendered
     */
    dimensions: SceneDimensions;

    /**
     * Provide a thumbnail image path used to represent this document.
     */
    get thumbnail(): string;

    /* -------------------------------------------- */

    /**
     * A convenience accessor for whether the Scene is currently viewed
     */
    get isView(): boolean;

    /**
     * Set this scene as currently active
     * @returns A Promise which resolves to the current scene once it has been successfully activated
     */
    activate(): Promise<Scene>;

    /* -------------------------------------------- */

    /**
     * Set this scene as the current view
     */
    view(): Promise<Scene>;

    override clone(
      data?: fields.SchemaField.AssignmentType<BaseScene.SchemaField["fields"], {}>,
      options?: {
        /**
         * Save the clone to the World database?
         * @defaultValue `false`
         */
        save?: boolean;

        /**
         * Keep the same ID of the original document
         * @defaultValue `false`
         */
        keepId?: boolean;
      } & DocumentConstructionContext
    ): this | Promise<this>;

    prepareBaseData(): void;

    /**
     * Get the Canvas dimensions which would be used to display this Scene.
     * Apply padding to enlarge the playable space and round to the nearest 2x grid size to ensure symmetry.
     * The rounding accomplishes that the padding buffer around the map always contains whole grid spaces.
     */
    getDimensions(): SceneDimensions;

    /** @internal */
    protected _onClickDocumentLink(event: MouseEvent): any;

    /** @internal */
    protected override _preCreate(
      data: BaseScene.ConstructorData,
      options: { fallback?: boolean; recursive?: boolean },
      user: BaseUser
    ): Promise<void>;

    /** @internal */
    protected override _onCreate(
      data: BaseScene.Source,
      options: { fallback?: boolean; recursive?: boolean },
      userId: string
    ): void;

    /** @internal */
    protected override _preUpdate(
      data: BaseScene.UpdateData,
      options: { fallback?: boolean; recursive?: boolean },
      user: BaseUser
    ): Promise<void>;

    /** @override */
    protected override _onUpdate(
      data: DeepPartial<BaseScene.Source>,
      options: { fallback?: boolean; recursive?: boolean },
      userId: string
    ): void;

    /** @internal */
    protected _preDelete(options: DocumentModificationOptions, user: BaseUser): Promise<void>;

    /** @internal */
    protected override _onDelete(options: DocumentModificationOptions, userId: string): void;

    /**
     * Handle Scene activation workflow if the active state is changed to true
     * @param active    - Is the scene now active?
     * @internal
     */
    protected _onActivate(active: boolean): Promise<Scene>;

    /** @internal */
    protected override _preCreateEmbeddedDocuments(
      embeddedName: string,
      result: BaseDrawing.ConstructorData[],
      options: DocumentModificationOptions,
      userId: string
    ): void;
    /** @internal */
    protected override _preCreateEmbeddedDocuments(
      embeddedName: string,
      result: BaseToken.ConstructorData[],
      options: DocumentModificationOptions,
      userId: string
    ): void;
    /** @internal */
    protected override _preCreateEmbeddedDocuments(
      embeddedName: string,
      result: BaseAmbientLight.ConstructorData[],
      options: DocumentModificationOptions,
      userId: string
    ): void;
    /** @internal */
    protected override _preCreateEmbeddedDocuments(
      embeddedName: string,
      result: BaseNote.ConstructorData[],
      options: DocumentModificationOptions,
      userId: string
    ): void;
    /** @internal */
    protected override _preCreateEmbeddedDocuments(
      embeddedName: string,
      result: BaseAmbientSound.ConstructorData[],
      options: DocumentModificationOptions,
      userId: string
    ): void;
    /** @internal */
    protected override _preCreateEmbeddedDocuments(
      embeddedName: string,
      result: BaseMeasuredTemplate.ConstructorData[],
      options: DocumentModificationOptions,
      userId: string
    ): void;
    /** @internal */
    protected override _preCreateEmbeddedDocuments(
      embeddedName: string,
      result: BaseTile.ConstructorData[],
      options: DocumentModificationOptions,
      userId: string
    ): void;
    /** @internal */
    protected override _preCreateEmbeddedDocuments(
      embeddedName: string,
      result: BaseWall.ConstructorData[],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    /** @internal */
    protected override _onCreateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof DrawingDocument>>[],
      result: BaseDrawing.ConstructorData[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    /** @internal */
    protected override _onCreateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof TokenDocument>>[],
      result: BaseToken.ConstructorData[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    /** @internal */
    protected override _onCreateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof AmbientLightDocument>>[],
      result: BaseAmbientLight.ConstructorData[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    /** @internal */
    protected override _onCreateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof NoteDocument>>[],
      result: BaseNote.ConstructorData[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    /** @internal */
    protected override _onCreateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof AmbientSoundDocument>>[],
      result: BaseAmbientSound.ConstructorData[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    /** @internal */
    protected override _onCreateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof MeasuredTemplateDocument>>[],
      result: BaseMeasuredTemplate.ConstructorData[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    /** @internal */
    protected override _onCreateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof TileDocument>>[],
      result: BaseTile.ConstructorData[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    /** @internal */
    protected override _onCreateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof WallDocument>>[],
      result: BaseWall.ConstructorData[],
      options: DocumentModificationContext,
      userId: string
    ): void;

    /** @internal */
    protected override _preUpdateEmbeddedDocuments(
      embeddedName: string,
      result: BaseDrawing.UpdateData[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    /** @internal */
    protected override _preUpdateEmbeddedDocuments(
      embeddedName: string,
      result: BaseToken.UpdateData[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    /** @internal */
    protected override _preUpdateEmbeddedDocuments(
      embeddedName: string,
      result: BaseAmbientLight.UpdateData[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    /** @internal */
    protected override _preUpdateEmbeddedDocuments(
      embeddedName: string,
      result: BaseNote.UpdateData[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    /** @internal */
    protected override _preUpdateEmbeddedDocuments(
      embeddedName: string,
      result: BaseAmbientSound.UpdateData[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    /** @internal */
    protected override _preUpdateEmbeddedDocuments(
      embeddedName: string,
      result: BaseMeasuredTemplate.UpdateData[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    /** @internal */
    protected override _preUpdateEmbeddedDocuments(
      embeddedName: string,
      result: BaseTile.UpdateData[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    /** @internal */
    protected override _preUpdateEmbeddedDocuments(
      embeddedName: string,
      result: BaseWall.UpdateData[],
      options: DocumentModificationContext,
      userId: string
    ): void;

    /** @internal */
    protected override _onUpdateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof DrawingDocument>>[],
      result: BaseDrawing.UpdateData[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    /** @internal */
    protected override _onUpdateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof TokenDocument>>[],
      result: BaseToken.UpdateData[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    /** @internal */
    protected override _onUpdateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof AmbientLightDocument>>[],
      result: BaseAmbientLight.UpdateData[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    /** @internal */
    protected override _onUpdateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof NoteDocument>>[],
      result: BaseNote.UpdateData[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    /** @internal */
    protected override _onUpdateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof AmbientSoundDocument>>[],
      result: BaseAmbientSound.UpdateData[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    /** @internal */
    protected override _onUpdateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof MeasuredTemplateDocument>>[],
      result: BaseMeasuredTemplate.UpdateData[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    /** @internal */
    protected override _onUpdateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof TileDocument>>[],
      result: BaseTile.UpdateData[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    /** @internal */
    protected override _onUpdateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof WallDocument>>[],
      result: BaseWall.UpdateData[],
      options: DocumentModificationContext,
      userId: string
    ): void;

    /** @internal */
    protected override _preDeleteEmbeddedDocuments(
      embeddedName: string,
      result: string[],
      options: DocumentModificationContext,
      userId: string
    ): void;

    /** @internal */
    protected override _onDeleteEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof DrawingDocument>>[],
      result: string[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    /** @internal */
    protected override _onDeleteEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof TokenDocument>>[],
      result: string[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    /** @internal */
    protected override _onDeleteEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof AmbientLightDocument>>[],
      result: string[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    /** @internal */
    protected override _onDeleteEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof NoteDocument>>[],
      result: string[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    /** @internal */
    protected override _onDeleteEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof AmbientSoundDocument>>[],
      result: string[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    /** @internal */
    protected override _onDeleteEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof MeasuredTemplateDocument>>[],
      result: string[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    /** @internal */
    protected override _onDeleteEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof TileDocument>>[],
      result: string[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    /** @internal */
    protected override _onDeleteEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof WallDocument>>[],
      result: string[],
      options: DocumentModificationContext,
      userId: string
    ): void;

    toCompendium(
      pack?: CompendiumCollection<CompendiumCollection.Metadata> | null | undefined,
      options?: ClientDocumentMixin.CompendiumExportOptions | undefined
    ): Omit<BaseScene.Source, "_id" | "folder" | "permission"> & {
      permission?: SceneData extends { toObject(): infer U } ? U : never;
    };

    /**
     * Create a 300px by 100px thumbnail image for this scene background
     * @param options     - Options which modify thumbnail creation
     * @returns The created thumbnail data.
     */
    createThumbnail(options?: Partial<ThumbnailCreationData>): Promise<ImageHelper.ThumbnailReturn>;

    /**
     * @deprecated since v10
     */
    static getDimensions(data: never): void;
  }

  interface SceneDimensions {
    /** The width of the canvas. */
    width: number;

    /** The height of the canvas. */
    height: number;

    /** The grid size. */
    size: number;

    /** The canvas rectangle. */
    rect: Rectangle;

    /** The X coordinate of the scene rectangle within the larger canvas. */
    sceneX: number;

    /** The Y coordinate of the scene rectangle within the larger canvas. */
    sceneY: number;

    /** The width of the scene. */
    sceneWidth: number;

    /** The height of the scene. */
    sceneHeight: number;

    /** The scene rectangle. */
    sceneRect: Rectangle;

    /** The number of distance units in a single grid space. */
    distance: number;

    /** The aspect ratio of the scene rectangle. */
    ratio: number;

    /** The length of the longest line that can be drawn on the canvas. */
    maxR: number;
  }
}

interface ThumbnailCreationData extends ImageHelper.TextureToImageOptions {
  /**
   * A background image to use for thumbnail creation, otherwise the current scene
   * background is used.
   */
  img: string;

  /**
   * The desired thumbnail width. Default is 300px
   * @defaultValue `300`
   */
  width: number;

  /**
   * The desired thumbnail height. Default is 100px;
   * @defaultValue `100`
   */
  height: number;
}
