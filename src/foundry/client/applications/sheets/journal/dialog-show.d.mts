import type DialogV2 from "../../api/dialog.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type { Identity } from "#utils";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      ShowToPlayersDialog: ShowToPlayersDialog.Any;
    }
  }
}

/**
 * A dialog for configuring options when showing content to players.
 * @remarks TODO: Stub
 */
declare class ShowToPlayersDialog<
  RenderContext extends ShowToPlayersDialog.RenderContext = ShowToPlayersDialog.RenderContext,
  Configuration extends ShowToPlayersDialog.Configuration = ShowToPlayersDialog.Configuration,
  RenderOptions extends ShowToPlayersDialog.RenderOptions = ShowToPlayersDialog.RenderOptions,
> extends HandlebarsApplicationMixin(DialogV2)<RenderContext, Configuration, RenderOptions> {}

declare namespace ShowToPlayersDialog {
  interface Any extends AnyShowToPlayersDialog {}
  interface AnyConstructor extends Identity<typeof AnyShowToPlayersDialog> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, DialogV2.RenderContext {}

  interface Configuration extends HandlebarsApplicationMixin.Configuration, DialogV2.Configuration {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DialogV2.RenderOptions {}
}

declare abstract class AnyShowToPlayersDialog extends ShowToPlayersDialog<
  ShowToPlayersDialog.RenderContext,
  ShowToPlayersDialog.Configuration,
  ShowToPlayersDialog.RenderOptions
> {
  constructor(...args: never);
}

export default ShowToPlayersDialog;
