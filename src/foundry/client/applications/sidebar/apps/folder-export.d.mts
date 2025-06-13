import type { Identity } from "#utils";
import type DialogV2 from "../../api/dialog.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      FolderExport: FolderExport.Any;
    }
  }
}

/**
 * A Dialog subclass that allows the user to configure export options for a Folder
 */
declare class FolderExport<
  RenderContext extends FolderExport.RenderContext = FolderExport.RenderContext,
  Configuration extends FolderExport.Configuration = FolderExport.Configuration,
  RenderOptions extends FolderExport.RenderOptions = FolderExport.RenderOptions,
> extends DialogV2<RenderContext, Configuration, RenderOptions> {
  #FolderExport: true;
}

declare namespace FolderExport {
  interface Any extends AnyFolderExport {}
  interface AnyConstructor extends Identity<typeof AnyFolderExport> {}

  interface RenderContext extends DialogV2.RenderContext {}
  interface Configuration extends DialogV2.Configuration {}
  interface RenderOptions extends DialogV2.RenderOptions {}
}

declare abstract class AnyFolderExport extends FolderExport<
  FolderExport.RenderContext,
  FolderExport.Configuration,
  FolderExport.RenderOptions
> {
  constructor(...args: never);
}

export default FolderExport;
