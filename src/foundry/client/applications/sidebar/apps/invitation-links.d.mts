import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      InvitationLinks: InvitationLinks.Any;
    }
  }
}

declare class InvitationLinks<
  RenderContext extends InvitationLinks.RenderContext = InvitationLinks.RenderContext,
  Configuration extends InvitationLinks.Configuration = InvitationLinks.Configuration,
  RenderOptions extends InvitationLinks.RenderOptions = InvitationLinks.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  // Fake override.
  static override DEFAULT_OPTIONS: InvitationLinks.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * @remarks The context is a shallow copy of {@linkcode Game.data | game.data.addresses}, extended with the
   * connectivity members.
   */
  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  static #InvitationLinks: true;
}

declare namespace InvitationLinks {
  interface Any extends AnyInvitationLinks {}
  interface AnyConstructor extends Identity<typeof AnyInvitationLinks> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext {
    /** The local network address of the server. */
    local: string;

    /** The public address of the server, absent when the server could not determine one. */
    remote?: string | undefined;

    /** Whether the public address responded, or `null` while the check is outstanding. */
    remoteIsAccessible: boolean | null;

    /** A CSS class describing the connection state. */
    remoteClass: string;

    /** A localized tooltip describing the connection state. */
    remoteTitle: string;

    /** Set when the connectivity check has not resolved. */
    failedCheck?: boolean | undefined;

    /** Whether the public address is reachable. Absent while the check is outstanding. */
    canConnect?: boolean | undefined;

    rootId?: string | undefined;
  }

  interface Configuration<InvitationLinks extends InvitationLinks.Any = InvitationLinks.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<InvitationLinks> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<InvitationLinks extends InvitationLinks.Any = InvitationLinks.Any> = DeepPartial<
    Configuration<InvitationLinks>
  > &
    object;

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
