/**
 * Game Invitation Links Reference
 */

declare class InvitationLinks extends Application {
  /**
   * @defaultValue
   * ```typescript
   * {
   *   ...super.defaultOptions,
   *   id: 'invitation-links',
   *   template: 'templates/sidebar/apps/invitation-links.html',
   *   title: game.i18n.localize("INVITATIONS.Title"),
   *   width: 400,
   * }
   * ```
   */
  static get defaultOptions(): typeof Application['defaultOptions'];

  /** @override */
  getData(): { local?: string; remote?: string };

  /** @override */
  activateListeners(html: JQuery): void;
}
