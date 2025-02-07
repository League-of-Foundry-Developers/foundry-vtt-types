import type { MaybePromise } from "fvtt-types/utils";

declare global {
  /**
   * Allows for viewing and editing of Keybinding Actions
   */
  class KeybindingsConfig<
    Options extends PackageConfiguration.Options = PackageConfiguration.Options,
  > extends PackageConfiguration<Options> {
    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   title: game.i18n.localize("SETTINGS.Keybindings"),
     *   id: "keybindings",
     *   categoryTemplate: "templates/sidebar/apps/keybindings-config-category.html",
     *   scrollY: [".scrollable"]
     * });
     * ```
     */
    static override get defaultOptions(): PackageConfiguration.Options;

    /**
     * @returns ["all", "core", "core-mouse", "system", "module", "unmapped"]
     */
    static override get categoryOrder(): string[];

    protected override _categorizeEntry(namespace: string): PackageConfiguration.Category;

    protected override _prepareCategoryData(): PackageConfiguration.CategoryData;

    /**
     * Add faux-keybind actions that represent the possible Mouse Controls
     * @param categories - The current Map of Categories to add to
     * @returns The number of Actions added
     * @internal
     */
    protected _addMouseControlsReference(categories: Map<string, KeybindingsConfig.Category>): number;

    /**
     * Given an Binding and its parent Action, detects other Actions that might conflict with that binding
     * @param actionId - The namespaced Action ID the Binding belongs to
     * @param action   - The Action config
     * @param binding  - The Binding
     * @internal
     */
    protected _detectConflictingActions(
      actionId: string,
      action: ClientKeybindings.KeybindingActionConfig,
      binding: ClientKeybindings.KeybindingActionBinding,
    ): ClientKeybindings.KeybindingAction[];

    /**
     * Transforms a Binding into a human readable string representation
     * @param binding - The Binding
     * @returns A human readable string
     * @internal
     */
    protected static _humanizeBinding(binding: ClientKeybindings.KeybindingActionBinding): string;

    override activateListeners(html: JQuery): void;

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    protected override _onResetDefaults(event: JQuery.ClickEvent): Promise<void>;

    /**
     * Handle Control clicks
     * @internal
     */
    protected _onClickBindingControl(event: MouseEvent): MaybePromise<void>;

    /**
     * Handle left-click events to show / hide a certain category
     * @internal
     */
    protected _onClickAdd(event: MouseEvent): Promise<void>;

    /**
     * Handle left-click events to show / hide a certain category
     * @internal
     */
    protected _onClickDelete(event: MouseEvent): Promise<void>;

    /**
     * Inserts a Binding into the Pending Edits object, creating a new Map entry as needed
     * @internal
     */
    protected _addPendingEdit(
      namespace: string,
      action: string,
      bindingIndex: number,
      binding: KeybindingsConfig.PendingBinding,
    ): void;

    /**
     * Toggle visibility of the Edit / Save UI
     * @internal
     */
    protected _onClickEditableBinding(event: MouseEvent): void;

    /**
     * Toggle visibility of the Edit UI
     * @internal
     */
    protected _onDoubleClickKey(event: MouseEvent): void;

    /**
     * Save the new Binding value and update the display of the UI
     * @internal
     */
    protected _onClickSaveBinding(event: MouseEvent): Promise<void>;

    /**
     * Given a clicked Action element, finds the parent Action
     * @internal
     */
    protected _getParentAction(event: KeyboardEvent | MouseEvent): {
      actionId: string;
      actionHtml: HTMLElement;
      namespace: string;
      action: string;
    };

    /**
     * Given a Clicked binding control element, finds the parent Binding
     * @internal
     */
    protected _getParentBinding(event: KeyboardEvent | MouseEvent): { bindingHtml: HTMLElement; bindingId: string };

    /**
     * Iterates over all Pending edits, merging them in with unedited Bindings and then saving and resetting the UI
     * @internal
     */
    protected _savePendingEdits(): Promise<void>;

    /**
     * Processes input from the keyboard to form a list of pending Binding edits
     * @param event - The keyboard event
     * @internal
     */
    protected _onKeydownBindingInput(event: KeyboardEvent): void;

    /** @remarks KeybindingsConfig does not implement this method. */
    protected _updateObject(event?: unknown, formData?: unknown): Promise<never>;
  }

  namespace KeybindingsConfig {
    type Any = KeybindingsConfig<any>;

    interface Category extends PackageConfiguration.Category {
      actions: ActionData[];
      count: number;
    }

    interface CategoryData extends PackageConfiguration.CategoryData<Category> {}

    interface ActionData extends ClientKeybindings.KeybindingActionConfig {
      category: string;
      bindings: DisplayBinding[];
      id: string;
      name: string;
      hint?: string;
      cssClass?: string;
      notes: string;
    }

    interface DisplayBinding extends Partial<ClientKeybindings.KeybindingActionBinding> {
      id: string;
      display: string;
      cssClasses: string;
      isEditable: boolean;
      isFirst: boolean;
      conflicts: string;
      hasConflicts: boolean;
    }

    interface PendingBinding extends ClientKeybindings.KeybindingActionBinding {
      index: number;
    }
  }
}
