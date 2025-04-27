import type ApplicationV2 from "./application.d.mts";
import type HandlebarsApplicationMixin from "./handlebars-application.d.mts";

/**
 * An abstract class responsible for displaying a 2-pane Application that allows for entries to be grouped and filtered
 * by category.
 * @remarks TODO: Stub
 * @remarks This is not actually *imported* anywhere it can be used, it appears to be for internal FVTT use only.
 */
declare class CategoryBrowser<
  RenderContext extends CategoryBrowser.RenderContext = CategoryBrowser.RenderContext,
  Configuration extends CategoryBrowser.Configuration = CategoryBrowser.Configuration,
  RenderOptions extends
    HandlebarsApplicationMixin.ApplicationV2RenderOptions = HandlebarsApplicationMixin.ApplicationV2RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {}

declare namespace CategoryBrowser {
  interface Configuration extends ApplicationV2.Configuration {
    /** The initial category tab: omitting this will result in an initial active tab that corresponds with the first category by insertion order. */
    initialCategory: string | null;

    /** Additional Template partials for specific use with this class */
    subtemplates: Subtemplates;
  }

  interface Subtemplates {
    /** The markup used for each category: required to be set by any subclass */
    category: string;

    /** Optional template for secondary filtering (aside from text search) */
    filter: string | null;

    /** Optional sidebar footer content */
    sidebarFooter: string | null;
  }

  interface RenderContext extends ApplicationV2.RenderContext {}
}

export default CategoryBrowser;
