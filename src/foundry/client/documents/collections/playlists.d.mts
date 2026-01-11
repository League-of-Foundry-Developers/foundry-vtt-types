import type { Identity } from "#utils";
import type Document from "#common/abstract/document.d.mts";
import type { WorldCollection } from "#client/documents/abstract/_module.d.mts";

/**
 * The singleton collection of Playlist documents which exist within the active World.
 * This Collection is accessible within the Game object as {@linkcode foundry.Game.playlists | game.playlists}.
 *
 * @see {@linkcode foundry.documents.Playlist}: The Playlist document
 * @see {@linkcode foundry.applications.sidebar.tabs.PlaylistDirectory}: The PlaylistDirectory sidebar
 */
declare class Playlists extends WorldCollection<"Playlist"> {
  static override documentName: "Playlist";

  /** @privateRemarks Fake type override */
  static override get instance(): Playlists.Implementation;

  /** Return the subset of Playlist documents which are currently playing */
  get playing(): Playlist.Stored[];

  /** Perform one-time initialization to begin playback of audio. */
  initialize(): Promise<void>;

  /**
   * Handle changes to a Scene to determine whether to trigger changes to Playlist documents.
   * @param scene      - The new active Scene
   * @param priorScene - The previously active Scene
   * @internal
   *
   * @remarks Called by {@linkcode Scene._onCreate | Scene#_onCreate}, {@linkcode Scene._onUpdate | Scene#_onUpdate},
   * and {@linkcode Scene._onDelete | Scene#_onDelete}.
   */
  _onChangeScene(scene: Scene.Stored | null, priorScene: Scene.Stored | null): Promise<void>;
}

declare namespace Playlists {
  /**
   * @deprecated There should only be a single implementation of this class in use at one time,
   * use {@linkcode Playlists.Implementation} instead. This will be removed in v15.
   */
  type Any = Internal.Any;

  /**
   * @deprecated There should only be a single implementation of this class in use at one time,
   * use {@linkcode Playlists.ImplementationClass} instead. This will be removed in v15.
   */
  type AnyConstructor = Internal.AnyConstructor;

  namespace Internal {
    interface Any extends AnyPlaylists {}
    interface AnyConstructor extends Identity<typeof AnyPlaylists> {}
  }

  interface ImplementationClass extends Document.Internal.ConfiguredCollectionClass<"Playlist"> {}
  interface Implementation extends Document.Internal.ConfiguredCollection<"Playlist"> {}

  /** @deprecated Replaced by {@linkcode Playlists.ImplementationClass}. Will be removed in v15. */
  type ConfiguredClass = ImplementationClass;

  /** @deprecated Replaced by {@linkcode Playlists.Implementation}. Will be removed in v15. */
  type Configured = Implementation;
}

export default Playlists;

declare abstract class AnyPlaylists extends Playlists {
  constructor(...args: never);
}
