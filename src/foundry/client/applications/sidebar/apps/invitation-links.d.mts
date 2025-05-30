import type { Identity } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      InvitationLinks: InvitationLinks.Any;
    }
  }
}

/**
 * @remarks TODO: Stub
 */
declare class InvitationLinks<
  RenderContext extends InvitationLinks.RenderContext = InvitationLinks.RenderContext,
  Configuration extends InvitationLinks.Configuration = InvitationLinks.Configuration,
  RenderOptions extends InvitationLinks.RenderOptions = InvitationLinks.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {}

declare namespace InvitationLinks {
  interface Any extends AnyInvitationLinks {}
  interface AnyConstructor extends Identity<typeof AnyInvitationLinks> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext {}
  interface Configuration extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration {}
  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}
}

declare abstract class AnyInvitationLinks extends InvitationLinks<
  InvitationLinks.RenderContext,
  InvitationLinks.Configuration,
  InvitationLinks.RenderOptions
> {
  constructor(...args: never);
}

export default InvitationLinks;
