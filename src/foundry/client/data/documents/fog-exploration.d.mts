import type { ConfiguredDocumentClassForName } from "../../../../types/helperTypes.d.mts";
import type { InexactPartial } from "../../../../types/utils.d.mts";
import type { DatabaseGetOperation } from "../../../common/abstract/_types.d.mts";
import type { DocumentModificationOptions } from "../../../common/abstract/document.d.mts";

declare global {
  namespace FogExploration {
    type ConfiguredClass = ConfiguredDocumentClassForName<"FogExploration">;
    type ConfiguredInstance = InstanceType<ConfiguredClass>;
  }

  /**
   * The client-side FogExploration document which extends the common BaseFogExploration model.
   */
  class FogExploration extends ClientDocumentMixin(foundry.documents.BaseFogExploration) {
    /**
     * Obtain the fog of war exploration progress for a specific Scene and User.
     * @param query      - Parameters for which FogExploration document is retrieved
     * @param options    - Additional options passed to DatabaseBackend#get.
     *                     (default: `{}`)
     * @returns
     */
    static load(
      query?: InexactPartial<{
        /** A certain Scene ID **/
        scene: string;
        /** A certain User ID **/
        user: string;
      }>,
      options?: InexactPartial<DatabaseGetOperation>,
    ): Promise<FogExploration | null>;

    /**
     * Transform the explored base64 data into a PIXI.Texture object
     */
    getTexture(): PIXI.Texture | null;

    protected override _onCreate(data: this["_source"], options: DocumentModificationOptions, userId: string): void;

    protected override _onUpdate(
      changed: foundry.documents.BaseFogExploration.UpdateData,
      options: DocumentModificationOptions,
      userId: string,
    ): void;

    protected override _onDelete(options: DocumentModificationOptions, userId: string): void;
  }
}
