import type { Identity } from "#utils";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      AdventureExporter: AdventureExporter.Any;
    }
  }
}

/**
 * An interface for packaging Adventure content and loading it to a compendium pack.
 * @remarks TODO: Stub
 */
declare class AdventureExporter<
  RenderContext extends AdventureExporter.RenderContext = AdventureExporter.RenderContext,
  Configuration extends AdventureExporter.Configuration = AdventureExporter.Configuration,
  RenderOptions extends AdventureExporter.RenderOptions = AdventureExporter.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  Adventure.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace AdventureExporter {
  interface Any extends AnyAdventureExporter {}
  interface AnyConstructor extends Identity<typeof AnyAdventureExporter> {}

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext,
      DocumentSheetV2.RenderContext<Adventure.Implementation> {}

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration,
      DocumentSheetV2.Configuration<Adventure.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyAdventureExporter extends AdventureExporter<
  AdventureExporter.RenderContext,
  AdventureExporter.Configuration,
  AdventureExporter.RenderOptions
> {
  constructor(...args: never);
}

export default AdventureExporter;
