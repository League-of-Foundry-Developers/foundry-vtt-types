import type { GetDataReturnType, MaybePromise } from "fvtt-types/utils";
import type Document from "../../../common/abstract/document.d.mts";

declare global {
  /**
   * The Application responsible for displaying and editing a single Actor document.
   * This Application is responsible for rendering an actor's attributes and allowing the actor to be edited.
   * @param actor   - The Actor instance being displayed within the sheet.
   * @param options - Additional application configuration options.
   *
   * @typeParam Options - the type of the options object
   */
  class ActorSheet<Options extends ActorSheet.Options = ActorSheet.Options> extends DocumentSheet<
    Options,
    Actor.ConfiguredInstance
  > {
    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   height: 720,
     *   width: 800,
     *   template: "templates/sheets/actor-sheet.html",
     *   closeOnSubmit: false,
     *   submitOnClose: true,
     *   submitOnChange: true,
     *   resizable: true,
     *   baseApplication: "ActorSheet",
     *   dragDrop: [{ dragSelector: ".item-list .item", dropSelector: null }],
     *   token: null,
     * });
     * ```
     */
    static get defaultOptions(): ActorSheet.Options;

    override get title(): string;

    /**
     * A convenience reference to the Actor document
     */
    get actor(): this["object"];

    /**
     * If this Actor Sheet represents a synthetic Token actor, reference the active Token
     */
    get token(): Exclude<this["object"]["token"] | this["options"]["token"], undefined> | null;

    override close(options?: FormApplication.CloseOptions): Promise<void>;

    override getData(options?: Partial<Options>): MaybePromise<GetDataReturnType<ActorSheet.ActorSheetData>>;

    protected override _getHeaderButtons(): Application.HeaderButton[];

    protected override _getSubmitData(updateData?: object | null): Partial<Record<string, unknown>>;

    /**
     * Handle requests to configure the Token for the Actor
     */
    protected _onConfigureToken(event: JQuery.ClickEvent): void;

    protected override _canDragStart(selector: string): boolean;

    protected override _canDragDrop(selector: string): boolean;

    protected override _onDragStart(event: DragEvent): void;

    protected override _onDrop(event: DragEvent): void;

    /**
     * Handle the dropping of ActiveEffect data onto an Actor Sheet
     * @param event - The concluding DragEvent which contains drop data
     * @param data  - The data transfer extracted from the event
     * @returns A data object which describes the result of the drop
     * @remarks This is intentionally typed to return `Promise<unknown>` to
     * allow overriding methods to return whatever they want. The return type is
     * not meant to be used aside from being awaited.
     */
    protected _onDropActiveEffect(event: DragEvent, data: ActorSheet.DropData.ActiveEffect): Promise<unknown>;

    /**
     * Handle dropping of an item reference or item data onto an Actor Sheet
     * @param event - The concluding DragEvent which contains drop data
     * @param data  - The data transfer extracted from the event
     * @returns A data object which describes the result of the drop
     * @remarks This is intentionally typed to return `Promise<unknown>` to
     * allow overriding methods to return whatever they want. The return type is
     * not meant to be used aside from being awaited.
     */
    protected _onDropActor(event: DragEvent, data: ActorSheet.DropData.Actor): Promise<unknown>;

    /**
     * Handle dropping of an item reference or item data onto an Actor Sheet
     * @param event - The concluding DragEvent which contains drop data
     * @param data  - The data transfer extracted from the event
     * @remarks This is intentionally typed to return `Promise<unknown>` to
     * allow overriding methods to return whatever they want. The return type is
     * not meant to be used aside from being awaited.
     */
    protected _onDropItem(event: DragEvent, data: ActorSheet.DropData.Item): Promise<unknown>;

    /**
     * Handle dropping of a Folder on an Actor Sheet.
     * Currently supports dropping a Folder of Items to create all items as owned items.
     * @param event - The concluding DragEvent which contains drop data
     * @param data  - The data transfer extracted from the event
     * @remarks This is intentionally typed to return `Promise<unknown>` to
     * allow overriding methods to return whatever they want. The return type is
     * not meant to be used aside from being awaited.
     */
    protected _onDropFolder(event: DragEvent, data: ActorSheet.DropData.Folder): Promise<unknown>;

    /**
     * Handle the final creation of dropped Item data on the Actor.
     * This method is factored out to allow downstream classes the opportunity to override item creation behavior.
     * @param itemData - The item data requested for creation
     */
    protected _onDropItemCreate(itemData: Item["_source"][] | Item["_source"]): Promise<Item.ConfiguredInstance[]>;

    /**
     * Handle a drop event for an existing embedded Item to sort that Item relative to its siblings
     */
    protected _onSortItem(event: DragEvent, itemData: Item["_source"]): undefined | Promise<Item.ConfiguredInstance[]>;

    /**
     * Is the drop data coming from the same actor?
     * @param data - The drop data.
     * @internal
     */
    protected _isFromSameActor(data: ActorSheet.DropData.Item): Promise<boolean>;
  }

  namespace ActorSheet {
    type Any = ActorSheet<any>;

    type DropData =
      | DropData.ActiveEffect
      | DropData.Actor
      | DropData.Item
      | DropData.Folder
      | (Partial<Record<string, unknown>> & { type: string });

    namespace DropData {
      interface ActiveEffect {
        type: "ActiveEffect";
        tokenId?: string;
        actorId?: string;
        data: foundry.documents.BaseActiveEffect["_source"];
      }

      interface Actor {
        type: "Actor";
      }

      type Item = Document.DropData<Item.ConfiguredInstance> & {
        type: "Item";
      };

      interface Folder {
        type: "Folder";
        documentName: foundry.CONST.FOLDER_DOCUMENT_TYPES;
        id: string;
      }
    }

    interface Options extends DocumentSheetOptions<Actor.ConfiguredInstance> {
      token?: TokenDocument.ConfiguredInstance | null;
    }

    interface ActorSheetData<Options extends ActorSheet.Options = ActorSheet.Options>
      extends DocumentSheet.DocumentSheetData<Options, Actor.ConfiguredInstance> {
      actor: ActorSheet["actor"];
      items: this["data"]["items"];
      effects: this["data"]["effects"];
    }
  }
}
