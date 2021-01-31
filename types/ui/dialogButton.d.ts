declare class DialogButton<T = unknown> {
  /**
   * A Font Awesome icon for the button
   */
  icon: string;

  /**
   * The label for the button
   */
  label: string;

  /**
   * A callback function that fires when the button is clicked
   */
  callback?: (html: JQuery | HTMLElement) => T;
}
