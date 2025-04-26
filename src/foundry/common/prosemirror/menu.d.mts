import type { Attrs, MarkType, NodeType, Schema } from "prosemirror-model";
import type { Plugin } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";
import type { ProseMirrorCommand } from "./keymaps.d.mts";
import type ProseMirrorPlugin from "./plugin.d.mts";

export declare namespace ProseMirrorMenu {
  export interface ProseMirrorMenuOptions {
    /** A function to call when the save button is pressed. */
    onSave?: () => void;
    /** Whether this editor instance is intended to be destroyed when saved. */
    destroyOnSave?: boolean;
    /** Whether to display a more compact version of the menu. */
    compact?: boolean;
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
    attrs?: Attrs; // object
    /** A numeric priority which determines whether this item is displayed as the dropdown title. Lower priority takes precedence. */
    priority?: number;
    /** The command to run when the menu item is clicked. */
    cmd?: ProseMirrorCommand;
    /** Whether the current item is active under the given selection or cursor. (default: `false`) */
    active?: boolean;
  }
}

// It's here, as defined, but it should probably be put in dropdown.d.ts
export declare namespace ProseMirrorDropDown {
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

export default ProseMirrorMenu;
/**
 * A class responsible for building a menu for a ProseMirror instance.
 */
declare class ProseMirrorMenu extends ProseMirrorPlugin {
  /**
   * @param schema  - The ProseMirror schema to build a menu for.
   * @param view    - The editor view.
   * @param options - Additional options to configure the plugin's behaviour.
   */
  constructor(schema: Schema, view: EditorView, options?: ProseMirrorMenu.ProseMirrorMenuOptions);

  // placeholder private attribute to support subclassing.
  #proseMirrorMenu: true;

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
   * An enumeration of editor scopes in which a menu item can appear
   */
  protected static _MENU_ITEM_SCOPES: {
    BOTH: "";
    TEXT: "text";
    HTML: "html";
  };

  /**
   * Additional options to configure the plugin's behaviour.
   */
  options: ProseMirrorMenu.ProseMirrorMenuOptions;

  /**
   * The dropdowns configured for this menu.
   */
  dropdowns: ProseMirrorDropDown.Entry[];

  static override build(schema: Schema, options?: ProseMirrorMenu.ProseMirrorMenuOptions): Plugin;

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
   * @param item - The menu item representing a {@link MarkType | `MarkType`}.
   * @returns Whether the cursor or selection is in a state represented by the given mark.
   */
  protected _isMarkActive(item: ProseMirrorMenu.Item): boolean;

  /**
   * Determine whether the given menu item representing a node is active or not.
   * @param item - The menu item representing a {@link NodeType | `NodeType`}.
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
  protected _handleSave(): void;

  /**
   * Global listeners for the drop-down menu.
   */
  static eventListeners(): void;

  /**
   * Display the insert image prompt.
   */
  protected _insertImagePrompt(): Promise<void>;

  /**
   * Display the insert link prompt.
   */
  protected _insertLinkPrompt(): Promise<void>;

  /**
   * Display the insert table prompt.
   */
  protected _insertTablePrompt(): Promise<void>;

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
    },
  ): Promise<HTMLDialogElement>;

  /**
   * Clear any marks from the current selection.
   */
  protected _clearFormatting(): void;

  /**
   * Toggle link recommendations
   */
  protected _toggleMatches(): Promise<void>;

  /**
   * Toggle the given selection by wrapping it in a given block or lifting it out of one.
   * @param node    - The type of node being interacted with.
   * @param wrap    - The wrap command specific to the given node.
   * @param options - Additional options to configure behaviour.
   */
  protected _toggleBlock(
    node: NodeType,
    wrap: MenuToggleBlockWrapCommand,
    options?: { /** Attributes for the node. */ attrs?: object },
  ): void;

  /**
   * Toggle the given selection by wrapping it in a given text block, or reverting to a paragraph block.
   * @param node    - The type of node being interacted with.
   * @param options - Additional options to configure behaviour.
   */
  protected _toggleTextBlock(node: NodeType, options?: { /** Attributes for the node. */ attrs?: object }): void;
}
