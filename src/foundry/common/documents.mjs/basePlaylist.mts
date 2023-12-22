import type { Merge } from "../../../types/utils.mts";
import type { DocumentMetadata } from "../abstract/document.mts";
import type { Document } from "../abstract/module.mts";
import type * as data from "../data/data.mjs/index.mts";
import type { BasePlaylistSound } from "./basePlaylistSound.mts";

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
