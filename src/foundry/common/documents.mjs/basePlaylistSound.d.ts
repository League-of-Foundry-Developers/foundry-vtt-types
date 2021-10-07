import { Document } from '../abstract/module.mjs';
import * as data from '../data/data.mjs';

import type { BasePlaylist } from './basePlaylist';
import type { BaseUser } from './baseUser';
import type { DocumentMetadata } from '../abstract/document.mjs';
import type { ConfiguredDocumentClass } from '../../../types/helperTypes';

/**
 * The PlaylistSound model definition which defines common behaviour of a PlaylistSound document between both client and server.
 */
export declare class BasePlaylistSound extends Document<
  data.PlaylistSoundData,
  InstanceType<ConfiguredDocumentClass<typeof BasePlaylist>>
> {
  /** @override */
  static get schema(): typeof data.PlaylistSoundData;

  /** @override */
  static get metadata(): Merge<
    DocumentMetadata,
    {
      name: 'PlaylistSound';
      collection: 'sounds';
      label: 'DOCUMENT.PlaylistSound';
      isEmbedded: true;
    }
  >;

  /** @override */
  testUserPermission(
    user: BaseUser,
    permission: keyof typeof foundry.CONST.ENTITY_PERMISSIONS | foundry.CONST.EntityPermission,
    { exact }?: { exact?: boolean }
  ): boolean;
}
