// TODO
declare global {
  /**
   * The client-side Playlist document which extends the common BasePlaylist abstraction.
   * Each Playlist document contains PlaylistData which defines its data schema.
   *
   * @see {@link data.PlaylistData}               The Playlist data schema
   * @see {@link documents.Playlists}             The world-level collection of Playlist documents
   * @see {@link embedded.PlaylistSound}          The PlaylistSound embedded document within a parent Playlist
   * @see {@link applications.PlaylistConfig}     The Playlist configuration application
   *
   * @param data - Initial data provided to construct the Playlist document
   */
  class Playlist extends ClientDocumentMixin(foundry.documents.BasePlaylist) {}
}

export {};
