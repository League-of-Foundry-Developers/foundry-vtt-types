//TODO: This is just a stub
import { ClientDocumentMixin } from '../clientDocumentMixin';

declare global {
  /**

   * The client-side FogExploration document which extends the common BaseFogExploration model.
   * Each FogExploration document contains FogExplorationData which defines its data schema.
   *
   * @see {@link data.FogExplorationData}              The FogExploration data schema
   */
  class FogExploration extends ClientDocumentMixin<foundry.documents.BaseFogExploration> {}
}

export {};
