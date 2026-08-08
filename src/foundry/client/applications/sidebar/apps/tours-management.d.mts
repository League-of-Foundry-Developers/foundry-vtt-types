import type { DeepPartial, Identity, MaybePromise } from "#utils";
import type CategoryBrowser from "../../api/category-browser.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      ToursManagement: ToursManagement.Any;
    }
  }
}

/**
 * A management app for configuring which Tours are available or have been completed.
 */
declare class ToursManagement<
  Entry extends ToursManagement.Entry = ToursManagement.Entry,
  RenderContext extends ToursManagement.RenderContext<Entry> = ToursManagement.RenderContext<Entry>,
  Configuration extends ToursManagement.Configuration = ToursManagement.Configuration,
  RenderOptions extends ToursManagement.RenderOptions = ToursManagement.RenderOptions,
> extends CategoryBrowser<Entry, RenderContext, Configuration, RenderOptions> {
  // Fake override.
  static override DEFAULT_OPTIONS: ToursManagement.DefaultOptions;

  /**
   * @privateRemarks Synchronous at runtime; kept at the base's {@linkcode MaybePromise} width.
   */
  protected override _prepareCategoryData(): MaybePromise<Record<string, CategoryBrowser.CategoryData<Entry>>>;

  /** @remarks Orders `core` first, then the active system, then everything else alphabetically by label. */
  protected override _sortCategories(
    a: CategoryBrowser.CategoryData<Entry>,
    b: CategoryBrowser.CategoryData<Entry>,
  ): number;

  #ToursManagement: true;

  static #ToursManagementStatic: true;
}

declare namespace ToursManagement {
  interface Any extends AnyToursManagement {}
  interface AnyConstructor extends Identity<typeof AnyToursManagement> {}

  interface Entry {
    /** The tour's fully-qualified identifier, `<namespace>.<id>`. */
    id: string;

    label: string;

    completed: boolean;

    /** The restriction notice and the tour description, joined by `<br>`. */
    hint: string;

    status: string;

    /**
     * Whether the tour can be started or resumed.
     *
     * @remarks Absent for a completed tour, which offers only a reset.
     */
    canPlay?: boolean | undefined;

    /** The localized label for the play button, absent for a completed tour. */
    startOrResume?: string | undefined;

    /** Present only once the tour has been started. */
    canReset?: boolean | undefined;
  }

  interface RenderContext<Entry> extends CategoryBrowser.RenderContext<Entry> {}

  interface Configuration<
    ToursManagement extends ToursManagement.Any = ToursManagement.Any,
  > extends CategoryBrowser.Configuration<ToursManagement> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<ToursManagement extends ToursManagement.Any = ToursManagement.Any> = DeepPartial<
    Configuration<ToursManagement>
  > &
    object;

  interface RenderOptions extends CategoryBrowser.RenderOptions {}
}

declare abstract class AnyToursManagement extends ToursManagement<
  ToursManagement.Entry,
  ToursManagement.RenderContext<ToursManagement.Entry>,
  ToursManagement.Configuration,
  ToursManagement.RenderOptions
> {
  constructor(...args: never);
}

export default ToursManagement;
