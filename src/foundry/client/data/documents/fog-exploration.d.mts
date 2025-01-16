import type { InexactPartial } from "../../../../utils/index.d.mts";
import type { DatabaseGetOperation } from "../../../common/abstract/_types.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type BaseFogExploration from "../../../common/documents/fog-exploration.d.mts";

declare global {
  namespace FogExploration {
    type Metadata = Document.MetadataFor<"FogExploration">;

    type ConfiguredClass = Document.ConfiguredClassForName<"FogExploration">;
    type ConfiguredInstance = Document.ConfiguredInstanceForName<"FogExploration">;

    interface DatabaseOperations
      extends Document.Database.Operations<
        FogExploration,
        { loadFog: boolean },
        { loadFog: boolean },
        { loadFog: boolean }
      > {}

    // Helpful aliases
    type ConstructorData = BaseFogExploration.ConstructorData;
    type UpdateData = BaseFogExploration.UpdateData;
    type Schema = BaseFogExploration.Schema;
    type Source = BaseFogExploration.Source;
  }

  /**
   * The client-side FogExploration document which extends the common BaseFogExploration model.
   */
  class FogExploration extends ClientDocumentMixin(foundry.documents.BaseFogExploration) {
    static override metadata: FogExploration.Metadata;

    static get implementation(): FogExploration.ConfiguredClass;

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

    /**
     * @privateRemarks _onCreate, _onUpdate, and _onDelete are all overridden but with no signature changes.
     * For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.
     */
  }

  namespace FogExploration {
    type Any = AnyFogExploration;
    type AnyConstructor = typeof AnyFogExploration;
  }
}

declare abstract class AnyFogExploration extends FogExploration {
  constructor(arg0: never, ...args: never[]);
}
