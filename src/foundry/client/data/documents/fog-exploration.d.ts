import { ConfiguredDocumentClass } from "../../../../types/helperTypes";
import { RequestOptions } from "../../../common/abstract/backend.mjs";

declare global {
  /**
   * The client-side FogExploration document which extends the common BaseFogExploration model.
   * Each FogExploration document contains FogExplorationData which defines its data schema.
   *
   * @see {@link data.FogExplorationData} The FogExploration data schema
   */
  class FogExploration extends ClientDocumentMixin(foundry.documents.BaseFogExploration) {
    /**
     * @param data - Initial data provided to construct the FogExploration document
     *               (default: `{}`)
     */
    constructor(
      data?: ConstructorParameters<ConstructorOf<foundry.documents.BaseFogExploration>>[0],
      context?: ConstructorParameters<ConstructorOf<foundry.documents.BaseFogExploration>>[1]
    );

    /**
     * Explore fog of war for a new point source position.
     * @param source - The candidate source of exploration
     * @param force  - Force the position to be re-explored
     *                 (default: `false`)
     * @returns Is the source position newly explored?
     */
    explore(source: PointSource, force?: boolean): boolean;

    /**
     * Obtain the fog of war exploration progress for a specific Scene and User.
     * @param options - (default: `{}`)
     */
    static get(
      {
        scene,
        user
      }?: {
        scene?: InstanceType<ConfiguredDocumentClass<typeof Scene>>;
        user?: InstanceType<ConfiguredDocumentClass<typeof User>>;
      },
      options?: RequestOptions
    ): Promise<StoredDocument<InstanceType<ConfiguredDocumentClass<typeof FogExploration>>> | null>;

    /**
     * Transform the explored base64 data into a PIXI.Texture object
     */
    getTexture(): PIXI.Texture | null;

    /**
     * Open Socket listeners which transact JournalEntry data
     * @internal
     */
    static _activateSocketListeners(socket: io.Socket): void;

    /**
     * Handle a request from the server to reset fog of war for a particular scene.
     * @internal
     */
    protected static _onResetFog(sceneId: string): void | Promise<void>;
  }
}

export {};
