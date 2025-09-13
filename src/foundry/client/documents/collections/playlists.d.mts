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
  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode Implementation} instead */
  type Any = Internal.Any;

  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode ImplementationClass} instead */
  type AnyConstructor = Internal.AnyConstructor;

  namespace Internal {
    interface Any extends AnyPlaylists {}
    interface AnyConstructor extends Identity<typeof AnyPlaylists> {}
  }

  interface ImplementationClass extends Document.Internal.ConfiguredCollectionClass<"Playlist"> {}
  interface Implementation extends Document.Internal.ConfiguredCollection<"Playlist"> {}

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
