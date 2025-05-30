import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "./application.d.mts";
import type HandlebarsApplicationMixin from "./handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      CategoryBrowser: CategoryBrowser.Any;
    }
  }
}

/**
 * An abstract class responsible for displaying a 2-pane Application that allows for entries to be grouped and filtered
 * by category.
 */
declare abstract class CategoryBrowser<
  Entry,
  RenderContext extends CategoryBrowser.RenderContext<Entry> = CategoryBrowser.RenderContext<Entry>,
  Configuration extends CategoryBrowser.Configuration = CategoryBrowser.Configuration,
  RenderOptions extends CategoryBrowser.RenderOptions = CategoryBrowser.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  static DEFAULT_OPTIONS: DeepPartial<CategoryBrowser.Configuration> & object;

  static PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * Is category and/or entry data loaded? Most subclasses will already have their data close at hand.
   */
  protected get _dataLoaded(): boolean;

  protected override _initializeApplicationOptions(options: DeepPartial<Configuration>): Configuration;

  protected override _configureRenderParts(
    options: RenderOptions,
  ): Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * Perform a text search without a `KeyboardEvent`.
   */
  search(query: string): void;

  override render(options?: DeepPartial<RenderOptions>): Promise<this>;

  /** @deprecated Exists for backwards compatibility with the original `ApplicationV1#render` signature. */
  override render(options: boolean, _options?: DeepPartial<RenderOptions>): Promise<this>;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  /**
   * Prepare the structure of category data which is rendered in this configuration form.
   */
  protected abstract _prepareCategoryData(): Promise<Record<string, CategoryBrowser.CategoryData<Entry>>>;

  /**
   * An optional method to make a potentially long-running request to load category data: a temporary message will be
   * displayed until completion.
   */
  protected _loadCategoryData(): Promise<void>;

  /**
   * Reusable logic for how categories are sorted in relation to each other.
   */
  protected _sortCategories(a: CategoryBrowser.CategoryData<Entry>, b: CategoryBrowser.CategoryData<Entry>): number;

  protected override _getTabsConfig(group: string): ApplicationV2.TabsConfiguration | null;

  protected _tearDown(options: DeepPartial<ApplicationV2.ClosingOptions>): void;

  protected _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  /**
   * Handle search input
   */
  _onSearchFilter: unknown; // TODO: SearchFilter.Callback
}

declare namespace CategoryBrowser {
  interface Any extends AnyCategoryBrowser {}
  interface AnyConstructor extends Identity<typeof AnyCategoryBrowser> {}

  /**
   * @remarks Foundry's override of `_prepareContext` does not call `super`. Therefore it does not
   * inherit context from its parent class.
   */
  interface RenderContext<Entry> {
    rootId: string;
    loading: boolean | null;
    categories: CategoryData<Entry>;
    packageList: boolean;
    subtemplates: Subtemplates;
    submitButton: boolean;
  }

  interface Configuration extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration {
    /** The initial category tab: omitting this will result in an initial active tab that corresponds with the first category by insertion order. */
    initialCategory: string | null;

    /** Additional Template partials for specific use with this class */
    subtemplates: Subtemplates;
  }

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}

  interface Subtemplates {
    /** The markup used for each category: required to be set by any subclass */
    category: string;

    /** Optional template for secondary filtering (aside from text search) */
    filter: string | null;

    /** Optional sidebar footer content */
    sidebarFooter: string | null;
  }

  interface CategoryData<Entry> {
    id: string;
    label: string;
    entries: Entry[];
  }
}

declare abstract class AnyCategoryBrowser extends CategoryBrowser<
  unknown,
  CategoryBrowser.RenderContext<unknown>,
  CategoryBrowser.Configuration,
  CategoryBrowser.RenderOptions
> {}

export default CategoryBrowser;
