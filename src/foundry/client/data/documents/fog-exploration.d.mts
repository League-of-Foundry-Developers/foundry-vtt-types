import type { ConfiguredDocumentClassForName } from "../../../../types/helperTypes.d.mts";
import type { DeepPartial, StoredDocument } from "../../../../types/utils.d.mts";
import type { RequestContext, RequestOptions } from "../../../common/abstract/backend.d.mts";
import type { DocumentModificationOptions } from "../../../common/abstract/document.d.mts";

declare global {
  /**
   * The client-side FogExploration document which extends the common BaseFogExploration model.
   */
  //@ts-expect-error Foundry turned a synchronous static function into async, fixed in v12
  class FogExploration extends ClientDocumentMixin(foundry.documents.BaseFogExploration) {
    /**
     * Obtain the fog of war exploration progress for a specific Scene and User.
     * @param options - (default: `{}`)
     */
    static get(
      query?: {
        scene?: Scene;
        user?: User;
        options?: RequestContext<FogExploration>;
      },
      options?: RequestOptions,
    ): Promise<StoredDocument<FogExploration.ConfiguredInstance> | null>;

    /**
     * Transform the explored base64 data into a PIXI.Texture object
     */
    getTexture(): PIXI.Texture | null;

    protected _onCreate(data: this["_source"], options: DocumentModificationOptions, userId: string): void;

    protected _onUpdate(
      changed: DeepPartial<this["_source"]>,
      options: DocumentModificationOptions,
      userId: string,
    ): void;

    protected _onDelete(options: DocumentModificationOptions, userId: string): void;
  }

  namespace FogExploration {
    type ConfiguredInstance = InstanceType<ConfiguredDocumentClassForName<"FogExploration">>;
  }
}
