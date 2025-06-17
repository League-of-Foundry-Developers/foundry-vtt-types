/**
 * A singleton helper class to manage requesting clipboard permissions.
 * Provides common functionality for working with the clipboard.
 * @see {@linkcode foundry.Game.clipboard | Game#clipboard}
 */
declare class ClipboardHelper {
  /**
   * @remarks
   * @throws `"You may not re-initialize the singleton ClipboardHelper. Use game.clipboard instead."`
   */
  constructor();

  /**
   * Copies plain text to the clipboard in a cross-browser compatible way.
   * @param text - The text to copy.
   */
  copyPlainText(text: string): Promise<void>;
}

export default ClipboardHelper;
