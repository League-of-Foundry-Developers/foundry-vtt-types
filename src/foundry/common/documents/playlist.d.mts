import type { Merge } from "../../../types/utils.d.mts";
import type { DocumentMetadata } from "../abstract/document.d.mts";
import type { Document } from "../abstract/module.d.mts";
import type * as data from "../data/data.mjs/index.d.mts";
import type { BasePlaylistSound } from "./playlist-sound.d.mts";

type PlaylistMetadata = Merge<
  DocumentMetadata,
  {
    name: "Playlist";
    collection: "playlists";
    label: "DOCUMENT.Playlist";
    labelPlural: "DOCUMENT.Playlists";
    embedded: {
      PlaylistSound: typeof BasePlaylistSound;
    };
    isPrimary: true;
  }
>;

/**
 * The base Playlist model definition which defines common behavior of an Playlist document between both client and server.
 */
export declare class BasePlaylist extends Document<data.PlaylistData, null, PlaylistMetadata> {
  static override get schema(): typeof data.PlaylistData;

  static override get metadata(): PlaylistMetadata;

  /**
   * A reference to the Collection of ActiveEffect instances in the Actor document, indexed by _id.
   */
  get sounds(): this["data"]["sounds"];
}
