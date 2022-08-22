/**
 * An interface for displaying the content of a CompendiumCollection.
 * @typeParam Metadata - The metadata of the compendium
 * @typeParam Options  - The type of the options object
 */
declare class Compendium<
  Metadata extends CompendiumCollection.Metadata,
  Options extends ApplicationOptions = ApplicationOptions
> extends Application<Options> {
  /**
   * @param collection - The {@link CompendiumCollection} object represented by this interface.
   * @param options    - Application configuration options.
   */
  constructor(collection: CompendiumCollection<Metadata>, options?: Partial<Options> | undefined);

  collection: CompendiumCollection<Metadata>;

  /**
   * @defaultValue
   * ```typescript
   * foundry.utils.mergeObject(super.defaultOptions, {
   *   template: "templates/apps/compendium.html",
   *   width: 350,
   *   height: window.innerHeight - 100,
   *   top: 70,
   *   left: 120,
   *   scrollY: [".directory-list"],
   *   dragDrop: [{ dragSelector: ".directory-item", dropSelector: ".directory-list" }],
   *   filters: [{inputSelector: 'input[name="search"]', contentSelector: ".directory-list"}]
   * });
   * ```
   */
  static override get defaultOptions(): ApplicationOptions;

  override get title(): string;

  /**
   * A convenience redirection back to the metadata object of the associated CompendiumCollection
   */
  get metadata(): this["collection"]["metadata"];

  override getData(options?: Partial<Options>): MaybePromise<object>;

  override close(options?: Application.CloseOptions): Promise<void>;

  override activateListeners(html: JQuery): void;

  /**
   * Handle opening a single compendium entry by invoking the configured document class and its sheet
   * @param event - The originating click event
   */
  protected _onClickEntry(event: JQuery.ClickEvent): void;

  protected override _onSearchFilter(event: KeyboardEvent, query: string, rgx: RegExp, html: HTMLElement): void;

  protected override _canDragStart(selector: string): boolean;

  protected override _canDragDrop(selector: string): boolean;

  protected override _onDragStart(event: DragEvent): void;

  /**
   * @internal
   */
  protected override _onDrop(event: DragEvent): void;

  protected override _contextMenu(html: JQuery): void;

  /**
   * Get Compendium entry context options
   * @returns The Compendium entry context options
   * @internal
   */
  protected _getEntryContextOptions(): ContextMenuEntry;
}
