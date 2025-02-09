import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";

/**
 * @remarks TODO: Stub
 */
declare class InvitationLinks<
  RenderContext extends InvitationLinks.RenderContext = InvitationLinks.RenderContext,
  Configuration extends ApplicationV2.Configuration = ApplicationV2.Configuration,
  RenderOptions extends ApplicationV2.RenderOptions = ApplicationV2.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {}

declare namespace InvitationLinks {
  interface RenderContext extends ApplicationV2.RenderContext {}
}

export default InvitationLinks;
