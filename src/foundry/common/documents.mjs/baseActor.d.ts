import { DocumentMetadata } from '../abstract/document.mjs';
import { Document } from '../abstract/module.mjs';
import { BaseActiveEffect } from './baseActiveEffect';
import { BaseItem } from './baseItem';

export declare class BaseActor extends Document<any, null> {
  static get metadata(): Merge<
    DocumentMetadata,
    {
      name: 'Actor';
      collection: 'actors';
      label: 'DOCUMENT.Actor';
      embedded: {
        ActiveEffect: typeof BaseActiveEffect;
        Item: typeof BaseItem;
      };
      isPrimary: true;
      hasSystemData: true;
      permissions: {
        create: 'ACTOR_CREATE';
      };
      types: string[];
    }
  >;
}
