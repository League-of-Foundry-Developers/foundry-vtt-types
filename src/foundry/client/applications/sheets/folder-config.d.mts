import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * The Application responsible for configuring a single Folder document.
 * @remarks TODO: Stub
 */
declare class FolderConfig<
  RenderContext extends FolderConfig.RenderContext = FolderConfig.RenderContext,
  Configuration extends FolderConfig.Configuration = FolderConfig.Configuration,
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  Folder.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace FolderConfig {
  interface RenderContext extends DocumentSheetV2.RenderContext<Folder.Implementation> {}

  interface Configuration extends DocumentSheetV2.Configuration<Folder.Implementation> {}
}

export default FolderConfig;
