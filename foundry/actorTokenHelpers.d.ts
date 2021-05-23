/**
 * A collection of replacement functions which are used in Actor socket workflows to replace default behaviors.
 * These methods are factored out in order to keep the main Actor update workflow clean.
 */
declare class ActorTokenHelpers {
  /** @override */
  createEmbeddedEntity<T extends Actor, U>(
    this: T,
    embeddedName: 'OwnedItem',
    data: Expanded<U> extends DeepPartial<Actor.OwnedItemData<T['_data']>>
      ? U | U[]
      : DeepPartial<Actor.OwnedItemData<T['_data']>> | DeepPartial<Actor.OwnedItemData<T['_data']>>[],
    options?: Entity.CreateOptions
  ): Promise<Actor.OwnedItemData<T['_data']> | Actor.OwnedItemData<T['_data']>[] | null>;
  createEmbeddedEntity<T extends Actor, U>(
    this: T,
    embeddedName: 'ActiveEffect',
    data: Expanded<U> extends DeepPartial<ActiveEffect.Data>
      ? U | U[]
      : DeepPartial<ActiveEffect.Data> | DeepPartial<ActiveEffect.Data>[],
    options?: Entity.CreateOptions
  ): Promise<ActiveEffect.Data | ActiveEffect.Data[] | null>;

  /** @override */
  deleteEmbeddedEntity<T extends Actor>(
    this: T,
    embeddedName: 'OwnedItem',
    data: string | string[],
    options?: Entity.DeleteOptions
  ): Promise<Actor.OwnedItemData<T['_data']> | Actor.OwnedItemData<T['_data']>[]>;
  deleteEmbeddedEntity<T extends Actor>(
    this: T,
    embeddedName: 'ActiveEffect',
    data: string | string[],
    options?: Entity.DeleteOptions
  ): Promise<ActiveEffect.Data | ActiveEffect.Data[]>;

  /** @override */
  update<T extends Actor, U>(
    this: T,
    data: Expanded<U> extends DeepPartial<Actor.Data> ? U : never,
    options?: Entity.UpdateOptions
  ): Promise<T>;

  /** @override */
  updateEmbeddedEntity<T extends Actor, U>(
    this: T,
    embeddedName: 'OwnedItem',
    data: Expanded<U> extends DeepPartial<Actor.OwnedItemData<T['_data']>> & { _id: string }
      ? U | U[]
      :
          | (DeepPartial<Actor.OwnedItemData<T['_data']>> & { _id: string })
          | (DeepPartial<Actor.OwnedItemData<T['_data']>> & { _id: string })[],
    options?: Entity.UpdateOptions
  ): Promise<Actor.OwnedItemData<T['_data']> | Actor.OwnedItemData<T['_data']>[]>;
  updateEmbeddedEntity<T extends Actor, U>(
    this: T,
    embeddedName: 'ActiveEffect',
    data: Expanded<U> extends DeepPartial<ActiveEffect.Data> & { _id: string }
      ? U | U[]
      : (DeepPartial<ActiveEffect.Data> & { _id: string }) | (DeepPartial<ActiveEffect.Data> & { _id: string })[],
    options?: Entity.UpdateOptions
  ): Promise<ActiveEffect.Data | ActiveEffect.Data[]>;
}
