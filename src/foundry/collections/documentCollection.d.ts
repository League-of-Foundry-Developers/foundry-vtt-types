/**
 * An iterable container of Entity objects within the Foundry Virtual Tabletop framework.
 * Each Entity type has it's own subclass of EntityCollection, which defines the abstract interface.
 * @typeParam T - The type of Entities in the EntityCollection
 */
declare abstract class DocumentCollection<T extends Entity = Entity> extends foundry.utils.Collection<T> {
  /**
   * @param data - An Array of Entity data from which to create instances
   */
  constructor(data: T['_data'][]);

  /**
   * An Array of application references which will be automatically updated when
   * the collection content changes
   */
  apps: Application[];

  /**
   * Render any Applications associated with this EntityCollection
   * @param args -
   * @returns A reference to the rendered EntityCollection
   * @see {@link Application.render}
   */
  render(...args: Parameters<Application['render']>): this;

  /**
   * The EntityCollection name
   */
  get name(): string;

  /**
   * Return a reference to the Entity subclass which should be used when
   * creating elements of this EntityCollection.
   * This should always be an explicit reference to the class which is used in
   * this game to represent the entity, and not the base implementation of that
   * entity type.
   */
  get documentClass(): ConstructorOf<T>;

  /**
   * A reference to the named Document class which is contained within this DocumentCollection.
   */
  get documentName(): string;

  /**
   * Update all objects in this EntityCollection with a provided transformation.
   * Conditionally filter to only apply to Entities which match a certain
   * condition.
   * @param transformation - An object of data or function to apply to all
   *                         matched objects
   * @param condition      - A function which tests whether to target each object
   *                         (default: `null`)
   * @param options        - Additional options passed to Entity.update
   * @returns An array of updated data once the operation is complete
   */
  updateAll(
    transformation: DeepPartial<T['_data']> | ((obj: T) => DeepPartial<T['_data']>),
    condition?: (obj: T) => boolean,
    options?: Entity.UpdateOptions
  ): Promise<T[]>;

  /**
   * Preliminary actions taken before a set of Documents in this Collection are created.
   * @param result -       An Array of created data objects
   * @param options -       Options which modified the creation operation
   * @param userId -       The ID of the User who triggered the operation
   */
  _preCreateDocuments(result: T['_data'][], options: Entity.UpdateOptions, userId: string): void;

  /**
   * Follow-up actions taken after a set of Documents in this Collection are created.
   * @param documents -   An Array of created Documents
   * @param result -        An Array of created data objects
   * @param options -         Options which modified the creation operation
   * @param userId -          The ID of the User who triggered the operation
   */
  _onCreateDocuments(documents: T[], result: T['_data'][], options: Entity.UpdateOptions, userId: string): void;

  /**
   * Preliminary actions taken before a set of Documents in this Collection are updated.
   * @param result -        An Array of incremental data objects
   * @param options -         Options which modified the update operation
   * @param userId -          The ID of the User who triggered the operation
   */
  _preUpdateDocuments(result: T['_data'][], options: Entity.UpdateOptions, userId: string): void;

  /**
   * Follow-up actions taken after a set of Documents in this Collection are updated.
   * @param documents -   An Array of updated Documents
   * @param result -        An Array of incremental data objects
   * @param options -         Options which modified the update operation
   * @param userId -          The ID of the User who triggered the operation
   */
  _onUpdateDocuments(documents: T[], result: T['_data'][], options: Entity.UpdateOptions, userId: string): void;

  /**
   * Preliminary actions taken before a set of Documents in this Collection are deleted.
   * @param result -        An Array of document IDs being deleted
   * @param options -         Options which modified the deletion operation
   * @param userId -          The ID of the User who triggered the operation
   */
  _preDeleteDocuments(result: T['_data'][], options: Entity.UpdateOptions, userId: string): void;

  /**
   * Follow-up actions taken after a set of Documents in this Collection are deleted.
   * @param documents -   An Array of deleted Documents
   * @param result -        An Array of document IDs being deleted
   * @param options -         Options which modified the deletion operation
   * @param userId -          The ID of the User who triggered the operation
   */
  _onDeleteDocuments(documents: T[], result: T['_data'][], options: object, userId: string): void;
}
