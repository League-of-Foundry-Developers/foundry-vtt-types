import { DocumentMetadata, DocumentModificationOptions } from '../abstract/document';
import { SourceDataType } from '../abstract/helperTypes';
import { Document } from '../abstract/module';
import * as data from '../data/data';
import { BaseActor } from './baseActor';
import { BaseItem } from './baseItem';
import { BaseUser } from './baseUser';

/**
 * The ActiveEffect document model.
 */
// TODO: reference configured Actor and Item classes and add tests for that!!!
export declare class BaseActiveEffect extends Document<data.ActiveEffectData, BaseActor | BaseItem> {
  static get schema(): ConstructorOf<data.ActiveEffectData>;

  static get metadata(): Merge<
    DocumentMetadata,
    {
      name: 'ActiveEffect';
      collection: 'effects';
      label: 'DOCUMENT.ActiveEffect';
      isEmbedded: true;
    }
  >;

  protected _preCreate(
    data: DeepPartial<SourceDataType<data.ActiveEffectData>>,
    options: DocumentModificationOptions,
    user: BaseUser
  ): Promise<void>;

  testUserPermission(
    user: BaseUser,
    permission: keyof typeof foundry.CONST.ENTITY_PERMISSIONS | foundry.CONST.EntityPermission,
    { exact }: { exact?: boolean }
  ): boolean;
}
