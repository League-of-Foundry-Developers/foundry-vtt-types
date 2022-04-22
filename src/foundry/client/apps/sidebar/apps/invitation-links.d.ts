/**
 * Game Invitation Links Reference
 *
 * @typeParam Options - the type of the options object
 * @typeParam Data    - The data structure used to render the handlebars template.
 */
declare class InvitationLinks<
  Options extends ApplicationOptions = ApplicationOptions,
  Data extends object = InvitationLinks.Data
> extends Application<Options> {
  /**
   * @defaultValue
   * ```typescript
   * foundry.utils.mergeObject(super.defaultOptions, {
   *   id: "invitation-links",
   *   template: "templates/sidebar/apps/invitation-links.html",
   *   title: game.i18n.localize("INVITATIONS.Title"),
   *   width: 400
   * })
   * ```
   */
  static override get defaultOptions(): ApplicationOptions;

  override getData(options?: Partial<Options> | undefined): Promise<Data>;

  override activateListeners(html: JQuery): void;
}

declare namespace InvitationLinks {
  type Adddresses = Game.Data['addresses'];
  interface Data extends Adddresses {
    remoteClass?: string;
    remoteTitle?: string;
    failedCheck?: boolean;
    canConnect?: boolean;
  }
}
