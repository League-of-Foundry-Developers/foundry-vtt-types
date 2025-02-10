import type DialogV2 from "../../api/dialog.d.mts";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";

/**
 * A dialog for configuring options when showing content to players.
 * @remarks TODO: Stub
 */
declare class ShowToPlayersDialog<
  RenderContext extends ShowToPlayersDialog.RenderContext = ShowToPlayersDialog.RenderContext,
  Configuration extends DialogV2.Configuration = DialogV2.Configuration,
  RenderOptions extends ApplicationV2.RenderOptions = ApplicationV2.RenderOptions,
> extends HandlebarsApplicationMixin(DialogV2)<RenderContext, Configuration, RenderOptions> {}

declare namespace ShowToPlayersDialog {
  interface RenderContext extends ApplicationV2.RenderContext {}
}

export default ShowToPlayersDialog;
