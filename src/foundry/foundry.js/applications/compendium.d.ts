/**
 * An interface for displaying the content of a CompendiumCollection.
 * @typeParam Metadata - The metadata of the compendium
 * @typeParam Options  - The type of the options object
 */
declare class Compendium<
  Metadata extends CompendiumCollection.Metadata,
  Options extends Application.Options = Application.Options
> extends Application<Options> {
  constructor(collection: CompendiumCollection<Metadata>, options?: Partial<Options>);

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
  static get defaultOptions(): Application.Options;

  /** @override */
  get title(): string;

  /**
   * A convenience redirection back to the metadata object of the associated CompendiumCollection
   */
  get metadata(): this['collection']['metadata'];

  /** @override */
  getData(options?: Partial<Options>): Promise<Compendium.Data<Metadata>>;

  /** @override */
  close(options?: Application.CloseOptions): Promise<void>;

  /** @override */
  activateListeners(html: JQuery): void;

  /**
   * Handle opening a single compendium entry by invoking the configured entity class and its sheet
   * @param event - The originating click event
   * @remarks
   * This actually returns a promise of {@link FormApplication} but the return type is not meant to be used, so it is
   * typed as `unknown` to give deriving classes more freedom.
   */
  protected _onClickEntry(event: JQuery.ClickEvent): Promise<unknown>;

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

  /**
   * Render the ContextMenu which applies to each compendium Document
   */
  protected _contextMenu(html: JQuery): void;
}

declare namespace Compendium {
  interface Data<Metadata extends CompendiumCollection.Metadata> {
    collection: CompendiumCollection<Metadata>;
    cssClass: string;
    index: CompendiumCollection<Metadata>['index'];
  }
}
