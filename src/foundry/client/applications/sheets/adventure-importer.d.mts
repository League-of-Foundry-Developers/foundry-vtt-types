import type { Identity } from "#utils";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      AdventureImporterV2: AdventureImporterV2.Any;
    }
  }
}

/**
 * This Document Sheet is responsible for rendering an Adventure and providing an interface to import it.
 * @remarks TODO: Stub
 */
declare class AdventureImporterV2<
  RenderContext extends AdventureImporterV2.RenderContext = AdventureImporterV2.RenderContext,
  Configuration extends AdventureImporterV2.Configuration = AdventureImporterV2.Configuration,
  RenderOptions extends AdventureImporterV2.RenderOptions = AdventureImporterV2.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  Adventure.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace AdventureImporterV2 {
  interface Any extends AnyAdventureImporterV2 {}
  interface AnyConstructor extends Identity<typeof AnyAdventureImporterV2> {}

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext,
      DocumentSheetV2.RenderContext<Adventure.Implementation> {}
  interface Configuration
    extends HandlebarsApplicationMixin.Configuration,
      DocumentSheetV2.Configuration<Adventure.Implementation> {}
  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyAdventureImporterV2 extends AdventureImporterV2<
  AdventureImporterV2.RenderContext,
  AdventureImporterV2.Configuration,
  AdventureImporterV2.RenderOptions
> {
  constructor(...args: never);
}

export default AdventureImporterV2;
