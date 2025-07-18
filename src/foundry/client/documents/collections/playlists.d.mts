import type { Identity } from "#utils";
import type Document from "#common/abstract/document.d.mts";

/**
 * The singleton collection of Playlist documents which exist within the active World.
 * This Collection is accessible within the Game object as game.playlists.
 *
 * @see {@linkcode Playlist} The Playlist document
 * @see {@linkcode PlaylistDirectory} The PlaylistDirectory sidebar directory
 */
declare class Playlists extends foundry.documents.abstract.WorldCollection<"Playlist", "Playlists"> {
  static documentName: "Playlist";

  /**
   * Return the subset of Playlist documents which are currently playing
   */
  get playing(): Playlist.Implementation[];

  /**
   * Perform one-time initialization to begin playback of audio.
   */
  initialize(): Promise<void>;

  /**
   * Handle changes to a Scene to determine whether to trigger changes to Playlist documents.
   * @param scene      - The new active Scene
   * @param priorScene - The previously active Scene
   * @internal
   */
  protected _onChangeScene(scene: Scene.Stored | null, priorScene: Scene.Stored | null): Promise<void>;
}

declare namespace Playlists {
  interface Any extends AnyPlaylists {}
  interface AnyConstructor extends Identity<typeof AnyPlaylists> {}

  interface ImplementationClass extends Document.ConfiguredCollectionClass<"Playlist"> {}
  interface Implementation extends Document.ConfiguredCollection<"Playlist"> {}

  /**
   * @deprecated Replaced by {@linkcode Playlists.ImplementationClass}.
   */
  type ConfiguredClass = ImplementationClass;

  /**
   * @deprecated Replaced by {@linkcode Playlists.Implementation}.
   */
  type Configured = Implementation;
}

declare abstract class AnyPlaylists extends Playlists {
  constructor(...args: never);
}

export default Playlists;
