interface DialogData {
  buttons?: Record<string, DialogButton>
  close?: (html: HTMLElement | JQuery) => void
  content?: string | HTMLElement
  default?: string
  title?: string
}

interface DialogButton {
  callback?: (html: HTMLElement | JQuery) => void
  icon?: string
  label?: string
}

interface ConfirmDialog {
  content: string
  defaultYes?: boolean
  no: Function
  title: string
  yes: Function
}

/**
 * Create a modal dialog window displaying a title, a message, and a set of buttons which trigger callback functions.
 *
 * @param dialogData - An object of dialog data which configures how the modal window is rendered
 * @param title - The window title
 * @param content - HTML content
 * @param close - Common callback operations to perform when the dialog is closed
 * @param buttons - Action buttons which trigger callback functions.
 *                             Buttons are defined as an Object with the format `{name: buttonData}`.
 *                             Valid keys for buttonData include:
 *
 * @param icon - A button icon
 * @param label - A button label
 * @param callback - A callback function taking no arguments
 *
 * @param options - Dialog rendering options, see :class:`Application`
 * @param default - The name of the default button which should be triggered on Enter
 *
 * @example
 * ```javascript
 * let d = new Dialog({
 *  title: "Test Dialog",
 *  content: "<p>You must choose either Option 1, or Option 2</p>",
 *  buttons: {
 *   one: {
 *    icon: '<i class="fas fa-check"></i>',
 *    label: "Option One",
 *    callback: () => console.log("Chose One")
 *   },
 *   two: {
 *    icon: '<i class="fas fa-times"></i>',
 *    label: "Option Two",
 *    callback: () => console.log("Chose Two")
 *   }
 *  },
 *  default: "two",
 *  close: () => console.log("This always is logged no matter which option is chosen")
 * });
 * d.render(true);
 * ```
 */
declare class Dialog extends Application {
  constructor (dialogData: DialogData, options?: Application.Options);

  /**
   * A helper function to reduce code duplication when creating confirmation dialog windows.
   * These windows are limited in flexibility, for simple yes/no prompts.
   * If you require more flexibility, a custom Dialog instance is preferred.
   * @param title - The confirmation window title
   * @param content - The confirmation message
   * @param yes - Callback function upon yes
   * @param no - Callback function upon no
   * @param defaultYes -
   */
  static confirm (
    kwargs?: ConfirmDialog,
    options?: Application.Options
  ): Promise<void>;
}
