export {};

declare global {
  /**
   * Game Invitation Links Reference
   *
   * @typeParam Options - the type of the options object
   */
  class InvitationLinks<Options extends ApplicationOptions = ApplicationOptions> extends Application<Options> {
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

    // TODO: Implement GetDataReturnType
    override getData(options?: Partial<Options>): Promise<object>;

    override activateListeners(html: JQuery): void;
  }

  namespace InvitationLinks {
    interface Any extends InvitationLinks<any> {}
  }
}
