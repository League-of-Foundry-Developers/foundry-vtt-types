/**
 * The Collection of FogExploration documents which exist within the active World.
 * This Collection is accessible within the Game object as game.fog.
 *
 * @see {@link FogExploration} The FogExploration document
 */
declare class FogExplorations extends WorldCollection<typeof foundry.documents.BaseFogExploration> {
  static documentName: 'FogExploration';
}
