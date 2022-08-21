import type { Plugin } from "prosemirror-state";
import type ProseMirrorPlugin from "./plugin.mjs";
import type ProseMirrorDropDown from "./dropdown.mjs";
import type { Attrs, MarkType, NodeType, Schema } from "prosemirror-model";
import type { EditorView } from "prosemirror-view";
import type { ProseMirrorCommand } from "./keymaps.mjs";

export namespace ProseMirrorMenu {
  export interface Options {
    /** The parent sheet that's housing the ProseMirror instance. */
    sheet?: FormApplication;
  }

  export interface Item {
    /** A string identifier for this menu item. */
    action: string;
    /** The description of the menu item. */
    title: string;
    /** An optional class to apply to the menu item. */
    class?: string;
    /** An optional style to apply to the title text. */
    style?: string;
    /** The menu item's icon HTML. */
    icon?: string;
    /** The mark to apply to the selected text. */
    mark?: MarkType;
    /** The node to wrap the selected text in. */
    node?: NodeType;
    /** An object of attributes for the node or mark. */
    attrs?: Attrs; //object
    /** A numeric priority which determines whether this item is displayed as the dropdown title. Lower priority takes precedence. */
    priority?: number;
    /** The command to run when the menu item is clicked. */
    cmd?: ProseMirrorCommand;
    /** Whether the current item is active under the given selection or cursor. (default: `false`) */
    active?: boolean;
  }
}
// It's here, as defined, but it should probably be put in dropdown.d.ts
export namespace ProseMirrorDropDown {
  export interface Entry extends ProseMirrorMenu.Item {
    /** Any child entries. */
    children?: Entry[];
  }

  export interface Config {
    /** The default title of the drop-down. */
    title: string;
    /** The menu CSS class. */
    cssClass: string;
    /** The drop-down entries. */
    entries: Entry[];
  }
}
/**
 * @param node  - The node to wrap the selection in.
 * @param attrs - Attributes for the node.
 */
export type MenuToggleBlockWrapCommand = (node: NodeType, attrs?: Attrs) => ProseMirrorCommand;

/**
 * A class responsible for building a menu for a ProseMirror instance.
 */
export default class ProseMirrorMenu extends ProseMirrorPlugin {
  /**
   * @param schema  - The ProseMirror schema to build a menu for.
   * @param view    - The editor view.
   * @param options - Additional options to configure the plugin's behaviour.
   */
  constructor(schema: Schema, view: EditorView, options?: ProseMirrorMenu.Options);

  /**
   * The editor view.
   */
  view: EditorView;

  /**
   * The items configured for this menu.
   */
  items: ProseMirrorMenu.Item[];

  /**
   * The ID of the menu element in the DOM.
   */
  readonly id: `prosemirror-menu-${string}`;

  /**
   * Additional options to configure the plugin's behaviour.
   */
  options: ProseMirrorMenu.Options;

  /**
   * The dropdowns configured for this menu.
   */
  dropdowns: ProseMirrorDropDown[];

  /** {@inheritdoc} */
  static build(schema: Schema, options?: ProseMirrorMenu.Options): Plugin;

  /**
   * Render the menu's HTML.
   */
  render(): this;

  /**
   * Attach event listeners.
   * @param html - The root menu element.
   */
  activateListeners(html: HTMLMenuElement): void;

  /**
   * Called whenever the view's state is updated.
   * @param view      - The current editor state.
   * @param prevState - The previous editor state.
   */
  update(view: EditorView, prevState: EditorView): void;

  /**
   * Called when the view is destroyed or receives a state with different plugins.
   */
  destroy(): void;

  /**
   * Instantiate the ProseMirrorDropDown instances and configure them with the defined menu items.
   */
  protected _createDropDowns(): void;

  /**
   * Configure dropdowns for this menu. Each entry in the top-level array corresponds to a separate drop-down.
   */
  protected _getDropDownMenus(): Record<string, ProseMirrorDropDown.Config>;

  /**
   * Configure the items for this menu.
   */
  protected _getMenuItems(): ProseMirrorMenu.Item[];

  /**
   * Determine whether the given menu item is currently active or not.
   * @param item - The menu item.
   * @returns Whether the cursor or selection is in a state represented by the given menu item.
   */
  protected _isItemActive(item: ProseMirrorMenu.Item): boolean;

  /**
   * Determine whether the given menu item representing a mark is active or not.
   * @param item - The menu item representing a {@link MarkType}.
   * @returns Whether the cursor or selection is in a state represented by the given mark.
   */
  protected _isMarkActive(item: ProseMirrorMenu.Item): boolean;

  /**
   * Determine whether the given menu item representing a node is active or not.
   * @param item - The menu item representing a {@link NodeType}.
   * @returns Whether the cursor or selection is currently within a block of this menu item's node type.
   */
  protected _isNodeActive(item: ProseMirrorMenu.Item): boolean;

  /**
   * Handle a button press.
   * @param event - The click event.
   */
  protected _onAction(event: MouseEvent): void;

  /**
   * Wrap the editor view element and inject our template ready to be rendered into.
   */
  protected _wrapEditor(): void;

  /**
   * Handle requests to save the editor contents
   */
  protected _handleSave(): ReturnType<FormApplication["_onSubmit"]>;

  /**
   * Display the insert image prompt.
   */
  protected _insertImagePrompt(): Promise<void>;

  /**
   * Display the insert link prompt.
   */
  protected _insertLinkPrompt(): Promise<void>;

  /**
   * Create a dialog for a menu button.
   * @param action   - The unique menu button action.
   * @param template - The dialog's template.
   * @param options  - Additional options to configure the dialog's behaviour.
   */
  protected _showDialog(
    action: string,
    template: string,
    options?: {
      /** Data to pass to the template. (default: `{}`) */
      data: Record<string, unknown>;
    }
  ): Promise<HTMLDialogElement>;

  /**
   * Clear any marks from the current selection.
   */
  protected _clearFormatting(): void;
}
