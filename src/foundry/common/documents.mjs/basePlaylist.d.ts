import { DocumentMetadata } from "../abstract/document.mjs";
import { Document } from "../abstract/module.mjs";
import * as data from "../data/data.mjs";
import { BasePlaylistSound } from "./basePlaylistSound";

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
