import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type { Game } from "#client/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      InvitationLinks: InvitationLinks.Any;
    }
  }
}

/**
 * An application for managing the connection addresses through which the world can be accessed, and inviting
 * other players to join.
 */
declare class InvitationLinks<
  RenderContext extends InvitationLinks.RenderContext = InvitationLinks.RenderContext,
  Configuration extends InvitationLinks.Configuration = InvitationLinks.Configuration,
  RenderOptions extends InvitationLinks.RenderOptions = InvitationLinks.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   id: "invitation-links",
   *   position: {
   *     width: 420
   *   },
   *   window: {
   *     contentClasses: ["standard-form"],
   *     icon: "fa-solid fa-wifi",
   *     title: "INVITATIONS.Title"
   *   },
   *   actions: {
   *     copyLink: InvitationLinks.#onCopyLink,
   *     recheckInternet: InvitationLinks.#onRecheckInternet,
   *     showLink: InvitationLinks.#onShowLink,
   *     hideLink: InvitationLinks.#onHideLink
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: InvitationLinks.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * @remarks Foundry's override of `_prepareContext` does not call `super`. Therefore it does not
   * inherit context from its parent class.
   */
  protected override _prepareContext(options: DeepPartial<RenderOptions>): Promise<RenderContext>;

  static #InvitationLinks: true;
}

declare namespace InvitationLinks {
  interface Any extends AnyInvitationLinks {}
  interface AnyConstructor extends Identity<typeof AnyInvitationLinks> {}

  /**
   * @remarks Foundry's override of `_prepareContext` does not call `super`. Therefore it does not
   * inherit context from its parent class. `remoteClass`, `remoteTitle`, `failedCheck`, `canConnect`, and
   * `rootId` are set by `_prepareContext` itself, mutating (and, for `rootId`, spreading) `game.data.addresses`.
   */
  interface RenderContext extends Identity<Game.Data["addresses"]> {
    remoteClass?: string | undefined;
    remoteTitle?: string | undefined;
    failedCheck?: boolean | undefined;
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
