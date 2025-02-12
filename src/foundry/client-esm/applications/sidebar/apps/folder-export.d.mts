import type { EmptyObject } from "fvtt-types/utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type DialogV2 from "../../api/dialog.d.mts";

/**
 * A Dialog subclass that allows the user to configure export options for a Folder
 */
declare class FolderExport<
  RenderContext extends object = EmptyObject,
  Configuration extends DialogV2.Configuration = DialogV2.Configuration,
  RenderOptions extends ApplicationV2.RenderOptions = ApplicationV2.RenderOptions,
> extends DialogV2<RenderContext, Configuration, RenderOptions> {
  #private: true;
}

declare namespace FolderExport {}

export default FolderExport;
