/**
 * An interface for displaying the content of a CompendiumCollection.
 * @typeParam Metadata - The metadata of the compendium
 * @typeParam Options  - The type of the options object
 * @typeParam Data    - The data structure used to render the handlebars template.
 */
declare class Compendium<
  Metadata extends CompendiumCollection.Metadata,
  Options extends ApplicationOptions = ApplicationOptions,
  Data extends object = Compendium.Data<Metadata>
> extends Application<Options> {
  /**
   * @param collection - The {@link CompendiumCollection} object represented by this interface.
   * @param options    - Application configuration options.
   */
  constructor(collection: CompendiumCollection<Metadata>, options?: Partial<Options> | undefined);

  collection: CompendiumCollection<Metadata>;

  /**
   * @override
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
  static get defaultOptions(): ApplicationOptions;

  /** @override */
  get title(): string;

  /**
   * A convenience redirection back to the metadata object of the associated CompendiumCollection
   */
  get metadata(): this['collection']['metadata'];

  /** @override */
  getData(options?: Partial<Options>): Promise<Data> | Data;

  /** @override */
  close(options?: Application.CloseOptions): Promise<void>;

  /** @override */
  activateListeners(html: JQuery): void;

  /**
   * Handle opening a single compendium entry by invoking the configured document class and its sheet
   * @param event - The originating click event
   */
  protected _onClickEntry(event: JQuery.ClickEvent): void;

  /** @override */
  protected _onSearchFilter(event: KeyboardEvent, query: string, rgx: RegExp, html: HTMLElement): void;

  /** @override */
  protected _canDragStart(selector: string): boolean;

  /** @override */
  protected _canDragDrop(selector: string): boolean;

  /** @override */
  protected _onDragStart(event: DragEvent): void;

  /**
   * @override
   * @internal
   */
  protected _onDrop(event: DragEvent): void;

  /** @override */
  protected _contextMenu(html: JQuery): void;

  /**
   * Get Compendium entry context options
   * @returns The Compendium entry context options
   * @internal
   */
  protected _getEntryContextOptions(): ContextMenuEntry;
}

declare namespace Compendium {
  interface Data<Metadata extends CompendiumCollection.Metadata> {
    collection: CompendiumCollection<Metadata>;
    documentCls: string;
    index: CompendiumCollection<Metadata>['index'];
    documentPartial: string;
  }
}
