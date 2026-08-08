import type { DeepPartial, Identity } from "#utils";
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
  // Fake override.
  static override DEFAULT_OPTIONS: FolderExport.DefaultOptions;

  /**
   * @remarks Watches the pack selector, so that choosing a pack repopulates the folder selector with that
   * pack's folders and disables it when the pack has none.
   */
  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  #FolderExport: true;
}

declare namespace FolderExport {
  interface Any extends AnyFolderExport {}
  interface AnyConstructor extends Identity<typeof AnyFolderExport> {}

  interface RenderContext extends DialogV2.RenderContext {}

  /**
   * @privateRemarks Not parameterized by the concrete application, unlike its siblings: `DialogV2.Button`'s
   * callback is invariant in that type, so a `Configuration<FolderExport>` is not assignable to the
   * `Configuration<DialogV2.Any>` the base demands.
   */
  interface Configuration extends DialogV2.Configuration {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions = DeepPartial<Configuration> & object;

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
