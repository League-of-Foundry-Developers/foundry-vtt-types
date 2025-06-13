import type { Identity } from "#utils";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      FolderConfig: FolderConfig.Any;
    }
  }
}

/**
 * The Application responsible for configuring a single Folder document.
 * @remarks TODO: Stub
 */
declare class FolderConfig<
  RenderContext extends FolderConfig.RenderContext = FolderConfig.RenderContext,
  Configuration extends FolderConfig.Configuration = FolderConfig.Configuration,
  RenderOptions extends FolderConfig.RenderOptions = FolderConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  Folder.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace FolderConfig {
  interface Any extends AnyFolderConfig {}
  interface AnyConstructor extends Identity<typeof AnyFolderConfig> {}

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext,
      DocumentSheetV2.RenderContext<Folder.Implementation> {}

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration,
      DocumentSheetV2.Configuration<Folder.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyFolderConfig extends FolderConfig<
  FolderConfig.RenderContext,
  FolderConfig.Configuration,
  FolderConfig.RenderOptions
> {
  constructor(...args: never);
}

export default FolderConfig;
