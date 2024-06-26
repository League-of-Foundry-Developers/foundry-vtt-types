import type { ConfiguredDocumentClassForName } from "../../../../types/helperTypes.d.mts";
import type { DocumentModificationOptions } from "../../../common/abstract/document.d.mts";

declare global {
  /**
   * The client-side FogExploration document which extends the common BaseFogExploration model.
   */
  class FogExploration extends ClientDocumentMixin(foundry.documents.BaseFogExploration) {
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

  namespace FogExploration {
    type ConfiguredInstance = InstanceType<ConfiguredDocumentClassForName<"FogExploration">>;
  }
}
