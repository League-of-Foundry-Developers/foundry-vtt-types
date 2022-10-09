import { Document } from "../abstract/module.mjs";
import * as data from "../data/data.mjs";

import type { BasePlaylist } from "./basePlaylist";
import type { BaseUser } from "./baseUser";
import type { DocumentMetadata } from "../abstract/document.mjs";
import type { ConfiguredDocumentClass } from "../../../types/helperTypes";

type PlaylistSoundMetadata = Merge<
  DocumentMetadata,
  {
    name: "PlaylistSound";
    collection: "sounds";
    label: "DOCUMENT.PlaylistSound";
    labelPlural: "DOCUMENT.PlaylistSounds";
    isEmbedded: true;
  }
>;

/**
 * The PlaylistSound model definition which defines common behaviour of a PlaylistSound document between both client and server.
 */
export declare class BasePlaylistSound extends Document<
  data.PlaylistSoundData,
  InstanceType<ConfiguredDocumentClass<typeof BasePlaylist>>,
  PlaylistSoundMetadata
> {
  static override get schema(): typeof data.PlaylistSoundData;

  static override get metadata(): PlaylistSoundMetadata;

  override testUserPermission(
    user: BaseUser,
    permission: keyof typeof foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS | foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS,
    { exact }?: { exact?: boolean }
  ): boolean;
}
