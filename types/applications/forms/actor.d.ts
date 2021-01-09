/**
 * The default Actor Sheet
 *
 * This Application is responsible for rendering an actor's attributes and allowing the actor to be edited.
 *
 * System modifications may elect to override this class to better suit their own game system by re-defining the value
 * `CONFIG.Actor.sheetClass`.
 * @typeParam T - the type of the data used to render the inner template
 * @typeParam D - the type of the data in the Entity
 * @typeParam O - the type of the Entity which should be managed by this form
 *                sheet
 * @typeParam F - the type of the of validated form data with which to update
 *                the Entity
 */
declare class ActorSheet<
  T = object,
  D = object,
  O extends Actor<D> = Actor<D>,
  F = object
> extends BaseEntitySheet<T, D, O, F> {
  /**
   * If this Actor Sheet represents a synthetic Token actor, reference the active Token
   */
  token: Token

  /**
   * @param actor - The Actor instance being displayed within the sheet.
   * @param options - Additional options which modify the rendering of the
   *                  Actor's sheet.
   * @param editable - Is the Actor editable? Default is true.
   */
  constructor (...args: any)

  /**
   * Default rendering and configuration options used for the ActorSheet and its subclasses.
   * See `Application.defaultOptions` and `FormApplication.defaultOptions` for more details.
   */
  static get defaultOptions (): BaseEntitySheet.Options

  /**
   * A convenience reference to the Actor entity
   */
  get actor (): O

  /**
   * Define a unique and dynamic element ID for the rendered ActorSheet application
   */
  get id (): string

  /**
   * The displayed window title for the sheet - the entity name by default
   */
  get title (): string

  /**
   * Remove references to an active Token when the sheet is closed
   * See Application.close for more detail
   */
  close (): Promise<void>

  /**
   * @param options - (unused)
   * @override
   */
  getData (options?: any): ActorSheet.Data<D, O>

  /**
   * Extend the Header Button configuration for the ActorSheet to add Token configuration buttons
   * See Application._getHeaderButtons for documentation of the return Array structure.
   */
  _getHeaderButtons (): any[]

  _getSortSiblings (source: any): any

  /**
   * Handle requests to configure the default sheet used by this Actor
   */
  _onConfigureSheet (event: Event | JQuery.Event): void

  /**
   * Handle requests to configure the prototype Token for the Actor
   */
  _onConfigureToken (event: Event | JQuery.Event): void

  /**
   * Default handler for beginning a drag-drop workflow of an Owned Item on an Actor Sheet
   */
  _onDragItemStart (event: Event | JQuery.Event): boolean

  /**
   * Allow the Actor sheet to be a displayed as a valid drop-zone
   */
  _onDragOver (event: Event | JQuery.Event): boolean

  /**
   * Handle dropped data on the Actor sheet
   */
  _onDrop (event: Event | JQuery.Event): Promise<boolean | any>

  /**
   * Handle changing the actor profile image by opening a FilePicker
   */
  _onEditImage (event: Event | JQuery.Event): void

  /**
   * Handle a drop event for an existing Owned Item to sort that item
   */
  _onSortItem (
    event: Event | JQuery.Event,
    itemData: object
  ): Promise<any>

  /**
   * Activate the default set of listeners for the Actor Sheet
   * These listeners handle basic stuff like form submission or updating images
   *
   * @param html - The rendered template ready to have listeners attached
   */
  activateListeners (html: JQuery | HTMLElement): void
}

declare namespace ActorSheet {
  /**
   * @typeParam D - the type of the data in the Entity
   * @typeParam O - the type of the Entity which should be managed by this form
   *                sheet
   */
  interface Data<D, O> extends BaseEntitySheet.Data<D, O> {
    actor: Actor
    data: ActorData<D>
    items: Collection<Item>
  }
}
