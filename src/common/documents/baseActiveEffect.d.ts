import { DocumentMetadata, DocumentModificationOptions } from '../abstract/document';
import { Document } from '../abstract/module';
import * as data from '../data/data';
import { BaseActor } from './baseActor';
import { BaseItem } from './baseItem';
import { BaseUser } from './baseUser';

/**
 * The ActiveEffect document model.
 */
declare class BaseActiveEffect extends Document<data.ActiveEffectData, BaseActor | BaseItem> {
  /** {@inheritdoc} */
  static get schema(): ConstructorOf<data.ActiveEffectData>;

  /** {@inheritdoc} */
  static get metadata(): Merge<
    DocumentMetadata,
    {
      name: 'ActiveEffect';
      collection: 'effects';
      label: 'DOCUMENT.ActiveEffect';
      isEmbedded: true;
    }
  >;

  /** {@inheritdoc} */
  protected _preCreate(
    data: data.ActiveEffectData,
    options: DocumentModificationOptions,
    user: BaseUser
  ): Promise<void>;

  /** {@inheritdoc} */
  testUserPermission(
    user: BaseUser,
    permission: keyof typeof foundry.CONST.ENTITY_PERMISSIONS | foundry.CONST.EntityPermission,
    { exact }: { exact?: boolean }
  ): boolean;
}
